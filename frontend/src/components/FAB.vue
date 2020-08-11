<template>
  <b-button @click="showSetup" v-show="count" class="btn-circle fab" variant="primary">
    <b-icon icon="tools"></b-icon>
    <div class="indicator">{{count}}</div>
  </b-button>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'FloatingActionButton',
  computed: {
    ...mapState({
      count: (state) => state.newDevices.length,
    }),
  },
  methods: {
    ...mapActions(['showSetup']),
  },

};
</script>

<style lang="scss" scoped>
.btn-circle {
  text-align: center;
  width: 50px;
  height: 50px;
  padding: 7px 10px;
  border-radius: 25px;
  font-size: 16px;
  text-align: center;
}

.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.indicator {
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  border-radius: 100%;
  padding: 5px;
  width: 25px;
  height: 25px;
  font-size: 12px;
}
</style>
