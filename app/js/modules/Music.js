module.exports = Music = {
  /**
  * Classe définissant un morceau de musique.
  */
  Track: function(title, artist, cover, key, mode, tempo, camelotTag, harmonies) {
    this.title = title;
    this.artist = artist;
    this.cover = cover;
    this.key = key;
    this.mode = mode;
    this.tempo = tempo;
    this.camelotTag = camelotTag;
    this.harmonies = harmonies;
  },
  /**
  * Classe définissant une harmonie musicale.
  */
  Harmony: function(track, tempoVariation, isActive) {
      this.isActive = isActive,
      this.tempoVariation = tempoVariation,
      this.tempoMin = function() {
          return Math.round(track.getTempo() - (track.getTempo() * this.tempoVariation));
      },
      this.tempoMax = function() {
          return Math.round(track.getTempo() + (track.getTempo() * this.tempoVariation));
      }
  }
}

/**
* Accesseurs et mutateurs d'un morceau
*/
Music.Track.prototype = {
    getTitle: function() {
      return this.title;
    },
    getArtist: function() {
      return this.artist;
    },
    getCover: function() {
      return this.cover;
    },
    getKey: function() {
      return this.key;
    },
    getMode: function() {
      return this.mode;
    },
    getTempo: function() {
      return this.tempo;
    },
    getCamelotTag: function() {
      return this.camelotTag;
    },
    getHarmonies: function() {
      return this.harmonies;
    }
}

/**
* Accesseur pour la variation du tempo de l'harmony
*/
Music.Harmony.prototype.getTempoVariation = function() {
    return this.tempoVariation;
}
