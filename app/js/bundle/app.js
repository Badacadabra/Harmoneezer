(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Module fournissant une architecture réutilisable pour gérer les requêtes Ajax
 *
 * @module Ajax
 */
module.exports = Ajax = {
  /**
   * Classe générique pour les requêtes Ajax
   *
   * @class Request
   * @constructor
   * @param {String} type Type de requête (GET ou POST)
   * @param {String} url URL de requête
   * @param {String} dataType Type de données renvoyées (JSON, XML, ...)
   * @param {Object} data Paramètres de requête
   */
  Request: function(type, url, dataType, data) {
    /**
     * Type de requête (GET ou POST)
     *
     * @property type
     * @type {String}
     * @default ""
     */
    this._type = type;
    /**
     * URL de requête
     *
     * @property url
     * @type {String}
     * @default ""
     */
    this._url = url;
    /**
     * Type de données renvoyées (JSON, XML, ...)
     *
     * @property dataType
     * @type {String}
     * @default ""
     */
    this._dataType = dataType;
    /**
     * Paramètres de requête
     *
     * @property data
     * @type {Object}
     * @default {}
     */
    this._data = data;
  },
  /**
   * Classe gérant les requêtes Ajax vers l'API de Deezer
   *
   * @class DeezerAPIRequest
   * @constructor
   * @extends Request
   * @param {String} path Chemin de la requête
   */
  DeezerAPIRequest: function(path) {
      Ajax.Request.call(this, "GET", "http://api.deezer.com" + path, "jsonp", { "output": "jsonp" });
  },
  /**
   * Classe gérant les requêtes Ajax vers l'API d'Echo Nest
   *
   * @class EchoNestAPIRequest
   * @constructor
   * @extends Request
   * @param {String} path Chemin de la requête
   */
  EchoNestAPIRequest: function(path) {
      Ajax.Request.call(this, "GET", "http://developer.echonest.com/api/v4" + path, "jsonp", {
                    "api_key": "VUSUA1HN4HMWUIN5P",
                    "format": "jsonp",
                    "bucket": "audio_summary"
                  });
  },
  /**
   * Classe construisant à la demande des requêtes Ajax d'un certain type
   *
   * @class RequestFactory
   * @constructor
   */
  RequestFactory: function() {
    /**
     * Méthode chargée d'instancier les classes gérant les requêtes Ajax
     *
     * @method getAjaxRequest
     * @param {String} api API à interroger
     * @param {String} path Chemin de la requête
     * @return {Object} Un objet de type Ajax
     */
      this.getAjaxRequest = function(api, path) {
          var ajaxRequest;
          if (api === "deezer") {
              ajaxRequest = new Ajax.DeezerAPIRequest(path);
          }
          if (api === "echonest") {
              ajaxRequest = new Ajax.EchoNestAPIRequest(path);
          }
          return ajaxRequest;
      };
  }
};

/**
 * Prototype de la classe mère : Ajax
 */
 Ajax.Request.prototype = {
   /**
    * Méthode permettant d'ajouter un paramètre à la requête
    *
    * @method addParam
    * @param {String} key Clé du paramètre
    * @param {String} value Valeur du paramètre
    */
   addParam: function(key, value) {
     this._data[key] = value;
   },
   /**
    * Méthode chargée d'envoyer les requêtes Ajax
    *
    * @method send
    * @param {Function} success Fonction à exécuter au succès de la requête
    * @param {Function} error Fonction à exécuter lors d'une erreur dans la requête
    */
   send: function(success, error) {
     $.ajax({
         type: this._type,
         url: this._url,
         dataType: this._dataType,
         data: this._data,
         success: function(response) {
             success(response);
         },
         error: function(response) {
             error(response);
         }
     });
   }
 };

/**
 * Clonage de prototype pour créer des classes filles
 */
Ajax.DeezerAPIRequest.prototype = Object.create(Ajax.Request.prototype);
Ajax.DeezerAPIRequest.prototype.constructor = Ajax.DeezerAPIRequest;

Ajax.EchoNestAPIRequest.prototype = Object.create(Ajax.Request.prototype);
Ajax.EchoNestAPIRequest.prototype.constructor = Ajax.EchoNestAPIRequest;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Ajax.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Playlist = require('./Playlist.js');

/**
 * Module gérant l'interface graphique
 *
 * @module GUI
 * @class GUI
 */
module.exports = GUI = {
  /**
   * Attribut indiquant si les notifications sont autorisées
   *
   * @property notifAllowed
   * @type {Boolean}
   * @default true
   */
  notifAllowed: true,
  /**
   * Attribut indiquant si les sons d'ambiance sont autorisés
   *
   * @property soundAllowed
   * @type {Boolean}
   * @default true
   */
  soundAllowed: true,
  /**
   * Attribut indiquant si les doublons sont autorisés dans la recherche
   *
   * @property duplicatesAllowed
   * @type {Boolean}
   * @default false
   */
  duplicatesAllowed: false,
  /**
   * Attribut indiquant la variation courante du tempo (entre 0 et 1)
   *
   * @property tempoVariation
   * @type {Number}
   * @default 0.05
   */
  tempoVariation: 0.05,
  /**
   * Attribut indiquant l'algorithme de tri sélectionné
   *
   * @property selectedSorting
   * @type {String}
   * @default "default"
   */
  selectedSorting: "default",
  /**
   * Attribut indiquant si les morceaux sont chargés dans le lecteur
   *
   * @property tracksLoaded
   * @type {Boolean}
   * @default false
   */
  tracksLoaded: false,
  /**
   * Attribut indiquant la position de la tête de lecture dans le morceau en cours
   * La valeur se situe entre 0 et 100.
   *
   * @property trackPosition
   * @type {Number}
   * @default 0
   */
  trackPosition: 0,
  /**
   * Méthode chargée d'initialiser l'interface graphique.
   * Cette méthode s'inspire du pattern Template dans sa conception.
   *
   * @method init
   */
  init: function() {
    /* $( "#main" ).vegas({
        transition: 'fade',
        slide: 0,
        slides: [
            { src: "./images/background/neutral.jpg" },
            { src: "./images/background/rock.jpg" },
            { src: "./images/background/electro.jpg" },
            { src: "./images/background/hiphop.jpg" },
            { src: "./images/background/folk.jpg" },
            { src: "./images/background/classical.jpg" },
            { src: "./images/background/jazz.jpg" },
            { src: "./images/background/metal.jpg" }
        ],
        animation: 'kenburns',
        walk: function (index, slideSettings) {
          // console.log("Slide index " + index + " image " + slideSettings.src);
          if (GUI.soundAllowed && index > 0) {
            var audio = new Audio( "./sounds/" + index + ".ogg");
            audio.play();
          }
        }
    });
    $( "#main" ).vegas('pause'); */

    GUI.carousel();
    GUI.drag();
    GUI.tooltips();
    GUI.scrollbar();
    GUI.css();
    GUI.checkboxes();
    GUI.listeners();
    GUI.playlist.retrieve();
  },
  /**
   * Initialisation du carousel contenant les résultats de recherche.
   * Le carousel est géré par le plugin OWL Carousel.
   *
   * @method carousel
   */
  carousel: function() {
    $( "#tracks" ).owlCarousel({
      items: 10,
      pagination: false,
      autoPlay: true,
      autoplayTimeout: 100,
      stopOnHover: true,
      lazyLoad : true
    });
  },
  /**
   * Initialisation du drag & drop sur l'iPod.
   * Le drag & drop est géré par jQuery UI.
   *
   * @method drag
   */
  drag: function() {
    $( "#ipod-wrapper" ).draggable({ scroll: false });
  },
  /**
   * Initialisation des tooltips.
   * Les tooltips sont gérées par Semantic UI et qTip².
   *
   * @method tooltips
   */
  tooltips: function() {
    $( "#options > span" ).popup(); // Semantic UI
    $( "[title != '']" ).qtip({ // qTip²
      style: {
          classes: 'qtip-dark'
      }
    });
  },
  /**
   * Initialisation des scrollbars.
   * Les scrollbars sont gérées par le plugin mCustomScrollbar.
   *
   * @method scrollbar
   */
  scrollbar: function() {
    $( "#playlist, #favorites" ).mCustomScrollbar({
      theme:"dark",
      scrollInertia: 0
    });
  },
  /**
   * Hack CSS
   *
   * @method css
   */
  css: function() {
    $( ".pusher" ).css("height", "100%");
  },
  /**
   * Initialisation des checkboxes.
   * Les checkboxes sont gérées par Semantic UI.
   *
   * @method checkboxes
   */
  checkboxes: function() {
      $( ".ui.checkbox" ).checkbox();
  },
  /**
   * Définition de tous les écouteurs d'événements
   *
   * @method listeners
   */
  listeners: function() {

    // Écouteurs d'événements des sidebars
    var menuEvents = [
                        [".toggle-menu", "click", GUI.menu.toggle],
                        ["#playlist-btn", "click", GUI.menu.togglePlaylist],
                        ["#favorites-btn", "click", GUI.menu.toggleFavorites],
                        ["#atmospheres-btn", "click", GUI.menu.toggleAtmospheres],
                        ["#harmonic-tracks-btn", "click", GUI.menu.toggleHarmonicTracks],
                        ["#user-btn", "click", GUI.menu.toggleUser],
                        [".toggle-all", "click", GUI.menu.toggleAll]
                      ];

    // Écouteurs d'événements de la playlist
    var playlistEvents = [
                            ["#random-btn", "click", GUI.playlist.notRandom, "async"],
                            ["#not-random-btn", "click", GUI.playlist.random, "async"],
                            ["#repeat-all-btn", "click", GUI.playlist.noRepeat, "async"],
                            ["#no-repeat-btn", "click", GUI.playlist.repeatOne, "async"],
                            ["#repeat-one-btn", "click", GUI.playlist.repeatAll, "async"],
                            ["#mute-btn", "click", GUI.playlist.mute, "async"],
                            ["#unmute-btn", "click", GUI.playlist.unmute, "async"],
                            ["#save-btn", "click", GUI.playlist.save],
                            ["#export-btn", "click", GUI.playlist.export],
                            ["#delete-btn", "click", GUI.playlist.delete],
                            [".previous-btn", "click", GUI.playlist.previous],
                            [".back-btn", "click", GUI.playlist.back],
                            [".play-btn", "click", GUI.playlist.play],
                            [".pause-btn", "click", GUI.playlist.pause],
                            [".forth-btn", "click", GUI.playlist.forth],
                            [".next-btn", "click", GUI.playlist.next],
                            [".harmonic-track", "click", GUI.playlist.addTrack, "async"]
                         ];

    // Écouteurs d'événements des favoris
    var favoritesEvents = [
                             ["#fav-ipod", "click", GUI.favorites.ipod],
                             ["#fav-notify", "click", GUI.favorites.notify],
                             ["#fav-sound", "click", GUI.favorites.sound],
                             ["#fav-duplicate", "click", GUI.favorites.duplicate],
                             ["#fav-tempo-range", "input", GUI.favorites.tempoRange],
                             ["#fav-default-sorting", "click", GUI.favorites.defaultSorting],
                             ["#fav-tempo-first-sorting", "click", GUI.favorites.tempoFirstSorting],
                             ["#fav-key-first-sorting", "click", GUI.favorites.keyFirstSorting],
                             ["#fav-asc-tempo-sorting", "click", GUI.favorites.ascTempoSorting],
                             ["#fav-desc-tempo-sorting", "click", GUI.favorites.descTempoSorting],
                             ["#fav-no-sorting", "click", GUI.favorites.noSorting]
                         ];

    // Écouteurs d'événements des ambiances
    var atmospheresEvents = [
                              ["#neutral-atmo", "click", GUI.atmospheres.neutral],
                              ["#rock-atmo", "click", GUI.atmospheres.rock],
                              ["#electro-atmo", "click", GUI.atmospheres.electro],
                              ["#hiphop-atmo", "click", GUI.atmospheres.hiphop],
                              ["#folk-atmo", "click", GUI.atmospheres.folk],
                              ["#classical-atmo", "click", GUI.atmospheres.classical],
                              ["#jazz-atmo", "click", GUI.atmospheres.jazz],
                              ["#metal-atmo", "click", GUI.atmospheres.metal]
                            ];

    // Écouteurs d'événements relatifs à l'utilisateur
    var userEvents = [
                        ["#login", "click", GUI.user.login],
                        ["#logout", "click", GUI.user.logout],
                      ];

    // Écouteurs d'événements divers
    var otherEvents = [
                        ["#logo", "click", GUI.misc.logo],
                        ["#tracks-help", "click", GUI.misc.help, "async"]
                      ];

    // Ajout des écouteurs d'événements
    addEvents(menuEvents);
    addEvents(playlistEvents);
    addEvents(favoritesEvents);
    addEvents(atmospheresEvents);
    addEvents(userEvents);
    addEvents(otherEvents);

    // Fonctions d'ajout d'événements
    function addEvents(e) {
      for (var i = 0; i < e.length; i++) {
        if (e[i][3] == "async") {
          $( document ).on( e[i][1], e[i][0], e[i][2]); // délégation
        } else {
          $( e[i][0] ).on( e[i][1], e[i][2] );
        }
      }
    }

  },
  /**
   * Méthode Facade permettant d'éviter l'abondance de conditions dans le code
   *
   * @method alert
   * @param {String} type Type d'alerte (succès, erreur, message)
   * @param {String} message Message d'alerte
   * @param {Number} timer Durée de vie de la notification
   */
  alert: function(type, message, timer) {
    if (GUI.notifAllowed) {
      switch (type) {
        case "success":
          return alertify.success(message, timer);
          break;
        case "error":
          return alertify.error(message, timer);
          break;
        case "message":
          return alertify.message(message, timer);
          break;
      }
    }
  },
  /**
   * Classe interne gérant les éléments relatifs au menu
   *
   * @class menu
   */
  menu: {
    /**
     * Afficher/Cacher le menu (sidebar)
     *
     * @method toggle
     */
    toggle: function() {
      $( "#menu" ).sidebar( "toggle" );
    },
    /**
     * Afficher/Cacher la playlist (sidebar)
     *
     * @method togglePlaylist
     */
    togglePlaylist: function() {
      GUI.menu.toggleSidebar( "#playlist", "blue" );
    },
    /**
     * Afficher/Cacher les favoris (sidebar)
     *
     * @method toggleFavorites
     */
    toggleFavorites: function() {
      GUI.menu.toggleSidebar( "#favorites", "red" );
    },
    /**
     * Afficher/Cacher les ambiances (sidebar)
     *
     * @method toggleAtmospheres
     */
    toggleAtmospheres: function() {
      GUI.menu.toggleSidebar( "#atmospheres", "green" );
    },
    /**
     * Afficher/Cacher les morceaux harmoniques (sidebar)
     *
     * @method toggleHarmonicTracks
     */
    toggleHarmonicTracks: function() {
      GUI.menu.toggleSidebar( "#harmonic-tracks", "violet" );
    },
    /**
     * Afficher/Cacher l'utilisateur (sidebar)
     *
     * @method toggleUser
     */
    toggleUser: function() {
      GUI.menu.toggleSidebar( "#user", "maroon" );
    },
    /**
     * Afficher/Cacher une sidebar
     *
     * @method toggleSidebar
     */
    toggleSidebar: function(id, color) {
      $( id )
        .sidebar({
          onShow: function() {
            $( id + "-btn" ).addClass( color + "-item" );
          },
          onHide: function() {
            $( id + "-btn" ).removeClass( color + "-item" );
          }
        })
        .sidebar( "setting", "transition", "overlay" )
        .sidebar( "toggle" );
    },
    /**
     * Afficher/Cacher toutes les sidebars
     *
     * @method toggleAll
     */
    toggleAll: function() {
      // On affiche le menu du bas
      GUI.menu.toggle();
      // On affiche toutes les autres sidebars
      var colors = ["blue", "red", "green", "violet", "maroon"];
      $( ".sidebar" ).not( "#menu" ).each(function(i, elt) {
        var id = $( elt ).attr( "id" );
        GUI.menu.toggleSidebar( "#" + id, colors[i]);
      });
    }
  },
  /**
   * Classe interne gérant les éléments relatifs à la playlist
   *
   * @class playlist
   */
  playlist: {
    /**
     * Récupération d'une playlist sauvegardée dans le local storage
     *
     * @method retrieve
     */
    retrieve: function() {
      var savedPlaylist = localStorage.getItem("playlist");
      if (savedPlaylist !== null) {
        Playlist.selectedTracks = JSON.parse(savedPlaylist);
      }
    },
    /**
     * Désactivation de la lecture aléatoire
     *
     * @method notRandom
     */
    notRandom: function() {
      DZ.player.setShuffle(false);
      $( "#random-btn .icon" ).switchClass( "random", "remove" );
      $( "#random-btn" ).attr( "id", "not-random-btn" );
      GUI.alert("error", "Lecture aléatoire désactivée", 5);
    },
    /**
     * Activation de la lecture aléatoire
     *
     * @method random
     */
    random: function() {
      DZ.player.setShuffle(true);
      $( "#not-random-btn .icon" ).switchClass( "remove", "random" );
      $( "#not-random-btn" ).attr( "id", "random-btn" );
      GUI.alert("success", "Lecture aléatoire activée", 5);
    },
    /**
     * Désactivation de la répétition
     *
     * @method noRepeat
     */
    noRepeat: function() {
      DZ.player.setRepeat(0);
      $( "#repeat-all-btn .icon" ).switchClass( "refresh", "remove" );
      $( "#repeat-all-btn" ).attr( "id", "no-repeatbtn" );
      GUI.alert("message", "Pas de répétition", 5);
    },
    /**
     * Activation de la répétition d'un morceau
     *
     * @method repeatOne
     */
    repeatOne: function() {
      DZ.player.setRepeat(2);
      $( "#no-repeat-btn .icon" ).switchClass( "remove", "repeat" );
      $( "#no-repeat-btn" ).attr( "id", "repeat-one-btn" );
      GUI.alert("message", "Répétition du morceau en cours", 5);
    },
    /**
     * Activation de la répétition de tous les morceaux
     *
     * @method repeatAll
     */
    repeatAll: function() {
      DZ.player.setRepeat(1);
      $( "#repeat-one-btn .icon" ).switchClass( "repeat", "refresh" );
      $( "#repeat-one-btn" ).attr( "id", "repeat-all-btn" );
      GUI.alert("message", "Répétition de tous les morceaux", 5);
    },
    /**
     * Activation du mode silencieux
     *
     * @method mute
     */
    mute: function() {
      DZ.player.setMute(true);
      $( "#mute-btn .icon" ).switchClass( "mute", "unmute" );
      $( "#mute-btn" ).attr( "id", "unmute-btn" );
      GUI.alert("error", "Son coupé !", 5);
    },
    /**
     * Désactivation du mode silencieux
     *
     * @method unmute
     */
    unmute: function() {
      DZ.player.setMute(false);
      $( "#unmute-btn .icon" ).switchClass( "unmute", "mute" );
      $( "#unmute-btn" ).attr( "id", "mute-btn" );
      GUI.alert("success", "Son rétabli !", 5);
    },
    /**
     * Sauvegarde de la playlist courante dans le local storage
     *
     * @method save
     */
    save: function() {
      var playlist = JSON.stringify(Playlist.selectedTracks);
      localStorage.setItem("playlist", playlist);
      GUI.alert("success", "Playlist sauvegardée !", 5);
    },
    /**
     * Export CSV de la playlist courante
     *
     * @method export
     */
    export: function() {
      $( "#csv-export" ).tableToCSV();
      GUI.alert("success", "Playlist exportée !", 5);
    },
    /**
     * Effacement de la playlist courante
     *
     * @method delete
     */
    delete: function() {
      Playlist.selectedTracks = [];
      localStorage.removeItem("playlist");
      GUI.alert("success", "Playlist effacée !", 5);
    },
    /**
     * Passage au morceau précédent
     *
     * @method previous
     */
    previous: function() {
      DZ.player.prev();
    },
    /**
     * Aller en arrière dans le morceau
     *
     * @method back
     */
    back: function() {
      if (GUI.trackPosition > 10) {
        GUI.trackPosition -= 10;
      }
      DZ.player.seek(GUI.trackPosition);
    },
    /**
     * Lire un morceau
     *
     * @method play
     */
    play: function() {
      if (GUI.tracksLoaded) {
        DZ.player.play();
      } else {
        DZ.player.playTracks(Playlist.tracksIds);
        GUI.tracksLoaded = true;
      }
    },
    /**
     * Mettre en pause un morceau
     *
     * @method pause
     */
    pause: function() {
      DZ.player.pause();
    },
    /**
     * Aller en avant dans le morceau
     *
     * @method back
     */
    forth: function() {
      if (GUI.trackPosition < 90) {
        GUI.trackPosition += 10;
      }
      DZ.player.seek(GUI.trackPosition);
    },
    /**
     * Passage au morceau suivant
     *
     * @method next
     */
    next: function() {
      DZ.player.next();
    },
    /**
     * Ajout d'un morceau à la playlist
     *
     * @method addTrack
     */
    addTrack: function() {
      var track = JSON.parse(decodeURIComponent($( this ).children().eq(1).val()));
      Playlist.addTrackToPlaylist(track);
      GUI.tracksLoaded = false;
      GUI.alert("success", "Morceau ajouté à votre playlist", 5);
    }
  },
  /**
   * Classe interne gérant les éléments relatifs aux favoris
   *
   * @class favorites
   */
  favorites: {
    /**
     * Gestion de la visibilité de l'iPod
     *
     * @method ipod
     */
    ipod: function() {
      var $ipod = $( "#ipod-wrapper" ),
          $ipodState = $( "#fav-ipod .state" );
      $ipod.is( ":visible" ) ? $ipod.fadeOut() : $ipod.fadeIn();
      GUI.favorites.changeState($ipodState, "iPod activé !", "iPod désactivé !");
    },
    /**
     * Gestion des notifications
     *
     * @method notify
     */
    notify: function() {
      var $notifState = $( "#fav-notify .state" );
      GUI.notifAllowed ? (GUI.notifAllowed = false) : (GUI.notifAllowed = true);
      GUI.favorites.changeState($notifState, "Notifications activées !", "Notifications désactivées !");
    },
    /**
     * Gestion des sons d'ambiance
     *
     * @method sound
     */
    sound: function() {
      var $soundState = $( "#fav-sound .state" );
      GUI.soundAllowed ? (GUI.soundAllowed = false) : (GUI.soundAllowed = true);
      GUI.favorites.changeState($soundState, "Sons d'ambiance activés !", "Sons d'ambiance désactivés !");
    },
    /**
     * Gestion des doublons
     *
     * @method duplicate
     */
    duplicate: function() {
      var $duplicateState = $( "#fav-duplicate .state" );
      GUI.duplicatesAllowed ? (GUI.duplicatesAllowed = false) : (GUI.duplicatesAllowed = true);
      GUI.favorites.changeState($duplicateState, "Doublons activés !", "Doublons désactivés !");
    },
    /**
     * Sélection d'une tolérance pour le tempo
     *
     * @method tempoRange
     */
    tempoRange: function() {
      var tempoVariation = $( "input[type='range']" ).val();
      $( "input[type='range'] + span" ).text( tempoVariation + " %" );
      GUI.tempoVariation = (tempoVariation / 100);
    },
    /**
     * Sélection de l'algorithme de tri par défaut
     *
     * @method defaultSorting
     */
    defaultSorting: function() {
      GUI.selectedSorting = "default";
    },
    /**
     * Sélection de l'algorithme de tri favorisant le tempo
     *
     * @method tempoFirstSorting
     */
    tempoFirstSorting: function() {
      GUI.selectedSorting = "tempoFirst";
    },
    /**
     * Sélection de l'algorithme de tri favorisant la tonalité
     *
     * @method keyFirstSorting
     */
    keyFirstSorting: function() {
      GUI.selectedSorting = "keyFirst";
    },
    /**
     * Sélection de l'algorithme de tri croissant du tempo
     *
     * @method ascTempoSorting
     */
    ascTempoSorting: function() {
      GUI.selectedSorting = "ascTempo";
    },
    /**
     * Sélection de l'algorithme de tri décroissant du tempo
     *
     * @method descTempoSorting
     */
    descTempoSorting: function() {
      GUI.selectedSorting = "descTempo";
    },
    /**
     * Sélection du tri placebo
     *
     * @method noSorting
     */
    noSorting: function() {
      GUI.selectedSorting = "none";
    },
    /**
     * Changement d'état (on/off)
     *
     * @method changeState
     * @param {Object} $state Champ caché contenant l'état de l'objet dans le DOM
     * @param {String} positiveMessage Message d'activation (vert)
     * @param {String} negativeMessage Message de désactivation (rouge)
     */
    changeState: function($state, onMessage, offMessage) {
      if ($state.val() == "on") {
        GUI.alert("error", offMessage, 5);
        $state.val( "off" );
      } else {
        GUI.alert("success", onMessage, 5);
        $state.val( "on" );
      }
    }
  },
  /**
   * Classe interne gérant les éléments relatifs aux ambiances
   *
   * @class atmospheres
   */
  atmospheres: {
    /**
     * Changement d'ambiance
     *
     * @method apply
     * @param {String} atmo Nom de l'ambiance
     */
    apply: function(atmo) {
      $( "#" + atmo + "-atmo" ).addClass( "green-item" );
      $( "#" + atmo + "-atmo" ).siblings().removeClass( "green-item" );
      $( ".pusher" ).attr( "style", "background:url('images/background/" + atmo + ".jpg') no-repeat center center fixed !important" );
      if (GUI.soundAllowed && atmo != "neutral") {
        var audio = new Audio( "./sounds/" + atmo + ".ogg");
        audio.play();
      }
    },
    /**
     * Ambiance neutre
     *
     * @method neutral
     */
    neutral: function() {
      GUI.atmospheres.apply("neutral");
    },
    /**
     * Ambiance Rock
     *
     * @method rock
     */
    rock: function() {
      GUI.atmospheres.apply("rock");
    },
    /**
     * Ambiance Electro
     *
     * @method electro
     */
    electro: function() {
      GUI.atmospheres.apply("electro");
    },
    /**
     * Ambiance Hip-Hop
     *
     * @method hiphop
     */
    hiphop: function() {
      GUI.atmospheres.apply("hiphop");
    },
    /**
     * Ambiance Folk
     *
     * @method folk
     */
    folk: function() {
      GUI.atmospheres.apply("folk");
    },
    /**
     * Ambiance Classique
     *
     * @method classical
     */
    classical: function() {
      GUI.atmospheres.apply("classical");
    },
    /**
     * Ambiance Jazz
     *
     * @method jazz
     */
    jazz: function() {
      GUI.atmospheres.apply("jazz");
    },
    /**
     * Ambiance Metal
     *
     * @method metal
     */
    metal: function() {
      GUI.atmospheres.apply("metal");
    }
  },
  /**
   * Classe interne gérant les éléments relatifs à l'utilisateur
   *
   * @class user
   */
  user: {
    /**
     * Gestion de la connexion d'un utilisateur
     *
     * @method login
     */
    login: function() {
      DZ.getLoginStatus(function(response) {
        if (response.status != "connected") { // Si l'utilisateur n'est pas connecté
          DZ.login(function(response) {
            if (response.status == "connected") { // Si tout se passe bien
              DZ.api("/user/me", function(response) {
                $( "#user-img" ).attr({ src:response.picture_small, alt:response.name });
                $( "#user-name" ).text( response.name ).attr( "href", response.link );
                $( "#user-email" ).text( response.email );
                var date = new Date(response.inscription_date),
                    d = date.getDate(),
                    m = date.getMonth() + 1,
                    y = date.getFullYear();
                $( "#user-date" ).text( "Inscrit le " + d + "/" + m + "/" + y );
                $( "#user-not-connected" ).hide();
                $( "#user-connected" ).show();
              });
              GUI.alert("success", "Connexion OK !", 3);
              GUI.menu.toggleSidebar( "#user", "maroon" );
            } else { // Si la connexion échoue
              GUI.alert("error", "Connexion refusée !", 5);
            }
          }, { perms: "basic_access,email" });
        }
      });
    },
    /**
     * Gestion de la déconnexion d'un utilisateur
     *
     * @method logout
     */
    logout: function() {
      DZ.logout();
      $( "#user-connected" ).hide();
      $( "#user-not-connected" ).show();
      GUI.alert("success", "Déconnexion OK !", 3);
      $( "#user" ).sidebar( "toggle" );
    }
  },
  /**
   * Classe interne gérant divers éléments
   *
   * @class misc
   */
  misc: {
    /**
     * Gestion du clic sur le logo
     *
     * @method logo
     */
    logo: function() {
      var pre = document.createElement('pre');
      pre.style.maxHeight = "400px";
      pre.style.overflowWrap = "break-word";
      pre.style.margin = "-16px -16px -16px 0";
      pre.style.paddingBottom = "24px";
      pre.appendChild(document.createTextNode($('#about').text()));
      alertify.confirm(pre, function(){
              alertify.success('Accepted');
          },function(){
              alertify.error('Declined');
          }).setting('labels',{'ok':'Accept', 'cancel': 'Decline'});

    },
    /**
     * Gestion du clic sur la case d'aide
     *
     * @method help
     */
    help: function() {
      $( ".ui.modal" ).modal( "show" );
    }
  }
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/GUI.js","/../modules")
},{"+7ZJp0":13,"./Playlist.js":6,"buffer":10}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Classe mettant en œuvre le pattern Iterator.
 * Cette classe fournit un moyen d'itérer plus simplement sur les collections.
 *
 * @module Iterator
 * @class Iterator
 * @constructor
 * @param {Array} items Collection d'objets à parcourir
 */
module.exports = Iterator = function(items) {

  if (!(this instanceof Iterator)) {
    throw new Error("Erreur ! La classe Iterator doit être instanciée avec l'opérateur « new »");
  }

  /**
   * Index de base à partir duquel commence une itération.
   *
   * @property index
   * @type {Number}
   * @default 0
   */
  this._index = 0;

  /**
   * Collection d'objets à parcourir.
   *
   * @property items
   * @type {Array}
   * @default []
   */
  this._items = items;
};

/**
 * Prototype de l'Iterator
 */
Iterator.prototype = {
  /**
   * Méthode vérifiant s'il y a un élément suivant dans la collection.
   *
   * @method hasNext
   * @return {Boolean} Vrai s'il y a un élément suivant
   */
  hasNext: function() {
    return this._index < this._items.length;
  },
  /**
   * Méthode renvoyant l'élément courant lors de l'itération.
   * L'index est par ailleurs incrémenté pour continuer le parcours.
   *
   * @method next
   * @return {Object} L'objet courant de la collection
   */
  next: function() {
    return this._items[this._index++];
  }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Iterator.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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
   * @param {String} cover Pochette d'album
   * @param {String} key Tonalité
   * @param {String} mode Mode (majeur ou mineur)
   * @param {Number} tempo Tempo (en BPM)
   * @param {String} camelotTag Tag du morceau sur la roue de Camelot
   * @param {Array} harmonies Tags compatibles sur la roue de Camelot
   */
  Track: function(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies) {

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
     * @default ""
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
   * @param {Object} track Un objet morceau (Track)
   * @param {Number} tempoVariation Variation du tempo
   * @param {Boolean} isActive L'harmonie est-elle effective ?
   */
  Harmony: function(track, tempoVariation, isActive) {

    if (!(this instanceof Music.Harmony)) {
      throw new Error("Erreur ! La classe Harmony doit être instanciée avec l'opérateur « new »");
    }

    /**
     * Morceau de référence
     *
     * @property _track
     * @type {Object}
     * @default {}
     */
    this._track = track,
    /**
     * Variation du tempo par rapport à un morceau de référence
     *
     * @property _tempoVariation
     * @type {Number}
     * @default 0
     */
    this._tempoVariation = tempoVariation,
    /**
     * Booléen vérifiant si l'harmonie est effective ou non
     *
     * @property _isActive
     * @type {Boolean}
     * @default false
     */
    this._isActive = isActive,
    /**
     * Méthode calculant le tempo minimal au regard de la variation autorisée
     *
     * @method tempoMin
     * @return {Number} Le tempo minimal
     */
    this.tempoMin = function() {
        return Math.round(track.getTempo() - (track.getTempo() * this._tempoVariation));
    },
    /**
     * Méthode calculant le tempo maximal au regard de la variation autorisée
     *
     * @method tempoMax
     * @return {Number} Le tempo maximal
     */
    this.tempoMax = function() {
        return Math.round(track.getTempo() + (track.getTempo() * this._tempoVariation));
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
   * @method getTrack
   * @return {Object} Le morceau de référence
   */
  getTrack: function() { return this._track; },
  /**
   * Mutateur pour le morceau de référence
   *
   * @method setTrack
   * @param {Object} Le nouveau morceau de référence
   */
  setTrack: function(track) { this._track = track; },
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
   setTempoVariation: function(tempoVariation) { this._tempoVariation = tempoVariation; },
  /**
   * Accesseur pour savoir si l'harmonie est effective ou non
   *
   * @method isActive
   * @return {Boolean} Vrai ou faux
   */
  isActive: function() { return this._isActive; }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Music.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Module encapsulant le lecteur audio fourni par Deezer
 *
 * @module Player
 * @class Player
 */
module.exports = Player = (function() {

  /**
   * Attribut (privé) représentant une instance de la classe elle-même (cf. Singleton)
   *
   * @property url
   * @type {String}
   * @default ""
   */
  var player,
    /**
     * Constructeur (privé) chargé d'initialiser le player (cf. Singleton)
     *
     * @method construct
     * @constructor
     */
      construct = function() {
        /**
         * Méthode effectuant réellement l'initialisation
         *
         * @method construct
         */
        this.init = function() {
          DZ.init({
              appId: '169711',
              channelUrl: 'http://localhost:8000/app',
              player: {
                container: 'player',
                width: 80,
                height: 80,
                format: 'square'
              }
          });
        };
      };

  return new function() {
    /**
     * Méthode délivrant l'unique instance de la classe (cf. Singleton)
     *
     * @method getPlayer
     * @return {Object} Une instance de player
     */
    this.getPlayer = function() {
      if (player === undefined) {
        player = new construct();
      }
      return player;
    };
  };

})();

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Player.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Module encapsulant le lecteur audio fourni par Deezer
 * Le module s'appuie sur le modèle MVVM de Vue.js.
 *
 * @module Playlist
 */
module.exports = Playlist = new Vue({
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
    }
  }
});

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Playlist.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

      for (var i = 0; i < similarTracks.length; i++) {
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
        for (var i = 0; i < similarTracks.length; i++) {

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

      for (var i = 0; i < similarTracks.length; i++) {

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
        for (var i = 0; i < similarTracks.length; i++) {

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

      for (var i = 0; i < similarTracks.length; i++) {

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
        for (var i = 0; i < similarTracks.length; i++) {

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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Sorting.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 *  Objets utiles pour le traitement des réponses venant d'Echo Nest
 *
 * @module Vocabulary
 * @class Vocabulary
 * @constructor
 */
module.exports = Vocabulary = function() {};

/**
 * Mode (majeur et mineur)
 *
 * @property modes
 * @type {Object}
 * @default {}
 */
Vocabulary.modes = {
    "0": "mineur",
    "1": "majeur"
};

/**
 * Notes, selon la notation syllabique
 *
 * @property notes
 * @type {Object}
 * @default {}
 */
Vocabulary.keys = {
    "0": "do",
    "1": "do#",
    "2": "ré",
    "3": "mib",
    "4": "mi",
    "5": "fa",
    "6": "fa#",
    "7": "sol",
    "8": "lab",
    "9": "la",
    "10": "sib",
    "11": "si"
};

/**
 * Mix harmonique (mode + note = un tag sur la roue de Camelot)
 *
 * @property harmonicMix
 * @type {Object}
 * @default {}
 */
Vocabulary.harmonicMix = {
    "mineur": {
        "do": {
            "tag": "5A"
        },
        "do#": {
            "tag": "12A"
        },
        "ré": {
            "tag": "7A"
        },
        "mib": {
            "tag": "2A"
        },
        "mi": {
            "tag": "9A"
        },
        "fa": {
            "tag": "4A"
        },
        "fa#": {
            "tag": "11A"
        },
        "sol": {
            "tag": "6A"
        },
        "lab": {
            "tag": "1A"
        },
        "la": {
            "tag": "8A"
        },
        "sib": {
            "tag": "3A"
        },
        "si": {
            "tag": "10A"
        }
    },
    "majeur": {
        "do": {
            "tag": "8B"
        },
        "do#": {
            "tag": "3B"
        },
        "ré": {
            "tag": "10B"
        },
        "mib": {
            "tag": "5B"
        },
        "mi": {
            "tag": "12B"
        },
        "fa": {
            "tag": "7B"
        },
        "fa#": {
            "tag": "2B"
        },
        "sol": {
            "tag": "9B"
        },
        "lab": {
            "tag": "4B"
        },
        "la": {
            "tag": "11B"
        },
        "sib": {
            "tag": "6B"
        },
        "si": {
            "tag": "1B"
        }
    }
};

/**
 * Traduction de la roue de Camelot
 *
 * @property camelotWheel
 * @type {Object}
 * @default {}
 */
Vocabulary.camelotWheel = {
    "1A": {
        "name": "A-Flat Minor",
        "matches": ["1A", "12A", "2A", "1B"]
    },
    "2A": {
        "name": "E-Flat Minor",
        "matches": ["2A", "1A", "3A", "2B"]
    },
    "3A": {
        "name": "B-Flat Minor",
        "matches": ["3A", "2A", "4A", "3B"]
    },
    "4A": {
        "name": "F Minor",
        "matches": ["4A", "3A", "5A", "4B"]
    },
    "5A": {
        "name": "C Minor",
        "matches": ["5A", "4A", "6A", "5B"]
    },
    "6A": {
        "name": "G Minor",
        "matches": ["6A", "5A", "7A", "6B"]
    },
    "7A": {
        "name": "D Minor",
        "matches": ["7A", "6A", "8A", "7B"]
    },
    "8A": {
        "name": "A Minor",
        "matches": ["8A", "7A", "9A", "8B"]
    },
    "9A": {
        "name": "E Minor",
        "matches": ["9A", "8A", "10A", "9B"]
    },
    "10A": {
        "name": "B Minor",
        "matches": ["10A", "9A", "11A", "10B"]
    },
    "11A": {
        "name": "G Flat Minor",
        "matches": ["11A", "10A", "12A", "11B"]
    },
    "12A": {
        "name": "D-Flat Minor",
        "matches": ["12A", "11A", "1A", "12B"]
    },
    "1B": {
        "name": "B Major",
        "matches": ["1B", "12B", "2B", "1A"]
    },
    "2B": {
        "name": "F-Sharp Major",
        "matches": ["2B", "1B", "3B", "2A"]
    },
    "3B": {
        "name": "D-Flat Major",
        "matches": ["3B", "2B", "4B", "3A"]
    },
    "4B": {
        "name": "A-Flat Major",
        "matches": ["4B", "3B", "5B", "4A"]
    },
    "5B": {
        "name": "E-Flat Major",
        "matches": ["5B", "4B", "6B", "5A"]
    },
    "6B": {
        "name": "B-Flat Major",
        "matches": ["6B", "5B", "7B", "6A"]
    },
    "7B": {
        "name": "F Major",
        "matches": ["7B", "6B", "8B", "7A"]
    },
    "8B": {
        "name": "C Major",
        "matches": ["8B", "7B", "9B", "8A"]
    },
    "9B": {
        "name": "G Major",
        "matches": ["9B", "8B", "10B", "9A"]
    },
    "10B": {
        "name": "D Major",
        "matches": ["10B", "9B", "11B", "10A"]
    },
    "11B": {
        "name": "A Major",
        "matches": ["11B", "10B", "12B", "11A"]
    },
    "12B": {
        "name": "E Major",
        "matches": ["12B", "11B", "1B", "12A"]
    }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Vocabulary.js","/../modules")
},{"+7ZJp0":13,"buffer":10}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Import des modules
var Vocabulary = require('../modules/Vocabulary.js'),
    Iterator = require('../modules/Iterator.js'),
    Music = require('../modules/Music.js'),
    Ajax = require('../modules/Ajax.js'),
    GUI = require('../modules/GUI.js'),
    Sorting = require('../modules/Sorting.js'),
    Player = require('../modules/Player'),
    Playlist = require('../modules/Playlist');

// Variables diverses
var similarTracks = [],
    refTrack,
    harmony,
    titleNotif,
    keyNotif,
    tempoNotif,
    player,
    $owl,
    $harmonicTracks;

// Stratégies de tri des morceaux
var sortingStrategy = new Sorting.Strategy(),
    defaultSorting = new Sorting.Default(),
    tempoFirstSorting = new Sorting.TempoFirst(),
    keyFirstSorting = new Sorting.KeyFirst(),
    ascTempoSorting = new Sorting.AscendingTempo(),
    descTempoSorting = new Sorting.DescendingTempo(),
    noSorting = new Sorting.None();

// Point d'entrée de l'application
$( document ).ready(function() {

    // Initialisation de l'interface graphique
    GUI.init();

    // Initialisation du player
    player = Player.getPlayer();
    player.init();

    // Caching des sélecteurs importants
    $owl = $( "#tracks" );
    $harmonicTracks = $( "#harmonic-tracks" );

    // Initialisation de l'autocomplétion
    trackAutocomplete();

    // À la soumission du formulaire, on récupère des morceaux sur Deezer
    $( "#search" ).submit(function(e) {
        e.preventDefault();
        searchTracks();
        GUI.alert("message", "Choisissez un morceau de référence", 5);

        // Réinitialisation de la zone de recherche
        $( "#search input" ).val( "" );

        // Détection de la stratégie de tri des morceaux
        switch (GUI.selectedSorting) {
          case "tempoFirst":
            sortingStrategy.setAlgorithm(tempoFirstSorting);
            break;
          case "keyFirst":
            sortingStrategy.setAlgorithm(keyFirstSorting);
            break;
          case "ascTempo":
            sortingStrategy.setAlgorithm(ascTempoSorting);
            break;
          case "descTempo":
            sortingStrategy.setAlgorithm(descTempoSorting);
            break;
          case "none":
            sortingStrategy.setAlgorithm(noSorting);
            break;
          default:
            sortingStrategy.setAlgorithm(defaultSorting);
        }
    });

    $( "#search input" ).keyup(function() {
      var keyword = $( this ).val();
      if (keyword.length < 3) {
        $( "#autocomplete" ).fadeOut();
      }
    });

});

// Réinitialisation des notifications donnant le profil du morceau de référence
function dismissNotifications() {
  if (titleNotif !== undefined) titleNotif.dismiss();
  if (keyNotif !== undefined) keyNotif.dismiss();
  if (tempoNotif !== undefined) tempoNotif.dismiss();
}

// Gestion de l'autocomplétion dans le champ de recherche
function trackAutocomplete() {

  $( "#search input" ).autocomplete({
      source: function( request, response ) {

        var keyword = $( "#search input" ).val();

        request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/search/track");
        request.addParam("q", keyword);
        request.addParam("limit", 10);
        request.send(success, null);

        function success(response) {

          $( "#autocomplete" ).empty();
          var html = "";

          for (var i = 0; i < response.data.length; i++) {

            var id = "autocomplete-" + response.data[i].id;

            html += '<div id="' + id + '">';
            html += ' <strong>' + response.data[i].title + '</strong><br>';
            html += ' <em>' + response.data[i].artist.name + '</em>';
            html += '</div>';

            selectedTrack(id);
          }
          $( "#autocomplete" ).append( html );
          $( "#autocomplete" ).show();
        }
      },
      minLength: 3
    });

}

// Recherche de morceaux sur Deezer
function searchTracks() {

    // Réinitialisation de la recherche
    if ($owl.is( ":visible" )) $owl.empty();
    if (similarTracks.length > 0) similarTracks = [];
    dismissNotifications();

    var keyword = $( "#search input" ).val();

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(response) {
        // console.log(response);

        for (var i = 0; i < response.data.length; i++) {

            // On récupère toutes les informations sur chaque morceau
            var track = response.data[i],
                artistName = track.artist.name,
                maxStringLength = 100;

            // Si le nom de l'artiste est exagérément long, on le tronque
            if (artistName.length > maxStringLength) {
              artistName = artistName.substr(0, maxStringLength) + " ...";
            }

            // Template d'un morceau
            var html = '<div id="' + track.id + '" class="track" itemscope itemtype="https://schema.org/MusicRecording">';
                html += ' <figure>';
                html += '   <img class="lazyOwl" data-src="' + track.album.cover_medium + '" alt="' + track.title + '">';
                html += '   <figcaption>';
                html += '     <div>';
                html += '       <h3 class="track-title" itemprop="name">' + track.title + '</h3>';
                html += '       <p class="artist-name" itemprop="byArtist">' + artistName + "</p>";
                html += '     </div>';
                html += '   </figcaption>';
                html += ' </figure>';
                html += '</div>';

            // On ajoute le template au carousel et on affiche les résultats
            $owl.data('owlCarousel').addItem(html);

            if (!$owl.is( ":visible" )) {
              $owl.fadeIn();
            }

            // On ajoute un écouteur d'événement de type clic pour chaque morceau
            selectedTrack(track.id);
        }
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(id) {
    $( document ).on( "click", "#" + id, function() {
        // On efface les notifications précédentes
        dismissNotifications();
        // On affiche un loader pour faire patienter l'internaute
        $( ".ui.page.dimmer" ).addClass( "active" );
        // On récupère le résumé audio du morceau sélectionné sur Echo Nest
        getInitialAudioSummary(id);
        // On récupère les informations détaillées du morceau sur Deezer
        getTrackInfos(id);
    });
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
function getInitialAudioSummary(trackId) {

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + trackId);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(final) {
        // Le morceau est-il trouvé sur Echo Nest à partir de l'identifiant Deezer ?
        if (final.response.track !== undefined) {
            GUI.alert("success", "Trouvé sur Echo Nest !", 3);
            // Le morceau trouvé sur Echo Nest a-t-il un résumé audio ?
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                // console.log(final.response);

                // On récupère toutes les informations utiles du morceau
                var track = final.response.track,
                    title = track.title,
                    artist = track.artist,
                    keyIndex = track.audio_summary.key,
                    key = Vocabulary.keys[keyIndex],
                    modeIndex = track.audio_summary.mode,
                    mode = Vocabulary.modes[modeIndex],
                    tempo = Math.round(track.audio_summary.tempo);

                // On construit le profil du morceau de référence
                buildRefTrackProfile(trackId, title, artist, "", key, mode, tempo);

                titleNotif = GUI.alert("message", "« " + title + " » par " + artist, 0);
                keyNotif = GUI.alert("message", "Tonalité : " + key + " " + mode, 0);
                tempoNotif = GUI.alert("message", "Tempo : " + tempo + " BPM", 0);
            } else {
              buildRefTrackProfile(trackId, "", "", "", "", "", 0);
              GUI.alert("error", "Le résumé audio de ce morceau n'est pas disponible sur Echo Nest.", 10);
              GUI.alert("error", "Suggestion harmonique impossible", 10);
            }
        } else {
          buildRefTrackProfile(trackId, "", "", "", "", "", 0);
          GUI.alert("error", "Ce morceau n'a pas été trouvé sur Echo Nest.", 10);
          GUI.alert("error", "Suggestion harmonique impossible", 10);
        }
    }

}

// Construction du profil du morceau de référence
function buildRefTrackProfile(id, title, artist, cover, key, mode, tempo) {

    // On détermine le tag de Camelot et les harmonies à partir des infos à disposition
    if (title != "") {
      var camelotTag = Vocabulary.harmonicMix[mode][key].tag,
          harmonies = Vocabulary.camelotWheel[camelotTag].matches;
    }

    refTrack = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);
    buildHarmonyProfile(refTrack);
}

// Construction du profil de l'harmonie recherchée
function buildHarmonyProfile(track) {
    harmony = new Music.Harmony(track, GUI.tempoVariation, true);
}

// Récupération des informations sur un morceau, notamment pour avoir l'id de l'artiste (Deezer)
function getTrackInfos(trackId) {

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/track/" + trackId);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(response) {
        // console.log(response);
        var artistId = response.artist.id;
        getSimilarArtists(artistId);
    }

}

// Récupération des artistes similaires (Deezer)
function getSimilarArtists(artistId) {

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/artist/" + artistId + "/related");
    request.addParam("limit", 10);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(response) {
        // console.log(response);
        var artists = [];
        for (var i = 0; i < response.data.length; i++) {
            artists.push({
                "request_method":"get",
                "relative_url":"artist/" + response.data[i].id + "/top"
            });
        }
        artists = JSON.stringify(artists);
        getTopTracks(artists);
    }

}

// Récupération des chansons les plus populaires de chaque artiste similaire (Deezer)
function getTopTracks(similarArtists) {

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/batch");
    request.addParam("limit", 10);
    request.addParam("methods", similarArtists);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(response) {
        // console.log(response);
        for (var i = 0; i < response.batch_result.length; i++) {
            var artist = response.batch_result[i];
            $.each(artist.data, function(i, item) {
                var topTrack = item,
                    cover = item.album.cover_medium;

                getTopTrackInfos(topTrack.id, cover);
            });
        }
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfos(topTrackId, cover) {

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + topTrackId);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(final) {
        // Il faut que les morceaux soient trouvés sur Echo Nest
        if (final.response.track !== undefined) {
            // Il faut que les morceaux possèdent un résumé audio sur Echo Nest
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                // console.log(final.response);
                //  On récupère toutes les informations utiles
                var track = final.response.track,
                    title = track.title,
                    artist = track.artist,
                    keyIndex = track.audio_summary.key,
                    key = Vocabulary.keys[keyIndex],
                    modeIndex = track.audio_summary.mode,
                    mode = Vocabulary.modes[modeIndex],
                    tempo = Math.round(track.audio_summary.tempo),
                    camelotTag = Vocabulary.harmonicMix[mode][key].tag;

                // On alimente un tableau de morceaux pour des tris ultérieurs
                var topTrack = new Music.Track(topTrackId, title, artist, cover, key, mode, tempo, camelotTag, []);
                similarTracks.push(topTrack);

            }
        }
    }

}

// Lorsque se terminent toutes les requêtes Ajax en cours...
$( document ).ajaxStop(function() {
  // ... on enlève le loader vu que c'est la fin des requêtes...
  $( ".ui.page.dimmer" ).removeClass( "active" );
  // ... et on lance le tri des morceaux récupérés (s'il y en a)
  if (similarTracks.length > 0) {
    similarTracks = sortingStrategy.sort(refTrack, harmony, similarTracks);
    displayTracks(similarTracks);
  }
});

// Affichage des morceaux selon un ordre déterminé par le tri
function displayTracks(tracks) {

  // Réinitialisation de la zone d'affichage
  $harmonicTracks.mCustomScrollbar( "destroy" );
  $harmonicTracks.empty();

  var html = "";

  // Header du template de suggestions
  html += '<a class="item title">';
  html += ' <h2>Suggestions</h2>';
  html += '</a>';
  html += '<a id="tracks-help" href="#">';
  html += '  <i class="help circle icon"></i>';
  html += '</a>';

  iterator = new Iterator(tracks);
  while (iterator.hasNext()) {

    var item = iterator.next(),
        artistName = item.getArtist(),
        maxStringLength = 100,
        tempoCssClass = "red",
        tonalityCssClass = "red";

    // On gère le cas où le nom de l'artiste est exagérément long
    if (artistName.length > maxStringLength) {
      artistName = artistName.substr(0, maxStringLength) + " ...";
    }

    // On signale les morceaux compatibles en termes de tempo
    if (item.getTempo() >= harmony.tempoMin() && item.getTempo() <= harmony.tempoMax()) {
      tempoCssClass = "green";
    }

    // On signale les morceaux compatibles en termes de tonalité
    if ($.inArray(item.getCamelotTag(), refTrack.getHarmonies()) != -1) {
      tonalityCssClass = "green";
    }

    // Création du template complet pour affichage des suggestions
    html += '<a class="harmonic-track" itemscope itemtype="https://schema.org/MusicComposition">';
    html += ' <figure>';
    html += '   <img src="' + item.getCover() + '" alt="' + item.getTitle() + '">';
    html += '   <figcaption>';
    html += '     <div>';
    html += '      <h3 itemprop="name">' + item.getTitle() + '</h3>';
    html += '      <p class="artist-name" itemprop="composer">' + artistName + '</p>';
    html += '      <p class="' + tempoCssClass + '" itemprop="musicalKey">Tempo : ' + item.getTempo() + ' BPM</p>';
    html += '      <p class="' + tonalityCssClass + '" itemprop="musicalKey">Tonalité : ' + item.getKey() + ' ' + item.getMode() + '</p>';
    html += '     </div>';
    html += '   </figcaption>';
    html += ' </figure>';
    html += ' <input type="hidden" value="' + encodeURIComponent(JSON.stringify(item)) + '">';
    html += '</a>';

  }

  // Affichage des résultats
  $harmonicTracks.append(html);
  $harmonicTracks.mCustomScrollbar();
  $harmonicTracks
    .sidebar('setting', 'transition', 'scale down')
    .sidebar( "show" );

}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_3946f96c.js","/")
},{"+7ZJp0":13,"../modules/Ajax.js":1,"../modules/GUI.js":2,"../modules/Iterator.js":3,"../modules/Music.js":4,"../modules/Player":5,"../modules/Playlist":6,"../modules/Sorting.js":7,"../modules/Vocabulary.js":8,"buffer":10}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"+7ZJp0":13,"base64-js":11,"buffer":10,"ieee754":12}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"+7ZJp0":13,"buffer":10}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"+7ZJp0":13,"buffer":10}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"+7ZJp0":13,"buffer":10}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9BamF4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL2FwcC9qcy9tb2R1bGVzL0l0ZXJhdG9yLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvU29ydGluZy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL3NjcmlwdHMvZmFrZV8zOTQ2Zjk2Yy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3oyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCB1bmUgYXJjaGl0ZWN0dXJlIHLDqXV0aWxpc2FibGUgcG91ciBnw6lyZXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gKlxuICogQG1vZHVsZSBBamF4XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQWpheCA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBnw6luw6lyaXF1ZSBwb3VyIGxlcyByZXF1w6p0ZXMgQWpheFxuICAgKlxuICAgKiBAY2xhc3MgUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBkZSByZXF1w6p0ZSAoR0VUIG91IFBPU1QpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJMIGRlIHJlcXXDqnRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSBUeXBlIGRlIGRvbm7DqWVzIHJlbnZvecOpZXMgKEpTT04sIFhNTCwgLi4uKVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgKi9cbiAgUmVxdWVzdDogZnVuY3Rpb24odHlwZSwgdXJsLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIC8qKlxuICAgICAqIFR5cGUgZGUgcmVxdcOqdGUgKEdFVCBvdSBQT1NUKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAvKipcbiAgICAgKiBVUkwgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB1cmxcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgLyoqXG4gICAgICogVHlwZSBkZSBkb25uw6llcyByZW52b3nDqWVzIChKU09OLCBYTUwsIC4uLilcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhVHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2RhdGFUeXBlID0gZGF0YVR5cGU7XG4gICAgLyoqXG4gICAgICogUGFyYW3DqHRyZXMgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4IHZlcnMgbCdBUEkgZGUgRGVlemVyXG4gICAqXG4gICAqIEBjbGFzcyBEZWV6ZXJBUElSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAZXh0ZW5kcyBSZXF1ZXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIENoZW1pbiBkZSBsYSByZXF1w6p0ZVxuICAgKi9cbiAgRGVlemVyQVBJUmVxdWVzdDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgQWpheC5SZXF1ZXN0LmNhbGwodGhpcywgXCJHRVRcIiwgXCJodHRwOi8vYXBpLmRlZXplci5jb21cIiArIHBhdGgsIFwianNvbnBcIiwgeyBcIm91dHB1dFwiOiBcImpzb25wXCIgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpcmFudCBsZXMgcmVxdcOqdGVzIEFqYXggdmVycyBsJ0FQSSBkJ0VjaG8gTmVzdFxuICAgKlxuICAgKiBAY2xhc3MgRWNob05lc3RBUElSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAZXh0ZW5kcyBSZXF1ZXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIENoZW1pbiBkZSBsYSByZXF1w6p0ZVxuICAgKi9cbiAgRWNob05lc3RBUElSZXF1ZXN0OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBBamF4LlJlcXVlc3QuY2FsbCh0aGlzLCBcIkdFVFwiLCBcImh0dHA6Ly9kZXZlbG9wZXIuZWNob25lc3QuY29tL2FwaS92NFwiICsgcGF0aCwgXCJqc29ucFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXBpX2tleVwiOiBcIlZVU1VBMUhONEhNV1VJTjVQXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwianNvbnBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJidWNrZXRcIjogXCJhdWRpb19zdW1tYXJ5XCJcbiAgICAgICAgICAgICAgICAgIH0pO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGNvbnN0cnVpc2FudCDDoCBsYSBkZW1hbmRlIGRlcyByZXF1w6p0ZXMgQWpheCBkJ3VuIGNlcnRhaW4gdHlwZVxuICAgKlxuICAgKiBAY2xhc3MgUmVxdWVzdEZhY3RvcnlcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBSZXF1ZXN0RmFjdG9yeTogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2hhcmfDqWUgZCdpbnN0YW5jaWVyIGxlcyBjbGFzc2VzIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEFqYXhSZXF1ZXN0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFwaSBBUEkgw6AgaW50ZXJyb2dlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIENoZW1pbiBkZSBsYSByZXF1w6p0ZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVW4gb2JqZXQgZGUgdHlwZSBBamF4XG4gICAgICovXG4gICAgICB0aGlzLmdldEFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24oYXBpLCBwYXRoKSB7XG4gICAgICAgICAgdmFyIGFqYXhSZXF1ZXN0O1xuICAgICAgICAgIGlmIChhcGkgPT09IFwiZGVlemVyXCIpIHtcbiAgICAgICAgICAgICAgYWpheFJlcXVlc3QgPSBuZXcgQWpheC5EZWV6ZXJBUElSZXF1ZXN0KHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXBpID09PSBcImVjaG9uZXN0XCIpIHtcbiAgICAgICAgICAgICAgYWpheFJlcXVlc3QgPSBuZXcgQWpheC5FY2hvTmVzdEFQSVJlcXVlc3QocGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhamF4UmVxdWVzdDtcbiAgICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogUHJvdG90eXBlIGRlIGxhIGNsYXNzZSBtw6hyZSA6IEFqYXhcbiAqL1xuIEFqYXguUmVxdWVzdC5wcm90b3R5cGUgPSB7XG4gICAvKipcbiAgICAqIE3DqXRob2RlIHBlcm1ldHRhbnQgZCdham91dGVyIHVuIHBhcmFtw6h0cmUgw6AgbGEgcmVxdcOqdGVcbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZFBhcmFtXG4gICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IENsw6kgZHUgcGFyYW3DqHRyZVxuICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFZhbGV1ciBkdSBwYXJhbcOodHJlXG4gICAgKi9cbiAgIGFkZFBhcmFtOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICAgfSxcbiAgIC8qKlxuICAgICogTcOpdGhvZGUgY2hhcmfDqWUgZCdlbnZveWVyIGxlcyByZXF1w6p0ZXMgQWpheFxuICAgICpcbiAgICAqIEBtZXRob2Qgc2VuZFxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3VjY2VzcyBGb25jdGlvbiDDoCBleMOpY3V0ZXIgYXUgc3VjY8OocyBkZSBsYSByZXF1w6p0ZVxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXJyb3IgRm9uY3Rpb24gw6AgZXjDqWN1dGVyIGxvcnMgZCd1bmUgZXJyZXVyIGRhbnMgbGEgcmVxdcOqdGVcbiAgICAqL1xuICAgc2VuZDogZnVuY3Rpb24oc3VjY2VzcywgZXJyb3IpIHtcbiAgICAgJC5hamF4KHtcbiAgICAgICAgIHR5cGU6IHRoaXMuX3R5cGUsXG4gICAgICAgICB1cmw6IHRoaXMuX3VybCxcbiAgICAgICAgIGRhdGFUeXBlOiB0aGlzLl9kYXRhVHlwZSxcbiAgICAgICAgIGRhdGE6IHRoaXMuX2RhdGEsXG4gICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICAgfSxcbiAgICAgICAgIGVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgIH1cbiAgICAgfSk7XG4gICB9XG4gfTtcblxuLyoqXG4gKiBDbG9uYWdlIGRlIHByb3RvdHlwZSBwb3VyIGNyw6llciBkZXMgY2xhc3NlcyBmaWxsZXNcbiAqL1xuQWpheC5EZWV6ZXJBUElSZXF1ZXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWpheC5SZXF1ZXN0LnByb3RvdHlwZSk7XG5BamF4LkRlZXplckFQSVJlcXVlc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWpheC5EZWV6ZXJBUElSZXF1ZXN0O1xuXG5BamF4LkVjaG9OZXN0QVBJUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFqYXguUmVxdWVzdC5wcm90b3R5cGUpO1xuQWpheC5FY2hvTmVzdEFQSVJlcXVlc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWpheC5FY2hvTmVzdEFQSVJlcXVlc3Q7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9BamF4LmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBQbGF5bGlzdCA9IHJlcXVpcmUoJy4vUGxheWxpc3QuanMnKTtcblxuLyoqXG4gKiBNb2R1bGUgZ8OpcmFudCBsJ2ludGVyZmFjZSBncmFwaGlxdWVcbiAqXG4gKiBAbW9kdWxlIEdVSVxuICogQGNsYXNzIEdVSVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEdVSSA9IHtcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgbm90aWZpY2F0aW9ucyBzb250IGF1dG9yaXPDqWVzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBub3RpZkFsbG93ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIG5vdGlmQWxsb3dlZDogdHJ1ZSxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgc29ucyBkJ2FtYmlhbmNlIHNvbnQgYXV0b3Jpc8Opc1xuICAgKlxuICAgKiBAcHJvcGVydHkgc291bmRBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBzb3VuZEFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIGRvdWJsb25zIHNvbnQgYXV0b3Jpc8OpcyBkYW5zIGxhIHJlY2hlcmNoZVxuICAgKlxuICAgKiBAcHJvcGVydHkgZHVwbGljYXRlc0FsbG93ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBkdXBsaWNhdGVzQWxsb3dlZDogZmFsc2UsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbGEgdmFyaWF0aW9uIGNvdXJhbnRlIGR1IHRlbXBvIChlbnRyZSAwIGV0IDEpXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB0ZW1wb1ZhcmlhdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwLjA1XG4gICAqL1xuICB0ZW1wb1ZhcmlhdGlvbjogMC4wNSxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHPDqWxlY3Rpb25uw6lcbiAgICpcbiAgICogQHByb3BlcnR5IHNlbGVjdGVkU29ydGluZ1xuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcImRlZmF1bHRcIlxuICAgKi9cbiAgc2VsZWN0ZWRTb3J0aW5nOiBcImRlZmF1bHRcIixcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgbW9yY2VhdXggc29udCBjaGFyZ8OpcyBkYW5zIGxlIGxlY3RldXJcbiAgICpcbiAgICogQHByb3BlcnR5IHRyYWNrc0xvYWRlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHRyYWNrc0xvYWRlZDogZmFsc2UsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbGEgcG9zaXRpb24gZGUgbGEgdMOqdGUgZGUgbGVjdHVyZSBkYW5zIGxlIG1vcmNlYXUgZW4gY291cnNcbiAgICogTGEgdmFsZXVyIHNlIHNpdHVlIGVudHJlIDAgZXQgMTAwLlxuICAgKlxuICAgKiBAcHJvcGVydHkgdHJhY2tQb3NpdGlvblxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICB0cmFja1Bvc2l0aW9uOiAwLFxuICAvKipcbiAgICogTcOpdGhvZGUgY2hhcmfDqWUgZCdpbml0aWFsaXNlciBsJ2ludGVyZmFjZSBncmFwaGlxdWUuXG4gICAqIENldHRlIG3DqXRob2RlIHMnaW5zcGlyZSBkdSBwYXR0ZXJuIFRlbXBsYXRlIGRhbnMgc2EgY29uY2VwdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAvKiAkKCBcIiNtYWluXCIgKS52ZWdhcyh7XG4gICAgICAgIHRyYW5zaXRpb246ICdmYWRlJyxcbiAgICAgICAgc2xpZGU6IDAsXG4gICAgICAgIHNsaWRlczogW1xuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9uZXV0cmFsLmpwZ1wiIH0sXG4gICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL3JvY2suanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvZWxlY3Ryby5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9oaXBob3AuanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvZm9say5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9jbGFzc2ljYWwuanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvamF6ei5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9tZXRhbC5qcGdcIiB9XG4gICAgICAgIF0sXG4gICAgICAgIGFuaW1hdGlvbjogJ2tlbmJ1cm5zJyxcbiAgICAgICAgd2FsazogZnVuY3Rpb24gKGluZGV4LCBzbGlkZVNldHRpbmdzKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTbGlkZSBpbmRleCBcIiArIGluZGV4ICsgXCIgaW1hZ2UgXCIgKyBzbGlkZVNldHRpbmdzLnNyYyk7XG4gICAgICAgICAgaWYgKEdVSS5zb3VuZEFsbG93ZWQgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oIFwiLi9zb3VuZHMvXCIgKyBpbmRleCArIFwiLm9nZ1wiKTtcbiAgICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCBcIiNtYWluXCIgKS52ZWdhcygncGF1c2UnKTsgKi9cblxuICAgIEdVSS5jYXJvdXNlbCgpO1xuICAgIEdVSS5kcmFnKCk7XG4gICAgR1VJLnRvb2x0aXBzKCk7XG4gICAgR1VJLnNjcm9sbGJhcigpO1xuICAgIEdVSS5jc3MoKTtcbiAgICBHVUkuY2hlY2tib3hlcygpO1xuICAgIEdVSS5saXN0ZW5lcnMoKTtcbiAgICBHVUkucGxheWxpc3QucmV0cmlldmUoKTtcbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGR1IGNhcm91c2VsIGNvbnRlbmFudCBsZXMgcsOpc3VsdGF0cyBkZSByZWNoZXJjaGUuXG4gICAqIExlIGNhcm91c2VsIGVzdCBnw6lyw6kgcGFyIGxlIHBsdWdpbiBPV0wgQ2Fyb3VzZWwuXG4gICAqXG4gICAqIEBtZXRob2QgY2Fyb3VzZWxcbiAgICovXG4gIGNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiN0cmFja3NcIiApLm93bENhcm91c2VsKHtcbiAgICAgIGl0ZW1zOiAxMCxcbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgYXV0b1BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVRpbWVvdXQ6IDEwMCxcbiAgICAgIHN0b3BPbkhvdmVyOiB0cnVlLFxuICAgICAgbGF6eUxvYWQgOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkdSBkcmFnICYgZHJvcCBzdXIgbCdpUG9kLlxuICAgKiBMZSBkcmFnICYgZHJvcCBlc3QgZ8OpcsOpIHBhciBqUXVlcnkgVUkuXG4gICAqXG4gICAqIEBtZXRob2QgZHJhZ1xuICAgKi9cbiAgZHJhZzogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjaXBvZC13cmFwcGVyXCIgKS5kcmFnZ2FibGUoeyBzY3JvbGw6IGZhbHNlIH0pO1xuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIHRvb2x0aXBzLlxuICAgKiBMZXMgdG9vbHRpcHMgc29udCBnw6lyw6llcyBwYXIgU2VtYW50aWMgVUkgZXQgcVRpcMKyLlxuICAgKlxuICAgKiBAbWV0aG9kIHRvb2x0aXBzXG4gICAqL1xuICB0b29sdGlwczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjb3B0aW9ucyA+IHNwYW5cIiApLnBvcHVwKCk7IC8vIFNlbWFudGljIFVJXG4gICAgJCggXCJbdGl0bGUgIT0gJyddXCIgKS5xdGlwKHsgLy8gcVRpcMKyXG4gICAgICBzdHlsZToge1xuICAgICAgICAgIGNsYXNzZXM6ICdxdGlwLWRhcmsnXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkZXMgc2Nyb2xsYmFycy5cbiAgICogTGVzIHNjcm9sbGJhcnMgc29udCBnw6lyw6llcyBwYXIgbGUgcGx1Z2luIG1DdXN0b21TY3JvbGxiYXIuXG4gICAqXG4gICAqIEBtZXRob2Qgc2Nyb2xsYmFyXG4gICAqL1xuICBzY3JvbGxiYXI6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiI3BsYXlsaXN0LCAjZmF2b3JpdGVzXCIgKS5tQ3VzdG9tU2Nyb2xsYmFyKHtcbiAgICAgIHRoZW1lOlwiZGFya1wiLFxuICAgICAgc2Nyb2xsSW5lcnRpYTogMFxuICAgIH0pO1xuICB9LFxuICAvKipcbiAgICogSGFjayBDU1NcbiAgICpcbiAgICogQG1ldGhvZCBjc3NcbiAgICovXG4gIGNzczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIucHVzaGVyXCIgKS5jc3MoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIGNoZWNrYm94ZXMuXG4gICAqIExlcyBjaGVja2JveGVzIHNvbnQgZ8OpcsOpZXMgcGFyIFNlbWFudGljIFVJLlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrYm94ZXNcbiAgICovXG4gIGNoZWNrYm94ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkuY2hlY2tib3hcIiApLmNoZWNrYm94KCk7XG4gIH0sXG4gIC8qKlxuICAgKiBEw6lmaW5pdGlvbiBkZSB0b3VzIGxlcyDDqWNvdXRldXJzIGQnw6l2w6luZW1lbnRzXG4gICAqXG4gICAqIEBtZXRob2QgbGlzdGVuZXJzXG4gICAqL1xuICBsaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZXMgc2lkZWJhcnNcbiAgICB2YXIgbWVudUV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIi50b2dnbGUtbWVudVwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjcGxheWxpc3QtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlUGxheWxpc3RdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdm9yaXRlcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVGYXZvcml0ZXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2F0bW9zcGhlcmVzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZUF0bW9zcGhlcmVzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNoYXJtb25pYy10cmFja3MtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlSGFybW9uaWNUcmFja3NdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3VzZXItYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlVXNlcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIudG9nZ2xlLWFsbFwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZUFsbF1cbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZSBsYSBwbGF5bGlzdFxuICAgIHZhciBwbGF5bGlzdEV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmFuZG9tLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5ub3RSYW5kb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI25vdC1yYW5kb20tYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJhbmRvbSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmVwZWF0LWFsbC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Qubm9SZXBlYXQsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI25vLXJlcGVhdC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVwZWF0T25lLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNyZXBlYXQtb25lLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yZXBlYXRBbGwsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI211dGUtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm11dGUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3VubXV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QudW5tdXRlLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNzYXZlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5zYXZlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZXhwb3J0LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5leHBvcnRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNkZWxldGUtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmRlbGV0ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnByZXZpb3VzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wcmV2aW91c10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLmJhY2stYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmJhY2tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5wbGF5LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wbGF5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGF1c2UtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnBhdXNlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIuZm9ydGgtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmZvcnRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIubmV4dC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubmV4dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLmhhcm1vbmljLXRyYWNrXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmFkZFRyYWNrLCBcImFzeW5jXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGVzIGZhdm9yaXNcbiAgICB2YXIgZmF2b3JpdGVzRXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWlwb2RcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmlwb2RdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LW5vdGlmeVwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMubm90aWZ5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1zb3VuZFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuc291bmRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWR1cGxpY2F0ZVwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZHVwbGljYXRlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1yYW5nZVwiLCBcImlucHV0XCIsIEdVSS5mYXZvcml0ZXMudGVtcG9SYW5nZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZGVmYXVsdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kZWZhdWx0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtdGVtcG8tZmlyc3Qtc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMudGVtcG9GaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWtleS1maXJzdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5rZXlGaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWFzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hc2NUZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWRlc2MtdGVtcG8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZGVzY1RlbXBvU29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtbm8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMubm9Tb3J0aW5nXVxuICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBhbWJpYW5jZXNcbiAgICB2YXIgYXRtb3NwaGVyZXNFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbmV1dHJhbC1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLm5ldXRyYWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JvY2stYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5yb2NrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNlbGVjdHJvLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZWxlY3Ryb10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjaGlwaG9wLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuaGlwaG9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmb2xrLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZm9sa10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjY2xhc3NpY2FsLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuY2xhc3NpY2FsXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNqYXp6LWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuamF6el0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbWV0YWwtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5tZXRhbF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyByZWxhdGlmcyDDoCBsJ3V0aWxpc2F0ZXVyXG4gICAgdmFyIHVzZXJFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjbG9naW5cIiwgXCJjbGlja1wiLCBHVUkudXNlci5sb2dpbl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjbG9nb3V0XCIsIFwiY2xpY2tcIiwgR1VJLnVzZXIubG9nb3V0XSxcbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkaXZlcnNcbiAgICB2YXIgb3RoZXJFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjbG9nb1wiLCBcImNsaWNrXCIsIEdVSS5taXNjLmxvZ29dLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3RyYWNrcy1oZWxwXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MuaGVscCwgXCJhc3luY1wiXVxuICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyBBam91dCBkZXMgw6ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50c1xuICAgIGFkZEV2ZW50cyhtZW51RXZlbnRzKTtcbiAgICBhZGRFdmVudHMocGxheWxpc3RFdmVudHMpO1xuICAgIGFkZEV2ZW50cyhmYXZvcml0ZXNFdmVudHMpO1xuICAgIGFkZEV2ZW50cyhhdG1vc3BoZXJlc0V2ZW50cyk7XG4gICAgYWRkRXZlbnRzKHVzZXJFdmVudHMpO1xuICAgIGFkZEV2ZW50cyhvdGhlckV2ZW50cyk7XG5cbiAgICAvLyBGb25jdGlvbnMgZCdham91dCBkJ8OpdsOpbmVtZW50c1xuICAgIGZ1bmN0aW9uIGFkZEV2ZW50cyhlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVbaV1bM10gPT0gXCJhc3luY1wiKSB7XG4gICAgICAgICAgJCggZG9jdW1lbnQgKS5vbiggZVtpXVsxXSwgZVtpXVswXSwgZVtpXVsyXSk7IC8vIGTDqWzDqWdhdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoIGVbaV1bMF0gKS5vbiggZVtpXVsxXSwgZVtpXVsyXSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBGYWNhZGUgcGVybWV0dGFudCBkJ8Opdml0ZXIgbCdhYm9uZGFuY2UgZGUgY29uZGl0aW9ucyBkYW5zIGxlIGNvZGVcbiAgICpcbiAgICogQG1ldGhvZCBhbGVydFxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIGQnYWxlcnRlIChzdWNjw6hzLCBlcnJldXIsIG1lc3NhZ2UpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgZCdhbGVydGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVyIER1csOpZSBkZSB2aWUgZGUgbGEgbm90aWZpY2F0aW9uXG4gICAqL1xuICBhbGVydDogZnVuY3Rpb24odHlwZSwgbWVzc2FnZSwgdGltZXIpIHtcbiAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdWNjZXNzXCI6XG4gICAgICAgICAgcmV0dXJuIGFsZXJ0aWZ5LnN1Y2Nlc3MobWVzc2FnZSwgdGltZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICByZXR1cm4gYWxlcnRpZnkuZXJyb3IobWVzc2FnZSwgdGltZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWVzc2FnZVwiOlxuICAgICAgICAgIHJldHVybiBhbGVydGlmeS5tZXNzYWdlKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlcyDDqWzDqW1lbnRzIHJlbGF0aWZzIGF1IG1lbnVcbiAgICpcbiAgICogQGNsYXNzIG1lbnVcbiAgICovXG4gIG1lbnU6IHtcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbGUgbWVudSAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlXG4gICAgICovXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsYSBwbGF5bGlzdCAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlUGxheWxpc3RcbiAgICAgKi9cbiAgICB0b2dnbGVQbGF5bGlzdDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiNwbGF5bGlzdFwiLCBcImJsdWVcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGxlcyBmYXZvcmlzIChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVGYXZvcml0ZXNcbiAgICAgKi9cbiAgICB0b2dnbGVGYXZvcml0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjZmF2b3JpdGVzXCIsIFwicmVkXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsZXMgYW1iaWFuY2VzIChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVBdG1vc3BoZXJlc1xuICAgICAqL1xuICAgIHRvZ2dsZUF0bW9zcGhlcmVzOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI2F0bW9zcGhlcmVzXCIsIFwiZ3JlZW5cIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGxlcyBtb3JjZWF1eCBoYXJtb25pcXVlcyAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlSGFybW9uaWNUcmFja3NcbiAgICAgKi9cbiAgICB0b2dnbGVIYXJtb25pY1RyYWNrczogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiNoYXJtb25pYy10cmFja3NcIiwgXCJ2aW9sZXRcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGwndXRpbGlzYXRldXIgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZVVzZXJcbiAgICAgKi9cbiAgICB0b2dnbGVVc2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI3VzZXJcIiwgXCJtYXJvb25cIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIHVuZSBzaWRlYmFyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZVNpZGViYXJcbiAgICAgKi9cbiAgICB0b2dnbGVTaWRlYmFyOiBmdW5jdGlvbihpZCwgY29sb3IpIHtcbiAgICAgICQoIGlkIClcbiAgICAgICAgLnNpZGViYXIoe1xuICAgICAgICAgIG9uU2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCBpZCArIFwiLWJ0blwiICkuYWRkQ2xhc3MoIGNvbG9yICsgXCItaXRlbVwiICk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCggaWQgKyBcIi1idG5cIiApLnJlbW92ZUNsYXNzKCBjb2xvciArIFwiLWl0ZW1cIiApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnNpZGViYXIoIFwic2V0dGluZ1wiLCBcInRyYW5zaXRpb25cIiwgXCJvdmVybGF5XCIgKVxuICAgICAgICAuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIHRvdXRlcyBsZXMgc2lkZWJhcnNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlQWxsXG4gICAgICovXG4gICAgdG9nZ2xlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIE9uIGFmZmljaGUgbGUgbWVudSBkdSBiYXNcbiAgICAgIEdVSS5tZW51LnRvZ2dsZSgpO1xuICAgICAgLy8gT24gYWZmaWNoZSB0b3V0ZXMgbGVzIGF1dHJlcyBzaWRlYmFyc1xuICAgICAgdmFyIGNvbG9ycyA9IFtcImJsdWVcIiwgXCJyZWRcIiwgXCJncmVlblwiLCBcInZpb2xldFwiLCBcIm1hcm9vblwiXTtcbiAgICAgICQoIFwiLnNpZGViYXJcIiApLm5vdCggXCIjbWVudVwiICkuZWFjaChmdW5jdGlvbihpLCBlbHQpIHtcbiAgICAgICAgdmFyIGlkID0gJCggZWx0ICkuYXR0ciggXCJpZFwiICk7XG4gICAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI1wiICsgaWQsIGNvbG9yc1tpXSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlcyDDqWzDqW1lbnRzIHJlbGF0aWZzIMOgIGxhIHBsYXlsaXN0XG4gICAqXG4gICAqIEBjbGFzcyBwbGF5bGlzdFxuICAgKi9cbiAgcGxheWxpc3Q6IHtcbiAgICAvKipcbiAgICAgKiBSw6ljdXDDqXJhdGlvbiBkJ3VuZSBwbGF5bGlzdCBzYXV2ZWdhcmTDqWUgZGFucyBsZSBsb2NhbCBzdG9yYWdlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJldHJpZXZlXG4gICAgICovXG4gICAgcmV0cmlldmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNhdmVkUGxheWxpc3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXlsaXN0XCIpO1xuICAgICAgaWYgKHNhdmVkUGxheWxpc3QgIT09IG51bGwpIHtcbiAgICAgICAgUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MgPSBKU09OLnBhcnNlKHNhdmVkUGxheWxpc3QpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogRMOpc2FjdGl2YXRpb24gZGUgbGEgbGVjdHVyZSBhbMOpYXRvaXJlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vdFJhbmRvbVxuICAgICAqL1xuICAgIG5vdFJhbmRvbTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuc2V0U2h1ZmZsZShmYWxzZSk7XG4gICAgICAkKCBcIiNyYW5kb20tYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyYW5kb21cIiwgXCJyZW1vdmVcIiApO1xuICAgICAgJCggXCIjcmFuZG9tLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm5vdC1yYW5kb20tYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiTGVjdHVyZSBhbMOpYXRvaXJlIGTDqXNhY3RpdsOpZVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZGUgbGEgbGVjdHVyZSBhbMOpYXRvaXJlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJhbmRvbVxuICAgICAqL1xuICAgIHJhbmRvbTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuc2V0U2h1ZmZsZSh0cnVlKTtcbiAgICAgICQoIFwiI25vdC1yYW5kb20tYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZW1vdmVcIiwgXCJyYW5kb21cIiApO1xuICAgICAgJCggXCIjbm90LXJhbmRvbS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyYW5kb20tYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJMZWN0dXJlIGFsw6lhdG9pcmUgYWN0aXbDqWVcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSByw6lww6l0aXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm9SZXBlYXRcbiAgICAgKi9cbiAgICBub1JlcGVhdDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuc2V0UmVwZWF0KDApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlZnJlc2hcIiwgXCJyZW1vdmVcIiApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJuby1yZXBlYXRidG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIlBhcyBkZSByw6lww6l0aXRpb25cIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkJ3VuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVwZWF0T25lXG4gICAgICovXG4gICAgcmVwZWF0T25lOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5zZXRSZXBlYXQoMik7XG4gICAgICAkKCBcIiNuby1yZXBlYXQtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZW1vdmVcIiwgXCJyZXBlYXRcIiApO1xuICAgICAgJCggXCIjbm8tcmVwZWF0LWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJlcGVhdC1vbmUtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJSw6lww6l0aXRpb24gZHUgbW9yY2VhdSBlbiBjb3Vyc1wiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZGUgbGEgcsOpcMOpdGl0aW9uIGRlIHRvdXMgbGVzIG1vcmNlYXV4XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlcGVhdEFsbFxuICAgICAqL1xuICAgIHJlcGVhdEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuc2V0UmVwZWF0KDEpO1xuICAgICAgJCggXCIjcmVwZWF0LW9uZS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlcGVhdFwiLCBcInJlZnJlc2hcIiApO1xuICAgICAgJCggXCIjcmVwZWF0LW9uZS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyZXBlYXQtYWxsLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiUsOpcMOpdGl0aW9uIGRlIHRvdXMgbGVzIG1vcmNlYXV4XCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWN0aXZhdGlvbiBkdSBtb2RlIHNpbGVuY2lldXhcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbXV0ZVxuICAgICAqL1xuICAgIG11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoucGxheWVyLnNldE11dGUodHJ1ZSk7XG4gICAgICAkKCBcIiNtdXRlLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwibXV0ZVwiLCBcInVubXV0ZVwiICk7XG4gICAgICAkKCBcIiNtdXRlLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInVubXV0ZS1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJTb24gY291cMOpICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkdSBtb2RlIHNpbGVuY2lldXhcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdW5tdXRlXG4gICAgICovXG4gICAgdW5tdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5zZXRNdXRlKGZhbHNlKTtcbiAgICAgICQoIFwiI3VubXV0ZS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInVubXV0ZVwiLCBcIm11dGVcIiApO1xuICAgICAgJCggXCIjdW5tdXRlLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm11dGUtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJTb24gcsOpdGFibGkgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNhdXZlZ2FyZGUgZGUgbGEgcGxheWxpc3QgY291cmFudGUgZGFucyBsZSBsb2NhbCBzdG9yYWdlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNhdmVcbiAgICAgKi9cbiAgICBzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwbGF5bGlzdCA9IEpTT04uc3RyaW5naWZ5KFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGxheWxpc3RcIiwgcGxheWxpc3QpO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IHNhdXZlZ2FyZMOpZSAhXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRXhwb3J0IENTViBkZSBsYSBwbGF5bGlzdCBjb3VyYW50ZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBleHBvcnRcbiAgICAgKi9cbiAgICBleHBvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIjY3N2LWV4cG9ydFwiICkudGFibGVUb0NTVigpO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IGV4cG9ydMOpZSAhXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRWZmYWNlbWVudCBkZSBsYSBwbGF5bGlzdCBjb3VyYW50ZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWxldGVcbiAgICAgKi9cbiAgICBkZWxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MgPSBbXTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicGxheWxpc3RcIik7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiUGxheWxpc3QgZWZmYWPDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFBhc3NhZ2UgYXUgbW9yY2VhdSBwcsOpY8OpZGVudFxuICAgICAqXG4gICAgICogQG1ldGhvZCBwcmV2aW91c1xuICAgICAqL1xuICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5wcmV2KCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbGxlciBlbiBhcnJpw6hyZSBkYW5zIGxlIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYmFja1xuICAgICAqL1xuICAgIGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS50cmFja1Bvc2l0aW9uID4gMTApIHtcbiAgICAgICAgR1VJLnRyYWNrUG9zaXRpb24gLT0gMTA7XG4gICAgICB9XG4gICAgICBEWi5wbGF5ZXIuc2VlayhHVUkudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMaXJlIHVuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS50cmFja3NMb2FkZWQpIHtcbiAgICAgICAgRFoucGxheWVyLnBsYXkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERaLnBsYXllci5wbGF5VHJhY2tzKFBsYXlsaXN0LnRyYWNrc0lkcyk7XG4gICAgICAgIEdVSS50cmFja3NMb2FkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWV0dHJlIGVuIHBhdXNlIHVuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIucGF1c2UoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsbGVyIGVuIGF2YW50IGRhbnMgbGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBiYWNrXG4gICAgICovXG4gICAgZm9ydGg6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS50cmFja1Bvc2l0aW9uIDwgOTApIHtcbiAgICAgICAgR1VJLnRyYWNrUG9zaXRpb24gKz0gMTA7XG4gICAgICB9XG4gICAgICBEWi5wbGF5ZXIuc2VlayhHVUkudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBQYXNzYWdlIGF1IG1vcmNlYXUgc3VpdmFudFxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXh0XG4gICAgICovXG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIubmV4dCgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWpvdXQgZCd1biBtb3JjZWF1IMOgIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFkZFRyYWNrXG4gICAgICovXG4gICAgYWRkVHJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRyYWNrID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoJCggdGhpcyApLmNoaWxkcmVuKCkuZXEoMSkudmFsKCkpKTtcbiAgICAgIFBsYXlsaXN0LmFkZFRyYWNrVG9QbGF5bGlzdCh0cmFjayk7XG4gICAgICBHVUkudHJhY2tzTG9hZGVkID0gZmFsc2U7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiTW9yY2VhdSBham91dMOpIMOgIHZvdHJlIHBsYXlsaXN0XCIsIDUpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXV4IGZhdm9yaXNcbiAgICpcbiAgICogQGNsYXNzIGZhdm9yaXRlc1xuICAgKi9cbiAgZmF2b3JpdGVzOiB7XG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsYSB2aXNpYmlsaXTDqSBkZSBsJ2lQb2RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaXBvZFxuICAgICAqL1xuICAgIGlwb2Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRpcG9kID0gJCggXCIjaXBvZC13cmFwcGVyXCIgKSxcbiAgICAgICAgICAkaXBvZFN0YXRlID0gJCggXCIjZmF2LWlwb2QgLnN0YXRlXCIgKTtcbiAgICAgICRpcG9kLmlzKCBcIjp2aXNpYmxlXCIgKSA/ICRpcG9kLmZhZGVPdXQoKSA6ICRpcG9kLmZhZGVJbigpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkaXBvZFN0YXRlLCBcImlQb2QgYWN0aXbDqSAhXCIsIFwiaVBvZCBkw6lzYWN0aXbDqSAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgbm90aWZpY2F0aW9uc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBub3RpZnlcbiAgICAgKi9cbiAgICBub3RpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRub3RpZlN0YXRlID0gJCggXCIjZmF2LW5vdGlmeSAuc3RhdGVcIiApO1xuICAgICAgR1VJLm5vdGlmQWxsb3dlZCA/IChHVUkubm90aWZBbGxvd2VkID0gZmFsc2UpIDogKEdVSS5ub3RpZkFsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJG5vdGlmU3RhdGUsIFwiTm90aWZpY2F0aW9ucyBhY3RpdsOpZXMgIVwiLCBcIk5vdGlmaWNhdGlvbnMgZMOpc2FjdGl2w6llcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgc29ucyBkJ2FtYmlhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvdW5kXG4gICAgICovXG4gICAgc291bmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRzb3VuZFN0YXRlID0gJCggXCIjZmF2LXNvdW5kIC5zdGF0ZVwiICk7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID8gKEdVSS5zb3VuZEFsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLnNvdW5kQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkc291bmRTdGF0ZSwgXCJTb25zIGQnYW1iaWFuY2UgYWN0aXbDqXMgIVwiLCBcIlNvbnMgZCdhbWJpYW5jZSBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIGRvdWJsb25zXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIGR1cGxpY2F0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGR1cGxpY2F0ZVN0YXRlID0gJCggXCIjZmF2LWR1cGxpY2F0ZSAuc3RhdGVcIiApO1xuICAgICAgR1VJLmR1cGxpY2F0ZXNBbGxvd2VkID8gKEdVSS5kdXBsaWNhdGVzQWxsb3dlZCA9IGZhbHNlKSA6IChHVUkuZHVwbGljYXRlc0FsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJGR1cGxpY2F0ZVN0YXRlLCBcIkRvdWJsb25zIGFjdGl2w6lzICFcIiwgXCJEb3VibG9ucyBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZCd1bmUgdG9sw6lyYW5jZSBwb3VyIGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvUmFuZ2VcbiAgICAgKi9cbiAgICB0ZW1wb1JhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZW1wb1ZhcmlhdGlvbiA9ICQoIFwiaW5wdXRbdHlwZT0ncmFuZ2UnXVwiICkudmFsKCk7XG4gICAgICAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ10gKyBzcGFuXCIgKS50ZXh0KCB0ZW1wb1ZhcmlhdGlvbiArIFwiICVcIiApO1xuICAgICAgR1VJLnRlbXBvVmFyaWF0aW9uID0gKHRlbXBvVmFyaWF0aW9uIC8gMTAwKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBwYXIgZMOpZmF1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWZhdWx0U29ydGluZ1xuICAgICAqL1xuICAgIGRlZmF1bHRTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlZmF1bHRcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBmYXZvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvRmlyc3RTb3J0aW5nXG4gICAgICovXG4gICAgdGVtcG9GaXJzdFNvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwidGVtcG9GaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGZhdm9yaXNhbnQgbGEgdG9uYWxpdMOpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGtleUZpcnN0U29ydGluZ1xuICAgICAqL1xuICAgIGtleUZpcnN0U29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJrZXlGaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGNyb2lzc2FudCBkdSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBhc2NUZW1wb1NvcnRpbmdcbiAgICAgKi9cbiAgICBhc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiYXNjVGVtcG9cIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBkw6ljcm9pc3NhbnQgZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVzY1RlbXBvU29ydGluZ1xuICAgICAqL1xuICAgIGRlc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiZGVzY1RlbXBvXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGR1IHRyaSBwbGFjZWJvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vU29ydGluZ1xuICAgICAqL1xuICAgIG5vU29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJub25lXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnw6l0YXQgKG9uL29mZilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY2hhbmdlU3RhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gJHN0YXRlIENoYW1wIGNhY2jDqSBjb250ZW5hbnQgbCfDqXRhdCBkZSBsJ29iamV0IGRhbnMgbGUgRE9NXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBvc2l0aXZlTWVzc2FnZSBNZXNzYWdlIGQnYWN0aXZhdGlvbiAodmVydClcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmVnYXRpdmVNZXNzYWdlIE1lc3NhZ2UgZGUgZMOpc2FjdGl2YXRpb24gKHJvdWdlKVxuICAgICAqL1xuICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbigkc3RhdGUsIG9uTWVzc2FnZSwgb2ZmTWVzc2FnZSkge1xuICAgICAgaWYgKCRzdGF0ZS52YWwoKSA9PSBcIm9uXCIpIHtcbiAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgb2ZmTWVzc2FnZSwgNSk7XG4gICAgICAgICRzdGF0ZS52YWwoIFwib2ZmXCIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgb25NZXNzYWdlLCA1KTtcbiAgICAgICAgJHN0YXRlLnZhbCggXCJvblwiICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggYW1iaWFuY2VzXG4gICAqXG4gICAqIEBjbGFzcyBhdG1vc3BoZXJlc1xuICAgKi9cbiAgYXRtb3NwaGVyZXM6IHtcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnYW1iaWFuY2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXBwbHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXRtbyBOb20gZGUgbCdhbWJpYW5jZVxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbihhdG1vKSB7XG4gICAgICAkKCBcIiNcIiArIGF0bW8gKyBcIi1hdG1vXCIgKS5hZGRDbGFzcyggXCJncmVlbi1pdGVtXCIgKTtcbiAgICAgICQoIFwiI1wiICsgYXRtbyArIFwiLWF0bW9cIiApLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoIFwiZ3JlZW4taXRlbVwiICk7XG4gICAgICAkKCBcIi5wdXNoZXJcIiApLmF0dHIoIFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kOnVybCgnaW1hZ2VzL2JhY2tncm91bmQvXCIgKyBhdG1vICsgXCIuanBnJykgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQgIWltcG9ydGFudFwiICk7XG4gICAgICBpZiAoR1VJLnNvdW5kQWxsb3dlZCAmJiBhdG1vICE9IFwibmV1dHJhbFwiKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbyggXCIuL3NvdW5kcy9cIiArIGF0bW8gKyBcIi5vZ2dcIik7XG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIG5ldXRyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXV0cmFsXG4gICAgICovXG4gICAgbmV1dHJhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJuZXV0cmFsXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgUm9ja1xuICAgICAqXG4gICAgICogQG1ldGhvZCByb2NrXG4gICAgICovXG4gICAgcm9jazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJyb2NrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRWxlY3Ryb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBlbGVjdHJvXG4gICAgICovXG4gICAgZWxlY3RybzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJlbGVjdHJvXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgSGlwLUhvcFxuICAgICAqXG4gICAgICogQG1ldGhvZCBoaXBob3BcbiAgICAgKi9cbiAgICBoaXBob3A6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KFwiaGlwaG9wXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRm9sa1xuICAgICAqXG4gICAgICogQG1ldGhvZCBmb2xrXG4gICAgICovXG4gICAgZm9sazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJmb2xrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgQ2xhc3NpcXVlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNsYXNzaWNhbFxuICAgICAqL1xuICAgIGNsYXNzaWNhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJjbGFzc2ljYWxcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBKYXp6XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGphenpcbiAgICAgKi9cbiAgICBqYXp6OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseShcImphenpcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBNZXRhbFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtZXRhbFxuICAgICAqL1xuICAgIG1ldGFsOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseShcIm1ldGFsXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgw6AgbCd1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAY2xhc3MgdXNlclxuICAgKi9cbiAgdXNlcjoge1xuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbGEgY29ubmV4aW9uIGQndW4gdXRpbGlzYXRldXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9naW5cbiAgICAgKi9cbiAgICBsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IFwiY29ubmVjdGVkXCIpIHsgLy8gU2kgbCd1dGlsaXNhdGV1ciBuJ2VzdCBwYXMgY29ubmVjdMOpXG4gICAgICAgICAgRFoubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gXCJjb25uZWN0ZWRcIikgeyAvLyBTaSB0b3V0IHNlIHBhc3NlIGJpZW5cbiAgICAgICAgICAgICAgRFouYXBpKFwiL3VzZXIvbWVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWltZ1wiICkuYXR0cih7IHNyYzpyZXNwb25zZS5waWN0dXJlX3NtYWxsLCBhbHQ6cmVzcG9uc2UubmFtZSB9KTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5hbWVcIiApLnRleHQoIHJlc3BvbnNlLm5hbWUgKS5hdHRyKCBcImhyZWZcIiwgcmVzcG9uc2UubGluayApO1xuICAgICAgICAgICAgICAgICQoIFwiI3VzZXItZW1haWxcIiApLnRleHQoIHJlc3BvbnNlLmVtYWlsICk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShyZXNwb25zZS5pbnNjcmlwdGlvbl9kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBtID0gZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWRhdGVcIiApLnRleHQoIFwiSW5zY3JpdCBsZSBcIiArIGQgKyBcIi9cIiArIG0gKyBcIi9cIiArIHkgKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuc2hvdygpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkNvbm5leGlvbiBPSyAhXCIsIDMpO1xuICAgICAgICAgICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiN1c2VyXCIsIFwibWFyb29uXCIgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFNpIGxhIGNvbm5leGlvbiDDqWNob3VlXG4gICAgICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiQ29ubmV4aW9uIHJlZnVzw6llICFcIiwgNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgeyBwZXJtczogXCJiYXNpY19hY2Nlc3MsZW1haWxcIiB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGxhIGTDqWNvbm5leGlvbiBkJ3VuIHV0aWxpc2F0ZXVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ291dFxuICAgICAqL1xuICAgIGxvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5sb2dvdXQoKTtcbiAgICAgICQoIFwiI3VzZXItY29ubmVjdGVkXCIgKS5oaWRlKCk7XG4gICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLnNob3coKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJEw6ljb25uZXhpb24gT0sgIVwiLCAzKTtcbiAgICAgICQoIFwiI3VzZXJcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGRpdmVycyDDqWzDqW1lbnRzXG4gICAqXG4gICAqIEBjbGFzcyBtaXNjXG4gICAqL1xuICBtaXNjOiB7XG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkdSBjbGljIHN1ciBsZSBsb2dvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ29cbiAgICAgKi9cbiAgICBsb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcbiAgICAgIHByZS5zdHlsZS5tYXhIZWlnaHQgPSBcIjQwMHB4XCI7XG4gICAgICBwcmUuc3R5bGUub3ZlcmZsb3dXcmFwID0gXCJicmVhay13b3JkXCI7XG4gICAgICBwcmUuc3R5bGUubWFyZ2luID0gXCItMTZweCAtMTZweCAtMTZweCAwXCI7XG4gICAgICBwcmUuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiMjRweFwiO1xuICAgICAgcHJlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCQoJyNhYm91dCcpLnRleHQoKSkpO1xuICAgICAgYWxlcnRpZnkuY29uZmlybShwcmUsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGFsZXJ0aWZ5LnN1Y2Nlc3MoJ0FjY2VwdGVkJyk7XG4gICAgICAgICAgfSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBhbGVydGlmeS5lcnJvcignRGVjbGluZWQnKTtcbiAgICAgICAgICB9KS5zZXR0aW5nKCdsYWJlbHMnLHsnb2snOidBY2NlcHQnLCAnY2FuY2VsJzogJ0RlY2xpbmUnfSk7XG5cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZHUgY2xpYyBzdXIgbGEgY2FzZSBkJ2FpZGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaGVscFxuICAgICAqL1xuICAgIGhlbHA6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkubW9kYWxcIiApLm1vZGFsKCBcInNob3dcIiApO1xuICAgIH1cbiAgfVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvR1VJLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogQ2xhc3NlIG1ldHRhbnQgZW4gxZN1dnJlIGxlIHBhdHRlcm4gSXRlcmF0b3IuXG4gKiBDZXR0ZSBjbGFzc2UgZm91cm5pdCB1biBtb3llbiBkJ2l0w6lyZXIgcGx1cyBzaW1wbGVtZW50IHN1ciBsZXMgY29sbGVjdGlvbnMuXG4gKlxuICogQG1vZHVsZSBJdGVyYXRvclxuICogQGNsYXNzIEl0ZXJhdG9yXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIENvbGxlY3Rpb24gZCdvYmpldHMgw6AgcGFyY291cmlyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gSXRlcmF0b3IgPSBmdW5jdGlvbihpdGVtcykge1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJdGVyYXRvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgSXRlcmF0b3IgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gIH1cblxuICAvKipcbiAgICogSW5kZXggZGUgYmFzZSDDoCBwYXJ0aXIgZHVxdWVsIGNvbW1lbmNlIHVuZSBpdMOpcmF0aW9uLlxuICAgKlxuICAgKiBAcHJvcGVydHkgaW5kZXhcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgdGhpcy5faW5kZXggPSAwO1xuXG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIGQnb2JqZXRzIMOgIHBhcmNvdXJpci5cbiAgICpcbiAgICogQHByb3BlcnR5IGl0ZW1zXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsJ0l0ZXJhdG9yXG4gKi9cbkl0ZXJhdG9yLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIE3DqXRob2RlIHbDqXJpZmlhbnQgcydpbCB5IGEgdW4gw6lsw6ltZW50IHN1aXZhbnQgZGFucyBsYSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGhhc05leHRcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVnJhaSBzJ2lsIHkgYSB1biDDqWzDqW1lbnQgc3VpdmFudFxuICAgKi9cbiAgaGFzTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4IDwgdGhpcy5faXRlbXMubGVuZ3RoO1xuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgcmVudm95YW50IGwnw6lsw6ltZW50IGNvdXJhbnQgbG9ycyBkZSBsJ2l0w6lyYXRpb24uXG4gICAqIEwnaW5kZXggZXN0IHBhciBhaWxsZXVycyBpbmNyw6ltZW50w6kgcG91ciBjb250aW51ZXIgbGUgcGFyY291cnMuXG4gICAqXG4gICAqIEBtZXRob2QgbmV4dFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEwnb2JqZXQgY291cmFudCBkZSBsYSBjb2xsZWN0aW9uXG4gICAqL1xuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXNbdGhpcy5faW5kZXgrK107XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9JdGVyYXRvci5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCBkZXMgZW50aXTDqXMgcmVsYXRpdmVzIMOgIGxhIG11c2lxdWUuXG4gKlxuICogQG1vZHVsZSBNdXNpY1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IE11c2ljID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1biBtb3JjZWF1IGRlIG11c2lxdWUuXG4gICAqXG4gICAqIEBjbGFzcyBUcmFja1xuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIElkZW50aWZpYW50IERlZXplclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGl0cmVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFydGlzdCBBcnRpc3RlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb3ZlciBQb2NoZXR0ZSBkJ2FsYnVtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVG9uYWxpdMOpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlIE1vZGUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0ZW1wbyBUZW1wbyAoZW4gQlBNKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxvdFRhZyBUYWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqIEBwYXJhbSB7QXJyYXl9IGhhcm1vbmllcyBUYWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIFRyYWNrOiBmdW5jdGlvbihpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcykge1xuXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE11c2ljLlRyYWNrKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIFRyYWNrIGRvaXQgw6p0cmUgaW5zdGFuY2nDqWUgYXZlYyBsJ29ww6lyYXRldXIgwqsgbmV3IMK7XCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElkZW50aWZpYW50IGR1IG1vcmNlYXUgc3VyIERlZXplclxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9pZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgLyoqXG4gICAgICogVGl0cmUgZHUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90aXRsZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gICAgLyoqXG4gICAgICogQXJ0aXN0ZSDDoCBsJ29yaWdpbmUgZHUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9hcnRpc3RcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9hcnRpc3QgPSBhcnRpc3Q7XG4gICAgLyoqXG4gICAgICogUG9jaGV0dGUgZCdhbGJ1bVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9jb3ZlclxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2NvdmVyID0gY292ZXI7XG4gICAgLyoqXG4gICAgICogVG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfa2V5XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIC8qKlxuICAgICAqIE1vZGUgZHUgbW9yY2VhdSAobWFqZXVyIG91IG1pbmV1cilcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfbW9kZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX21vZGUgPSBtb2RlO1xuICAgIC8qKlxuICAgICAqIFRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGVtcG9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90ZW1wbyA9IHRlbXBvO1xuICAgIC8qKlxuICAgICAqIFRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfY2FtZWxvdFRhZ1xuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2NhbWVsb3RUYWcgPSBjYW1lbG90VGFnO1xuICAgIC8qKlxuICAgICAqIFRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9oYXJtb25pZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQGRlZmF1bHQgW11cbiAgICAgKi9cbiAgICB0aGlzLl9oYXJtb25pZXMgPSBoYXJtb25pZXM7XG5cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW5lIGhhcm1vbmllIG11c2ljYWxlLlxuICAgKlxuICAgKiBAY2xhc3MgSGFybW9ueVxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IHRyYWNrIFVuIG9iamV0IG1vcmNlYXUgKFRyYWNrKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG9WYXJpYXRpb24gVmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNBY3RpdmUgTCdoYXJtb25pZSBlc3QtZWxsZSBlZmZlY3RpdmUgP1xuICAgKi9cbiAgSGFybW9ueTogZnVuY3Rpb24odHJhY2ssIHRlbXBvVmFyaWF0aW9uLCBpc0FjdGl2ZSkge1xuXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE11c2ljLkhhcm1vbnkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgSGFybW9ueSBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RyYWNrXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX3RyYWNrID0gdHJhY2ssXG4gICAgLyoqXG4gICAgICogVmFyaWF0aW9uIGR1IHRlbXBvIHBhciByYXBwb3J0IMOgIHVuIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGVtcG9WYXJpYXRpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl90ZW1wb1ZhcmlhdGlvbiA9IHRlbXBvVmFyaWF0aW9uLFxuICAgIC8qKlxuICAgICAqIEJvb2zDqWVuIHbDqXJpZmlhbnQgc2kgbCdoYXJtb25pZSBlc3QgZWZmZWN0aXZlIG91IG5vblxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9pc0FjdGl2ZVxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgdGhpcy5faXNBY3RpdmUgPSBpc0FjdGl2ZSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBjYWxjdWxhbnQgbGUgdGVtcG8gbWluaW1hbCBhdSByZWdhcmQgZGUgbGEgdmFyaWF0aW9uIGF1dG9yaXPDqWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdGVtcG9NaW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIG1pbmltYWxcbiAgICAgKi9cbiAgICB0aGlzLnRlbXBvTWluID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRyYWNrLmdldFRlbXBvKCkgLSAodHJhY2suZ2V0VGVtcG8oKSAqIHRoaXMuX3RlbXBvVmFyaWF0aW9uKSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBjYWxjdWxhbnQgbGUgdGVtcG8gbWF4aW1hbCBhdSByZWdhcmQgZGUgbGEgdmFyaWF0aW9uIGF1dG9yaXPDqWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdGVtcG9NYXhcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIG1heGltYWxcbiAgICAgKi9cbiAgICB0aGlzLnRlbXBvTWF4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRyYWNrLmdldFRlbXBvKCkgKyAodHJhY2suZ2V0VGVtcG8oKSAqIHRoaXMuX3RlbXBvVmFyaWF0aW9uKSk7XG4gICAgfTtcblxuICB9XG5cbn07XG5cbi8qKlxuICogUHJvdG90eXBlIGRlIFRyYWNrXG4gKi9cbk11c2ljLlRyYWNrLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGwnaWRlbnRpZmlhbnQgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldElkXG4gICAqIEByZXR1cm4ge051bWJlcn0gTCdpZCBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0SWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5faWQ7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0VGl0bGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0VGl0bGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGl0bGU7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlIHRpdHJlIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRUaXRsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGUgbm91dmVhdSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgc2V0VGl0bGU6IGZ1bmN0aW9uKHRpdGxlKSB7IHRoaXMuX3RpdGxlID0gdGl0bGU7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2FydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRBcnRpc3RcbiAgICogQHJldHVybiB7U3RyaW5nfSBMJ2FydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICovXG4gICBnZXRBcnRpc3Q6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYXJ0aXN0OyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsJ2FydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRBcnRpc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlbCBhcnRpc3RlIGR1IG1vcmNlYXVcbiAgICovXG4gIHNldEFydGlzdDogZnVuY3Rpb24oYXJ0aXN0KSB7IHRoaXMuX2FydGlzdCA9IGFydGlzdDsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHBvY2hldHRlIGQnYWxidW1cbiAgICpcbiAgICogQG1ldGhvZCBnZXRDb3ZlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExhIHBvY2hldHRlIGQnYWxidW1cbiAgICovXG4gIGdldENvdmVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NvdmVyOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0Q292ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IExhIG5vdXZlbGxlIHBvY2hldHRlIGQnYWxidW1cbiAgICovXG4gIHNldENvdmVyOiBmdW5jdGlvbihjb3ZlcikgeyB0aGlzLl9jb3ZlciA9IGNvdmVyOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRLZXlcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgZ2V0S2V5OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2tleTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRLZXlcbiAgICogQHBhcmFtIHtTdHJpbmd9IExhIG5vdXZlbGxlIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRLZXk6IGZ1bmN0aW9uKGtleSkgeyB0aGlzLl9rZXkgPSBrZXk7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0TW9kZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIG1vZGUgZHUgbW9yY2VhdSAobWFqZXVyIG91IG1pbmV1cilcbiAgICovXG4gIGdldE1vZGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbW9kZTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgbW9kZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0TW9kZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGUgbm91dmVhdSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBzZXRNb2RlOiBmdW5jdGlvbihtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGVtcG8gZHUgbW9yY2VhdSAoZW4gQlBNKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRlbXBvXG4gICAqIEByZXR1cm4ge051bWJlcn0gTGUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgZ2V0VGVtcG86IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG87IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRUZW1wb1xuICAgKiBAcGFyYW0ge051bWJlcn0gTGUgbm91dmVhdSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRUZW1wbzogZnVuY3Rpb24odGVtcG8pIHsgdGhpcy5fdGVtcG8gPSB0ZW1wbzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRDYW1lbG90VGFnXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgZ2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jYW1lbG90VGFnOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0Q2FtZWxvdFRhZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gTGUgbm91dmVhdSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBzZXRDYW1lbG90VGFnOiBmdW5jdGlvbihjYW1lbG90VGFnKSB7IHRoaXMuX2NhbWVsb3RUYWcgPSBjYW1lbG90VGFnOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEhhcm1vbmllc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gTGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgZ2V0SGFybW9uaWVzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2hhcm1vbmllczsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldEhhcm1vbmllc1xuICAgKiBAcGFyYW0ge0FycmF5fSBMZXMgbm91dmVhdXggdGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBzZXRIYXJtb25pZXM6IGZ1bmN0aW9uKGhhcm1vbmllcykgeyB0aGlzLl9oYXJtb25pZXMgPSBoYXJtb25pZXM7IH0sXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBIYXJtb255XG4gKi9cbk11c2ljLkhhcm1vbnkucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRyYWNrXG4gICAqIEByZXR1cm4ge09iamVjdH0gTGUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgZ2V0VHJhY2s6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdHJhY2s7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBzZXRUcmFja1xuICAgKiBAcGFyYW0ge09iamVjdH0gTGUgbm91dmVhdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqL1xuICBzZXRUcmFjazogZnVuY3Rpb24odHJhY2spIHsgdGhpcy5fdHJhY2sgPSB0cmFjazsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKlxuICAgKiBAbWV0aG9kIGdldFRlbXBvVmFyaWF0aW9uXG4gICAqIEByZXR1cm4ge051bWJlcn0gTGEgdmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqL1xuICBnZXRUZW1wb1ZhcmlhdGlvbjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl90ZW1wb1ZhcmlhdGlvbjsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgdmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGVtcG9WYXJpYXRpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IExhIG5vdXZlbGxlIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKi9cbiAgIHNldFRlbXBvVmFyaWF0aW9uOiBmdW5jdGlvbih0ZW1wb1ZhcmlhdGlvbikgeyB0aGlzLl90ZW1wb1ZhcmlhdGlvbiA9IHRlbXBvVmFyaWF0aW9uOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgc2F2b2lyIHNpIGwnaGFybW9uaWUgZXN0IGVmZmVjdGl2ZSBvdSBub25cbiAgICpcbiAgICogQG1ldGhvZCBpc0FjdGl2ZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBWcmFpIG91IGZhdXhcbiAgICovXG4gIGlzQWN0aXZlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lzQWN0aXZlOyB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvTXVzaWMuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZW5jYXBzdWxhbnQgbGUgbGVjdGV1ciBhdWRpbyBmb3VybmkgcGFyIERlZXplclxuICpcbiAqIEBtb2R1bGUgUGxheWVyXG4gKiBAY2xhc3MgUGxheWVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyID0gKGZ1bmN0aW9uKCkge1xuXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCAocHJpdsOpKSByZXByw6lzZW50YW50IHVuZSBpbnN0YW5jZSBkZSBsYSBjbGFzc2UgZWxsZS1tw6ptZSAoY2YuIFNpbmdsZXRvbilcbiAgICpcbiAgICogQHByb3BlcnR5IHVybFxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcIlwiXG4gICAqL1xuICB2YXIgcGxheWVyLFxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdGV1ciAocHJpdsOpKSBjaGFyZ8OpIGQnaW5pdGlhbGlzZXIgbGUgcGxheWVyIChjZi4gU2luZ2xldG9uKVxuICAgICAqXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICAgIGNvbnN0cnVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogTcOpdGhvZGUgZWZmZWN0dWFudCByw6llbGxlbWVudCBsJ2luaXRpYWxpc2F0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgY29uc3RydWN0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6ICcxNjk3MTEnLFxuICAgICAgICAgICAgICBjaGFubmVsVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwcCcsXG4gICAgICAgICAgICAgIHBsYXllcjoge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogJ3BsYXllcicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogODAsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnc3F1YXJlJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gIHJldHVybiBuZXcgZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZMOpbGl2cmFudCBsJ3VuaXF1ZSBpbnN0YW5jZSBkZSBsYSBjbGFzc2UgKGNmLiBTaW5nbGV0b24pXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFBsYXllclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVW5lIGluc3RhbmNlIGRlIHBsYXllclxuICAgICAqL1xuICAgIHRoaXMuZ2V0UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocGxheWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGxheWVyID0gbmV3IGNvbnN0cnVjdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9O1xuICB9O1xuXG59KSgpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvUGxheWVyLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGVuY2Fwc3VsYW50IGxlIGxlY3RldXIgYXVkaW8gZm91cm5pIHBhciBEZWV6ZXJcbiAqIExlIG1vZHVsZSBzJ2FwcHVpZSBzdXIgbGUgbW9kw6hsZSBNVlZNIGRlIFZ1ZS5qcy5cbiAqXG4gKiBAbW9kdWxlIFBsYXlsaXN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUGxheWxpc3QgPSBuZXcgVnVlKHtcbiAgZWw6IFwiI2FwcFwiLFxuICBkYXRhOiB7XG4gICAgdHJhY2tzSWRzOiBbXSxcbiAgICBzZWxlY3RlZFRyYWNrczogW11cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGFkZFRyYWNrVG9QbGF5bGlzdDogZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIHRoaXMudHJhY2tzSWRzLnB1c2godHJhY2suX2lkKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3MucHVzaCh0cmFjayk7XG4gICAgfSxcbiAgICByZW1vdmVUcmFja0Zyb21QbGF5bGlzdDogZnVuY3Rpb24oaSkge1xuICAgICAgdGhpcy50cmFja3NJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5zZWxlY3RlZFRyYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG59KTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1BsYXlsaXN0LmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogQ2xhc3NlIG1ldHRhbnQgZW4gxZN1dnJlIGxlIHBhdHRlcm4gU3RyYXRlZ3kuXG4gKiBDZXR0ZSBjbGFzc2UgZm91cm5pdCB1biBtb3llbiBkJ2VuY2Fwc3VsZXIgdW5lIHPDqXJpZSBkJ2FsZ29yaXRobWVzIGRlIHRyaS5cbiAqXG4gKiBAbW9kdWxlIFNvcnRpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBTb3J0aW5nID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGfDqW7DqXJpcXVlIHJlcHLDqXNlbnRhbnQgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQGNsYXNzIFN0cmF0ZWd5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgU3RyYXRlZ3k6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIEFsZ29yaXRobWUgZGUgdHJpIGNvdXJhbnRcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBhbGdvcml0aG1cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHRoaXMuX2FsZ29yaXRobTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHBhciBkw6lmYXV0LlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gb3UgKFhPUikgZW4gdG9uYWxpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIERlZmF1bHRcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgcGFyIGTDqWZhdXRcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKSxcbiAgICAgICAgICAgIHRlbXBvID0gdHJhY2suZ2V0VGVtcG8oKSxcbiAgICAgICAgICAgIHRlbXBvTWluID0gaGFybW9ueS50ZW1wb01pbigpLFxuICAgICAgICAgICAgdGVtcG9NYXggPSBoYXJtb255LnRlbXBvTWF4KCksXG4gICAgICAgICAgICBpc01hdGNoaW5nID0gKCQuaW5BcnJheSh0cmFjay5nZXRDYW1lbG90VGFnKCksIHJlZlRyYWNrLmdldEhhcm1vbmllcygpKSAhPSAtMSk7XG5cbiAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSByZW1wbGl0IHRvdXRlcyBsZXMgY29uZGl0aW9ucyBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICBpZiAodGVtcG8gPj0gdGVtcG9NaW4gJiYgdGVtcG8gPD0gdGVtcG9NYXggJiYgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIDAsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdW5lIGNvbmRpdGlvbiAodGVtcG8gb3UgdG9uYWxpdMOpKSBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICB9IGVsc2UgaWYgKCh0ZW1wbyA+PSB0ZW1wb01pbiAmJiB0ZW1wbyA8PSB0ZW1wb01heCkgfHwgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgaWYgKCFHVUkuZHVwbGljYXRlc0FsbG93ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhY2tzO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSB2YWxvcmlzYW50IGxlIHRlbXBvLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8sIHN1aXZpcyBkZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdG9uYWxpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIFRlbXBvRmlyc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBUZW1wb0ZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgdmFsb3Jpc2FudCBsZSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciBuYlBlcmZlY3RNYXRjaGVzID0gMCwgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqVxuICAgICAgICAgIG5iVGVtcG9NYXRjaGVzID0gMCwgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvXG4gICAgICAgICAgYXJ0aXN0cyA9IFtdLCAvLyBUb3VzIGxlcyBhcnRpc3RlcyByZW5jb250csOpcyBkYW5zIGxlcyByw6lzdWx0YXRzXG4gICAgICAgICAgdHJhY2tzID0gW10sIC8vIExlcyBtb3JjZWF1eCDDoCByZW52b3llciDDoCBsJ2lzc3VlIGR1IHRyaVxuICAgICAgICAgIHJlYXJyYW5nZSA9IGZ1bmN0aW9uKHJlbW92ZUluZGV4LCBpbnNlcnRJbmRleCwgdHJhY2spIHtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKGluc2VydEluZGV4LCAwLCB0cmFjayk7XG4gICAgICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICBjdXJyZW50VGVtcG8gPSB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICAgICAgdGVtcG9NaW4gPSBoYXJtb255LnRlbXBvTWluKCksXG4gICAgICAgICAgICB0ZW1wb01heCA9IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgICAgIGlzTWF0Y2hpbmcgPSAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmIChjdXJyZW50VGVtcG8gPj0gdGVtcG9NaW4gJiYgY3VycmVudFRlbXBvIDw9IHRlbXBvTWF4ICYmIGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCAwLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0ZW1wby4uLlxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXgpIHtcbiAgICAgICAgICAgIG5iVGVtcG9NYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRvbmFsaXTDqS4uLlxuICAgICAgICB9IGVsc2UgaWYgKGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wb1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMgKyBuYlRlbXBvTWF0Y2hlcywgdHJhY2spO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgaWYgKCFHVUkuZHVwbGljYXRlc0FsbG93ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhY2tzO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSB2YWxvcmlzYW50IGxhIHRvbmFsaXTDqS5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqSwgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wby5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBLZXlGaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIEtleUZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgdmFsb3Jpc2FudCBsYSB0b25hbGl0w6lcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBuYktleU1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgYXJ0aXN0cyA9IFtdLCAvLyBUb3VzIGxlcyBhcnRpc3RlcyByZW5jb250csOpcyBkYW5zIGxlcyByw6lzdWx0YXRzXG4gICAgICAgICAgdHJhY2tzID0gW10sIC8vIExlcyBtb3JjZWF1eCDDoCByZW52b3llciDDoCBsJ2lzc3VlIGR1IHRyaVxuICAgICAgICAgIHJlYXJyYW5nZSA9IGZ1bmN0aW9uKHJlbW92ZUluZGV4LCBpbnNlcnRJbmRleCwgdHJhY2spIHtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKGluc2VydEluZGV4LCAwLCB0cmFjayk7XG4gICAgICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICBjdXJyZW50VGVtcG8gPSB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICAgICAgdGVtcG9NaW4gPSBoYXJtb255LnRlbXBvTWluKCksXG4gICAgICAgICAgICB0ZW1wb01heCA9IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgICAgIGlzTWF0Y2hpbmcgPSAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmIChjdXJyZW50VGVtcG8gPj0gdGVtcG9NaW4gJiYgY3VycmVudFRlbXBvIDw9IHRlbXBvTWF4ICYmIGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCAwLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0b25hbGl0w6kuLi5cbiAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYktleU1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBsZXMgcGx1cyBwZXJ0aW5lbnRzXG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgbmJQZXJmZWN0TWF0Y2hlcywgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdGVtcG8uLi5cbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50VGVtcG8gPj0gdGVtcG9NaW4gJiYgY3VycmVudFRlbXBvIDw9IHRlbXBvTWF4KSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgbmJQZXJmZWN0TWF0Y2hlcyArIG5iS2V5TWF0Y2hlcywgdHJhY2spO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgaWYgKCFHVUkuZHVwbGljYXRlc0FsbG93ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhY2tzO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4LCBjb21wYXRpYmxlcyBvdSBub24sIHNvbnQgcmFuZ8OpcyBkdSBCUE0gbGUgcGx1cyBsZW50IGF1IEJQTSBsZSBwbHVzIHJhcGlkZS5cbiAgICpcbiAgICogQGNsYXNzIEFzY2VuZGluZ1RlbXBvXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgQXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgcmV0dXJuIF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCwgY29tcGF0aWJsZXMgb3Ugbm9uLCBzb250IHJhbmfDqXMgZHUgQlBNIGxlIHBsdXMgcmFwaWRlIGF1IEJQTSBsZSBwbHVzIGxlbnQuXG4gICAqXG4gICAqIEBjbGFzcyBEZXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBkw6ljcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgc2ltaWxhclRyYWNrcyA9IF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICAgIHJldHVybiBzaW1pbGFyVHJhY2tzLnJldmVyc2UoKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1biBhbGdvcml0aG1lIGZpY3RpZiBuJ2VmZmVjdHVhbnQgYXVjdW4gdHJpLlxuICAgKiBDZXR0ZSBjbGFzc2UgbidleGlzdGUgcXVlIHBvdXIgZGVzIHJhaXNvbnMgc8OpbWFudGlxdWVzLlxuICAgKlxuICAgKiBAY2xhc3MgTm9uZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIE5vbmU6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIG4nYXBwbGlxdWFudCBhdWN1biB0cmlcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICByZXR1cm4gc2ltaWxhclRyYWNrcztcbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgU3RyYXRlZ3lcbiAqL1xuU29ydGluZy5TdHJhdGVneS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsZ29yaXRobVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqL1xuICBnZXRBbGdvcml0aG06IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QWxnb3JpdGhtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhbGdvcml0aG0gTGUgbm91dmVsIGFsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKi9cbiAgc2V0QWxnb3JpdGhtOiBmdW5jdGlvbihhbGdvcml0aG0pIHtcbiAgICB0aGlzLl9hbGdvcml0aG0gPSBhbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBhYnN0cmFpdGUgZGUgdHJpLlxuICAgKiBDZXR0ZSBkZXJuacOocmUgc2UgY29udGVudGUgZGUgZMOpbMOpZ3VlciBsZSB0cmkgw6AgdW5lIG3DqXRob2RlIGNvbmNyw6h0ZS5cbiAgICpcbiAgICogQG1ldGhvZCBzb3J0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqSwgc2Vsb24gbCdhbGdvcml0aG1lIGNvdXJhbnRcbiAgICovXG4gIHNvcnQ6IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZ29yaXRobS5zb3J0KHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKTtcbiAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1NvcnRpbmcuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiAgT2JqZXRzIHV0aWxlcyBwb3VyIGxlIHRyYWl0ZW1lbnQgZGVzIHLDqXBvbnNlcyB2ZW5hbnQgZCdFY2hvIE5lc3RcbiAqXG4gKiBAbW9kdWxlIFZvY2FidWxhcnlcbiAqIEBjbGFzcyBWb2NhYnVsYXJ5XG4gKiBAY29uc3RydWN0b3JcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBWb2NhYnVsYXJ5ID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBNb2RlIChtYWpldXIgZXQgbWluZXVyKVxuICpcbiAqIEBwcm9wZXJ0eSBtb2Rlc1xuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkubW9kZXMgPSB7XG4gICAgXCIwXCI6IFwibWluZXVyXCIsXG4gICAgXCIxXCI6IFwibWFqZXVyXCJcbn07XG5cbi8qKlxuICogTm90ZXMsIHNlbG9uIGxhIG5vdGF0aW9uIHN5bGxhYmlxdWVcbiAqXG4gKiBAcHJvcGVydHkgbm90ZXNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmtleXMgPSB7XG4gICAgXCIwXCI6IFwiZG9cIixcbiAgICBcIjFcIjogXCJkbyNcIixcbiAgICBcIjJcIjogXCJyw6lcIixcbiAgICBcIjNcIjogXCJtaWJcIixcbiAgICBcIjRcIjogXCJtaVwiLFxuICAgIFwiNVwiOiBcImZhXCIsXG4gICAgXCI2XCI6IFwiZmEjXCIsXG4gICAgXCI3XCI6IFwic29sXCIsXG4gICAgXCI4XCI6IFwibGFiXCIsXG4gICAgXCI5XCI6IFwibGFcIixcbiAgICBcIjEwXCI6IFwic2liXCIsXG4gICAgXCIxMVwiOiBcInNpXCJcbn07XG5cbi8qKlxuICogTWl4IGhhcm1vbmlxdWUgKG1vZGUgKyBub3RlID0gdW4gdGFnIHN1ciBsYSByb3VlIGRlIENhbWVsb3QpXG4gKlxuICogQHByb3BlcnR5IGhhcm1vbmljTWl4XG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5oYXJtb25pY01peCA9IHtcbiAgICBcIm1pbmV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI1QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyw6lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI3QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMkFcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNEFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkFcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjFBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjhBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIzQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMEFcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIm1hamV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI4QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiM0JcIlxuICAgICAgICB9LFxuICAgICAgICBcInLDqVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEwQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNUJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjdCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYSNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIyQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUJcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjRCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2liXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMUJcIlxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUcmFkdWN0aW9uIGRlIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICpcbiAqIEBwcm9wZXJ0eSBjYW1lbG90V2hlZWxcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbCA9IHtcbiAgICBcIjFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQS1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxQVwiLCBcIjEyQVwiLCBcIjJBXCIsIFwiMUJcIl1cbiAgICB9LFxuICAgIFwiMkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJBXCIsIFwiMUFcIiwgXCIzQVwiLCBcIjJCXCJdXG4gICAgfSxcbiAgICBcIjNBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQVwiLCBcIjJBXCIsIFwiNEFcIiwgXCIzQlwiXVxuICAgIH0sXG4gICAgXCI0QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjRBXCIsIFwiM0FcIiwgXCI1QVwiLCBcIjRCXCJdXG4gICAgfSxcbiAgICBcIjVBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNUFcIiwgXCI0QVwiLCBcIjZBXCIsIFwiNUJcIl1cbiAgICB9LFxuICAgIFwiNkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QVwiLCBcIjVBXCIsIFwiN0FcIiwgXCI2QlwiXVxuICAgIH0sXG4gICAgXCI3QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdBXCIsIFwiNkFcIiwgXCI4QVwiLCBcIjdCXCJdXG4gICAgfSxcbiAgICBcIjhBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEFcIiwgXCI3QVwiLCBcIjlBXCIsIFwiOEJcIl1cbiAgICB9LFxuICAgIFwiOUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QVwiLCBcIjhBXCIsIFwiMTBBXCIsIFwiOUJcIl1cbiAgICB9LFxuICAgIFwiMTBBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQiBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBBXCIsIFwiOUFcIiwgXCIxMUFcIiwgXCIxMEJcIl1cbiAgICB9LFxuICAgIFwiMTFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBGbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMUFcIiwgXCIxMEFcIiwgXCIxMkFcIiwgXCIxMUJcIl1cbiAgICB9LFxuICAgIFwiMTJBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMkFcIiwgXCIxMUFcIiwgXCIxQVwiLCBcIjEyQlwiXVxuICAgIH0sXG4gICAgXCIxQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkIgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjFCXCIsIFwiMTJCXCIsIFwiMkJcIiwgXCIxQVwiXVxuICAgIH0sXG4gICAgXCIyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYtU2hhcnAgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJCXCIsIFwiMUJcIiwgXCIzQlwiLCBcIjJBXCJdXG4gICAgfSxcbiAgICBcIjNCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQlwiLCBcIjJCXCIsIFwiNEJcIiwgXCIzQVwiXVxuICAgIH0sXG4gICAgXCI0QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNEJcIiwgXCIzQlwiLCBcIjVCXCIsIFwiNEFcIl1cbiAgICB9LFxuICAgIFwiNUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjVCXCIsIFwiNEJcIiwgXCI2QlwiLCBcIjVBXCJdXG4gICAgfSxcbiAgICBcIjZCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QlwiLCBcIjVCXCIsIFwiN0JcIiwgXCI2QVwiXVxuICAgIH0sXG4gICAgXCI3QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdCXCIsIFwiNkJcIiwgXCI4QlwiLCBcIjdBXCJdXG4gICAgfSxcbiAgICBcIjhCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEJcIiwgXCI3QlwiLCBcIjlCXCIsIFwiOEFcIl1cbiAgICB9LFxuICAgIFwiOUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QlwiLCBcIjhCXCIsIFwiMTBCXCIsIFwiOUFcIl1cbiAgICB9LFxuICAgIFwiMTBCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBCXCIsIFwiOUJcIiwgXCIxMUJcIiwgXCIxMEFcIl1cbiAgICB9LFxuICAgIFwiMTFCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTFCXCIsIFwiMTBCXCIsIFwiMTJCXCIsIFwiMTFBXCJdXG4gICAgfSxcbiAgICBcIjEyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEyQlwiLCBcIjExQlwiLCBcIjFCXCIsIFwiMTJBXCJdXG4gICAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1ZvY2FidWxhcnkuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gSW1wb3J0IGRlcyBtb2R1bGVzXG52YXIgVm9jYWJ1bGFyeSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvVm9jYWJ1bGFyeS5qcycpLFxuICAgIEl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9JdGVyYXRvci5qcycpLFxuICAgIE11c2ljID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9NdXNpYy5qcycpLFxuICAgIEFqYXggPSByZXF1aXJlKCcuLi9tb2R1bGVzL0FqYXguanMnKSxcbiAgICBHVUkgPSByZXF1aXJlKCcuLi9tb2R1bGVzL0dVSS5qcycpLFxuICAgIFNvcnRpbmcgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1NvcnRpbmcuanMnKSxcbiAgICBQbGF5ZXIgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1BsYXllcicpLFxuICAgIFBsYXlsaXN0ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9QbGF5bGlzdCcpO1xuXG4vLyBWYXJpYWJsZXMgZGl2ZXJzZXNcbnZhciBzaW1pbGFyVHJhY2tzID0gW10sXG4gICAgcmVmVHJhY2ssXG4gICAgaGFybW9ueSxcbiAgICB0aXRsZU5vdGlmLFxuICAgIGtleU5vdGlmLFxuICAgIHRlbXBvTm90aWYsXG4gICAgcGxheWVyLFxuICAgICRvd2wsXG4gICAgJGhhcm1vbmljVHJhY2tzO1xuXG4vLyBTdHJhdMOpZ2llcyBkZSB0cmkgZGVzIG1vcmNlYXV4XG52YXIgc29ydGluZ1N0cmF0ZWd5ID0gbmV3IFNvcnRpbmcuU3RyYXRlZ3koKSxcbiAgICBkZWZhdWx0U29ydGluZyA9IG5ldyBTb3J0aW5nLkRlZmF1bHQoKSxcbiAgICB0ZW1wb0ZpcnN0U29ydGluZyA9IG5ldyBTb3J0aW5nLlRlbXBvRmlyc3QoKSxcbiAgICBrZXlGaXJzdFNvcnRpbmcgPSBuZXcgU29ydGluZy5LZXlGaXJzdCgpLFxuICAgIGFzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkFzY2VuZGluZ1RlbXBvKCksXG4gICAgZGVzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkRlc2NlbmRpbmdUZW1wbygpLFxuICAgIG5vU29ydGluZyA9IG5ldyBTb3J0aW5nLk5vbmUoKTtcblxuLy8gUG9pbnQgZCdlbnRyw6llIGRlIGwnYXBwbGljYXRpb25cbiQoIGRvY3VtZW50ICkucmVhZHkoZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBJbml0aWFsaXNhdGlvbiBkZSBsJ2ludGVyZmFjZSBncmFwaGlxdWVcbiAgICBHVUkuaW5pdCgpO1xuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZHUgcGxheWVyXG4gICAgcGxheWVyID0gUGxheWVyLmdldFBsYXllcigpO1xuICAgIHBsYXllci5pbml0KCk7XG5cbiAgICAvLyBDYWNoaW5nIGRlcyBzw6lsZWN0ZXVycyBpbXBvcnRhbnRzXG4gICAgJG93bCA9ICQoIFwiI3RyYWNrc1wiICk7XG4gICAgJGhhcm1vbmljVHJhY2tzID0gJCggXCIjaGFybW9uaWMtdHJhY2tzXCIgKTtcblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGwnYXV0b2NvbXBsw6l0aW9uXG4gICAgdHJhY2tBdXRvY29tcGxldGUoKTtcblxuICAgIC8vIMOAIGxhIHNvdW1pc3Npb24gZHUgZm9ybXVsYWlyZSwgb24gcsOpY3Vww6hyZSBkZXMgbW9yY2VhdXggc3VyIERlZXplclxuICAgICQoIFwiI3NlYXJjaFwiICkuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWFyY2hUcmFja3MoKTtcbiAgICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIkNob2lzaXNzZXogdW4gbW9yY2VhdSBkZSByw6lmw6lyZW5jZVwiLCA1KTtcblxuICAgICAgICAvLyBSw6lpbml0aWFsaXNhdGlvbiBkZSBsYSB6b25lIGRlIHJlY2hlcmNoZVxuICAgICAgICAkKCBcIiNzZWFyY2ggaW5wdXRcIiApLnZhbCggXCJcIiApO1xuXG4gICAgICAgIC8vIETDqXRlY3Rpb24gZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmkgZGVzIG1vcmNlYXV4XG4gICAgICAgIHN3aXRjaCAoR1VJLnNlbGVjdGVkU29ydGluZykge1xuICAgICAgICAgIGNhc2UgXCJ0ZW1wb0ZpcnN0XCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKHRlbXBvRmlyc3RTb3J0aW5nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJrZXlGaXJzdFwiOlxuICAgICAgICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShrZXlGaXJzdFNvcnRpbmcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImFzY1RlbXBvXCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGFzY1RlbXBvU29ydGluZyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZGVzY1RlbXBvXCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGRlc2NUZW1wb1NvcnRpbmcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIm5vbmVcIjpcbiAgICAgICAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0obm9Tb3J0aW5nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGRlZmF1bHRTb3J0aW5nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCggXCIjc2VhcmNoIGlucHV0XCIgKS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkID0gJCggdGhpcyApLnZhbCgpO1xuICAgICAgaWYgKGtleXdvcmQubGVuZ3RoIDwgMykge1xuICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbi8vIFLDqWluaXRpYWxpc2F0aW9uIGRlcyBub3RpZmljYXRpb25zIGRvbm5hbnQgbGUgcHJvZmlsIGR1IG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbmZ1bmN0aW9uIGRpc21pc3NOb3RpZmljYXRpb25zKCkge1xuICBpZiAodGl0bGVOb3RpZiAhPT0gdW5kZWZpbmVkKSB0aXRsZU5vdGlmLmRpc21pc3MoKTtcbiAgaWYgKGtleU5vdGlmICE9PSB1bmRlZmluZWQpIGtleU5vdGlmLmRpc21pc3MoKTtcbiAgaWYgKHRlbXBvTm90aWYgIT09IHVuZGVmaW5lZCkgdGVtcG9Ob3RpZi5kaXNtaXNzKCk7XG59XG5cbi8vIEdlc3Rpb24gZGUgbCdhdXRvY29tcGzDqXRpb24gZGFucyBsZSBjaGFtcCBkZSByZWNoZXJjaGVcbmZ1bmN0aW9uIHRyYWNrQXV0b2NvbXBsZXRlKCkge1xuXG4gICQoIFwiI3NlYXJjaCBpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHtcbiAgICAgIHNvdXJjZTogZnVuY3Rpb24oIHJlcXVlc3QsIHJlc3BvbnNlICkge1xuXG4gICAgICAgIHZhciBrZXl3b3JkID0gJCggXCIjc2VhcmNoIGlucHV0XCIgKS52YWwoKTtcblxuICAgICAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgICAgIHJlcXVlc3QuYWRkUGFyYW0oXCJxXCIsIGtleXdvcmQpO1xuICAgICAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMTApO1xuICAgICAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5lbXB0eSgpO1xuICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICB2YXIgaWQgPSBcImF1dG9jb21wbGV0ZS1cIiArIHJlc3BvbnNlLmRhdGFbaV0uaWQ7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgaWQ9XCInICsgaWQgKyAnXCI+JztcbiAgICAgICAgICAgIGh0bWwgKz0gJyA8c3Ryb25nPicgKyByZXNwb25zZS5kYXRhW2ldLnRpdGxlICsgJzwvc3Ryb25nPjxicj4nO1xuICAgICAgICAgICAgaHRtbCArPSAnIDxlbT4nICsgcmVzcG9uc2UuZGF0YVtpXS5hcnRpc3QubmFtZSArICc8L2VtPic7XG4gICAgICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgICAgICBzZWxlY3RlZFRyYWNrKGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5hcHBlbmQoIGh0bWwgKTtcbiAgICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1pbkxlbmd0aDogM1xuICAgIH0pO1xuXG59XG5cbi8vIFJlY2hlcmNoZSBkZSBtb3JjZWF1eCBzdXIgRGVlemVyXG5mdW5jdGlvbiBzZWFyY2hUcmFja3MoKSB7XG5cbiAgICAvLyBSw6lpbml0aWFsaXNhdGlvbiBkZSBsYSByZWNoZXJjaGVcbiAgICBpZiAoJG93bC5pcyggXCI6dmlzaWJsZVwiICkpICRvd2wuZW1wdHkoKTtcbiAgICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSBzaW1pbGFyVHJhY2tzID0gW107XG4gICAgZGlzbWlzc05vdGlmaWNhdGlvbnMoKTtcblxuICAgIHZhciBrZXl3b3JkID0gJCggXCIjc2VhcmNoIGlucHV0XCIgKS52YWwoKTtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpLmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL3NlYXJjaC90cmFja1wiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwicVwiLCBrZXl3b3JkKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMjApO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBudWxsKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAvLyBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHN1ciBjaGFxdWUgbW9yY2VhdVxuICAgICAgICAgICAgdmFyIHRyYWNrID0gcmVzcG9uc2UuZGF0YVtpXSxcbiAgICAgICAgICAgICAgICBhcnRpc3ROYW1lID0gdHJhY2suYXJ0aXN0Lm5hbWUsXG4gICAgICAgICAgICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwO1xuXG4gICAgICAgICAgICAvLyBTaSBsZSBub20gZGUgbCdhcnRpc3RlIGVzdCBleGFnw6lyw6ltZW50IGxvbmcsIG9uIGxlIHRyb25xdWVcbiAgICAgICAgICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICAgICAgICBhcnRpc3ROYW1lID0gYXJ0aXN0TmFtZS5zdWJzdHIoMCwgbWF4U3RyaW5nTGVuZ3RoKSArIFwiIC4uLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUZW1wbGF0ZSBkJ3VuIG1vcmNlYXVcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgaWQ9XCInICsgdHJhY2suaWQgKyAnXCIgY2xhc3M9XCJ0cmFja1wiIGl0ZW1zY29wZSBpdGVtdHlwZT1cImh0dHBzOi8vc2NoZW1hLm9yZy9NdXNpY1JlY29yZGluZ1wiPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnIDxmaWd1cmU+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICA8aW1nIGNsYXNzPVwibGF6eU93bFwiIGRhdGEtc3JjPVwiJyArIHRyYWNrLmFsYnVtLmNvdmVyX21lZGl1bSArICdcIiBhbHQ9XCInICsgdHJhY2sudGl0bGUgKyAnXCI+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICA8ZmlnY2FwdGlvbj4nO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgICA8aDMgY2xhc3M9XCJ0cmFjay10aXRsZVwiIGl0ZW1wcm9wPVwibmFtZVwiPicgKyB0cmFjay50aXRsZSArICc8L2gzPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnICAgICAgIDxwIGNsYXNzPVwiYXJ0aXN0LW5hbWVcIiBpdGVtcHJvcD1cImJ5QXJ0aXN0XCI+JyArIGFydGlzdE5hbWUgKyBcIjwvcD5cIjtcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICAgIDwvZGl2Pic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnICAgPC9maWdjYXB0aW9uPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnIDwvZmlndXJlPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnPC9kaXY+JztcblxuICAgICAgICAgICAgLy8gT24gYWpvdXRlIGxlIHRlbXBsYXRlIGF1IGNhcm91c2VsIGV0IG9uIGFmZmljaGUgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICAgICRvd2wuZGF0YSgnb3dsQ2Fyb3VzZWwnKS5hZGRJdGVtKGh0bWwpO1xuXG4gICAgICAgICAgICBpZiAoISRvd2wuaXMoIFwiOnZpc2libGVcIiApKSB7XG4gICAgICAgICAgICAgICRvd2wuZmFkZUluKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE9uIGFqb3V0ZSB1biDDqWNvdXRldXIgZCfDqXbDqW5lbWVudCBkZSB0eXBlIGNsaWMgcG91ciBjaGFxdWUgbW9yY2VhdVxuICAgICAgICAgICAgc2VsZWN0ZWRUcmFjayh0cmFjay5pZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy8gR2VzdGlvbiBkdSBjbGljIHN1ciB1biDDqWzDqW1lbnQgZGUgbGEgbGlzdGUgZGUgc3VnZ2VzdGlvbnNcbmZ1bmN0aW9uIHNlbGVjdGVkVHJhY2soaWQpIHtcbiAgICAkKCBkb2N1bWVudCApLm9uKCBcImNsaWNrXCIsIFwiI1wiICsgaWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBPbiBlZmZhY2UgbGVzIG5vdGlmaWNhdGlvbnMgcHLDqWPDqWRlbnRlc1xuICAgICAgICBkaXNtaXNzTm90aWZpY2F0aW9ucygpO1xuICAgICAgICAvLyBPbiBhZmZpY2hlIHVuIGxvYWRlciBwb3VyIGZhaXJlIHBhdGllbnRlciBsJ2ludGVybmF1dGVcbiAgICAgICAgJCggXCIudWkucGFnZS5kaW1tZXJcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgbGUgcsOpc3Vtw6kgYXVkaW8gZHUgbW9yY2VhdSBzw6lsZWN0aW9ubsOpIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgZ2V0SW5pdGlhbEF1ZGlvU3VtbWFyeShpZCk7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgbGVzIGluZm9ybWF0aW9ucyBkw6l0YWlsbMOpZXMgZHUgbW9yY2VhdSBzdXIgRGVlemVyXG4gICAgICAgIGdldFRyYWNrSW5mb3MoaWQpO1xuICAgIH0pO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIGRlIHRlbXBvIGV0IGRlIHRvbmFsaXTDqSBwb3VyIGxlIG1vcmNlYXUgc8OpbGVjdGlvbm7DqSAoRWNobyBOZXN0KVxuZnVuY3Rpb24gZ2V0SW5pdGlhbEF1ZGlvU3VtbWFyeSh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImlkXCIsIFwiZGVlemVyOnRyYWNrOlwiICsgdHJhY2tJZCk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBMZSBtb3JjZWF1IGVzdC1pbCB0cm91dsOpIHN1ciBFY2hvIE5lc3Qgw6AgcGFydGlyIGRlIGwnaWRlbnRpZmlhbnQgRGVlemVyID9cbiAgICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJUcm91dsOpIHN1ciBFY2hvIE5lc3QgIVwiLCAzKTtcbiAgICAgICAgICAgIC8vIExlIG1vcmNlYXUgdHJvdXbDqSBzdXIgRWNobyBOZXN0IGEtdC1pbCB1biByw6lzdW3DqSBhdWRpbyA/XG4gICAgICAgICAgICBpZiAoISQuaXNFbXB0eU9iamVjdChmaW5hbC5yZXNwb25zZS50cmFjay5hdWRpb19zdW1tYXJ5KSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsLnJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgIC8vIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgdXRpbGVzIGR1IG1vcmNlYXVcbiAgICAgICAgICAgICAgICB2YXIgdHJhY2sgPSBmaW5hbC5yZXNwb25zZS50cmFjayxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0cmFjay50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgYXJ0aXN0ID0gdHJhY2suYXJ0aXN0LFxuICAgICAgICAgICAgICAgICAgICBrZXlJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkua2V5LFxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBWb2NhYnVsYXJ5LmtleXNba2V5SW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICBtb2RlSW5kZXggPSB0cmFjay5hdWRpb19zdW1tYXJ5Lm1vZGUsXG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBWb2NhYnVsYXJ5Lm1vZGVzW21vZGVJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIHRlbXBvID0gTWF0aC5yb3VuZCh0cmFjay5hdWRpb19zdW1tYXJ5LnRlbXBvKTtcblxuICAgICAgICAgICAgICAgIC8vIE9uIGNvbnN0cnVpdCBsZSBwcm9maWwgZHUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAgICAgICAgICAgIGJ1aWxkUmVmVHJhY2tQcm9maWxlKHRyYWNrSWQsIHRpdGxlLCBhcnRpc3QsIFwiXCIsIGtleSwgbW9kZSwgdGVtcG8pO1xuXG4gICAgICAgICAgICAgICAgdGl0bGVOb3RpZiA9IEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCLCqyBcIiArIHRpdGxlICsgXCIgwrsgcGFyIFwiICsgYXJ0aXN0LCAwKTtcbiAgICAgICAgICAgICAgICBrZXlOb3RpZiA9IEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJUb25hbGl0w6kgOiBcIiArIGtleSArIFwiIFwiICsgbW9kZSwgMCk7XG4gICAgICAgICAgICAgICAgdGVtcG9Ob3RpZiA9IEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJUZW1wbyA6IFwiICsgdGVtcG8gKyBcIiBCUE1cIiwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidWlsZFJlZlRyYWNrUHJvZmlsZSh0cmFja0lkLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCAwKTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJMZSByw6lzdW3DqSBhdWRpbyBkZSBjZSBtb3JjZWF1IG4nZXN0IHBhcyBkaXNwb25pYmxlIHN1ciBFY2hvIE5lc3QuXCIsIDEwKTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJTdWdnZXN0aW9uIGhhcm1vbmlxdWUgaW1wb3NzaWJsZVwiLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRSZWZUcmFja1Byb2ZpbGUodHJhY2tJZCwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgMCk7XG4gICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJDZSBtb3JjZWF1IG4nYSBwYXMgw6l0w6kgdHJvdXbDqSBzdXIgRWNobyBOZXN0LlwiLCAxMCk7XG4gICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJTdWdnZXN0aW9uIGhhcm1vbmlxdWUgaW1wb3NzaWJsZVwiLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy8gQ29uc3RydWN0aW9uIGR1IHByb2ZpbCBkdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG5mdW5jdGlvbiBidWlsZFJlZlRyYWNrUHJvZmlsZShpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8pIHtcblxuICAgIC8vIE9uIGTDqXRlcm1pbmUgbGUgdGFnIGRlIENhbWVsb3QgZXQgbGVzIGhhcm1vbmllcyDDoCBwYXJ0aXIgZGVzIGluZm9zIMOgIGRpc3Bvc2l0aW9uXG4gICAgaWYgKHRpdGxlICE9IFwiXCIpIHtcbiAgICAgIHZhciBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZyxcbiAgICAgICAgICBoYXJtb25pZXMgPSBWb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbFtjYW1lbG90VGFnXS5tYXRjaGVzO1xuICAgIH1cblxuICAgIHJlZlRyYWNrID0gbmV3IE11c2ljLlRyYWNrKGlkLCB0aXRsZSwgYXJ0aXN0LCBjb3Zlciwga2V5LCBtb2RlLCB0ZW1wbywgY2FtZWxvdFRhZywgaGFybW9uaWVzKTtcbiAgICBidWlsZEhhcm1vbnlQcm9maWxlKHJlZlRyYWNrKTtcbn1cblxuLy8gQ29uc3RydWN0aW9uIGR1IHByb2ZpbCBkZSBsJ2hhcm1vbmllIHJlY2hlcmNow6llXG5mdW5jdGlvbiBidWlsZEhhcm1vbnlQcm9maWxlKHRyYWNrKSB7XG4gICAgaGFybW9ueSA9IG5ldyBNdXNpYy5IYXJtb255KHRyYWNrLCBHVUkudGVtcG9WYXJpYXRpb24sIHRydWUpO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIHN1ciB1biBtb3JjZWF1LCBub3RhbW1lbnQgcG91ciBhdm9pciBsJ2lkIGRlIGwnYXJ0aXN0ZSAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0VHJhY2tJbmZvcyh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi90cmFjay9cIiArIHRyYWNrSWQpO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBudWxsKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICB2YXIgYXJ0aXN0SWQgPSByZXNwb25zZS5hcnRpc3QuaWQ7XG4gICAgICAgIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKTtcbiAgICB9XG5cbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGFydGlzdGVzIHNpbWlsYWlyZXMgKERlZXplcilcbmZ1bmN0aW9uIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9hcnRpc3QvXCIgKyBhcnRpc3RJZCArIFwiL3JlbGF0ZWRcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgdmFyIGFydGlzdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwicmVxdWVzdF9tZXRob2RcIjpcImdldFwiLFxuICAgICAgICAgICAgICAgIFwicmVsYXRpdmVfdXJsXCI6XCJhcnRpc3QvXCIgKyByZXNwb25zZS5kYXRhW2ldLmlkICsgXCIvdG9wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFydGlzdHMgPSBKU09OLnN0cmluZ2lmeShhcnRpc3RzKTtcbiAgICAgICAgZ2V0VG9wVHJhY2tzKGFydGlzdHMpO1xuICAgIH1cblxufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgY2hhbnNvbnMgbGVzIHBsdXMgcG9wdWxhaXJlcyBkZSBjaGFxdWUgYXJ0aXN0ZSBzaW1pbGFpcmUgKERlZXplcilcbmZ1bmN0aW9uIGdldFRvcFRyYWNrcyhzaW1pbGFyQXJ0aXN0cykge1xuXG4gICAgLy8gUGFyYW3DqXRyYWdlIGV0IGVudm9pIGRlIGxhIHJlcXXDqnRlXG4gICAgcmVxdWVzdCA9IG5ldyBBamF4LlJlcXVlc3RGYWN0b3J5KCkuZ2V0QWpheFJlcXVlc3QoXCJkZWV6ZXJcIiwgXCIvYmF0Y2hcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibWV0aG9kc1wiLCBzaW1pbGFyQXJ0aXN0cyk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuYmF0Y2hfcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJ0aXN0ID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0W2ldO1xuICAgICAgICAgICAgJC5lYWNoKGFydGlzdC5kYXRhLCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcFRyYWNrID0gaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgY292ZXIgPSBpdGVtLmFsYnVtLmNvdmVyX21lZGl1bTtcblxuICAgICAgICAgICAgICAgIGdldFRvcFRyYWNrSW5mb3ModG9wVHJhY2suaWQsIGNvdmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgdG91cyBsZXMgdG9wIG1vcmNlYXV4IChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRUb3BUcmFja0luZm9zKHRvcFRyYWNrSWQsIGNvdmVyKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImlkXCIsIFwiZGVlemVyOnRyYWNrOlwiICsgdG9wVHJhY2tJZCk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBJbCBmYXV0IHF1ZSBsZXMgbW9yY2VhdXggc29pZW50IHRyb3V2w6lzIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIElsIGZhdXQgcXVlIGxlcyBtb3JjZWF1eCBwb3Nzw6hkZW50IHVuIHLDqXN1bcOpIGF1ZGlvIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmluYWwucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIC8vICBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHV0aWxlc1xuICAgICAgICAgICAgICAgIHZhciB0cmFjayA9IGZpbmFsLnJlc3BvbnNlLnRyYWNrLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5hcnRpc3QsXG4gICAgICAgICAgICAgICAgICAgIGtleUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5rZXksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1trZXlJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGVJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkubW9kZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IFZvY2FidWxhcnkubW9kZXNbbW9kZUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcG8gPSBNYXRoLnJvdW5kKHRyYWNrLmF1ZGlvX3N1bW1hcnkudGVtcG8pLFxuICAgICAgICAgICAgICAgICAgICBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZztcblxuICAgICAgICAgICAgICAgIC8vIE9uIGFsaW1lbnRlIHVuIHRhYmxlYXUgZGUgbW9yY2VhdXggcG91ciBkZXMgdHJpcyB1bHTDqXJpZXVyc1xuICAgICAgICAgICAgICAgIHZhciB0b3BUcmFjayA9IG5ldyBNdXNpYy5UcmFjayh0b3BUcmFja0lkLCB0aXRsZSwgYXJ0aXN0LCBjb3Zlciwga2V5LCBtb2RlLCB0ZW1wbywgY2FtZWxvdFRhZywgW10pO1xuICAgICAgICAgICAgICAgIHNpbWlsYXJUcmFja3MucHVzaCh0b3BUcmFjayk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vLyBMb3JzcXVlIHNlIHRlcm1pbmVudCB0b3V0ZXMgbGVzIHJlcXXDqnRlcyBBamF4IGVuIGNvdXJzLi4uXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKGZ1bmN0aW9uKCkge1xuICAvLyAuLi4gb24gZW5sw6h2ZSBsZSBsb2FkZXIgdnUgcXVlIGMnZXN0IGxhIGZpbiBkZXMgcmVxdcOqdGVzLi4uXG4gICQoIFwiLnVpLnBhZ2UuZGltbWVyXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuICAvLyAuLi4gZXQgb24gbGFuY2UgbGUgdHJpIGRlcyBtb3JjZWF1eCByw6ljdXDDqXLDqXMgKHMnaWwgeSBlbiBhKVxuICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgc2ltaWxhclRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKTtcbiAgICBkaXNwbGF5VHJhY2tzKHNpbWlsYXJUcmFja3MpO1xuICB9XG59KTtcblxuLy8gQWZmaWNoYWdlIGRlcyBtb3JjZWF1eCBzZWxvbiB1biBvcmRyZSBkw6l0ZXJtaW7DqSBwYXIgbGUgdHJpXG5mdW5jdGlvbiBkaXNwbGF5VHJhY2tzKHRyYWNrcykge1xuXG4gIC8vIFLDqWluaXRpYWxpc2F0aW9uIGRlIGxhIHpvbmUgZCdhZmZpY2hhZ2VcbiAgJGhhcm1vbmljVHJhY2tzLm1DdXN0b21TY3JvbGxiYXIoIFwiZGVzdHJveVwiICk7XG4gICRoYXJtb25pY1RyYWNrcy5lbXB0eSgpO1xuXG4gIHZhciBodG1sID0gXCJcIjtcblxuICAvLyBIZWFkZXIgZHUgdGVtcGxhdGUgZGUgc3VnZ2VzdGlvbnNcbiAgaHRtbCArPSAnPGEgY2xhc3M9XCJpdGVtIHRpdGxlXCI+JztcbiAgaHRtbCArPSAnIDxoMj5TdWdnZXN0aW9uczwvaDI+JztcbiAgaHRtbCArPSAnPC9hPic7XG4gIGh0bWwgKz0gJzxhIGlkPVwidHJhY2tzLWhlbHBcIiBocmVmPVwiI1wiPic7XG4gIGh0bWwgKz0gJyAgPGkgY2xhc3M9XCJoZWxwIGNpcmNsZSBpY29uXCI+PC9pPic7XG4gIGh0bWwgKz0gJzwvYT4nO1xuXG4gIGl0ZXJhdG9yID0gbmV3IEl0ZXJhdG9yKHRyYWNrcyk7XG4gIHdoaWxlIChpdGVyYXRvci5oYXNOZXh0KCkpIHtcblxuICAgIHZhciBpdGVtID0gaXRlcmF0b3IubmV4dCgpLFxuICAgICAgICBhcnRpc3ROYW1lID0gaXRlbS5nZXRBcnRpc3QoKSxcbiAgICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwLFxuICAgICAgICB0ZW1wb0Nzc0NsYXNzID0gXCJyZWRcIixcbiAgICAgICAgdG9uYWxpdHlDc3NDbGFzcyA9IFwicmVkXCI7XG5cbiAgICAvLyBPbiBnw6hyZSBsZSBjYXMgb8O5IGxlIG5vbSBkZSBsJ2FydGlzdGUgZXN0IGV4YWfDqXLDqW1lbnQgbG9uZ1xuICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICB9XG5cbiAgICAvLyBPbiBzaWduYWxlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZXJtZXMgZGUgdGVtcG9cbiAgICBpZiAoaXRlbS5nZXRUZW1wbygpID49IGhhcm1vbnkudGVtcG9NaW4oKSAmJiBpdGVtLmdldFRlbXBvKCkgPD0gaGFybW9ueS50ZW1wb01heCgpKSB7XG4gICAgICB0ZW1wb0Nzc0NsYXNzID0gXCJncmVlblwiO1xuICAgIH1cblxuICAgIC8vIE9uIHNpZ25hbGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlcm1lcyBkZSB0b25hbGl0w6lcbiAgICBpZiAoJC5pbkFycmF5KGl0ZW0uZ2V0Q2FtZWxvdFRhZygpLCByZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpIHtcbiAgICAgIHRvbmFsaXR5Q3NzQ2xhc3MgPSBcImdyZWVuXCI7XG4gICAgfVxuXG4gICAgLy8gQ3LDqWF0aW9uIGR1IHRlbXBsYXRlIGNvbXBsZXQgcG91ciBhZmZpY2hhZ2UgZGVzIHN1Z2dlc3Rpb25zXG4gICAgaHRtbCArPSAnPGEgY2xhc3M9XCJoYXJtb25pYy10cmFja1wiIGl0ZW1zY29wZSBpdGVtdHlwZT1cImh0dHBzOi8vc2NoZW1hLm9yZy9NdXNpY0NvbXBvc2l0aW9uXCI+JztcbiAgICBodG1sICs9ICcgPGZpZ3VyZT4nO1xuICAgIGh0bWwgKz0gJyAgIDxpbWcgc3JjPVwiJyArIGl0ZW0uZ2V0Q292ZXIoKSArICdcIiBhbHQ9XCInICsgaXRlbS5nZXRUaXRsZSgpICsgJ1wiPic7XG4gICAgaHRtbCArPSAnICAgPGZpZ2NhcHRpb24+JztcbiAgICBodG1sICs9ICcgICAgIDxkaXY+JztcbiAgICBodG1sICs9ICcgICAgICA8aDMgaXRlbXByb3A9XCJuYW1lXCI+JyArIGl0ZW0uZ2V0VGl0bGUoKSArICc8L2gzPic7XG4gICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCJhcnRpc3QtbmFtZVwiIGl0ZW1wcm9wPVwiY29tcG9zZXJcIj4nICsgYXJ0aXN0TmFtZSArICc8L3A+JztcbiAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cIicgKyB0ZW1wb0Nzc0NsYXNzICsgJ1wiIGl0ZW1wcm9wPVwibXVzaWNhbEtleVwiPlRlbXBvIDogJyArIGl0ZW0uZ2V0VGVtcG8oKSArICcgQlBNPC9wPic7XG4gICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCInICsgdG9uYWxpdHlDc3NDbGFzcyArICdcIiBpdGVtcHJvcD1cIm11c2ljYWxLZXlcIj5Ub25hbGl0w6kgOiAnICsgaXRlbS5nZXRLZXkoKSArICcgJyArIGl0ZW0uZ2V0TW9kZSgpICsgJzwvcD4nO1xuICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICBodG1sICs9ICcgPC9maWd1cmU+JztcbiAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoaXRlbSkpICsgJ1wiPic7XG4gICAgaHRtbCArPSAnPC9hPic7XG5cbiAgfVxuXG4gIC8vIEFmZmljaGFnZSBkZXMgcsOpc3VsdGF0c1xuICAkaGFybW9uaWNUcmFja3MuYXBwZW5kKGh0bWwpO1xuICAkaGFybW9uaWNUcmFja3MubUN1c3RvbVNjcm9sbGJhcigpO1xuICAkaGFybW9uaWNUcmFja3NcbiAgICAuc2lkZWJhcignc2V0dGluZycsICd0cmFuc2l0aW9uJywgJ3NjYWxlIGRvd24nKVxuICAgIC5zaWRlYmFyKCBcInNob3dcIiApO1xuXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV8zOTQ2Zjk2Yy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
