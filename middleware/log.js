function log(payload, event) {
    let obj = {
        event: event,
        time: new Date().getTime().toString(),
        payload: payload
    }
    console.log("Event", obj);
}

module.exports = log;
