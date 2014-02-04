var WebSocketServer = require('ws').Server

function Environment(){
    this.beacons = {};
    this.strongestBeacon = null;
    this.updateBeacon = updateBeacon;
}

var _env = Environment.prototype;

_env.addBeacon = function(beacon){
    this.beacons[beacon.macAddress]=beacon;
}

var updateBeacon = function(macAddress,rssi){
    var beacon = this.beacons[macAddress];
    if(beacon){
        beacon.updateRSSI(rssi);
    }
}

_env.dump = function(){
    console.log(this.beacons);
}

_env.startListening = function(){
    var self = this;
    var wss = new WebSocketServer({port: 9999});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            message = JSON.parse(message);
            for(var macAddress in message){
                self.updateBeacon(macAddress,message.rssi)
            }
            ws.send('ACK');
        });
    });
}


function parseMessage(message){
    message = JSON.parse(message);
}



module.exports = Environment;