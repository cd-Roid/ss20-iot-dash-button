<template>
  <b-jumbotron header="Actions" lead="Possible Actions">
    <possibleActions></possibleActions>
   <h2>Ordered Actions</h2>
    <actionList></actionList>
      </b-jumbotron>
</template>

<script>
import possibleActions from '@/components/possibleActions.vue';
import actionList from '@/components/ActionList.vue';

export default {
  name: 'OrderView',
  components: {
    possibleActions,
    actionList,
  },
  created() {
    // this.$socket.emit('mode_change', 1);
  },
};
</script>

<style></style>
