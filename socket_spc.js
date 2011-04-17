exports.check = function (cheater) {
    var adminServer = require('./admin_server.js');
    var CheaterConfig = require('./cheater_config.js');
    new adminServer.AdminServer(CheaterConfig.socketSpcPort, cheater).start();
};
