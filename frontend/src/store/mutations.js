export default {
  setOrders(state, orders) {
    state.orders = orders;
  },
  addOrder(state, order) {
    state.orders.push(order);
  },
  setOrderList(state, list) {
    state.orderList = list;
  },
};
