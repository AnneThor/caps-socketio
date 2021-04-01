'use strict';

require('dotenv').config();

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const log = require('./middleware/log.js')

const caps = io.of('/caps');

caps.on('connection', socket => {

  // when vendors/drivers join they need to go to own room
  socket.on('join', (room) => {
    socket.join(room);
  })

  socket.on('pickup', (payload, event) => {
    log(payload, { event: 'pickup' });
    socket.broadcast.emit('pickup', payload);
  });

  // this should only go back to pickup driver
  socket.on('in-transit', (payload, driver) => {
    log(payload, { event: 'in-transit' });
    io.of('caps').emit('in-transit', payload);
    let store = payload.store;
    socket.to(store).emit('in-transit', payload);
  });

  // this should only go back to vendor
  socket.on('delivered', (payload) => {
    log(payload, { event: 'delivered' });
    let store = payload.store;
    // socket.broadcast.emit('delivered', payload, event);
    socket.to(store).emit('delivered', payload);
  });

})
