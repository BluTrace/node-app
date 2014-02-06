var mediator = require('./mediator'),
    cheapest_paths = require('graph-paths').cheapest_paths,
    environment = require('./environment'),
    localizer = require('./localizer'),
    csv = require('csv'),
    cheapestPath = null,
    destinationBeaconMacAddress = null;

var calculate_path = function(source_mac, destination_mac){
    csv()
        .from.path('./beacon_connectivity.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            var beacons_mac = [],
                costs = [];
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
            var cheapest_paths_from_source = cheapest_paths(costs, source);
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

module.exports.setDestinationBeaconMacAddress = setDestinationBeaconMacAddress;

mediator.pubsub.on('pathCalculated',function(){
    console.log("Path => "+cheapestPath);
});

mediator.pubsub.on('newLocation',function(){
    var startingBeaconMacAddress = Environment.strongestBeacon.macAddress;
    if(startingBeaconMacAddress==destinationBeaconMacAddress)
        mediator.pubsub.emit('destinationReached');
    if(destinationBeaconMacAddress&&startingBeaconMacAddress)
        calculate_path(startingBeaconMacAddress, destinationBeaconMacAddress);
    else
        mediator.pubsub.emit('nowhereToGo');
});
