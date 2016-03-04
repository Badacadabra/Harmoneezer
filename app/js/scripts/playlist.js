var playlist = new Vue({
  el: "body",
  data: {
    selectedTracks: [
      {
        title: "Far Beyond The Sun",
        artist: "Yngwie Malmsteen",
        cover: "images/foreground/cd.png",
        key: "fa",
        mode: "mineur",
        tempo: 125,
        camelotTag: "4A",
        harmonies: ["4A, 3A, 5A, 4B"]
      },
      {
        title: "Far Beyond The Sun",
        artist: "Yngwie Malmsteen",
        cover: "images/foreground/cd.png",
        key: "fa",
        mode: "mineur",
        tempo: 125,
        camelotTag: "4A",
        harmonies: ["4A, 3A, 5A, 4B"]
      },
      {
        title: "Far Beyond The Sun",
        artist: "Yngwie Malmsteen",
        cover: "images/foreground/cd.png",
        key: "fa",
        mode: "mineur",
        tempo: 125,
        camelotTag: "4A",
        harmonies: ["4A, 3A, 5A, 4B"]
      },
    ],
  },
  methods: {
    addTrackToPlaylist: function(track) {
      this.selectedTracks.push(track);
    },
    removeTrackFromPlaylist: function(i) {
      this.selectedTracks.splice(i, 1);
    },
    test: function() {
      console.log("Toto");
    }
  }
});
