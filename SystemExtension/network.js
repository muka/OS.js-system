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

  function NetworkConnectionDialog(args, callback) {
    args = Utils.argumentDefaults(args, {});
    args.scheme = OSjs.Extensions.SystemExtension.scheme;

    DialogWindow.apply(this, ['NetworkConnectionDialog', {
      title: 'Configure Wired Devices',
      icon: 'devices/network-wired.png',
      width: 400,
      height: 300
    }, args, callback]);
  }

  NetworkConnectionDialog.prototype = Object.create(DialogWindow.prototype);
  NetworkConnectionDialog.constructor = DialogWindow;

  NetworkConnectionDialog.prototype.init = function(wm) {

    var win = this
    var root = DialogWindow.prototype.init.apply(this, arguments);

    var scheme = wm.scheme

    OSjs.Extensions.SystemExtension.getDevices(function(err, res) {

      var devicesView = scheme.find(win, 'NetworkDevicesList')
      devicesView.add({
       label: "TEST",
       icon: null,
       value: "TEST",
       entries: [
         {
          label: "item1",
          icon: null,
          value: "item1",
        },
         {
          label: "item2",
          icon: null,
          value: "item2",
        },
      ]
      })

    })

    return root;
  };

  /////////////////////////////////////////////////////////////////////////////
  // MODULE API
  /////////////////////////////////////////////////////////////////////////////

  var Network = {
    openDialog: function(cb) {
      var args = {};
      OSjs.Extensions.SystemExtension.showDialog('Network', function(done) {
        return OSjs.API.createDialog(function(args, callback) {
          return new NetworkConnectionDialog(args, callback);
        }, args, done);
      }, cb);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Extensions.SystemExtension = OSjs.Extensions.SystemExtension || {};
  OSjs.Extensions.SystemExtension.Network = Network;

})(OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.Core.DialogWindow);
