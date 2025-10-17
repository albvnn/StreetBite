<template>
  <div class="container">
    <div class="restaurants">
      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1605478571929-b5b69d43eaa2"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Tokyo Street</h2>
        <p class="restaurant-description">
          Des sushis préparés à la minute et des ramen au bouillon riche, servis dans une ambiance japonaise authentique.
        </p>
        <div class="restaurant-rating">⭐ 4.9 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1592861956120-e524fc739696"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">El Taco Loco</h2>
        <p class="restaurant-description">
          Tacos, quesadillas et nachos faits maison ! Le spot parfait pour découvrir les saveurs mexicaines de la street food.
        </p>
        <div class="restaurant-rating">⭐ 4.6 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1564758866815-ccd1f9f1a5d2"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Burger District</h2>
        <p class="restaurant-description">
          Burgers artisanaux, frites croustillantes et sauces maison. Un classique revisité pour les vrais gourmands.
        </p>
        <div class="restaurant-rating">⭐ 4.4 / 5</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
}

.restaurants {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.restaurant-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.restaurant-name {
  margin-top: 15px;
  font-size: 1.4em;
  color: #333;
}

.restaurant-description {
  margin: 10px 0;
  color: #666;
  font-size: 0.95em;
}

.restaurant-rating {
  font-weight: bold;
  color: #ff9800;
  font-size: 1.1em;
}
</style>
<template>
  <div class="container">
    <div class="restaurants">
      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1605478571929-b5b69d43eaa2"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Tokyo Street</h2>
        <p class="restaurant-description">
          Des sushis préparés à la minute et des ramen au bouillon riche, servis dans une ambiance japonaise authentique.
        </p>
        <div class="restaurant-rating">⭐ 4.9 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1592861956120-e524fc739696"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">El Taco Loco</h2>
        <p class="restaurant-description">
          Tacos, quesadillas et nachos faits maison ! Le spot parfait pour découvrir les saveurs mexicaines de la street food.
        </p>
        <div class="restaurant-rating">⭐ 4.6 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1564758866815-ccd1f9f1a5d2"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Burger District</h2>
        <p class="restaurant-description">
          Burgers artisanaux, frites croustillantes et sauces maison. Un classique revisité pour les vrais gourmands.
        </p>
        <div class="restaurant-rating">⭐ 4.4 / 5</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
}

.restaurants {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.restaurant-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.restaurant-name {
  margin-top: 15px;
  font-size: 1.4em;
  color: #333;
}

.restaurant-description {
  margin: 10px 0;
  color: #666;
  font-size: 0.95em;
}

.restaurant-rating {
  font-weight: bold;
  color: #ff9800;
  font-size: 1.1em;
}
</style>
