var Cheater = function () {
    this.currentStatus = 1;
};

Cheater.prototype.canStart = function () {
    return this.currentStatus === 1;
};
