<template>
  <b-container class="mt-3">
    <h3>Possible Actions</h3>
    <ul>
      <li>
        <action v-for="action in actions" :key="action.name" :action="action"></action>
      </li>
    </ul>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import action from '@/components/Action.vue';

export default {
  name: 'possibleActions',
  components: {
    action,
  },
  computed: {
    ...mapState({
      actions: (state) => state.actionList[0].list,
    }),
  },
  methods: {
    ...mapActions(['loadActions']),
  },
  created() {
    this.loadActions();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
</style>
