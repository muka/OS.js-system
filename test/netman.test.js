var assert = require('assert');

var netman = require('../lib/netman')
var Promise = require('dbus-network-manager').Promise

var cache = {}

describe('netman', function () {

  it('should load all devices', function () {
    return netman.getDevices().then(function (devices) {
      assert.equal(devices instanceof Array, true)
      return Promise.resolve()
    })
  })

  it('should load all active connections', function () {
    return netman.getActiveConnections().then(function (conns) {
      assert.equal(conns instanceof Array, true)
      return Promise.resolve()
    })
  })

  it('should load network manager properties', function () {
    return netman.getOverview().then(function (props) {
      assert.equal(typeof props.WimaxHardwareEnabled === 'boolean', true)
      return Promise.resolve()
    })
  })

  it('should list available connections', function () {
    return netman.getAvailableConnections()
  })

});
