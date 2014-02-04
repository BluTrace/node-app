var WebSocketServer = require('ws').Server
var mediator = require('./mediator')

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

_env.nominateStrongestBeacon = function(){
    var bs = [];
    for(var i in this.beacons){
        bs.push(this.beacons[i]);
    }
    bs = bs.filter(function(b){
                return b.influencing()==true
            })
    console.log("competing beacons count "+bs.length)
    bs = bs.sort(function(a,b){
        return a.normalizedRSSI()<b.normalizedRSSI()
    });
    //console.log(bs);
    var change = false;
    if(this.strongestBeacon != bs[0]){
        change = true;
    }
    this.strongestBeacon = bs[0];
    if(change){
        mediator.pubsub.emit('strongestBeaconChange');
    }
}

_env.startListening = function(){
    var self = this;
    var wss = new WebSocketServer({port: 9999});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            message = JSON.parse(message);
            console.log(message);
            for(var macAddress in message){
                self.updateBeacon(macAddress,message[macAddress].rssi)
            }
            self.nominateStrongestBeacon();
            console.log('strongest Beacon is: '+self.strongestBeacon.name());
            ws.send('ACK');
        });
    });
}


function parseMessage(message){
    message = JSON.parse(message);
}



module.exports = Environment;