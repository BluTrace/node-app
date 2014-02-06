var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer');

mediator.pubsub.on('newOrientation',function(message){
    //check if it matches requiredOrientation within a range
    //and inform
});

mediator.pubsub.on('waypointReached',function(message){

});

mediator.pubsub.on('destinationReached',function(message){
    console.log('DESTINATION REACHED!');
});




