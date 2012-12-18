// ==UserScript==
// @include http://grooveshark.com/*
// ==/UserScript==

(function(opera){
  "use strict";
  var Grooveshark;

  var GroovetoggleClient = {};

  // Return current song status
  GroovetoggleClient.getStatus = function(){
    return Grooveshark.getCurrentSongStatus().status;
  };

  GroovetoggleClient.getCurrentSong = function(){
    return Grooveshark.getCurrentSongStatus().song.songName;
  };

  // Send playback status to bgprocess
  GroovetoggleClient._messageBgProcess = function(message){
    opera.extension.postMessage(message);
  };

  // Toggle playback status. Sends message to bgprocess to update song status.
  GroovetoggleClient.toggle = function(){
    Grooveshark.togglePlayPause();
  };

  GroovetoggleClient.listenSongStatus = function(e){
    if (e.status == 'loading' || e.song == null) { return; }
    GroovetoggleClient._messageBgProcess({
      topic: 'GroovetoggleStatus',
      currentSongStatus: e.status,
      currentSong: e.song.songName
    });
  };

  GroovetoggleClient._init = function(){
    // Say 'hi' to bgProcess
    opera.extension.postMessage({'topic':'GroovetoggleConnect'})
    // Save reference to Grooveshark object in top scope.
    Grooveshark = window.Grooveshark;
    // Toggle playback status on message from bgprocess.
    opera.extension.addEventListener('message', GroovetoggleClient.toggle, false);
    // Keep bgprocess aware of playback status.
    Grooveshark.setSongStatusCallback(GroovetoggleClient.listenSongStatus);
    
  };

  window.addEventListener('load', GroovetoggleClient._init, false); 

}).call(this, this.opera); 
