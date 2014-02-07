var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');

var startSensing = function() {
    SensorTag.discover(function(sensorTag){
        console.log('discovered');
        sensorTag.on('disconnect', function() {
            console.log('disconnected!');
            process.exit(0);
        });
        async.series([
            function(callback) {
                console.log('connect');
                sensorTag.connect(callback);
            },
            function(callback) {
                console.log('discoverServicesAndCharacteristics');
                sensorTag.discoverServicesAndCharacteristics(callback);
            },
            function(callback) {
                console.log('enableMagnetometer');
                sensorTag.enableMagnetometer(callback);
            },
            function(callback) {
                console.log('enableGyroscope');
                sensorTag.enableGyroscope(callback);
            },
            function(callback) {
                setTimeout(callback, 2000);
            },
            function(callback) {
                sensorTag.on('magnetometerChange', function(x, y, z) {
                    console.log('\tx = %d μT', x.toFixed(4));
                    console.log('\ty = %d μT', y.toFixed(4));
                    console.log('\tz = %d μT', z.toFixed(4));
                    var radians;
                    if(y>0)
                        radians = 90 - [Math.tan2(y,x)]*180/Math.PI;
                    else if(y<0)
                        radians = 270 - [Math.tan2(y,x)]*180/Math.PI;
                    console.log("========================> "+radians);
                });
                sensorTag.notifyMagnetometer(function() {
                    console.log('M notified!');
                 
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
                    console.log('G notified!');
                });
            callback();
            }, */
            function(callback) {
                console.log('readSimpleRead');
                sensorTag.on('simpleKeyChange', function(left, right) {
                    console.log('left: ' + left);
                    console.log('right: ' + right);

                    if (left && right) {
                        sensorTag.notifySimpleKey(callback);
                    }
                });

                sensorTag.notifySimpleKey(function() {
                 
                });
            callback();
            }
            ]);

    });
}

module.exports.startSensing = startSensing;

startSensing();
