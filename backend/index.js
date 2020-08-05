const app = require("express")();
var http = require("http").createServer(app);
const Mongoose = require('mongoose');
const io = require("socket.io")(http);
const mqtt = require("mqtt");
let productList = [];
let actionOrder = [];
let orderedProduct = [];

var client = mqtt.connect("mqtt://hivemq.dock.moxd.io");
Mongoose.connect("mongodb+srv//iot-admin:iot-password@cluster0.d2vsw.mongodb.net/iot-db?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
  .catch((err) => console.error(err));
const db = Mongoose.connection
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to db'));

client.on("connect", function () {
  client.subscribe("mittelkonsole/order/+", function (err) {
    console.error(err);
  });
  client.subscribe("thkoeln/IoT/bmw/montage/mittelkonsole/action/+", function (
    err
  ) {
    console.error(err);
  });
  client.subscribe("thkoeln/IoT/bmw/montage/mittelkonsole/list", function (
    err
  ) {
    console.error(err);
  });
  client.subscribe(
    "thkoeln/IoT/bmw/montage/mittelkonsole/actionList",
    function (err) {
      console.error(err);
    }
  );
  client.subscribe("thkoeln/IoT/bmw/montage/mittelkonsole/mode", function (
    err
  ) {
    console.error(err);
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.length);
  if (message.length) {
    let computedMessage = JSON.parse(message.toString());
    console.log(topic);
    console.log("Message:" + message.toString());
    if (topic == "thkoeln/IoT/bmw/montage/mittelkonsole/list") {
      io.emit("productList", computedMessage);
    } else if (topic == "thkoeln/IoT/bmw/montage/mittelkonsole/actionList") {
      io.emit("actionList", computedMessage);
    } else if (topic == "thkoeln/IoT/bmw/montage/mittelkonsole/mode'") {
      io.emit("mode", computedMessage);
    } else if (
      topic.startsWith("thkoeln/IoT/bmw/montage/mittelkonsole/action/")
    ) {
      actionOrder.push(computedMessage);
      io.emit("orderedAction", computedMessage);
    } else if (topic.startsWith("mittelkonsole/order/")) {
      orderedProduct.push(computedMessage);
      io.emit("orderedProduct", orderedProduct);
    }
  }
});

/*client.on("message", function(topic, message) {
  if(message.length!=0){
    if(topic == "thkoeln/IoT/bmw/montage/mittelkonsole/list"){
      console.log("Topic:"+topic +",Message:"+ message );
      client.publish(topic,message);
      io.emit("AddedProduct", message);
    }
  }
})
*/


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newProduct", (msg) => {
    productList.push(msg);
    client.publish(
      "thkoeln/IoT/bmw/montage/mittelkonsole/list",
      JSON.stringify(productList),
      { retain: true }
    );
    console.log(msg);
  });
  io.emit("productList", productList);
});

http.listen(3000, () => {
  console.log("Server running");
});
