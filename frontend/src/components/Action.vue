<template>
  <b-card no-body class="action">
      <b-card-title>{{ action.name }}</b-card-title>
      <template v-slot:footer>
        <b-button
          href="#"
          variant="danger"
          :data-vue-id="action._id"
          @click="deleteAction(action._id)"
          >Delete
      </b-button>
      </template>
  </b-card>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Action',
  props: {
    action: Object,
  },
  methods: {
    ...mapMutations(['deleteAction']),
    deleteAction() {
      // eslint-disable-next-line no-underscore-dangle
      const toDelete = this.action._id;
      this.$store.commit('deleteAction', toDelete);
      this.$socket.emit('deleteAction', toDelete);
    },
  },
};
</script>

<style lang="scss">
  .action {
    margin: 10px 0;
  }
</style>
