<template>
  <b-card no-body>
    <b-card-body>
      <b-card-title>{{ order.name }}</b-card-title>
      <b-card-text>
        <p>Anzahl: {{ order.quantity }}</p>
        <p>Mitarbeiter: {{ order.eID }}</p>
      </b-card-text>
    </b-card-body>
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

<style>

</style>
