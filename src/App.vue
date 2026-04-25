<template>
  <div class="app-shell">
    <Navbar />
    <RouterView />
    <SiteFooter />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import SiteFooter from "./components/SiteFooter.vue";

export default {
  name: "App",
  components: {
    Navbar,
    SiteFooter,
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
