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


  // Define finalizer methods; that is methods that actually perform the request
  // with a given http verb
  _score.each(['get', 'put', 'post', 'head', 'destroy'], function(finalizerMethod) {
    var httpVerb = finalizerMethod;
    if(finalizerMethod === 'destroy') httpVerb = 'delete'; // since delete is a reserved word
    ReadmillClient.prototype[finalizerMethod] = function(callback) {
      var requestOptions = this.buildRequestOptions({ method: httpVerb });
      return http.request(requestOptions, callback);
    }
  });

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
