const app = require('express')();
var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require('socket.io')(http);
const mqtt = require('mqtt');
const Actions = require('./Models/actionModel');
const Mode = require('./Models/modeModel');
const productList = require('./Models/productListModel');
let actionOrder = [];
let list = [];
let orderedProduct = [];

var client = mqtt.connect('mqtt://hivemq.dock.moxd.io');
Mongoose.connect(
  'mongodb+srv://iot-admin:iot-password@cluster0.d2vsw.mongodb.net/IOT-DB?retryWrites=true&w=majority',
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
      let collectionSize = await Mongoose.connection
        .collection('products')
        .countDocuments();
      if (collectionSize == 0) {
        await newList.save(function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${newList} to db!`);
          }
        });
      }
      io.emit('productList', computedMessage);
    } else if (topic == 'thkoeln/IoT/bmw/montage/mittelkonsole/actionList') {
      let actionSize = await Mongoose.connection
        .collection('actions')
        .countDocuments();
      if (actionSize == 0) {
        const newActions = new Actions({ list: computedMessage });
        await newActions.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${newActions} to db!`);
          }
        });
      }
      io.emit('actionList', computedMessage);
    } else if (topic == 'thkoeln/IoT/bmw/montage/mittelkonsole/mode') {
      let mode = new Mode({ mode: computedMessage });
      let modeSize = await Mongoose.connection
        .collection('modes')
        .countDocuments();
      if (modeSize == 0) {
        await mode.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Saved ${mode} to db!`);
          }
        });
      } else {
        let toChange = await Mode.find({ _id: '5f2b5ae37307f14426c5049c' });
        if (toChange) {
          let obj = toChange[0];
          obj.mode = computedMessage;
          obj.save((err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Saved ${mode} to db!`);
            }
          });
        }
      }
      io.emit('mode', computedMessage);
    } else if (
      topic.startsWith('thkoeln/IoT/bmw/montage/mittelkonsole/action/')
    ) {
      actionOrder.push(computedMessage);
      io.emit('orderedAction', computedMessage);
    } else if (topic.startsWith('mittelkonsole/order/')) {
      orderedProduct.push(computedMessage);
      io.emit('orderedProduct', orderedProduct);
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
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
  io.emit('productList', list);
});

http.listen(3000, () => {
  console.log('Server running');
});
