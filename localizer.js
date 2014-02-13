var mediator = require('./mediator'),
    Environment = require('./environment'),
    logger = require('./logger'),
    Guide = require('./guide');

var x = null,
    y = null,
    name = null,
    environ = null;

mediator.pubsub.on('strongestBeaconChange',function(msg){
    var beacon = Environment.getStrongestBeacon();
    logger.log("data","[STRONGEST BEACON] "+beacon.btName+" RSSI "+beacon.currentRSSI+" TRIGGER "+beacon.rssiAtAssociationRange);
    if(beacon.isHot()){
        if(x!=beacon.x||y!=beacon.y){
         x = beacon.x;
         y = beacon.y;
         name = beacon.btName;
         //Guide.speak("Position updated. Scan for direction.");
         logger.log("announce","[NEW POSITION] ("+x+","+y+")");
         mediator.pubsub.emit('newLocation');
        }
    }
})

function getLocationName(){
    return name;
}

function setEnvironment(e){
    environ = e;
}

module.exports.setEnvironment = setEnvironment;
module.exports.getLocationName = getLocationName;

