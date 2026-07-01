<template>
  <main class="page-main contact-page">
    <section class="page-hero">
      <div class="container page-hero__inner">
        <h1>Contact Us</h1>
        <p>
          Visit us in Basistha or call for stock, timings, and prescription-related questions.
          We answer the phone during opening hours when possible.
        </p>
      </div>
    </section>
    <div class="container contact-page__inner">
      <Contact />
    </div>
  </main>
</template>

<script>
import Contact from "../components/ContactUs.vue";

export default {
  name: "ContactPage",
  components: { Contact },
};
</script>

<style scoped>
.contact-page__inner {
  max-width: 960px;
  padding: 3rem 1.25rem 4rem;
}
</style>
