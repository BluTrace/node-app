var SensorTag = require('sensortag');

var startSensing = function() {
    SensorTag.discover(function(sensorTag){
        console.log('discovered');
        sensorTag.on('disconnect', function() {
            console.log('disconnected!');
        });
        sensorTag.connect(function(){
            console.log('connected!');
            sensorTag.enableMagnetometer(function(){
                console.log('enabling magnetometer');
            });
            sensorTag.on('magnetometerChange', function(x, y, z){
                console.log('----> ('+x+','+y+','+z+')');
            });
            sensorTag.on('simpleKeyChange', function(left, right) {
                if (left) {
                    console.log('Left Key Pressed');
                } else if (right) {
                    console.log('Right Key Pressed');
                }
            });
        });
    });
}

module.exports.startSensing = startSensing;