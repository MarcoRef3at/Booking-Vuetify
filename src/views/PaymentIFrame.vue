<template>
  <div>
    <lottie-animation
      path="payment-loading.json"
      :loop="true"
      :autoPlay="true"
      :height="400"
      :width="400"
      style=" overflow: hidden;
      top:0;
      bottom:0;
      left:0;
      right:0;
                   position: absolute;"
    />
    <iframe
      :src="getIframeSrc"
      width="100%"
      height="100%"
      scrolling="yes"
      frameborder="0"
      allowtransparency="false"
      style="
                    overflow: hidden;
                    overflow-x: hidden;
                    overflow-y: hidden;
                    position: absolute;"
    ></iframe>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs
export default {
  components: {
    LottieAnimation
  },
  computed: {
    ...mapGetters("events", ["getIframeSrc"])
  }
};
</script>
