export default {
  async loadOrders({ commit }) {
    const result = await fetch('http://localhost:3000/orders');

    if (!result.ok) {
      throw new Error(`Could not access ${this.url}`);
    }

    const paintings = await result.json();

    commit('setOrders', paintings);
  },
  SOCKET_orderedProduct({ commit }, order) {
    commit('addOrder', order);
  },
};
