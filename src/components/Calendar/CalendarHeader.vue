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
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="$emit('setCalendarType', 'week')">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('setCalendarType', 'month')">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('setCalendarType', '4day')">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: ["calendar", "type"],
  data() {
    return {
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      }
    };
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
