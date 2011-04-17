var CheaterClient = function () {
    
};

CheaterClient.prototype.login = function () {return true;};
CheaterClient.prototype.heartbeat = function () {return true;};
CheaterClient.prototype.logout = function () {return true;};

exports.CheaterClient = CheaterClient;
