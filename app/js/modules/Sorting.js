/**
 * Classe mettant en œuvre le pattern Strategy.
 * Cette classe fournit un moyen d'encapsuler une série d'algorithmes de tri.
 *
 * @module Sorting
 */
module.exports = Sorting = {
  /**
   * Classe générique représentant la stratégie de tri
   *
   * @class Strategy
   * @constructor
   */
  Strategy: function() {
    /**
     * Algorithme de tri courant
     *
     * @property algorithm
     * @type {Object}
     * @default undefined
     */
    this._algorithm;
  },
  /**
   * Classe encapsulant l'algorithme de tri par défaut.
   * Ici les morceaux compatibles en tempo et en tonalité apparaissent en priorité.
   * Apparaissent ensuite les morceaux compatibles en tempo ou (XOR) en tonalité.
   * Apparaissent enfin les morceaux non compatibles.
   *
   * @class Default
   * @constructor
   */
  Default: function() {
    /**
     * Méthode de tri par défaut
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondances en tempo et en tonalité
          artists = [], // Tous les artistes rencontrés dans les résultats
          tracks = [], // Les morceaux à renvoyer à l'issue du tri
          rearrange = function(removeIndex, insertIndex, track) {
            similarTracks.splice(removeIndex, 1);
            similarTracks.splice(insertIndex, 0, track);
          };

      for (var i = 0, len = similarTracks.length; i < len; i++) {
        // Pour chaque morceau, on récupère toutes les infos indispensables
        var track = similarTracks[i],
            artist = track.getArtist(),
            tempo = track.getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(track.getCamelotTag(), refTrack.getHarmonies()) != -1);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (tempo >= tempoMin && tempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            rearrange(i, 0, track);
          // Si un morceau remplit une condition (tempo ou tonalité) du mix harmonique...
        } else if ((tempo >= tempoMin && tempo <= tempoMax) || isMatching) {
            // ... on le met juste après les morceaux les plus pertinents
            rearrange(i, nbPerfectMatches, track);
        }
      }

      // Si les doublons ne sont pas autorisés, on filtre
      if (!GUI.duplicatesAllowed) {
        for (var i = 0, len = similarTracks.length; i < len; i++) {

          var track = similarTracks[i],
              artist = track.getArtist();

          // Si l'artiste n'a pas été rencontré dans les suggestions précédentes...
          if ($.inArray(artist, artists) == -1) {
            artists.push(artist);
            tracks.push(track);
          }
        }
      } else {
        tracks = similarTracks;
      }

      return tracks;
    };
  },
  /**
   * Classe encapsulant l'algorithme de tri valorisant le tempo.
   * Ici les morceaux compatibles en tempo et en tonalité apparaissent en priorité.
   * Apparaissent ensuite les morceaux compatibles en tempo, suivis des morceaux compatibles en tonalité.
   * Apparaissent enfin les morceaux non compatibles.
   *
   * @class TempoFirst
   * @constructor
   */
  TempoFirst: function() {
    /**
     * Méthode de tri valorisant le tempo
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondances en tempo et en tonalité
          nbTempoMatches = 0, // Correspondances en tempo
          artists = [], // Tous les artistes rencontrés dans les résultats
          tracks = [], // Les morceaux à renvoyer à l'issue du tri
          rearrange = function(removeIndex, insertIndex, track) {
            similarTracks.splice(removeIndex, 1);
            similarTracks.splice(insertIndex, 0, track);
          };

      for (var i = 0, len = similarTracks.length; i < len; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var track = similarTracks[i],
            currentTempo = track.getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(track.getCamelotTag(), refTrack.getHarmonies()) != -1);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            rearrange(i, 0, track);
          // Si un morceau est compatible en tempo...
        } else if (currentTempo >= tempoMin && currentTempo <= tempoMax) {
            nbTempoMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            rearrange(i, nbPerfectMatches, track);
          // Si un morceau est compatible en tonalité...
        } else if (isMatching) {
            // ... on le met juste après les morceaux compatibles en tempo
            rearrange(i, nbPerfectMatches + nbTempoMatches, track);
        }

      }

      // Si les doublons ne sont pas autorisés, on filtre
      if (!GUI.duplicatesAllowed) {
        for (var i = 0, len = similarTracks.length; i < len; i++) {

          var track = similarTracks[i],
              artist = track.getArtist();

          // Si l'artiste n'a pas été rencontré dans les suggestions précédentes...
          if ($.inArray(artist, artists) == -1) {
            artists.push(artist);
            tracks.push(track);
          }
        }
      } else {
        tracks = similarTracks;
      }

      return tracks;
    };
  },
  /**
   * Classe encapsulant l'algorithme de tri valorisant la tonalité.
   * Ici les morceaux compatibles en tempo et en tonalité apparaissent en priorité.
   * Apparaissent ensuite les morceaux compatibles en tonalité, suivis des morceaux compatibles en tempo.
   * Apparaissent enfin les morceaux non compatibles.
   *
   * @class KeyFirst
   * @constructor
   */
  KeyFirst: function() {
    /**
     * Méthode de tri valorisant la tonalité
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondances en tempo et en tonalité
          nbKeyMatches = 0, // Correspondances en tonalité
          artists = [], // Tous les artistes rencontrés dans les résultats
          tracks = [], // Les morceaux à renvoyer à l'issue du tri
          rearrange = function(removeIndex, insertIndex, track) {
            similarTracks.splice(removeIndex, 1);
            similarTracks.splice(insertIndex, 0, track);
          };

      for (var i = 0, len = similarTracks.length; i < len; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var track = similarTracks[i],
            currentTempo = track.getTempo(),
            tempoMin = harmony.tempoMin(),
            tempoMax = harmony.tempoMax(),
            isMatching = ($.inArray(track.getCamelotTag(), refTrack.getHarmonies()) != -1);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            rearrange(i, 0, track);
          // Si un morceau est compatible en tonalité...
        } else if (isMatching) {
            nbKeyMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            rearrange(i, nbPerfectMatches, track);
          // Si un morceau est compatible en tempo...
        } else if (currentTempo >= tempoMin && currentTempo <= tempoMax) {
            // ... on le met juste après les morceaux compatibles en tonalité
            rearrange(i, nbPerfectMatches + nbKeyMatches, track);
        }

      }

      // Si les doublons ne sont pas autorisés, on filtre
      if (!GUI.duplicatesAllowed) {
        for (var i = 0, len = similarTracks.length; i < len; i++) {

          var track = similarTracks[i],
              artist = track.getArtist();

          // Si l'artiste n'a pas été rencontré dans les suggestions précédentes...
          if ($.inArray(artist, artists) == -1) {
            artists.push(artist);
            tracks.push(track);
          }
        }
      } else {
        tracks = similarTracks;
      }

      return tracks;
    };
  },
  /**
   * Classe encapsulant l'algorithme de tri croissant, en fonction du tempo.
   * Ici les morceaux, compatibles ou non, sont rangés du BPM le plus lent au BPM le plus rapide.
   *
   * @class AscendingTempo
   * @constructor
   */
  AscendingTempo: function() {
    /**
     * Méthode de tri croissant, en fonction du tempo
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      return _.sortBy(similarTracks, '_tempo');
    };
  },
  /**
   * Classe encapsulant l'algorithme de tri décroissant, en fonction du tempo.
   * Ici les morceaux, compatibles ou non, sont rangés du BPM le plus rapide au BPM le plus lent.
   *
   * @class DescendingTempo
   * @constructor
   */
  DescendingTempo: function() {
    /**
     * Méthode de tri décroissant, en fonction du tempo
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      similarTracks = _.sortBy(similarTracks, '_tempo');
      return similarTracks.reverse();
    };
  },
  /**
   * Classe définissant un algorithme fictif n'effectuant aucun tri.
   * Cette classe n'existe que pour des raisons sémantiques.
   *
   * @class None
   * @constructor
   */
  None: function() {
    /**
     * Méthode n'appliquant aucun tri
     *
     * @method sort
     * @param {Object} refTrack Morceau de référence
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(refTrack, harmony, similarTracks) {
      return similarTracks;
    };
  }
};

/**
 * Prototype de la classe Strategy
 */
Sorting.Strategy.prototype = {
  /**
   * Accesseur pour l'algorithme courant de la stratégie de tri
   *
   * @method getAlgorithm
   * @return {Object} L'algorithme courant de la stratégie de tri
   */
  getAlgorithm: function() {
    return this._algorithm;
  },
  /**
   * Mutateur pour l'algorithme courant de la stratégie de tri
   *
   * @method getAlgorithm
   * @param {Object} algorithm Le nouvel algorithme courant de la stratégie de tri
   */
  setAlgorithm: function(algorithm) {
    this._algorithm = algorithm;
  },
  /**
   * Méthode abstraite de tri.
   * Cette dernière se contente de déléguer le tri à une méthode concrète.
   *
   * @method sort
   * @param {Object} refTrack Morceau de référence
   * @param {Object} harmony Harmonie recherchée
   * @param {Array} similarTracks Morceaux similaires
   * @return {Array} Tableau de morceaux trié, selon l'algorithme courant
   */
  sort: function(refTrack, harmony, similarTracks) {
    return this._algorithm.sort(refTrack, harmony, similarTracks);
  }
};
