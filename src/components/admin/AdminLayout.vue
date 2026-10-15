<template>
  <div class="admin">
    <header class="admin__top">
      <RouterLink to="/admin/wholesalers" class="brand brand--compact">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </span>
        <span class="brand__name">New Shivam Medicos</span>
      </RouterLink>
      <button
        type="button"
        class="admin__menu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="admin-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">{{ menuOpen ? "Close menu" : "Open menu" }}</span>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <div v-if="menuOpen" class="admin__backdrop" @click="menuOpen = false" />

    <aside id="admin-nav" class="admin__side" :class="{ 'is-open': menuOpen }">
      <RouterLink to="/admin/wholesalers" class="brand">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </span>
        <span class="brand__name">New Shivam<br />Medicos</span>
      </RouterLink>

      <nav class="side-nav" aria-label="Admin">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="side-nav__link"
          :class="{ 'is-active': isActive(item) }"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              :d="item.icon"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="admin__main">
      <RouterView />
    </div>
  </div>
</template>

<script>
const NAV = [
  {
    label: "Overview",
    to: "/admin/overview",
    match: "/admin/overview",
    icon: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z",
  },
  {
    label: "Wholesalers",
    to: "/admin/wholesalers",
    match: "/admin/wholesalers",
    icon: "M16 19v-1a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v1M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2.2-2.9M16.5 6.2a3 3 0 0 1 0 5.6",
  },
  {
    label: "Purchase bills",
    to: "/admin/purchase-bills",
    match: "/admin/purchase-bills",
    icon: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v6h6M8 13h8M8 17h5",
  },
  {
    label: "Payments",
    to: "/admin/payments",
    match: "/admin/payments",
    icon: "M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 10h18M7 15h4",
  },
  {
    label: "Reports",
    to: "/admin/reports",
    match: "/admin/reports",
    icon: "M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6",
  },
  {
    label: "Audit history",
    to: "/admin/audit",
    match: "/admin/audit",
    icon: "M12 8v5l3 2M12 21a9 9 0 1 0-9-9",
  },
];

export default {
  name: "AdminLayout",
  data() {
    return {
      menuOpen: false,
      nav: NAV,
    };
  },
  watch: {
    $route() {
      this.menuOpen = false;
    },
  },
  mounted() {
    document.addEventListener("keydown", this.onKeydown);
  },
  unmounted() {
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    isActive(item) {
      return this.$route.path.startsWith(item.match);
    },
    onKeydown(event) {
      if (event.key === "Escape") this.menuOpen = false;
    },
  },
};
</script>

<style scoped>
.admin {
  --admin-teal: #0f766e;
  --admin-teal-dark: #115e59;
  --admin-ink: #0f172a;
  --admin-muted: #64748b;
  --admin-line: #e6eeec;
  --admin-bg: #f4fbfa;
  display: flex;
  min-height: 100vh;
  background: var(--admin-bg);
  color: var(--admin-ink);
}

.admin__side {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--admin-line);
  padding: 1.25rem 1.25rem;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.6rem 1.35rem;
  color: var(--admin-ink);
  text-decoration: none;
}

.brand__mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--admin-teal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand__name {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.side-nav__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.68rem 0.8rem;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
}

.side-nav__link:hover {
  background: #f4fbfa;
  color: var(--admin-teal-dark);
}

.side-nav__link.is-active {
  background: #e7f6f3;
  color: var(--admin-teal);
  font-weight: 600;
  box-shadow: inset 3px 0 0 var(--admin-teal);
}

.admin__main {
  flex: 1;
  min-width: 0;
}

.admin__top,
.admin__backdrop {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 800px) {
  .admin {
    flex-direction: column;
  }

  .admin__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1rem;
    background: #fff;
    border-bottom: 1px solid var(--admin-line);
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .brand--compact {
    padding: 0;
  }

  .brand--compact .brand__name {
    font-size: 0.95rem;
  }

  .brand--compact .brand__mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .admin__menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--admin-ink);
    cursor: pointer;
  }

  .admin__side {
    position: fixed;
    z-index: 40;
    left: 0;
    top: 0;
    transform: translateX(-105%);
    transition: transform 0.2s ease;
    box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
  }

  .admin__side.is-open {
    transform: none;
  }

  .admin__side .brand {
    display: flex;
  }

  .admin__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(15, 23, 42, 0.35);
    border: 0;
  }
}
</style>
