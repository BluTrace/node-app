var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer');

mediator.pubsub.on('orientationChanged',function(message){
    console.log('current orientation: '+condole.dir(message));
});

mediator.pubsub.on('waypointReached',function(message){

});

mediator.pubsub.on('destinationReached',function(message){
    console.log('DESTINATION REACHED!');
});




