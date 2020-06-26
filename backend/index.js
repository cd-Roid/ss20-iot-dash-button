const app = require('express')();
var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require("socket.io")(http);
const mqtt = require('mqtt');
let orderList = [];

var client  = mqtt.connect('mqtt://test.mosquitto.org')
 
client.on('connect', function () {
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/order/+', function (err) {
  })
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/list', function (err) {
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  if (topic == "thkoeln/IoT/bmw/montage/mittelkonsole/list") {
    orderList = JSON.parse(message.toString());
    io.emit("orderList", orderList);
  } else {
    let msg = JSON.parse(message.toString())
    io.emit("order", {msg, topic});
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('newProduct', (msg) => {
    orderList.push(msg);
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/list", JSON.stringify(orderList), {retain: true})
    console.log( msg);
  });
  io.emit("orderList", orderList);
});

http.listen(3000, () => {
  console.log('Server running');
});
