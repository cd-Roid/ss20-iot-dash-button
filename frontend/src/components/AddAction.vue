<template>
  <b-container class="mt-3">
    <b-card class="card">
      <h2>Add Action</h2>
      <form @submit.prevent>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" v-model="action.name" name="name" class="form-control" />
        </div>
        <div class="form-group">
          <button class="btn btn-primary" @click="addAction(action)">Add Action</button>
        </div>
      </form>
    </b-card>
  </b-container>
</template>

<script>

export default {
  data() {
    return {
      action: {
        name: '',
      },
    };
  },
  methods: {
    addAction(action) {
      this.$socket.emit('newAction', action);
    },
  },
};
</script>

<style scoped>
</style>
