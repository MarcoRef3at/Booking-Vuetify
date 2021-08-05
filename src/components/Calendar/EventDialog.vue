<template>
  <v-card color="grey lighten-4" flat max-height="80vh">
    <v-toolbar :color="selectedEvent.color" dark>
      <!-- Edit Button -->
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <!-- Event Name -->
      <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Delete Button -->
      <v-btn icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <!-- More Button -->
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Form Body -->

    <v-card-text>
      <BookingForm />
    </v-card-text>

    <!-- Card Footer -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- Cancel Button -->
      <v-btn
        :color="selectedEvent.color"
        class="white--text"
        @click="$emit('setEventDetailsOpen', false)"
      >
        Pay Now To Book
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import BookingForm from "./BookingForm.vue";
import { mapState } from "vuex";
export default {
  components: { BookingForm },
  computed: {
    ...mapState("events", ["selectedEvent"])
  }
};
</script>
