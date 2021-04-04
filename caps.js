+'use strict';

require('dotenv').config();

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const log = require('./middleware/log.js')

const caps = io.of('/caps');

// This is the undelivered message storage system
const capsHQ = {
  pickups: [],
};

caps.on('connection', socket => {

  // when vendors/drivers join they need to go to own room
  socket.on('join', (room) => {
    socket.join(room);
    // if the vendor or driver is establishing first connection
    // create a storage object for them
    if (Object.keys(capsHQ).includes(room) === false) {
      capsHQ[room] = {};
    }
  })

  // send out the offline delivery updates
  // payload here is the store or driver name
  socket.on('getAll', (payload) => {
    emptyStorage(payload);
  })

  socket.on('pickup', (payload) => {
    log(payload, { event: 'pickup' });
    handlePickup(payload);
    socket.broadcast.emit('pickup', payload);
  });

  // this should only go back to vendor
  socket.on('in-transit', (payload) => {
    console.log("INSIDE CAPS IN TRANSIT");
    log(payload, { event: 'in-transit' });
    handleIntransit(payload);
    let store = payload.store;
    io.of('caps').to(store).emit('in-transit', payload);
  });

  // this should only go back to vendor
  socket.on('delivered', (payload) => {
    log(payload, { event: 'delivered' });
    handleDelivery(payload);
    let store = payload.store;
    io.of('caps').to(store).emit('delivered', payload);
  });

  // handle a confirmed delivery
  socket.on('received', (payload) => {
    handleReceived(payload);
  });

})

function handlePickup(payload) {
  // add the event to the internal storage pickup queue
  capsHQ.pickups.unshift(payload);
}

function handleIntransit(payload) {
  // this needs to take off of the pickups queue
  // add to intransit queue of the vendor
  console.log("inside in transit");
  console.log(capsHQ.pickups);
  let store = payload.store;
  let delivery = capsHQ.pickups.pop();
  if(capsHQ[store].hasOwnProperty('intransit')) {
    capsHQ[store]['intransit'].unshift(delivery);
  } else {
    capsHQ[store]['intransit'] = [];
    capsHQ[store]['intransit'].unshift(delivery);
  }
}

function handleDelivery(payload) {
  // take off of the intransit queue for a given vendor
  // add to the delivered queue
  let store = payload.store;
  let delivery = capsHQ[store]['intransit'].pop();
  if (capsHQ[store].hasOwnProperty('delivered')) {
    capsHQ[store]['delivered'].unshift(delivery);
  } else {
    capsHQ[store]['delivered'] = [];
    capsHQ[store]['delivered'].unshift(delivery);
  }
}

function handleReceived(payload) {
  capsHQ[payload]['delivered'].pop();
}

function emptyStorage(payload) {
  let client = payload.client;
  let event = payload.event;
  if(event === 'pickup') {
    let pickups = capsHQ.pickups;
    pickups.forEach(pickup => {
      caps.to(client).emit(event, pickup);
    })
  } else {
    // event is not pickup so it's a vendor looking for deliveries
    if (capsHQ[client].hasOwnProperty(event)) {
      let deliveries = capsHQ[client][event];
      deliveries.forEach(delivery => {
        io.of('caps').to(client).emit(event, delivery);
      })
    }
  }
}
