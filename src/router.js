import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./HomeView.vue";
import AboutPage from "./views/AboutPage.vue";
import ServicesPage from "./views/ServicesPage.vue";
import ContactPage from "./views/ContactPage.vue";
import PrivacyPolicy from "./views/PrivacyPolicy.vue";
import TermsOfService from "./views/TermsOfService.vue";

const routes = [
  { path: "/", name: "home", component: HomeView, meta: { title: "New Shivam Medicos — Home" } },
  { path: "/about", name: "about", component: AboutPage, meta: { title: "About Us — New Shivam Medicos" } },
  { path: "/services", name: "services", component: ServicesPage, meta: { title: "Services — New Shivam Medicos" } },
  { path: "/contact", name: "contact", component: ContactPage, meta: { title: "Contact — New Shivam Medicos" } },
  { path: "/privacy-policy", name: "privacy", component: PrivacyPolicy, meta: { title: "Privacy Policy — New Shivam Medicos" } },
  { path: "/terms-of-service", name: "terms", component: TermsOfService, meta: { title: "Terms of Service — New Shivam Medicos" } },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 80 };
    return { top: 0, left: 0 };
  },
});

router.afterEach((to) => {
  const title = to.meta && to.meta.title;
  if (title) document.title = title;
});

export default router;
