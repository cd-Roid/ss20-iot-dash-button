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

    commit('setOrderList', orderList);
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
    commit('deleteAction', index);
    // eslint-disable-next-line no-underscore-dangle
    this._vm.$socket.emit('deleteAction', index);
  },
  async loadOrderedAction({ commit }) {
    const result = await fetch('http://localhost:3000/orderedActions');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const orderedActions = await result.json();

    commit('setOrderedActions', orderedActions);
  },
  async dismissOrderedActions({ commit }, index) {
    // eslint-disable-next-line no-underscore-dangle
    this._vm.$socket.emit('dismissAction', index);
    commit('dismissOrderedActions', index);
  },
  async addProduct({ commit }, product) {
    commit('addProduct', product);
  },
  async addAction({ commit }, product) {
    commit('addAction', product);
  },
  async dismissOrder({ commit }, product) {
    // eslint-disable-next-line no-underscore-dangle
    this._vm.$socket.emit('dismissOrder', product);
    commit('dismissOrder', product);
  },
  async deleteProduct({ commit }, product) {
    // eslint-disable-next-line no-underscore-dangle
    this._vm.$socket.emit('deleteProduct', product);
    commit('deleteProduct', product);
  },
};
