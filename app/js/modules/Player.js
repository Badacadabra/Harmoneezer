/**
 * Module encapsulant le lecteur audio fourni par Deezer (DZ.player).
 * La classe qu'il contient est à la fois un Singleton et un Adapter.
 *
 * @module Player
 * @class Player
 */
module.exports = Player = (function() {

  /**
   * Attribut (privé) représentant une instance de la classe elle-même (cf. Singleton)
   *
   * @property player
   * @type {Object}
   * @default undefined
   */
  var player,
  /**
   * Attribut (privé) contenant une référence vers le SDK de Deezer
   *
   * @property Deezer
   * @type {Object}
   * @default DZ
   */
      Deezer = DZ, // https://cdns-files.dzcdn.net/js/min/dz.js
    /**
     * Constructeur (privé) chargé d'initialiser le player (cf. Singleton)
     *
     * @method construct
     * @constructor
     */
      construct = function() {
        /**
         * Méthode effectuant réellement l'initialisation
         *
         * @method construct
         */
        this.init = function() {
          Deezer.init({
              appId: '169711',
              channelUrl: 'http://localhost:8000/app',
              player: {
                container: 'player',
                width: 80,
                height: 80,
                format: 'square'
              }
          });
        },
        /**
         * Chargement des morceaux dans le lecteur
         *
         * @method playTracks
         * @param {Array} ids Tableau contenant les identifiants des morceaux
         */
        this.playTracks = function(ids) {
          Deezer.player.playTracks(ids);
        },
        /**
         * Lecture
         *
         * @method play
         */
        this.play = function() {
          Deezer.player.play();
        },
        /**
         * Pause
         *
         * @method pause
         */
        this.pause = function() {
          Deezer.player.pause();
        },
        /**
         * Suivant
         *
         * @method suivant
         */
        this.next = function() {
          Deezer.player.next();
        },
        /**
         * Précédent
         *
         * @method prev
         */
        this.prev = function() {
          Deezer.player.prev();
        },
        /**
         * Aller à...
         *
         * @method seek
         * @param {Number} pos Position de la tête de lecture (entre 0 et 100)
         */
        this.seek = function(pos) {
          Deezer.player.seek(pos);
        },
        /**
         * Activer/Désactiver le son
         *
         * @method mute
         * @param {Boolean} isMute Vrai ou faux
         */
        this.mute = function(isMute) {
          Deezer.player.setMute(isMute);
        },
        /**
         * Activer/Désactiver la lecture aléatoire
         *
         * @method random
         * @param {Boolean} isRandom Vrai ou faux
         */
        this.random = function(isRandom) {
          Deezer.player.setShuffle(isRandom);
        },
        /**
         * Activer/Désactiver la lecture répétée
         *
         * @method repeat
         * @param {Number} code 0 (no repeat), 1 (repeat all), ou 2 (repeat one)
         */
        this.repeat = function(code) {
          Deezer.player.setRepeat(code);
        }
      };

  return new function() {
    /**
     * Méthode délivrant l'unique instance de la classe (cf. Singleton)
     *
     * @method getPlayer
     * @return {Object} Une instance de player
     */
    this.getPlayer = function() {
      if (player === undefined) {
        player = new construct();
      }
      return player;
    };
  };

})();
