import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { registerUnauthorized } from "./api";
import { initAuth, markSignedOut } from "./auth";
import { revealDirective } from "./directives/reveal";
import "./assets/theme.css";

let redirectingToLogin = false;

registerUnauthorized(() => {
  const current = router.currentRoute.value;
  markSignedOut();
  if (redirectingToLogin || current.name === "login") return;
  if (!current.matched.some((record) => record.meta.requiresAuth)) return;
  redirectingToLogin = true;
  router.replace({ name: "login", query: { redirect: current.fullPath, expired: "1" } }).finally(() => {
    redirectingToLogin = false;
  });
});

initAuth();

const app = createApp(App);
app.directive("reveal", revealDirective);
app.use(router).mount("#app");
