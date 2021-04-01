'use strict';

require('dotenv').config();

const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {
    
    socket.on('pickup', log);
    socket.on('in-transit', log);
    socket.on('delivered', log);

})

function log(payload, event) {
    let obj = {
        event: event,
        time: new Date().getTime().toString();
        payload: paylod
    }
    console.log("Event", obj);
}

server.listen(process.env.port || 3000);

module.exports = log;