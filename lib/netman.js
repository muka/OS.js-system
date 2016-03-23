
var nm = require('dbus-network-manager')
var enums = nm.enums

var getDeviceGroup = function(DeviceType) {

  var list = {
    'NM_DEVICE_TYPE_UNKNOWN': 'Unknown',
    'NM_DEVICE_TYPE_ETHERNET': 'Ethernet',
    'NM_DEVICE_TYPE_WIFI': 'Wifi',
    'NM_DEVICE_TYPE_BT': 'Bluetooth',
    'NM_DEVICE_TYPE_WIMAX': 'WiMax',
    'NM_DEVICE_TYPE_MODEM': 'Modem',
    'NM_DEVICE_TYPE_BOND': 'Bond',
    'NM_DEVICE_TYPE_VLAN': 'VLAN',
    'NM_DEVICE_TYPE_ADSL': 'ADSL',
    'NM_DEVICE_TYPE_BRIDGE': 'Bridge',
  }

  return list[DeviceType] || list.NM_DEVICE_TYPE_UNKNOWN
}

var getState = function(State) {
  var states = {
    NM_DEVICE_STATE_UNKNOWN : 'Unknown',
    NM_DEVICE_STATE_UNMANAGED : 'Unmanaged',
    NM_DEVICE_STATE_UNAVAILABLE: 'Unavailable',
    NM_DEVICE_STATE_DISCONNECTED : 'Disconnected',
    NM_DEVICE_STATE_PREPARE: 'Connecting',
    NM_DEVICE_STATE_CONFIG: 'Configuring',
    NM_DEVICE_STATE_NEED_AUTH: 'Need authentication',
    NM_DEVICE_STATE_IP_CONFIG : 'Configuring',
    NM_DEVICE_STATE_IP_CHECK : 'Checking connectivity',
    NM_DEVICE_STATE_SECONDARIES: 'Waiting for secondary connections',
    NM_DEVICE_STATE_ACTIVATED: 'Active',
    NM_DEVICE_STATE_DEACTIVATING: 'Deactivating',
    NM_DEVICE_STATE_FAILED: 'Failed to activate',
  }

  return states[ State ] || states.NM_DEVICE_STATE_UNKNOWN
}

exports.getDevices = function(args, cb) {
  if(typeof args === 'function') {
    cb = args
    args = {}
  }
  nm.getDevices(function(err, list) {

    if(err) return cb(err)

    var devices = list
      .filter(function(dev) {
        if('NM_DEVICE_TYPE_GENERIC' === dev.props.DeviceType) {
          return false
        }
        if('NM_DEVICE_STATE_UNMANAGED' === dev.props.State) {
          return false
        }
        return true
      })
      .map(function(obj) {
        var dev = obj.props
        return {
          Interface: dev.Interface,
          Managed: dev.Managed,
          State: getState(dev.State),
          Group:  getDeviceGroup(dev.DeviceType)
        }
      })

    cb(false, devices)
  })
}
