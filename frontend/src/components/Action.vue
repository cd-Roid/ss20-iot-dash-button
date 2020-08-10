<template>
  <b-card no-body class="action">
    <b-card-body>
      <b-card-title>{{ action.name }}</b-card-title>
    </b-card-body>
    <template v-slot:footer>
      <b-button
        href="#"
        variant="danger"
        :data-vue-id="action._id"
        @click="deleteAction(action._id)"
      >Delete</b-button>
    </template>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Action',
  props: {
    action: Object,
  },
  methods: {
    ...mapActions(['deleteAction']),
  },
};
</script>

<style lang="scss">
.action {
  margin: 10px 0;
}
</style>
