<template>
  <b-container fluid class="h100">
    <b-row align-v="stretch">
      <b-col cols="9">
        <actionList />
      </b-col>
      <b-col class="sidebar">
        <NewAction></NewAction>
        <possibleActions />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import possibleActions from '@/components/possibleActions.vue';
import actionList from '@/components/ActionList.vue';
import NewAction from '@/components/AddAction.vue';

export default {
  name: 'OrderView',
  components: {
    possibleActions,
    actionList,
    NewAction,
  },
  created() {

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
