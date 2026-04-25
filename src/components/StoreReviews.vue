<template>
  <section id="reviews" class="reviews">
    <div class="container">
      <header class="reviews__head">
        <h2 class="reviews__title">Customer reviews</h2>
        <p class="reviews__sub">Recent feedback from Google and other sources.</p>
      </header>
      <div class="reviews__embed">
        <div
          class="elfsight-app-cb2f67e2-5d10-45ba-bd1d-a9be750a8ae3"
          data-elfsight-app-lazy
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "StoreReviews",
  mounted() {
    if (document.querySelector('script[src*="elfsight.com/platform"]')) return;
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);
  },
};
</script>

<style scoped>
.reviews {
  padding: var(--space-section) 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.reviews__head {
  margin-bottom: 1.5rem;
}

.reviews__title {
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--color-text);
}

.reviews__sub {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-muted);
}

.reviews__embed {
  min-height: 120px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}
</style>
