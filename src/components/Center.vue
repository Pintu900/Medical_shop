<template>
  <div class="container">
    <div class="content">
      <div class="left-side">
        <img src="@/assets/doctor.webp" alt="Sample Image" />
      </div>
      <div class="right-side">
        <h2>Your Health, Our Mission</h2>
        <p>
          At our pharmacy, we provide personalized care with precision and
          safety. Our pharmacists are here to support your health with expert
          advice and medication management.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BodyComponent",
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  max-width: 1200px;
  width: 100%;
  flex-wrap: nowrap;
  padding: 10px;
}

.left-side {
  flex: 3; /* 60% of the space */
}

.right-side {
  flex: 2; /* 40% of the space */
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; /* Align text to the left */
}

.left-side img {
  width: 100%;
  height: auto; /* Maintain aspect ratio */
}

/* Style for h2 */
.right-side h2 {
  color: #003366; /* Deep blue color */
  font-family: "Arial", sans-serif; /* Customize with desired font family */
  font-weight: bold; /* Bold font style */
  font-size: 28px; /* Adjust font size */
  margin-bottom: 10px; /* Space between h2 and p */
}

/* Optional styling for p */
.right-side p {
  font-family: "Verdana", sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .left-side,
  .right-side {
    width: 100%; /* Full width on mobile */
  }

  .right-side {
    padding-left: 0;
    display: block; /* Reset the flexbox on mobile */
  }
}
</style>
