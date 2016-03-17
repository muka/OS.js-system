
var dbus = require('dbus-native');

var ns = {
  iface: "org.freedesktop.NetworkManager",
  path: "/org/freedesktop/NetworkManager",
}

exports.ns = ns

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
  getInterface(ns.iface, ns.path, function(err, manager) {
    if(err) return then && then(err, null)
    then && then(null, manager)
  })
}
exports.getNetworkManager = getNetworkManager

var getDeviceByPath = function(devicePath, then) {
  getInterface(ns.iface + '.Device', devicePath, ns.iface, function(err, device) {
    if(err) return then && then(err, null)
    then && then(null, device)
  })
}
exports.getDeviceByPath = getDeviceByPath

exports.getDevices = function(then) {
  getNetworkManager(function(err, networkManager) {

    if(err) return then && then(err)

    console.dir(networkManager)

    var deviceList = []
    networkManager.GetDevices(function(err, devices) {

      if(err) return then && then(err)

      var len = devices.length, cnt = 0
      devices.forEach(function(devPath) {

        getDeviceByPath(devPath, function(err, device) {

          if(err) return then && then(err)

          GetAllProperties(devPath, function(err, props) {
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

var GetAllProperties = function(path, iface, then) {

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
    path || ns.path,
    iface || ns.iface,
    function(err, props) {

      if(err) return then && then(err, null);

      props.GetAll(ns.iface + '.Device', function(err, list) {

        if(err) return then && then(err, null);

        var propsList = {}
        list.forEach(function(pgroup) {
          var val = pgroup[1][1]
          if(val.length === 1) val = val[0]
          propsList[ pgroup[0] ] = val
        })

        then && then(null, propsList)
      })
  })
}
exports.GetAllProperties = GetAllProperties
