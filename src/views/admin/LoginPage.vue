<template>
  <main v-if="!ready" class="login login--checking">
    <p>Checking your session…</p>
  </main>
  <main v-else class="login">
    <section class="login__hero" aria-hidden="true">
      <p class="login__brand">New Shivam Medicos</p>
      <h2>Your pharmacy, organised.</h2>
      <p>Wholesalers, purchase bills, and payments in one place.</p>
    </section>

    <section class="login__panel">
      <RouterLink class="login__back" to="/">Back to website</RouterLink>
      <p class="login__mobile-brand">New Shivam Medicos</p>
      <h1>Welcome back</h1>
      <p class="login__lead">Sign in to your admin account.</p>

      <p v-if="expired" class="login__banner" role="status">Your session has ended. Sign in again to continue.</p>
      <p v-if="formError" class="login__banner" role="alert">{{ formError }}</p>

      <form novalidate @submit.prevent="submit">
        <label class="field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="username"
            inputmode="email"
            :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'email-error' : null"
          />
          <small v-if="errors.email" id="email-error" class="field__error">{{ errors.email }}</small>
        </label>

        <label class="field">
          <span>Password</span>
          <span class="field__secret">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              autocomplete="current-password"
              :aria-invalid="Boolean(errors.password)"
              :aria-describedby="errors.password ? 'password-error' : null"
            />
            <button class="field__toggle" type="button" @click="showPassword = !showPassword">
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </span>
          <small v-if="errors.password" id="password-error" class="field__error">{{ errors.password }}</small>
        </label>

        <button class="login__submit" type="submit" :disabled="submitting">
          {{ submitting ? "Signing in…" : "Sign in" }}
        </button>
      </form>

      <p class="login__help">Need access? Contact your administrator.</p>
    </section>
  </main>
</template>

<script>
import { initAuth, login, safeInternalPath, session } from "../../auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      submitting: false,
      ready: false,
      errors: {},
      formError: "",
    };
  },
  created() {
    this.prepare();
  },
  computed: {
    expired() {
      return this.$route.query.expired === "1";
    },
  },
  methods: {
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
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  background: #f3fbf8;
  color: #0f172a;
  font-family: Poppins, "DM Sans", system-ui, sans-serif;
}

.login__hero {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.7rem;
  padding: 3rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.16), transparent 32%),
    #0f766e;
  color: #fff;
}

.login__brand {
  margin: 0 0 auto;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.login__hero h2 {
  margin: 0;
  max-width: 12ch;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.1;
}

.login__hero p:last-child {
  margin: 0;
  max-width: 34ch;
  color: rgba(255, 255, 255, 0.86);
}

.login__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem clamp(1.25rem, 5vw, 4.5rem);
  background: #fff;
}

.login__back {
  align-self: flex-start;
  margin-bottom: 1.5rem;
  color: #0f766e;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.login__mobile-brand {
  display: none;
  margin: 0 0 1.2rem;
  color: #0f766e;
  font-weight: 700;
}

.login h1 {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
}

.login__lead {
  margin: 0.4rem 0 1.4rem;
  color: #64748b;
}

.login__banner {
  margin: 0 0 1rem;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  background: #fef3f2;
  color: #b42318;
  font-size: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.field span {
  font-size: 0.9rem;
  font-weight: 600;
}

.field input {
  width: 100%;
  border: 1px solid #d7e3e1;
  border-radius: 10px;
  padding: 0.8rem 0.85rem;
  color: #0f172a;
  font: inherit;
  background: #fff;
}

.field input:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.field__secret {
  position: relative;
  display: block;
}

.field__secret input {
  padding-right: 4.5rem;
}

.field__toggle {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #0f766e;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
}

.field__error {
  color: #b42318;
  font-size: 0.8rem;
}

.login__submit {
  width: 100%;
  margin-top: 0.4rem;
  border: 0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  background: #0f766e;
  color: #fff;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.login__submit:disabled {
  cursor: default;
  opacity: 0.7;
}

.login__help {
  margin: 1.2rem 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.login.login--checking {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3fbf8;
  color: #0f172a;
}

@media (max-width: 800px) {
  .login {
    display: block;
    background: #f3fbf8;
  }

  .login__hero {
    display: none;
  }

  .login__panel {
    min-height: 100vh;
    background: transparent;
  }

  .login__mobile-brand {
    display: block;
  }
}
</style>
