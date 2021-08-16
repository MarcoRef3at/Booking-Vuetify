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

      <v-sheet height="600">
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
          @click:date="viewDay"
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
            <div class="v-event-draggable unSelectable">
              {{ timeFormater(event.start) }} - {{ timeFormater(event.end) }}
            </div>

            <!-- Remove Icon Button
            <v-btn
              v-if="event.editable"
              icon
              color="pink"
              @click="deleteEvent(event)"
              style="position: absolute; right: 0px;"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn> -->

            <!-- Drag down to extend event time -->
            <div
              v-if="event.editable"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
        </v-calendar>

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
import { mapState, mapActions } from "vuex";

export default {
  components: { CalendarHeader, EventDialog },
  data: () => ({
    focus: "",
    type: "week",
    selectedCourt: null,

    selectedOpen: false,
    value: "",
    // events: [],
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
    defaultDuration: 60 //minutes
  }),
  mounted() {
    this.$refs.calendar.checkChange();
    if ("court" in this.$route.query) {
      this.selectedCourt = this.$route.query.court;
    }
  },

  computed: {
    ...mapState("events", ["eventsArr"]),

    events: {
      get() {
        return this.eventsArr;
      },
      set(value) {
        this.updateEvents(value);
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
      console.log("touched:", event);
    },
    touchemove(event) {
      console.log("touchemove:", event);
    },
    timeFormater(timestamp) {
      let date = new Date(timestamp);
      let hour = date.getHours();
      let minute = date.getMinutes();

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
      const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
        if (a_start < b_start && b_start < a_end) return true; // b starts in a
        if (a_start < b_end && b_end < a_end) return true; // b ends in a
        if (b_start < a_start && a_end < b_end) return true; // a in b
        if (a_start == b_start && a_end >= b_end) return true; //a = b
        if (b_start < a_start && a_end == b_end) return true;
        if (a_start == b_start && b_end >= a_end) return true;
        return false;
      };

      let allOtherEvents = this.eventsArr.filter(event => event.id != eventId);
      let allowed = allOtherEvents.map(event => {
        return dateRangeOverlaps(event.start, event.end, start, end);
      });
      return allowed.some(value => value);
    },

    startTime(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null && this.dragEvent.editable) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else if (this.dragEvent == null && !this.selectedOpen) {
        // Create New Event if Clicked on empty slot
        this.createStart = this.roundTime(mouse);

        this.createEvent = {
          id: this.rnd(this.events.length, 9999),
          name: `Event #${this.rnd(this.events.length, 99)}`,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.addDefaultDuration(this.createStart),
          timed: true,
          editable: true
        };

        this.events.push(this.createEvent);
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
      if (this.dragEvent && this.dragTime !== null) {
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
      } else if (this.createEvent && this.createStart !== null) {
        //  Buttom Extend in new events AND preCreated Events
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        if (
          this.createEvent.editable &&
          min - max != 0 &&
          !this.checkOverlapping(min, max, this.createEvent.id)
        ) {
          this.createEvent.start = min;
          this.createEvent.end = max;
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
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
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
      this.getAllEvents({
        start: start.date,
        end: end.date,
        court: "court" in this.$route.query ? this.$route.query.court : null
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

        nativeEvent.stopPropagation();
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
