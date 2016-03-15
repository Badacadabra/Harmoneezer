/**
 * Module encapsulant le lecteur audio fourni par Deezer
 * Le module s'appuie sur le modèle MVVM de Vue.js.
 *
 * @module Playlist
 */
module.exports = Playlist = new Vue({
  el: "#app",
  data: {
    tracksIds: [],
    selectedTracks: []
  },
  methods: {
    addTrackToPlaylist: function(track) {
      this.tracksIds.push(track._id);
      this.selectedTracks.push(track);
    },
    removeTrackFromPlaylist: function(i) {
      this.tracksIds.splice(i, 1);
      this.selectedTracks.splice(i, 1);
    }
  }
});
