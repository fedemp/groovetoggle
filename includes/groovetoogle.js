// ==UserScript==
//  @include http://grooveshark.com/*
// ==/UserScript==

(function() {
  "use strict";
  /**
  # *Groovetoggle* lets you control playback of Grooveshark from Opera.
  #
  # @module GrooveToggle
  */

  var GrooveToggle, Grooveshark, opera, root;

  root = this;

  opera = root.opera;

  Grooveshark = void 0;

  GrooveToggle = {
    /**
    # `myFgApp` contains the injected script logic.
    #
    # @namespace GrooveToggle
    # @class myFgApp
    */

    myFgApp: {
      /**
      # Handles messages from background script.
      #
      # @method handleMessage
      # @param {Object} message Original message event.
      */

      handleMessage: function(message) {
        var _name;

        return typeof this[_name = message.data.topic] === "function" ? this[_name](message) : void 0;
      },
      /**
      # Handle song status change.
      #
      # @handleSongStatus
      # @param {Object} event Original event fired by Grooveshark.
      */

      handleSongStatus: function(event) {
        return this.sendMessage({
          topic: 'handleStatus',
          body: event
        });
      },
      /**
      # Send messages to background script e.g. current song status.
      #
      # @method sendMessage
      # @param {Object} message Message to send. Must have a `topic` and a `body`
      */

      sendMessage: function(message) {
        return opera.extension.postMessage(message);
      },
      /**
      # Make Grooveshark API toggle between 'play' and 'pause'
      #
      # @method togglePlayPause
      */

      togglePlayPause: function() {
        return Grooveshark.togglePlayPause();
      },
      /**
      # * Save reference to Grooveshark API. 
      # * Start listening messages from background script.
      # * Start listening from song status changes.
      #
      # @method onload
      */

      onLoad: function() {
        Grooveshark = root.window.Grooveshark;
        Grooveshark.setSongStatusCallback(function(event) {
          return GrooveToggle.myFgApp.handleSongStatus.call(GrooveToggle.myFgApp, event);
        });
        return opera.extension.onmessage = function(message) {
          return GrooveToggle.myFgApp.handleMessage.call(GrooveToggle.myFgApp, message);
        };
      },
      /**
      # * Let background script know that we are on Grooveshark.
      # * Wait for the onload event to the Grooveshark API will be ready.
      #
      # @method init
      */

      init: function() {
        this.sendMessage({
          topic: 'groovetoggleConnect'
        });
        return root.window.addEventListener('load', GrooveToggle.myFgApp.onLoad);
      }
    }
  };

  GrooveToggle.myFgApp.init();

}).call(this);
