<template>
  <v-app class="fill-height">
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <a href="/">
          <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            :src="logoUrl"
            width="100"
        /></a>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="/courts" text>
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
