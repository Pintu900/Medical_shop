<template>
  <div class="bar" role="navigation" aria-label="Quick contact">
    <a class="bar__btn bar__btn--call" :href="`tel:${phoneClean}`">Call</a>
    <RouterLink class="bar__btn bar__btn--contact" to="/contact">Contact</RouterLink>
  </div>
</template>

<script>
export default {
  name: "MobileCallBar",
  props: {
    phone: {
      type: String,
      default: "+91 8876499294",
    },
  },
  computed: {
    phoneClean() {
      return this.phone.replace(/\s/g, "");
    },
  },
};
</script>

<style scoped>
.bar {
  display: none;
}

@media (max-width: 768px) {
  .bar {
    display: flex;
    gap: 0.75rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-bottom, 0));
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--color-border);
    box-shadow: 0 -4px 24px rgba(15, 23, 42, 0.06);
  }

  .bar__btn {
    flex: 1;
    text-align: center;
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    font-family: inherit;
    border-radius: var(--radius);
    text-decoration: none;
    border: none;
    cursor: pointer;
  }

  .bar__btn--call {
    background: var(--color-accent);
    color: #fff;
  }

  .bar__btn--contact {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }
}
</style>
