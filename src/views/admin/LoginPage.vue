<template>
  <main class="login">
    <div class="login__bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--tr"></span>
      <span class="blob blob--bl"></span>
      <span class="blob blob--br"></span>
    </div>

    <section v-if="!ready" class="login__card login__card--status" aria-live="polite">
      <p>Checking your session…</p>
    </section>

    <section v-else class="login__card">
      <header class="login__head">
        <svg class="login__logo" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="4" y="4" width="26" height="26" rx="8" fill="#0e7568" />
          <rect x="34" y="4" width="26" height="26" rx="8" fill="#3ecfb4" />
          <rect x="4" y="34" width="26" height="26" rx="8" fill="#149684" />
          <rect x="34" y="34" width="26" height="26" rx="8" fill="#7ed9c8" />
        </svg>
        <p class="login__brand">New Shivam Medicos</p>
        <span class="login__badge">Admin portal</span>
        <span class="login__rule" aria-hidden="true"></span>
        <h1>Welcome back</h1>
        <p class="login__lead">Sign in to manage your pharmacy</p>
      </header>

      <p v-if="expired" class="login__banner login__banner--status" role="status">
        Your session has ended. Sign in again to continue.
      </p>
      <p v-if="formError" class="login__banner" role="alert">{{ formError }}</p>

      <form novalidate @submit.prevent="submit">
        <label class="field" :class="{ 'field--invalid': errors.email }">
          <span class="sr-only">Email address</span>
          <span class="field__control">
            <svg class="field__icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25" />
              <path d="M4 7.2 12 13l8-5.8" />
            </svg>
            <input
              v-model="email"
              type="email"
              name="email"
              placeholder="Email address"
              autocomplete="username"
              inputmode="email"
              :aria-invalid="Boolean(errors.email)"
              :aria-describedby="errors.email ? 'email-error' : null"
            />
          </span>
          <small v-if="errors.email" id="email-error" class="field__error">{{ errors.email }}</small>
        </label>

        <label class="field" :class="{ 'field--invalid': errors.password }">
          <span class="sr-only">Password</span>
          <span class="field__control">
            <svg class="field__icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="10.5" width="14" height="9.25" rx="2" />
              <path d="M8.25 10.5V8a3.75 3.75 0 0 1 7.5 0v2.5" />
            </svg>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              :aria-invalid="Boolean(errors.password)"
              :aria-describedby="errors.password ? 'password-error' : null"
            />
            <button
              class="field__toggle"
              type="button"
              :aria-pressed="showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 12S6 5.75 12 5.75 21.5 12 21.5 12 18 18.25 12 18.25 2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3.5 20.5 21" />
                <path d="M9.9 9.9A3.1 3.1 0 0 0 12 15.2c.7 0 1.3-.2 1.8-.6" />
                <path d="M6.2 6.7C4.2 8.1 2.8 10.2 2.5 12c0 0 3.5 6.25 9.5 6.25 1.5 0 2.9-.4 4.1-1" />
                <path d="M10 5.9c.6-.1 1.3-.15 2-.15 6 0 9.5 6.25 9.5 6.25a16 16 0 0 1-3.1 3.7" />
              </svg>
            </button>
          </span>
          <small v-if="errors.password" id="password-error" class="field__error">{{ errors.password }}</small>
        </label>

        <div class="login__row">
          <label class="remember">
            <input v-model="remember" type="checkbox" name="remember" />
            <span>Remember me</span>
          </label>
          <button class="forgot" type="button" @click="forgotOpen = !forgotOpen">
            Forgot password?
          </button>
        </div>

        <p v-if="forgotOpen" class="login__note" role="status">
          Ask your administrator to reset your password.
        </p>

        <button class="login__submit" type="submit" :disabled="submitting">
          {{ submitting ? "Signing in…" : "Sign in" }}
        </button>
      </form>

      <p class="login__secure">
        <span class="login__shield" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3.2 18.5 6v5.6c0 3.9-2.6 6.6-6.5 8.2-3.9-1.6-6.5-4.3-6.5-8.2V6L12 3.2Z" />
            <path d="m9.1 12 1.9 1.9 3.9-4" />
          </svg>
        </span>
        <span class="login__secure-rule" aria-hidden="true"></span>
        <span>Your data is secure and encrypted</span>
      </p>
    </section>

    <RouterLink class="login__back" to="/">Back to website</RouterLink>
  </main>
</template>

<script>
import { initAuth, login, safeInternalPath, session } from "../../auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REMEMBER_KEY = "nsm.admin.email";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      remember: false,
      showPassword: false,
      forgotOpen: false,
      submitting: false,
      ready: false,
      errors: {},
      formError: "",
    };
  },
  created() {
    this.restoreEmail();
    this.prepare();
  },
  mounted() {
    document.documentElement.classList.add("login-lock");
  },
  beforeUnmount() {
    document.documentElement.classList.remove("login-lock");
  },
  computed: {
    expired() {
      return this.$route.query.expired === "1";
    },
  },
  methods: {
    restoreEmail() {
      try {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
          this.email = saved;
          this.remember = true;
        }
      } catch (err) {
        /* Storage can be blocked; the form still works. */
      }
    },
    persistEmail() {
      try {
        if (this.remember) localStorage.setItem(REMEMBER_KEY, this.email.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch (err) {
        /* Ignore storage failures. */
      }
    },
    async prepare() {
      await initAuth();
      if (this.$route.name !== "login") return;
      if (session.status === "authenticated") {
        this.$router.replace(safeInternalPath(this.$route.query.redirect));
        return;
      }
      this.ready = true;
    },
    validate() {
      const errors = {};
      const email = this.email.trim();
      if (!email) errors.email = "Enter your email.";
      else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
      if (!this.password) errors.password = "Enter your password.";
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async submit() {
      if (this.submitting) return;
      this.formError = "";
      if (!this.validate()) return;
      this.submitting = true;
      this.persistEmail();
      try {
        await login(this.email.trim(), this.password);
        await this.$router.replace(safeInternalPath(this.$route.query.redirect));
      } catch (err) {
        if (err.status === 401) this.formError = "The email or password is incorrect, or this account is unavailable.";
        else if (err.status === 403) this.formError = "The sign-in request could not be verified. Refresh the page and try again.";
        else this.formError = err.message || "Sign in failed. Try again.";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.login {
  position: relative;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  padding: 1.25rem;
  overflow: hidden;
  background: #e7f6f1;
  color: #12263f;
  font-family: Poppins, "DM Sans", system-ui, sans-serif;
}

.login__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  display: block;
}

.blob--tl {
  width: 460px;
  height: 380px;
  top: -170px;
  left: -140px;
  background: #d5f1e6;
  border-radius: 48% 52% 62% 38% / 42% 48% 52% 58%;
}

.blob--tr {
  width: 540px;
  height: 360px;
  top: -120px;
  right: -180px;
  background: #d7f3e8;
  border-radius: 58% 42% 48% 52% / 46% 62% 38% 54%;
}

.blob--bl {
  width: 520px;
  height: 340px;
  bottom: -150px;
  left: -120px;
  background: #d3f0e4;
  border-radius: 46% 54% 42% 58% / 58% 40% 60% 42%;
}

.blob--br {
  width: 420px;
  height: 300px;
  right: -80px;
  bottom: -90px;
  background: #e1f7ef;
  border-radius: 52% 48% 60% 40% / 44% 58% 42% 56%;
}

.login__card {
  position: relative;
  width: min(100%, 440px);
  padding: 2.35rem 2.15rem 1.55rem;
  border-radius: 28px;
  background: #fff;
  box-shadow:
    0 22px 50px rgba(18, 72, 58, 0.08),
    0 2px 8px rgba(15, 40, 32, 0.04);
}

.login__card--status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  color: #64748b;
}

.login__card--status p {
  margin: 0;
}

.login__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.login__logo {
  width: 52px;
  height: 52px;
  margin-bottom: 0.85rem;
}

.login__brand {
  margin: 0;
  color: #10233d;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.login__badge {
  margin-top: 0.55rem;
  padding: 0.22rem 0.7rem;
  border-radius: 999px;
  background: #e7f8f1;
  color: #0f766e;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
}

.login__rule {
  width: 46px;
  height: 3px;
  margin: 0.95rem 0 1.15rem;
  border-radius: 999px;
  background: #f0a020;
}

.login__head h1 {
  margin: 0;
  color: #10233d;
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.login__lead {
  margin: 0.4rem 0 1.45rem;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.login__banner {
  margin: 0 0 0.9rem;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  background: #fef3f2;
  color: #b42318;
  font-size: 0.84rem;
  line-height: 1.45;
  text-align: center;
}

.login__banner--status {
  background: #fff7ed;
  color: #9a3412;
}

.field {
  display: block;
  margin-bottom: 0.8rem;
}

.field__control {
  position: relative;
  display: block;
}

.field__icon {
  position: absolute;
  top: 50%;
  left: 0.95rem;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  fill: none;
  stroke: #9aa3b2;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.field input {
  width: 100%;
  height: 50px;
  padding: 0 2.7rem 0 2.7rem;
  border: 1.5px solid #e6ebf0;
  border-radius: 12px;
  background: #fff;
  color: #12263f;
  font: inherit;
  font-size: 0.95rem;
}

.field input::placeholder {
  color: #9aa3b2;
  font-weight: 400;
}

.field input:focus {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.14);
}

.field--invalid input {
  border-color: #f04438;
}

.field--invalid input:focus {
  box-shadow: 0 0 0 3px rgba(240, 68, 56, 0.12);
}

.field__toggle {
  position: absolute;
  top: 50%;
  right: 0.35rem;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #8b95a5;
  cursor: pointer;
  transform: translateY(-50%);
}

.field__toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.field__toggle:hover {
  color: #0f766e;
}

.field__error {
  display: block;
  margin-top: 0.35rem;
  color: #b42318;
  font-size: 0.78rem;
}

.login__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0.15rem 0 1rem;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #64748b;
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.remember input {
  appearance: none;
  width: 16px;
  height: 16px;
  margin: 0;
  border: 1.5px solid #d5dbe3;
  border-radius: 4px;
  background: #fff;
  display: grid;
  place-content: center;
  cursor: pointer;
}

.remember input:checked {
  border-color: #0f766e;
  background: #0f766e;
}

.remember input:checked::after {
  content: "";
  width: 4px;
  height: 8px;
  margin-top: -2px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember input:focus-visible {
  outline: 2px solid #0f766e;
  outline-offset: 2px;
}

.forgot {
  border: 0;
  padding: 0;
  background: transparent;
  color: #0f766e;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
}

.forgot:hover {
  color: #0b5f59;
}

.login__note {
  margin: -0.35rem 0 0.9rem;
  color: #64748b;
  font-size: 0.82rem;
  text-align: right;
}

.login__submit {
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 12px;
  background: #0f766e;
  color: #fff;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.login__submit:hover:not(:disabled) {
  background: #0c685f;
}

.login__submit:disabled {
  cursor: default;
  opacity: 0.72;
}

.login__secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin: 0.95rem 0 0;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  background: #f3faf7;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}

.login__shield {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 8px;
  background: #e7f6ef;
  color: #0f766e;
}

.login__shield svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.login__secure-rule {
  width: 1px;
  height: 16px;
  background: #d5e4dc;
}

.login__back {
  position: relative;
  color: #5f7a72;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
}

.login__back:hover {
  color: #0f766e;
}

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

@media (max-height: 760px) {
  .login {
    gap: 0.55rem;
    padding: 0.75rem 1rem;
  }

  .login__card {
    padding: 1.15rem 1.35rem 0.95rem;
  }

  .login__logo {
    width: 40px;
    height: 40px;
    margin-bottom: 0.4rem;
  }

  .login__rule {
    margin: 0.5rem 0 0.6rem;
  }

  .login__head h1 {
    font-size: 1.5rem;
  }

  .login__lead {
    margin: 0.2rem 0 0.8rem;
  }

  .field {
    margin-bottom: 0.55rem;
  }

  .field input,
  .login__submit {
    height: 44px;
  }

  .login__secure {
    margin-top: 0.6rem;
  }
}

@media (max-width: 520px) {
  .login {
    padding: 1rem;
  }

  .login__card {
    padding: 1.7rem 1.15rem 1.25rem;
    border-radius: 24px;
  }

  .login__logo {
    width: 46px;
    height: 46px;
  }

  .login__brand {
    font-size: 1.2rem;
  }

  .login__head h1 {
    font-size: 1.55rem;
  }

  .login__lead {
    margin-bottom: 1.15rem;
    font-size: 0.88rem;
  }

  .login__secure {
    font-size: 0.74rem;
    gap: 0.5rem;
  }
}
</style>

<style>
html.login-lock,
html.login-lock body,
html.login-lock #app,
html.login-lock .app-shell {
  height: 100%;
  overflow: hidden;
}
</style>
