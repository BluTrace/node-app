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
    Guide = require('./guide'),
    connect = require('connect');

var app = connect()
    .use(connect.static(__dirname))
    .use(function (req, res){
        if(req.url == '/destinations'){
            console.dir(req);
            console.log("Yoooo");
            dumpToCSV(req.body, "destinations.csv");
        }
        if(req.url == '/connectivity'){
            console.log(req.body);
            console.log("Yippeee");
            dumpToCSV(req.body, "beacon_connectivity.csv");
        }
        res.end('hello world\n');
    });


connect.createServer(app).listen(8081);

var dumpToCSV = function(data, filename) {
//    csv().from(data).to(filename);
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







