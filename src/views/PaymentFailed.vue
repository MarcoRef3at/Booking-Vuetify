<template>
  <div>
    <lottie-animation
      path="payment-failed.json"
      :loop="false"
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
