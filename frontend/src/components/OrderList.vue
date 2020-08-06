<template>
  <div>
    <ul>
      <order v-for="order in orders" :key="order._id" :order="order">
      </order>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import order from '@/components/singleOrder.vue';

export default {
  name: 'OrderList',
  components: {
    order,
  },
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
