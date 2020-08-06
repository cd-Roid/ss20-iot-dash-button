<template>
  <b-container fluid class="h100">
    <b-row align-v="stretch">
      <b-col cols="9">
        <OrderList />
      </b-col>
      <b-col class="sidebar">
        <h2>Possible Orders</h2>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import OrderList from '@/components/OrderList.vue';

export default {
  name: 'OrderView',
  components: {
    OrderList,
  },
  created() {
    this.$socket.emit('mode_change', 0);
  },
};
</script>

<style scoped lang="scss">
  .sidebar {
    background: #eee;
  }

  .main {
    min-height: 100%;
  }
</style>
