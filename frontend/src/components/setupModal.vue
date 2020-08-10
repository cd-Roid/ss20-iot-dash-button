<template>
  <b-modal hide-footer v-model="showModal" title="Setup Devices">
    <div>
      <b-row
        :current-page="currentPage"
        :per-page="1">
        <b-col v-for="(device, index) in paginatedItems" :key="device._id">
          <b-card
            text-variant="dark"
            :header="`Device ${index+1}`"
            >
            <p class="card-text">
              {{device.SetupId}}
            </p>
            <form @submit.prevent="setupDevice(device, index)">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  type="text"
                  v-model="name"
                  name="name"
                  class="form-control"
                />
                <label for="eID">Mitarbeiter Nummer (0-255)</label>
                <input
                  type="text"
                  v-model="eID"
                  name="eID"
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <button class="btn btn-primary">
                  Setup
                </button>
              </div>
            </form>
          </b-card>
        </b-col>
      </b-row>

      <b-pagination
        @change="onPageChanged"
        v-model="currentPage"
        :total-rows="devices.length"
        :per-page="1"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SetupModal',
  data() {
    return {
      currentPage: 1,
      pageNumber: 0,
      pageSize: 0,
      showModal: false,
      name: '',
      eID: '',
    };
  },
  computed: {
    ...mapState({
      devices: (state) => state.newDevices,
    }),
    paginatedItems() {
      return this.devices.slice(
        this.pageNumber * this.pageSize,
        (this.pageNumber + 1) * this.pageSize,
      );
    },
  },
  watch: {
    devices() {
      this.showModal = this.devices.length > 0;
    },
  },
  methods: {
    ...mapActions(['loadNewDevices', 'removeDevice']),
    paginate(pageSize, pageNumber) {
      console.log(pageSize, pageNumber);
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
    },
    onPageChanged(page) {
      this.paginate(1, page - 1);
    },
    setupDevice(device, index) {
      this.$socket.emit('setupDevice', { name: this.name, eID: this.eID, setupID: device.SetupId });
      this.removeDevice(index);
      this.name = '';
      this.eID = '';
    },
  },
  mounted() {
    this.paginate(1, 0);
  },
  created() {
    this.loadNewDevices();
  },
};
</script>

<style>
.card {
  margin-bottom: 10px;
}
</style>
