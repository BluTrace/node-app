var WebSocketServer = require('ws').Server
var mediator = require('./mediator'),
    logger = require('logger');

var _ = require('underscore'),
    beacons = {},
    strongestBeacon = null,
    updateBeacon = updateBeacon;

var getBeacon = function(macAddr){
    return beacons[macAddr];
}
var getStrongestBeacon = function(){
    return strongestBeacon;
}
var addBeacon = function(beacon){
    logger.log('announce','adding beacon: '+beacon.name());
    beacons[beacon.macAddress]=beacon;
}

var updateBeacon = function(macAddress,rssi){
    var beacon = beacons[macAddress];
    if(beacon){
        beacon.updateRSSI(rssi);
    }
}

var dump = function(){
    console.log(beacons);
}

var nominateStrongestBeacon = function(){
    var bs = [];
    for(var i in beacons){
        bs.push(beacons[i]);
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
    if(strongestBeacon != bs[0]){
        change = true;
    }
    strongestBeacon = bs[0];
    if(change){
        mediator.pubsub.emit('strongestBeaconChange');
    }
}

var startListening = function(){
    var wss = new WebSocketServer({port: 9999});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            message = JSON.parse(message);
            //console.log(message);
            for(var i in message){
                macAddress = message[i][0];
                rssi = message[i][1];
                updateBeacon(macAddress,rssi)
            }
            nominateStrongestBeacon();
            if(strongestBeacon){
             console.log('strongest Beacon is: '+strongestBeacon.name());
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



module.exports.startListening = startListening;
module.exports.dump = dump;
module.exports.addBeacon = addBeacon;
module.exports.getStrongestBeacon = getStrongestBeacon;
module.exports.getBeacon = getBeacon;
