<template>
  <div>
    <ul>
      <li v-for="order in orders" :key="order._id">
        {{order.name}} {{order.quantity}} {{order.eID}}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'OrderList',
  computed: {
    ...mapState({
      orders: (state) => state.orders,
    }),
  },
  methods: {
    ...mapActions(['loadOrders']),
  },
  created() {
    this.loadOrders();
  },
};
</script>

<style>

</style>
