<template>
  <v-app class="fill-height">
    <v-app-bar app color="rgba(103, 176, 209, 0.8)" dark>
      <div class="d-flex align-center">
        <!-- <a @click="$router.push('/')">
          <v-img
            alt="Home Page"
            class="shrink mt-1 "
            contain
            min-width="100"
            :src="logoUrl"
            width="100"
        /></a> -->
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="$router.push('/courts')" text>
        <span class="mr-2">Book Now</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      logoUrl: require("../public/assets/img/padel-logo.png")
    };
  }
};
</script>
