import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./HomeView.vue";
import AboutPage from "./views/AboutPage.vue";
import ServicesPage from "./views/ServicesPage.vue";
import ContactPage from "./views/ContactPage.vue";
import PrivacyPolicy from "./views/PrivacyPolicy.vue";
import TermsOfService from "./views/TermsOfService.vue";
import AdminLayout from "./components/admin/AdminLayout.vue";
import AddWholesaler from "./views/admin/wholesalers/AddWholesaler.vue";
import AdminSection from "./views/admin/AdminSection.vue";
import AdminOverview from "./views/admin/overview/Overview.vue";
import WholesalerList from "./views/admin/wholesalers/WholesalerList.vue";
import WholesalerDetail from "./views/admin/wholesalers/WholesalerDetail.vue";
import EditWholesaler from "./views/admin/wholesalers/EditWholesaler.vue";
import PurchaseBillList from "./views/admin/purchase-bills/PurchaseBillList.vue";
import AddPurchaseBill from "./views/admin/purchase-bills/AddPurchaseBill.vue";
import PurchaseBillDetail from "./views/admin/purchase-bills/PurchaseBillDetail.vue";
import EditPurchaseBill from "./views/admin/purchase-bills/EditPurchaseBill.vue";

const routes = [
  { path: "/", name: "home", component: HomeView, meta: { title: "New Shivam Medicos — Home" } },
  { path: "/about", name: "about", component: AboutPage, meta: { title: "About Us — New Shivam Medicos" } },
  { path: "/services", name: "services", component: ServicesPage, meta: { title: "Services — New Shivam Medicos" } },
  { path: "/contact", name: "contact", component: ContactPage, meta: { title: "Contact — New Shivam Medicos" } },
  { path: "/privacy-policy", name: "privacy", component: PrivacyPolicy, meta: { title: "Privacy Policy — New Shivam Medicos" } },
  { path: "/terms-of-service", name: "terms", component: TermsOfService, meta: { title: "Terms of Service — New Shivam Medicos" } },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { admin: true, title: "Admin — New Shivam Medicos" },
    children: [
      { path: "", redirect: "/admin/overview" },
      {
        path: "overview",
        name: "admin-overview",
        component: AdminOverview,
        meta: { title: "Overview — New Shivam Medicos" },
      },
      {
        path: "wholesalers",
        name: "admin-wholesalers",
        component: WholesalerList,
        meta: { title: "Wholesalers — New Shivam Medicos" },
      },
      {
        path: "wholesalers/new",
        name: "admin-wholesaler-new",
        component: AddWholesaler,
        meta: { title: "Add wholesaler — New Shivam Medicos" },
      },
      {
        path: "wholesalers/:id",
        name: "admin-wholesaler",
        component: WholesalerDetail,
        meta: { title: "Wholesaler — New Shivam Medicos" },
      },
      {
        path: "wholesalers/:id/edit",
        name: "admin-wholesaler-edit",
        component: EditWholesaler,
        meta: { title: "Edit wholesaler — New Shivam Medicos" },
      },
      {
        path: "purchase-bills",
        name: "admin-purchase-bills",
        component: PurchaseBillList,
        meta: { title: "Purchase bills — New Shivam Medicos" },
      },
      {
        path: "purchase-bills/new",
        name: "admin-purchase-bill-new",
        component: AddPurchaseBill,
        meta: { title: "Add purchase bill — New Shivam Medicos" },
      },
      {
        path: "purchase-bills/:id",
        name: "admin-purchase-bill",
        component: PurchaseBillDetail,
        meta: { title: "Purchase bill — New Shivam Medicos" },
      },
      {
        path: "purchase-bills/:id/edit",
        name: "admin-purchase-bill-edit",
        component: EditPurchaseBill,
        meta: { title: "Edit purchase bill — New Shivam Medicos" },
      },
      {
        path: "payments",
        name: "admin-payments",
        component: AdminSection,
        meta: { title: "Payments — New Shivam Medicos", section: "Payments" },
      },
      {
        path: "reports",
        name: "admin-reports",
        component: AdminSection,
        meta: { title: "Reports — New Shivam Medicos", section: "Reports" },
      },
      {
        path: "audit",
        name: "admin-audit",
        component: AdminSection,
        meta: { title: "Audit history — New Shivam Medicos", section: "Audit history" },
      },
      {
        path: "users",
        name: "admin-users",
        component: AdminSection,
        meta: { title: "Users — New Shivam Medicos", section: "Users" },
      },
    ],
  },
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
