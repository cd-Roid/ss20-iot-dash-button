<template>
  <div>
    <b-navbar variant="info" type="dark">
      <b-navbar-brand href="/">IoT Button</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/" @click="fireOrderMode()">Order Mode
        </b-nav-item>
        <b-nav-item to="/action" @click="fireAcionMode()">Action Mode
        </b-nav-item>
        <b-nav-item  @click="showModal">
          Add Product
          <b-modal ref="AddProductModal">
                  <div>
          <b-card
           text-variant="dark"
            header="Add Product">
            <p> Product Name</p>
            <form @submit.prevent="">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text"
                    v-model="product.name"
                    name="name"
                    class="form-control"/>
                     <label for="stueck">Stück</label>
                      <input type="number"
                    v-model="product.quantity"
                    name="stueck"
                    class="form-control"/>
                     <label for="step">Steps</label>
                      <input type="number"
                    v-model="product.step"
                    name="step"
                    class="form-control"/>
                </div>
                 <div class="form-group">
                <button class="btn btn-primary" @click="submitProduct()">
                  Add Product
                </button>
                 </div>
            </form>
            </b-card>
      </div>
          </b-modal>
        </b-nav-item>
        <b-nav-item  @click="showActionModal">
          Add Action
          <b-modal ref="AddActionModal">
                  <div>
          <b-card
           text-variant="dark"
            header="Add Action">
            <p> Action</p>
            <form @submit.prevent="">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text"
                    v-model="action.name"
                    name="name"
                    class="form-control"/>
                </div>
                 <div class="form-group">
                <button class="btn btn-primary" @click="submitAction()">
                  Add Action
                </button>
                 </div>
            </form>
            </b-card>
      </div>
          </b-modal>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      product: {
        name: '',
        quantity: 0,
        step: 0,
      },
      action: {
        name: '',
      },
    };
  },
  methods: {
    ...mapMutations(['addProduct', 'addAction']),
    fireOrderMode() {
      this.$socket.emit('mode_change', 0);
    },
    fireAcionMode() {
      this.$socket.emit('mode_change', 1);
    },
    showModal() {
      this.$refs.AddProductModal.show();
    },
    showActionModal() {
      this.$refs.AddActionModal.show();
    },
    hideModal() {
      this.$refs.AddProductModal.hide();
    },
    hideActionModal() {
      this.$refs.AddActionModal.hide();
    },
    submitProduct() {
      const that = this;
      console.log(this.product);
      this.addProduct(that.product);
      this.hideModal();
      const fullList = this.$store.state.orderList;
      this.$socket.emit('newProduct', fullList);
      this.product.name = '';
      this.product.quantity = 0;
      this.product.steps = 0;
    },
    submitAction() {
      const that = this;
      this.addAction(that.action);
      this.hideActionModal();
      const fullList = this.$store.state.actionList[0].list;
      this.$socket.emit('newAction', fullList);
    },
  },
};
</script>

<style>
  .router-link-exact-active {
    color: #fff !important;
  }
</style>
