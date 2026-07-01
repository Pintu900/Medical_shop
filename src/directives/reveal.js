const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const revealDirective = {
  mounted(el, binding) {
    el.classList.add("reveal");
    const opts = binding.value || {};
    if (opts.delay) el.style.transitionDelay = `${opts.delay}ms`;

    if (prefersReducedMotion) {
      el.classList.add("reveal-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("reveal-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    el.__revealObserver = observer;
  },
  unmounted(el) {
    if (el.__revealObserver) el.__revealObserver.disconnect();
  },
};
