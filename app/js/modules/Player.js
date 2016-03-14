module.exports = Player = (function() {

  var player,
      construct = function() {
        this.init = function(tracks) {
          DZ.init({
              appId: '169711',
              channelUrl: 'http://localhost:8000/app',
              player: {
                container: 'player',
                width: 80,
                height: 80,
                format: 'square'
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
