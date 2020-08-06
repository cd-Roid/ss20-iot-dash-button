<template>
  <b-card no-body class="order">
    <b-card-body>
      <b-card-title>{{ order.name }}</b-card-title>
      <b-card-text>
        <p>Anzahl: {{ order.quantity }}</p>
        <p>Steps: {{ order.step }}</p>
      </b-card-text>
    </b-card-body>
    <template v-slot:footer>
        <b-button
          href="#"
          variant="danger"
          :data-vue-id="order._id"
          @click="dismiss(order._id)"
          >Delete
      </b-button>
      </template>
  </b-card>
</template>

<script>
export default {
  name: 'Order',
  props: {
    order: Object,
  },
};
</script>

<style lang="scss">
  .order {
    margin: 10px 0;
  }
</style>
