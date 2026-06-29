<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="container nav__inner">
      <RouterLink to="/" class="nav__brand" @click="onLogo">
        <BrandLogo :size="44" />
        <span class="nav__text">
          <span class="nav__name">NEW SHIVAM MEDICOS</span>
          <span class="nav__tag">{{ shop.tagline }}</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="nav__toggle"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="nav-menu"
        @click="open = !open"
      >
        <span class="sr-only">Menu</span>
        <span class="nav__burger" :class="{ 'is-open': open }" />
      </button>

      <nav id="nav-menu" class="nav__links" :class="{ 'is-open': open }">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="nav__link"
          @click="open = false"
        >
          {{ l.label }}
        </RouterLink>
        <a :href="`tel:${shop.phoneTel}`" class="nav__phone">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.45.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.45 1 1 0 01-.25 1L6.6 10.8z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>
            <strong>{{ shop.phone }}</strong>
            <small>Call Us</small>
          </span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
import BrandLogo from "./BrandLogo.vue";
import { SHOP } from "../shop";

export default {
  name: "Navbar",
  components: { BrandLogo },
  data() {
    return {
      shop: SHOP,
      open: false,
      scrolled: false,
      links: [
        { to: "/", label: "Home" },
        { to: "/about", label: "About Us" },
        { to: "/services", label: "Services" },
        { to: "/about", label: "Health Tips" },
        { to: { path: "/", hash: "#offers" }, label: "Offers" },
        { to: "/contact", label: "Contact Us" },
      ],
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 4;
    },
    onLogo() {
      this.open = false;
      if (this.$route.path === "/") {
        this.$nextTick(() => {
          const el = document.getElementById("home");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
  },
};
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-h);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.nav--scrolled {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow);
}

.nav__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.nav__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.nav__name {
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  color: var(--color-green-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 480px) {
  .nav__name {
    font-size: 0.875rem;
  }
}

.nav__tag {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
}

.nav__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius);
}

@media (min-width: 1024px) {
  .nav__toggle {
    display: none;
  }
}

.nav__burger {
  width: 22px;
  height: 2px;
  background: var(--color-text);
  position: relative;
  border-radius: 1px;
  transition: background 0.2s;
}

.nav__burger::before,
.nav__burger::after {
  content: "";
  position: absolute;
  left: 0;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: transform 0.2s, top 0.2s;
}

.nav__burger::before {
  top: -7px;
}

.nav__burger::after {
  top: 7px;
}

.nav__burger.is-open {
  background: transparent;
}

.nav__burger.is-open::before {
  top: 0;
  transform: rotate(45deg);
}

.nav__burger.is-open::after {
  top: 0;
  transform: rotate(-45deg);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 0.15rem 1.5rem;
}

@media (max-width: 1023px) {
  .nav__links {
    position: absolute;
    top: var(--nav-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
    display: none;
  }

  .nav__links.is-open {
    display: flex;
  }
}

.nav__link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  padding: 0.5rem 0.35rem;
  position: relative;
  transition: color 0.15s;
}

.nav__link:hover,
.nav__link.router-link-active,
.nav__link.router-link-exact-active {
  color: var(--color-green);
}

.nav__link.router-link-exact-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-green-light);
  border-radius: 2px;
}

@media (max-width: 1023px) {
  .nav__link {
    padding: 0.75rem 0.5rem;
  }

  .nav__link.router-link-exact-active::after {
    display: none;
  }
}

.nav__phone {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.875rem;
  color: var(--color-green);
  text-decoration: none;
  white-space: nowrap;
}

.nav__phone svg {
  flex-shrink: 0;
}

.nav__phone strong {
  display: block;
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--color-green-dark);
  line-height: 1.2;
}

.nav__phone small {
  display: block;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-muted);
}

@media (max-width: 1023px) {
  .nav__phone {
    justify-content: center;
    padding: 0.85rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    margin-top: 0.25rem;
  }
}

@media (min-width: 1024px) {
  .nav__inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.5rem;
  }

  .nav__links {
    justify-content: center;
  }
}
</style>
