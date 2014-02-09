var Beacon = require('./beacon')
var fs = require('fs')
var csv = require('csv');
var Environment = require('./environment')
var Localizer = require('./localizer')
var Router = require('./router')
var Guide = require('./guide')
var Sensor = require('./sensor')
var Destinations = require('./destinations')

csv()
    .from.path('./calibration.csv', { comment: '#', delimiter: ',', escape: '"' })
    .to.array(function(data){
        data.forEach(function(row){
            beacon = new Beacon(row[0],row[1],row[2],row[3]);
            beacon.calibrate(row[4],row[5]);
            beacon.calibrate(row[6],row[7]);
            Environment.addBeacon(beacon);
        });
        Destinations.loadLocations();
        Router.loadPaths();
        Environment.startListening();
        Sensor.startSensing();
    } );







