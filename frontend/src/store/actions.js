export default {
  async loadOrders({ commit }) {
    const result = await fetch('http://localhost:3000/orders');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const orders = await result.json();

    commit('setOrders', orders);
  },
  SOCKET_orderedProduct({ commit }, order) {
    commit('addOrder', order);
  },
  async loadOrderList({ commit }) {
    const result = await fetch('http://localhost:3000/orderList');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const orderList = await result.json();

    commit('setOrderList', orderList.list);
  },
  SOCKET_productList({ commit }, orderList) {
    commit('setOrderList', orderList);
  },
  async loadNewDevices({ commit }) {
    const result = await fetch('http://localhost:3000/devices');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const newDevices = await result.json();

    commit('setNewDevices', newDevices);
  },
  SOCKET_setupID({ commit }, device) {
    commit('addDevice', device);
  },
  removeDevice({ commit }, index) {
    commit('deleteDevice', index);
  },
  async loadMode({ commit }) {
    const result = await fetch('http://localhost:3000/mode');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const mode = await result.json();

    commit('setMode', mode);
  },
  SOCKET_mode({ commit }, mode) {
    commit('setMode', mode);
  },
  async loadActions({ commit }) {
    const result = await fetch('http://localhost:3000/actions');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const actions = await result.json();

    commit('setActions', actions);
  },
  SOCKET_actions({ commit }, actions) {
    commit('setActions', actions);
  },
  async deleteAction({ commit }, index) {
    commit('deleteActions', index);
  },
  SOCKET_delete_action({ commit }, index) {
    commit('deleteActions', index);
  },
  async loadOrderedAction({ commit }) {
    const result = await fetch('http://localhost:3000/orderedActions');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const orderedActions = await result.json();

    commit('setOrderedActions', orderedActions);
  },
  async dismissOrderedActions({ commit, index }) {
    commit('dismissOrderedActions', index);
  },
  SOCKET_dismissAction({ commit }, actions) {
    commit('dismissAction', actions);
  },
  async addProduct({ commit, product }) {
    commit('addProduct', product);
  },
  SOCKET_newProduct({ commit }, product) {
    commit('newProduct', product);
  },
  async addAction({ commit, product }) {
    commit('addAction', product);
  },
  SOCKET_newAction({ commit }, action) {
    commit('newAction', action);
  },
  async ackOrder({ commit, product }) {
    commit('dismissOrder', product);
  },
  SOCKET_dismissOrder({ commit }, order) {
    commit('dismissOrder', order);
  },
};
