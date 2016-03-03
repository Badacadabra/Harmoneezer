function initPlayer() {
  DZ.init({
      appId  : '95a754773864b313d25c009ebc18bd96',
      channelUrl : 'http://localhost:8000/app',
      player : {
        container: 'player',
        width: 80,
        height: 80,
        format: 'square',
        onload : function(){
          DZ.player.playTracks(searchedTracks);
        }
      }
  });
}
