<script>
export default {
  name: "Offerings",
  props: {
    msg: String,
  },
};
</script>

<template>
  <section class="offerings-section">
    <h2>Our Offerings</h2>
    <div class="container">
      <div class="item">
        <div class="tag">coming soon</div>
        <div class="item1">
        <i class="fas fa-user-md"></i>
        <p>Book Doctor's Appointment</p>
      </div>
      </div>
      <div class="item">
        <div class="tag">coming soon</div>
        <div class="item1">
        <i class="fas fa-tint"></i>
        <p>Book Blood Collection</p>
      </div>
      </div>
      <div class="item">
        <div class="tag">coming soon</div>
        <div class="item1">
        <i class="fas fa-syringe"></i>
        <p>Diabetes Consultation</p>
      </div>
      </div>
      <div class="item">
        <div class="tag">coming soon</div>
        <div class="item1">
        <i class="fas fa-shopping-cart"></i>
        <p>Order Medicine Online</p>
      </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif; /* Use the imported font */
}

.offerings-section {
  padding: 40px;
  background-color: #f9f9f9;
  text-align: center;
}

h2 {
  color: #003366;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 25px;
  border-bottom: 2px solid #007bff; /* Stylish underline */
  padding-bottom: 10px;
}

.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Space between items */
}

.item {
  height: 200px; /* Increased height for illustration */
  width: 200px; /* Adjust width for better fit */
  display: flex;
  flex-direction: column; /* Stack icon and text */
  border: 1px solid #ccc;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.tag {
  background-color: #e74c3c; /* Slightly softer red for a modern look */
  border-top-left-radius: 15px; /* Rounded top-left corner */
  border-top-right-radius: 15px; /* Rounded top-right corner */
  color: white; 
  font-weight: 500;
  padding: 10px 15px; 
}

.item i {
  font-size: 35px; /* Icon size */
  color: #007bff; /* Icon color */
  margin-bottom: 10px; /* Space between icon and text */
}
.item1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 4;
  padding: 20px;
}

.item p {
  font-weight: 500; /* Regular font weight */
  color: #555; /* Lighter text color */
}

.item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* Responsive styles */
@media (max-width: 768px) {
  .item {
    width: 45%; /* Two cards per row */
  }
}
</style>
