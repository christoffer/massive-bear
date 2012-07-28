var http = require('http');

module.exports = (function() {
  DEFAULT_API_HOST = 'api.readmill.com';
  DEFAULT_API_PORT = 80;

  function ReadmillClient(options) {
    var self = this;
    this.options = options || {};
  }

  ReadmillClient.prototype.toString = function() {
    return "ReadmillClient";
  }

  return ReadmillClient;
})()
