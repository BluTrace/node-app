var mediator = require('./mediator'),
    Environment = require('./environment')

var x = null,
    y = null,
    environ = null;

mediator.pubsub.on('strongestBeaconChange',function(msg){
    var beacon = Environment.strongestBeacon;
    x = beacon.x;
    y = beacon.y;
    console.log("===========> Relocalizing to: ("+x+","+y+")");
    mediator.pubsub.emit('newLocation');
})

function setEnvironment(e){
    environ = e;
}

module.exports.setEnvironment = setEnvironment;

