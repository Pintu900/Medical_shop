<template>
  <div class="app-shell" :class="{ 'app-shell--admin': isAdmin }">
    <template v-if="isAdmin">
      <RouterView />
    </template>
    <template v-else>
      <Navbar />
      <RouterView />
      <SiteFooter />
      <BackToTop />
    </template>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import SiteFooter from "./components/SiteFooter.vue";
import BackToTop from "./components/BackToTop.vue";

export default {
  name: "App",
  components: {
    Navbar,
    SiteFooter,
    BackToTop,
  },
  computed: {
    isAdmin() {
      return this.$route.matched.some((record) => record.meta.admin);
    },
  },
  watch: {
    isAdmin: {
      immediate: true,
      handler(isAdmin) {
        document.body.classList.toggle("is-admin", isAdmin);
      },
    },
  },
  unmounted() {
    document.body.classList.remove("is-admin");
  },
};
</script>

<style>
#app {
  min-height: 100vh;
}

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
