(function(window, opera) {
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

  window.Button = Button;
}).call(this, this.window, this.opera);
