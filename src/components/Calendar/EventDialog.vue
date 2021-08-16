<template>
  <v-card color="grey lighten-4" flat>
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
      <!-- <v-carousel v-model="carousel" :show-arrows="false" hide-delimiters>
        <v-carousel-item> -->
      <BookingForm
        :court="court"
        :errorMessage="errorMessage"
        @setErrorMessage="setErrorMessage"
        :CustomerName="CustomerName"
        @setCustomerName="setCustomerName"
        :CustomerEmail="CustomerEmail"
        @setCustomerEmail="setCustomerEmail"
        :CustomerPhone="CustomerPhone"
        @setCustomerPhone="setCustomerPhone"
      />
      <!-- </v-carousel-item>
      </v-carousel> -->
    </v-card-text>

    <!-- Card Footer -->
    <v-card-actions v-if="carousel == 0">
      <v-spacer></v-spacer>
      <!-- Cancel Button -->
      <v-btn
        :disabled="errorMessage !== false"
        color="#757575"
        class="white--text"
        @click="payLater"
        :loading="payLaterLoading"
      >
        Pay Later
      </v-btn>
      <v-btn
        :disabled="errorMessage !== false"
        :color="selectedEvent.color"
        class="white--text"
        @click="payNow"
      >
        Pay Now
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
      CustomerName: null,
      CustomerEmail: null,
      CustomerPhone: null,
      payLaterLoading: false,
      errorMessage: false
    };
  },

  computed: {
    ...mapState("events", ["selectedEvent"]),
    ...mapGetters("events", ["getIframeSrc"])
  },
  methods: {
    ...mapActions("events", ["deleteEvent", "pay", "bookEvent"]),
    deleteEvents() {
      this.deleteEvent(this.selectedEvent);
      this.$emit("setEventDetailsOpen", false);
    },

    payNow() {
      this.pay().then(() => {
        this.$router.push("payment");
        // this.$emit("setEventDetailsOpen", false)
      });
    },
    payLater() {
      this.payLaterLoading = true;
      this.bookEvent({
        CustomerName: this.CustomerName,
        CustomerEmail: this.CustomerEmail,
        CustomerPhone: this.CustomerPhone,
        courtName: "court" in this.$route.query ? this.$route.query.court : null
      })
        .then(res => {})
        .catch(async err => {
          await setTimeout(() => {
            this.errorMessage = false;
          }, 2000);
          this.errorMessage = err;
        })
        .finally(() => (this.payLaterLoading = false));
    },

    setErrorMessage(value) {
      this.errorMessage = value;
    },
    setCustomerName(value) {
      this.CustomerName = value;
    },
    setCustomerEmail(value) {
      this.CustomerEmail = value;
    },
    setCustomerPhone(value) {
      this.CustomerPhone = value;
    }
  }
};
</script>
