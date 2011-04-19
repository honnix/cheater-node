var events = require('events');
var CheaterConstant = require('./cheater_constant.js');
var CheaterConfig = require('./cheater_config.js');

var Cheater = function () {
    events.EventEmitter.call(this);
    this.currentStatus = CheaterConstant.statusMap.initializing;

    var cc = require('./cheater_client.js');
    var client = new cc.CheaterClient();
    var timeoutId;

    this.on('start', function () {
        var that = this;
        var work = function (retryTimes) {
            if (client.login()) {
                that.currentStatus = CheaterConstant.statusMap.loggedIn;

                console.log('Login successfully.');

                var heartbeatLoop = function (livingTime, failedTimes) {
                    var logout = function () {
                        that.currentStatus = CheaterConstant.statusMap.loggingOut;

                        if (client.logout()) {
                            console.log('Logout successfully.');
                        } else {
                            console.warn("Logout failed. But it's OK.");
                        }

                        that.currentStatus = CheaterConstant.statusMap.loggedOut;

                        work(0);
                    };

                    if (livingTime < 3600 / CheaterConfig.heartbeatInterval * CheaterConfig.hoursToLive) {
                        if (client.heartbeat()) {
                            that.currentStatus = CheaterConstant.statusMap.heartbeating;
                            timeoutId = setTimeout(function () {
                                console.log('livingTime ' + livingTime);
                                heartbeatLoop(livingTime + 1, 0);
                            }, CheaterConfig.heartbeatInterval * 1000);
                        } else if (failedTimes + 1 < CheaterConfig.heartbeatMaxFailTimes) {
                            that.currentStatus = CheaterConstant.statusMap.heartbeatingRetrying;

                            console.warn('Heartbeat failed. Wait ' + CheaterConfig.heartbeatInterval +
                                         ' seconds to retry.');

                            timeoutId = setTimeout(function () {
                                heartbeatLoop(0, failedTimes + 1);
                            }, CheaterConfig.heartbeatInterval * 1000);
                        } else {
                            that.currentStatus = CheaterConstant.statusMap.heartbeatingRetryFailed;

                            console.warn('Heartbeat failed continuously for ' +
                                         CheaterConfig.heartbeatMaxFailTimes + 
                                         ' times. Try to login again.');

                            logout();
                        }
                    } else {
                        logout();
                    }
                };

                heartbeatLoop(0, 0);
            } else {
                if (retryTimes < CheaterConfig.loginMaxRetryTimes) {
                    that.currentStatus = CheaterConstant.statusMap.loggingInRetryFailed;

                    console.error('Login failed. Wait ' + CheaterConfig.loginRetryInterval +
                                  ' seconds to retry.');

                    timeoutId = setTimeout(function () {
                        work(retryTimes + 1);
                    }, CheaterConfig.loginRetryInterval * 1000);
                } else {
                    consonle.error('Maximum login retry times reached. Quit...');

                    that.currentStatus = CheaterConstant.statusMap.loggingInRetryFailed;
                }
            }
        };

        this.currentStatus = CheaterConstant.statusMap.started;

        work(0);
    });

    this.on('stop', function () {
        clearTimeout(timeoutId);
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
