<template>
    <!-- <div id="home"><Timing /></div> -->
    <div id="about"><BodyComponent /></div>
    <div id="services"><Offerings/></div>
    <div id="contact"><Contact /></div>
    <Call phone-number="+91 8876499294" />
    <Reviews />
  </template>
  
  <script>
  import Contact from "./components/ContactUs.vue";
  import BodyComponent from "./components/Hero.vue";
  import Call from "./components/Call.vue";
  // import Timing from "./components/Timing.vue";
  import Reviews from "./components/Reviews.vue";
  import Offerings from "./components/Offerings.vue";
  export default {
    components: {
      BodyComponent,
      Contact,
      Call,
      // Timing,
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
    margin-top: 0%;
  }
  
  /* Add padding to sections to account for fixed navbar (top bar + navbar) */
  #home,
  #about,
  #services,
  #contact {
    scroll-margin-top: 96px;
  }
  </style>
  