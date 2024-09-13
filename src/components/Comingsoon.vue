<template>
  <div class="coming-soon">
    <h1 class="title">Coming Soon!</h1>
    <p class="description">We’re working hard to bring something exciting to you.</p>
    <div class="countdown">
      <div class="time-unit">
        <span class="number">{{ days }}</span>
        <span class="label">Days</span>
      </div>
      <div class="time-unit">
        <span class="number">{{ hours }}</span>
        <span class="label">Hours</span>
      </div>
      <div class="time-unit">
        <span class="number">{{ minutes }}</span>
        <span class="label">Minutes</span>
      </div>
      <div class="time-unit">
        <span class="number">{{ seconds }}</span>
        <span class="label">Seconds</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoon',
  data() {
    return {
      targetDate: new Date('2024-12-31T23:59:59'), // Set your target date here
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  },
  methods: {
    updateCountdown() {
      const now = new Date();
      const timeRemaining = this.targetDate - now;
      
      this.days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    }
  },
  created() {
    this.updateCountdown();
    setInterval(this.updateCountdown, 1000); // Update countdown every second
  }
}
</script>

<style scoped>
.coming-soon {
  text-align: center;
  padding: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
}

.title {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.description {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 20px;
}

.countdown {
  display: flex;
  justify-content: space-around;
}

.time-unit {
  text-align: center;
}

.number {
  font-size: 2em;
  color: #007bff;
}

.label {
  font-size: 0.8em;
  color: #666;
}
</style>
