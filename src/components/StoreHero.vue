<template>
  <section id="home" class="hero">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__eyebrow">Licensed pharmacy · Basistha, Guwahati</p>
        <h1 class="hero__title">New Shivam Medicos</h1>
        <p class="hero__lead">
          Prescription medicines, daily health essentials, and friendly pharmacist support for your
          family—walk in or call ahead with your prescription.
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="tel:+918876499294">Call +91 8876499294</a>
          <RouterLink class="btn btn--ghost" to="/contact">Visit &amp; hours</RouterLink>
        </div>
        <dl class="hero__meta">
          <div>
            <dt>Hours</dt>
            <dd>8:30 AM – 2 PM · 4 PM – 10 PM</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>South Basistha, near Durga Mandir</dd>
          </div>
        </dl>
      </div>
      <div class="hero__panel" aria-hidden="true">
        <div class="hero__card">
          <span class="hero__card-label">Same-day prep</span>
          <p class="hero__card-text">Bring your prescription to the counter—we’ll confirm availability and pricing before you pay.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "StoreHero",
};
</script>

<style scoped>
.hero {
  padding: calc(var(--nav-h) + 2rem) 0 var(--space-section);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.hero__grid {
  display: grid;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 900px) {
  .hero__grid {
    grid-template-columns: 1fr 320px;
    gap: 3rem;
  }
}

.hero__eyebrow {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin: 0 0 0.75rem;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 1rem;
  color: var(--color-text);
}

.hero__lead {
  margin: 0 0 1.5rem;
  font-size: 1.0625rem;
  color: var(--color-muted);
  max-width: 36ch;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.hero__meta {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 1.25rem 0 0;
  border-top: 1px solid var(--color-border);
}

@media (min-width: 520px) {
  .hero__meta {
    grid-template-columns: 1fr 1fr;
  }
}

.hero__meta dt {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  margin: 0 0 0.25rem;
}

.hero__meta dd {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
}

.hero__panel {
  position: relative;
}

.hero__card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.hero__card-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.hero__card-text {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-muted);
  line-height: 1.55;
}
</style>
