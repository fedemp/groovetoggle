(function(opera, Locale) {
  "use strict";
 
  var Locale = {};

  var Button = function(toolbarUIItemProperties) {
    this._button = opera.contexts.toolbar.createItem(toolbarUIItemProperties);
    return this;
  };

  Button.prototype.append = function() {
    if (this.length() === 0) {
      opera.contexts.toolbar.addItem(this._button);
    }
    return this;
  };

  Button.prototype.remove = function() {
    if (this.length() === 1) {
      opera.contexts.toolbar.removeItem(this._button);
    }
    return this;
  };

  Button.prototype.length = function() {
    return opera.contexts.toolbar.length;
  };

  Button.prototype.setTitle = function(title) {
    this._button.title = title;
    return this;
  };

  var GroovetoggleBgProcess = {};

  GroovetoggleBgProcess.init = function(toolbarUIItemProperties){

    // Create toolbar button
    this.button = new Button(toolbarUIItemProperties);

    // Append button to toolbar and save reference to injected script.
    opera.extension.addEventListener('connect', function(e){ 
      GroovetoggleBgProcess.appendButton();
      GroovetoggleBgProcess._injectedScript = e.source;
    });

    // Remove button to toolbar and delete reference to injected script.
    opera.extension.addEventListener('disconnect', function(){
      GroovetoggleBgProcess.removeButton();
      delete GroovetoggleBgProcess._injectedScript;
    });

    // Listen to messages from injected script.
    opera.extension.addEventListener('message', GroovetoggleBgProcess.receiveMessages);

  };

  GroovetoggleBgProcess.receiveMessages = function(e){
    if (e.type !== 'message' || e.data.topic !== 'GroovetoggleStatus') { return; }
    GroovetoggleBgProcess.setButtonTitle((Locale[e.data.currentSongStatus] || '') + e.data.currentSong);
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
    icon: '/icons/icon_32.png',
    onclick: GroovetoggleBgProcess.clickHandler
  });

}).call(this, this.opera, this.Locale);

