var Beacon = require('./beacon'),
    fs = require('fs'),
    csv = require('csv'),
    Environment = require('./environment'),
    Router = require('./router'),
    Guide = require('./guide'),
    Sensor = require('./sensor'),
    Destinations = require('./destinations'),
    winston = require('winston'),
    Guide = require('./guide');

Guide.speak('initialising!');

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
        Guide.speak('Ready');
    } );







