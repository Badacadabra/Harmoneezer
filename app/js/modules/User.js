/**
 * Module fournissant une classe pour la gestion simplifiée des utilisateurs
 *
 * @module User
 * @class User
 * @constructor
 * @param {Number} id Identifiant
 * @param {String} name Pseudo
 * @param {String} inscriptionDate Date d'inscription
 * @param {String} link Lien vers le profil
 * @param {String} picture Lien vers l'avatar
 */
module.exports = User = function(id, name, inscriptionDate, link, picture) {

  if (!(this instanceof User)) {
    throw new Error("Erreur ! La classe User doit être instanciée avec l'opérateur « new »");
  }

  /**
   * Identifiant
   *
   * @property id
   * @type {Number}
   * @default 0
   */
  this._id = id;
  /**
   * Pseudo
   *
   * @property name
   * @type {String}
   * @default ""
   */
  this._name = name;
  /**
   * Date d'inscription
   *
   * @property inscriptionDate
   * @type {String}
   * @default ""
   */
  this._inscriptionDate = inscriptionDate;
  /**
   * Lien vers le profil
   *
   * @property link
   * @type {String}
   * @default ""
   */
  this._link = link;
  /**
   * Lien vers l'avatar
   *
   * @property picture
   * @type {String}
   * @default ""
   */
  this._picture = picture;

};

/**
 * Prototype de User
 */
User.prototype = {
  /**
   * Accesseur pour l'identifiant de l'utilisateur
   *
   * @method getId
   * @return {Number} L'id de l'utilisateur
   */
  getId: function() { return this._id; },
  /**
   * Accesseur pour le pseudo de l'utilisateur
   *
   * @method getName
   * @return {String} Le pseudo de l'utilisateur
   */
  getName: function() { return this._name; },
  /**
   * Accesseur pour la date d'inscription de l'utilisateur
   *
   * @method getInscriptionDate
   * @return {String} La date d'inscription de l'utilisateur
   */
  getInscriptionDate: function() {
    var date = new Date(this._inscriptionDate),
        d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();
    return d + "/" + m + "/" + y;
  },
  /**
   * Accesseur pour le lien vers le profil de l'utilisateur
   *
   * @method getLink
   * @return {String} Le lien vers le profil de l'utilisateur
   */
  getLink: function() { return this._link; },
  /**
   * Accesseur pour l'avatar de l'utilisateur
   *
   * @method getPicture
   * @return {String} L'avatar de l'utilisateur
   */
  getPicture: function() { return this._picture; }
};
