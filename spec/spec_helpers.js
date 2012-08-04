var http = require('http');

module.exports = (function() {
  var requestSpy = null;

  return {
    mockRequests: function() {
      requestSpy = spyOn(http, 'request');
      return requestSpy;
    },

    mostRecentRequestOptions: function() {
      if(!requestSpy || !requestSpy.mostRecentCall) {
        throw 'No requests have been made';
      }
      return requestSpy.mostRecentCall.args[0];
    }
  }

})();
