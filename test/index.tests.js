'use strict';

var proxyquire = require('proxyquire');
var sinon      = require('sinon');

describe('index', function () {
    var pingPongApi;
    var PingPongAPI;
    var sandbox;
    var stubs;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        stubs = {
            request: {
                get: sandbox.stub(),
                post: sandbox.stub(),
                put: sandbox.stub(),
                del: sandbox.stub()
            }
        };

        PingPongAPI = proxyquire('..', stubs);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('new', function () {
        describe('with required options missing', function () {
            describe('missing host', function () {
                it('throws an error', function () {
                    expect(function () {
                        new PingPongAPI();
                    }).toThrow('PingPongAPI must be initialized with a host');
                });
            });
        });

        describe('with required options', function () {
            beforeEach(function () {
                pingPongApi = new PingPongAPI({
                    host: 'yourhost.com'
                });
            });

            it('returns an object', function () {
                expect(pingPongApi).toBeDefined();
                expect(typeof(pingPongApi)).toEqual('object');
            });

            it('initialises the object with the default options', function () {
                expect(pingPongApi.protocol).toBeDefined();
                expect(pingPongApi.protocol).toEqual('https');
            });

            it('sets the appropriate host based off of options passed', function () {
                expect(pingPongApi.host).toBeDefined();
                expect(pingPongApi.host).toEqual('yourhost.com');
            });
        });

        describe('with custom options', function () {
            beforeEach(function () {
                pingPongApi = new PingPongAPI({
                    host: 'yourhost.com',
                    port: 3000,
                    protocol: 'http',
                    version: '2'
                });
            });

            it('returns an object', function () {
                expect(pingPongApi).toBeDefined();
                expect(typeof(pingPongApi)).toEqual('object');
            });

            it('sets the appropriate host based off of options passed', function () {
                expect(pingPongApi.host).toBeDefined();
                expect(pingPongApi.host).toEqual('yourhost.com');
            });

            it('sets the appropriate port based off of options passed', function () {
                expect(pingPongApi.port).toBeDefined();
                expect(pingPongApi.port).toEqual(3000);
            });

            it('sets the appropriate protocol based off of options passed', function () {
                expect(pingPongApi.protocol).toBeDefined();
                expect(pingPongApi.protocol).toEqual('http');
            });
        });


        describe('instance methods', function () {
            it('creates get, post, put and del methods', function () {
                expect(pingPongApi.get).toBeDefined();
                expect(pingPongApi.post).toBeDefined();
                expect(pingPongApi.put).toBeDefined();
                expect(pingPongApi.del).toBeDefined();
            });

            it('has api methods', function () {
                expect(pingPongApi.players).toBeDefined();
                expect(pingPongApi.player).toBeDefined();
                expect(pingPongApi.createPlayer).toBeDefined();
                expect(pingPongApi.updatePlayer).toBeDefined();
                expect(pingPongApi.deletePlayer).toBeDefined();
                expect(pingPongApi.games).toBeDefined();
                expect(pingPongApi.createGame).toBeDefined();
            });
        });
    });

    describe('request methods', function () {
        describe('get, post, put and del methods', function () {
            describe('With no request defaults', function () {
                beforeEach(function () {
                    pingPongApi = new PingPongAPI({
                        host: 'yourhost.com'
                    });
                });

                describe('get', function () {
                    var getStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            getStub = sandbox.stub(pingPongApi, 'get');

                            pingPongApi.get('/players', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(getStub.called).toEqual(true);
                            expect(getStub.args[0][0]).toEqual('/players');
                            expect(getStub.args[0][1]).toEqual({});
                            expect(typeof(getStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.get('/players', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.get.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                            });
                        });

                        describe('without no options', function () {
                            beforeEach(function () {
                                pingPongApi.get('/players', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.get.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                            });
                        });
                    });

                    describe('callback', function () {
                        var callbackSpy;

                        beforeEach(function () {
                            callbackSpy = sandbox.spy();
                        });

                        describe('error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        get: sandbox.stub().yields('Fake Error', {}, {})
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with error if error returned', function () {
                                pingPongApi.get('/players', {}, callbackSpy);
                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith('Fake Error')).toEqual(true);
                            });
                        });

                        describe('no error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        get: sandbox.stub().yields(null, {
                                            a: '1',
                                            b: '2',
                                            c: '3'
                                        }, {
                                            d: '4',
                                            e: '5',
                                            f: '6'
                                        })
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with results if no error returned', function () {
                                pingPongApi.get('/players', {}, callbackSpy);

                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith(null, {
                                    a: '1',
                                    b: '2',
                                    c: '3'
                                }, {
                                    d: '4',
                                    e: '5',
                                    f: '6'
                                })).toEqual(true);
                            });
                        });
                    });
                });

                describe('post', function () {
                    var postStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            postStub = sandbox.stub(pingPongApi, 'post');

                            pingPongApi.post('/players/', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(postStub.called).toEqual(true);
                            expect(postStub.args[0][0]).toEqual('/players/');
                            expect(postStub.args[0][1]).toEqual({});
                            expect(typeof(postStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.post('/players', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.post.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.post.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.post('/players', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.post.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.post.args[0][1])).toEqual('function');
                            });
                        });
                    });

                    describe('callback', function () {
                        var callbackSpy;

                        beforeEach(function () {
                            callbackSpy = sandbox.spy();
                        });

                        describe('error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        post: sandbox.stub().yields('Fake Error', {}, {})
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with error if error returned', function () {
                                pingPongApi.post('/players/', {}, callbackSpy);
                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith('Fake Error')).toEqual(true);
                            });
                        });

                        describe('no error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        post: sandbox.stub().yields(null, {
                                            a: '1',
                                            b: '2',
                                            c: '3'
                                        }, {
                                            d: '4',
                                            e: '5',
                                            f: '6'
                                        })
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with results if no error returned', function () {
                                pingPongApi.post('/players', {}, callbackSpy);

                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith(null, {
                                    a: '1',
                                    b: '2',
                                    c: '3'
                                }, {
                                    d: '4',
                                    e: '5',
                                    f: '6'
                                })).toEqual(true);
                            });
                        });
                    });
                });

                describe('put', function () {
                    var putStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            putStub = sandbox.stub(pingPongApi, 'put');

                            pingPongApi.put('/players/1', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(putStub.called).toEqual(true);
                            expect(putStub.args[0][0]).toEqual('/players/1');
                            expect(putStub.args[0][1]).toEqual({});
                            expect(typeof(putStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.put('/players/1', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.put.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.put.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.put('/players/1', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.put.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.put.args[0][1])).toEqual('function');
                            });
                        });
                    });

                    describe('callback', function () {
                        var callbackSpy;

                        beforeEach(function () {
                            callbackSpy = sandbox.spy();
                        });

                        describe('error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        put: sandbox.stub().yields('Fake Error', {}, {})
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with error if error returned', function () {
                                pingPongApi.put('/players/1', {}, callbackSpy);
                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith('Fake Error')).toEqual(true);
                            });
                        });

                        describe('no error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        put: sandbox.stub().yields(null, {
                                            a: '1',
                                            b: '2',
                                            c: '3'
                                        }, {
                                            d: '4',
                                            e: '5',
                                            f: '6'
                                        })
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with results if no error returned', function () {
                                pingPongApi.put('/players/1', {}, callbackSpy);

                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith(null, {
                                    a: '1',
                                    b: '2',
                                    c: '3'
                                }, {
                                    d: '4',
                                    e: '5',
                                    f: '6'
                                })).toEqual(true);
                            });
                        });
                    });
                });

                describe('del', function () {
                    var delStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            delStub = sandbox.stub(pingPongApi, 'del');

                            pingPongApi.del('/players/1', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(delStub.called).toEqual(true);
                            expect(delStub.args[0][0]).toEqual('/players/1');
                            expect(delStub.args[0][1]).toEqual({});
                            expect(typeof(delStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.del('/players/1', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.del.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.del.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.del('/players/1', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.del.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.del.args[0][1])).toEqual('function');
                            });
                        });
                    });

                    describe('callback', function () {
                        var callbackSpy;

                        beforeEach(function () {
                            callbackSpy = sandbox.spy();
                        });

                        describe('error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        del: sandbox.stub().yields('Fake Error', {}, {})
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with error if error returned', function () {
                                pingPongApi.del('/players/1', {}, callbackSpy);
                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith('Fake Error')).toEqual(true);
                            });
                        });

                        describe('no error', function () {
                            beforeEach(function () {
                                stubs = {
                                    request: {
                                        del: sandbox.stub().yields(null, {
                                            a: '1',
                                            b: '2',
                                            c: '3'
                                        }, {
                                            d: '4',
                                            e: '5',
                                            f: '6'
                                        })
                                    }
                                };

                                PingPongAPI = proxyquire('..', stubs);

                                pingPongApi = new PingPongAPI({
                                    host: 'yourhost.com'
                                });
                            });

                            it('calls callback with results if no error returned', function () {
                                pingPongApi.del('/players/1', {}, callbackSpy);

                                expect(callbackSpy.calledOnce).toEqual(true);
                                expect(callbackSpy.calledWith(null, {
                                    a: '1',
                                    b: '2',
                                    c: '3'
                                }, {
                                    d: '4',
                                    e: '5',
                                    f: '6'
                                })).toEqual(true);
                            });
                        });
                    });
                });
            });

            describe('With request defaults', function () {
                beforeEach(function () {
                    pingPongApi = new PingPongAPI({
                        host: 'yourhost.com'
                    }, {
                        auth: {
                            user: 'user',
                            pass: 'pass',
                            sendImmediately: true
                        }
                    });
                });

                describe('get', function () {
                    var getStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            getStub = sandbox.stub(pingPongApi, 'get');

                            pingPongApi.get('/players', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(getStub.called).toEqual(true);
                            expect(getStub.args[0][0]).toEqual('/players');
                            expect(getStub.args[0][1]).toEqual({});
                            expect(typeof(getStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.get('/players', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.get.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.get.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                            });
                        });

                        describe('without no options', function () {
                            beforeEach(function () {
                                pingPongApi.get('/players', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.get.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.get.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                            });
                        });
                    });
                });

                describe('post', function () {
                    var postStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            postStub = sandbox.stub(pingPongApi, 'post');

                            pingPongApi.post('/players', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(postStub.called).toEqual(true);
                            expect(postStub.args[0][0]).toEqual('/players');
                            expect(postStub.args[0][1]).toEqual({});
                            expect(typeof(postStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.post('/players', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.post.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.post.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.post.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.post('/players', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.post.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.post.args[0][0].uri).
                                    toEqual('https://yourhost.com/players');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.post.args[0][1])).toEqual('function');
                            });
                        });
                    });
                });

                describe('put', function () {
                    var putStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            putStub = sandbox.stub(pingPongApi, 'put');

                            pingPongApi.put('/players/1', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(putStub.called).toEqual(true);
                            expect(putStub.args[0][0]).toEqual('/players/1');
                            expect(putStub.args[0][1]).toEqual({});
                            expect(typeof(putStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.put('/players/1', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.put.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.put.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.put.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.put('/players/1', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.put.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.put.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.put.args[0][1])).toEqual('function');
                            });
                        });
                    });
                });

                describe('del', function () {
                    var delStub;

                    describe('arguments', function () {
                        beforeEach(function () {
                            delStub = sandbox.stub(pingPongApi, 'del');

                            pingPongApi.del('/players/1', {}, function () {});
                        });

                        it('gets passed the correct arguments', function () {
                            expect(delStub.called).toEqual(true);
                            expect(delStub.args[0][0]).toEqual('/players/1');
                            expect(delStub.args[0][1]).toEqual({});
                            expect(typeof(delStub.args[0][2])).toEqual('function');
                        });
                    });

                    describe('request call', function () {
                        describe('with options', function () {
                            beforeEach(function () {
                                pingPongApi.del('/players/1', {}, function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.del.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.del.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.del.args[0][1])).toEqual('function');
                            });
                        });

                        describe('with no options', function () {
                            beforeEach(function () {
                                pingPongApi.del('/players/1', function () {});
                            });

                            it('gets passed the correct options', function () {
                                expect(stubs.request.del.args[0][0].auth).
                                    toEqual({
                                        'user': 'user',
                                        'pass': 'pass',
                                        'sendImmediately': true
                                    });

                                expect(stubs.request.del.args[0][0].uri).
                                    toEqual('https://yourhost.com/players/1');
                            });

                            it('gets passed a callback function', function () {
                                expect(typeof(stubs.request.del.args[0][1])).toEqual('function');
                            });
                        });
                    });
                });
            });
        });
    });

    describe('players', function () {
        var getStub,
            playersSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            getStub = sandbox.stub(pingPongApi, 'get');
            playersSpy = sandbox.spy(pingPongApi, 'players');
        });

        describe('with no options', function () {
            beforeEach(function () {
                pingPongApi.players(function () {});
            });

            it('it calls profiles and passes the correct arguments', function () {
                expect(playersSpy.calledOnce).toEqual(true);
                expect(typeof(playersSpy.args[0][0])).toEqual('function');
            });

            it('it calls get and passes the correct arguments', function () {
                expect(getStub.calledOnce).toEqual(true);
                expect(getStub.args[0][0]).toEqual('/players');
                expect(typeof(getStub.args[0][1])).toEqual('function');
                expect(getStub.args[0][2]).toEqual(undefined);
            });
        });
    });

    describe('player', function () {
        var getStub,
            playerSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            getStub = sandbox.stub(pingPongApi, 'get');
            playerSpy = sandbox.spy(pingPongApi, 'player');
        });

        describe('with no options', function () {
            beforeEach(function () {
                pingPongApi.player('1', function () {});
            });

            it('it calls player and passes the correct arguments', function () {
                expect(playerSpy.calledOnce).toEqual(true);
                expect(playerSpy.args[0][0]).toEqual('1');
                expect(typeof(playerSpy.args[0][1])).toEqual('function');
            });

            it('it calls get and passes the correct arguments', function () {
                expect(getStub.calledOnce).toEqual(true);
                expect(getStub.args[0][0]).toEqual('/players/1');
                expect(typeof(getStub.args[0][1])).toEqual('function');
                expect(getStub.args[0][2]).toEqual(undefined);
            });
        });
    });

    describe('createPlayer', function () {
        var postStub,
            createPlayerSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            postStub = sandbox.stub(pingPongApi, 'post');
            createPlayerSpy = sandbox.spy(pingPongApi, 'createPlayer');
        });

        describe('with options', function () {
            beforeEach(function () {
                pingPongApi.createPlayer({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                }, function () {});
            });

            it('it calls createPlayer and passes the correct arguments', function () {
                expect(createPlayerSpy.calledOnce).toEqual(true);
                expect(createPlayerSpy.args[0][0]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                });
                expect(typeof(createPlayerSpy.args[0][1])).toEqual('function');
            });

            it('it calls post and passes the correct arguments', function () {
                expect(postStub.calledOnce).toEqual(true);
                expect(postStub.args[0][0]).toEqual('/players/');
                expect(postStub.args[0][1]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                });
                expect(typeof(postStub.args[0][2])).toEqual('function');
            });
        });
    });

    describe('updatePlayer', function () {
        var putStub,
            updatePlayerSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            putStub = sandbox.stub(pingPongApi, 'put');
            updatePlayerSpy = sandbox.spy(pingPongApi, 'updatePlayer');
        });

        describe('with options', function () {
            beforeEach(function () {
                pingPongApi.updatePlayer('1', {
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: 1000
                    }
                }, function () {});
            });

            it('it calls updatePlayer and passes the correct arguments', function () {
                expect(updatePlayerSpy.calledOnce).toEqual(true);
                expect(updatePlayerSpy.args[0][0]).toEqual('1');
                expect(updatePlayerSpy.args[0][1]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: 1000
                    }
                });
                expect(typeof(updatePlayerSpy.args[0][2])).toEqual('function');
            });

            it('it calls put and passes the correct arguments', function () {
                expect(putStub.calledOnce).toEqual(true);
                expect(putStub.args[0][0]).toEqual('/players/1');
                expect(putStub.args[0][1]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: 1000
                    }
                });
                expect(typeof(putStub.args[0][2])).toEqual('function');
            });
        });
    });

    describe('deletePlayer', function () {
        var putStub,
            deletePlayerSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            putStub = sandbox.stub(pingPongApi, 'del');
            deletePlayerSpy = sandbox.spy(pingPongApi, 'deletePlayer');
        });

        describe('with options', function () {
            beforeEach(function () {
                pingPongApi.deletePlayer('1', {
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                }, function () {});
            });

            it('it calls deletePlayer and passes the correct arguments', function () {
                expect(deletePlayerSpy.calledOnce).toEqual(true);
                expect(deletePlayerSpy.args[0][0]).toEqual('1');
                expect(deletePlayerSpy.args[0][1]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                });
                expect(typeof(deletePlayerSpy.args[0][2])).toEqual('function');
            });

            it('it calls put and passes the correct arguments', function () {
                expect(putStub.calledOnce).toEqual(true);
                expect(putStub.args[0][0]).toEqual('/players/1');
                expect(putStub.args[0][1]).toEqual({
                    body: {
                        name: 'Player Name',
                        email: 'playername@google.com',
                        avatar: 'https://en.gravatar.com/userimage/58744548/cc57284537a0deaf9573c225331f672b.jpg',
                        office: 'San Francisco',
                        skill: null
                    }
                });
                expect(typeof(putStub.args[0][2])).toEqual('function');
            });
        });
    });

    describe('games', function () {
        var getStub,
            gamesSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            getStub = sandbox.stub(pingPongApi, 'get');
            gamesSpy = sandbox.spy(pingPongApi, 'games');
        });

        describe('with no options', function () {
            beforeEach(function () {
                pingPongApi.games(function () {});
            });

            it('it calls profiles and passes the correct arguments', function () {
                expect(gamesSpy.calledOnce).toEqual(true);
                expect(typeof(gamesSpy.args[0][0])).toEqual('function');
            });

            it('it calls get and passes the correct arguments', function () {
                expect(getStub.calledOnce).toEqual(true);
                expect(getStub.args[0][0]).toEqual('/games');
                expect(typeof(getStub.args[0][1])).toEqual('function');
                expect(getStub.args[0][2]).toEqual(undefined);
            });
        });
    });

    describe('createGame', function () {
        var postStub,
            createGameSpy;

        beforeEach(function () {
            pingPongApi = new PingPongAPI({
                host: 'yourhost.com'
            });

            postStub = sandbox.stub(pingPongApi, 'post');
            createGameSpy = sandbox.spy(pingPongApi, 'createGame');
        });

        describe('with options', function () {
            beforeEach(function () {
                pingPongApi.createGame({
                    body: {
                        date: '2015-03-19T00:00:00.00',
                        id: null,
                        losers: [
                            {
                                avatar: 'http://www.gravatar.com/avatar/1769ad9c6159dcea52f4e058a9fff3ef',
                                email: 'playername3@google.com',
                                id: 2,
                                name: 'Player Name 3',
                                office: 'San Francisco'
                            },
                            {
                                avatar: 'http://www.gravatar.com/avatar/248dd19381c0265667e7725e314c0d9d',
                                email: 'playername4@google.com',
                                id: 1,
                                name: 'Player Name 4',
                                office: 'San Francisco'
                            }
                        ],
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        loser_score: 20,
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        winners: [
                            {
                                avatar: '',
                                email: 'playername2@google.com',
                                id: 3,
                                name: 'Player Name 2',
                                office: 'San Francisco'
                            },
                            {
                                avatar: '',
                                email: 'playername@google.com',
                                id: 4,
                                name: 'Player Name',
                                office: 'San Francisco'
                            }
                        ]
                    }
                }, function () {});
            });

            it('it calls createGame and passes the correct arguments', function () {
                expect(createGameSpy.calledOnce).toEqual(true);
                expect(createGameSpy.args[0][0]).toEqual({
                    body: {
                        date: '2015-03-19T00:00:00.00',
                        id: null,
                        losers: [
                            {
                                avatar: 'http://www.gravatar.com/avatar/1769ad9c6159dcea52f4e058a9fff3ef',
                                email: 'playername3@google.com',
                                id: 2,
                                name: 'Player Name 3',
                                office: 'San Francisco'
                            },
                            {
                                avatar: 'http://www.gravatar.com/avatar/248dd19381c0265667e7725e314c0d9d',
                                email: 'playername4@google.com',
                                id: 1,
                                name: 'Player Name 4',
                                office: 'San Francisco'
                            }
                        ],
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        loser_score: 20,
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        winners: [
                            {
                                avatar: '',
                                email: 'playername2@google.com',
                                id: 3,
                                name: 'Player Name 2',
                                office: 'San Francisco'
                            },
                            {
                                avatar: '',
                                email: 'playername@google.com',
                                id: 4,
                                name: 'Player Name',
                                office: 'San Francisco'
                            }
                        ]
                    }
                });
                expect(typeof(createGameSpy.args[0][1])).toEqual('function');
            });

            it('it calls post and passes the correct arguments', function () {
                expect(postStub.calledOnce).toEqual(true);
                expect(postStub.args[0][0]).toEqual('/games/');
                expect(postStub.args[0][1]).toEqual({
                    body: {
                        date: '2015-03-19T00:00:00.00',
                        id: null,
                        losers: [
                            {
                                avatar: 'http://www.gravatar.com/avatar/1769ad9c6159dcea52f4e058a9fff3ef',
                                email: 'playername3@google.com',
                                id: 2,
                                name: 'Player Name 3',
                                office: 'San Francisco'
                            },
                            {
                                avatar: 'http://www.gravatar.com/avatar/248dd19381c0265667e7725e314c0d9d',
                                email: 'playername4@google.com',
                                id: 1,
                                name: 'Player Name 4',
                                office: 'San Francisco'
                            }
                        ],
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        loser_score: 20,
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        winners: [
                            {
                                avatar: '',
                                email: 'playername2@google.com',
                                id: 3,
                                name: 'Player Name 2',
                                office: 'San Francisco'
                            },
                            {
                                avatar: '',
                                email: 'playername@google.com',
                                id: 4,
                                name: 'Player Name',
                                office: 'San Francisco'
                            }
                        ]
                    }
                });
                expect(typeof(postStub.args[0][2])).toEqual('function');
            });
        });
    });
});
