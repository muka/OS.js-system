var assert = require('assert');

var netman = require('../lib/netman')

var cache = {}

describe('netman', function () {

  describe('interact with network manger', function () {
    it('should load all devices', function (done) {
      netman.getDevices({}, function (err, devices) {
        assert.equal(!err, true)
        assert.equal(devices instanceof Array, true)
        // console.log(require('util').inspect(devices, { depth: null }));
        done()
      })
    })
  });

  it('should load all active connections', function (done) {
    netman.getActiveConnections({}, function (err, conns) {
      assert.equal(!err, true)
      assert.equal(conns instanceof Array, true)
      // console.log(require('util').inspect(conns, { depth: null }));
      done()
    })
  })

  it('should load network manager properties', function (done) {
    netman.getOverview({}, function (err, props) {
      assert.equal(!err, true)
      assert.equal(typeof props.WimaxHardwareEnabled === 'boolean', true)
      // console.log(require('util').inspect(props, { depth: null }));
      done()
    })
  })

});
