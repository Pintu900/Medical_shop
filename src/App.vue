<template>
  <Navbar />
  <HomeView />
  <div class="hidden-seo">
  medical shop near basistha chariali guwahati , 
  medical shop near me shiv mandir ,
  medical store near me ,
  medical stores ,
  Chemist store ,
  pharmacy , pharmacy near me , shivam , shivam medical store
</div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import HomeView from "./HomeView.vue";
export default {
  name: "App",
  components: {
    Navbar,
    HomeView
  },
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  padding: 0;
}



#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #1f2937;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ffffff 100%);
  min-height: 100vh;
}
.hidden-seo {
    position: absolute;
    left: -9999px;
  }
</style>
