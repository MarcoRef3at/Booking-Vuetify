<template>
  <div>
    <v-container>
      <v-row>
        <v-alert
          color="red"
          width="100%"
          elevation="10"
          type="error"
          v-if="overlapping"
          >Selected Time Overlaps another reservation</v-alert
        >
        <!-- Date Picker -->
        <v-col cols="12">
          <DatePicker :parentDate="date" @setDate="setDate" />
        </v-col>

        <!-- TimeFrom Picker -->
        <v-col cols="11" sm="6">
          <TimePicker
            :title="'Time From'"
            :parentTime="timeFrom"
            @setTime="setTimeFrom"
          />
        </v-col>
        <v-col cols="11" sm="6">
          <TimePicker
            :title="'Time to'"
            :parentTime="timeTo"
            @setTime="setTimeTo"
          />
        </v-col>

        <!-- Court Select -->
        <v-col cols="12" sm="6">
          <v-select
            :items="['Court 1', 'Court 2']"
            label="Select Court"
            required
          ></v-select>
        </v-col>

        <!-- Details -->
        <v-col cols="12">
          <v-text-field label="First Name" required></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="Last Name"
            hint="example of persistent helper text"
            persistent-hint
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field label="Email" required></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field label="Phone" required></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <small>*indicates required field</small>
  </div>
</template>
<script>
import TimePicker from "./TimePicker.vue";
import DatePicker from "./DatePicker.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    DatePicker,
    TimePicker
  },
  data() {
    return {
      notes: "",
      date: "",
      timeFrom: "",
      timeTo: "",
      overlapping: false
    };
  },
  mounted() {
    this.date = this.getDate;
    this.timeFrom = this.getTimeFrom;
    this.timeTo = this.getTimeTo;
  },

  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getTimeFrom", "getTimeTo", "getDate"])
  },
  methods: {
    ...mapActions("events", ["updateSelectedEvent", "checkOverlapping"]),
    setDate(date) {
      this.date = date;
    },
    setTimeFrom(timeFrom) {
      let hours = timeFrom.split(":")[0];
      let minutes = timeFrom.split(":")[1];
      this.timeFrom = timeFrom;

      // let eventStart = new Date(this.selectedEvent.start);
      // eventStart.setHours(hours, minutes);
      // let event = this.selectedEvent;
      // event.start = eventStart;
      // this.updateSelectedEvent(event);
    },
    setTimeTo(timeTo) {
      let hours = timeTo.split(":")[0];
      let minutes = timeTo.split(":")[1];
      this.timeTo = timeTo;
      this.updateEvent();

      // let eventStart = new Date(this.selectedEvent.end);
      // eventStart.setHours(hours, minutes);
      // let event = this.selectedEvent;
      // event.end = eventStart;
      // this.updateSelectedEvent(event);
    },
    updateEvent() {
      let hoursFrom = this.timeFrom.split(":")[0];
      let minutesFrom = this.timeFrom.split(":")[1];
      let hoursTo = this.timeTo.split(":")[0];
      let minutesTo = this.timeTo.split(":")[1];
      let start = new Date(this.date).setHours(hoursFrom, minutesFrom);
      let end = new Date(this.date).setHours(hoursTo, minutesTo);

      this.checkOverlapping({
        start,
        end,
        eventId: this.selectedEvent.id
      }).then(isOverlapping => {
        if (!isOverlapping) {
          this.overlapping = false;
          let event = this.selectedEvent;
          event.start = start;
          event.end = end;
          this.updateSelectedEvent(event);
        } else {
          this.overlapping = true;
        }
      });

      // console.log("isOverlapping:", isOverlapping());
    }
  }
};
</script>
