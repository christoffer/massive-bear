var http = require('http');

module.exports = (function() {
  DEFAULT_API_HOST = 'api.readmill.com';
  DEFAULT_API_PORT = 80;

  function _clone(other) {
    return JSON.parse(JSON.stringify(other));
  }

  function ReadmillClient(options) {
    var self = this;
    this.options = options || {};
  }

  ReadmillClient.prototype.buildRequestOptions = function(requestOptions) {
    var auth;

    requestOptions = requestOptions || {};

    requestOptions.host   = requestOptions.host || this.options.host || DEFAULT_API_HOST;
    requestOptions.port   = requestOptions.port || this.options.port || DEFAULT_API_PORT;
    requestOptions.method = requestOptions.method || this.options.method || 'get';
    requestOptions.path   = requestOptions.path || this.options.path || '';

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

    var options = _clone(this.options);
    options.path = path;
    return new ReadmillClient(options);
  }

  return ReadmillClient;
})()
