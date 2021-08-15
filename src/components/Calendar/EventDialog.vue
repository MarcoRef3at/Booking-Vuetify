<template>
  <v-card color="grey lighten-4" flat max-height="80vh">
    <v-toolbar :color="selectedEvent.color" dark>
      <!-- Edit Button -->
      <!-- <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn> -->

      <!-- Event Name -->
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Delete Button -->
      <v-btn icon @click="deleteEvents">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <!-- More Button -->
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Form Body -->

    <v-card-text>
      <v-carousel v-model="carousel" :show-arrows="false" hide-delimiters>
        <v-carousel-item>
          <BookingForm
            :court="court"
            :overlapping="overlapping"
            @setOverlapping="setOverlapping"
          />
        </v-carousel-item>
        <!-- <v-carousel-item>
          <div>
            <iframe
              :src="getIframeSrc"
              width="40%"
              height="60%"
              scrolling="yes"
              frameborder="0"
              style="
            overflow: hidden;
            overflow-x: hidden;
            overflow-y: hidden;
           
            position: fixed;
          
          "
            ></iframe>
          </div>
        </v-carousel-item> -->
      </v-carousel>
    </v-card-text>

    <!-- Card Footer -->
    <v-card-actions v-if="carousel == 0">
      <v-spacer></v-spacer>
      <!-- Cancel Button -->
      <v-btn
        :disabled="overlapping"
        :color="selectedEvent.color"
        class="white--text"
        @click="payNow"
      >
        Pay Now To Book
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import BookingForm from "./BookingForm.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import apiClient from "../../api/client";
export default {
  props: ["court"],
  components: { BookingForm },
  data() {
    return {
      carousel: 0,
      overlapping: false
    };
  },

  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getIframeSrc"])
  },
  methods: {
    ...mapActions("events", ["deleteEvent", "bookEvent"]),
    deleteEvents() {
      this.deleteEvent(this.selectedEvent);
      this.$emit("setEventDetailsOpen", false);
    },

    payNow() {
      this.bookEvent().then(() => {
        this.$router.push("payment");
        // this.$emit("setEventDetailsOpen", false)
      });
    },
    setOverlapping(value) {
      this.overlapping = value;
    }
  }
};
</script>
