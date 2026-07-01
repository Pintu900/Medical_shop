<template>
  <section id="services" class="services">
    <div class="container">
      <header class="services__head" v-reveal>
        <span class="section-eyebrow">What We Offer</span>
        <h2 class="section-title">Our Services</h2>
      </header>
      <ul class="services__grid">
        <li
          v-for="(item, i) in items"
          :key="item.title"
          v-reveal="{ delay: i * 80 }"
          class="services__card"
        >
          <span class="services__icon" :style="{ background: item.bg, color: item.color }" v-html="item.icon" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "StoreServices",
  data() {
    return {
      items: [
        {
          title: "All Medicines",
          text: "Prescription and OTC medicines with clear pricing and genuine sourcing.",
          bg: "#dbeafe",
          color: "#2563eb",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="8" y="4" width="8" height="16" rx="4" fill="currentColor"/></svg>',
        },
        {
          title: "Health Essentials",
          text: "Vitamins, supplements, first aid, and daily wellness products.",
          bg: "#fee2e2",
          color: "#dc2626",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" fill="currentColor"/></svg>',
        },
        {
          title: "Baby Care",
          text: "Diapers, baby food, skincare, and gentle care items for infants.",
          bg: "#ffedd5",
          color: "#ea580c",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" fill="currentColor"/></svg>',
        },
        {
          title: "Ayurveda & Herbal",
          text: "Traditional herbal remedies and natural wellness products.",
          bg: "#dcfce7",
          color: "#16a34a",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22C12 22 5 16 5 10a7 7 0 0114 0c0 6-7 12-7 12z" fill="currentColor"/></svg>',
        },
        {
          title: "Personal Care",
          text: "Skincare, hygiene, and grooming products for the whole family.",
          bg: "#f3e8ff",
          color: "#9333ea",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="18" rx="3" fill="currentColor"/></svg>',
        },
      ],
    };
  },
};
</script>

<style scoped>
.services {
  padding: var(--space-section) 0;
  background: var(--color-bg);
  position: relative;
}

.services__head {
  text-align: center;
  margin-bottom: 2.5rem;
}

.services__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .services__grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.services__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.6rem 1.15rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.services__card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: rgba(22, 101, 52, 0.18);
}

.services__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin-bottom: 1rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.services__card:hover .services__icon {
  transform: scale(1.1) rotate(6deg);
}

.services__card h3 {
  margin: 0 0 0.45rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

.services__card p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
  line-height: 1.55;
}
</style>
