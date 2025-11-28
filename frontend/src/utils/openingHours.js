const DAY_TO_INDEX = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6
};

const ALL_DAYS = new Set(Object.values(DAY_TO_INDEX));
const WEEKDAYS = new Set([DAY_TO_INDEX.mon, DAY_TO_INDEX.tue, DAY_TO_INDEX.wed, DAY_TO_INDEX.thu, DAY_TO_INDEX.fri]);
const WEEKENDS = new Set([DAY_TO_INDEX.sun, DAY_TO_INDEX.sat]);

function toMinutes(timeString) {
  if (!timeString) {
    return NaN;
  }
  const [hours, minutes] = timeString.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return NaN;
  }
  return hours * 60 + minutes;
}

function expandDayRange(startDay, endDay) {
  const startIndex = DAY_TO_INDEX[startDay];
  const endIndex = DAY_TO_INDEX[endDay];
  if (startIndex === undefined || endIndex === undefined) {
    return [];
  }
  const result = [startIndex];
  let current = startIndex;
  const safetyLimit = 7; // prevent infinite loops on malformed ranges
  let steps = 0;
  while (current !== endIndex && steps < safetyLimit) {
    current = (current + 1) % 7;
    result.push(current);
    steps += 1;
  }
  return result;
}

function resolveDays(daysPart) {
  if (!daysPart) {
    return new Set(ALL_DAYS);
  }

  const normalized = daysPart.toLowerCase();
  if (normalized.includes('daily') || normalized.includes('every day') || normalized.includes('everyday')) {
    return new Set(ALL_DAYS);
  }
  if (normalized.includes('weekdays')) {
    return new Set(WEEKDAYS);
  }
  if (normalized.includes('weekends')) {
    return new Set(WEEKENDS);
  }

  const tokens = normalized
    .split(/[,/&]+/)
    .map(token => token.trim())
    .filter(Boolean);

  const resolved = new Set();

  tokens.forEach(token => {
    const rangeMatch = token.match(/^(mon|tue|wed|thu|fri|sat|sun)-(mon|tue|wed|thu|fri|sat|sun)$/);
    if (rangeMatch) {
      expandDayRange(rangeMatch[1], rangeMatch[2]).forEach(dayIndex => resolved.add(dayIndex));
      return;
    }
    const singleDayMatch = token.match(/^(mon|tue|wed|thu|fri|sat|sun)$/);
    if (singleDayMatch) {
      resolved.add(DAY_TO_INDEX[singleDayMatch[1]]);
    }
  });

  return resolved.size ? resolved : new Set(ALL_DAYS);
}

export function isStandOpenNow(openingHours, referenceDate = new Date()) {
  if (!openingHours) {
    return false;
  }

  const timeMatch = openingHours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!timeMatch) {
    return false;
  }

  const startMinutes = toMinutes(timeMatch[1]);
  const endMinutes = toMinutes(timeMatch[2]);

  if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
    return false;
  }

  const daysPart = openingHours.slice(0, timeMatch.index).trim();
  const allowedDays = resolveDays(daysPart);

  const now = referenceDate;
  const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes <= endMinutes) {
    return allowedDays.has(currentDay) && currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  const previousDay = (currentDay + 6) % 7;
  const openLateToday = allowedDays.has(currentDay) && currentMinutes >= startMinutes;
  const openPastMidnight = allowedDays.has(previousDay) && currentMinutes < endMinutes;

  return openLateToday || openPastMidnight;
}

