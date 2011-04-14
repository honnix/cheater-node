var cheaterConstant = require('./cheater_constant.js');

var Cheater = function () {
    this.currentStatus = cheaterConstant.statusMap.initializing;
};

Cheater.prototype.canStart = function () {
    return this.currentStatus.val === 1;
};

exports.create = function () {
    return new Cheater();
}
