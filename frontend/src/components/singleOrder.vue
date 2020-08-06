<template>
  <b-card no-body class="order">
    <b-card-body>
      <b-card-title>{{ order.name }}</b-card-title>
      <b-card-text>
        <p>Anzahl: {{ order.quantity }}</p>
        <p>Mitarbeiter: {{ order.employee }}</p>
      </b-card-text>
        <b-button
          href="#"
          variant="primary"
          :data-vue-id="order._id"
          @click="dismiss(order._id)"
          >Dismiss
      </b-button>
    </b-card-body>
    <template v-slot:footer>
        <em>Vor {{timepassed}}</em>
      </template>
  </b-card>
</template>

<script>
export default {
  name: 'Order',
  props: {
    order: Object,
  },
  computed: {
    timepassed() {
      const currentTime = new Date();
      const savedTime = new Date(this.order.time);
      const timePassed = (currentTime - savedTime) / 1000;
      let minutes = Math.floor((timePassed / 60) % 60);
      let hours = Math.floor((timePassed / (100 * 60)) % 24);

      hours = hours > 0 ? `${hours} Hours and` : '';

      hours = hours < 10 && hours > 0 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${hours}  ${minutes} minutes`;
    },
  },
};
</script>

<style lang="scss">
  .order {
    margin: 10px 0;
  }
</style>
