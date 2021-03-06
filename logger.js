var winston = require('winston');

var customLevels = {
    levels: {
        speech: 0,
        data: 1,
        info: 2,
        warn: 3,
        announce: 4
    },
    colors: {
        speech: 'cyan',
        data: 'grey',
        info: 'yellow',
        warn: 'red',
        announce: 'green'
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

var log2 = function(type,text){
    logger.log(type,text);
}

var log=function log(type,text){
    txt = "["+type.toUpperCase()+"] "+text;
    console.log(txt[customLevels.colors[type]]);
}

module.exports.setup = setup;
module.exports.log = log;
