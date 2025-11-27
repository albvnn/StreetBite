export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPrice(price) {
  // Convertir en nombre si c'est une string (MySQL DECIMAL peut être retourné comme string)
  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
  if (isNaN(numPrice)) {
    return '€0.00';
  }
  return `€${numPrice.toFixed(2)}`;
}

