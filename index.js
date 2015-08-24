'use strict';

var _       = require('underscore');
var methods = ['get', 'post', 'put', 'del'];
var request = require('request').defaults({json: true});
var url     = require('url');

function PingPongAPI(options, reqDefaults) {
    options = options || {};

    this.protocol = options.protocol || 'https';
    this.host     = options.host;
    this.port     = options.port;
    this.reqDefaults = reqDefaults || {};

    if (this.host === undefined) {
        throw new Error('PingPongAPI must be initialized with a host');
    }
}

function send (method, opts, cb) {
    return request[method](opts, function (error, response, body) {
        if (error) {
            return cb(error);
        }

        cb(null, response, body);
    });
}

methods.forEach(function (method) {
    PingPongAPI.prototype[method] = function (path, opts, cb) {
        if (typeof opts === 'function') {
            cb = opts;
            opts = {};
        }

        opts = _.defaults(opts, this.reqDefaults);

        opts.uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port,
            pathname: path
        });

        delete opts.url;

        return send(method, opts, cb);
    };
});

PingPongAPI.prototype.players = function (opts, cb) {
    this.get('/players', opts, cb);
};

PingPongAPI.prototype.player = function (id, opts, cb) {
    this.get('/players/' + id, opts, cb);
};

PingPongAPI.prototype.createPlayer = function (opts, cb) {
    this.post('/players/', opts, cb);
};

PingPongAPI.prototype.updatePlayer = function (id, opts, cb) {
    this.put('/players/' + id, opts, cb);
};

PingPongAPI.prototype.deletePlayer = function (id, opts, cb) {
    this.del('/players/' + id, opts, cb);
};

PingPongAPI.prototype.games = function (opts, cb) {
    this.get('/games', opts, cb);
};

PingPongAPI.prototype.createGame = function (opts, cb) {
    this.post('/games/', opts, cb);
};

PingPongAPI.prototype.skillDraw = function (opts, cb) {
    this.get('/skill/draw', opts, cb);
};

PingPongAPI.prototype.skillClosest = function (id, opts, cb) {
    this.get('/skill/closest/' + id, opts, cb);
};

PingPongAPI.prototype.skillHistory = function (id, opts, cb) {
    this.get('/skill/history/' + id, opts, cb);
};

module.exports = PingPongAPI;
