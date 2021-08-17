<template>
  <div>
    <lottie-animation
      path="payment-failed.json"
      :loop="false"
      :height="500"
      :width="500"
      :autoPlay="true"
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
