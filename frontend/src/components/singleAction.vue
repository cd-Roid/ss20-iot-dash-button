<template>
  <b-card no-body class="actionOrder">
    <b-card-body>
      <b-card-title>{{ action.name }}</b-card-title>
      <b-button
        href="#"
        variant="primary"
        :data-vue-id="action._id"
        @click="dismissOrderedActions(action._id)"
      >Dismiss</b-button>
    </b-card-body>
    <template v-slot:footer>
      <p>
        von: {{action.employee }}
        <em>Vor {{timepassed}}</em>
      </p>
    </template>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Action',
  props: {
    action: Object,
  },
  data() {
    return {
      now: Date.now(),
    };
  },
  computed: {
    timepassed() {
      const currentTime = this.now;
      const savedTime = new Date(this.action.time);
      const timePassed = (currentTime - savedTime) / 1000;
      let minutes = Math.floor((timePassed / 60) % 60);
      let hours = Math.floor((timePassed / 60) / 60);
      console.log(timePassed);
      hours = hours > 0 ? `${hours} Hours and` : '';

      hours = hours < 10 && hours > 0 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${hours}  ${minutes} minutes`;
    },
  },
  methods: {
    ...mapActions(['dismissOrderedActions']),
  },
  created() {
    const self = this;
    setInterval(() => {
      self.now = Date.now();
    }, 60000);
  },
};
</script>

<style lang="scss">
.actionOrder {
  margin: 10px 0;
}
</style>
