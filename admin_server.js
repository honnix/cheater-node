var net = require('net');

var NEW_LINE = '\r\n';

var AdminServer = function (port, cheater) {
    this.port = port;
    this.cheater = cheater;
    this.server = net.createServer(function (client) {
        client.setEncoding('ascii');
        client.write('> ');
        client.on('data', function (data) {
            switch (data.trim()) {
            case 'status':
                client.write(cheater.getStatusDesc() + NEW_LINE);
                break;
            case 'quit':
                client.end();
                break;
            case 'shutdown':
                client.end();
                this.server.close();
                this.cheater.stop();
                break;
            }
        });
    });
};

AdminServer.prototype.start = function () {
    this.server.listen(this.port, 'localhost');
};

exports.create = function (cheater) {
    return new AdminServer(cheater);
};