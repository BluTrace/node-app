var mediator = require('./mediator');

var vector = [0,0,0];

mediator.pubsub.on('newLocation',function(msg){
    //setVector
})

module.exports.vector = vector;
