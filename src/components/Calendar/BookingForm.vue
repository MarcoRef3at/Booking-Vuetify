<template>
  <div>
    <v-container>
      <v-row>
        <!-- Date Picker -->
        <v-col cols="12">
          <DatePicker />
        </v-col>

        <!-- TimeFrom Picker -->
        <v-col cols="11" sm="6">
          <TimePicker :title="'Time From'" />
        </v-col>
        <v-col cols="11" sm="6">
          <TimePicker :title="'Time to'" />
        </v-col>

        <!-- Court Select -->
        <v-col cols="12" sm="6">
          <v-select
            :items="['Court 1', 'Court 2']"
            label="Select Court"
            required
          ></v-select>
        </v-col>

        <!-- Notes -->
        <v-col cols="12">
          <v-textarea
            v-model="notes"
            color="teal"
            hint="Any Further information (visible only to booking administrator"
          >
            <template v-slot:label>
              <div>Notes <small>(optional)</small></div>
            </template>
          </v-textarea>
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
export default {
  components: {
    DatePicker,
    TimePicker
  },
  data() {
    return {
      notes: ""
    };
  }
};
</script>
