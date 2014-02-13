var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer'),
    Sensor = require('./sensor'),
    Router = require('./router'),
    Vector = require('./vector'),
    Destinations = require('./destinations'),
    sound = require('./sound'),
    logger = require('./logger');

var speak = function(words){
    sound.speak(words);
    logger.log('speech',words);
}

module.exports.speak = speak;

mediator.pubsub.on('orientationChanged',function(message){
    var requiredVector = Router.getPathVector();
    if(requiredVector){
     console.log('re-orienting')
     console.dir(message);
     var orientation = JSON.parse(message)['orientation'];
     console.log(Vector.getDegree(requiredVector));
     console.log(orientation)
     if(Math.abs(Vector.getDegree(requiredVector)-orientation)<6){
      sound.bleep();
      logger.log('announce','-----> HOMING! <------');
     }
    }
});

mediator.pubsub.on('waypointReached',function(message){

});

mediator.pubsub.on('destinationReached',function(message){
    speak('You have reached your destination!');
});

mediator.pubsub.on('rightKeyPressed',function(){
    var choice = Destinations.nextLocationChoice();
    if(Router.isReachable(choice)){
        speak('Going to '+choice);
    } else {
        speak('Unreachable destination!');
    }
    Router.setDestinationBeaconMacAddress(choice);
})




