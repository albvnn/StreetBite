export function getRestaurantImage(category) {
  const categoryImages = {
    tacos: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b',
    noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
    falafel: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    curry: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    crepe: 'https://images.unsplash.com/photo-1519676867240-f03562e64548',
    kebab: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
    gyro: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783',
    bao: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
    sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
    vegan: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    mexican: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    dessert: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
    soup: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1',
    arepa: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41'
  };
  return categoryImages[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop';
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
    image: getRestaurantImage(stand.category),
    description: getRestaurantDescription(stand.name, stand.category)
  };
}

