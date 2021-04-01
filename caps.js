'use strict';

require('dotenv').config();

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const caps = io.of('/caps');

caps.on('connection', socket => {

  // when vendors/drivers join they need to go to own room
  socket.on('join', (room) => {
    socket.join(room);
  })

  socket.on('pickup', (payload, event) => {
    log(payload, event);
    socket.broadcast.emit('pickup', payload, event);
  });

  // this should only go back to pickup driver
  socket.on('in-transit', (payload, event, driver) => {
    log(payload, event);
    io.of('caps').emit('in-transit', payload, event);
    let storeId = payload.storeId;
    socket.to(storeId).emit('in-transit', payload, event);
  });

  // this should only go back to vendor
  socket.on('delivered', (payload, event) => {
    log(payload, event);
    let storeId = payload.storeId;
    // socket.broadcast.emit('delivered', payload, event);
    socket.to(storeId).emit('delivered', payload, event);
  });

})

function log(payload, event) {
    let obj = {
        event: event,
        time: new Date().getTime().toString(),
        payload: payload
    }
    console.log("Event", obj);
}

module.exports = log;
