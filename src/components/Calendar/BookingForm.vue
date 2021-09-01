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
          :isActive="true"
        />
      </v-col>
      <v-col cols="11" sm="6">
        <TimePicker
          :title="'Time to'"
          :parentTime="timeTo"
          @setTime="setTimeTo"
          :isActive="false"
        />
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
    "parentDate",
    "parentTimeFrom",
    "parentTimeTo",
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
      // date: "",
      // timeFrom: "",
      // timeTo: "",
      // selectedCourt: this.court,
      // courts: ["WPT Court", "Panoramic Court"]
    };
  },

  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getTimeFrom", "getTimeTo", "getDate"]),
    date: {
      get() {
        return this.parentDate;
      },
      set(value) {
        this.$emit("setDate", value);
      }
    },
    timeFrom: {
      get() {
        return this.parentTimeFrom;
      },
      set(value) {
        this.$emit("setTimeFrom", value);
      }
    },
    timeTo: {
      get() {
        return this.parentTimeTo;
      },
      set(value) {
        this.$emit("setTimeTo", value);
      }
    },

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
      this.updateEvent(date);
    },
    setTimeFrom(time_From, settingFrom_From = true) {
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

      // Parameter to check if changing date from (from Date) not from (to Date) to avoid inifint loop
      if (settingFrom_From)
        this.setTimeTo(
          `${hours}:${minutes < 10 ? `0` + minutes : minutes}`,
          false
        );
    },
    setTimeTo(time_To, settingFrom_To = true) {
      let hoursOld = this.timeTo.split(":")[0];
      let minutesOld = this.timeTo.split(":")[1];
      let timeToOld = new Date(this.date).setHours(hoursOld, minutesOld);
      let hoursNew = time_To.split(":")[0];
      let minutesNew = time_To.split(":")[1];
      let timeToNew = new Date(this.date).setHours(hoursNew, minutesNew);

      let timeDifference = timeToNew - timeToOld;

      this.timeTo = time_To;

      // Add Difference to timeTo
      let hoursFromOld = this.timeFrom.split(":")[0];
      let minutesFromOld = this.timeFrom.split(":")[1];
      let timeFromOld = new Date(this.date).setHours(
        hoursFromOld,
        minutesFromOld
      );

      let timeFromNew = timeFromOld + timeDifference;
      let hours = new Date(timeFromNew).getHours();
      let minutes = new Date(timeFromNew).getMinutes();

      // Parameter to check if changing date from (from Date) not from (to Date) to avoid inifint loop
      if (settingFrom_To)
        if (true) {
          // Change Time from if difference is less than one hour
          // if (timeToNew - timeFromOld < 3600000) {
          this.setTimeFrom(
            `${hours}:${minutes < 10 ? `0` + minutes : minutes}`,
            false
          );
        }

      this.updateEvent();
    },
    updateEvent(date) {
      // Format Hours and Minutes in Comonent's Data
      let hoursFrom = this.timeFrom.split(":")[0];
      let minutesFrom = this.timeFrom.split(":")[1];
      let hoursTo = this.timeTo.split(":")[0];
      let minutesTo = this.timeTo.split(":")[1];
      let start = date
        ? new Date(date).setHours(hoursFrom, minutesFrom)
        : new Date(this.date).setHours(hoursFrom, minutesFrom);
      let end = date
        ? new Date(date).setHours(hoursTo, minutesTo)
        : new Date(this.date).setHours(hoursTo, minutesTo);

      if (start <= Date.now()) {
        this.error = "You can't reserve past dates";
      } else {
        // Check Overlapping with Events in the store
        this.checkOverlapping({
          start,
          end,
          eventId: this.selectedEvent.id
        }).then(isOverlapping => {
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
      }
      // console.log("isOverlapping:", isOverlapping());
    }
  }
};
</script>
