<template>
  <div id="app">
    <Header />
    <router-view />
    <SetupModal />
    <fab />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import SetupModal from '@/components/setupModal.vue';
import { mapState, mapActions } from 'vuex';
import fab from '@/components/FAB.vue';
import router from './router';

export default {
  name: 'App',
  components: {
    Header,
    SetupModal,
    fab,
  },
  computed: {
    ...mapState({
      mode: (state) => state.mode,
    }),
  },
  methods: {
    ...mapActions(['loadMode']),
  },
  watch: {
    mode() {
      if (this.mode) {
        console.log('action modi');
        router.push('/action');
      } else router.push('/');
    },
  },
  created() {
    this.loadMode();
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

p {
  margin-bottom: 0;
}
</style>
