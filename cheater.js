var events = require('events');

var CheaterConstant = require('./cheater_constant.js');

var Cheater = function () {
    events.EventEmitter.call(this);
    this.currentStatus = CheaterConstant.statusMap.initializing;
    this.client = require('./cheater_client.js').CheaterClient();

    this.on('start', function() {
        this.currentStatus = CheaterConstant.statusMap.started;
    });

    this.on('stop', function () {
        this.currentStatus = CheaterConstant.statusMap.stopped;
    });
};

var sys = require('sys');
sys.inherits(Cheater, events.EventEmitter);

Cheater.prototype.canStart = function () {
    return this.currentStatus.val === CheaterConstant.statusMap.initializing.val ||
        this.currentStatus.val === CheaterConstant.statusMap.stopped.val;
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
        this.currentStatus = CheaterConstant.statusMap.starting;
        require('./socket_spc.js').check(this);
        var that = this;
        setTimeout(function() {
            that.emit('start');
        }, 2000);
    }
};

Cheater.prototype.stop = function () {
    if (this.canStop()) {
        this.currentStatus = CheaterConstant.statusMap.stopping;
        this.emit('stop');
    }
};

exports.Cheater = Cheater;
