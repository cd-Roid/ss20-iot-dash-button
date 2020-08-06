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
  setNewDevices(state, devices) {
    state.newDevices = devices;
  },
  addDevice(state, device) {
    state.newDevices.push(device);
  },
  deleteDevice(state, index) {
    state.newDevices.splice(index, 1);
  },
};
