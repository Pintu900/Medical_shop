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
          :style="{ '--accent': stat.color, '--accent-soft': stat.bg }"
        >
          <span class="why__stat-icon" :style="{ background: stat.bg, color: stat.color }" v-html="stat.icon" />
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
          bg: "#dbeafe",
          color: "#2563eb",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="8.8" cy="8" r="3.3" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7"/><circle cx="16.2" cy="8.8" r="2.6" fill="#fff" stroke="currentColor" stroke-width="1.7"/><path d="M3.7 20v-.9a5.1 5.1 0 015.1-5.1h0a5.1 5.1 0 015.1 5.1v.9" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14.6 20v-.6a4.2 4.2 0 014.2-4.2h0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
        },
        {
          value: 100,
          suffix: "%",
          display: "0",
          label: "Genuine Medicines",
          bg: "#dcfce7",
          color: "#16a34a",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l7.5 2.7v5.6c0 5-3.2 8.9-7.5 10.7-4.3-1.8-7.5-5.7-7.5-10.7V5.2L12 2.5z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 12.2l2.4 2.4 4.6-4.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          value: 15,
          suffix: "+",
          display: "0",
          label: "Years of Trust",
          bg: "#fef3c7",
          color: "#d97706",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="15" rx="2.2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7"/><path d="M8 3.2v3.6M16 3.2v3.6M4.2 9.6h15.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8.5 13.5l1.3 1.3 2.4-2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          value: 1,
          suffix: "",
          display: "0",
          label: "Convenient Location",
          bg: "#fce7f3",
          color: "#db2777",
          icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 21.3s6.5-5.7 6.5-11A6.5 6.5 0 005.5 10.3c0 5.3 6.5 11 6.5 11z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10.3" r="2.5" fill="#fff" stroke="currentColor" stroke-width="1.7"/></svg>',
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
  gap: 1.1rem;
}

.why__stat {
  position: relative;
  background: linear-gradient(165deg, var(--accent-soft) 0%, var(--color-surface) 65%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.6rem 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.why__stat::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent);
  opacity: 0.85;
}

.why__stat:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}

.why__stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  margin-bottom: 0.4rem;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.why__stat:hover .why__stat-icon {
  transform: scale(1.12) rotate(-4deg);
}

.why__stat strong {
  font-size: clamp(1.9rem, 2.4vw, 2.35rem);
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.why__stat span:last-child {
  font-size: 0.8438rem;
  color: var(--color-muted);
  font-weight: 600;
}

@media (min-width: 540px) and (max-width: 899px) {
  .why__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
