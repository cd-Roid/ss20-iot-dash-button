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
};