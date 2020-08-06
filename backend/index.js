const app = require('express')();
var cors = require('cors')
app.use(cors());

var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require('socket.io')(http);
const mqtt = require('mqtt');

const Actions = require('./Models/actionModel');
const Mode = require('./Models/modeModel');
const productList = require('./Models/productListModel');
const Orders = require('./Models/orderModel.js');

let actionOrder = [];
let list = [];
let orderedProduct = [];

var client = mqtt.connect('mqtt://hivemq.dock.moxd.io');
Mongoose.connect(
  'mongodb+srv://IoT-admin:L7gmpz1U6wVPX4f9@iot.fyxl1.mongodb.net/IOT-DB?retryWrites=true&w=majority',
  { useUnifiedTopology: true, useNewUrlParser: true },
).catch((err) => console.error(err));
const db = Mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to db'));

client.on('connect', function () {
  client.subscribe('mittelkonsole/order/+', function (err) {
    console.error(err);
  });
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/action/+', function (
    err,
  ) {
    console.error(err);
  });
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/list', function (
    err,
  ) {
    console.error(err);
  });
  client.subscribe(
    'thkoeln/IoT/bmw/montage/mittelkonsole/actionList',
    function (err) {
      console.error(err);
    },
  );
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/mode', function (
    err,
  ) {
    console.error(err);
  });
});

client.on('message', async function (topic, message) {
  // message is Buffer
  //console.log(message.length);
  if (message.length) {
    let computedMessage = JSON.parse(message.toString());
    console.log('Message:' + message.toString());
    if (topic == 'thkoeln/IoT/bmw/montage/mittelkonsole/list') {
      let newList = (list = new productList({ list: computedMessage }));
      productList.remove({}, (err) => {
        if (err) throw err;
      });
      await newList.save(function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log(`Saved ${newList} to db!`);
        }
      });
      io.emit('productList', computedMessage);
    } else if (topic == 'thkoeln/IoT/bmw/montage/mittelkonsole/actionList') {
      Actions.remove({}, (err) => {
        if (err) throw err;
      });
      const newActions = new Actions({ list: computedMessage });
      await newActions.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Saved ${newActions} to db!`);
        }
      });
      io.emit('actionList', computedMessage);
    } else if (topic == 'thkoeln/IoT/bmw/montage/mittelkonsole/mode') {
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
    } else if (
      topic.startsWith('thkoeln/IoT/bmw/montage/mittelkonsole/action/')
    ) {
      actionOrder.push(computedMessage);
      io.emit('orderedAction', computedMessage);
    } else if (topic.startsWith('mittelkonsole/order/')) {
      let id = topic.split('/');
      id = id[id.length - 1];
      let newOrder = new Orders({
        name: computedMessage.name,
        quantity: computedMessage.quantity,
        eID: id,
      });
      await newOrder.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Saved ${newOrder} to db!`);
        }
      });
      io.emit('orderedProduct', newOrder);
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/orders', async (req, res) => {
  let currentOrders = await Orders.find({});
  console.log(currentOrders);
  res.send(currentOrders);
});

app.get('/orderList', async (req, res) => {
  let currentOrders = await productList.findOne({});
  console.log(currentOrders);
  res.send(currentOrders);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('newProduct', (msg) => {
    list.push(msg);
    client.publish(
      'thkoeln/IoT/bmw/montage/mittelkonsole/list',
      JSON.stringify(list),
      { retain: true },
    );
    console.log('message: ' + msg);
  });
  socket.on('mode_change', (msg) => {
    client.publish(
      'thkoeln/IoT/bmw/montage/mittelkonsole/mode',
      msg.toString(),
      { retain: true },
    );
    console.log('message: ' + msg);
  });
  io.emit('productList', list);
});

http.listen(3000, () => {
  console.log('Server running');
});
