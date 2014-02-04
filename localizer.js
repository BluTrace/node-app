var mediator = require('./mediator');

var x = null,
    y = null,
    environ = null;

mediator.pubsub.on('strongestBeaconChange',function(msg){
    var beacon = environ.strongestBeacon;
    x = beacon.x;
    y = beacon.y;
    console.log("===========> Relocalizing to: ("+x+","+y+")");
})

function setEnvironment(e){
    environ = e;
}

module.exports.setEnvironment = setEnvironment;

