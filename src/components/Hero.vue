<template>
  <section id="home" class="hero-section">
    <!-- Background Pattern -->
    <div class="background-pattern">
      <div class="blur-circle blur-circle-1"></div>
      <div class="blur-circle blur-circle-2"></div>
    </div>

    <div class="hero-container">
      <div class="hero-content">
        <!-- Badge -->
        <Transition name="fade-up" appear>
          <div class="trust-badge" v-if="showBadge">
            <i class="fas fa-shield-alt"></i>
            <span>Your Trusted Neighborhood Pharmacy</span>
          </div>
        </Transition>

        <!-- Main Heading -->
        <Transition name="fade-up" appear>
          <h1 class="hero-heading" v-if="showHeading">
            Welcome to <span class="heading-main">New Shivam Medicos</span>
          </h1>
        </Transition>

        <!-- Description -->
        <Transition name="fade-up" appear>
          <p class="hero-description" v-if="showDescription">
            Quality medicines, expert care, and seamless service. Upload prescriptions, 
            book appointments, and get medicines delivered to your doorstep.
          </p>
        </Transition>

        <!-- CTA Buttons -->
        <Transition name="fade-up" appear>
          <div class="hero-buttons" v-if="showButtons">
            <button class="btn-primary" @click="uploadPrescription">
              <i class="fas fa-arrow-up"></i>
              Upload Prescription
            </button>
            <button class="btn-secondary" @click="browseMedicines">
              Browse Medicines
            </button>
          </div>
        </Transition>

        <!-- Feature Pills -->
        <Transition name="fade-up" appear>
          <div class="features-grid" v-if="showFeatures">
            <div
              v-for="(feature, index) in features"
              :key="feature.label"
              class="feature-card"
              :style="{ animationDelay: `${0.6 + index * 0.15}s` }"
            >
              <div class="feature-icon-wrapper">
                <i :class="feature.icon"></i>
              </div>
              <span class="feature-label">{{ feature.label }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Hero",
  data() {
    return {
      showBadge: false,
      showHeading: false,
      showDescription: false,
      showButtons: false,
      showFeatures: false,
      features: [
        { icon: "fas fa-upload", label: "Upload Prescription" },
        { icon: "fas fa-calendar-alt", label: "Book Appointment" },
        { icon: "fas fa-truck", label: "Fast Delivery" },
        { icon: "fas fa-shield-alt", label: "100% Genuine" },
      ],
    };
  },
  mounted() {
    // Stagger animations with smoother timing
    requestAnimationFrame(() => {
      this.showBadge = true;
      setTimeout(() => (this.showHeading = true), 150);
      setTimeout(() => (this.showDescription = true), 300);
      setTimeout(() => (this.showButtons = true), 450);
      setTimeout(() => (this.showFeatures = true), 600);
    });
  },
  methods: {
    uploadPrescription() {
      console.log("Upload prescription clicked");
      // You can add your upload logic here
    },
    browseMedicines() {
      console.log("Browse medicines clicked");
      // You can add navigation or modal logic here
    },
  },
};
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%);
  padding: 120px 20px 80px;
  margin-top: 0; /* Navbar is now sticky, no margin needed */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  pointer-events: none;
}

.blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.blur-circle-1 {
  top: 80px;
  left: 40px;
  width: 288px;
  height: 288px;
  background: rgba(16, 185, 129, 0.2);
}

.blur-circle-2 {
  bottom: 80px;
  right: 40px;
  width: 384px;
  height: 384px;
  background: rgba(59, 130, 246, 0.2);
}

.hero-container {
  position: relative;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.hero-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  z-index: 1;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  color: #065f46;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}

.trust-badge i {
  font-size: 16px;
}

.hero-heading {
  margin: 0;
  line-height: 1.2;
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.03em;
}

.heading-main {
  color: #10b981;
  display: inline-block;
}

.hero-description {
  font-size: 18px;
  color: #4b5563;
  line-height: 1.6;
  max-width: 650px;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.hero-buttons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.01em;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-primary i {
  font-size: 14px;
}

.btn-secondary {
  background-color: white;
  color: #10b981;
  border: 2px solid #10b981;
}

.btn-secondary:hover {
  background-color: #f0fdf4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 800px;
  width: 100%;
  margin-top: 20px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.feature-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Animations */
.fade-up-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.feature-card {
  animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  will-change: opacity, transform;
}

/* Responsive Design */
@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .hero-heading {
    font-size: 56px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 550px;
    padding: 100px 15px 60px;
  }

  .trust-badge {
    font-size: 12px;
    padding: 8px 16px;
  }

  .hero-heading {
    font-size: 32px;
  }

  .hero-description {
    font-size: 16px;
    padding: 0 10px;
  }

  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 14px 28px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .feature-card {
    padding: 20px 12px;
  }

  .feature-icon-wrapper {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .feature-label {
    font-size: 12px;
  }

  .blur-circle-1 {
    width: 200px;
    height: 200px;
  }

  .blur-circle-2 {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 500px;
    padding: 30px 10px 50px;
  }

  .hero-heading {
    font-size: 28px;
  }

  .hero-description {
    font-size: 14px;
  }
}
</style>
