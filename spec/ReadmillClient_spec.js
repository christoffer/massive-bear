var ReadmillClient = require('../lib/ReadmillClient');
var http = require('http');
var helpers = require('./spec_helpers');

describe('ReadmillClient', function() {

  beforeEach(function() {
    helpers.mockRequests();
  });

  it('can be instantiated', function() {
    expect(function() { new ReadmillClient() }).not.toThrow();
  });

});
