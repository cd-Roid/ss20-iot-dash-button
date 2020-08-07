<template>
  <b-modal hide-backdrop v-model="showModel" title="Add Product">
      <div>
          <b-card 
           text-variant="dark"
            header="Add Product">
            <p> Product Name</p>
            <form @submit.prevent="">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text"
                    model="name"
                    name="name"
                    class="form-control"/>
                     <label for="stueck">Stück</label>
                      <input type="number"
                    model="stueck"
                    name="stueck"
                    class="form-control"/>
                     <label for="step">Steps</label>
                      <input type="number"
                    model="step"
                    name="step"
                    class="form-control"/>
                </div>
                 <div class="form-group">
                <button class="btn btn-primary">
                  Add Product
                </button>
            </form>
            </b-card>
      </div>
  </b-modal>
</template>

<script>
// import { mapActions } from 'vuex';

export default {
  name: 'AddProduct',
  data() {
    return {
      name: String,
      stueck: Number,
      steps: Number,
    };
  },
};
</script>

<style>

</style>
