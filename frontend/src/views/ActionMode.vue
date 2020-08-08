<template>
  <b-jumbotron header="Actions" lead="Ordered Actions">
    <actionList></actionList>
    <possibleActions>

    </possibleActions>
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
