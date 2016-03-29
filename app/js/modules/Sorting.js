var Music = require('./Music.js');

/**
 * Classe mettant en œuvre le pattern Strategy.
 * Cette classe fournit un moyen d'encapsuler une série d'algorithmes de tri.
 *
 * @module Sorting
 */
module.exports = Sorting = {
  /**
   * Attribut indiquant si les doublons sont autorisés dans les suggestions
   *
   * @property duplicatesAllowed
   * @type {Boolean}
   * @default false
   */
  duplicatesAllowed: false,
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
     * @default null
     */
    this._algorithm = null;
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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      var nbPerfectMatches = 0; // Correspondances en tempo et en tonalité

      for (var i = 0, len = similarTracks.length; i < len; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var info = Sorting.utils.getTrackInfo(harmony, similarTracks[i]);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax && info.isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            Sorting.utils.rearrange(similarTracks, i, 0, similarTracks[i]);
          // Si un morceau remplit une condition (tempo ou tonalité) du mix harmonique...
        } else if ((info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax) || info.isMatching) {
            // ... on le met juste après les morceaux les plus pertinents
            Sorting.utils.rearrange(similarTracks, i, nbPerfectMatches, similarTracks[i]);
        }

      }

      // Si les doublons ne sont pas autorisés, on filtre
      return Sorting.utils.duplicateFilter(similarTracks);

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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondances en tempo et en tonalité
          nbTempoMatches = 0; // Correspondances en tempo

      for (var i = 0, len = similarTracks.length; i < len; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var info = Sorting.utils.getTrackInfo(harmony, similarTracks[i]);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax && info.isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            Sorting.utils.rearrange(similarTracks, i, 0, similarTracks[i]);
          // Si un morceau est compatible en tempo...
        } else if (info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax) {
            nbTempoMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            Sorting.utils.rearrange(similarTracks, i, nbPerfectMatches, similarTracks[i]);
          // Si un morceau est compatible en tonalité...
        } else if (info.isMatching) {
            // ... on le met juste après les morceaux compatibles en tempo
            Sorting.utils.rearrange(similarTracks, i, nbPerfectMatches + nbTempoMatches, similarTracks[i]);
        }

      }

      // Si les doublons ne sont pas autorisés, on filtre
      return Sorting.utils.duplicateFilter(similarTracks);

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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      var nbPerfectMatches = 0, // Correspondances en tempo et en tonalité
          nbKeyMatches = 0; // Correspondances en tonalité

      for (var i = 0, len = similarTracks.length; i < len; i++) {

        // Pour chaque morceau, on récupère toutes les infos indispensables
        var info = Sorting.utils.getTrackInfo(harmony, similarTracks[i]);

        // Si un morceau remplit toutes les conditions du mix harmonique...
        if (info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax && info.isMatching) {
            nbPerfectMatches++;
            // ... on le met en début de tableau
            Sorting.utils.rearrange(similarTracks, i, 0, similarTracks[i]);
          // Si un morceau est compatible en tonalité...
        } else if (info.isMatching) {
            nbKeyMatches++;
            // ... on le met juste après les morceaux les plus pertinents
            Sorting.utils.rearrange(similarTracks, i, nbPerfectMatches, similarTracks[i]);
          // Si un morceau est compatible en tempo...
        } else if (info.currentTempo >= info.tempoMin && info.currentTempo <= info.tempoMax) {
            // ... on le met juste après les morceaux compatibles en tonalité
            Sorting.utils.rearrange(similarTracks, i, nbPerfectMatches + nbKeyMatches, similarTracks[i]);
        }

      }

      // Si les doublons ne sont pas autorisés, on filtre
      return Sorting.utils.duplicateFilter(similarTracks);

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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      return Sorting.utils.duplicateFilter(_.sortBy(similarTracks, '_tempo'));
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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      similarTracks = _.sortBy(similarTracks, '_tempo');
      return Sorting.utils.duplicateFilter(similarTracks.reverse());
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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      return Sorting.utils.duplicateFilter(similarTracks);
    };
  },
  /**
   * Mini-classe regroupant les méthodes utilitaires pour le tri
   *
   * @class Sorting.utils
   */
  utils: {
    /**
     * Retourne quelques informations importantes sur un morceau
     *
     * @method getTrackInfo
     * @param {Object} harmony Harmonie de référence
     * @param {Object} track Morceau courant
     * @return {Object} Informations sur le morceau
     */
    getTrackInfo: function(harmony, track) {
      return {
        currentTempo: track.getTempo(),
        tempoMin: harmony.tempoMin(),
        tempoMax: harmony.tempoMax(),
        isMatching: ($.inArray(track.getCamelotTag(), harmony.getRefTrack().getHarmonies()) != -1)
      };
    },
    /**
     * Filtre le tri initial en fonction du statut des doublons (autorisés ou non)
     *
     * @method duplicateFilter
     * @param {Array} similarTracks Tableau de morceaux à filtrer
     * @return {Array} Tableau de morceaux filtré
     */
    duplicateFilter: function(similarTracks) {
      var tracks = [],
          artists = [];

      if (!Sorting.duplicatesAllowed) {
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
    },
    /**
     * Réagencement des morceaux dans un tableau
     *
     * @method rearrange
     * @param {Object} similarTracks Morceaux similaires
     * @param {Number} removeIndex Index du morceau à bouger
     * @param {Number} insertIndex Index où insérer le morceau
     * @return {Object} Morceau courant
     */
    rearrange: function(similarTracks, removeIndex, insertIndex, track) {
      similarTracks.splice(removeIndex, 1);
      similarTracks.splice(insertIndex, 0, track);
    }
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
  sort: function(harmony, similarTracks) {
    return this._algorithm.sort(harmony, similarTracks);
  }
};
