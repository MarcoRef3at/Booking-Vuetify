<template>
  <div>
    <lottie-animation
      path="payment-successful.json"
      :loop="false"
      :autoPlay="true"
      :height="500"
      :width="500"
    />
  </div>
</template>
<script>
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs

export default {
  components: {
    LottieAnimation
  }
};
</script>
