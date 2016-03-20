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
     * Constructeur (privé) chargé d'initialiser le player (cf. Singleton)
     *
     * @method construct
     * @constructor
     */
      construct = function() {
        /**
         * Attribut indiquant si les morceaux sont chargés dans le lecteur
         *
         * @property tracksLoaded
         * @type {Boolean}
         * @default false
         */
        this.tracksLoaded = false,
        /**
         * Attribut indiquant la position de la tête de lecture dans le morceau en cours
         * La valeur se situe entre 0 et 100.
         *
         * @property trackPosition
         * @type {Number}
         * @default 0
         */
        this.trackPosition = 0,
        /**
         * Méthode effectuant réellement l'initialisation
         *
         * @method init
         */
        this.init = function() {
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
        },
        /**
         * Chargement et lecture des morceaux
         *
         * @method playTracks
         * @param {Array} ids Tableau contenant les identifiants des morceaux
         * @param {Number} index Indice du premier morceau
         */
        this.playTracks = function(ids, index) {
          DZ.player.playTracks(ids, index);
        },
        /**
         * Lecture
         *
         * @method play
         */
        this.play = function() {
          DZ.player.play();
        },
        /**
         * Pause
         *
         * @method pause
         */
        this.pause = function() {
          DZ.player.pause();
        },
        /**
         * Suivant
         *
         * @method suivant
         */
        this.next = function() {
          DZ.player.next();
        },
        /**
         * Précédent
         *
         * @method prev
         */
        this.prev = function() {
          DZ.player.prev();
        },
        /**
         * Aller à...
         *
         * @method seek
         * @param {Number} pos Position de la tête de lecture (entre 0 et 100)
         */
        this.seek = function(pos) {
          DZ.player.seek(pos);
        },
        /**
         * Activer/Désactiver le son
         *
         * @method mute
         * @param {Boolean} isMute Vrai ou faux
         */
        this.mute = function(isMute) {
          DZ.player.setMute(isMute);
        },
        /**
         * Activer/Désactiver la lecture aléatoire
         *
         * @method random
         * @param {Boolean} isRandom Vrai ou faux
         */
        this.random = function(isRandom) {
          DZ.player.setShuffle(isRandom);
        },
        /**
         * Activer/Désactiver la lecture répétée
         *
         * @method repeat
         * @param {Number} code 0 (no repeat), 1 (repeat all), ou 2 (repeat one)
         */
        this.repeat = function(code) {
          DZ.player.setRepeat(code);
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
