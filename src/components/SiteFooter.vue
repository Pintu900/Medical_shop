<template>
  <footer id="contact" class="foot">
    <span class="foot__topbar" aria-hidden="true" />
    <div class="container foot__grid">
      <div class="foot__item">
        <span class="foot__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="1.8"/>
          </svg>
        </span>
        <div>
          <strong>Visit Our Store</strong>
          <p>{{ shop.address }}</p>
          <a :href="shop.mapsUrl" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
      </div>

      <div class="foot__item">
        <span class="foot__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </span>
        <div>
          <strong>Open Daily</strong>
          <p>{{ shop.hoursShort }} | {{ shop.hours }}</p>
        </div>
      </div>

      <div class="foot__item">
        <span class="foot__icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.45.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.45 1 1 0 01-.25 1L6.6 10.8z" stroke="currentColor" stroke-width="1.8"/>
          </svg>
        </span>
        <div>
          <strong>Call / WhatsApp</strong>
          <p><a :href="`tel:${shop.phoneTel}`">{{ shop.phone }}</a></p>
        </div>
      </div>

      <div class="foot__item foot__item--wa">
        <a
          class="foot__whatsapp"
          :href="`https://wa.me/${shop.whatsapp}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.016.588 3.885 1.6 5.455L2 22l5.563-1.462A9.86 9.86 0 0012 20.486C17.523 20.486 22 16.341 22 11.243 22 6.145 17.523 2 12 2z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>

    <div class="foot__bottom">
      <div class="container foot__bottom-inner">
        <nav class="foot__nav" aria-label="Footer">
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/services">Services</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
          <RouterLink to="/privacy-policy">Privacy</RouterLink>
          <RouterLink to="/terms-of-service">Terms</RouterLink>
        </nav>
        <p>© {{ year }} {{ shop.name }}. General information only—not medical advice.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { SHOP } from "../shop";

export default {
  name: "SiteFooter",
  data() {
    return {
      shop: SHOP,
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.foot {
  position: relative;
  margin-top: auto;
  background: var(--color-green-dark);
  color: #ecfdf5;
  font-size: 0.875rem;
}

.foot__topbar {
  display: block;
  height: 4px;
  background: linear-gradient(90deg, var(--color-green-light), #38bdf8, var(--color-green-light));
  background-size: 200% 100%;
  animation: footShimmer 6s linear infinite;
}

@keyframes footShimmer {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.foot__grid {
  display: grid;
  gap: 1.5rem;
  padding: 2.5rem 1.25rem;
}

@media (min-width: 640px) {
  .foot__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .foot__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    padding: 3rem 1.25rem;
  }
}

.foot__item {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.foot__item--wa {
  align-items: stretch;
}

.foot__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: background 0.2s, transform 0.2s;
}

.foot__item:hover .foot__icon {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.foot__item strong {
  display: block;
  color: #fff;
  font-size: 0.9375rem;
  margin-bottom: 0.35rem;
}

.foot__item p {
  margin: 0;
  color: #bbf7d0;
  line-height: 1.55;
  font-size: 0.8125rem;
}

.foot__item a {
  color: #86efac;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
}

.foot__item a:hover {
  color: #fff;
  text-decoration: underline;
}

.foot__whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem 1rem;
  background: #25d366;
  color: #fff !important;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: var(--radius-lg);
  text-decoration: none !important;
  transition: background 0.15s;
}

.foot__whatsapp:hover {
  background: #1ebe57;
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.35);
}

.foot__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.foot__bottom-inner {
  padding: 1.25rem 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
}

.foot__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  justify-content: center;
}

.foot__nav a {
  color: #bbf7d0;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8125rem;
}

.foot__nav a:hover {
  color: #fff;
}

.foot__bottom-inner p {
  margin: 0;
  font-size: 0.75rem;
  color: #86efac;
}

@media (min-width: 769px) {
  .foot__bottom-inner {
    padding-bottom: 1.5rem;
  }
}
</style>
