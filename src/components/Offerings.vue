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
    <div class = "line">
      <h2>Our Offerings</h2>
    </div>
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
  padding: 40px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  color: #10b981;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
  font-size: 32px;
  margin-bottom: 25px;
  border-bottom: 3px solid #10b981;
  padding-bottom: 10px;
  letter-spacing: -0.02em;
}

.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Space between items */
}

.item {
  height: 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  border: 2px solid #d1fae5;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  transition: all 0.3s ease;
}
.tag {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  color: white; 
  font-weight: 600;
  padding: 10px 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
}
.line{
   width: 50%;
  }

.item i {
  font-size: 40px;
  color: #10b981;
  margin-bottom: 15px;
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
  font-weight: 600;
  color: #1f2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

.item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  border-color: #10b981;
  cursor: pointer;
}

/* Responsive styles */
@media (max-width: 768px) {
  .item {
    width: 45%; /* Two cards per row */
  }
  .line{
   width: 100%;
  }
}
</style>
