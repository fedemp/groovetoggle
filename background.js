(function() {

  var Button = function(toolbarUIItemProperties) {
    this._button = opera.contexts.toolbar.createItem(toolbarUIItemProperties);
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

    this._button = new Button(toolbarUIItemProperties);

    opera.extension.addEventListener('connect', function(e){ GroovetoggleBgProcess.appendButton(); });
    opera.extension.addEventListener('disconnect', function(e){ GroovetoggleBgProcess.removeButton(); });

  }

  GroovetoggleBgProcess.receiveMessages = function(e){
    if (e.type !== 'message' || e.data.topic !== 'GroovetoggleStatus') { return; }
    GroovetoggleBgProcess.setButtonTitle((Locale[e.data.currentSongStatus] || '') + e.data.currentSong);
  }

  GroovetoggleBgProcess.appendButton = function(){
    this._button.append();
  }

  GroovetoggleBgProcess.removeButton = function(){
    this._button.remove();
  }

  GroovetoggleBgProcess.setButtonTitle = function(title){
    this._button.setTitle(title)
  }

  GroovetoggleBgProcess.clickHandler = function(e){
    opera.extension.
  }

  GroovetoggleBgProcess.messageInjectedScript = function(message){

  }

  GroovetoggleBgProcess.init({
    disabled: false,
    icon: '/icons/icon_32.png'
    onclick:
  });

}).call(this);
