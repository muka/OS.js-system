var assert = require('assert');

var netman = require('../lib/netman')

var cache = {}

describe('netman', function() {

  describe('load device', function () {

    it('should load all devices', function (done) {
      netman.getDevices(function(err, devices) {
        assert.equal( !err, true )
        console.dir(devices)
        done()
      })
    })

  });

});
