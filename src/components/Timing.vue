<template>
  <div class="shop-status" :class="{ open: isOpen }">
    <div class="status-message">
      <h2 v-if="isOpen">We're Open!</h2>
      <h2 v-else>We're Closed!</h2>
    </div>
    <div class="shop-timings">
      <p>Open 8:30 AM - 2:00 PM & 4:00 PM - 10:00 PM</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      morningOpen: "08:30",
      morningClose: "14:00",
      eveningOpen: "16:00",
      eveningClose: "22:00",
    };
  },
  computed: {
    isOpen() {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const morningOpenTime = this.timeToMinutes(this.morningOpen);
      const morningCloseTime = this.timeToMinutes(this.morningClose);
      const eveningOpenTime = this.timeToMinutes(this.eveningOpen);
      const eveningCloseTime = this.timeToMinutes(this.eveningClose);

      return (
        (currentTime >= morningOpenTime && currentTime < morningCloseTime) ||
        (currentTime >= eveningOpenTime && currentTime < eveningCloseTime)
      );
    },
  },
  methods: {
    timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },
    formatTime(time) {
      const [hours, minutes] = time.split(":");
      const hour = hours % 12 || 12; // Convert to 12-hour format
      return `${hour}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
    },
  },
};
</script>

<style scoped>
.shop-status {
  margin-top: 73px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 5px;
  font-family: Arial, sans-serif;
}

.open {
  background-color: #e0f7fa;
  color: #00796b;
}

.shop-status:not(.open) {
  background-color: #ffebee;
  color: #c62828;
}

.status-message h2 {
  font-size: 1.5rem;
  margin: 0;
}

.shop-timings p {
  margin: 5px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .status-message h2 {
    font-size: 1.2rem;
  }
  .shop-timings p {
    font-size: 0.9rem;
  }
}
</style>
