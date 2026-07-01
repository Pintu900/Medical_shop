<template>
  <section id="about-preview" class="why">
    <div class="container why__grid">
      <div class="why__copy" v-reveal>
        <span class="section-eyebrow">Why Choose Us</span>
        <h2 class="section-title">Your Health Is Our Top Priority</h2>
        <p class="why__text">
          At {{ shop.name }}, we combine genuine medicines, honest pricing, and friendly pharmacist
          support. Serving Basistha and nearby Guwahati neighbourhoods with care you can trust.
        </p>
        <RouterLink class="btn btn--primary" to="/about">
          About Us
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
      <ul class="why__stats" ref="statsList">
        <li
          v-for="(stat, i) in stats"
          :key="stat.label"
          v-reveal="{ delay: i * 90 }"
          class="why__stat"
        >
          <span class="why__stat-icon" v-html="stat.icon" />
          <strong>{{ stat.display }}</strong>
          <span>{{ stat.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { SHOP } from "../shop";

export default {
  name: "WhyChooseUs",
  data() {
    return {
      shop: SHOP,
      counted: false,
      stats: [
        {
          value: 5000,
          suffix: "+",
          display: "0",
          label: "Happy Customers",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="#166534" stroke-width="1.8"/><circle cx="16" cy="9" r="2.5" stroke="#166534" stroke-width="1.8"/><path d="M3 19v-1a6 6 0 0112 0v1M13 19v-1a5 5 0 018 0v1" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          value: 100,
          suffix: "%",
          display: "0",
          label: "Genuine Medicines",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#166534" stroke-width="1.8"/><path d="M8 12l2.5 2.5L16 9" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          value: 15,
          suffix: "+",
          display: "0",
          label: "Years of Trust",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="2" stroke="#166534" stroke-width="1.8"/><path d="M8 3v4M16 3v4M4 10h16" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          value: 1,
          suffix: "",
          display: "0",
          label: "Convenient Location",
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="#166534" stroke-width="1.8"/><circle cx="12" cy="11" r="2.5" stroke="#166534" stroke-width="1.8"/></svg>',
        },
      ],
    };
  },
  mounted() {
    const el = this.$refs.statsList;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.counted) {
            this.counted = true;
            this.animateCounts();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
  },
  methods: {
    animateCounts() {
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        this.stats.forEach((stat) => {
          const current = Math.round(stat.value * eased);
          stat.display = `${current}${stat.suffix}`;
        });
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
  },
};
</script>

<style scoped>
.why {
  padding: var(--space-section) 0;
  background: var(--color-surface);
}

.why__grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 900px) {
  .why__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4rem;
  }
}

.why__text {
  margin: 1rem 0 1.75rem;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.7;
  max-width: 42ch;
}

.why__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.why__stat {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.35rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.why__stat:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  background: #fff;
}

.why__stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-green-soft);
  margin-bottom: 0.35rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.why__stat:hover .why__stat-icon {
  transform: scale(1.1);
}

.why__stat strong {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-green-dark);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.why__stat span:last-child {
  font-size: 0.8125rem;
  color: var(--color-muted);
  font-weight: 500;
}
</style>
