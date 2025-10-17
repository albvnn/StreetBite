<template>
  <div class="container">
    <div class="restaurants">
      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Le Soleil Gourmand</h2>
        <p class="restaurant-description">
          Un bistrot moderne proposant des plats faits maison inspirés de la cuisine méditerranéenne.
        </p>
        <div class="restaurant-rating">⭐ 4.5 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Street Délices</h2>
        <p class="restaurant-description">
          Une fusion entre les saveurs asiatiques et la street food parisienne. Une expérience unique !
        </p>
        <div class="restaurant-rating">⭐ 4.8 / 5</div>
      </div>

      <div class="restaurant-card">
        <img
          src="https://images.unsplash.com/photo-1601924638867-3ec2d9c3e7f3"
          alt="Restaurant"
          class="restaurant-image"
        />
        <h2 class="restaurant-name">Casa di Pasta</h2>
        <p class="restaurant-description">
          Spécialités italiennes servies dans une ambiance chaleureuse et conviviale. Les pâtes fraîches sont incontournables !
        </p>
        <div class="restaurant-rating">⭐ 4.7 / 5</div>
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
