
var dbus = require('dbus-native');
var enums = require('./network-manager-enums')

var dbusInterfaces = {
  'DBusProperties': 'org.freedesktop.DBus.Properties'
}

exports.enums = enums

var networkManagerPath = "/org/freedesktop/NetworkManager"
exports.path = networkManagerPath

var getInterface = function(iface, path, serviceName, fn) {

  var sessionBus = dbus.systemBus();

  if(typeof serviceName === 'function') {
    fn = serviceName
    serviceName = iface
  }

  sessionBus.getService(serviceName).getInterface(path, iface, fn)
}
exports.getInterface = getInterface

var getNetworkManager = function(then) {
  getInterface(enums.interfaces.NetworkManager, networkManagerPath, function(err, manager) {
    if(err) return then && then(err, null)
    then && then(null, manager)
  })
}
exports.getNetworkManager = getNetworkManager

var getDeviceByPath = function(devicePath, then) {
  getInterface(
    enums.interfaces.Device,
    devicePath,
    enums.interfaces.NetworkManager,
    function(err, device) {
      if(err) return then && then(err, null)
      then && then(null, device)
  })
}
exports.getDeviceByPath = getDeviceByPath

exports.getDevices = function(then) {
  getNetworkManager(function(err, networkManager) {

    if(err) return then && then(err)

    // console.dir(networkManager)

    var deviceList = []
    networkManager.GetDevices(function(err, devices) {

      if(err) return then && then(err)

      var len = devices.length, cnt = 0
      devices.forEach(function(devPath) {

        getDeviceByPath(devPath, function(err, device) {

          if(err) return then && then(err)

          GetAllProperties(enums.interfaces.Device, devPath, function(err, props) {
            if(err) return then && then(err)
            deviceList.push({
              device: device,
              props: props
            })
            cnt++
            if(cnt === len) {
              then && then(null, deviceList)
            }
          })

        })
      })

    })
  })
}

var GetAllProperties = function(propIface, path, iface, then) {

  if(typeof path === 'function') {
    then = path
    path = null
  }
  if(typeof iface === 'function') {
    then = iface
    iface = null
  }

  getInterface(
    'org.freedesktop.DBus.Properties',
    path || networkManagerPath,
    iface || enums.interfaces.NetworkManager,
    function(err, props) {

      if(err) return then && then(err, null);

      props.GetAll(propIface, function(err, list) {

        if(err) return then && then(err, null);

        var propsList = {}
        list.forEach(function(pgroup) {
          var val = pgroup[1][1]
          var key = pgroup[0]
          if(val.length === 1) val = val[0]
          if(enums.mapping[ propIface ][ key ]) {
            var ref = enums.mapping[ propIface ][ key ]
            if(enums[ ref ] && enums[ ref ][ val ]) {
              if(val instanceof Array) {
                val = val.map(function(ival) {
                  return enums[ ref ][ ival ]
                })
              }
              else {
                val = enums[ ref ][ val ]
              }
            }
          }
          propsList[ key ] = val
        })

        then && then(null, propsList)
      })
  })
}
exports.GetAllProperties = GetAllProperties
