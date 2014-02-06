var WebSocketServer = require('ws').Server
var mediator = require('./mediator')
var _ = require('underscore')

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
    //console.log(this.dump());
    var bs = [];
    for(var i in this.beacons){
        bs.push(this.beacons[i]);
    }
    bs = bs.filter(function(b){
                return b.influencing()==true
            })
    //console.log("competing beacons"+bs.map(function(el){return el.name()+" "+el.normalizedRSSI();}))
    //var sorted_beacons = bs.sort(function(a,b){
    //    return a.normalizedRSSI()>b.normalizedRSSI();
    //});
    var sorted_beacons = _.sortBy(bs,function(el){ return el.normalizedRSSI(); });
    bs = sorted_beacons;
    //console.log(bs.map(function(el){
    //    return el.name()+" "+el.currentRSSI+" "+el.normalizedRSSI();
    //}).join("\n"));

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
    var self = this,
        wss = new WebSocketServer({port: 9999});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            message = JSON.parse(message);
            //console.log(message);
            for(var i in message){
                macAddress = message[i][0];
                rssi = message[i][1];
                self.updateBeacon(macAddress,rssi)
            }
            self.nominateStrongestBeacon();
            if(self.strongestBeacon){
             console.log('strongest Beacon is: '+self.strongestBeacon.name());
            } else {
             console.log('No beacon!');
            }
            ws.send('ACK');
        });
    });
}


function parseMessage(message){
    message = JSON.parse(message);
}



module.exports = Environment;
