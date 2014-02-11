var logger = require('./logger');
logger.setup();
logger.log('info','Loading...');

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

csv()
    .from.path('./calibration.csv', { comment: '#', delimiter: ',', escape: '"' })
    .to.array(function(data){
        data.forEach(function(row){
            if(row[0]=='1'){
                beacon = new Beacon(row[1],row[2],row[3],row[4]);
                beacon.calibrate(row[5],row[6]);
                beacon.calibrate(row[7],row[8]);
                Environment.addBeacon(beacon);
            }

        });
        Destinations.loadLocations();
        Router.loadPaths();
        Environment.startListening();
        if(process.argv[2]=='calibration')
         Environment.startListeningForCalibration();
        Sensor.startSensing();
        Guide.speak('Ready');
        //if(process.argv[2])
        //    Router.setDestinationBeaconMacAddress(process.argv[2]);
    } );







