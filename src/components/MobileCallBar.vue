<template>
  <div class="bar" role="navigation" aria-label="Quick contact">
    <a class="bar__btn bar__btn--call" :href="`tel:${shop.phoneTel}`">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.45.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.45 1 1 0 01-.25 1L6.6 10.8z"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Call
    </a>
    <a class="bar__btn bar__btn--whatsapp" :href="`https://wa.me/${shop.whatsapp}`" target="_blank" rel="noopener noreferrer">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.016.588 3.885 1.6 5.455L2 22l5.563-1.462A9.86 9.86 0 0012 20.486C17.523 20.486 22 16.341 22 11.243 22 6.145 17.523 2 12 2z"/>
      </svg>
      WhatsApp
    </a>
    <RouterLink class="bar__btn bar__btn--contact" to="/contact">Contact</RouterLink>
  </div>
</template>

<script>
import { SHOP } from "../shop";

export default {
  name: "MobileCallBar",
  data() {
    return {
      shop: SHOP,
    };
  },
};
</script>

<style scoped>
.bar {
  display: none;
}

@media (max-width: 768px) {
  .bar {
    display: flex;
    gap: 0.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    padding: 0.65rem 0.75rem calc(0.65rem + env(safe-area-inset-bottom, 0));
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--color-border);
    box-shadow: 0 -4px 24px rgba(15, 23, 42, 0.08);
  }

  .bar__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    text-align: center;
    padding: 0.7rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    font-family: inherit;
    border-radius: 999px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    white-space: nowrap;
  }

  .bar__btn:active {
    transform: scale(0.96);
  }

  .bar__btn--call {
    background: var(--color-accent);
    color: #fff;
    box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);
  }

  .bar__btn--whatsapp {
    background: #25d366;
    color: #fff;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
  }

  .bar__btn--contact {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }
}
</style>
