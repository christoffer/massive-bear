var ReadmillClient = require('../lib/ReadmillClient');
var http = require('http');
var helpers = require('./spec_helpers');

describe('ReadmillClient', function() {

  describe('buildRequest', function() {

    it('allows case by case configuration', function() {
      var client = new ReadmillClient();
      var requestOptions = client.buildRequest({
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

      var requestOptions = client.buildRequest();

      expect(requestOptions.method).toEqual('client-test');
      expect(requestOptions.host).toEqual('client.host.com');
      expect(requestOptions.port).toEqual(8001);
    });

    it('falls back to defaults', function() {
      var client = new ReadmillClient();
      var requestOptions = client.buildRequest();

      expect(requestOptions.method).toEqual('get');
      expect(requestOptions.host).toEqual('api.readmill.com');
      expect(requestOptions.port).toEqual(80);
    });

    it('authenticates requests with client id', function() {
      var client = new ReadmillClient({ clientId: 'my-client-id' });
      var requestOptions = client.buildRequest();
      expect(requestOptions.headers['Authorization']).toEqual('ClientId my-client-id');
    });

    it('authenticates requests with access token', function() {
      var client = new ReadmillClient({
        accessToken: 'haxortoken',
        clientId: 'my-client-id'
      });
      var requestOptions = client.buildRequest();
      expect(requestOptions.headers['Authorization']).toEqual('OAuth haxortoken');
    });

  });

});
