var mediator = require('./mediator'),
    router = require('./router'),
    localizer = require('./localizer'),
    Sensor = require('./sensor'),
    Router = require('./router'),
    Vector = require('./vector'),
    Destinations = require('./destinations'),
    sound = require('./sound'),
    logger = require('./logger'),
    Environment = require('./environment');

var speak = function(words){
    sound.speak(words);
    logger.log('speech',words);
}

module.exports.speak = speak;

mediator.pubsub.on('orientationChanged',function(message){
    var requiredVector = Router.getPathVector();
    if(requiredVector){
     //console.log('re-orienting')
     //console.dir(message);
     var orientation = JSON.parse(message)['orientation'];
     //console.log(Vector.getDegree(requiredVector));
     //console.log(orientation)
     if(Math.abs(Vector.getDegree(requiredVector)-orientation)<6){
      speak("Correct");
      //logger.log('announce','-----> HOMING! <------');
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
    logger.log("data","[CHOICE] "+choice);
    var beacon = Environment.getBeacon(choice);
    if(Router.isReachable(choice)){
        speak('Destination '+beacon.btName);
    } else {
        speak('Destination '+beacon.btName+ 'is not reachable');
    }
    Router.setDestinationBeaconMacAddress(choice);
})




