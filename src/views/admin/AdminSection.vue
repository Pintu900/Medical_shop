<template>
  <section class="page">
    <p class="crumb">Admin / {{ title }}</p>
    <h1>{{ title }}</h1>
    <p class="lead">This section is not built yet.</p>
  </section>
</template>

<script>
export default {
  name: "AdminSection",
  computed: {
    title() {
      return this.$route.meta.section || "Admin";
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1040px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb {
  margin: 0 0 0.85rem;
  color: #64748b;
  font-size: 0.8125rem;
}

h1 {
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.lead {
  margin: 0.45rem 0 0;
  color: #64748b;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem 1rem 2rem;
  }

  h1 {
    font-size: 1.45rem;
  }
}
</style>
