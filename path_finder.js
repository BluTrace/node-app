var cheapest_paths = require('graph-paths').cheapest_paths;

var costs = [
    [0,1,Infinity,Infinity],
    [Infinity,0,Infinity,1],
    [Infinity,Infinity,0,1],
    [Infinity,Infinity,1,0],
];

var cheapest_paths_from_0 = cheapest_paths(costs, 0);

console.log("cheapest path from node #0 to node #3:");
console.dir(cheapest_paths_from_0[3]);
