<template>
  <section id="home" class="hero">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z"
              fill="#22c55e"
            />
          </svg>
          Your Trusted Neighbourhood Pharmacy
        </p>
        <h1 class="hero__title">
          Better Health <span class="hero__accent">Starts Here.</span>
        </h1>
        <p class="hero__lead">
          {{ shop.name }} is committed to providing genuine medicines, quality products, and
          personalised care for you and your family. Walk in or call ahead with your prescription.
        </p>
        <div class="hero__actions">
          <RouterLink class="btn btn--primary" to="/services">
            Our Services
            <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink class="btn btn--ghost" to="/contact">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 11.5a8.4 8.4 0 01-.9 3.8 8 8 0 01-7.6 5.3 8 8 0 01-3.8-.9L3 21l1.3-5.7a8 8 0 01-.9-3.8 8.4 8.4 0 018.4-8.4 8.4 8.4 0 018.4 8.4z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Contact Us
          </RouterLink>
        </div>
        <ul class="hero__trust">
          <li v-for="item in trustItems" :key="item.label">
            <span class="hero__trust-icon" v-html="item.icon" />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>

      <div class="hero__visual">
        <div class="hero__image-wrap">
          <img
            class="hero__image"
            :src="storeImage"
            alt="New Shivam Medicos pharmacy storefront"
            @error="onImageError"
          />
        </div>
        <div class="hero__open-card">
          <div class="hero__open-head">
            <span class="hero__open-dot" />
            <strong>We are Open</strong>
          </div>
          <p class="hero__open-hours">{{ shop.hoursShort }} | {{ shop.hours }}</p>
          <ul class="hero__categories">
            <li v-for="cat in categories" :key="cat.label">
              <span class="hero__cat-icon" :style="{ background: cat.bg, color: cat.color }" v-html="cat.icon" />
              <span>{{ cat.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SHOP } from "../shop";

export default {
  name: "StoreHero",
  data() {
    return {
      shop: SHOP,
      storeImage: "/images/storefront2.png",
      trustItems: [
        {
          label: "Genuine Medicines",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="7" y="3" width="10" height="18" rx="5" stroke="#166534" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          label: "Expert Pharmacist",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#166534" stroke-width="1.8"/><path d="M4 21v-1a6 6 0 0112 0v1" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          label: "Affordable Prices",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M7 8h8a3 3 0 110 6H9a3 3 0 100 6h8" stroke="#166534" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          label: "Care You Can Trust",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" stroke="#166534" stroke-width="1.8"/></svg>',
        },
      ],
      categories: [
        {
          label: "Medicines",
          bg: "#dbeafe",
          color: "#2563eb",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="8" y="4" width="8" height="16" rx="4" fill="currentColor"/></svg>',
        },
        {
          label: "Health Care",
          bg: "#dcfce7",
          color: "#16a34a",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" fill="currentColor"/></svg>',
        },
        {
          label: "Baby Care",
          bg: "#ffedd5",
          color: "#ea580c",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" fill="currentColor"/><path d="M6 20c1.5-3 4-4.5 6-4.5s4.5 1.5 6 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
        },
        {
          label: "Personal Care",
          bg: "#f3e8ff",
          color: "#9333ea",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="18" rx="3" fill="currentColor"/></svg>',
        },
      ],
    };
  },
  methods: {
    onImageError(e) {
      e.target.src = "/images/storefront.svg";
    },
  },
};
</script>

<style scoped>
.hero {
  padding: calc(var(--nav-h) + 2rem) 0 var(--space-section);
  background: linear-gradient(180deg, #f8fdf9 0%, #fff 100%);
}

.hero__grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 960px) {
  .hero__grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

@media (max-width: 959px) {
  .hero__visual {
    order: -1;
  }
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-muted);
  margin: 0 0 1rem;
}

.hero__title {
  font-size: clamp(2.25rem, 5.5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin: 0 0 1rem;
  color: var(--color-text);
}

.hero__accent {
  color: var(--color-green-light);
}

.hero__lead {
  margin: 0 0 1.75rem;
  font-size: 1rem;
  color: var(--color-muted);
  max-width: 42ch;
  line-height: 1.7;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.hero__trust {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem 1rem;
}

@media (min-width: 520px) {
  .hero__trust {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.hero__trust li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
}

.hero__trust-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-green-soft);
}

.hero__visual {
  position: relative;
}

.hero__image-wrap {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  aspect-ratio: 4 / 3;
  background: var(--color-green-soft);
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero__open-card {
  position: absolute;
  left: 50%;
  bottom: -1.5rem;
  transform: translateX(-50%);
  width: min(92%, 380px);
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 1.15rem 1.25rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.hero__open-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.hero__open-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-green-light);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
}

.hero__open-head strong {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.hero__open-hours {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  color: var(--color-muted);
}

.hero__categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.hero__categories li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
  text-align: center;
}

.hero__cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

@media (max-width: 959px) {
  .hero__visual {
    padding-bottom: 2rem;
  }
}
</style>
