var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer');
    Sensor = require('./sensor');
    Router = require('./router');

mediator.pubsub.on('orientationChanged',function(message){
    console.log('re-orienting')
    console.dir(message);
    var orientation = JSON.parse(message)['orientation'];
    if(Math.abs(Router.getPathVector()-orientation)<6)
     console.log('-----> HOMING! <------');
});

mediator.pubsub.on('waypointReached',function(message){

});

mediator.pubsub.on('destinationReached',function(message){
    console.log('DESTINATION REACHED!');
});




