<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="container nav__inner">
      <RouterLink to="/" class="nav__brand" @click="onLogo">
        <span class="nav__mark">NS</span>
        <span class="nav__text">
          <span class="nav__name">New Shivam</span>
          <span class="nav__tag">Medicos</span>
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
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="nav__link" @click="open = false">
          {{ l.label }}
        </RouterLink>
        <a href="tel:+918876499294" class="nav__phone">+91 8876499294</a>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      open: false,
      scrolled: false,
      links: [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/services", label: "Services" },
        { to: "/contact", label: "Contact" },
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
  background: rgba(255, 255, 255, 0.88);
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
  gap: 0.65rem;
  text-decoration: none;
  color: inherit;
}

.nav__mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.nav__name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}

.nav__tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
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

@media (min-width: 769px) {
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
  gap: 0.25rem 1.25rem;
}

@media (max-width: 768px) {
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
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}

.nav__link:hover,
.nav__link.router-link-active,
.nav__link.router-link-exact-active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

@media (max-width: 768px) {
  .nav__link {
    padding: 0.75rem 0.5rem;
  }
}

.nav__phone {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav__phone {
    text-align: center;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    margin-top: 0.25rem;
  }
}
</style>
