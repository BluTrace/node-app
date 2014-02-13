var say = require('say');
var exec=require('child_process').exec;

var speak = function(words){
    //say.speak('Alex',words);
    exec('espeak "'+words+'"');
}

var bleep = function(){
    exec('mplayer sounds/blip.wav');
}

module.exports.speak = speak;
module.exports.bleep = bleep;

