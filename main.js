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
    http = require('http'),
    express = require('express');

var app = express();

app.use(express.static(__dirname));

app.get('/destinations', function(req, res){
    dumpToCSV(req.param('destinations'),"destinations.csv");
    res.send('Done');
});

app.get('/connectivity', function(req, res){
    dumpToCSV(req.param('connectivity'),"beacon_connectivity.csv");
    res.send('Done');
});

app.get('/import_nodes', function(req, res){
    var balls = [];
    csv()
        .from.path('./calibration.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            data.forEach(function(row){
                balls.push([row[1],row[2],row[3],row[4]]);
            });
            console.log(balls);
            res.send(balls);
        });

});

app.listen(1337);
console.log('Listening on port 1337');

var dumpToCSV = function(data, filename) {
    csv().from(data).to(filename);
};

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
        Sensor.startSensing();
        Guide.speak('Ready');
        if(process.argv[2])
            Router.setDestinationBeaconMacAddress(process.argv[2]);
    } );







