var csv = require('csv');

var locations = []
var getNextDestination = function(currentDestination, keyPressed){
    if(!locations.length) {
        csv()
            .from.path('./destinations.csv', { comment: '#', delimiter: ',', escape: '"' })
            .to.array(function(data){
                data.forEach(function(row){
                    locations.push(row[0]);
                });
                var length = locations.length
                var index = locations.indexOf(currentDestination);
                if(index != -1) {
                    console.log("Current destination: " + currentDestination);
                    if(keyPressed)
                        console.log("Next destination when pressed right key: " + locations[(index+1)%length]);
                    else
                        console.log("Next destination when pressed left key: " + locations[(index-1+length)%length]);
                }
                else
                    console.log(currentDestination + " is invalid");
            });
    }
}

getNextDestination("destination1", 1);
getNextDestination("destination1", 0);
getNextDestination("destination4", 1);
getNextDestination("destination4", 0);