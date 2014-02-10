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

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'guide.log' })
    ],
    levels: customLevels.levels
});

logger.addColors(customLevels.colors);

var log = function(type,text){
    logger.log(type,text);
}