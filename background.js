(function(opera, Button) {
  "use strict";

  // App
  var BgProcess = {
    receiveMessages: function(e){
      if (e.type !== 'message') { return; }
      if (e.data.topic in BgProcess) {
        BgProcess[e.data.topic](e);
      }
    },
    GroovetoggleConnect: function(e) {
      var port = e.source;
      var tab = undefined;
      var tabs = opera.extension.tabs.getAll();
      var tabsLength = tabs.length;

      while (tabsLength-- && tab == undefined) {
        tab = port == tabs[tabsLength].port ? tabs[tabsLength] : undefined;
      }

      BgProcess.port = port;
      BgProcess.tab = tab.id;
      BgProcess.button.append();
    },
    GroovetoggleStatus: function(e){
      BgProcess.button.setTitle(e.data.currentSongStatus + ' ' + e.data.currentSong);
      if (BgProcess[e.data.currentSongStatus + 'Handler'] !== undefined) {
        BgProcess[e.data.currentSongStatus + 'Handler']();
      }
    },
    playingHandler: function(){
      BgProcess.button.disabled = false;
      BgProcess.button.icon = 'pause_18.png';
    },
    closeHandler: function(e){
      if (e.tab.id == BgProcess.tab) {
        BgProcess.button.remove();
        delete BgProcess.port;
        delete BgProcess.tab; 
      }
    
    },
    clickHandler: function(){
      BgProcess.port.postMessage({topic:'GroovetoggleMessage', message: 'toggle'});
    },

    init: function(){
      // Create toolbar button
      BgProcess.button = new Button(buttonConfiguration);
      
      // Listen to messages from injected script.
      opera.extension.onmessage = BgProcess.receiveMessages;

      // Listen to close event of tabs so we know when the grooveshark tab is closed.
      opera.extension.tabs.onclose = BgProcess.closeHandler;
    } 
  };

  // Configuration
  var buttonConfiguration = {
    disabled: true,
    icon: 'icon_18.png',
    onclick: BgProcess.clickHandler
  };

  BgProcess.init();

}).call(this, this.opera, this.window.Button);

