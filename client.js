var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:9999');
ws.on('open', function() {
    setTimeout(function(){ws.send('{"MAC1":{"rssi":5},"MAC2":{"rssi":5},"MAC3":{"rssi":10}}');},1000);
    setTimeout(function(){ws.send('{"MAC1":{"rssi":10},"MAC2":{"rssi":5},"MAC3":{"rssi":5}}');},4000);
    setTimeout(function(){ws.send('{"MAC1":{"rssi":5},"MAC2":{"rssi":10},"MAC3":{"rssi":5}}');},9000);
});
ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
    console.log(data)
});
