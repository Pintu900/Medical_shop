<template>
  <div class="sticky-bottom sk-web-hide sk-sticky" id="dvmobsticky">
    <div class="sk-button-group sk-flex-justify-center">
      <button
        title="Chat with us"
        class="sk-button sk-primary-outline"
        @click="makeCall"
        aria-label="Call Now"
      >
        📞 Call Now
      </button>

      <button
        title="Contact us"
        class="sk-button sk-primary"
        @click="contactUs"
        aria-label="Contact Us"
      >
        Contact Us
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  methods: {
    // Method to initiate the call
    makeCall() {
      // Replace this with actual call handling logic if needed
      window.location.href = `tel:${this.phoneNumber}`;
    },
    // Method to handle the contact us functionality
    contactUs() {
      console.log("contact us clicked");
      // Add your actual contact logic here
    },
  },
};
</script>

<style scoped>
/* Hide the button by default */
#dvmobsticky {
  display: none;
}

/* Show only on mobile screens (max-width: 768px) */
@media (max-width: 768px) {
  #dvmobsticky {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    z-index: 1000;
    padding: 10px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  }

  .sk-button-group {
    display: flex;
    justify-content: center;
  }

  .sk-button {
    font-size: 18px;
    padding: 5px 15px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .sk-primary-outline {
    background-color: transparent;
    border: 2px solid #003366; /* Dark blue border */
    color: #003366; /* Dark blue text */
  }

  .sk-primary {
    background-color: #003366; /* Dark blue background */
    color: white;
  }

  .sk-primary:hover,
  .sk-primary-outline:hover {
    opacity: 0.8;
  }
}
</style>
