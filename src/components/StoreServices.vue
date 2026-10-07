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
          :class="{ 'services__card--soon': item.soon }"
        >
          <span v-if="item.soon" class="services__soon">Coming Soon</span>
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
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2.3" y="9.5" width="19.4" height="7" rx="3.5" transform="rotate(-45 12 12)" fill="currentColor" fill-opacity="0.18"/><path d="M6.5 14a4.2 4.2 0 010-5.9l3.6-3.6a4.2 4.2 0 115.9 5.9l-3.6 3.6a4.2 4.2 0 01-5.9 0z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.8 8.8l6.4 6.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
        },
        {
          title: "Health Essentials",
          text: "Vitamins, supplements, first aid, and daily wellness products.",
          bg: "#fee2e2",
          color: "#dc2626",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 20.3s-7.3-4.6-7.3-10.3A4.3 4.3 0 019 5.7a4.3 4.3 0 013 1.4 4.3 4.3 0 013-1.4 4.3 4.3 0 014.3 4.3c0 5.7-7.3 10.3-7.3 10.3z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M5.3 12.7h3l1.4-2.8 2 4.6 1.4-2.8h4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          title: "Baby Care",
          text: "Diapers, baby food, skincare, and gentle care items for infants.",
          bg: "#ffedd5",
          color: "#ea580c",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="9.3" y="2.3" width="5.4" height="2.8" rx="1" fill="currentColor"/><path d="M9 5.1h6v2a4 4 0 011 2.6V18a2.9 2.9 0 01-2.9 2.9h-1.2A2.9 2.9 0 019 18V9.7a4 4 0 011-2.6v-2z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 13h6M9 15.6h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
        },
        {
          title: "Ayurveda & Herbal",
          text: "Traditional herbal remedies and natural wellness products.",
          bg: "#dcfce7",
          color: "#16a34a",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 4C10.5 4 4.5 9.8 4.5 17.5c0 .7 0 1.3.2 1.9 8.3-.3 15.3-6.1 15.3-15.4z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M6.3 18.2c2.7-5.8 7.6-9.6 12.3-11.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        },
        {
          title: "Personal Care",
          text: "Skincare, hygiene, and grooming products for the whole family.",
          bg: "#f3e8ff",
          color: "#9333ea",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="10" y="2.3" width="4" height="2.4" rx="0.6" fill="currentColor"/><path d="M9.3 4.7h5.4v2.1a3 3 0 011 2.3V19a2.3 2.3 0 01-2.3 2.3h-2.8A2.3 2.3 0 018.3 19V9.1a3 3 0 011-2.3V4.7z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 13.5h6.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
        },
        {
          title: "Blood Tests & Scans",
          text: "On-site sample collection and diagnostic scans, launching soon.",
          bg: "#e0f2fe",
          color: "#0284c7",
          soon: true,
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2.6l6 7.6a7 7 0 11-12 0l6-7.6z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 14.2a3 3 0 003 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  .services__grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

.services__card {
  position: relative;
  background: linear-gradient(180deg, #f0f9ff 0%, var(--color-surface) 60%);
  border: 1px dashed #7dd3fc;
  border-radius: var(--radius-lg);
  padding: 1.6rem 1.15rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.services__card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: #38bdf8;
}

.services__soon {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.35);
  white-space: nowrap;
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
