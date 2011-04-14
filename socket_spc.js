var CheaterConfig = require('./cheater_config.js');
var AdminServer = require('./admin_server.js');

exports.check = function (cheater) {
    var adminServer = AdminServer.create(CheaterConfig.socketSpcPort, cheater);
    adminServer.start();
};