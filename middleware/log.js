function log(payload, event) {
    let obj = {
        event: event,
        time: new Date().getTime().toString(),
        payload: payload
    }
    console.log("EVENT", obj);
}

module.exports = log;
