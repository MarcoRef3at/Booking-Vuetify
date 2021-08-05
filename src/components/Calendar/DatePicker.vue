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
  props: ["parentDate"],
  methods: {
    ...mapActions("events", ["updateSelectedEvent", "checkOverlapping"]),
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
        return this.parentDate;
      },
      set(date) {
        this.$emit("setDate", date);
      }
    }

    // date: {
    //   get() {
    //     return this.getDate;
    //   },
    //   set(dateToSet) {
    // Extract Date Details needed to set
    // let day = new Date(dateToSet).getDate();
    // let month = new Date(dateToSet).getMonth();
    // let year = new Date(dateToSet).getFullYear();
    // // Extract Previous Timestamp
    // let eventStartDate = new Date(this.selectedEvent.start);
    // // Change Dates only in Previous Timestamp
    // eventStartDate.setDate(day); //day
    // eventStartDate.setMonth(month); //Month
    // eventStartDate.setFullYear(year); //Year
    // let startTimestamp = eventStartDate.getTime();
    // // Extract Previous Timestamp
    // let eventEndDate = new Date(this.selectedEvent.end);
    // // Change Dates only in Previous Timestamp
    // eventEndDate.setDate(day); //day
    // eventEndDate.setMonth(month); //Month
    // eventEndDate.setFullYear(year); //Year
    // let endTimestamp = eventEndDate.getTime();
    // (async () => {
    //   let isOverlapping = await this.checkOverlapping({
    //     start: startTimestamp,
    //     end: endTimestamp,
    //     eventId: this.selectedEvent.id
    //   });
    //   if (!isOverlapping) {
    // Get selectedEvent Object to change one parameter in it
    // let event = this.selectedEvent;
    // event.start = startTimestamp;
    // event.end = endTimestamp;
    // this.updateSelectedEvent(event);
    //   }
    // })();
    // }
    // }
  },

  data: () => ({
    menu: false
  })
};
</script>
