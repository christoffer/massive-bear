var http = require('http');
var _score = require('underscore');

module.exports = (function() {

  REQUEST_DEFAULTS = {
    host: 'api.readmill.com',
    port: 80,
    method: 'get'
  }

  function ReadmillClient(options) {
    var self = this;
    this.options = options || {};
  }

  ReadmillClient.prototype.buildRequestOptions = function(requestOptions) {
    var auth;

    requestOptions = _score.defaults(requestOptions || {}, this.options, REQUEST_DEFAULTS);

    if(this.options.accessToken) {
      auth = 'OAuth ' + this.options.accessToken;
    } else if(this.options.clientId) {
      auth = 'ClientId ' + this.options.clientId;
    }

    if(auth) {
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['Authorization'] = auth;
    }

    return requestOptions;
  }

  function _buildRequestMethod(method, callback) {
    return function(callback) {
      var requestOptions = this.buildRequestOptions({ method: method });
      return http.request(requestOptions, callback);
    }
  }

  ReadmillClient.prototype.get = _buildRequestMethod('get')
  ReadmillClient.prototype.put = _buildRequestMethod('put')
  ReadmillClient.prototype.post = _buildRequestMethod('post')
  ReadmillClient.prototype.destroy = _buildRequestMethod('delete')

  // Path builders

  ReadmillClient.prototype.users = function(id) {
    var path = (this.options.path || '') + '/users';
    if(typeof id !== 'undefined') {
      path = path + '/' + id;
    }

    var options = _score.clone(this.options);
    options.path = path;
    return new ReadmillClient(options);
  }

  return ReadmillClient;
})()
