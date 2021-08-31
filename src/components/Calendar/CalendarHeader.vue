<template>
  <div>
    <v-sheet height="64">
      <v-toolbar flat>
        <!-- Today Button -->
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="$emit('setToday')"
        >
          Today
        </v-btn>

        <!-- Previous Button -->
        <v-btn fab text small color="grey darken-2" @click="$emit('prev')">
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>

        <!-- Next Button -->
        <v-btn fab text small color="grey darken-2" @click="$emit('next')">
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>

        <!-- Calendar Title -->
        <v-toolbar-title v-if="calendar">
          {{ calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="calendar">
          {{ getCourtName() }}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Calendar Type Menu -->
      </v-toolbar>
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: ["calendar", "type"],
  data() {
    return {};
  },
  methods: {
    getCourtName() {
      return "court" in this.$route.query
        ? this.$route.query.court
        : "Any Court";
    }
  }
};
</script>
