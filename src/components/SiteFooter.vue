<template>
  <footer class="foot">
    <div class="container foot__grid">
      <div>
        <strong class="foot__brand">New Shivam Medicos</strong>
        <p class="foot__addr">South Basistha Nagar, near Durga Mandir, Basistha, Guwahati, Assam</p>
      </div>
      <nav class="foot__nav" aria-label="Footer">
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/services">Services</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/privacy-policy">Privacy</RouterLink>
        <RouterLink to="/terms-of-service">Terms</RouterLink>
      </nav>
    </div>
    <div class="foot__bottom">
      <div class="container foot__bottom-inner">
        <p>© {{ year }} New Shivam Medicos. General information only—not medical advice.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "SiteFooter",
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.foot {
  margin-top: auto;
  background: var(--color-text);
  color: #94a3b8;
  font-size: 0.875rem;
}

.foot__grid {
  display: grid;
  gap: 1.5rem;
  padding: 2.5rem 1.25rem;
}

@media (min-width: 640px) {
  .foot__grid {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
}

.foot__brand {
  display: block;
  color: #f1f5f9;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}

.foot__addr {
  margin: 0;
  max-width: 22rem;
  line-height: 1.5;
}

.foot__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
}

.foot__nav a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
}

.foot__nav a:hover {
  color: #fff;
}

.foot__bottom {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.foot__bottom-inner {
  padding: 1rem 1.25rem 2rem;
}

.foot__bottom-inner p {
  margin: 0;
  font-size: 0.8125rem;
  color: #64748b;
}

@media (min-width: 769px) {
  .foot__bottom-inner {
    padding-bottom: 1.25rem;
  }
}
</style>
