export function getRestaurantImage(name) {
  const images = {
    'Tokyo Street': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop',
    'El Taco Loco': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=400&fit=crop',
    'Burger District': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    'Pizza Corner': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop',
    'Asian Fusion Express': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    'Healthy Bites': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop'
  };
  return images[name] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop';
}

export function getRestaurantDescription(name, category) {
  const descriptions = {
    'Tokyo Street': 'Freshly prepared sushi and rich ramen broth, served in an authentic Japanese vibe.',
    'El Taco Loco': 'Homemade tacos, quesadillas, and nachos! The perfect spot to enjoy bold Mexican street food flavors.',
    'Burger District': 'Handcrafted burgers, crispy fries, and house sauces. A classic reimagined for real food lovers.',
    'Pizza Corner': 'Authentic Italian pizzas with fresh ingredients and traditional recipes. Perfect for pizza enthusiasts.',
    'Asian Fusion Express': 'A delightful mix of Asian flavors featuring dishes from Thailand, China, and more.',
    'Healthy Bites': 'Fresh, nutritious, and delicious plant-based meals for a healthy lifestyle.'
  };
  return descriptions[name] || `Delicious ${category} cuisine served with passion and care.`;
}

export function enrichRestaurantData(stand) {
  return {
    ...stand,
    image: getRestaurantImage(stand.name),
    description: getRestaurantDescription(stand.name, stand.category)
  };
}

