<template>
  <div class="navbar-wrapper" :class="{ 'scrolled': isScrolled }">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="top-bar-container">
        <div class="top-bar-left">
          <span class="top-bar-item">
            <i class="fas fa-phone-alt"></i>
            <a href="tel:+918876499294">+91 8876499294</a>
          </span>
          <span class="top-bar-item top-bar-item-hidden">
            <i class="fas fa-clock"></i>
            Open: 8:30 AM - 2:00 PM & 4:00 PM - 10:00 PM
          </span>
        </div>
        <span class="top-bar-item">
          <i class="fas fa-map-marker-alt"></i>
          Basistha, Guwahati
        </span>
      </div>
    </div>

    <!-- Main Navbar -->
    <nav class="navbar">
    <!-- Logo Section -->
    <div class="navbar-logo">
      <a href="#home" @click="scrollToSection('home')" class="logo-link">
        <div class="logo-icon">
          <span class="logo-text">NS</span>
        </div>
        <div class="logo-text-container">
          <span class="logo-name">New Shivam</span>
          <span class="logo-subtitle">Medicos</span>
        </div>
      </a>
    </div>

    <!-- Hamburger Menu Icon (Mobile View) -->
    <div class="hamburger" @click="toggleMenu">
      <div :class="{ 'is-active': menuOpen }" class="hamburger-lines"></div>
    </div>

    <!-- Menu Section -->
    <div :class="['navbar-menu', { 'menu-open': menuOpen }]">
      <ul class="menu-items">
        <li>
          <RouterLink to="/" class="menu-link">
            <i class="fas fa-home icon-small"></i> 
            <span>Home</span>
            <div class="link-underline"></div>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about" class="menu-link">
            <i class="fas fa-address-card icon-small"></i> 
            <span>About</span>
            <div class="link-underline"></div>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/services" class="menu-link">
            <i class="fas fa-cog icon-small"></i> 
            <span>Services</span>
            <div class="link-underline"></div>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/contact" class="menu-link">
            <i class="fas fa-phone-square-alt icon-small"></i> 
            <span>Contact</span>
            <div class="link-underline"></div>
          </RouterLink>
        </li>
      </ul>
      <button class="signup-button">
        <span>Sign Up</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      menuOpen: false, // Controls whether the menu is open or closed
      isScrolled: false, // Controls whether the navbar has scrolled
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      console.log("Menu Open:", this.menuOpen);
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 10;
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Account for top bar (32px) + navbar (64px)
        const topBarHeight = 32;
        const navbarHeight = 64;
        const totalHeight = topBarHeight + navbarHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - totalHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        this.menuOpen = false;
      }
    },
  },
};
</script>

<style scoped>
/* Navbar Wrapper */
.navbar-wrapper {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  transition: all 0.3s ease;
}

.navbar-wrapper.scrolled .navbar {
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.98);
}

/* Top Bar */
.top-bar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 8px 0;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.top-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.top-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.top-bar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  position: relative;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.top-bar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.top-bar-item i {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.top-bar-item:hover i {
  transform: scale(1.1);
}

.top-bar-item a {
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.top-bar-item a:hover {
  opacity: 0.9;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Navbar Container */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  position: -webkit-sticky; /* Safari support */
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
  text-align: left;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Logo Section */
.navbar-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.2s;
}

.logo-link:hover {
  transform: translateX(-2px);
}

.logo-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.logo-link:hover .logo-icon {
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  transform: scale(1.05) rotate(5deg);
}

.logo-link:hover .logo-icon::before {
  width: 100px;
  height: 100px;
}

.logo-text {
  color: white;
  font-weight: 700;
  font-size: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.02em;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-weight: 700;
  font-size: 20px;
  color: #1f2937;
  line-height: 1.2;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.logo-link:hover .logo-name {
  color: #10b981;
}

.logo-subtitle {
  font-size: 13px;
  color: #10b981;
  font-weight: 600;
  margin-top: -2px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.01em;
  transition: all 0.3s ease;
}

.logo-link:hover .logo-subtitle {
  color: #059669;
  transform: translateX(2px);
}
/* Menu Section (Desktop View) */
.navbar-menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.menu-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  gap: 4px;
}

.menu-items li {
  margin: 0;
  position: relative;
}

.menu-link {
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  font-size: 16px;
  padding: 10px 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.menu-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.menu-link:hover::before {
  opacity: 1;
}

.menu-link:hover {
  color: #10b981;
  transform: translateY(-2px);
}

.menu-link .link-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #059669);
  transform: translateX(-50%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.menu-link:hover .link-underline {
  width: 80%;
}

.menu-link.router-link-exact-active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.menu-link.router-link-exact-active .link-underline {
  width: 80%;
}

.menu-link.router-link-exact-active:hover {
  background: rgba(16, 185, 129, 0.12);
}
.icon-small {
  display: none; /* Hide by default */
}
/* Signup Button */
.signup-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.signup-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.signup-button:hover::before {
  left: 100%;
}

.signup-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.signup-button:active {
  transform: translateY(-1px) scale(0.98);
}

.signup-button i {
  transition: transform 0.3s ease;
}

.signup-button:hover i {
  transform: translateX(4px);
}

/* Hamburger Icon (Mobile View) */
.hamburger {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.hamburger:hover {
  background: rgba(16, 185, 129, 0.1);
}

.hamburger-lines {
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #059669);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.hamburger-lines::before,
.hamburger-lines::after {
  content: "";
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #059669);
  position: absolute;
  left: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.hamburger-lines::before {
  top: -8px;
}

.hamburger-lines::after {
  top: 8px;
}

/* When the Hamburger Menu is Active (Transforms into an "X") */
.is-active {
  background-color: transparent;
}

.is-active::before {
  transform: rotate(45deg) translate(5px, 5px);
  top: 0;
}

.is-active::after {
  transform: rotate(-45deg) translate(5px, -5px);
  top: 0;
}

/* Responsive Styling for Mobile */
@media (max-width: 768px) {
  .top-bar {
    font-size: 12px;
    padding: 6px 0;
  }

  .top-bar-container {
   margin: 3px 10px;
  }

  .top-bar-left {
    gap: 16px;
  }

  .top-bar-item {
    font-size: 12px;
    gap: 4px;
  }

  .top-bar-item i {
    font-size: 12px;
  }

  .top-bar-item-hidden {
    display: none;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 64px;
    right: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.98) 100%);
    backdrop-filter: blur(20px);
    width: 100%;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
    border-top: 2px solid rgba(16, 185, 129, 0.2);
    z-index: 1000;
    padding: 20px;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .menu-open {
    display: flex;
  }

  .menu-items {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 8px;
  }

  .menu-items li {
    margin: 0;
    width: 100%;
  }

  .menu-link {
    width: 100%;
    padding: 14px 16px;
    border-radius: 10px;
    justify-content: flex-start;
  }

  .menu-link:hover {
    transform: translateX(4px);
  }

  .icon-small {
    display: inline;
    font-size: 18px;
  }

  .signup-button {
    margin: 10px 0 0 0;
    width: 100%;
    justify-content: center;
    padding: 12px 24px;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 40px;
    height: 40px;
  }

  .logo-text {
    font-size: 18px;
  }

  .logo-name {
    font-size: 18px;
  }

  .logo-subtitle {
    font-size: 12px;
  }

  .logo-link {
    gap: 10px;
  }
}
</style>
