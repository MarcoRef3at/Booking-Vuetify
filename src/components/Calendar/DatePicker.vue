<template>
  <div>
    <v-dialog
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="Picker without buttons"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("events", ["updateSelectedEvent"]),
    timeFormatter(eventDate) {
      eventDate =
        eventDate.getFullYear() +
        "-" +
        (eventDate.getMonth() + 1) +
        "-" +
        eventDate.getDate();
      return eventDate;
    }
  },
  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getDate"]),

    date: {
      get() {
        return this.getDate;
      },
      set(dateToSet) {
        let timestamp = new Date(dateToSet).getTime();
        let event = this.selectedEvent;
        event.start = timestamp;
        this.updateSelectedEvent(event);
      }
    }
  },

  data: () => ({
    data: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false
  })
};
</script>
