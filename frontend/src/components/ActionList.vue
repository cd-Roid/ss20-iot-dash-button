<template>
  <div>
    <ul class="action-list">
      <li>
          <Action v-for="action in actions" :key="action._id" :action="action">
          </Action>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Action from '@/components/singleAction.vue';

export default {
  name: 'ActionList',
  components: {
    Action,
  },
  computed: {
    ...mapState({
      actions: (state) => state.orderedActions,
    }),
  },
  methods: {
    ...mapActions(['loadOrderedAction']),
  },
  created() {
    this.loadOrderedAction();
  },
};
</script>

<style>
.action-list {
  padding: 0;
  list-style: none;
}

</style>
