//var say = require('say');
var exec=require('child_process').exec;

var speak = function(words){
    //say.speak('Alex',words);
    exec('espeak '+words);
}

module.exports.speak = speak;

