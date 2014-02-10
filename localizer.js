var mediator = require('./mediator'),
    Environment = require('./environment'),
    logger = require('./logger');

var x = null,
    y = null,
    environ = null;

mediator.pubsub.on('strongestBeaconChange',function(msg){
    var beacon = Environment.getStrongestBeacon();
    x = beacon.x;
    y = beacon.y;
    logger.log("announce","===========> Relocalizing to: ("+x+","+y+")");
    mediator.pubsub.emit('newLocation');
})

function setEnvironment(e){
    environ = e;
}

module.exports.setEnvironment = setEnvironment;

