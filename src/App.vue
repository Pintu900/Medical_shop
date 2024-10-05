<template>
  <Navbar />
  <RouterView />
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
export default {
  name: "App",
  components: {
    Navbar
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.hidden-seo {
    position: absolute;
    left: -9999px;
  }
</style>
