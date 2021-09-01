<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="modal2"
      :return-value.sync="time"
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="timeText"
          :label="title"
          prepend-icon="mdi-clock-time-four-outline"
          readonly
          v-bind="attrs"
          :disabled="!isActive"
          v-on="isActive && on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="modal2"
        v-model="time"
        full-width
        ampm-in-title
        @click:hour="closePicker"
      >
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["title", "parentTime", "isActive"],
  computed: {
    time: {
      get() {
        return this.parentTime;
      },
      set(timeToSet) {
        this.$emit("setTime", timeToSet);
      }
    },
    timeText: {
      get() {
        let hours = this.parentTime.split(":")[0];
        let minutes = this.parentTime.split(":")[1];
        let time = `${hours > 12 ? hours - 12 : hours}:${minutes} ${
          hours > 12 ? "PM" : "AM"
        }`;
        return time;
      }
    }
  },
  data() {
    return {
      modal2: false
    };
  },
  methods: {
    closePicker: function(v) {
      this.$refs.dialog.save(this.time);
      this.modal2 = false;
    }
  }
};
</script>
