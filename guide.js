var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer');
    Sensor = require('./sensor');
    Router = require('./router');
    Vector = require('./vector');

mediator.pubsub.on('orientationChanged',function(message){
    var requiredVector = Router.getPathVector();
    if(requiredVector){
     console.log('re-orienting')
     console.dir(message);
     var orientation = JSON.parse(message)['orientation'];
     if(Math.abs(Vector.getDegree(requiredVector)-orientation)<6)
      console.log('-----> HOMING! <------');
    }
});

mediator.pubsub.on('waypointReached',function(message){

});

mediator.pubsub.on('destinationReached',function(message){
    console.log('DESTINATION REACHED!');
});




