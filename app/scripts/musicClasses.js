/**
* Classe définissant un morceau de musique.
*/
function Track(title, artist, cover, key, mode, tempo, camelotTag, harmonies) {
    this.title = title;
    this.artist = artist;
    this.cover = cover;
    this.key = key;
    this.mode = mode;
    this.tempo = tempo;
    this.camelotTag = camelotTag;
    this.harmonies = harmonies;
}

Track.prototype = {
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
* Classe définissant une harmonie musicale.
*/
function Harmony(track, tempoVariation, isActive) {
    this.isActive = isActive,
    this.tempoVariation = tempoVariation,
    this.tempoMin = function() {
        return Math.round(track.getTempo() - (track.getTempo() * this.tempoVariation));
    },
    this.tempoMax = function() {
        return Math.round(track.getTempo() + (track.getTempo() * this.tempoVariation));
    }
}

Harmony.prototype.getTempoVariation = function() {
    return this.tempoVariation;
}
