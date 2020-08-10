<template>
  <div>
    <b-navbar variant="info" type="dark">
      <b-navbar-brand href="/">IoT Button</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/" @click="fireOrderMode()">Order Mode
        </b-nav-item>
        <b-nav-item to="/action" @click="fireAcionMode()">Action Mode
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {

    };
  },
  methods: {
    fireOrderMode() {
      this.$socket.emit('mode_change', 0);
    },
    fireAcionMode() {
      this.$socket.emit('mode_change', 1);
    },
  },
};
</script>

<style>
  .router-link-exact-active {
    color: #fff !important;
  }
</style>
