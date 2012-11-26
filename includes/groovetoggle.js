(function(this){
  "use strict";
  var Grooveshark = window.Grooveshark;

  var GroovetoggleClient = {} 

  // Return current song status
  GroovetoggleClient.getStatus = function(){
    return Grooveshark.getCurrentSongStatus().status;
  }

  // Send playback status to bgprocess
  GroovetoggleClient.messageBgProcess = function(){
    opera.extension.postMessage({
      topic: 'GroovetoggleStatus',
      currentSongStatus: GroovetoggleClient.getStatus()
    }); 
  }

  // Toggle playback status. Sends message to bgprocess to update song status.
  GroovetoggleClient.toggle = function(){
    Grooveshark.togglePlayPause();
    GroovetoggleClient.messageBgProcess();
  }

  GroovetoggleClient._init = function(){
    // Toggle playback status on message from bgprocess.
    opera.extension.addEventListener('message', GroovetoggleClient.toggle, false);
    // Keep bgprocess aware of playback status.
    window.setInterval(GroovetoggleClient.messageBgProcess, 3000)
  }

  window.addEventListener('DOMContentLoaded', GroovetoggleClient._init, false); 

}).call(this)
