const app = require('express')();
var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require("socket.io")(http);
const mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://test.mosquitto.org')
 
client.on('connect', function () {
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/order/+', function (err) {
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  io.emit("order", message.toString());
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('Server running');
});
