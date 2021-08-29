<template>
  <div>
    <template>
      <v-card class="mx-auto" max-width="344">
        <v-carousel
          cycle
          height="200"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide" height="200px"></v-img>
          </v-carousel-item>
        </v-carousel>

        <v-card-title>
          {{ title }}
        </v-card-title>

        <v-card-subtitle>
          {{ subtitle }}
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            rounded
            color="primary"
            dark
            @click="
              $router.push({ path: '/calendar', query: { court: title } })
            "
          >
            Book {{ title }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              {{ description }}
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </template>
  </div>
</template>
<script>
export default {
  props: ["slides", "title", "description", "subtitle"],
  data: () => ({
    show: false
  })
};
</script>
