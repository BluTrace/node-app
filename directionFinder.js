/**
 * Created by Paras on 2/6/14.
 */

var beacon = require('./beacon');

var calculateDirection = function (sourceObj, destinationObj) {
    var directionVector = {};
    directionVector.x = destinationObj.x - sourceObj.x;
    directionVector.y = destinationObj.y - sourceObj.y;
    directionVector.magnitude = Math.sqrt((directionVector.x * directionVector.x) + (directionVector.y * directionVector.y) );
    directionVector.x /= directionVector.magnitude;
    directionVector.y /= directionVector.magnitude;
    for(var i in directionVector){
        directionVector[i] = Math.floor(directionVector[i] * 100)/100;
    }
    console.dir(directionVector);
    return directionVector;
};

calculateDirection(new beacon('mac1','Paras', 3, 2), new beacon('mac2','Shashank', 9, 4));
