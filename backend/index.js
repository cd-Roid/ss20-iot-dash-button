const app = require('express')();
var cors = require('cors');
app.use(cors());

var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require('socket.io')(http);
const mqtt = require('mqtt');
require('dotenv').config();

const OrderedActions = require('./Models/orderedActionModel');
const Actions = require('./Models/actionModel');
const Mode = require('./Models/modeModel');
const productList = require('./Models/productListModel');
const Orders = require('./Models/orderModel.js');
const setupID = require('./Models/setupIDModel');
const Employee = require('./Models/employeeModel');
const modeModel = require('./Models/modeModel');

const baseTopic = process.env.BASETOPIC;
Mongoose.connect(process.env.MONGODB_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).catch((err) => console.error(err));
const db = Mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => {
  console.log('Connected to db');
  main();
});

function main() {
  var client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`);

  client.on('connect', function () {
    client.subscribe(baseTopic + '/order/+', function (err) {
      console.error(err);
    });
    client.subscribe(baseTopic + '/action/+', function (err) {
      console.error(err);
    });
    client.subscribe(baseTopic + '/list', async function (err) {
      if (err) {
        console.log('ERROR');
        console.error(err);
      } else {
        let products = await productList.find({});
        console.log(products);
        if (products.length == 0) {
          let firstProduct = [
            {
              name: '1. Product',
              quantity: '1',
              step: '1',
            },
          ];

          client.publish(baseTopic + '/list', JSON.stringify(firstProduct), {
            retain: true,
          });
        }
      }
    });
    client.subscribe(baseTopic + '/actionList', async function (err) {
      if (err) {
        console.log('ERROR');
        console.error(err);
      } else {
        let actions = await Actions.find({});
        if (actions.length == 0) {
          let firstAction = [
            {
              name: '1. Action',
            },
          ];

          client.publish(
            baseTopic + '/actionList',
            JSON.stringify(firstAction),
            {
              retain: true,
            },
          );
        }
      }
    });
    client.subscribe(baseTopic + '/mode', async function (err) {
      if (err) {
        console.log('ERROR');
        console.error(err);
      } else {
        let mode = await Mode.find({});
        if (mode.length == 0) {
          client.publish(baseTopic + '/mode', '0', {
            retain: true,
          });
        }
      }
    });

    client.subscribe(baseTopic + '/setup', (err) => {
      console.error(err);
    });
  });

  client.on('message', async function (topic, message) {
    // message is Buffer
    //console.log(message.length);
    if (message.length) {
      let computedMessage = message.toString();
      try {
        computedMessage = JSON.parse(message.toString());
      } catch (err) {
        console.log(err);
      }
      // console.log('Message:' + message.toString());
      if (topic == baseTopic + '/list') {
        console.log('on RECIVE:' + JSON.stringify(computedMessage));
        productList.remove({}, (err) => {
          if (err) throw err;
        });
        productList.create(computedMessage).then(async (data) => {
          console.log('Sending new List to Client...');
          io.emit('productList', data);
        });
      } else if (topic == baseTopic + '/actionList') {
        Actions.remove({}, (err) => {
          if (err) throw err;
        });
        Actions.create(computedMessage).then(async (data) => {
          console.log('Sending new List to Client...');
          io.emit('actions', data);
        });
      } else if (topic == baseTopic + '/mode') {
        let newMode = new Mode({ mode: computedMessage });
        Mode.remove({}, (err) => {
          if (err) throw err;
        });
        await newMode.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${newMode} to db!`);
          }
        });
        io.emit('mode', computedMessage);
      } else if (topic.startsWith(baseTopic + '/action/')) {
        let eID = topic.split('/');
        eID = eID[eID.length - 1];
        let orderedAction = new OrderedActions({
          name: computedMessage.name,
          time: new Date(),
          eID: eID,
        });
        await orderedAction.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${orderedAction} to db!`);
          }
        });
        let mitarbeiter = await Employee.find({});
        orderedAction = orderedAction.toJSON();
        let name = mitarbeiter.find((elem) => elem.eID == orderedAction.eID);
        orderedAction.employee = name ? name.name : orderedAction.eID;
        io.emit('orderedAction', orderedAction);
      } else if (topic.startsWith(baseTopic + '/order/')) {
        let id = topic.split('/');
        id = id[id.length - 1];
        let newOrder = new Orders({
          name: computedMessage.name,
          quantity: computedMessage.quantity,
          eID: id,
          time: new Date(),
        });
        await newOrder.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${newOrder} to db!`);
          }
        });
        let mitarbeiter = await Employee.find({});
        newOrder = newOrder.toJSON();
        let name = mitarbeiter.find((elem) => elem.eID == newOrder.eID);
        newOrder.employee = name ? name.name : newOrder.eID;
        io.emit('orderedProduct', newOrder);
      } else if (topic == baseTopic + '/setup') {
        let device = await setupID.findOne({ SetupId: computedMessage });
        if (device) {
          io.emit('setupID', device);
        } else {
          let newID = new setupID({ SetupId: computedMessage });
          await newID.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Saved ${newID} to db!`);
            }
          });
          io.emit('setupID', newID);
        }
      }
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/devices', async (req, res) => {
    let newDevices = await setupID.find({});
    console.log(newDevices);
    res.send(newDevices);
  });

  app.get('/users', async (req, res) => {
    let users = await Employee.find({});
    console.log(users);
    res.send(users);
  });

  app.get('/orders', async (req, res) => {
    let currentOrders = await Orders.find({}).sort('-time');
    let mitarbeiter = await Employee.find({});
    currentOrders = await Orders.addName(currentOrders, mitarbeiter);
    console.log(currentOrders);
    res.send(currentOrders);
  });

  app.get('/orderList', async (req, res) => {
    let currentOrders = await productList.find({});
    console.log(currentOrders);
    res.send(currentOrders);
  });

  app.get('/orderedActions', async (req, res) => {
    let orderedActions = await OrderedActions.find({}).sort('-time');
    let mitarbeiter = await Employee.find({});
    orderedActions = await Orders.addName(orderedActions, mitarbeiter);
    console.log(orderedActions);
    res.send(orderedActions);
  });

  app.get('/actions', async (req, res) => {
    let actions = await Actions.find({});
    res.send(actions);
  });

  app.get('/mode', async (req, res) => {
    let mode = await modeModel.findOne({});
    console.log(mode);
    res.send('' + mode.mode);
  });

  io.on('connection', async (socket) => {
    console.log('a user connected');

    socket.on('mode_change', (msg) => {
      client.publish(baseTopic + '/mode', msg.toString(), { retain: true });
      console.log('message: ' + msg);
    });

    socket.on('newProduct', async (msg) => {
      let products = await productList.find({}, '-_id -__v');
      products.push({
        name: msg.name,
        quantity: msg.quantity,
        step: msg.step,
      });
      client.publish(baseTopic + '/list', JSON.stringify(products), {
        retain: true,
      });
    });
    socket.on('newAction', async (msg) => {
      let actions = await Actions.find({}, '-_id -__v');
      actions.push({
        name: msg.name,
      });
      client.publish(baseTopic + '/actionList', JSON.stringify(actions), {
        retain: true,
      });
    });
    socket.on('deleteAction', async (msg) => {
      Actions.remove({ _id: msg }, (err) => {
        if (err) throw err;
      });
      Actions.find({}, '-_id -__v').then((data) => {
        const newList = JSON.stringify(data);
        client.publish(baseTopic + '/actionList', newList, {
          retain: true,
        });
      });
      console.log('Deleted New Action: ' + msg);
    });
    socket.on('deleteProduct', async (msg) => {
      productList.deleteOne({ _id: msg }, (err) => {
        if (err) throw err;
      });
      productList.find({}, '-_id -__v').then((data) => {
        const newList = JSON.stringify(data);
        client.publish(baseTopic + '/list', newList, {
          retain: true,
        });
      });

      console.log('Deleted New Product: ' + msg);
    });
    socket.on('dismissOrder', (msg) => {
      Orders.deleteOne({ _id: msg }, (err) => {
        if (err) throw err;
      });
      console.log('Dismissed Order: ' + msg);
    });
    socket.on('dismissAction', async (msg) => {
      OrderedActions.deleteOne({ _id: msg }, (err) => {
        if (err) throw err;
      });
      const newList = await OrderedActions.find({});
      console.log(newList);
      console.log('Dismissed Action: ' + msg);
    });

    socket.on('setupDevice', async (msg) => {
      const newEmployee = new Employee({
        name: msg.name,
        eID: msg.eID,
        setupID: msg.setupID,
      });
      await newEmployee.save();
      await setupID.deleteOne({ SetupId: msg.setupID });
      client.publish(baseTopic + '/setup/' + msg.setupID, msg.eID.toString(), {
        retain: false,
      });
      console.log('message: ' + msg);
    });
  });

  http.listen(3000, () => {
    console.log('Server running');
  });
}
