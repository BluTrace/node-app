var baudio = require('baudio'),
    say = require('say');

var b = baudio(function (t) {
    function sin(f){
        return Math.sin(2*Math.PI*f*t);
    }
    return sin(300)*(sin(3)+sin(4)+sin(5));
});

var speak = function(words){
    say.speak('Alex',words);
}

module.exports.speak = speak;

