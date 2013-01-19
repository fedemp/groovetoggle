(function(opera, Button) {
  "use strict";
 
  var GroovetoggleBgProcess = {};

  GroovetoggleBgProcess.init = function(toolbarUIItemProperties){

    // Create toolbar button
    this.button = new Button(toolbarUIItemProperties);

    // Listen to messages from injected script.
    opera.extension.onmessage = GroovetoggleBgProcess.receiveMessages;

    // Listen to close event of tabs so we know when the grooveshark tab is closed.
    opera.extension.tabs.onclose = function(e){
      if (e.tab.id == GroovetoggleBgProcess._tab) {
        GroovetoggleBgProcess.removeButton();
        delete GroovetoggleBgProcess._injectedScript;
        delete GroovetoggleBgProcess._tab; 
      }
    }

  };

  GroovetoggleBgProcess.receiveMessages = function(e){
    debugger;
    if (e.type !== 'message') { return; }
    switch (e.data.topic) {
      case 'GroovetoggleConnect':
        var port = e.source;
        var tab = undefined;
        var tabs = opera.extension.tabs.getAll();
        var tabsLength = tabs.length;
        while (tabsLength-- && tab == undefined) {
          tab = port == tabs[tabsLength].port ? tabs[tabsLength] : undefined;
        }
        GroovetoggleBgProcess._injectedScript = port;
        GroovetoggleBgProcess._tab = tab.id;
        GroovetoggleBgProcess.appendButton();
        break; 
      case 'GroovetoggleStatus':
        GroovetoggleBgProcess.setButtonTitle((Locale[e.data.currentSongStatus] || '') + e.data.currentSong);
        break;
      default:
        break;
    }
  };

  GroovetoggleBgProcess.appendButton = function(){
    this.button.append();
  };

  GroovetoggleBgProcess.removeButton = function(){
    this.button.remove();
  };

  GroovetoggleBgProcess.setButtonTitle = function(title){
    this.button.setTitle(title);
  };

  GroovetoggleBgProcess.clickHandler = function(){
    GroovetoggleBgProcess.messageInjectedScript({topic:'GroovetoggleMessage', message: 'toggle'});
  };

  GroovetoggleBgProcess.messageInjectedScript = function(message){
    GroovetoggleBgProcess._injectedScript.postMessage(message);
  };

  GroovetoggleBgProcess.init({
    disabled: false,
    icon: 'icon_18.png',
    onclick: GroovetoggleBgProcess.clickHandler
  });

}).call(this, this.opera, this.window.Button);

