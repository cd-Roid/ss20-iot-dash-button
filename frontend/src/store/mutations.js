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
  addAction(state, action) {
    state.actionList[0].list.push(action);
  },
  deleteActions(state, index) {
    state.actionList.list.splice(index);
  },
  setOrderedActions(state, orderedActions) {
    state.orderedActions = orderedActions;
  },
  dismissOrderedActions(state, actionID) {
    state.orderedActions = state.orderedActions
    // eslint-disable-next-line no-underscore-dangle
      .filter((el) => el._id !== actionID);
  },
  addProduct(state, product) {
    state.orderList.push(product);
  },
  dismissOrder(state, orderID) {
    state.orders = state.orders
      // eslint-disable-next-line no-underscore-dangle
      .filter((el) => el._id !== orderID);
  },
};
