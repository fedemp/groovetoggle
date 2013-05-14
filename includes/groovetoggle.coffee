###
// ==UserScript==
//  @include http://grooveshark.com/*
// ==/UserScript==
###

"use strict"
###*
# *Groovetoggle* lets you control playback of Grooveshark from Opera.
#
# @module GrooveToggle
###

root = @
opera = root.opera
Grooveshark = undefined

GrooveToggle =
  
  ###*
  # `myFgApp` contains the injected script logic.
  #
  # @namespace GrooveToggle
  # @class myFgApp
  ###

  myFgApp:

    ###*
    # Handles messages from background script.
    #
    # @method handleMessage
    # @param {Object} message Original message event.
    ###
    handleMessage: (message) ->
      @[message.data.topic]? message

    ###*
    # Handle song status change.
    #
    # @method handleSongStatus
    # @param {Object} event Original event fired by Grooveshark.
    ###
    handleSongStatus: (event) ->
      @sendMessage
        topic: 'handleStatus'
        body: event 

    ###*
    # Send messages to background script e.g. current song status.
    #
    # @method sendMessage
    # @param {Object} message Message to send. Must have a `topic` and a `body`
    ###
    sendMessage: (message) ->
      opera.extension.postMessage message

    ###*
    # Make Grooveshark API toggle between 'play' and 'pause'
    #
    # @method togglePlayPause
    ###
    togglePlayPause: ->
      do Grooveshark.togglePlayPause
      
    ###*
    # * Save reference to Grooveshark API. 
    # * Start listening messages from background script.
    # * Start listening from song status changes.
    #
    # @method onLoad
    ###
    onLoad: ->
      Grooveshark = root.window.Grooveshark

      Grooveshark.setSongStatusCallback (event) ->
        GrooveToggle.myFgApp.handleSongStatus.call GrooveToggle.myFgApp, event

      opera.extension.onmessage = (message) ->
        GrooveToggle.myFgApp.handleMessage.call GrooveToggle.myFgApp, message

    ###*
    # * Let background script know that we are on Grooveshark.
    # * Wait for the onload event to the Grooveshark API will be ready.
    #
    # @method init
    ###
    init: ->
      @sendMessage
        topic: 'groovetoggleConnect'

      root.window.addEventListener 'load', GrooveToggle.myFgApp.onLoad

do GrooveToggle.myFgApp.init
