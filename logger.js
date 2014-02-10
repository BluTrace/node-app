var winston = require('winston');

var customLevels = {
    levels: {
        speech: 0,
        data: 1,
        info: 2,
        warn: 3
    },
    colors: {
        foo: 'blue',
        bar: 'green',
        baz: 'yellow',
        foobar: 'red'
    }
};

var logger = null;

var setup = function(){
 winston.addColors(customLevels.colors);

 logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'guide.log' })
    ],
    levels: customLevels.levels
 });
}

var log = function(type,text){
    logger.log(type,text);
}

module.exports.setup = setup;
module.exports.log = log;
