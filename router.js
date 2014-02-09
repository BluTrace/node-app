var mediator = require('./mediator'),
    cheapest_paths = require('graph-paths').cheapest_paths,
    Environment = require('./environment'),
    Beacon = require('./beacon'),
    Vector = require('./vector'),
    csv = require('csv'),
    cheapestPath = null,
    destinationBeaconMacAddress = null,
    sourceMac = null,
    destinationMac = null,
    pathVector = null,
    beacons_mac = [];

var getPathVector = function(){
    return pathVector;
}

var calculate_path = function(source_mac, destination_mac){
    csv()
        .from.path('./beacon_connectivity.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            var costs = [];
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
            var source = beacons_mac.indexOf(source_mac);
            var destination = beacons_mac.indexOf(destination_mac);
            if(source==-1||destination==-1)
             return null;
            sourceMac = source_mac;
            destinationMac = destination_mac;
console.log(beacons_mac);
console.log(costs);
console.log(source);
            var cheapest_paths_from_source = cheapest_paths(costs, source);
console.log(cheapest_paths_from_source);            
            cheapestPath = cheapest_paths_from_source[destination];
            var path = [];
            cheapestPath.path.forEach(function(node){
                path.push(beacons_mac[node]);
            });
            cheapestPath.path = path;
            console.dir(cheapestPath);
            mediator.pubsub.emit('pathCalculated');
        });

};

var setDestinationBeaconMacAddress = function(macAddress){
    destinationBeaconMacAddress = macAddress;
}

var isReachable = function(macAddress){
    return beacons_mac.indexOf(macAddress)!=-1;
}

module.exports.setDestinationBeaconMacAddress = setDestinationBeaconMacAddress;
module.exports.getPathVector = getPathVector;
module.exports.isReachable = isReachable;

mediator.pubsub.on('pathCalculated',function(){
    console.dir(cheapestPath);
    var b1,b2;
    b1 = Environment.getBeacon(sourceMac);
    b2 = Environment.getBeacon(destinationMac);
    pathVector = Vector.calculate(b1,b2);
    console.dir(pathVector);
});



mediator.pubsub.on('newLocation',function(){
    var startingBeaconMacAddress = Environment.getStrongestBeacon().macAddress;
    console.log('startingBeaconMacAddress   : '+startingBeaconMacAddress);
    console.log('destinationBeaconMacAddress: '+destinationBeaconMacAddress);
    if(startingBeaconMacAddress==destinationBeaconMacAddress)
        mediator.pubsub.emit('destinationReached');
    if(destinationBeaconMacAddress&&startingBeaconMacAddress)
        calculate_path(startingBeaconMacAddress, destinationBeaconMacAddress);
    else
        mediator.pubsub.emit('nowhereToGo');
});
