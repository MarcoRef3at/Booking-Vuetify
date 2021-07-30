<template>
  <div>
    <v-card color="grey lighten-4" max-width="600px" flat>
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

      <v-card-text>
        <BookingForm />
      </v-card-text>

      <!-- Card Footer -->
      <v-card-actions>
        <!-- Cancel Button -->
        <v-btn
          text
          color="secondary"
          @click="$emit('setEventDetailsOpen', false)"
        >
          Pay Now To Book
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import BookingForm from "./BookingForm.vue";
export default {
  components: { BookingForm },
  props: ["selectedOpen", "selectedElement", "selectedEvent"]
};
</script>
