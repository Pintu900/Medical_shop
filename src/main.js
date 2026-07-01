import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { revealDirective } from "./directives/reveal";
import "./assets/theme.css";

const app = createApp(App);
app.directive("reveal", revealDirective);
app.use(router).mount("#app");
