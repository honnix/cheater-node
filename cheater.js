var CheaterConstant = require('./cheater_constant.js');
var CheaterClient = require('./cheater_client.js');

var Cheater = function () {
    this.currentStatus = CheaterConstant.statusMap.initializing;
    this.client = CheaterClient.create();
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
    
};

Cheater.prototype.stop = function () {
    
};

exports.create = function () {
    return new Cheater();
};
