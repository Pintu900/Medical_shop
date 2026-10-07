<template>
  <section class="features">
    <div class="container">
      <ul class="features__grid">
        <li
          v-for="(item, i) in items"
          :key="item.title"
          v-reveal="{ delay: i * 90 }"
          class="features__card"
        >
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
          icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M3 6.5h10v9H3v-9z" fill="#bbf7d0" stroke="#166534" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 10.3h3.4l3.1 3.1v2.1H13v-5.2z" fill="#bbf7d0" stroke="#166534" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7.3" cy="18.3" r="2.1" fill="#fff" stroke="#166534" stroke-width="1.6"/><circle cx="16.8" cy="18.3" r="2.1" fill="#fff" stroke="#166534" stroke-width="1.6"/><path d="M6 9.5h4M6 12h4" stroke="#166534" stroke-width="1.4" stroke-linecap="round"/></svg>',
        },
        {
          title: "Prescription Support",
          text: "Bring your prescription—we confirm availability and guide you on safe usage.",
          icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="13" height="17" rx="2" fill="#bbf7d0" fill-opacity="0.55" stroke="#166534" stroke-width="1.6"/><path d="M8 8h7M8 11.3h5" stroke="#166534" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.8" cy="17" r="4.3" fill="#fff" stroke="#166534" stroke-width="1.5"/><path d="M15 17.1l1.3 1.3 2.4-2.6" stroke="#166534" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          title: "Exciting Offers",
          text: "Seasonal discounts on wellness, personal care, and everyday essentials.",
          icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M11.3 3.3H18a1 1 0 011 1v6.7a1.5 1.5 0 01-.44 1.06l-7 7a1.5 1.5 0 01-2.12 0l-5.7-5.7a1.5 1.5 0 010-2.12l7-7A1.5 1.5 0 0111.3 3.3z" fill="#bbf7d0" stroke="#166534" stroke-width="1.6" stroke-linejoin="round"/><circle cx="15.5" cy="7.5" r="1.4" fill="#166534"/></svg>',
        },
        {
          title: "Expert Advice",
          text: "Friendly pharmacist support for OTC products, vitamins, and daily care.",
          icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="8.8" cy="8" r="3.3" fill="#bbf7d0" stroke="#166534" stroke-width="1.6"/><circle cx="16.2" cy="8.8" r="2.6" fill="#fff" stroke="#166534" stroke-width="1.6"/><path d="M3.7 20v-.9a5.1 5.1 0 015.1-5.1h0a5.1 5.1 0 015.1 5.1v.9" fill="#bbf7d0" stroke="#166534" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.6 20v-.6a4.2 4.2 0 014.2-4.2h0" stroke="#166534" stroke-width="1.6" stroke-linecap="round"/></svg>',
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
  position: relative;
  z-index: 1;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .features__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.features__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem 1.35rem 1.75rem;
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.features__card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-green-light), var(--color-green));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.features__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: rgba(22, 101, 52, 0.18);
}

.features__card:hover::before {
  transform: scaleX(1);
}

.features__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--color-green-soft);
  margin-bottom: 1.15rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.features__card:hover .features__icon {
  transform: scale(1.08) rotate(-4deg);
  background: #d7f5e3;
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
