<template>
  <div class="contact-services">
    <div class="services">
      <h2>Our Services</h2>
      <div class="services-list">
        <ul>
          <li>Blood-pressure testing</li>
          <li>Diabetes consultation</li>
          <li>Medication review</li>
          <li>Vaccinations</li>
          <li>Blood Collection</li>
        </ul>
      </div>
    </div>

    <div class="contact-us">
      <h2>Contact Us</h2>
      <strong><p>New Shivam Medicos</p></strong>
      <span id="addr"
        >South Basistha Nagar, near Durga Mandir, Basistha, Guwahati,
        Assam</span
      >
      <div class="contact-info">
        <ul>
          <li>
            <i class="fas fa-phone-alt"></i>
            <strong>Mobile:</strong>
            <a href="tel:+91 8876499294">+91 8876499294</a>
          </li>
          <!-- <li>
            <i class="fas fa-map-marker-alt"></i>
            <strong>Address:</strong>
          </li> -->
          <li>
            <i class="fas fa-map-marker-alt"></i>
            <strong>Directions:</strong>
            <a href="https://g.co/kgs/h3d5zFG" target="_blank"
              >View on Google Maps</a
            >
          </li>
          <li>
            <i class="fas fa-envelope"></i>
            <strong>Email:</strong>
            <a href="mailto:contact@example.com">contact@example.com</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactServices",
};
</script>

<style scoped>
/* General Layout */
.contact-services {
  display: flex;
  flex-direction: column; /* Soft background */
  padding: 40px 20px;
  border-radius: 8px;
}

.contact-us,
.services {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Adding depth */
}

h2 {
  color: #003366;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff; /* Stylish underline */
  padding-bottom: 10px;
}

/* Our Services: Center the list, left-align the items */
.services-list {
  display: flex;
  justify-content: center;
}

.services-list ul {
  text-align: left;
  list-style-type: square;
  padding: 0;
  margin: 0;
}

.services-list li {
  margin-bottom: 10px;
  font-size: 18px;
  color: #555; /* Softer text color */
}

/* Contact Us: Center the list, left-align the items */
.contact-info {
  display: flex;
  justify-content: center;
}

.contact-info ul {
  text-align: left;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.contact-info li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333; /* Softer text color */
}

.contact-info i {
  margin-right: 10px;
  color: #007bff;
}

.contact-info a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold; /* Make links stand out */
}
p {
  font-size: 22px;
  margin-bottom: 5px;
}
#addr {
  display: block;
  margin-bottom: 20px;
}

.contact-info a:hover {
  text-decoration: underline;
}

/* Add hover effects on the services and contact cards */
.services:hover,
.contact-us:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* Desktop view: side-by-side layout */
@media (min-width: 768px) {
  .contact-services {
    flex-direction: row;
    justify-content: space-between;
    padding: 40px 60px; /* Extra padding for larger screens */
  }

  .services,
  .contact-us {
    flex: 1;
    max-width: 45%;
  }
}
</style>
