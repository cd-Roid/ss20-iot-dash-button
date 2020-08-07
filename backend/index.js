const app = require('express')();
var cors = require('cors')
app.use(cors());

var http = require('http').createServer(app);
const Mongoose = require('mongoose');
const io = require('socket.io')(http);
const mqtt = require('mqtt');
const env = require("dotenv").config();
const OrderedActions = require("./Models/orderedActionModel");
const Actions = require('./Models/actionModel');
const Mode = require('./Models/modeModel');
const productList = require('./Models/productListModel');
const Orders = require('./Models/orderModel.js');
const setupID = require("./Models/setupIDModel");


let list = [];
let setupMessage = 0;

var client = mqtt.connect('mqtt://hivemq.dock.moxd.io');
Mongoose.connect(
  process.env.MONGODB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
).catch((err) => console.error(err));
const db = Mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to db'));

client.on('connect', function () {
  client.subscribe('mittelkonsole/order/+', function (err) {
    console.error(err);
  });
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/action/+',
    function (err) {
      console.error(err);
    });
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/list',
    function (err) {
      console.error(err);
    });
  client.subscribe(
    'thkoeln/IoT/bmw/montage/mittelkonsole/actionList',
    function (err) {
      console.error(err);
    },
  );
  client.subscribe('thkoeln/IoT/bmw/montage/mittelkonsole/mode',
    function (err) {
      console.error(err);
    });

  client.subscribe("thkoeln/IoT/setup", (err) => {
    console.error(err);
  })
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

    } else if (topic.startsWith('thkoeln/IoT/bmw/montage/mittelkonsole/action/')) {
      let eID = topic.split("/");
      eID = eID[eID.length - 1];
      let orderedAction = new OrderedActions({
        name: computedMessage.name,
        time: new Date(),
        eID: eID
      })
      orderedAction.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Saved ${orderedAction} to db!`);
        }
      })
      io.emit('orderedAction', computedMessage);

    } else if (topic.startsWith('mittelkonsole/order/')) {
      let id = topic.split('/');
      id = id[id.length - 1];
      let newOrder = new Orders({
        name: computedMessage.name,
        quantity: computedMessage.quantity,
        eID: id,
        time: new Date()
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
    else if (topic == "thkoeln/IoT/setup") {
      let setup = JSON.parse(message);
      let newID = new setupID({ SetupId: setup });
      setupMessage = setupID;
      await newID.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Saved ${newID} to db!`);
        }
      });
      io.emit('setupID', setup);
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get("/setup", (req, res) => {
  try {
    res.send(setupMessage);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/setup", (req, res) => {
  try {
    let randomID = setupMessage;
    let eID = req.body.eID;
    client.publish("thkoeln/IoT/setup/" + randomID, eID,
      () => { console.log("Published id to new Device."); });
    res.send({ message: "Device now registered under:" + eID });
  } catch (error) {
    res.status(500).json({ message: error });
  }
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

app.get('/orderedActions', async (req, res) => {
  let orderedActions = await OrderedActions.find({});
  console.log(orderedActions);
  res.send(orderedActions);
});

app.get('/actions', async (req, res) => {
  let actions = await Actions.find({});
  io.emit("actions", actions);
  res.send(actions);
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

  socket.on("add_action", message => {
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/actionList",
      message.toString(),
    );
    console.log("added new action: " + message);
  })

  socket.on("remove_action", message => {
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/actionList",
      message.toString(),
    );
    console.log("removed action: " + message);
  });

  socket.on("dismiss_action", message => {
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/action/+", // change to actionoders
      message.toString(),
    );
    console.log("acknowleged action: " + message);
  });

  socket.on("add_product", message => {
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/list",
      message.toString(),
    );
    console.log("added new product: " + message);
  })

  socket.on("remove_product", message => {
    client.publish("thkoeln/IoT/bmw/montage/mittelkonsole/list",
      message.toString(),
    );
    console.log("removed Product: " + message);
  });

  socket.on("dismiss_order", message => {
    client.publish("mittelkonsole/order/",
      message.toString(),
    );
    console.log("acknowleged Order: " + message);
  });

});



http.listen(3000, () => {
  console.log('Server running');
});
