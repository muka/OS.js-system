var nm = require('dbus-network-manager')
var enums = nm.enums

var getDeviceGroup = function (DeviceType) {
  return enums.labels.NM_DEVICE_TYPE[DeviceType] || enums.labels.NM_DEVICE_TYPE.NM_DEVICE_TYPE_UNKNOWN
}

var getState = function (State) {
  return enums.labels.NM_STATE[State] || enums.labels.NM_STATE.NM_DEVICE_STATE_UNKNOWN
}

exports.getDevices = function (args, cb) {

  if(typeof args === 'function') {
    cb = args
    args = {}
  }

  nm.getNetworkManager(function (err, networkManager) {

    if(err) return cb(err)

    networkManager.as(nm.interfaces.NetworkManager).GetDevices(function (err, list) {

      if(err) return cb(err)

      var loadDevices = function (list, then) {
        var devices = []
        var len = list.length,
          cnt = 0
        var next = function () {
          cnt++
          if(cnt === len) then(devices)
        }

        while(list.length) {
          nm.getObject(list.pop(), function (err, dev) {
            if(err) return next()
            dev.as(nm.interfaces.Properties).GetAll(nm.interfaces.Device, function (err, props) {
              if(err) return next()
              dev.props = props
              devices.push(dev)
              next()
            })
          })
        }
      }

      loadDevices(list, function (devices) {

        var managed = devices
          .filter(function (dev) {
            if('NM_DEVICE_TYPE_GENERIC' === dev.props.DeviceType) {
              return false
            }
            if('NM_DEVICE_STATE_UNMANAGED' === dev.props.State) {
              return false
            }
            return true
          })
          .map(function (obj) {
            var dev = obj.props
            return {
              Interface: dev.Interface,
              Managed: dev.Managed,
              State: getState(dev.State),
              Group: getDeviceGroup(dev.DeviceType)
            }
          })

        cb(false, managed)

      })

    })

  })
}
