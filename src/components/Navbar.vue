<template>
  <nav class="navbar">
    <!-- Logo Section -->
    <div class="navbar-logo">
      <RouterLink to="/">
      <img src="@/assets/logo2.png" alt="New Shivam Medicos Logo" />
    </RouterLink>
    </div>

    <!-- Hamburger Menu Icon (Mobile View) -->
    <div class="hamburger" @click="toggleMenu">
      <div :class="{ 'is-active': menuOpen }" class="hamburger-lines"></div>
    </div>

    <!-- Menu Section -->
    <div :class="['navbar-menu', { 'menu-open': menuOpen }]">
      <ul class="menu-items">
        <li><RouterLink to="/"><i class="fas fa-home icon-small"></i> Home</RouterLink></li>
        <li><RouterLink to="/about"><i class="fas fa-address-card icon-small"></i> About</RouterLink></li>
        <li><RouterLink to="/services"><i class="fas fa-cog icon-small"></i> Services</RouterLink></li>
        <li><RouterLink to="/contact"><i class="fas fa-phone-square-alt icon-small"></i> Contact</RouterLink></li>
      </ul>
      <button class="signup-button">Sign Up</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      menuOpen: false, // Controls whether the menu is open or closed
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      console.log("Menu Open:", this.menuOpen); // Debugging line
    },
  },
};
</script>

<style scoped>
/* Navbar Container */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  position: fixed; /* Fixed positioning as a fallback */
  top: 0; /* Sticks it to the top */
  left: 0;
  width: 100%; /* Ensures it spans the full width */
  box-sizing: border-box; /* Includes padding and border in the width */
  z-index: 1000; /* Ensures it stays above other content */
}

/* Logo Section */
.navbar-logo {
  display: flex;
  align-items: center;
}
.navbar-logo img {
  height: 35px; /* Adjust the height as needed */
  width: auto; /* Maintain aspect ratio */
  /* Add padding if necessary */
}
/* Menu Section (Desktop View) */
.navbar-menu {
  display: flex;
  align-items: center;
  box-sizing: border-box; /* Includes padding and border in the width */
  transition: all 0.3s ease; /* Smooth transition */
}

.menu-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Includes padding and border in the width */
}
.menu-items li{
  margin: 0 2px;
}

li a.router-link-exact-active {
  border-bottom: 2px solid rgb(13, 22, 33);
}
li a.router-link-exact-active:hover {
  background-color: transparent;
}

li a:hover{
  background-color: rgba(106, 181, 242, 0.52);
  transition:0.4s;
}

.menu-items li a {
  text-decoration: none;
  color: #003366;
  font-weight: 500;
  font-size: 16px;
  padding: 0 13px;
}
.icon-small {
  display: none; /* Hide by default */
}
/* Signup Button */
.signup-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 20px; /* Adjust margin as necessary */
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: #0056b3;
}

/* Hamburger Icon (Mobile View) */
.hamburger {
  display: none;
  cursor: pointer;
}

.hamburger-lines {
  width: 30px;
  height: 3px;
  background-color: #333;
  position: relative;
  transition: all 0.3s ease-in-out;
}

.hamburger-lines::before,
.hamburger-lines::after {
  content: "";
  width: 30px;
  height: 3px;
  background-color: #333;
  position: absolute;
  left: 0;
  transition: all 0.3s ease-in-out;
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
  transform: rotate(45deg);
  top: 0;
}

.is-active::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Responsive Styling for Mobile */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background-color: white;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensures it stays above other content */
  }

  .menu-open {
    display: flex;
  }

  .menu-items {
    flex-direction: column;
    align-items: flex-start;
  }

  .menu-items li {
    margin: 10px 0;
  }
  .icon-small {
  display: inline; /* Hide by default */
}

  .signup-button {
    margin: 15px 0;
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
  .navbar-logo .logo {
    height: 40px;
  }
}
</style>
