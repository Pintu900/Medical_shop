<template>
  <div class="admin">
    <header class="admin__top">
      <RouterLink to="/admin/overview" class="brand brand--compact">
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
      <RouterLink to="/admin/overview" class="brand">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </span>
        <span class="brand__text">
          <span class="brand__name">New Shivam Medicos</span>
          <small>Pharmacy &amp; ERP</small>
        </span>
      </RouterLink>

      <nav class="side-nav" aria-label="Admin">
        <RouterLink
          v-for="item in visibleNav"
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
          <span class="side-nav__label">{{ item.label }}</span>
          <span v-if="item.crown" class="owner-pill">
            <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
              <path d="M4 17h16l-1.2-8-4.3 3.2L12 6l-2.5 6.2L5.2 9 4 17z" fill="currentColor" />
            </svg>
            Owner
          </span>
          <span v-else-if="isActive(item)" class="side-nav__dot" aria-hidden="true"></span>
        </RouterLink>
      </nav>

      <footer class="side-foot">
        <div class="side-foot__who">
          <span class="side-foot__avatar" aria-hidden="true">{{ accountInitials }}</span>
          <span class="side-foot__text">
            <small v-if="accountRole">{{ accountRole }}</small>
            <strong>{{ accountName }}</strong>
            <span>{{ accountDetail }}</span>
          </span>
        </div>
        <button v-if="session.status === 'authenticated'" class="side-foot__out" type="button" :disabled="session.loggingOut" @click="signOut">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ session.loggingOut ? "Signing out…" : "Sign out" }}
        </button>
        <p v-if="logoutError" class="side-foot__error" role="alert">{{ logoutError }}</p>
      </footer>
    </aside>

    <div class="admin__main">
      <section v-if="!session.ready" class="session-problem">
        <h1>Checking your session</h1>
        <p>Please wait while we confirm whether you are signed in.</p>
      </section>
      <section v-else-if="session.status === 'unavailable'" class="session-problem">
        <h1>Could not verify your session</h1>
        <p>{{ session.error }}</p>
        <div class="session-problem__actions">
          <button class="session-problem__retry" type="button" @click="retry">Try again</button>
          <RouterLink class="session-problem__login" to="/login">Sign in</RouterLink>
        </div>
      </section>
      <RouterView v-else />
    </div>

    <nav class="admin__bottom" aria-label="Primary">
      <RouterLink
        v-for="item in mobileNav"
        :key="item.to"
        :to="item.to"
        class="bottom-nav__link"
        :class="{ 'is-active': isActive(item) }"
      >
        <span class="bottom-nav__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="23" height="23">
            <path
              :d="item.icon"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="bottom-nav__label">{{ item.mobileLabel || item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script>
import { logout, retrySession, session } from "../../auth";
import { roleLabel } from "../../data/users";

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
    mobileLabel: "Purchases",
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
  {
    label: "Users",
    to: "/admin/users",
    match: "/admin/users",
    crown: true,
    ownerOnly: true,
    icon: "M16 19v-1a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v1M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
];

export default {
  name: "AdminLayout",
  data() {
    return {
      menuOpen: false,
      nav: NAV,
      session,
      logoutError: "",
    };
  },
  computed: {
    visibleNav() {
      const role = this.session.user && this.session.user.role;
      if (!role) return this.nav;
      return this.nav.filter((item) => !item.ownerOnly || role === "OWNER");
    },
    mobileNav() {
      return this.visibleNav.slice(0, 4);
    },
    accountName() {
      return (this.session.user && this.session.user.name) || "New Shivam Medicos";
    },
    accountInitials() {
      const words = this.accountName.trim().split(/\s+/).filter(Boolean);
      if (!words.length) return "?";
      if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
      return (words[0][0] + words[1][0]).toUpperCase();
    },
    accountRole() {
      const role = this.session.user && this.session.user.role;
      if (role === "OWNER") return "Store owner";
      return role ? roleLabel(role) : "";
    },
    accountDetail() {
      if (this.session.user && this.session.user.email) return this.session.user.email;
      if (this.session.profileMissing) return "Profile endpoint is not available";
      return "Purchase Admin";
    },
  },
  watch: {
    $route() {
      this.menuOpen = false;
    },
    "session.ready": "leaveIfAnonymous",
    "session.status": "leaveIfAnonymous",
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
    leaveIfAnonymous() {
      if (!this.session.ready || this.session.status !== "anonymous") return;
      if (!this.$route.matched.some((record) => record.meta.requiresAuth)) return;
      this.$router.replace({ name: "login", query: { redirect: this.$route.fullPath } });
    },
    retry() {
      retrySession();
    },
    async signOut() {
      this.logoutError = "";
      try {
        await logout();
        this.$router.replace("/login");
      } catch (err) {
        this.logoutError = err.message || "Sign out failed. Your session is still active.";
      }
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
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #eef1f4;
  padding: 0 0.75rem;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--admin-ink);
  text-decoration: none;
}

.admin__side .brand {
  margin: 0 -0.75rem 0.75rem;
  padding: 1.1rem 1rem 1rem 1.15rem;
  border-bottom: 1px solid #eef1f4;
}

.brand__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand__text small {
  margin-top: 0.15rem;
  color: #94a3b8;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  overflow: auto;
}

.side-nav__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 500;
}

.side-nav__link:hover {
  background: #f6f9fa;
  color: var(--admin-teal-dark);
}

.side-nav__link.is-active {
  border-color: #cdeae4;
  background: #eef8f5;
  color: #0f5f58;
  font-weight: 600;
}

.side-nav__label {
  flex: 1;
  min-width: 0;
}

.side-nav__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #14b8a6;
}

.owner-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.45rem;
  border: 1px solid #f6dfae;
  border-radius: 6px;
  background: #fff8e8;
  color: #b45309;
  font-size: 0.66rem;
  font-weight: 600;
}

.side-foot {
  margin: auto -0.75rem 0;
  padding: 0.9rem 0.75rem 0.9rem;
  border-top: 1px solid #eef1f4;
  background: #fafbfc;
}

.side-foot__who {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 0.15rem;
}

.side-foot__avatar {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: #eef2f6;
  color: #334155;
  font-size: 0.74rem;
  font-weight: 700;
}

.side-foot__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-foot__text small {
  color: #64748b;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.side-foot__text strong {
  font-size: 0.84rem;
  line-height: 1.3;
}

.side-foot__text span {
  overflow: hidden;
  color: #94a3b8;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-foot__out {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.side-foot__out:hover:not(:disabled) {
  border-color: #b7dcd5;
  color: var(--admin-teal);
}

.side-foot__out:disabled {
  cursor: default;
  opacity: 0.7;
}

.side-foot__error {
  margin: 0.45rem 0 0;
  color: #b42318;
  font-size: 0.75rem;
  line-height: 1.4;
}

.admin__main {
  flex: 1;
  min-width: 0;
}

.session-problem {
  max-width: 36rem;
  margin: 2rem;
  padding: 1.4rem 1.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
}

.session-problem h1 {
  margin: 0;
  color: var(--admin-ink);
  font-size: 1.25rem;
}

.session-problem p {
  margin: 0.6rem 0 0;
  color: var(--admin-muted);
  line-height: 1.5;
}

.session-problem__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  margin-top: 1rem;
}

.session-problem__retry {
  border: 0;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  background: var(--admin-teal);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.session-problem__login {
  color: var(--admin-teal);
  font-weight: 600;
  text-decoration: none;
}

.admin__top,
.admin__backdrop,
.admin__bottom {
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
    z-index: 60;
    transform: none;
  }

  .admin__side .brand {
    display: flex;
  }

  .admin__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 55;
    background: rgba(15, 23, 42, 0.35);
    border: 0;
  }

  .admin__bottom {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-height: 76px;
    padding: 0.35rem 0.4rem calc(0.35rem + env(safe-area-inset-bottom));
    border-top: 1px solid #e6edf1;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 -5px 18px rgba(15, 23, 42, 0.04);
  }

  .bottom-nav__link {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: flex-start;
    gap: 0.16rem;
    flex-direction: column;
    padding: 0.15rem 0.1rem 0;
    border-radius: 12px;
    color: #64748b;
    font-size: 0.72rem;
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .bottom-nav__link:hover {
    color: var(--admin-teal-dark);
  }

  .bottom-nav__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 38px;
    border-radius: 999px;
  }

  .bottom-nav__link.is-active {
    color: var(--admin-teal-dark);
    font-weight: 700;
  }

  .bottom-nav__link.is-active .bottom-nav__icon {
    background: #e8f8f5;
    color: var(--admin-teal-dark);
  }

  .bottom-nav__label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .admin__main {
    padding-bottom: calc(76px + env(safe-area-inset-bottom));
  }
}
</style>
