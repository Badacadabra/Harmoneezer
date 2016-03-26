/**
 * Module fournissant des entités relatives à la musique.
 *
 * @module Music
 */
module.exports = Music = {
  /**
   * Classe définissant un morceau de musique.
   *
   * @class Track
   * @constructor
   * @param {Number} id Identifiant Deezer
   * @param {String} title Titre
   * @param {String} artist Artiste
   * @param {String} album Nom de l'album
   * @param {String} date Date de sortie de l'album
   * @param {String} cover Pochette d'album
   * @param {String} key Tonalité
   * @param {String} mode Mode (majeur ou mineur)
   * @param {Number} tempo Tempo (en BPM)
   * @param {String} camelotTag Tag du morceau sur la roue de Camelot
   * @param {Array} harmonies Tags compatibles sur la roue de Camelot
   */
  Track: function(id, title, artist, album, date, cover, key, mode, tempo, camelotTag, harmonies) {

    if (!(this instanceof Music.Track)) {
      throw new Error("Erreur ! La classe Track doit être instanciée avec l'opérateur « new »");
    }

    /**
     * Identifiant du morceau sur Deezer
     *
     * @property _id
     * @type {Number}
     * @default 0
     */
    this._id = id;
    /**
     * Titre du morceau
     *
     * @property _title
     * @type {String}
     * @default ""
     */
    this._title = title;
    /**
     * Artiste à l'origine du morceau
     *
     * @property _artist
     * @type {String}
     * @default ""
     */
    this._artist = artist;
    /**
     * Nom de l'album
     *
     * @property _album
     * @type {String}
     * @default ""
     */
    this._album = album;
    /**
     * Date de sortie de l'album
     *
     * @property _date
     * @type {String}
     * @default ""
     */
    this._date = date;
    /**
     * Pochette d'album
     *
     * @property _cover
     * @type {String}
     * @default ""
     */
    this._cover = cover;
    /**
     * Tonalité du morceau
     *
     * @property _key
     * @type {String}
     * @default ""
     */
    this._key = key;
    /**
     * Mode du morceau (majeur ou mineur)
     *
     * @property _mode
     * @type {String}
     * @default ""
     */
    this._mode = mode;
    /**
     * Tempo du morceau (en BPM)
     *
     * @property _tempo
     * @type {Number}
     * @default 0
     */
    this._tempo = tempo;
    /**
     * Tag du morceau sur la roue de Camelot
     *
     * @property _camelotTag
     * @type {String}
     * @default ""
     */
    this._camelotTag = camelotTag;
    /**
     * Tags compatibles sur la roue de Camelot
     *
     * @property _harmonies
     * @type {Array}
     * @default []
     */
    this._harmonies = harmonies;

  },
  /**
   * Classe définissant une harmonie musicale.
   *
   * @class Harmony
   * @constructor
   * @param {Object} refTrack Morceau de référence
   * @param {Object} otherTrack Autre morceau, pour la comparaison
   * @param {Number} tempoVariation Variation du tempo
   */
  Harmony: function(refTrack, otherTrack, tempoVariation) {

    if (!(this instanceof Music.Harmony)) {
      throw new Error("Erreur ! La classe Harmony doit être instanciée avec l'opérateur « new »");
    }

    /**
     * Morceau de référence
     *
     * @property _refTrack
     * @type {Object}
     * @default {}
     */
    this._refTrack = refTrack,
    /**
     * Autre morceau, pour la comparaison
     *
     * @property _otherTrack
     * @type {Object}
     * @default {}
     */
    this._otherTrack = otherTrack,
    /**
     * Variation du tempo par rapport à un morceau de référence
     *
     * @property _tempoVariation
     * @type {Number}
     * @default 0
     */
    this._tempoVariation = tempoVariation,
    /**
     * Méthode calculant le tempo minimal au regard de la variation autorisée
     *
     * @method tempoMin
     * @return {Number} Le tempo minimal
     */
    this.tempoMin = function() {
        return Math.round(this._refTrack.getTempo() - (this._refTrack.getTempo() * this._tempoVariation));
    },
    /**
     * Méthode calculant le tempo maximal au regard de la variation autorisée
     *
     * @method tempoMax
     * @return {Number} Le tempo maximal
     */
    this.tempoMax = function() {
        return Math.round(this._refTrack.getTempo() + (this._refTrack.getTempo() * this._tempoVariation));
    },
    /**
     * Méthode déterminant la compatibilité en tempo entre les deux morceaux comparés
     *
     * @method tempoCompatibility
     * @return {Boolean} Vrai en cas de compatibilité, faux sinon
     */
    this.tempoCompatibility = function() {
        return (this._otherTrack.getTempo() >= this.tempoMin() && this._otherTrack.getTempo() <= this.tempoMax());
    },
    /**
     * Méthode déterminant la compatibilité en tonalité entre les deux morceaux comparés
     *
     * @method keyCompatibility
     * @return {Boolean} Vrai en cas de compatibilité, faux sinon
     */
    this.keyCompatibility = function() {
        return ($.inArray(this._otherTrack.getCamelotTag(), this._refTrack.getHarmonies()) != -1);
    };

  }

};

/**
 * Prototype de Track
 */
Music.Track.prototype = {
  /**
   * Accesseur pour l'identifiant du morceau
   *
   * @method getId
   * @return {Number} L'id du morceau
   */
   getId: function() { return this._id; },
  /**
   * Accesseur pour le titre du morceau
   *
   * @method getTitle
   * @return {String} Le titre du morceau
   */
   getTitle: function() { return this._title; },
  /**
   * Mutateur pour le titre du morceau
   *
   * @method setTitle
   * @param {String} Le nouveau titre du morceau
   */
   setTitle: function(title) { this._title = title; },
  /**
   * Accesseur pour l'artiste à l'origine du morceau
   *
   * @method getArtist
   * @return {String} L'artiste à l'origine du morceau
   */
   getArtist: function() { return this._artist; },
  /**
   * Mutateur pour l'artiste à l'origine du morceau
   *
   * @method setArtist
   * @param {String} Le nouvel artiste du morceau
   */
  setArtist: function(artist) { this._artist = artist; },
  /**
   * Accesseur pour le nom de l'album
   *
   * @method getAlbum
   * @return {String} Le nom de l'album
   */
  getAlbum: function() { return this._album; },
  /**
   * Mutateur pour le nom de l'album
   *
   * @method setAlbum
   * @param {String} Le nouveau nom de l'album
   */
  setAlbum: function(album) { this._album = album; },
  /**
   * Accesseur pour la date de sortie de l'album
   *
   * @method getDate
   * @return {String} La date de sortie de l'album
   */
  getDate: function() { return this._date; },
  /**
   * Mutateur pour la date de sortie de l'album
   *
   * @method setDate
   * @param {String} La nouvelle date de sortie de l'album
   */
  setDate: function(date) { this._date = date; },
  /**
   * Accesseur pour la pochette d'album
   *
   * @method getCover
   * @return {String} La pochette d'album
   */
  getCover: function() { return this._cover; },
  /**
   * Mutateur pour la pochette d'album
   *
   * @method setCover
   * @param {String} La nouvelle pochette d'album
   */
  setCover: function(cover) { this._cover = cover; },
  /**
   * Accesseur pour la tonalité du morceau
   *
   * @method getKey
   * @return {String} La tonalité du morceau
   */
  getKey: function() { return this._key; },
  /**
   * Mutateur pour la tonalité du morceau
   *
   * @method setKey
   * @param {String} La nouvelle tonalité du morceau
   */
  setKey: function(key) { this._key = key; },
  /**
   * Accesseur pour le mode du morceau (majeur ou mineur)
   *
   * @method getMode
   * @return {String} Le mode du morceau (majeur ou mineur)
   */
  getMode: function() { return this._mode; },
  /**
   * Mutateur pour la mode du morceau
   *
   * @method setMode
   * @param {String} Le nouveau mode du morceau (majeur ou mineur)
   */
  setMode: function(mode) { this._mode = mode; },
  /**
   * Accesseur pour le tempo du morceau (en BPM)
   *
   * @method getTempo
   * @return {Number} Le tempo du morceau
   */
  getTempo: function() { return this._tempo; },
  /**
   * Mutateur pour le tempo du morceau
   *
   * @method setTempo
   * @param {Number} Le nouveau tempo du morceau
   */
  setTempo: function(tempo) { this._tempo = tempo; },
  /**
   * Accesseur pour le tag du morceau sur la roue de Camelot
   *
   * @method getCamelotTag
   * @return {String} Le tag du morceau sur la roue de Camelot
   */
  getCamelotTag: function() { return this._camelotTag; },
  /**
   * Mutateur pour le tag du morceau sur la roue de Camelot
   *
   * @method setCamelotTag
   * @param {Number} Le nouveau tag du morceau sur la roue de Camelot
   */
  setCamelotTag: function(camelotTag) { this._camelotTag = camelotTag; },
  /**
   * Accesseur pour les tags compatibles sur la roue de Camelot
   *
   * @method getHarmonies
   * @return {Array} Les tags compatibles sur la roue de Camelot
   */
  getHarmonies: function() { return this._harmonies; },
  /**
   * Mutateur pour les tags compatibles sur la roue de Camelot
   *
   * @method setHarmonies
   * @param {Array} Les nouveaux tags compatibles sur la roue de Camelot
   */
  setHarmonies: function(harmonies) { this._harmonies = harmonies; },
};

/**
 * Prototype de Harmony
 */
Music.Harmony.prototype = {
  /**
   * Accesseur pour le morceau de référence
   *
   * @method getRefTrack
   * @return {Object} Le morceau de référence
   */
  getRefTrack: function() { return this._refTrack; },
  /**
   * Mutateur pour le morceau de référence
   *
   * @method setRefTrack
   * @param {Object} Le nouveau morceau de référence
   */
  setRefTrack: function(refTrack) { this._refTrack = refTrack; },
  /**
   * Accesseur pour l'autre morceau, utilisé à titre de comparaison
   *
   * @method getOtherTrack
   * @return {Object} Le morceau à comparer avec le morceau de référence
   */
  getOtherTrack: function() { return this._otherTrack; },
  /**
   * Mutateur pour l'autre morceau, utilisé à titre de comparaison
   *
   * @method setOtherTrack
   * @param {Object} Le nouveau morceau à comparer avec le morceau de référence
   */
  setOtherTrack: function(otherTrack) { this._otherTrack = otherTrack; },
  /**
   * Accesseur pour la variation du tempo
   *
   * @method getTempoVariation
   * @return {Number} La variation du tempo
   */
  getTempoVariation: function() { return this._tempoVariation; },
  /**
   * Mutateur pour la variation du tempo
   *
   * @method setTempoVariation
   * @param {Number} La nouvelle variation du tempo
   */
   setTempoVariation: function(tempoVariation) { this._tempoVariation = tempoVariation; }
};
