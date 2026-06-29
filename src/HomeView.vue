<template>
  <main class="page-main">
    <StoreHero />
    <StoreFeatures />
    <StoreServices />
    <PromoBanner />
    <WhyChooseUs />
    <StoreReviews />
    <MobileCallBar />
  </main>
</template>

<script>
import StoreHero from "./components/StoreHero.vue";
import StoreFeatures from "./components/StoreFeatures.vue";
import StoreServices from "./components/StoreServices.vue";
import PromoBanner from "./components/PromoBanner.vue";
import WhyChooseUs from "./components/WhyChooseUs.vue";
import StoreReviews from "./components/StoreReviews.vue";
import MobileCallBar from "./components/MobileCallBar.vue";

export default {
  name: "HomeView",
  components: {
    StoreHero,
    StoreFeatures,
    StoreServices,
    PromoBanner,
    WhyChooseUs,
    StoreReviews,
    MobileCallBar,
  },
};
</script>
