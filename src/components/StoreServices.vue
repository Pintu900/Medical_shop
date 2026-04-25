<template>
  <section id="services" class="services">
    <div class="container">
      <header class="services__head">
        <h2 class="services__title">What we offer</h2>
        <p class="services__sub">
          Everyday pharmacy services at our Basistha store. For details or stock checks, phone us before you travel.
        </p>
      </header>
      <ul class="services__grid">
        <li v-for="item in items" :key="item.title" class="services__card">
          <span class="services__icon" aria-hidden="true">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </li>
      </ul>
      <p class="services__footnote">
        We follow applicable pharmacy rules for all sales. This website does not replace medical advice from your doctor.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "StoreServices",
  data() {
    return {
      items: [
        {
          icon: "💊",
          title: "Prescriptions",
          text: "Dispensing against valid prescriptions and guidance on how to take your medicines safely.",
        },
        {
          icon: "🩺",
          title: "Health checks",
          text: "Blood pressure checks and support around diabetes care products (in store, when staff are available).",
        },
        {
          icon: "🧴",
          title: "OTC & wellness",
          text: "Over-the-counter medicines, vitamins, first aid, and daily care items for the whole family.",
        },
        {
          icon: "📍",
          title: "Local service",
          text: "Serving Basistha, Chariali, and nearby Guwahati neighbourhoods with clear pricing and honest advice.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.services {
  padding: var(--space-section) 0;
  background: var(--color-bg);
}

.services__head {
  max-width: 36rem;
  margin-bottom: 2rem;
}

.services__title {
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
  color: var(--color-text);
}

.services__sub {
  margin: 0;
  color: var(--color-muted);
  font-size: 1rem;
}

.services__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .services__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.services__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.35rem;
  box-shadow: var(--shadow);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.services__card:hover {
  border-color: rgba(13, 148, 136, 0.35);
  box-shadow: var(--shadow-md);
}

.services__icon {
  font-size: 1.5rem;
  line-height: 1;
  display: block;
  margin-bottom: 0.75rem;
}

.services__card h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.services__card p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.55;
}

.services__footnote {
  margin: 2rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-muted);
  max-width: 42rem;
}
</style>
