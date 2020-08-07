export default {
  setOrders(state, orders) {
    state.orders = orders;
  },
  addOrder(state, order) {
    state.orders.unshift(order);
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
  setMode(state, mode) {
    state.mode = mode;
  },
  setActions(state, actions) {
    state.actionList = actions;
  },
  addActions(state, action) {
    state.actionList.push(action);
  },
  deleteActions(state, index) {
    state.actionList.list.splice(index);
  },
  setOrderedActions(state, orderedActions) {
    state.orderedActions = orderedActions;
  },
  dismissOrderedActions(state, index) {
    state.orderedActions = state.orderedActions
      // eslint-disable-next-line no-underscore-dangle
      .filter((action) => action.orderedActions._id !== index);
  },
  addProduct(state, product) {
    state.orderList.push(product);
  },
};
