var Beacon = require('./beacon')
var fs = require('fs')
var csv = require('csv');
var Environment = require('./environment')
var Localizer = require('./localizer')

var environment = new Environment();
Localizer.setEnvironment(environment);

csv()
    .from.path('./calibration.csv', { comment: '#', delimiter: ',', escape: '"' })
    .to.array(function(data){
        data.forEach(function(row){
            beacon = new Beacon(row[0],row[1],row[2]);
            beacon.calibrate(row[3],row[4]);
            beacon.calibrate(row[5],row[6]);
            environment.addBeacon(beacon);
        });
        environment.dump();
        environment.startListening();
    } );







