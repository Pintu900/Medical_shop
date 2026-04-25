<template>
  <main class="page-main contact-page">
    <div class="container contact-page__inner">
      <header class="contact-page__intro">
        <h1>Contact</h1>
        <p>
          Visit us in Basistha or call for stock, timings, and prescription-related questions.
          We answer the phone during opening hours when possible.
        </p>
      </header>
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
  padding-bottom: 3rem;
}

.contact-page__intro {
  padding: calc(var(--nav-h) + 2rem) 0 1.5rem;
  max-width: 36rem;
}

.contact-page__intro h1 {
  font-size: clamp(1.75rem, 4vw, 2rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-text);
}

.contact-page__intro p {
  margin: 0;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.6;
}
</style>
