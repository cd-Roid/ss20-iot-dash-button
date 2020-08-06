<template>
  <b-container class="mt-3">
    <h3>Products</h3>
    <ul>
      <li>
        <product v-for="order in orders" :key="order._id" :order="order"></product>
      </li>
    </ul>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import product from '@/components/Product.vue';

export default {
  name: 'possibleOrders',
  components: {
    product,
  },
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

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
</style>
