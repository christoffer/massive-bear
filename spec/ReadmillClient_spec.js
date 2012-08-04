var ReadmillClient = require('../lib/ReadmillClient');
var http = require('http');
var helpers = require('./spec_helpers');

describe('ReadmillClient', function() {

  describe('buildRequestOptions', function() {

    it('allows case by case configuration', function() {
      var client = new ReadmillClient();
      var requestOptions = client.buildRequestOptions({
        host: 'test.host.com',
        port: 9001,
        method: 'test'
      });

      expect(requestOptions.method).toEqual('test');
      expect(requestOptions.host).toEqual('test.host.com');
      expect(requestOptions.port).toEqual(9001);
    });

    it('allows client based configuration', function() {
      var client = new ReadmillClient({
        host: 'client.host.com',
        port: 8001,
        method: 'client-test'
      });

      var requestOptions = client.buildRequestOptions();

      expect(requestOptions.method).toEqual('client-test');
      expect(requestOptions.host).toEqual('client.host.com');
      expect(requestOptions.port).toEqual(8001);
    });

    it('falls back to defaults', function() {
      var client = new ReadmillClient();
      var requestOptions = client.buildRequestOptions();

      expect(requestOptions.method).toEqual('get');
      expect(requestOptions.host).toEqual('api.readmill.com');
      expect(requestOptions.port).toEqual(80);
    });

    it('authenticates requests with client id', function() {
      var client = new ReadmillClient({ clientId: 'my-client-id' });
      var requestOptions = client.buildRequestOptions();
      expect(requestOptions.headers['Authorization']).toEqual('ClientId my-client-id');
    });

    it('authenticates requests with access token', function() {
      var client = new ReadmillClient({
        accessToken: 'haxortoken',
        clientId: 'my-client-id'
      });
      var requestOptions = client.buildRequestOptions();
      expect(requestOptions.headers['Authorization']).toEqual('OAuth haxortoken');
    });

  });

  describe('finalizers', function() {

    beforeEach(function() {
      helpers.mockRequests();
    });

    it('has a working finalizers for get, put, post and destroy', function() {
      function lastMethodCalled() {
        return helpers.mostRecentRequestOptions().method.toLowerCase()
      }

      (new ReadmillClient()).get();
      expect(lastMethodCalled()).toEqual('get');

      (new ReadmillClient()).put();
      expect(lastMethodCalled()).toEqual('put');

      (new ReadmillClient()).post();
      expect(lastMethodCalled()).toEqual('post');

      (new ReadmillClient()).destroy();
      expect(lastMethodCalled()).toEqual('delete');

      (new ReadmillClient()).head();
      expect(lastMethodCalled()).toEqual('head');
    });

  });

  describe('path builders', function() {
    beforeEach(function() {
      this.client = new ReadmillClient();
    });

    describe('#users', function() {
      it('works on root', function() {
        expect(this.client.users().buildRequestOptions().path).toEqual('/users');
      });

      it('accepts id', function() {
        expect(this.client.users(3).buildRequestOptions().path).toEqual('/users/3');
      });

      it('does not distrupt original client', function() {
        this.client.options.path = '/some/path';
        this.client.users();
        expect(this.client.buildRequestOptions().path).toEqual('/some/path');
      });
    });
  });

  // var client = new ReadmillClient({
  //   clientId: 'cid',
  //   clientSecret: 'secret',
  //   redirectUri: 'http://myhack.heroku.com',
  //   accessToken: null
  // });
  // window.location.href = client.authorizationUrl()
  // client.exchangeCodeForToken('haxxorcode', function(token) {
  //  client.users(1).readings(5).get(function(readings) {
  //    console.log("First reading: " + readings[0];
  //  })
  //
  //  client.users(4).readings(901, { private: true }).put()
  //  client.books(4).readings({ userId: 45, state: 'abandoned', private: true }).post()
  //  client.users(4).readings(901).destroy()
  // })

});
