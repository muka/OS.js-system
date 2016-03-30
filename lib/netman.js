
var nm = require('dbus-network-manager')
var Promise = nm.Promise

/**
 * @return {Promise} a list of  active connections
 */
exports.getActiveConnections = function (args) {
  return nm.getNetworkManager().then(function (nman) {
    return nman.getActiveConnections().map(function (obj) {
      return obj.getProperties(nm.interfaces.ConnectionActive, 3)
    })
  })
}

/**
 * @return {Promise} a list of managed devices
 */
exports.getDevices = function (args) {
  return nm.getNetworkManager().then(function (nman) {
    return nman.getDevices().map(function (obj) {
      return obj.getProperties(nm.interfaces.Device, 3)
    })
  })
}

/**
 * @return {Promise} network manager properties as a state overview
 */
exports.getAvailableConnections = function (args) {
  return nm.getNetworkManager().then(function (networkManager) {
    return networkManager.getDevices()
      .map(function (device) {
        return device.getAvailableConnections()
      })
      .map(function (conns) {
        if(!conns.length) {
          return Promise.resolve(null)
        }
        return Promise.all(conns).map(function (conn) {
          return conn.getSettings()
        })
      })
      .then(function(conns) {

        var connections = []
        conns.filter(function(v) {
          return v !== null
        })
        .forEach(function(arr) {
          connections = connections.concat(arr)
        })

        return Promise.resolve(connections)
      })
  })
}

/**
 * @return {Promise} network manager properties as a state overview
 */
exports.getOverview = function (args) {
  return nm.getNetworkManager().then(function(nman) {
    return nman.getOverview()
  })
}
