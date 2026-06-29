<template>
  <section class="features">
    <div class="container">
      <ul class="features__grid">
        <li v-for="item in items" :key="item.title" class="features__card">
          <span class="features__icon" v-html="item.icon" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "StoreFeatures",
  data() {
    return {
      items: [
        {
          title: "Home Delivery",
          text: "Order medicines and essentials for convenient delivery in nearby areas.",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 7h11v8H3V7zM14 10h4l3 3v2h-7v-5z" stroke="#166534" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="18" r="2" fill="#166534"/><circle cx="17" cy="18" r="2" fill="#166534"/></svg>',
        },
        {
          title: "Prescription Support",
          text: "Bring your prescription—we confirm availability and guide you on safe usage.",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#166534" stroke-width="1.8"/><path d="M9 8h6M9 12h4" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="17" r="4" fill="#ecfdf5" stroke="#166534" stroke-width="1.5"/><path d="M15.5 17l1 1 2-2" stroke="#166534" stroke-width="1.5" stroke-linecap="round"/></svg>',
        },
        {
          title: "Exciting Offers",
          text: "Seasonal discounts on wellness, personal care, and everyday essentials.",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#166534" stroke-width="1.8"/><path d="M9 9c0-1.5 1-2 2-2s2 .5 2 2-1 2-2 3-2 1.5-2 3 1 2 2 2 2-.5 2-2" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          title: "Expert Advice",
          text: "Friendly pharmacist support for OTC products, vitamins, and daily care.",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="9" r="3" stroke="#166534" stroke-width="1.8"/><circle cx="16" cy="9" r="3" stroke="#166534" stroke-width="1.8"/><path d="M3 20v-1a5 5 0 0110 0v1M11 20v-1a5 5 0 0110 0v1" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
      ],
    };
  },
};
</script>

<style scoped>
.features {
  padding: 0 0 var(--space-section);
  margin-top: -1rem;
}

.features__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .features__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.features__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.35rem;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}

.features__card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.features__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--color-green-soft);
  margin-bottom: 1rem;
}

.features__card h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.features__card p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.55;
}
</style>
