//var beacon = require('./beacon');

var calculate = function (sourceObj, destinationObj) {
    var directionVector = {};
    directionVector.x = destinationObj.x - sourceObj.x;
    directionVector.y = destinationObj.y - sourceObj.y;
    directionVector.magnitude = Math.sqrt((directionVector.x * directionVector.x) + (directionVector.y * directionVector.y) );
    directionVector.x /= directionVector.magnitude;
    directionVector.y /= directionVector.magnitude;
    for(var i in directionVector){
        directionVector[i] = Math.floor(directionVector[i] * 100)/100;
    }
    //console.dir(directionVector);
    return directionVector;
};

var getDegree = function(vector){
    return Math.atan2(vector.y,vector.x)*180/Math.PI;
}

module.exports.calculate = calculate;
module.exports.getDegree = getDegree;

//calculateDirection(new beacon('mac1','Paras', 3, 2), new beacon('mac2','Shashank', 9, 4));
