// index
<template>
  <v-row>
    <v-col>
      <CalendarHeader
        @setToday="setToday"
        @prev="prev"
        @next="next"
        :calendar="$refs.calendar"
        :type="type"
        @setCalendarType="setCalendarType"
      />
      <v-progress-linear
        :indeterminate="loading"
        color="rgba(103, 176, 209, 0.8)"
        :value="!loading ? 100 : 0"
      ></v-progress-linear>

      <v-sheet height="100%" :width="width">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :type="type"
          :events="events"
          :event-color="getEventColor"
          :event-ripple="false"
          @change="getEvents"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag"
          @click:event="showEvent"
          @click:more="viewDay"
          @touchstart:event="startDrag"
          @touchstart:time="startTime"
          @touchmove:time="mouseMove"
          @touchend:time="endDrag"
          :start="new Date()"
          :first-interval="16"
          :interval-minutes="60"
          :interval-count="8"
        >
          <template v-slot:event="{ event }">
            <div
              v-if="
                $vuetify.breakpoint.name != 'sm' &&
                  $vuetify.breakpoint.name != 'xs'
              "
              class="v-event-draggable unSelectable"
            >
              {{ timeFormater(event.start) }} -
              {{ timeFormater(event.end, true) }}
            </div>
          </template>
        </v-calendar>

        <div class="invisable-hours" style="top: 152px; ">
          4 PM
        </div>
        <div class="invisable-hours" style=" bottom: 7px; left: 35px ">
          12 AM
        </div>

        <!-- Event Details Menu -->
        <v-dialog
          v-model="selectedOpen"
          persistent
          scrollable
          max-width="600px"
        >
          <EventDialog
            @setEventDetailsOpen="setEventDetailsOpen"
            :court="selectedCourt"
            :parentDate="date"
            @setDate="setDate"
            :parentTimeFrom="timeFrom"
            @setTimeFrom="setTimeFrom"
            :parentTimeTo="timeTo"
            @setTimeTo="setTimeTo"
          />
          <!-- :activator="selectedElement" -->
        </v-dialog>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import EventDialog from "./EventDialog.vue";
import CalendarHeader from "./CalendarHeader.vue";
import { mapState, mapActions, mapGetters } from "vuex";

const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  if (a_start == b_start && a_end >= b_end) return true; //a = b
  if (b_start < a_start && a_end == b_end) return true;
  if (a_start == b_start && b_end >= a_end) return true;
  return false;
};

export default {
  components: { CalendarHeader, EventDialog },
  data: () => ({
    focus: "",
    type: "week",
    selectedCourt: null,
    loading: false,

    selectedOpen: false,
    value: "",
    colors: [
      "#2196F3",
      "#3F51B5",
      "#673AB7",
      "#00BCD4",
      "#4CAF50",
      "#FF9800",
      "#2196F3"
    ],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    defaultDuration: 60, //minutes
    date: "",
    timeFrom: "",
    timeTo: "",
    currentDuration: null
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    if ("court" in this.$route.query) {
      this.selectedCourt = this.$route.query.court;
    }
  },

  computed: {
    ...mapState("events", ["eventsArr"]),
    ...mapGetters("events", [
      "getTimeFrom",
      "getTimeTo",
      "getDate",
      "getIframeSrc"
    ]),

    events: {
      get() {
        return this.eventsArr;
      },
      set(value) {
        this.updateEvents(value);
      }
    },

    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "103%";
        case "sm":
          return "102%";
        case "md":
          return "101%";
        case "lg":
          return "101%";
        case "xl":
          return "101%";
      }
    }
  },
  methods: {
    ...mapActions("events", [
      "updateSelectedEvent",
      "updateEvents",
      "deleteEvent",
      "getAllEvents",
      "resetSelectedEvent"
    ]),

    setDate(value) {
      this.date = value;
    },
    setTimeFrom(value) {
      this.timeFrom = value;
    },
    setTimeTo(value) {
      this.timeTo = value;
    },

    setEventDetailsOpen(value) {
      this.selectedOpen = value;
      if (value == false) {
        this.resetSelectedEvent();
      }
    },
    setCalendarType(newType) {
      this.type = newType;
    },

    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    touched(event) {
      // console.log("touched:", event);
    },
    touchemove(event) {
      // console.log("touchemove:", event);
    },
    timeFormater(timestamp, isEnd = false) {
      let date = new Date(timestamp);
      let hour = date.getHours();
      let minute = date.getMinutes();

      // To handle last hour of the previous day
      // eg.11:59pm
      if (isEnd && hour == 23 && minute == 59) {
        hour = 0;
        minute = 0;
      }
      let ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      minute = minute < 10 ? "0" + minute : minute;
      let formatedTime =
        minute > 0 ? `${hour}:${minute} ${ampm}` : `${hour} ${ampm}`;
      return formatedTime;
    },
    addDefaultDuration(date) {
      // This Functions add default duration end time to new events
      date = new Date(date);
      return date.setMinutes(date.getMinutes() + this.defaultDuration);
    },

    checkOverlapping(start, end, eventId) {
      let allOtherEvents = this.eventsArr.filter(event => event.id != eventId);
      let allowed = allOtherEvents.map(event => {
        return dateRangeOverlaps(event.start, event.end, start, end);
      });
      return allowed.some(value => value);
    },

    startTime(tms) {
      const mouse = this.toTime(tms);

      const isNotOldDate =
        mouse >
        new Date(new Date().setHours(new Date().getHours() + 1)).setMinutes(0);

      let isNotOverlapping = !this.events.some(event =>
        dateRangeOverlaps(mouse, mouse, event.start, event.end)
      );

      if (this.dragEvent && this.dragTime === null && this.dragEvent.editable) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else if (
        // Disable Clicking on old slots or reserver slots
        this.dragEvent == null &&
        !this.selectedOpen &&
        isNotOldDate &&
        isNotOverlapping
      ) {
        // Create New Event if Clicked on empty slot
        this.createStart = this.roundTime(mouse);

        this.createEvent = {
          id: this.rnd(this.events.length, 9999),
          name: `Event #${this.rnd(this.events.length, 99)}`,
          color: "#2196F3",
          start: this.createStart,
          end: this.addDefaultDuration(this.createStart),
          timed: true,
          editable: true
        };
        console.log("created");
        this.events.push(this.createEvent);
        this.showEvent({ null: null, event: this.createEvent });
      }
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);
      // Dragging Function
      if (
        this.dragEvent &&
        this.dragTime !== null &&
        mouse >
          new Date(new Date().setHours(new Date().getHours() + 1)).setMinutes(0)
      ) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        // If not overlapping any other events
        if (!this.checkOverlapping(newStart, newEnd, this.dragEvent.id)) {
          this.dragEvent.start = newStart;
          this.dragEvent.end = newEnd;
        }
      }
    },
    endDrag() {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        }
        // else {
        //   const i = this.events.indexOf(this.createEvent);
        //   console.log("removed");
        //   if (i !== -1) {
        //     this.events.splice(i, 1);
        //   }
        // }
      }

      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = this.defaultDuration; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEventColor(event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event.color;
    },
    getEvents({ start, end }) {
      this.currentDuration = { start, end };
      this.loading = true;
      this.getAllEvents({
        start: start.date,
        end: end.date,
        court: "court" in this.$route.query ? this.$route.query.court : null
      }).then(() => {
        this.loading = false;
      });
    },
    rnd(a, b) {
      return Math.floor((b - a + 5) * Math.random()) + a;
    },
    rndElement(arr) {
      let x = arr[this.rnd(0, arr.length - 2)];
      // Bypass Undefined color bug
      if (x === undefined) {
        return this.colors[0];
      }
      return x;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      if (event.editable) {
        const open = () => {
          this.updateSelectedEvent(event);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => (this.selectedOpen = true))
          );
        };

        if (this.selectedOpen) {
          this.selectedOpen = false;
          this.resetSelectedEvent();

          requestAnimationFrame(() => requestAnimationFrame(() => open()));
        } else {
          open();
        }

        // nativeEvent.stopPropagation();
      }
    }
  },
  watch: {
    selectedOpen: function(opened) {
      if (opened) {
        this.date = this.getDate;
        this.timeFrom = this.getTimeFrom;
        this.timeTo = this.getTimeTo;
      } else {
        this.getEvents(this.currentDuration);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.invisable-hours {
  display: block;
  position: absolute;
  left: 40px;
  font-size: 10px;
  padding-right: 4px;
  background-color: #ffffff;
  color: #424242;
}

.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}
.unSelectable {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
