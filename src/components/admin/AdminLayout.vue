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
        <span class="brand__name">New Shivam<br />Medicos</span>
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
          <span class="side-nav__text">
            <span class="side-nav__label">
              {{ item.label }}
              <svg v-if="item.crown" class="crown" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M4 17h16l-1.2-8-4.3 3.2L12 6l-2.5 6.2L5.2 9 4 17z" fill="currentColor" />
              </svg>
            </span>
            <small v-if="item.note">{{ item.note }}</small>
          </span>
        </RouterLink>
      </nav>

      <footer class="side-foot">
        <strong>{{ accountName }}</strong>
        <span>{{ accountDetail }}</span>
        <button v-if="session.status === 'authenticated'" class="side-foot__out" type="button" :disabled="session.loggingOut" @click="signOut">
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
  </div>
</template>

<script>
import { logout, retrySession, session } from "../../auth";

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
  {
    label: "Users",
    to: "/admin/users",
    match: "/admin/users",
    note: "Owner only",
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
    accountName() {
      return (this.session.user && this.session.user.name) || "New Shivam Medicos";
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
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
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
  overflow: auto;
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

.side-nav__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-nav__label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.side-nav__text small {
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.2;
}

.crown {
  color: #d97706;
  flex-shrink: 0;
}

.side-foot {
  margin-top: auto;
  padding: 1rem 0.8rem 0.15rem;
  border-top: 1px solid var(--admin-line);
}

.side-foot strong,
.side-foot span {
  display: block;
}

.side-foot strong {
  font-size: 0.9rem;
}

.side-foot span {
  margin-top: 0.15rem;
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.side-foot__out {
  margin-top: 0.7rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--admin-teal);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
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
