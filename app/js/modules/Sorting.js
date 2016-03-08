module.exports = Sorting = {
  Strategy: function() {
    this._algorithm = null;
  },
  Default: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0; // Correspondance en tempo et en tonalité

      for (var i = 0; i < similarTracks.length; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var currentTempo = similarTracks[i].getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(similarTracks[i].getCamelotTag(), refTrack.getHarmonies()) != -1),
            item = similarTracks[i];

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            similarTracks.splice(i, 1);
            similarTracks.splice(0, 0, item);
          // Si un morceau remplit une condition (tempo ou tonalité) du mix harmonique...
        } else if ((currentTempo >= tempoMin && currentTempo <= tempoMax) || isMatching) {
            // ... on le met juste après les morceaux les plus pertinents
            similarTracks.splice(i, 1);
            similarTracks.splice(nbPerfectMatches, 0, item);
        }

      }
      return similarTracks;
    }
  },
  TempoFirst: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondance en tempo et en tonalité
          nbTempoMatches = 0;

      for (var i = 0; i < similarTracks.length; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var currentTempo = similarTracks[i].getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(similarTracks[i].getCamelotTag(), refTrack.getHarmonies()) != -1),
            item = similarTracks[i];

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            similarTracks.splice(i, 1);
            similarTracks.splice(0, 0, item);
          // Si un morceau est compatible en tempo...
        } else if (currentTempo >= tempoMin && currentTempo <= tempoMax) {
            nbTempoMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            similarTracks.splice(i, 1);
            similarTracks.splice(nbPerfectMatches, 0, item);
          // Si un morceau est compatible en tonalité...
        } else if (isMatching) {
            // ... on le met juste après les morceaux compatibles en tempo
            similarTracks.splice(i, 1);
            similarTracks.splice(nbPerfectMatches + nbTempoMatches, 0, item);
        }

      }
      return similarTracks;
    }
  },
  KeyFirst: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondance en tempo et en tonalité
          nbKeyMatches = 0;

      for (var i = 0; i < similarTracks.length; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var currentTempo = similarTracks[i].getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(similarTracks[i].getCamelotTag(), refTrack.getHarmonies()) != -1),
            item = similarTracks[i];

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            similarTracks.splice(i, 1);
            similarTracks.splice(0, 0, item);
          // Si un morceau est compatible en tonalité...
        } else if (isMatching) {
            nbKeyMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            similarTracks.splice(i, 1);
            similarTracks.splice(nbPerfectMatches, 0, item);
          // Si un morceau est compatible en tempo...
        } else if (currentTempo >= tempoMin && currentTempo <= tempoMax) {
            // ... on le met juste après les morceaux compatibles en tonalité
            similarTracks.splice(i, 1);
            similarTracks.splice(nbPerfectMatches + nbKeyMatches, 0, item);
        }

      }
      return similarTracks;
    }
  },
  AscendingTempo: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      return _.sortBy(similarTracks, '_tempo');
    }
  },
  DescendingTempo: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      similarTracks = _.sortBy(similarTracks, '_tempo');
      return similarTracks.reverse();
    }
  },
  None: function() {
    this.sort = function(refTrack, harmony, similarTracks) {
      return similarTracks;
    }
  }
}

Sorting.Strategy.prototype = {
  getAlgorithm: function() {
    return this._algorithm;
  },
  setAlgorithm: function(algorithm) {
    this._algorithm = algorithm;
  },
  sort: function(refTrack, harmony, similarTracks) {
    return this._algorithm.sort(refTrack, harmony, similarTracks);
  }
}
