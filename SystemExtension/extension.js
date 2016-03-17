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
(function(Utils, VFS, API, GUI) {
  var dialogs = {};
  var lastPoll = 0;
  var devices = {
    available: [],
    network: [],
    wifi: [],
    battery: false,
    sound: false
  };

  /////////////////////////////////////////////////////////////////////////////
  // MODULE API
  /////////////////////////////////////////////////////////////////////////////

  function init(metadata, done) {
    var url = API.getApplicationResource('SystemExtension', './scheme.html');
    var scheme = GUI.createScheme(url);

    OSjs.Extensions.SystemExtension.scheme = scheme;

    scheme.load(function(error, result) {
      pollDevices({}, function() {
        done();
      });
    });
  }

  function showDialog(name, create, cb) {
    function done() {
      if ( dialogs[name] ) {
        dialogs[name] = null;
      }

      (cb || function() {})();
    }

    if ( dialogs[name] ) {
      dialogs[name]._focus();
      return;
    }

    dialogs[name] = create(done);
  }

  function pollDevices(args, cb) {
    cb = cb || function() {};

    function done() {
      lastPoll = new Date();
      cb(false);
    }

    var diff = ((new Date()) - lastPoll) / 1000;
    if ( diff < 5 ) {
      done();
      return;
    }

    API.call('getDevices', { command: 'list' }, function(response) {
      devices.available = response.result || [];
      done();
    });

  }

  function getDevices(type, cb) {
    cb = cb || function() {};

    pollDevices({}, function(err) {
      cb(err, err ? false : type ? devices[type] : devices);
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Extensions.SystemExtension = OSjs.Extensions.SystemExtension || {};
  OSjs.Extensions.SystemExtension.init = init;
  OSjs.Extensions.SystemExtension.scheme = null;
  OSjs.Extensions.SystemExtension.showDialog = showDialog;
  OSjs.Extensions.SystemExtension.getDevices = getDevices;
  OSjs.Extensions.SystemExtension.pollDevices = pollDevices;

})(OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.GUI);
