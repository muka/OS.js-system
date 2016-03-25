var nm = require('dbus-network-manager')
var enums = nm.enums

var getDeviceGroup = function (DeviceType) {
  return enums.labels.NM_DEVICE_TYPE[DeviceType] || enums.labels.NM_DEVICE_TYPE.NM_DEVICE_TYPE_UNKNOWN
}

var getState = function (State) {
  return enums.labels.NM_STATE[State] || enums.labels.NM_STATE.NM_DEVICE_STATE_UNKNOWN
}

var _nm;
var getNetworkManager = function (then, reset) {
  if(reset) {
    _nm = null
  }
  if(_nm) {
    return then(null, _nm)
  }
  nm.getNetworkManager(function (err, networkManager) {
    if(err) {
      _nm = null;
      return then(err);
    }
    _nm = networkManager;
    then(null, _nm);
  })
}

/**
 * Returns a list of active connections
 */
exports.getActiveConnections = function (args, cb) {
  getNetworkManager(function (err, networkManager) {
    networkManager.getActiveConnections(function (err, connections) {
      if(err) return cb(err, [])
      cb(null, connections.map(function(conn) { return conn.properties }))
    }, true)
  })
}

/**
 * Returns a list of managed devices
 */
exports.getDevices = function (args, cb) {
  getNetworkManager(function (err, networkManager) {

    if(err) return cb(err)

    networkManager.getDevices(function (err, list) {

      if(err) return cb(err)

      var managed = list
        // .filter(function (dev) {
        //
        //   if('NM_DEVICE_TYPE_GENERIC' === dev.properties.DeviceType) {
        //     return false;
        //   }
        //   if('NM_DEVICE_STATE_UNMANAGED' === dev.properties.State) {
        //     return false;
        //   }
        //
        //   return true;
        // })
        // .map(function (obj) {
        //   var dev = obj.properties;
        //   return {
        //     Interface: dev.Interface,
        //     Managed: dev.Managed,
        //     State: getState(dev.State),
        //     Group: getDeviceGroup(dev.DeviceType)
        //   }
        // })
        .map(function (obj) {
          return obj.properties
        })

      cb(false, managed)
    }, true)
  })
}

/**
 * Returns network manager properties as a state overview
 */
exports.getOverview = function (args, cb) {
  getNetworkManager(function (err, networkManager) {
    if(err) return cb(err)
    networkManager.getProperties(nm.interfaces.NetworkManager, cb)
  })
}
