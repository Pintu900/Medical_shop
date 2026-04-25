<template>
  <main class="page-main">
    <StoreHero />
    <StoreServices />
    <section id="contact" class="contact-block">
      <div class="container">
        <header class="contact-block__head">
          <h2>Visit or call</h2>
          <p>Full address, map link, and phone—same details on our <RouterLink to="/contact">contact page</RouterLink>.</p>
        </header>
        <Contact />
      </div>
    </section>
    <StoreReviews />
    <MobileCallBar />
  </main>
</template>

<script>
import StoreHero from "./components/StoreHero.vue";
import StoreServices from "./components/StoreServices.vue";
import StoreReviews from "./components/StoreReviews.vue";
import MobileCallBar from "./components/MobileCallBar.vue";
import Contact from "./components/ContactUs.vue";

export default {
  name: "HomeView",
  components: {
    StoreHero,
    StoreServices,
    StoreReviews,
    MobileCallBar,
    Contact,
  },
};
</script>

<style scoped>
.contact-block {
  padding: var(--space-section) 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.contact-block__head {
  max-width: 36rem;
  margin-bottom: 1.5rem;
}

.contact-block__head h2 {
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text);
}

.contact-block__head p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.975rem;
}
</style>
