// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  /**
  # *Groovetoggle* lets you control playback of Grooveshark from Opera.
  #
  # @module GrooveToggle
  */

  var GrooveToggle, opera, root;

  root = this;

  opera = root.opera;

  GrooveToggle = {
    /**
    # `Button` works a container for methods that manage the toolbar button.
    #
    # @namespace GrooveToggle
    # @class Button
    */

    Button: (function() {
      var button, defaults, publicMethods, toolbar;

      defaults = {
        disabled: false,
        icon: 'play_18.png',
        title: '',
        onclick: function() {}
      };
      button = void 0;
      toolbar = opera.contexts.toolbar;
      return publicMethods = {
        /**
        # Creates the button with specified or default options but does not show
        # it by default. May be called by other methods if not called before.
        #
        # @method init
        # @chainable
        # @param {Object} [options={}] Defines button options.
        #   @param {Boolean} [options.disabled=false] Should the icon be disabled
        #   when shown?
        #   @param {String} [options.icon=""] URL to the icon file.
        #   @param {Function} [options.onclick=null] Callback that will handle
        #   the click event.
        #   @param {String} [title=""] Content of tooltip when hovering over
        #   button.
        */

        init: function(options) {
          if (options == null) {
            options = {};
          }
          if (button !== void 0) {
            return this;
          }
          button = toolbar.createItem(defaults);
          button.update(options);
          window.button = button;
          return this;
        },
        /**
        # Update buttons options.
        # @method update
        # @chainable
        # @param {Object} options={} Collection of properties to update.
        #   @param {String} [options.title] New content for tooltip.
        #   @param {String} [options.icon] New URL for icon.
        #   @param {Boolean} [options.disabled] Should the button be disabled?
        #   @param {Function} [options.onclick] New handler for click event.
        */

        update: function(options) {
          if (options == null) {
            options = {};
          }
          if (button === void 0) {
            this.init();
          }
          button.update(options);
          return this;
        },
        /**
        # Shows the button in the toolbar. It will be initialized if it has not
        # been done before.
        #
        # @method show
        # @chainable
        */

        show: function() {
          if (button === void 0) {
            this.init();
          }
          toolbar.addItem(button);
          return this;
        },
        /**
        # Hides the button in the toolbar. It will be initialized if it has not
        # been done before.
        #
        # @method hide
        # @chainable
        */

        hide: function() {
          if (button === void 0) {
            this.init();
          }
          toolbar.removeItem(button);
          return this;
        },
        /**
        # Is the button currently being shown in the toolbar?
        #
        # @method isVisible
        # @return {Boolean} Is visible or not.
        */

        isVisible: function() {
          return !!toolbar.length;
        }
      };
    })(),
    /**
    # `myBgApp` contains the background process logic including listeners.
    #
    # @namespace GrooveToggle
    # @class myBgApp
    */

    myBgApp: (function() {
      var pub, source, tabId;

      source = void 0;
      tabId = void 0;
      return pub = {
        /**
        # Listen to messages from injected script.
        #
        # @method listen
        # @param {Object} [message] An object that represents the message. It must contain a `topic` and a `body`.
        #   @param {String} topic Name of the method to be called.
        */

        listen: function(message) {
          var _name;

          return typeof this[_name = message.data.topic] === "function" ? this[_name](message) : void 0;
        },
        /**
        # Triggered when the injected script sends the first
        # * Shows the button on toolbar.
        # * Saves a reference to the injected script for later messaging.
        # * Saves a reference to the tab so we can check current URL.
        #
        # @method groovetoggleConnect
        # @param {MessageEvent} [message] Original message event.
        */

        groovetoggleConnect: function(message) {
          var allTabs, length;

          source = message.source;
          allTabs = opera.extension.tabs.getAll();
          length = allTabs.length;
          while (length) {
            length -= 1;
            if (allTabs[length].port === source) {
              tabId = allTabs[length].id;
            }
            break;
          }
          return GrooveToggle.Button.init().update({
            title: 'GrooveToggle',
            icon: 'icon_18.png',
            disabled: false,
            onclick: this.handleClick
          }).show();
        },
        /**
        # Listen to clicks to button on Opera toolbar.
        # It always send a message to injected script even if there are no songs
        # in the queue cause we can't suscribe to the "restore-queue" event.
        #
        # @method handleClick
        */

        handleClick: function() {
          source.postMessage({
            topic: 'togglePlayPause'
          });
        },
        /**
        # Listen to changes of the song status.
        #
        # @method handleStatus
        # @param {Object} message The original message sent by injected script.
        */

        handleStatus: function(message) {
          var body, result, song, status, title;

          body = message.data.body;
          song = body.song;
          switch (body.status) {
            case 'none':
              result = {
                title: '',
                icon: 'play_18.png',
                disabled: true
              };
              break;
            case 'loading':
            case 'playing':
            case 'completed':
            case 'paused':
              status = body.status.charAt(0).toUpperCase() + body.status.substr(1);
              title = song ? "" + status + " " + song.songName + " by " + song.artistName : "" + status;
              result = {
                title: title,
                disabled: false,
                icon: 'play_18.png'
              };
          }
          GrooveToggle.Button.update(result);
        },
        /**
        # Check if the tab that have been closed if the one hosting the injected script.
        #
        # @method handleTabClose
        # @param {Object} e The original event.
        */

        handleTabClose: function(e) {
          var tab;

          if (e.tab.id === tabId) {
            GrooveToggle.Button.hide();
            tab = source = null;
          }
        },
        /**
        # Init the app.
        #
        # @method init
        */

        init: function() {
          opera.extension.onmessage = function(e) {
            return GrooveToggle.myBgApp.listen.call(GrooveToggle.myBgApp, e);
          };
          opera.extension.tabs.onclose = GrooveToggle.myBgApp.handleTabClose;
        }
      };
    })()
  };

  GrooveToggle.myBgApp.init();

}).call(this);
