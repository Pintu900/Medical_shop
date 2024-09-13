<template>
  <div id="app">
    <!-- This is where the Elfsight widget will be embedded -->
    <div
      class="elfsight-app-cb2f67e2-5d10-45ba-bd1d-a9be750a8ae3"
      data-elfsight-app-lazy
    ></div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Dynamically load the Elfsight script
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);
  },
};
</script>

<style>
/* Add custom styles if needed */
</style>
