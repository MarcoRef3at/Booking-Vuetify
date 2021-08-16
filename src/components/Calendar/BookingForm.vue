<template>
  <v-container>
    <v-row>
      <!-- Overlap Warning -->
      <v-alert
        color="red"
        width="100%"
        elevation="10"
        type="error"
        v-if="errorMessage"
        >{{ errorMessage }}</v-alert
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
        <!-- v-model="selectedCourt"
            :items="courts"
            label="Select Court"
            required -->
        <v-select
          v-model="selectedCourt"
          :items="courts"
          label="Select Court"
          required
        ></v-select>
      </v-col>

      <!-- Details -->
      <v-col cols="12">
        <v-text-field
          label="Full Name"
          required
          v-model="name"
          :rules="nameRules"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Email"
          required
          type="email"
          :rules="emailRules"
          v-model="email"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Phone"
          required
          type="phone"
          v-model="phone"
          :rules="phoneRules"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox> -->
  </v-container>
</template>
<script>
import TimePicker from "./TimePicker.vue";
import DatePicker from "./DatePicker.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: [
    "court",
    "CustomerName",
    "CustomerEmail",
    "CustomerPhone",
    "errorMessage",
    "nameRules",
    "emailRules",
    "phoneRules"
  ],
  components: {
    DatePicker,
    TimePicker
  },
  data() {
    return {
      date: "",
      timeFrom: "",
      timeTo: "",
      selectedCourt: this.court,
      courts: ["WPT Court", "Panoramic Court"]
    };
  },
  mounted() {
    this.date = this.getDate;
    this.timeFrom = this.getTimeFrom;
    this.timeTo = this.getTimeTo;
  },

  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getTimeFrom", "getTimeTo", "getDate"]),

    error: {
      get() {
        return this.errorMessage;
      },
      set(value) {
        this.$emit("setErrorMessage", value);
      }
    },

    name: {
      get() {
        return this.CustomerName;
      },
      set(value) {
        this.$emit("setCustomerName", value);
      }
    },
    email: {
      get() {
        return this.CustomerEmail;
      },
      set(value) {
        this.$emit("setCustomerEmail", value);
      }
    },
    phone: {
      get() {
        return this.CustomerPhone;
      },
      set(value) {
        this.$emit("setCustomerPhone", value);
      }
    }
  },
  methods: {
    ...mapActions("events", ["updateSelectedEvent", "checkOverlapping"]),
    setDate(date) {
      this.date = date;
    },
    setTimeFrom(time_From) {
      // Convert Time to timestamp to get difference between new one and old one
      let hoursOld = this.timeFrom.split(":")[0];
      let minutesOld = this.timeFrom.split(":")[1];
      let timeFromOld = new Date(this.date).setHours(hoursOld, minutesOld);

      let hoursNew = time_From.split(":")[0];
      let minutesNew = time_From.split(":")[1];
      let timeFromNew = new Date(this.date).setHours(hoursNew, minutesNew);

      let timeDifference = timeFromNew - timeFromOld;

      this.timeFrom = time_From;

      // Add Difference to timeTo
      let hoursToOld = this.timeTo.split(":")[0];
      let minutesToOld = this.timeTo.split(":")[1];
      let timeToOld = new Date(this.date).setHours(hoursToOld, minutesToOld);

      let timeToNew = timeToOld + timeDifference;
      let hours = new Date(timeToNew).getHours();
      let minutes = new Date(timeToNew).getMinutes();

      this.setTimeTo(`${hours}:${minutes < 10 ? `0` + minutes : minutes}`);

      // let eventStart = new Date(this.selectedEvent.start);
      // eventStart.setHours(hours, minutes);
      // let event = this.selectedEvent;
      // event.start = eventStart;
      // this.updateSelectedEvent(event);
    },
    setTimeTo(timeTo) {
      console.log("timeTo:", timeTo);
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
      // Format Hours and Minutes in Comonent's Data
      let hoursFrom = this.timeFrom.split(":")[0];
      let minutesFrom = this.timeFrom.split(":")[1];
      let hoursTo = this.timeTo.split(":")[0];
      let minutesTo = this.timeTo.split(":")[1];
      let start = new Date(this.date).setHours(hoursFrom, minutesFrom);
      let end = new Date(this.date).setHours(hoursTo, minutesTo);

      // Check Overlapping with Events in the store
      this.checkOverlapping({
        start,
        end,
        eventId: this.selectedEvent.id
      }).then(isOverlapping => {
        console.log("isOverlapping:", isOverlapping);
        if (!isOverlapping) {
          this.error = false;
          let event = this.selectedEvent;
          event.start = start;
          event.end = end;
          this.updateSelectedEvent(event);
        } else {
          this.error = "Selected Time Overlaps another reservation";
        }
      });

      // console.log("isOverlapping:", isOverlapping());
    }
  }
};
</script>
