<template>
  <section id="offers" class="promo">
    <div class="container promo__inner">
      <div class="promo__copy">
        <p class="promo__eyebrow">Save More, Live Better!</p>
        <h2 class="promo__title">Exciting Offers On Your Favourite Products</h2>
        <a class="btn btn--white" href="#offers">
          View Offers
          <span aria-hidden="true">→</span>
        </a>
      </div>
      <div class="promo__visual">
        <img
          class="promo__image"
          :src="promoImage"
          alt="Medicine bottles and pharmacy shopping bag"
          @error="onImageError"
        />
        <span class="promo__badge">UP TO<br />20% OFF</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PromoBanner",
  data() {
    return {
      promoImage: "/images/med.png",
    };
  },
  methods: {
    onImageError(e) {
      e.target.src = "/images/med.png";
    },
  },
};
</script>

<style scoped>
.promo {
  padding: var(--space-section) 0;
  background: var(--color-surface);
}

.promo__inner {
  display: grid;
  gap: 2rem;
  align-items: center;
  background: linear-gradient(135deg, #14532d 0%, #166534 55%, #15803d 100%);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  overflow: hidden;
  position: relative;
}

@media (min-width: 860px) {
  .promo__inner {
    grid-template-columns: 1fr 1fr;
    padding: 3rem;
    gap: 3rem;
  }
}

.promo__inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.08), transparent 50%);
  pointer-events: none;
}

.promo__copy {
  position: relative;
  z-index: 1;
  color: #fff;
}

.promo__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
  font-weight: 500;
  opacity: 0.9;
}

.promo__title {
  margin: 0 0 1.5rem;
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 700;
  line-height: 1.25;
  max-width: 18ch;
}

.promo__visual {
  position: relative;
  z-index: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: rgba(255, 255, 255, 0.1);
}

.promo__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.promo__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #fff;
  color: var(--color-green-dark);
  font-size: 0.6875rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>
