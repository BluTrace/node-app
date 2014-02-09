var csv = require('csv'),
    Mediator = require('./mediator');

var locations = [],
    selectionIndex = 0;

var loadLocations = function(){
    csv()
        .from.path('./destinations.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            data.forEach(function(row){
                locations.push(row[0]);
            });
        });
}

var nextLocationChoice = function(){
    return locations[(++selectionIndex)%locations.length];
}

var currentLocationChoice = function(){
    return locations[(selectionIndex)%locations.length];
}

module.exports.nextLocationChoice = nextLocationChoice;
module.exports.loadLocations = loadLocations;
