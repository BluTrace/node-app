var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');
var Mediator = require('./mediator'),
    Logger = require('./logger'),
    Guide = require('./guide');

var degreeOfOrientation = 0;

const THRESHOLD = 10;

var getDegreeOfOrientation = function(){
    return degreeOfOrientation;
}

var startSensing = function() {
    SensorTag.discover(function(sensorTag){
        //console.log('discovered');
        sensorTag.on('disconnect', function() {
            Logger.log('warn','Sensors are disconnected! Try connecting again!');
            Guide.speak('Please reconnect your sensor.');
            //process.exit(0);
        });
        async.series([
            function(callback) {
                Logger.log('info','Connecting Sensor');
                sensorTag.connect(callback);
            },
            function(callback) {
                //console.log('discoverServicesAndCharacteristics');
                sensorTag.discoverServicesAndCharacteristics(callback);
            },
            function(callback) {
                //console.log('enableMagnetometer');
                sensorTag.enableMagnetometer(callback);
            },
            function(callback) {
                sensorTag.setMagnetometerPeriod(200,callback);
            },
            function(callback) {
                //console.log('enableGyroscope');
                sensorTag.enableGyroscope(callback);
            },
            function(callback) {
                setTimeout(callback, 2000);
            },
            function(callback) {
                sensorTag.on('magnetometerChange', function(x, y, z) {
                    //console.log('\tx = %d μT', x.toFixed(4));
                    //console.log('\ty = %d μT', y.toFixed(4));
                    //console.log('\tz = %d μT', z.toFixed(4));
                    x=x+36;
                    y=y-42;
                    z=z+23;
                    //console.log(x.toFixed(4)+','+y.toFixed(4)+','+z.toFixed(4));
                    var degrees = 40+[Math.atan2(y,x)]*180/Math.PI;
                    //console.log(degrees);
                    if(Math.abs(degrees-degreeOfOrientation)>THRESHOLD){
                        Mediator.pubsub.emit('orientationChanged',JSON.stringify({'orientation':degrees}));
                        degreeOfOrientation = degrees;
                    }
                    //console.log("========================> "+degrees);
                });
                sensorTag.notifyMagnetometer(function() {
                    //console.log('M notified!');
                 
                });
            callback();
            },
            /*function(callback){
                sensorTag.on('gyroscopeChange', function(x, y, z) {
                console.log('\tx = %d °/s', x.toFixed(4));
                console.log('\ty = %d °/s', y.toFixed(4));
                console.log('\tz = %d °/s', z.toFixed(4));
                });
                sensorTag.notifyGyroscope(function() {
                    //console.log('G notified!');
                });
            callback();
            }, */
            function(callback) {
                //console.log('readSimpleRead');
                sensorTag.on('simpleKeyChange', function(left, right) {
                    //console.log('left: ' + left);
                    //console.log('right: ' + right);
                    if(right){
                        Mediator.pubsub.emit('rightKeyPressed');
                    }
                    if(left){
                        Mediator.pubsub.emit('leftKeyPressed');
                    }
//                    if (left && right) {
//                        sensorTag.notifySimpleKey(callback);
//                    }
                });

                sensorTag.notifySimpleKey(function() {
                 
                });
            callback();
            },
            function(callback){
             Guide.speak("Sensors ready! Please select your destination by pressing the right key.");
             callback();
            }
            ]);

    });
}

module.exports.startSensing = startSensing;
