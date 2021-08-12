<template>
  <div>
    <iframe
      :src="getIframeSrc"
      width="100%"
      height="100%"
      scrolling="yes"
      frameborder="0"
      style="
                    overflow: hidden;
                    overflow-x: hidden;
                    overflow-y: hidden;
                    position: fixed;"
    ></iframe>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("events", ["getIframeSrc"])
  }
};
</script>
