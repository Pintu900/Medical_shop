<template>
  <div class="grid">
    <section class="card">
      <h2>In-store services</h2>
      <ul>
        <li>Blood pressure checks</li>
        <li>Diabetes care products &amp; guidance</li>
        <li>Medication questions (general information)</li>
        <li>Vaccinations &amp; blood collection (where arranged)</li>
      </ul>
    </section>
    <section class="card">
      <h2>Contact</h2>
      <p class="shop">New Shivam Medicos</p>
      <p class="addr">
        South Basistha Nagar, near Durga Mandir, Basistha, Guwahati, Assam
      </p>
      <ul class="list">
        <li>
          <span class="label">Phone</span>
          <a href="tel:+918876499294">+91 8876499294</a>
        </li>
        <li>
          <span class="label">Maps</span>
          <a href="https://g.co/kgs/h3d5zFG" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </li>
        <li>
          <span class="label">Email</span>
          <span class="muted">Call or visit us for email.</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "ContactServices",
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.35rem;
  box-shadow: var(--shadow);
}

.card h2 {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
}

.card ul:first-of-type {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--color-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.card ul:first-of-type li {
  margin-bottom: 0.35rem;
}

.shop {
  margin: 0 0 0.35rem;
  font-weight: 700;
  color: var(--color-text);
}

.addr {
  margin: 0 0 1.25rem;
  color: var(--color-muted);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list li {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 0.5rem 1rem;
  padding: 0.65rem 0;
  border-top: 1px solid var(--color-border);
  font-size: 0.9375rem;
  align-items: baseline;
}

.list li:first-of-type {
  border-top: none;
  padding-top: 0;
}

.label {
  font-weight: 600;
  color: var(--color-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.list a {
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
}

.list a:hover {
  text-decoration: underline;
}

.muted {
  color: var(--color-muted);
}
</style>
