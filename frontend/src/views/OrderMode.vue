<template>
<b-jumbotron header="BootstrapVue" lead="Bootstrap v4 Components for Vue.js 2">
    <OrderList />
  </b-jumbotron>
</template>

<script>
import OrderList from '@/components/OrderList.vue';

export default {
  name: 'OrderView',
  components: {
    OrderList,
  },
};
</script>

<style>

</style>
