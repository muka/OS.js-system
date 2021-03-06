/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(Utils, VFS, API, DialogWindow) {

  /////////////////////////////////////////////////////////////////////////////
  // DIALOG
  /////////////////////////////////////////////////////////////////////////////

  function WIFIConnectionDialog(args, callback) {
    args = Utils.argumentDefaults(args, {});
    args.scheme = OSjs.Extensions.SystemExtension.scheme;

    DialogWindow.apply(this, ['WIFIConnectionDialog', {
      title: 'Configure Wireless Devices',
      icon: 'devices/network-wireless.png',
      width: 400,
      height: 300
    }, args, callback]);
  }

  WIFIConnectionDialog.prototype = Object.create(DialogWindow.prototype);
  WIFIConnectionDialog.constructor = DialogWindow;

  WIFIConnectionDialog.prototype.init = function() {
    var root = DialogWindow.prototype.init.apply(this, arguments);


    return root;
  };

  WIFIConnectionDialog.prototype._inited = function() {
    var self = this;
    var ret = DialogWindow.prototype._inited.apply(this, arguments);
    var select = this.scheme.find(this, 'Device');
    var modes = this.scheme.find(this, 'Mode');
    var bssid = this.scheme.find(this, 'BSSID');

    this._toggleLoading(true);
    OSjs.Extensions.SystemExtension.getDevices('wifi', function(err, res) {
      self._toggleLoading(false);

      var devices = [];
      (res || []).forEach(function(iter) {
        devices.push({
          label: iter.interface,
          value: iter.interface
        });
      });

      select.add(devices);
      if ( devices.length ) {
        modes.set('value', res[0].mode);
        bssid.set('value', res[0].access_point);
      }
    });

    return ret;
  };

  /////////////////////////////////////////////////////////////////////////////
  // MODULE API
  /////////////////////////////////////////////////////////////////////////////

  var WIFI = {
    openDialog: function(cb) {
      var args = {};
      OSjs.Extensions.SystemExtension.showDialog('WIFI', function(done) {
        return OSjs.API.createDialog(function(args, callback) {
          return new WIFIConnectionDialog(args, callback);
        }, args, done);
      }, cb);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Extensions.SystemExtension = OSjs.Extensions.SystemExtension || {};
  OSjs.Extensions.SystemExtension.WIFI = WIFI;

})(OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.Core.DialogWindow);

