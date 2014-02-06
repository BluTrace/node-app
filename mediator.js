var EventEmitter = require('events').EventEmitter
    , pubsub = new EventEmitter();
pubsub.setMaxListeners(0);
exports.pubsub = pubsub;
