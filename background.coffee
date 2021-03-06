"use strict"
###*
# *Groovetoggle* lets you control playback of Grooveshark from Opera.
#
# @module GrooveToggle
###

root = @
{window} = @
opera = root.opera

GrooveToggle =

  ###*
  # `Button` works a container for methods that manage the toolbar button.
  #
  # @namespace GrooveToggle
  # @class Button
  ###

  Button: do ->

    # Default options for creating toolbar button. Not all available options
    # are described.
    defaults =
      disabled: false
      icon: 'play_16.png'
      title: ''
      onclick: ->

    # Private button instance
    button = undefined

    # Shortcuts
    toolbar = opera.contexts.toolbar

    publicMethods =
      ###*
      # Creates the button with specified or default options but does not show
      # it by default. May be called by other methods if not called before.
      #
      # @method init
      # @chainable
      # @param {Object} [options={}] Defines button options.
      #   @param {Boolean} [options.disabled=false] Should the icon be disabled when shown?
      #   @param {String} [options.icon=""] URL to the icon file.
      #   @param {Function} [options.onclick=null] Callback that will handle the click event.
      #   @param {String} [options.title=""] Content of tooltip when hovering over
      #   button.
      ###
      init: (options = {}) ->
        if button isnt undefined then return @
        button = toolbar.createItem defaults
        button.update options
        @

      ###*
      # Update buttons options.
      #
      # @method update
      # @chainable
      # @param {Object} options Collection of properties to update.
      #   @param {String} [options.title] New content for tooltip.
      #   @param {String} [options.icon] New URL for icon.
      #   @param {Boolean} [options.disabled] Should the button be disabled?
      #   @param {Function} [options.onclick] New handler for click event.
      ###
      update: (options = {}) ->
        if button is undefined then do @init

        # Opera takes care of selecting which keys are valid.
        button.update options
        @

      ###*
      # Shows the button in the toolbar. It will be initialized if it has not
      # been done before.
      #
      # @method show
      # @chainable
      ###
      show: ->
        if button is undefined then do @init
        toolbar.addItem button
        @

      ###*
      # Hides the button in the toolbar. It will be initialized if it has not
      # been done before.
      #
      # @method hide
      # @chainable
      ###
      hide: ->
        if button is undefined then do @init
        toolbar.removeItem button
        @

      ###*
      # Is the button currently being shown in the toolbar?
      #
      # @method isVisible
      # @return {Boolean} Is visible or not.
      ###
      isVisible: ->
        !!toolbar.length

  ###*
  # `myBgApp` contains the background process logic including listeners.
  #
  # @namespace GrooveToggle
  # @class myBgApp
  ###

  myBgApp: do ->

    # Gateway for messaging injected script.
    source = undefined

    # The tab id where the injected script is running.
    tab = undefined # for pingTab
    tabId = undefined # for handleTabClose

    # Reference to the pingTab setInterval
    interval = undefined

    # Return public methods

    pub =

      ###*
      # Listen to messages from injected script.
      #
      # @method listen
      # @param {Object} [message] An object that represents the message. It must contain a `topic` and a `body`.
      ###

      listen: (message) ->
        @[message.data.topic]? message

      ###*
      # Triggered when the injected script sends the first
      # * Shows the button on toolbar.
      # * Saves a reference to the injected script for later messaging.
      # * Saves a reference to the tab so we can check current URL.
      #
      # @method groovetoggleConnect
      # @param {MessageEvent} [message] Original message event.
      ###

      groovetoggleConnect: (message) ->
        # Note here that we overwrite the port since this method is called only
        # when the script is injected. This means that new Grooveshark tabs are
        # preferred over the previous one created.
        {source} = message

        # Using a while loop cause we wanna break as soon as we find the right tab
        allTabs = do opera.extension.tabs.getAll
        {length} = allTabs
        while length
          length -= 1
          if allTabs[length].port is source
            tab = allTabs[length]
            tabId = tab.id
          break

        # Show button on toolbar.
        GrooveToggle.Button.init().update(
          title: 'GrooveToggle'
          icon: 'play_16.png'
          onclick: @handleClick 
        ).show()

        # Ping tab url
        do @pingTab

      ###*
      # Listen to clicks to button on Opera toolbar.
      # It always send a message to injected script even if there are no songs
      # in the queue cause we can't suscribe to the "restore-queue" event.
      #
      # @method handleClick
      ###

      handleClick: ->
        source.postMessage topic:'togglePlayPause'
        return

      ###*
      # Listen to changes of the song status.
      #
      # @method handleStatus
      # @param {Object} message The original message sent by injected script.
      ###

      handleStatus: (message) ->

        {body} = message.data
        {song} = body

        switch body.status
          when 'none' 
            result =
              title: ''
              icon: 'play_16.png'
          when 'paused'
            status = do body.status.charAt(0).toUpperCase + body.status.substr 1
            title = if song then "#{status} #{song.songName} by #{song.artistName}" else "#{status}"
            result = 
              title: title
              icon: 'pause_16.png'

          when 'loading', 'playing', 'completed'
            status = do body.status.charAt(0).toUpperCase + body.status.substr 1
            title = if song then "#{status} #{song.songName} by #{song.artistName}" else "#{status}"
            result = 
              title: title
              icon: 'play_16.png'

        GrooveToggle.Button.update result 
        return

      ###*
      # Check if the tab that have been closed if the one hosting the injected script.
      #
      # @method handleTabClose
      # @param {Object} e The original event.
      ###
      
      handleTabClose: (e) -> 
        if e.tab.id is tabId then do @destroy

      ###*
      # Hide button and remove references to injected script.
      #
      # @method destroy
      ###

      destroy: ->
        window.clearInterval interval
        do GrooveToggle.Button.hide
        tab = button = tabId = source = null

      ###*
      # Ping the tab with the injected script to make sure we are still in Grooveshark.
      #
      # @method pingTab
      ###
      
      pingTab: ->
        self = @
        urlRegEx = /^http[s]?:\/\/grooveshark\.com.*/
        interval = window.setInterval ->
          window.console?.log 'interval'
          if not urlRegEx.test tab.url
            window.clearInterval interval
            do self.destroy
        , 1000
            
      ###*
      # Init the app.
      #
      # @method init
      ###
      init: ->
        opera.extension.onmessage = (e) ->
          GrooveToggle.myBgApp.listen.call GrooveToggle.myBgApp, e

        opera.extension.tabs.onclose = (e) ->
          GrooveToggle.myBgApp.handleTabClose.call GrooveToggle.myBgApp, e

do GrooveToggle.myBgApp.init
