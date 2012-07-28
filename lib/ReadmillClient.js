var http = require('http');

module.exports = (function() {
  DEFAULT_API_HOST = 'api.readmill.com';
  DEFAULT_API_PORT = 80;

  function ReadmillClient(options) {
    var self = this;
    this.options = options || {};
  }

  ReadmillClient.prototype.buildRequest = function(requestOptions) {
    var auth;

    requestOptions = requestOptions || {};

    requestOptions.host = requestOptions.host || this.options.host || DEFAULT_API_HOST;
    requestOptions.port = requestOptions.port || this.options.port || DEFAULT_API_PORT;
    requestOptions.method = requestOptions.method || this.options.method || 'get';

    if(this.options.accessToken) {
      auth = 'OAuth ' + this.options.accessToken;
    } else if(this.options.clientId) {
      auth = 'ClientId ' + this.options.clientId;
    }

    if(auth) {
      console.log("Setting auth");
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['Authorization'] = auth;
    }


    return requestOptions;
  }

  return ReadmillClient;
})()
