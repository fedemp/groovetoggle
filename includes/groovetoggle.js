// ==UserScript==
// @include http://grooveshark.com/*
// ==/UserScript==

(function(){
  "use strict";
  var Grooveshark = window.Grooveshark;
  var opera = this.opera;

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
    GroovetoggleClient._messageBgProcess({
      topic: 'GroovetoggleStatus',
      currentSongStatus: e.status,
      currentSong: e.song.songName
    });
  };

  GroovetoggleClient._init = function(){
    // Toggle playback status on message from bgprocess.
    opera.extension.addEventListener('message', GroovetoggleClient.toggle, false);
    // Keep bgprocess aware of playback status.
    Grooveshark.setSongStatusCallback(GroovetoggleClient.listenSongStatus);
  };

  window.addEventListener('DOMContentLoaded', GroovetoggleClient._init, false); 

}).call(this); 
