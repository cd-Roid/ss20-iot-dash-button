<template>
        <div>
          <b-card class="card">
            <h2>Add Action</h2>
            <form @submit.prevent="">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text"
                    v-model="action.name"
                    name="name"
                    class="form-control"/>
                </div>
                 <div class="form-group">
                <button class="btn btn-primary" @click="addAction(action)">
                  Add Action
                </button>
                 </div>
            </form>
          </b-card>
      </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      action: {
        name: '',
      },
    };
  },
  methods: {
    ...mapActions(['addAction']),
  },
};
</script>

<style>
.card {
  margin: 10px;
}
</style>
