<template>
  <div class="star-rating">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{ filled: star <= rating }"
    >
      ★
    </span>
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 5
    }
  }
};
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 2px;
  align-items: center;
}

.star {
  font-size: 1.2em;
  color: white;
  -webkit-text-stroke: 1px #000;
  text-stroke: 1px #000;
  line-height: 1;
}

.star.filled {
  color: #ffc107;
  -webkit-text-stroke: 1px #000;
  text-stroke: 1px #000;
}
</style>

