<template>
  <section id="home" class="hero">
    <div class="hero__bg" aria-hidden="true">
      <span class="hero__blob hero__blob--a" />
      <span class="hero__blob hero__blob--b" />
      <span class="hero__dots" />
    </div>
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
        <span class="hero__badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 12l2.5 2.5L16 9" stroke="#166534" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="9.5" stroke="#166534" stroke-width="1.6"/>
          </svg>
          Licensed Pharmacy
        </span>
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
              <span class="hero__cat-icon" :style="{ background: cat.bg }">
                <img
                  class="hero__cat-img"
                  :src="cat.image"
                  :alt="cat.label"
                  width="30"
                  height="30"
                />
              </span>
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
          icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l7.5 2.7v5.6c0 5-3.2 8.9-7.5 10.7-4.3-1.8-7.5-5.7-7.5-10.7V5.2L12 2.5z" stroke="#22c55e" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 12.2l2.4 2.4 4.6-4.9" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          label: "Expert Pharmacist",
          icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7.5" r="3.6" stroke="#22c55e" stroke-width="1.6"/><path d="M4.5 20.5v-.8a7.5 7.5 0 0115 0v.8" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/></svg>',
        },
        {
          label: "Affordable Prices",
          icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M11.3 3.3H19a1 1 0 011 1v7.7a1 1 0 01-.3.7l-7.9 7.9a1 1 0 01-1.4 0l-6.8-6.8a1 1 0 010-1.4l7.9-7.9a1 1 0 01.7-.2z" stroke="#22c55e" stroke-width="1.6" stroke-linejoin="round"/><circle cx="15.8" cy="8.2" r="1.15" stroke="#22c55e" stroke-width="1.4"/></svg>',
        },
        {
          label: "Care You Can Trust",
          icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 6.3c.7-1.2 2-2 3.3-2 2 0 3.6 1.6 3.6 3.7 0 2.8-3.4 5-6.9 8-3.5-3-6.9-5.2-6.9-8 0-2.1 1.6-3.7 3.6-3.7 1.3 0 2.6.8 3.3 2z" stroke="#22c55e" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 17.8c1.6 1.9 4.2 3.1 8 3.1s6.4-1.2 8-3.1" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/></svg>',
        },
      ],
      categories: [
        {
          label: "Medicines",
          bg: "#dbeafe",
          image: "/images/categories/medicines.svg",
        },
        {
          label: "Health Care",
          bg: "#dcfce7",
          image: "/images/categories/health-care.svg",
        },
        {
          label: "Baby Care",
          bg: "#ffedd5",
          image: "/images/categories/baby-care.svg",
        },
        {
          label: "Personal Care",
          bg: "#f3e8ff",
          image: "/images/categories/personal-care.svg",
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
  position: relative;
  padding: calc(var(--nav-h) + 2rem) 0 calc(var(--space-section) + 1.5rem);
  background: linear-gradient(180deg, #f8fdf9 0%, #fff 100%);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.hero__blob--a {
  width: 420px;
  height: 420px;
  top: -180px;
  right: -120px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 70%);
}

.hero__blob--b {
  width: 340px;
  height: 340px;
  bottom: -140px;
  left: -100px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 70%);
}

.hero__dots {
  position: absolute;
  top: 20%;
  right: 6%;
  width: 140px;
  height: 140px;
  background-image: radial-gradient(circle, rgba(22, 101, 52, 0.18) 1.5px, transparent 1.5px);
  background-size: 16px 16px;
  opacity: 0.6;
}

@media (max-width: 959px) {
  .hero__dots {
    display: none;
  }
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 960px) {
  .hero__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem;
  }
}

@media (max-width: 959px) {
  .hero__visual {
    order: -1;
  }
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero__eyebrow,
  .hero__title,
  .hero__lead,
  .hero__actions,
  .hero__trust {
    animation: heroFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .hero__eyebrow {
    animation-delay: 0.05s;
  }

  .hero__title {
    animation-delay: 0.12s;
  }

  .hero__lead {
    animation-delay: 0.2s;
  }

  .hero__actions {
    animation-delay: 0.28s;
  }

  .hero__trust {
    animation-delay: 0.36s;
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
  padding: 0.4rem 0.85rem 0.4rem 0.6rem;
  background: var(--color-green-soft);
  border-radius: 999px;
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
  position: relative;
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
  gap: 1.1rem 0.75rem;
}

@media (min-width: 520px) {
  .hero__trust {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem 0.5rem;
  }
}

.hero__trust li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  min-width: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text);
  transition: transform 0.2s ease;
}

@media (min-width: 520px) {
  .hero__trust li {
    flex-direction: row;
    text-align: left;
    gap: 0.6rem;
    font-size: 0.8125rem;
  }
}

.hero__trust li:hover {
  transform: translateY(-3px);
}

.hero__trust-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
}

.hero__trust-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.hero__visual {
  position: relative;
  animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.hero__badge {
  position: absolute;
  top: -14px;
  left: 20px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  color: var(--color-green-dark);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
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
  transition: transform 0.5s ease;
}

.hero__image-wrap:hover .hero__image {
  transform: scale(1.04);
}

@keyframes cardFloatY {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
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
  animation: cardFloatY 4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero__open-card {
    animation: none;
  }
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
  animation: pulseRing 1.8s ease-out infinite;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.35rem 0.4rem;
}

.hero__categories li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
  text-align: center;
}

.hero__cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero__categories li:hover .hero__cat-icon {
  transform: translateY(-3px) scale(1.06);
  box-shadow: var(--shadow);
}

.hero__cat-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
}

@media (max-width: 959px) {
  .hero__visual {
    padding-bottom: 2rem;
  }

  .hero__badge {
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 420px) {
  .hero__open-card {
    padding: 1rem 0.75rem;
  }

  .hero__categories {
    gap: 0.25rem;
  }

  .hero__cat-icon {
    width: 38px;
    height: 38px;
  }

  .hero__cat-img {
    width: 22px;
    height: 22px;
  }

  .hero__categories li {
    gap: 0.3rem;
    font-size: 0.625rem;
  }
}

@media (max-width: 360px) {
  .hero__cat-icon {
    width: 32px;
    height: 32px;
  }

  .hero__cat-img {
    width: 18px;
    height: 18px;
  }

  .hero__categories li {
    font-size: 0.5625rem;
  }
}
</style>
