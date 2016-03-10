module.exports = Player = (function() {

  var player,
      construct = function() {
        this.init = function(tracks) {
          DZ.init({
              appId: '95a754773864b313d25c009ebc18bd96',
              channelUrl: 'http://localhost:8000/app',
              player: {
                container: 'player',
                width: 80,
                height: 80,
                format: 'square',
                onload : function(){
                  // DZ.player.playTracks(tracks);
                  DZ.player.playTracks([3135556, 1152226]);
                }
              }
          });
        };
      };

  return new function() {
    this.getPlayer = function() {
      if (player === undefined) {
        player = new construct();
      }
      return player;
    };
  };

})();
