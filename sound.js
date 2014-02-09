var baudio = require('baudio');

var b = baudio(function (t) {
    function sin(f){
        return Math.sin(2*Math.PI*f*t);
    }
    return sin(300)*(sin(3)+sin(4)+sin(5));
});

b.play();