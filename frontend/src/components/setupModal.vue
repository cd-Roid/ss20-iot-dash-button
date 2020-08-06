<template>
  <b-modal hide-footer v-model="showModal" title="Seminar buchen">
    <div class="overflow-auto">
      <b-row
        :current-page="currentPage"
        :per-page="1">
        <b-col v-for="device in paginatedItems" :key="device._id">
          <b-card
            text-variant="dark"
            :header="device.SetupId"
            class="text-center"
            >
            <p class="card-text">
              {{device.SetupId}}
            </p>
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
    ...mapActions(['loadNewDevices']),
    paginate(pageSize, pageNumber) {
      console.log(pageSize, pageNumber);
      this.pageNumber = pageNumber;
      this.pageSize = pageSize;
    },
    onPageChanged(page) {
      this.paginate(1, page - 1);
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

</style>
