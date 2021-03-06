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
(function(Service, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // SERVICE
  /////////////////////////////////////////////////////////////////////////////

  function SystemService(args, metadata) {
    Service.apply(this, ['SystemService', args, metadata]);
  }

  SystemService.prototype = Object.create(Service.prototype);
  SystemService.constructor = Service;

  SystemService.prototype.destroy = function() {
    var wm = OSjs.Core.getWindowManager();
    if ( wm ) {
      wm.removeNotificationIcon('SystemServiceNotification');
      wm.removeNotificationIcon('SoundNotification');
      wm.removeNotificationIcon('BatteryNotification');
      wm.removeNotificationIcon('NetworkNotification');
      wm.removeNotificationIcon('WirelessNotification');
    }

    return Service.prototype.destroy.apply(this, arguments);
  };

  SystemService.prototype.init = function(settings, metadata) {
    Service.prototype.init.apply(this, arguments);

    if ( !OSjs.Extensions.SystemExtension ) {
      throw new Error('The SystemExtension was not loaded');
    }

    var wm = OSjs.Core.getWindowManager();
    if ( wm ) {
      wm.createNotificationIcon('SystemServiceNotification', {
        image: OSjs.API.getIcon('devices/computer.png', '16x16'),
        title: 'System',
        onClick: this.showMenu
      });

      wm.createNotificationIcon('SoundNotification', {
        image: OSjs.API.getIcon('status/audio-volume-muted.png', '16x16'),
        title: 'Volume',
        onClick: this.showSoundMenu
      });

      wm.createNotificationIcon('BatteryNotification', {
        image: OSjs.API.getIcon('status/battery-missing.png', '16x16'),
        title: 'Battery',
        onClick: this.showBatteryMenu
      });

      wm.createNotificationIcon('NetworkNotification', {
        image: OSjs.API.getIcon('status/network-offline.png', '16x16'),
        title: 'Network',
        onClick: this.showNetworkMenu
      });

      wm.createNotificationIcon('WirelessNotification', {
        image: OSjs.API.getIcon('devices/network-wireless.png', '16x16'),
        title: 'Wireless',
        onClick: this.showWIFIMenu
      });
    }

    /*
    OSjs.Extensions.SystemExtension.System.openDialog();
    OSjs.Extensions.SystemExtension.WIFI.openDialog();
    OSjs.Extensions.SystemExtension.Network.openDialog();
    OSjs.Extensions.SystemExtension.Status.openDialog();
    */
  };

  SystemService.prototype.showMenu = function(ev) {
    OSjs.API.createMenu([{
      title: 'Configure System',
      onClick: function() {
        OSjs.Extensions.SystemExtension.System.openDialog();
      }
    }, {
      title: 'Configure WIFI',
      onClick: function() {
        OSjs.Extensions.SystemExtension.WIFI.openDialog();
      }
    }, {
      title: 'Configure Network',
      onClick: function() {
        OSjs.Extensions.SystemExtension.Network.openDialog();
      }
    },{
      title: 'Show System Status',
      onClick: function() {
        OSjs.Extensions.SystemExtension.Status.openDialog();
      }
    }], ev);
  };

  SystemService.prototype.showSoundMenu = function(ev) {
    OSjs.API.createMenu([{
      title: 'No sound available',
      disabled: true
    }], ev);
  };

  SystemService.prototype.showBatteryMenu = function(ev) {
    OSjs.API.createMenu([{
      title: 'No battery available',
      disabled: true
    }], ev);
  };

  SystemService.prototype.showNetworkMenu = function(ev) {
    OSjs.API.createMenu([{
      title: 'Configure Network',
      onClick: function() {
        OSjs.Extensions.SystemExtension.Network.openDialog();
      }
    }, {
      title: 'Network Adapters:',
      disabled: true
    }], ev);
  };

  SystemService.prototype.showWIFIMenu = function(ev) {
    OSjs.Extensions.SystemExtension.getDevices('wifi', function(err, res) {
      var menu = [{
        title: 'Configure WIFI',
        onClick: function() {
          OSjs.Extensions.SystemExtension.WIFI.openDialog();
        }
      }];

      (res || []).forEach(function(dev) {
        menu.push({
          title: 'Interface: ' + dev.interface,
          disabled: true
        });
        menu.push({
          title: '  Mode: ' + (dev.mode || '<none>'),
          disabled: true
        });
        menu.push({
          title: '  AP: ' + (dev.access_point || '<none>'),
          disabled: true
        });
        menu.push({
          title: '  SSID: ' + (dev.ssid || '<none>'),
          disabled: true
        });
        menu.push({
          title: '  Signal: ' + String(dev.signal || 0),
          disabled: true
        });
      });

      OSjs.API.createMenu(menu, ev);
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.SystemService = OSjs.Applications.SystemService || {};
  OSjs.Applications.SystemService.Class = SystemService;

})(OSjs.Core.Service, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
