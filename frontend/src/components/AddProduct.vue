<template>
  <div>
    <b-card>
      <h2>Add Product</h2>
      <form @submit.prevent="sendProduct(product)">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" v-model="product.name" name="name" class="form-control" />
          <label for="stueck">Stück</label>
          <input type="number" v-model="product.quantity" name="stueck" class="form-control" />
          <label for="step">Steps</label>
          <input type="number" v-model="product.step" name="step" class="form-control" />
        </div>
        <div class="form-group">
          <button class="btn btn-primary">Add Product</button>
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
      product: {
        name: '',
        quantity: 1,
        step: 1,
      },
    };
  },
  methods: {
    ...mapActions(['addProduct']),
    sendProduct(product) {
      this.addProduct(product);
      this.product.name = '';
      this.product.quantity = 1;
      this.product.step = 1;
    },
  },
};
</script>

<style>
</style>
