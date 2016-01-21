/**
* Classe définissant un morceau de musique.
*/
function Track(title, artist, key, mode, tempo, camelotTag, harmonies) {
    this.title = title;
    this.artist = artist;
    this.key = key;
    this.mode = mode;
    this.tempo = tempo;
    this.camelotTag = camelotTag;
    this.harmonies = harmonies;
}

Track.prototype.getTitle = function() {
    return this.title;
}

Track.prototype.getArtist = function() {
    return this.artist;
}

Track.prototype.getKey = function() {
    return this.key;
}

Track.prototype.getMode = function() {
    return this.mode;
}

Track.prototype.getTempo = function() {
    return this.tempo;
}

Track.prototype.getCamelotTag = function() {
    return this.camelotTag;
}

Track.prototype.getHarmonies = function() {
    return this.harmonies;
}


/**
* Classe définissant une harmonie musicale.
*/
function Harmony(track) {
    this.tempoVariation = 0.05,
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
