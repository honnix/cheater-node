var net = require('net');

var NEW_LINE = '\r\n';
var PROMPT = '> ';

var AdminServer = function (port, cheater) {
    var that = this;
    this.port = port;
    this.cheater = cheater;
    this.server = net.createServer(function (client) {
        client.setEncoding('ascii');
        client.write(PROMPT);
        client.on('data', function (data) {
            switch (data.trim()) {
            case 'status':
                client.write(that.cheater.currentStatus.desc + NEW_LINE + PROMPT);
                break;
            case 'quit':
                client.end();
                break;
            case 'shutdown':
                client.end();
                that.server.close();
                that.cheater.stop();
                break;
            default:
                if (data.trim() != "") {
                    client.write('status|quit|shutdown\n' + PROMPT);
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

exports.create = function (port, cheater) {
    return new AdminServer(port, cheater);
};