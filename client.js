var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:9999');
ws.on('open', function() {
    ws.send('{"MAC1":{"rssi":1}}');
});
ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
    console.log(data)
});
