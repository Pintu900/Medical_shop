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
    background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
    z-index: 1000;
    padding: 10px;
    box-shadow: 0px -4px 20px rgba(16, 185, 129, 0.2);
    border-top: 2px solid #d1fae5;
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
    border: 2px solid #10b981;
    color: #10b981;
    font-weight: 600;
  }

  .sk-primary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }

  .sk-primary:hover,
  .sk-primary-outline:hover {
    opacity: 0.8;
  }
}
</style>
