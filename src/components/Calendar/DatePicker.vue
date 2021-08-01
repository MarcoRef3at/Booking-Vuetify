<template>
  <div>
    <v-dialog
      v-model="menu2"
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
      <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getDate"]),
    ...mapActions("events", ["updateSelectedEvent"]),
    date: {
      get() {
        let eventDate = new Date(this.selectedEvent.start);

        eventDate =
          eventDate.getFullYear() +
          "-" +
          (eventDate.getMonth() + 1) +
          "-" +
          eventDate.getDate();
        return eventDate;
      },
      set(date) {
        date = date.split("-");
        let newDate = new Date(date[2], date[1] - 1, date[0]);
        this.updateSelectedEvent(newDate);
      },
    },
  },

  data: () => ({
    // date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    //   .toISOString()
    //   .substr(0, 10),
    menu: false,
    menu2: false,
  }),
};
</script>
