<template>
  <Navbar />
  <Timing />
  <BodyComponent />
  <Offerings/>
  <Contact />
  <Call phone-number="+91 8876499294" />
  <Reviews />
</template>

<script>
import Contact from "./components/ContactUs.vue";
import Navbar from "./components/Navbar.vue";
import BodyComponent from "./components/Center.vue";
import Call from "./components/Call.vue";
import Timing from "./components/Timing.vue";
import Reviews from "./components/Reviews.vue";
import Offerings from "./components/Offerings.vue";
export default {
  name: "App",
  components: {
    Navbar,
    BodyComponent,
    Contact,
    Call,
    Timing,
    Reviews,
    Offerings,
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
</style>
