var sys = require('sys');
var events = require('events');

var CheaterConstant = require('./cheater_constant.js');
var CheaterClient = require('./cheater_client.js');
var SocketSpc = require('./socket_spc.js');

var Cheater = function () {
    events.EventEmitter.call(this);
    this.currentStatus = CheaterConstant.statusMap.initializing;
    this.client = CheaterClient.create();

    this.on('start', function() {
        this.currentStatus = CheaterConstant.statusMap.started.val;
    });

    this.on('stop', function () {
        this.currentStatus = CheaterConstant.statusMap.stopped.val;
    });
};

Cheater.prototype.canStart = function () {
    return this.currentStatus.val == CheaterConstant.statusMap.initializing.val ||
        this.currentStatus.val == CheaterConstant.statusMap.stopped.val;
};

Cheater.prototype.canStop = function () {
    return this.currentStatus.val >= CheaterConstant.statusMap.starting.val ||
        this.currentStatus.val < CheaterConstant.statusMap.stopping.val;
};

Cheater.prototype.getStatusDesc = function () {
    return this.currentStatus.desc;
};

Cheater.prototype.start = function () {
    if (this.canStart()) {
        this.currentStatus = CheaterConstant.statusMap.starting.val;
        SocketSpc.check(this);
        setTimeout(function() {
            this.emit('start');
        }, 2000);
    }
};

Cheater.prototype.stop = function () {
    if (this.canStop()) {
        this.currentStatus = CheaterConstant.statusMap.stopping.val;
        this.emit('stop');
    }
};

sys.inherits(Cheater, events.EventEmitter);

exports.create = function () {
    return new Cheater();
};
