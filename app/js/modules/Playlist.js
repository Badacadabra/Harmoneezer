/**
 * Module encapsulant le lecteur audio fourni par Deezer
 * Le module s'appuie sur le modèle MVVM de Vue.js.
 *
 * @module Playlist
 * @class Playlist
 */
module.exports = Playlist = new Vue({
  el: "#app",
  data: {
    /**
     * Attribut représentant l'id de la playlist sur Deezer
     *
     * @property deezerId
     * @type {Number}
     * @default -1
     */
    deezerId: -1,
    /**
     * Attribut représentant la liste des morceaux sous forme d'identifiants Deezer
     *
     * @property tracksIds
     * @type {Array}
     * @default []
     */
    tracksIds: [],
    /**
     * Attribut représentant la liste des morceaux sous forme d'objets Track
     *
     * @property selectedTracks
     * @type {Array}
     * @default []
     */
    selectedTracks: []
  },
  methods: {
    /**
     * Ajout d'un morceau à la playlist
     *
     * @method addTrack
     * @param {Object} track Objet Track
     */
    addTrack: function(track) {
      this.tracksIds.push(track._id);
      this.selectedTracks.push(track);
    },
    /**
     * Suppression d'un morceau de la playlist
     *
     * @method removeTrack
     * @param {Number} i Index du morceau dans la playlist
     */
    removeTrack: function(i) {
      this.tracksIds.splice(i, 1);
      this.selectedTracks.splice(i, 1);
    },
    /**
     * Réinitialiser la playlist
     *
     * @method reset
     */
    reset: function() {
      this.tracksIds = [];
      this.selectedTracks = [];
    }
  }
});
