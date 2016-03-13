var playlist = new Vue({
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
    },
    test: function() {
      console.log("Tata");
    }
  }
});
