var mediator = require('./mediator'),
    cheapest_paths = require('graph-paths').cheapest_paths,
    Environment = require('./environment'),
    Beacon = require('./beacon'),
    Vector = require('./vector'),
    csv = require('csv'),
    Guide = require('./guide'),
    logger = require('./logger'),
    cheapestPath = null,
    destinationBeaconMacAddress = null,
    sourceMac = null,
    destinationMac = null,
    pathVector = null,
    beacons_mac = [],
    costs = [];

var getPathVector = function(){
    return pathVector;
}

var loadPaths = function(){
    csv()
        .from.path('./beacon_connectivity.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            costs = [];
            beacons_mac = [];
            data.forEach(function(row){
                beacons_mac.push(row[0]);
            });
            data.forEach(function(row, index){
                var cost_array = new Array(beacons_mac.length);
                for(var i=0; i<cost_array.length; i++){
                    cost_array[i] = Infinity;
                }
                cost_array[index] = 0;
                for(var j=1; j<row.length; j+=2){
                    cost_array[beacons_mac.indexOf(row[j])] = parseInt(row[j+1]);
                }
                costs.push(cost_array);
            });
        });
}

var calculate_path = function(source_mac, destination_mac){
    var source = beacons_mac.indexOf(source_mac);
    var destination = beacons_mac.indexOf(destination_mac);
    if(source==-1||destination==-1)
     return null;
    sourceMac = source_mac;
    destinationMac = destination_mac;
    var cheapest_paths_from_source = cheapest_paths(costs, source);
    cheapestPath = cheapest_paths_from_source[destination];
    var path = [];
    cheapestPath.path.forEach(function(node){
        path.push(beacons_mac[node]);
    });
    cheapestPath.path = path;
    //console.dir(cheapestPath);
    mediator.pubsub.emit('pathCalculated');

};

var setDestinationBeaconMacAddress = function(macAddress){
    destinationBeaconMacAddress = macAddress;
    //Guide.speak('Now you are travelling to '+macAddress);
    mediator.pubsub.emit('newDestination');
}

var isReachable = function(macAddress){
    return beacons_mac.indexOf(macAddress)!=-1;
}

module.exports.loadPaths = loadPaths;
module.exports.setDestinationBeaconMacAddress = setDestinationBeaconMacAddress;
module.exports.getPathVector = getPathVector;
module.exports.isReachable = isReachable;

mediator.pubsub.on('pathCalculated',function(){
    logger.log('data','[PATH] '+JSON.stringify(cheapestPath));
    var b1,b2;
    b1 = Environment.getBeacon(sourceMac);
    b2 = Environment.getBeacon(destinationMac);
    pathVector = Vector.calculate(b1,b2);
    logger.log('data','[REQUIRED VECTOR] '+JSON.stringify(pathVector));
});

mediator.pubsub.on('newDestination',function(){
    recalculatePath();
});

mediator.pubsub.on('newLocation',function(){
    recalculatePath();
});

function recalculatePath(){
    var strongestBeacon = Environment.getStrongestBeacon();
    if(strongestBeacon){
        var startingBeaconMacAddress = strongestBeacon.macAddress;
        logger.log('data','[ADDRESS] start       : '+startingBeaconMacAddress);
        logger.log('data','[ADDRESS] destination : '+destinationBeaconMacAddress);
        if(startingBeaconMacAddress==destinationBeaconMacAddress)
            mediator.pubsub.emit('destinationReached');
        if(destinationBeaconMacAddress&&startingBeaconMacAddress)
            calculate_path(startingBeaconMacAddress, destinationBeaconMacAddress);
        else
            mediator.pubsub.emit('nowhereToGo');
    }

}
