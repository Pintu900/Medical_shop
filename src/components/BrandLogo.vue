<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <defs>
      <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#10B981" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>

      <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="100%" stop-color="#2563EB" />
      </linearGradient>

      <linearGradient id="darkGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0F766E" />
        <stop offset="100%" stop-color="#064E3B" />
      </linearGradient>
    </defs>

    <!-- Top arm -->
    <rect
      x="88"
      y="20"
      width="80"
      height="120"
      rx="28"
      fill="url(#greenGradient)"
    />

    <!-- Left arm -->
    <rect
      x="20"
      y="88"
      width="120"
      height="80"
      rx="28"
      fill="url(#greenGradient)"
    />

    <!-- Bottom arm -->
    <rect
      x="88"
      y="116"
      width="80"
      height="120"
      rx="28"
      fill="url(#darkGradient)"
    />

    <!-- Right arm -->
    <rect
      x="116"
      y="88"
      width="120"
      height="80"
      rx="28"
      fill="url(#blueGradient)"
    />

    <!-- Center overlap -->
    <path
      d="M128 128
         C150 95, 175 90, 200 90
         L200 168
         C175 168, 150 160, 128 128Z"
      fill="#67E8F9"
      opacity="0.85"
    />

    <path
      d="M128 128
         C105 105, 90 95, 20 95
         L20 168
         C70 168, 100 175, 128 128Z"
      fill="#0F766E"
      opacity="0.7"
    />
  </svg>
</template>

<script>
export default {
  name: "BrandLogo",
  props: {
    size: {
      type: [Number, String],
      default: 44,
    },
  },
};
</script>