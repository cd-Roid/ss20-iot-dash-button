<template>
  <div>
    <ul>
      <li v-for="order in orders" :key="order._id">
        Name: {{order.name}}
        Quantity: {{order.quantity}}
        Steps: {{order.step}}
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
      orders: (state) => state.orderList,
    }),
  },
  methods: {
    ...mapActions(['loadOrderList']),
  },
  created() {
    this.loadOrderList();
  },
};
</script>

<style>

</style>
