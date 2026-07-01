<template>
  <button
    type="button"
    class="back-to-top"
    :class="{ 'is-visible': visible }"
    aria-label="Back to top"
    @click="scrollTop"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 19V5M5 12l7-7 7 7"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: "BackToTop",
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      this.visible = window.scrollY > 480;
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 1.25rem;
  bottom: 5.5rem;
  z-index: 950;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--color-green);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(22, 101, 52, 0.35);
  opacity: 0;
  transform: translateY(12px) scale(0.9);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s ease;
}

.back-to-top.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.back-to-top:hover {
  background: var(--color-green-dark);
  transform: translateY(-3px) scale(1.05);
}

@media (min-width: 769px) {
  .back-to-top {
    bottom: 2rem;
  }
}
</style>
