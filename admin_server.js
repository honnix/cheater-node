var NEW_LINE = '\r\n';
var PROMPT = '> ';

var AdminServer = function (port, cheater) {
    var that = this;
    this.port = port;

    var net = require('net');
    this.server = net.createServer(function (client) {
        client.setEncoding('ascii');
        client.write(PROMPT);
        client.on('data', function (data) {
            switch (data.trim()) {
            case 'status':
                client.write(cheater.currentStatus.desc + NEW_LINE + PROMPT);
                break;
            case 'quit':
                client.end();
                break;
            case 'shutdown':
                client.end();
                that.server.close();
                cheater.stop();
                break;
            default:
                if (data.trim() != "") {
                    client.write('status|quit|shutdown' + NEW_LINE + PROMPT);
                } else {
                    client.write(PROMPT);
                }
            }
        });
    });
};

AdminServer.prototype.start = function () {
    this.server.listen(this.port, 'localhost');
};

exports.AdminServer = AdminServer;
