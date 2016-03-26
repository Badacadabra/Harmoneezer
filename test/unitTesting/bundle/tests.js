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
                    "format": "jsonp"
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
         traditional: true,
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Ajax.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Player = require('./Player.js'),
    Playlist = require('./Playlist.js'),
    User = require('./User.js');

/**
 * Module gérant l'interface graphique
 *
 * @module GUI
 * @class GUI
 */
module.exports = GUI = {
  /**
   * Lecteur manipulé par l'interface graphique.
   * C'est à la fois un Singleton et un Adapter.
   *
   * @property player
   * @type {Object}
   * @default null
   */
  player: null,
  /**
   * Utilisateur courant
   *
   * @property user
   * @type {Object}
   * @default null
   */
  user: null,
  /**
   * Attribut indiquant si les infobulles sont autorisées
   *
   * @property tooltipAllowed
   * @type {Boolean}
   * @default true
   */
  tooltipAllowed: true,
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
   * Attribut indiquant si l'autocomplétion est autorisée dans la recherche
   *
   * @property autocompleteAllowed
   * @type {Boolean}
   * @default true
   */
  autocompleteAllowed: true,
  /**
   * Attribut indiquant si les doublons sont autorisés dans les suggestions
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
   * Méthode chargée d'initialiser l'interface graphique.
   * Cette méthode s'inspire du pattern Template dans sa conception.
   *
   * @method init
   */
  init: function() {
    GUI.atmospheres.backgrounds(); // Position idéale pour éviter les bugs !?
    GUI.css();
    GUI.carousel();
    GUI.drag();
    GUI.tooltips();
    GUI.checkboxes();
    GUI.listeners();
    GUI.scroll.init();
    GUI.playlist.retrieve();
    GUI.player = Player.getPlayer();
    GUI.player.init();
    GUI.account.status();
  },
  /**
   * Hacks CSS
   *
   * @method css
   */
  css: function() {
    $( ".pusher" ).css("height", "100%");
    if ($( window ).width() <= 600) {
      $( "#menu" ).switchClass( "five", "four" );
      GUI.tooltipAllowed = false;
      GUI.notifAllowed = false;
      GUI.soundAllowed = false;
    } else {
      $( "#menu" ).switchClass( "four", "five" );
      GUI.tooltipAllowed = true;
      GUI.notifAllowed = true;
      GUI.soundAllowed = true;
    }
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
    if (GUI.tooltipAllowed) {
      $( "[data-title != ''], [data-content != '']" ).popup(); // Semantic UI
      $( document ).tooltip({ // jQuery UI
        position: {
          my: "center top",
          at: "center bottom+5",
          within: "#ipod-wrapper"
        },
      });
    }
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
                            ["#mute-btn", "click", GUI.playlist.unmute, "async"],
                            ["#unmute-btn", "click", GUI.playlist.mute, "async"],
                            ["#save-browser-btn", "click", GUI.playlist.saveInBrowser],
                            ["#save-deezer-btn", "click", GUI.playlist.saveOnDeezer],
                            ["#export-btn", "click", GUI.playlist.export],
                            ["#delete-btn", "click", GUI.playlist.delete],
                            [".previous-btn", "click", GUI.playlist.previous],
                            [".back-btn", "click", GUI.playlist.back],
                            [".play-btn", "click", GUI.playlist.play, "async"],
                            [".playlist-item", "click", GUI.playlist.playFrom, "async"],
                            [".pause-btn", "click", GUI.playlist.pause],
                            [".play-pause-btn", "click", GUI.playlist.playPause],
                            [".forth-btn", "click", GUI.playlist.forth],
                            [".next-btn", "click", GUI.playlist.next]
                         ];

    // Écouteurs d'événements des favoris
    var favoritesEvents = [
                             ["#fav-ipod", "click", GUI.favorites.ipod],
                             ["#fav-tooltip", "click", GUI.favorites.tooltip],
                             ["#fav-notify", "click", GUI.favorites.notify],
                             ["#fav-sound", "click", GUI.favorites.sound],
                             ["#fav-autocomplete", "click", GUI.favorites.autocomplete],
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

    // Écouteurs d'événements relatifs au compte utilisateur
    var userEvents = [
                        ["#login", "click", GUI.account.login],
                        ["#logout", "click", GUI.account.logout],
                      ];

    // Écouteurs d'événements divers
    var otherEvents = [
                        ["#logo", "click", GUI.misc.logo],
                        ["#tracks-help", "click", GUI.misc.help, "async"],
                        [window, "resize", GUI.css]
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
      for (var i = 0, len = e.length; i < len; i++) {
        if (e[i][3] == "async") {
          $( document ).on( e[i][1], e[i][0], e[i][2]); // délégation
        } else {
          $( e[i][0] ).on( e[i][1], e[i][2] );
        }
      }
    }

  },
  /**
   * Méthode template créant dynamiquement un fragment HTML
   *
   * @method template
   * @param {String} type Type de template (suggestions de base ou harmoniques)
   * @param {Object} track Objet représentant morceau de musique
   * @param {Boolean} isTempoCompatible Compatibilité ou non du tempo
   * @param {Boolean} isKeyCompatible Compatibilité ou non de la tonalité
   */
  template: function(type, track, isTempoCompatible, isKeyCompatible) {
    if (type == "base-track") { // Morceau de base

      var artistName = track.getArtist(),
          maxStringLength = 100;

      // Si le nom de l'artiste est exagérément long, on le tronque à l'affichage
      if (artistName.length > maxStringLength) {
        artistName = artistName.substr(0, maxStringLength) + " ...";
      }

      var html = '<div class="track" itemscope itemtype="https://schema.org/MusicRecording">';
          html += ' <figure id="submit-' + track.getId() + '">';
          html += '   <img class="lazyOwl" data-src="' + track.getCover() + '" alt="' + track.getTitle() + '">';
          html += '   <figcaption>';
          html += '     <div>';
          html += '       <h3 class="track-title" itemprop="name">' + track.getTitle() + '</h3>';
          html += '       <p class="artist-name" itemprop="byArtist">' + artistName + "</p>";
          html += '     </div>';
          html += '   </figcaption>';
          html += ' </figure>';
          html += ' <input type="hidden" value="' + encodeURIComponent(JSON.stringify(track)) + '">';
          html += '</div>';

      return html;

    } else if (type == "harmonic-track") { // Morceau harmonique

      var artistName = track.getArtist(),
          maxStringLength = 100,
          tempoCssClass = "red",
          tonalityCssClass = "red";

      // On gère le cas où le nom de l'artiste est exagérément long
      if (artistName.length > maxStringLength) {
        artistName = artistName.substr(0, maxStringLength) + " ...";
      }

      // On signale les morceaux compatibles en termes de tempo
      if (isTempoCompatible) {
        tempoCssClass = "green";
      }

      // On signale les morceaux compatibles en termes de tonalité
      if (isKeyCompatible) {
        tonalityCssClass = "green";
      }

      var html = '<a class="harmonic-track" itemscope itemtype="https://schema.org/MusicComposition">';
          html += ' <figure id="suggestion-' + track.getId() + '">';
          html += '   <img src="' + track.getCover() + '" alt="' + track.getTitle() + '">';
          html += '   <figcaption>';
          html += '     <div>';
          html += '      <h3 itemprop="name">' + track.getTitle() + '</h3>';
          html += '      <p class="artist-name" itemprop="composer">' + artistName + '</p>';
          html += '      <p class="' + tempoCssClass + '" itemprop="musicalKey">Tempo : ' + track.getTempo() + ' BPM</p>';
          html += '      <p class="' + tonalityCssClass + '" itemprop="musicalKey">Tonalité : ' + track.getKey() + ' ' + track.getMode() + '</p>';
          html += '     </div>';
          html += '   </figcaption>';
          html += ' </figure>';
          html += ' <input type="hidden" value="' + encodeURIComponent(JSON.stringify(track)) + '">';
          html += '</a>';

      return html;

    } else if (type == "autocomplete") { // Autocomplétion

      var html = '<div id="autocomplete-' + track.id + '">';
          html += ' <strong>' + track.title + '</strong><br>';
          html += ' <em>' + track.artist.name + '</em>';
          html += '</div>';

      return html;

    } else { // Case d'aide

      var html = '<a class="item title">';
          html += ' <h2>Suggestions</h2>';
          html += '</a>';
          html += '<a id="tracks-help" href="#">';
          html += '  <i class="help circle icon"></i>';
          html += '</a>';

      return html;

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
        case "warning":
          return alertify.warning(message, timer);
          break;
        case "message":
          return alertify.message(message, timer);
          break;
      }
    }
  },
  /**
   * Suppression de toutes les notifications actives
   *
   * @method cleanNotifications
   */
  cleanNotifications: function() {
    alertify.dismissAll();
  },
  /**
   * Affichage des suggestions harmoniques à la fin du processus de recherche
   *
   * @method displayFinalTracklist
   */
  displayFinalTracklist: function() {
    $( "#harmonic-tracks" )
      .sidebar( "setting", "transition", "scale down" )
      .sidebar( "show" );
  },
  /**
   * Mini-classe de gestion des scrollbars.
   * Les scrollbars dépendent du plugin mCustomScrollbar.
   *
   * @class GUI.scroll
   */
  scroll: {
    /**
     * Initialisation des scrollbars
     *
     * @method init
     */
    init: function() {
      $( "#playlist, #favorites" ).mCustomScrollbar({
        theme: "dark",
        scrollInertia: 0
      });
    },
    /**
     * Réinitialisation complète d'une scrollbar
     *
     * @method reset
     */
    reset: function($container) {
      $container.mCustomScrollbar();
    },
    /**
     * Destruction d'une scrollbar
     *
     * @method destroy
     */
    destroy: function($container) {
      $container.mCustomScrollbar( "destroy" );
    }
  },
  /**
   * Mini-classe interne gérant le chargement
   *
   * @class GUI.loading
   */
  loading: {
    /**
     * Activer le loader
     *
     * @method on
     */
    on: function() {
      $( ".ui.page.dimmer" ).addClass( "active" );
    },
    /**
     * Désactiver le loader
     *
     * @method off
     */
    off: function() {
      $( ".ui.page.dimmer" ).removeClass( "active" );
    }
  },
  /**
   * Classe interne gérant les éléments relatifs au menu
   *
   * @class GUI.menu
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
   * @class GUI.playlist
   */
  playlist: {
    /**
     * Récupération d'une playlist sauvegardée dans le local storage
     *
     * @method retrieve
     */
    retrieve: function() {
      var savedPlaylist = localStorage.getItem("playlist"),
          ids = [];

      if (savedPlaylist !== null) {
        Playlist.selectedTracks = JSON.parse(savedPlaylist);
        for (var i = 0, len = Playlist.selectedTracks.length; i < len; i++) {
          ids.push(Playlist.selectedTracks[i]._id);
        }
        Playlist.tracksIds = ids;
      }
    },
    /**
     * Désactivation de la lecture aléatoire
     *
     * @method notRandom
     */
    notRandom: function() {
      GUI.player.random(false);
      $( "#random-btn .icon" ).switchClass( "random", "minus" );
      $( "#random-btn" ).attr( "id", "not-random-btn" );
      GUI.alert("error", "Lecture aléatoire désactivée", 5);
    },
    /**
     * Activation de la lecture aléatoire
     *
     * @method random
     */
    random: function() {
      GUI.player.random(true);
      $( "#not-random-btn .icon" ).switchClass( "minus", "random" );
      $( "#not-random-btn" ).attr( "id", "random-btn" );
      GUI.alert("success", "Lecture aléatoire activée", 5);
    },
    /**
     * Désactivation de la répétition
     *
     * @method noRepeat
     */
    noRepeat: function() {
      GUI.player.repeat(0);
      $( "#repeat-all-btn .icon" ).switchClass( "refresh", "minus" );
      $( "#repeat-all-btn" ).attr( "id", "no-repeat-btn" );
      GUI.alert("message", "Pas de répétition", 5);
    },
    /**
     * Activation de la répétition d'un morceau
     *
     * @method repeatOne
     */
    repeatOne: function() {
      GUI.player.repeat(2);
      $( "#no-repeat-btn .icon" ).switchClass( "minus", "repeat" );
      $( "#no-repeat-btn" ).attr( "id", "repeat-one-btn" );
      GUI.alert("message", "Répétition du morceau en cours", 5);
    },
    /**
     * Activation de la répétition de tous les morceaux
     *
     * @method repeatAll
     */
    repeatAll: function() {
      GUI.player.repeat(1);
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
      GUI.player.mute(true);
      $( "#unmute-btn .icon" ).switchClass( "unmute", "mute" );
      $( "#unmute-btn" ).attr( "id", "mute-btn" );
      GUI.alert("error", "Son coupé !", 5);
    },
    /**
     * Désactivation du mode silencieux
     *
     * @method unmute
     */
    unmute: function() {
      GUI.player.mute(false);
      $( "#mute-btn .icon" ).switchClass( "mute", "unmute" );
      $( "#mute-btn" ).attr( "id", "unmute-btn" );
      GUI.alert("success", "Son rétabli !", 5);
    },
    /**
     * Sauvegarde de la playlist courante dans le local storage
     *
     * @method saveInBrowser
     */
    saveInBrowser: function() {
      var playlist = JSON.stringify(Playlist.selectedTracks);
      localStorage.setItem("playlist", playlist);
      GUI.alert("success", "Playlist sauvegardée !", 5);
    },
    /**
     * Sauvegarde de la playlist courante sur Deezer
     *
     * @method saveOnDeezer
     */
    saveOnDeezer: function() {
      if (user !== null) {
        DZ.api("user/me/playlists", "POST", {title : "HARMONEEZER"}, function(response) {
           Playlist.deezerId = response.id;
           DZ.api("playlist/" + response.id + "/tracks", "POST", {songs: Playlist.tracksIds.join()}, function(response) {
              GUI.alert("success", "Votre playlist est sur Deezer !", 5);
           });
        });
      } else {
        GUI.alert("error", "Vous n'êtes pas connecté(e) !", 5);
      }
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
      if (Playlist.selectedTracks.length > 0) {
        var message = "Voulez-vous vraiment supprimer votre playlist ?<br>";
            message += "Celle-ci sera supprimée définitivement du navigateur et sur Deezer.";
        alertify.defaults.glossary.title = "Attention !";
        // Si l'utilisateur est d'accord :
        alertify.confirm(message, function() {
          // - on supprime la playlist de la session courante
          Playlist.reset();
          // - on supprime la playlist du local storage
          if (localStorage.getItem("playlist") !== null) {
            localStorage.removeItem("playlist");
            GUI.alert("success", "Playlist effacée du navigateur !", 5);
          } else {
            GUI.alert("warning", "Playlist non sauvegardée localement", 5);
          }
          // - on supprime la playlist sur Deezer
          if (Playlist.deezerId != -1) {
            DZ.api("playlist/" + Playlist.deezerId, "DELETE", function(response) {
              GUI.alert("success", "Playlist effacée sur Deezer !", 5);
            });
          } else {
            GUI.alert("warning", "Playlist non sauvegardée sur Deezer", 5);
          }
        }).set("labels", { ok:"Oui", cancel:"Non" });
      } else {
        GUI.alert("error", "Votre playlist est vide !", 5);
      }
    },
    /**
     * Passage au morceau précédent
     *
     * @method previous
     */
    previous: function() {
      GUI.player.prev();
    },
    /**
     * Aller en arrière dans le morceau
     *
     * @method back
     */
    back: function() {
      if (GUI.player.trackPosition > 10) {
        GUI.player.trackPosition -= 10;
      }
      GUI.player.seek(GUI.player.trackPosition);
    },
    /**
     * Lire la playlist depuis le début
     *
     * @method play
     */
    play: function() {
      if (GUI.player.tracksLoaded) {
        GUI.player.play();
      } else {
        GUI.player.playTracks(Playlist.tracksIds);
        GUI.player.tracksLoaded = true;
      }
    },
    /**
     * Lire la playlist à partir d'un morceau
     *
     * @method playFrom
     */
    playFrom: function() {
      var index = parseInt($( this ).find( "#playlist-track-index" ).val());
      GUI.player.playTracks(Playlist.tracksIds, index);
    },
    /**
     * Mettre en pause un morceau
     *
     * @method pause
     */
    pause: function() {
      GUI.player.pause();
    },
    /**
     * Lecture ou pause
     *
     * @method playPause
     */
    playPause: function() {
      DZ.player.isPlaying ? GUI.playlist.pause() : GUI.playlist.play();
    },
    /**
     * Aller en avant dans le morceau
     *
     * @method back
     */
    forth: function() {
      if (GUI.player.trackPosition < 90) {
        GUI.player.trackPosition += 10;
      }
      GUI.player.seek(GUI.player.trackPosition);
    },
    /**
     * Passage au morceau suivant
     *
     * @method next
     */
    next: function() {
      GUI.player.next();
    },
    /**
     * Ajout d'un morceau à la playlist
     *
     * @method addTrack
     */
    addTrack: function(eltId) {
      var track = JSON.parse(decodeURIComponent($( "#" + eltId ).next().val()));
      Playlist.addTrack(track);
      GUI.player.tracksLoaded = false;
      GUI.alert("success", "Morceau ajouté à votre playlist", 5);
    }
  },
  /**
   * Classe interne gérant les éléments relatifs aux favoris
   *
   * @class GUI.favorites
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
     * Gestion des infobulles
     *
     * @method tooltip
     */
    tooltip: function() {
      var $tooltipState = $( "#fav-tooltip .state" );
      if (GUI.tooltipAllowed) {
        GUI.tooltipAllowed = false;
        $( "[title != '']" ).popup( "destroy" ); // Semantic UI
        $( "[title != '']" ).qtip( "destroy", true ); // qTip²
      } else {
        GUI.tooltipAllowed = true;
        GUI.tooltips();
      }
      GUI.favorites.changeState($tooltipState, "Infobulles activées !", "Infobulles désactivées !");
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
     * Gestion de l'autocomplétion
     *
     * @method autocomplete
     */
    autocomplete: function() {
      var $autocompleteState = $( "#fav-autocomplete .state" );
      if (GUI.autocompleteAllowed) {
        $( "#autocomplete" ).fadeOut();
        GUI.autocompleteAllowed = false
      } else {
        GUI.autocompleteAllowed = true
      }
      GUI.favorites.changeState($autocompleteState, "Autocomplétion activée !", "Autocomplétion désactivée !");
    },
    /**
     * Gestion des doublons dans les suggestions
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
   * @class GUI.atmospheres
   */
  atmospheres: {
    /**
     * Initialisation du plugin Vegas pour les backgrounds animés
     *
     * @method vegas
     */
    backgrounds: function() {
      $( "#main" ).vegas({
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
          animation: 'kenburns'
      });
      $( "#main" ).vegas('pause');
    },
    /**
     * Changement d'ambiance
     *
     * @method apply
     * @param {Number} index Indice de l'ambiance dans Vegas
     * @param {String} atmo Nom de l'ambiance
     */
    apply: function(index, atmo) {
      $( "#" + atmo + "-atmo" ).addClass( "green-item" );
      $( "#" + atmo + "-atmo" ).siblings().removeClass( "green-item" );
      $( "#main" ).vegas("jump", index);
      // $( ".pusher" ).attr( "style", "background:url('images/background/" + atmo + ".jpg') no-repeat center center fixed !important" );
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
      GUI.atmospheres.apply(0, "neutral");
    },
    /**
     * Ambiance Rock
     *
     * @method rock
     */
    rock: function() {
      GUI.atmospheres.apply(1, "rock");
    },
    /**
     * Ambiance Electro
     *
     * @method electro
     */
    electro: function() {
      GUI.atmospheres.apply(2, "electro");
    },
    /**
     * Ambiance Hip-Hop
     *
     * @method hiphop
     */
    hiphop: function() {
      GUI.atmospheres.apply(3, "hiphop");
    },
    /**
     * Ambiance Folk
     *
     * @method folk
     */
    folk: function() {
      GUI.atmospheres.apply(4, "folk");
    },
    /**
     * Ambiance Classique
     *
     * @method classical
     */
    classical: function() {
      GUI.atmospheres.apply(5, "classical");
    },
    /**
     * Ambiance Jazz
     *
     * @method jazz
     */
    jazz: function() {
      GUI.atmospheres.apply(6, "jazz");
    },
    /**
     * Ambiance Metal
     *
     * @method metal
     */
    metal: function() {
      GUI.atmospheres.apply(7, "metal");
    }
  },
  /**
   * Classe interne gérant les éléments relatifs au compte utilisateur
   *
   * @class GUI.account
   */
  account: {
    /**
     * Vérification visant à connaître le statut de connexion
     *
     * @method status
     */
    status: function() {
      DZ.getLoginStatus(function(response) {
      	if (response.authResponse) {
          GUI.account.info();
      	}
      });
    },
    /**
     * Gestion de la connexion d'un utilisateur
     *
     * @method login
     */
    login: function() {
      if (GUI.user === null) {
        DZ.login(function(response) {
          if (response.authResponse && response.status == "connected") { // Si tout se passe bien
            GUI.account.info();
            GUI.alert("success", "Connexion OK !", 3);
            GUI.menu.toggleSidebar( "#user", "maroon" );
          } else { // Si la connexion échoue
            GUI.alert("error", "Connexion refusée !", 5);
          }
        }, { perms: "basic_access,manage_library,delete_library" });
      }
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
    },
    /**
     * Récupération des informations d'un utilisateur
     *
     * @method info
     */
    info: function() {
      DZ.api("/user/me", function(response) {
        var user = new User(
                              response.id,
                              response.name,
                              response.inscription_date,
                              response.link,
                              response.picture_small
                            );
        GUI.user = user;
        $( "#user-img" ).attr({ src:user.getPicture(), alt:user.getName() });
        $( "#user-name" ).text( user.getName() ).attr( "href", user.getLink() );
        $( "#user-date" ).text( "Inscrit le " + user.getInscriptionDate() );
        $( "#user-not-connected" ).hide();
        $( "#user-connected" ).show();
      });
    }
  },
  /**
   * Classe interne gérant divers événements
   *
   * @class GUI.misc
   */
  misc: {
    /**
     * Gestion du clic sur le logo
     *
     * @method logo
     */
    logo: function() {
      GUI.misc.showModal( $( "#about" ) );
    },
    /**
     * Gestion du clic sur la case d'aide
     *
     * @method help
     */
    help: function() {
      GUI.misc.showModal( $( "#help" ) );
    },
    /**
     * Affichage d'une boîte modale
     *
     * @method showModal
     */
    showModal: function($selector) {
      $selector.modal( "show" );
    }
  }
}

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/GUI.js","/../../app/js/modules")
},{"./Player.js":5,"./Playlist.js":6,"./User.js":8,"buffer":10,"oMfpAn":13}],3:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Iterator.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],4:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Music.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Module encapsulant le lecteur audio fourni par Deezer (DZ.player).
 * La classe qu'il contient est à la fois un Singleton et un Adapter.
 *
 * @module Player
 * @class Player
 */
module.exports = Player = (function() {

  /**
   * Attribut (privé) représentant une instance de la classe elle-même (cf. Singleton)
   *
   * @property player
   * @type {Object}
   * @default undefined
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
         * Attribut indiquant si les morceaux sont chargés dans le lecteur
         *
         * @property tracksLoaded
         * @type {Boolean}
         * @default false
         */
        this.tracksLoaded = false,
        /**
         * Attribut indiquant la position de la tête de lecture dans le morceau en cours
         * La valeur se situe entre 0 et 100.
         *
         * @property trackPosition
         * @type {Number}
         * @default 0
         */
        this.trackPosition = 0,
        /**
         * Méthode effectuant réellement l'initialisation
         *
         * @method init
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
        },
        /**
         * Chargement et lecture des morceaux
         *
         * @method playTracks
         * @param {Array} ids Tableau contenant les identifiants des morceaux
         * @param {Number} index Indice du premier morceau
         */
        this.playTracks = function(ids, index) {
          DZ.player.playTracks(ids, index);
        },
        /**
         * Lecture
         *
         * @method play
         */
        this.play = function() {
          DZ.player.play();
        },
        /**
         * Pause
         *
         * @method pause
         */
        this.pause = function() {
          DZ.player.pause();
        },
        /**
         * Suivant
         *
         * @method suivant
         */
        this.next = function() {
          DZ.player.next();
        },
        /**
         * Précédent
         *
         * @method prev
         */
        this.prev = function() {
          DZ.player.prev();
        },
        /**
         * Aller à...
         *
         * @method seek
         * @param {Number} pos Position de la tête de lecture (entre 0 et 100)
         */
        this.seek = function(pos) {
          DZ.player.seek(pos);
        },
        /**
         * Activer/Désactiver le son
         *
         * @method mute
         * @param {Boolean} isMute Vrai ou faux
         */
        this.mute = function(isMute) {
          DZ.player.setMute(isMute);
        },
        /**
         * Activer/Désactiver la lecture aléatoire
         *
         * @method random
         * @param {Boolean} isRandom Vrai ou faux
         */
        this.random = function(isRandom) {
          DZ.player.setShuffle(isRandom);
        },
        /**
         * Activer/Désactiver la lecture répétée
         *
         * @method repeat
         * @param {Number} code 0 (no repeat), 1 (repeat all), ou 2 (repeat one)
         */
        this.repeat = function(code) {
          DZ.player.setRepeat(code);
        }
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Player.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Module encapsulant le lecteur audio fourni par Deezer
 * Le module s'appuie sur le modèle MVVM de Vue.js.
 *
 * @module Playlist
 * @class Playlist
 */
module.exports = Playlist = new Vue({
  el: "#app",
  data: {
    /**
     * Attribut représentant l'id de la playlist sur Deezer
     *
     * @property deezerId
     * @type {Number}
     * @default -1
     */
    deezerId: -1,
    /**
     * Attribut représentant la liste des morceaux sous forme d'identifiants Deezer
     *
     * @property tracksIds
     * @type {Array}
     * @default []
     */
    tracksIds: [],
    /**
     * Attribut représentant la liste des morceaux sous forme d'objets Track
     *
     * @property selectedTracks
     * @type {Array}
     * @default []
     */
    selectedTracks: []
  },
  methods: {
    /**
     * Ajout d'un morceau à la playlist
     *
     * @method addTrack
     * @param {Object} track Objet Track
     */
    addTrack: function(track) {
      this.tracksIds.push(track._id);
      this.selectedTracks.push(track);
    },
    /**
     * Suppression d'un morceau de la playlist
     *
     * @method removeTrack
     * @param {Number} i Index du morceau dans la playlist
     */
    removeTrack: function(i) {
      this.tracksIds.splice(i, 1);
      this.selectedTracks.splice(i, 1);
    },
    /**
     * Réinitialiser la playlist
     *
     * @method reset
     */
    reset: function() {
      this.tracksIds = [];
      this.selectedTracks = [];
    }
  }
});

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Playlist.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],7:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Sorting.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/User.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],9:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../app/js/modules/Vocabulary.js","/../../app/js/modules")
},{"buffer":10,"oMfpAn":13}],10:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"base64-js":11,"buffer":10,"ieee754":12,"oMfpAn":13}],11:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"buffer":10,"oMfpAn":13}],12:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"buffer":10,"oMfpAn":13}],13:[function(require,module,exports){
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

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"buffer":10,"oMfpAn":13}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Vocabulary = require('../../app/js/modules/Vocabulary.js'),
    Iterator = require('../../app/js/modules/Iterator.js'),
    Music = require('../../app/js/modules/Music.js'),
    Ajax = require('../../app/js/modules/Ajax.js'),
    Sorting = require('../../app/js/modules/Sorting.js'),
    Player = require('../../app/js/modules/Player'),
    Playlist = require('../../app/js/modules/Playlist'),
    User = require('../../app/js/modules/User'),
    // Le module GUI n'est pas vraiment testé ici. Voir les tests fonctionnels.
    GUI = require('../../app/js/modules/GUI');

/* ========================================================================== */

QUnit.test( "Vocabulary", function( assert ) {
  assert.expect( 4 );

  var mode = Vocabulary.modes[0],
      key = Vocabulary.keys[9]
      harmonicMix = Vocabulary.harmonicMix[mode][key].tag,
      camelotWheel = Vocabulary.camelotWheel[harmonicMix].matches;

  assert.deepEqual(mode, "mineur", "Mode : mineur");
  assert.deepEqual(key, "la", "Tonalité : La");
  assert.deepEqual(harmonicMix, "8A", "Tag sur la roue de Camelot");
  assert.deepEqual(camelotWheel, ["8A", "7A", "9A", "8B"], "Harmonies possibles sur la roue de Camelot");
});

/* ========================================================================== */

QUnit.test( "Iterator", function( assert ) {
  assert.expect( 8 );

  var collection = ["Toto", "Tata", "Titi"],
      iterator = new Iterator(collection);

  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Toto", "Première itération");
  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Tata", "Deuxième itération");
  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Titi", "Troisième itération");
  assert.notOk(iterator.hasNext(), "Pas d'élément suivant");
  assert.throws(
    function() {
      Iterator(collection);
    },
    Error,
    "Erreur ! La classe Iterator doit être instanciée avec l'opérateur « new »"
  );
});

/* ========================================================================== */

QUnit.test( "Music", function( assert ) {
  assert.expect( 5 );

  var id = 1234567,
      title = "Far Beyond The Sun",
      artist = "Yngwie Malmsteen",
      cover = "rising-force.png",
      key = "fa",
      mode = "mineur",
      tempo = 125,
      camelotTag = "4A",
      harmonies = ["4A", "3A", "5A", "4B"],
      tempoVariation = 0.05,
      isActive = true,
      track = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies),
      harmony = new Music.Harmony(track, tempoVariation, isActive);

  assert.equal(track.getTitle(), "Far Beyond The Sun", "Titre du morceau");
  assert.ok(track.getHarmonies() instanceof Array, "Harmonies possibles");
  assert.equal(harmony.getTrack().getTempo(), 125, "Tempo du morceau de référence au sein d'une harmonie");
  assert.throws(
    function() {
      Music.Track(title, artist, cover, key, mode, tempo, camelotTag, harmonies);
    },
    Error,
    "Erreur ! La classe Track doit être instanciée avec l'opérateur « new »"
  );
  assert.throws(
    function() {
      Music.Harmony(track, tempoVariation, isActive);
    },
    Error,
    "Erreur ! La classe Harmony doit être instanciée avec l'opérateur « new »"
  );
});

/* ========================================================================== */

QUnit.test( "Ajax", function( assert ) {
  assert.expect( 4 );

  var requestFactory = new Ajax.RequestFactory(),
      deezerRequest = requestFactory.getAjaxRequest("deezer", ""),
      echonestRequest = requestFactory.getAjaxRequest("echonest", "");

  assert.ok(deezerRequest instanceof Ajax.Request, "Instance de Request");
  assert.ok(echonestRequest instanceof Ajax.Request, "Instance de Request");
  assert.ok(deezerRequest instanceof Ajax.DeezerAPIRequest, "Instance de DeezerAPIRequest");
  assert.ok(echonestRequest instanceof Ajax.EchoNestAPIRequest, "Instance de EchoNestAPIRequest");
});

/* ========================================================================== */

QUnit.test( "Sorting", function( assert ) {
  assert.expect( 23 );

  var sortingStrategy = new Sorting.Strategy(),
      defaultSorting = new Sorting.Default(),
      tempoFirstSorting = new Sorting.TempoFirst(),
      keyFirstSorting = new Sorting.KeyFirst(),
      ascTempoSorting = new Sorting.AscendingTempo(),
      descTempoSorting = new Sorting.DescendingTempo(),
      noSorting = new Sorting.None();

  assert.equal(sortingStrategy.getAlgorithm(), undefined, "Stratégie de tri non définie");
  sortingStrategy.setAlgorithm(defaultSorting);
  assert.ok(sortingStrategy.getAlgorithm() instanceof Sorting.Default, "Affectation d'une stratégie de tri");

  var id = 1,
      title = "Titre 1",
      artist = "Artiste 1",
      cover = "cover-1.png",
      key = "note 1",
      mode = "mode 1",
      tempo = 145,
      camelotTag = "Tag 1",
      harmonies = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
      track1 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 2,
      title = "Titre 2",
      artist = "Artiste 2",
      cover = "cover-2.png",
      key = "note 2",
      mode = "mode 2",
      tempo = 150,
      camelotTag = "Tag 2",
      harmonies = [],
      track2 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 3,
      title = "Titre 3",
      artist = "Artiste 3",
      cover = "cover-3.png",
      key = "note 3",
      mode = "mode 3",
      tempo = 100,
      camelotTag = "Tag 5",
      harmonies = [],
      track3 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 4,
      title = "Titre 4",
      artist = "Artiste 4",
      cover = "cover-4.png",
      key = "note 4",
      mode = "mode 4",
      tempo = 200,
      camelotTag = "Tag 4",
      harmonies = [],
      track4 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 5,
      title = "Titre 5",
      artist = "Artiste 5",
      cover = "cover-5.png",
      key = "note 5",
      mode = "mode 5",
      tempo = 140,
      camelotTag = "Tag 6",
      harmonies = [],
      track5 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var tempoVariation = 0.05,
      isActive = true,
      harmony = new Music.Harmony(track1, tempoVariation, isActive);

  var similarTracks = [track2, track3, track4, track5],
      sortedTracks = null;

  sortingStrategy.setAlgorithm(defaultSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "Tri par défaut (1/4)");
  assert.equal(sortedTracks[1], track5, "Tri par défaut (2/4)");
  assert.equal(sortedTracks[2], track4, "Tri par défaut (3/4)");
  assert.equal(sortedTracks[3], track3, "Tri par défaut (4/4)");

  sortingStrategy.setAlgorithm(tempoFirstSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "« Tempo First » (1/4)");
  assert.equal(sortedTracks[1], track5, "« Tempo First » (2/4)");
  assert.equal(sortedTracks[2], track4, "« Tempo First » (3/4)");
  assert.equal(sortedTracks[3], track3, "« Tempo First » (4/4)");

  sortingStrategy.setAlgorithm(keyFirstSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "« Key First » (1/4)");
  assert.equal(sortedTracks[1], track4, "« Key First » (2/4)");
  assert.equal(sortedTracks[2], track5, "« Key First » (3/4)");
  assert.equal(sortedTracks[3], track3, "« Key First » (4/4)");

  sortingStrategy.setAlgorithm(ascTempoSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track3, "Tri croissant selon le tempo (1/4)");
  assert.equal(sortedTracks[1], track5, "Tri croissant selon le tempo (2/4)");
  assert.equal(sortedTracks[2], track2, "Tri croissant selon le tempo (3/4)");
  assert.equal(sortedTracks[3], track4, "Tri croissant selon le tempo (4/4)");

  sortingStrategy.setAlgorithm(descTempoSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track4, "Tri décroissant selon le tempo (1/4)");
  assert.equal(sortedTracks[1], track2, "Tri décroissant selon le tempo (2/4)");
  assert.equal(sortedTracks[2], track5, "Tri décroissant selon le tempo (3/4)");
  assert.equal(sortedTracks[3], track3, "Tri décroissant selon le tempo (4/4)");

  sortingStrategy.setAlgorithm(noSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.deepEqual(sortedTracks, similarTracks, "Aucun tri");
});

/* ========================================================================== */

QUnit.test( "Player", function( assert ) {
  assert.expect( 1 );

  var player1 = Player.getPlayer(),
      player2 = Player.getPlayer();

  assert.deepEqual(player2, player1, "Une seule instance de Player est délivrée (Singleton)");
});

/* ========================================================================== */

QUnit.test( "Playlist", function( assert ) {
  assert.expect( 7 );

  var id = 1234567,
      title = "Far Beyond The Sun",
      artist = "Yngwie Malmsteen",
      cover = "rising-force.png",
      key = "fa",
      mode = "mineur",
      tempo = 125,
      camelotTag = "4A",
      harmonies = ["4A", "3A", "5A", "4B"],
      track = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  assert.ok(Playlist.selectedTracks.length == 0, "La playlist est vide à l'initialisation (1/2)");
  assert.ok(Playlist.tracksIds.length == 0, "La playlist est vide à l'initialisation (2/2)");

  Playlist.addTrack(track);
  assert.notOk(Playlist.selectedTracks.length == 0, "La playlist est mise à jour lors d'un ajout (1/2)");
  assert.notOk(Playlist.tracksIds.length == 0, "La playlist est mise à jour lors d'un ajout (2/2)");
  assert.equal(Playlist.selectedTracks[0].getTitle(), "Far Beyond The Sun", "Le morceau est chargé dans la playlist");

  Playlist.removeTrack(0);
  assert.ok(Playlist.selectedTracks.length == 0, "La playlist est mise à jour lors d'une suppression (1/2)");
  assert.ok(Playlist.tracksIds.length == 0, "La playlist est mise à jour lors d'une suppression (2/2)");
});

/* ========================================================================== */

QUnit.test( "User", function( assert ) {
  assert.expect( 3 );

  var id = 1,
      name = "Toto",
      inscriptionDate = "01/01/2000",
      link = "http://www.url.com",
      picture = "http://www.url.com/image",
      user = new User(id, name, inscriptionDate, link, picture);

  assert.ok(user instanceof User, "Utilisateur créé");
  assert.equal(user.getName(), name, "Hydratation OK");
  assert.throws(
    function() {
      User(id, name, inscriptionDate, link, picture)
    },
    Error,
    "Erreur ! La classe User doit être instanciée avec l'opérateur « new »"
  );

});

}).call(this,require("oMfpAn"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_7a54c165.js","/")
},{"../../app/js/modules/Ajax.js":1,"../../app/js/modules/GUI":2,"../../app/js/modules/Iterator.js":3,"../../app/js/modules/Music.js":4,"../../app/js/modules/Player":5,"../../app/js/modules/Playlist":6,"../../app/js/modules/Sorting.js":7,"../../app/js/modules/User":8,"../../app/js/modules/Vocabulary.js":9,"buffer":10,"oMfpAn":13}]},{},[14])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9BamF4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL2FwcC9qcy9tb2R1bGVzL0l0ZXJhdG9yLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvU29ydGluZy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVXNlci5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvdGVzdC91bml0VGVzdGluZy9mYWtlXzdhNTRjMTY1LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGZvdXJuaXNzYW50IHVuZSBhcmNoaXRlY3R1cmUgcsOpdXRpbGlzYWJsZSBwb3VyIGfDqXJlciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAqXG4gKiBAbW9kdWxlIEFqYXhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBBamF4ID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGfDqW7DqXJpcXVlIHBvdXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gICAqXG4gICAqIEBjbGFzcyBSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIGRlIHJlcXXDqnRlIChHRVQgb3UgUE9TVClcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkwgZGUgcmVxdcOqdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFUeXBlIFR5cGUgZGUgZG9ubsOpZXMgcmVudm95w6llcyAoSlNPTiwgWE1MLCAuLi4pXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFBhcmFtw6h0cmVzIGRlIHJlcXXDqnRlXG4gICAqL1xuICBSZXF1ZXN0OiBmdW5jdGlvbih0eXBlLCB1cmwsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgLyoqXG4gICAgICogVHlwZSBkZSByZXF1w6p0ZSAoR0VUIG91IFBPU1QpXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgdHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIC8qKlxuICAgICAqIFVSTCBkZSByZXF1w6p0ZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHVybFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX3VybCA9IHVybDtcbiAgICAvKipcbiAgICAgKiBUeXBlIGRlIGRvbm7DqWVzIHJlbnZvecOpZXMgKEpTT04sIFhNTCwgLi4uKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRhdGFUeXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fZGF0YVR5cGUgPSBkYXRhVHlwZTtcbiAgICAvKipcbiAgICAgKiBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRhdGFcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IHt9XG4gICAgICovXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpcmFudCBsZXMgcmVxdcOqdGVzIEFqYXggdmVycyBsJ0FQSSBkZSBEZWV6ZXJcbiAgICpcbiAgICogQGNsYXNzIERlZXplckFQSVJlcXVlc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBleHRlbmRzIFJlcXVlc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAqL1xuICBEZWV6ZXJBUElSZXF1ZXN0OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBBamF4LlJlcXVlc3QuY2FsbCh0aGlzLCBcIkdFVFwiLCBcImh0dHA6Ly9hcGkuZGVlemVyLmNvbVwiICsgcGF0aCwgXCJqc29ucFwiLCB7IFwib3V0cHV0XCI6IFwianNvbnBcIiB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheCB2ZXJzIGwnQVBJIGQnRWNobyBOZXN0XG4gICAqXG4gICAqIEBjbGFzcyBFY2hvTmVzdEFQSVJlcXVlc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBleHRlbmRzIFJlcXVlc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAqL1xuICBFY2hvTmVzdEFQSVJlcXVlc3Q6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIEFqYXguUmVxdWVzdC5jYWxsKHRoaXMsIFwiR0VUXCIsIFwiaHR0cDovL2RldmVsb3Blci5lY2hvbmVzdC5jb20vYXBpL3Y0XCIgKyBwYXRoLCBcImpzb25wXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJhcGlfa2V5XCI6IFwiVlVTVUExSE40SE1XVUlONVBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmb3JtYXRcIjogXCJqc29ucFwiXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBjb25zdHJ1aXNhbnQgw6AgbGEgZGVtYW5kZSBkZXMgcmVxdcOqdGVzIEFqYXggZCd1biBjZXJ0YWluIHR5cGVcbiAgICpcbiAgICogQGNsYXNzIFJlcXVlc3RGYWN0b3J5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgUmVxdWVzdEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnaW5zdGFuY2llciBsZXMgY2xhc3NlcyBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheFxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBamF4UmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhcGkgQVBJIMOgIGludGVycm9nZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuIG9iamV0IGRlIHR5cGUgQWpheFxuICAgICAqL1xuICAgICAgdGhpcy5nZXRBamF4UmVxdWVzdCA9IGZ1bmN0aW9uKGFwaSwgcGF0aCkge1xuICAgICAgICAgIHZhciBhamF4UmVxdWVzdDtcbiAgICAgICAgICBpZiAoYXBpID09PSBcImRlZXplclwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRGVlemVyQVBJUmVxdWVzdChwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFwaSA9PT0gXCJlY2hvbmVzdFwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRWNob05lc3RBUElSZXF1ZXN0KHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWpheFJlcXVlc3Q7XG4gICAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgbcOocmUgOiBBamF4XG4gKi9cbiBBamF4LlJlcXVlc3QucHJvdG90eXBlID0ge1xuICAgLyoqXG4gICAgKiBNw6l0aG9kZSBwZXJtZXR0YW50IGQnYWpvdXRlciB1biBwYXJhbcOodHJlIMOgIGxhIHJlcXXDqnRlXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRQYXJhbVxuICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBDbMOpIGR1IHBhcmFtw6h0cmVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBWYWxldXIgZHUgcGFyYW3DqHRyZVxuICAgICovXG4gICBhZGRQYXJhbTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgIH0sXG4gICAvKipcbiAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnZW52b3llciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNlbmRcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1Y2Nlc3MgRm9uY3Rpb24gw6AgZXjDqWN1dGVyIGF1IHN1Y2PDqHMgZGUgbGEgcmVxdcOqdGVcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yIEZvbmN0aW9uIMOgIGV4w6ljdXRlciBsb3JzIGQndW5lIGVycmV1ciBkYW5zIGxhIHJlcXXDqnRlXG4gICAgKi9cbiAgIHNlbmQ6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgICQuYWpheCh7XG4gICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxuICAgICAgICAgdXJsOiB0aGlzLl91cmwsXG4gICAgICAgICBkYXRhVHlwZTogdGhpcy5fZGF0YVR5cGUsXG4gICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgICAgICAgdHJhZGl0aW9uYWw6IHRydWUsXG4gICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgIH0sXG4gICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgZXJyb3IocmVzcG9uc2UpO1xuICAgICAgICAgfVxuICAgICB9KTtcbiAgIH1cbiB9O1xuXG4vKipcbiAqIENsb25hZ2UgZGUgcHJvdG90eXBlIHBvdXIgY3LDqWVyIGRlcyBjbGFzc2VzIGZpbGxlc1xuICovXG5BamF4LkRlZXplckFQSVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBamF4LlJlcXVlc3QucHJvdG90eXBlKTtcbkFqYXguRGVlemVyQVBJUmVxdWVzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBamF4LkRlZXplckFQSVJlcXVlc3Q7XG5cbkFqYXguRWNob05lc3RBUElSZXF1ZXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWpheC5SZXF1ZXN0LnByb3RvdHlwZSk7XG5BamF4LkVjaG9OZXN0QVBJUmVxdWVzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBamF4LkVjaG9OZXN0QVBJUmVxdWVzdDtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9hcHAvanMvbW9kdWxlcy9BamF4LmpzXCIsXCIvLi4vLi4vYXBwL2pzL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi9QbGF5ZXIuanMnKSxcbiAgICBQbGF5bGlzdCA9IHJlcXVpcmUoJy4vUGxheWxpc3QuanMnKSxcbiAgICBVc2VyID0gcmVxdWlyZSgnLi9Vc2VyLmpzJyk7XG5cbi8qKlxuICogTW9kdWxlIGfDqXJhbnQgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlXG4gKlxuICogQG1vZHVsZSBHVUlcbiAqIEBjbGFzcyBHVUlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBHVUkgPSB7XG4gIC8qKlxuICAgKiBMZWN0ZXVyIG1hbmlwdWzDqSBwYXIgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlLlxuICAgKiBDJ2VzdCDDoCBsYSBmb2lzIHVuIFNpbmdsZXRvbiBldCB1biBBZGFwdGVyLlxuICAgKlxuICAgKiBAcHJvcGVydHkgcGxheWVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHBsYXllcjogbnVsbCxcbiAgLyoqXG4gICAqIFV0aWxpc2F0ZXVyIGNvdXJhbnRcbiAgICpcbiAgICogQHByb3BlcnR5IHVzZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgdXNlcjogbnVsbCxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgaW5mb2J1bGxlcyBzb250IGF1dG9yaXPDqWVzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB0b29sdGlwQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgdG9vbHRpcEFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIG5vdGlmaWNhdGlvbnMgc29udCBhdXRvcmlzw6llc1xuICAgKlxuICAgKiBAcHJvcGVydHkgbm90aWZBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBub3RpZkFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIHNvbnMgZCdhbWJpYW5jZSBzb250IGF1dG9yaXPDqXNcbiAgICpcbiAgICogQHByb3BlcnR5IHNvdW5kQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgc291bmRBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGwnYXV0b2NvbXBsw6l0aW9uIGVzdCBhdXRvcmlzw6llIGRhbnMgbGEgcmVjaGVyY2hlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBhdXRvY29tcGxldGVBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBhdXRvY29tcGxldGVBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBkb3VibG9ucyBzb250IGF1dG9yaXPDqXMgZGFucyBsZXMgc3VnZ2VzdGlvbnNcbiAgICpcbiAgICogQHByb3BlcnR5IGR1cGxpY2F0ZXNBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZHVwbGljYXRlc0FsbG93ZWQ6IGZhbHNlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IGxhIHZhcmlhdGlvbiBjb3VyYW50ZSBkdSB0ZW1wbyAoZW50cmUgMCBldCAxKVxuICAgKlxuICAgKiBAcHJvcGVydHkgdGVtcG9WYXJpYXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMC4wNVxuICAgKi9cbiAgdGVtcG9WYXJpYXRpb246IDAuMDUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBzw6lsZWN0aW9ubsOpXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBzZWxlY3RlZFNvcnRpbmdcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJkZWZhdWx0XCJcbiAgICovXG4gIHNlbGVjdGVkU29ydGluZzogXCJkZWZhdWx0XCIsXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBjaGFyZ8OpZSBkJ2luaXRpYWxpc2VyIGwnaW50ZXJmYWNlIGdyYXBoaXF1ZS5cbiAgICogQ2V0dGUgbcOpdGhvZGUgcydpbnNwaXJlIGR1IHBhdHRlcm4gVGVtcGxhdGUgZGFucyBzYSBjb25jZXB0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICovXG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIEdVSS5hdG1vc3BoZXJlcy5iYWNrZ3JvdW5kcygpOyAvLyBQb3NpdGlvbiBpZMOpYWxlIHBvdXIgw6l2aXRlciBsZXMgYnVncyAhP1xuICAgIEdVSS5jc3MoKTtcbiAgICBHVUkuY2Fyb3VzZWwoKTtcbiAgICBHVUkuZHJhZygpO1xuICAgIEdVSS50b29sdGlwcygpO1xuICAgIEdVSS5jaGVja2JveGVzKCk7XG4gICAgR1VJLmxpc3RlbmVycygpO1xuICAgIEdVSS5zY3JvbGwuaW5pdCgpO1xuICAgIEdVSS5wbGF5bGlzdC5yZXRyaWV2ZSgpO1xuICAgIEdVSS5wbGF5ZXIgPSBQbGF5ZXIuZ2V0UGxheWVyKCk7XG4gICAgR1VJLnBsYXllci5pbml0KCk7XG4gICAgR1VJLmFjY291bnQuc3RhdHVzKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBIYWNrcyBDU1NcbiAgICpcbiAgICogQG1ldGhvZCBjc3NcbiAgICovXG4gIGNzczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIucHVzaGVyXCIgKS5jc3MoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICAgIGlmICgkKCB3aW5kb3cgKS53aWR0aCgpIDw9IDYwMCkge1xuICAgICAgJCggXCIjbWVudVwiICkuc3dpdGNoQ2xhc3MoIFwiZml2ZVwiLCBcImZvdXJcIiApO1xuICAgICAgR1VJLnRvb2x0aXBBbGxvd2VkID0gZmFsc2U7XG4gICAgICBHVUkubm90aWZBbGxvd2VkID0gZmFsc2U7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnN3aXRjaENsYXNzKCBcImZvdXJcIiwgXCJmaXZlXCIgKTtcbiAgICAgIEdVSS50b29sdGlwQWxsb3dlZCA9IHRydWU7XG4gICAgICBHVUkubm90aWZBbGxvd2VkID0gdHJ1ZTtcbiAgICAgIEdVSS5zb3VuZEFsbG93ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGR1IGNhcm91c2VsIGNvbnRlbmFudCBsZXMgcsOpc3VsdGF0cyBkZSByZWNoZXJjaGUuXG4gICAqIExlIGNhcm91c2VsIGVzdCBnw6lyw6kgcGFyIGxlIHBsdWdpbiBPV0wgQ2Fyb3VzZWwuXG4gICAqXG4gICAqIEBtZXRob2QgY2Fyb3VzZWxcbiAgICovXG4gIGNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiN0cmFja3NcIiApLm93bENhcm91c2VsKHtcbiAgICAgIGl0ZW1zOiAxMCxcbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgYXV0b1BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVRpbWVvdXQ6IDEwMCxcbiAgICAgIHN0b3BPbkhvdmVyOiB0cnVlLFxuICAgICAgbGF6eUxvYWQgOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkdSBkcmFnICYgZHJvcCBzdXIgbCdpUG9kLlxuICAgKiBMZSBkcmFnICYgZHJvcCBlc3QgZ8OpcsOpIHBhciBqUXVlcnkgVUkuXG4gICAqXG4gICAqIEBtZXRob2QgZHJhZ1xuICAgKi9cbiAgZHJhZzogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjaXBvZC13cmFwcGVyXCIgKS5kcmFnZ2FibGUoeyBzY3JvbGw6IGZhbHNlIH0pO1xuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIHRvb2x0aXBzLlxuICAgKiBMZXMgdG9vbHRpcHMgc29udCBnw6lyw6llcyBwYXIgU2VtYW50aWMgVUkgZXQgcVRpcMKyLlxuICAgKlxuICAgKiBAbWV0aG9kIHRvb2x0aXBzXG4gICAqL1xuICB0b29sdGlwczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKEdVSS50b29sdGlwQWxsb3dlZCkge1xuICAgICAgJCggXCJbZGF0YS10aXRsZSAhPSAnJ10sIFtkYXRhLWNvbnRlbnQgIT0gJyddXCIgKS5wb3B1cCgpOyAvLyBTZW1hbnRpYyBVSVxuICAgICAgJCggZG9jdW1lbnQgKS50b29sdGlwKHsgLy8galF1ZXJ5IFVJXG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgbXk6IFwiY2VudGVyIHRvcFwiLFxuICAgICAgICAgIGF0OiBcImNlbnRlciBib3R0b20rNVwiLFxuICAgICAgICAgIHdpdGhpbjogXCIjaXBvZC13cmFwcGVyXCJcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGRlcyBjaGVja2JveGVzLlxuICAgKiBMZXMgY2hlY2tib3hlcyBzb250IGfDqXLDqWVzIHBhciBTZW1hbnRpYyBVSS5cbiAgICpcbiAgICogQG1ldGhvZCBjaGVja2JveGVzXG4gICAqL1xuICBjaGVja2JveGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLmNoZWNrYm94XCIgKS5jaGVja2JveCgpO1xuICB9LFxuICAvKipcbiAgICogRMOpZmluaXRpb24gZGUgdG91cyBsZXMgw6ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50c1xuICAgKlxuICAgKiBAbWV0aG9kIGxpc3RlbmVyc1xuICAgKi9cbiAgbGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGVzIHNpZGViYXJzXG4gICAgdmFyIG1lbnVFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIudG9nZ2xlLW1lbnVcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVBsYXlsaXN0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXZvcml0ZXMtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlRmF2b3JpdGVzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNhdG1vc3BoZXJlcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBdG1vc3BoZXJlc10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjaGFybW9uaWMtdHJhY2tzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZUhhcm1vbmljVHJhY2tzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN1c2VyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVVzZXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1hbGxcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBbGxdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGUgbGEgcGxheWxpc3RcbiAgICB2YXIgcGxheWxpc3RFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JhbmRvbS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Qubm90UmFuZG9tLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNub3QtcmFuZG9tLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yYW5kb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JlcGVhdC1hbGwtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5vUmVwZWF0LCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNuby1yZXBlYXQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJlcGVhdE9uZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmVwZWF0LW9uZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVwZWF0QWxsLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtdXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC51bm11dGUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3VubXV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubXV0ZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1icm93c2VyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5zYXZlSW5Ccm93c2VyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1kZWV6ZXItYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnNhdmVPbkRlZXplcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2V4cG9ydC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuZXhwb3J0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZGVsZXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5kZWxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5wcmV2aW91cy1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucHJldmlvdXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5iYWNrLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5iYWNrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheWxpc3QtaXRlbVwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wbGF5RnJvbSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGF1c2UtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnBhdXNlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1wYXVzZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheVBhdXNlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIuZm9ydGgtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmZvcnRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIubmV4dC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubmV4dF1cbiAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZXMgZmF2b3Jpc1xuICAgIHZhciBmYXZvcml0ZXNFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtaXBvZFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuaXBvZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtdG9vbHRpcFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMudG9vbHRpcF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtbm90aWZ5XCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5ub3RpZnldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LXNvdW5kXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5zb3VuZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtYXV0b2NvbXBsZXRlXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hdXRvY29tcGxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWR1cGxpY2F0ZVwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZHVwbGljYXRlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1yYW5nZVwiLCBcImlucHV0XCIsIEdVSS5mYXZvcml0ZXMudGVtcG9SYW5nZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZGVmYXVsdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kZWZhdWx0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtdGVtcG8tZmlyc3Qtc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMudGVtcG9GaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWtleS1maXJzdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5rZXlGaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWFzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hc2NUZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWRlc2MtdGVtcG8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZGVzY1RlbXBvU29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtbm8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMubm9Tb3J0aW5nXVxuICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBhbWJpYW5jZXNcbiAgICB2YXIgYXRtb3NwaGVyZXNFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbmV1dHJhbC1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLm5ldXRyYWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JvY2stYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5yb2NrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNlbGVjdHJvLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZWxlY3Ryb10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjaGlwaG9wLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuaGlwaG9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmb2xrLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZm9sa10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjY2xhc3NpY2FsLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuY2xhc3NpY2FsXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNqYXp6LWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuamF6el0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbWV0YWwtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5tZXRhbF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyByZWxhdGlmcyBhdSBjb21wdGUgdXRpbGlzYXRldXJcbiAgICB2YXIgdXNlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dpblwiLCBcImNsaWNrXCIsIEdVSS5hY2NvdW50LmxvZ2luXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvdXRcIiwgXCJjbGlja1wiLCBHVUkuYWNjb3VudC5sb2dvdXRdLFxuICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRpdmVyc1xuICAgIHZhciBvdGhlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MubG9nb10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdHJhY2tzLWhlbHBcIiwgXCJjbGlja1wiLCBHVUkubWlzYy5oZWxwLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW3dpbmRvdywgXCJyZXNpemVcIiwgR1VJLmNzc11cbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gQWpvdXQgZGVzIMOpY291dGV1cnMgZCfDqXbDqW5lbWVudHNcbiAgICBhZGRFdmVudHMobWVudUV2ZW50cyk7XG4gICAgYWRkRXZlbnRzKHBsYXlsaXN0RXZlbnRzKTtcbiAgICBhZGRFdmVudHMoZmF2b3JpdGVzRXZlbnRzKTtcbiAgICBhZGRFdmVudHMoYXRtb3NwaGVyZXNFdmVudHMpO1xuICAgIGFkZEV2ZW50cyh1c2VyRXZlbnRzKTtcbiAgICBhZGRFdmVudHMob3RoZXJFdmVudHMpO1xuXG4gICAgLy8gRm9uY3Rpb25zIGQnYWpvdXQgZCfDqXbDqW5lbWVudHNcbiAgICBmdW5jdGlvbiBhZGRFdmVudHMoZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGVbaV1bM10gPT0gXCJhc3luY1wiKSB7XG4gICAgICAgICAgJCggZG9jdW1lbnQgKS5vbiggZVtpXVsxXSwgZVtpXVswXSwgZVtpXVsyXSk7IC8vIGTDqWzDqWdhdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoIGVbaV1bMF0gKS5vbiggZVtpXVsxXSwgZVtpXVsyXSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSB0ZW1wbGF0ZSBjcsOpYW50IGR5bmFtaXF1ZW1lbnQgdW4gZnJhZ21lbnQgSFRNTFxuICAgKlxuICAgKiBAbWV0aG9kIHRlbXBsYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgZGUgdGVtcGxhdGUgKHN1Z2dlc3Rpb25zIGRlIGJhc2Ugb3UgaGFybW9uaXF1ZXMpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBPYmpldCByZXByw6lzZW50YW50IG1vcmNlYXUgZGUgbXVzaXF1ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzVGVtcG9Db21wYXRpYmxlIENvbXBhdGliaWxpdMOpIG91IG5vbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzS2V5Q29tcGF0aWJsZSBDb21wYXRpYmlsaXTDqSBvdSBub24gZGUgbGEgdG9uYWxpdMOpXG4gICAqL1xuICB0ZW1wbGF0ZTogZnVuY3Rpb24odHlwZSwgdHJhY2ssIGlzVGVtcG9Db21wYXRpYmxlLCBpc0tleUNvbXBhdGlibGUpIHtcbiAgICBpZiAodHlwZSA9PSBcImJhc2UtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGRlIGJhc2VcblxuICAgICAgdmFyIGFydGlzdE5hbWUgPSB0cmFjay5nZXRBcnRpc3QoKSxcbiAgICAgICAgICBtYXhTdHJpbmdMZW5ndGggPSAxMDA7XG5cbiAgICAgIC8vIFNpIGxlIG5vbSBkZSBsJ2FydGlzdGUgZXN0IGV4YWfDqXLDqW1lbnQgbG9uZywgb24gbGUgdHJvbnF1ZSDDoCBsJ2FmZmljaGFnZVxuICAgICAgaWYgKGFydGlzdE5hbWUubGVuZ3RoID4gbWF4U3RyaW5nTGVuZ3RoKSB7XG4gICAgICAgIGFydGlzdE5hbWUgPSBhcnRpc3ROYW1lLnN1YnN0cigwLCBtYXhTdHJpbmdMZW5ndGgpICsgXCIgLi4uXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJ0cmFja1wiIGl0ZW1zY29wZSBpdGVtdHlwZT1cImh0dHBzOi8vc2NoZW1hLm9yZy9NdXNpY1JlY29yZGluZ1wiPic7XG4gICAgICAgICAgaHRtbCArPSAnIDxmaWd1cmUgaWQ9XCJzdWJtaXQtJyArIHRyYWNrLmdldElkKCkgKyAnXCI+JztcbiAgICAgICAgICBodG1sICs9ICcgICA8aW1nIGNsYXNzPVwibGF6eU93bFwiIGRhdGEtc3JjPVwiJyArIHRyYWNrLmdldENvdmVyKCkgKyAnXCIgYWx0PVwiJyArIHRyYWNrLmdldFRpdGxlKCkgKyAnXCI+JztcbiAgICAgICAgICBodG1sICs9ICcgICA8ZmlnY2FwdGlvbj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgICA8aDMgY2xhc3M9XCJ0cmFjay10aXRsZVwiIGl0ZW1wcm9wPVwibmFtZVwiPicgKyB0cmFjay5nZXRUaXRsZSgpICsgJzwvaDM+JztcbiAgICAgICAgICBodG1sICs9ICcgICAgICAgPHAgY2xhc3M9XCJhcnRpc3QtbmFtZVwiIGl0ZW1wcm9wPVwiYnlBcnRpc3RcIj4nICsgYXJ0aXN0TmFtZSArIFwiPC9wPlwiO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICAgICAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICAgICAgICBodG1sICs9ICcgPC9maWd1cmU+JztcbiAgICAgICAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkodHJhY2spKSArICdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiaGFybW9uaWMtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGhhcm1vbmlxdWVcblxuICAgICAgdmFyIGFydGlzdE5hbWUgPSB0cmFjay5nZXRBcnRpc3QoKSxcbiAgICAgICAgICBtYXhTdHJpbmdMZW5ndGggPSAxMDAsXG4gICAgICAgICAgdGVtcG9Dc3NDbGFzcyA9IFwicmVkXCIsXG4gICAgICAgICAgdG9uYWxpdHlDc3NDbGFzcyA9IFwicmVkXCI7XG5cbiAgICAgIC8vIE9uIGfDqHJlIGxlIGNhcyBvw7kgbGUgbm9tIGRlIGwnYXJ0aXN0ZSBlc3QgZXhhZ8OpcsOpbWVudCBsb25nXG4gICAgICBpZiAoYXJ0aXN0TmFtZS5sZW5ndGggPiBtYXhTdHJpbmdMZW5ndGgpIHtcbiAgICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICAgIH1cblxuICAgICAgLy8gT24gc2lnbmFsZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVybWVzIGRlIHRlbXBvXG4gICAgICBpZiAoaXNUZW1wb0NvbXBhdGlibGUpIHtcbiAgICAgICAgdGVtcG9Dc3NDbGFzcyA9IFwiZ3JlZW5cIjtcbiAgICAgIH1cblxuICAgICAgLy8gT24gc2lnbmFsZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVybWVzIGRlIHRvbmFsaXTDqVxuICAgICAgaWYgKGlzS2V5Q29tcGF0aWJsZSkge1xuICAgICAgICB0b25hbGl0eUNzc0NsYXNzID0gXCJncmVlblwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgaHRtbCA9ICc8YSBjbGFzcz1cImhhcm1vbmljLXRyYWNrXCIgaXRlbXNjb3BlIGl0ZW10eXBlPVwiaHR0cHM6Ly9zY2hlbWEub3JnL011c2ljQ29tcG9zaXRpb25cIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8ZmlndXJlIGlkPVwic3VnZ2VzdGlvbi0nICsgdHJhY2suZ2V0SWQoKSArICdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgIDxpbWcgc3JjPVwiJyArIHRyYWNrLmdldENvdmVyKCkgKyAnXCIgYWx0PVwiJyArIHRyYWNrLmdldFRpdGxlKCkgKyAnXCI+JztcbiAgICAgICAgICBodG1sICs9ICcgICA8ZmlnY2FwdGlvbj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgIDxoMyBpdGVtcHJvcD1cIm5hbWVcIj4nICsgdHJhY2suZ2V0VGl0bGUoKSArICc8L2gzPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCJhcnRpc3QtbmFtZVwiIGl0ZW1wcm9wPVwiY29tcG9zZXJcIj4nICsgYXJ0aXN0TmFtZSArICc8L3A+JztcbiAgICAgICAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cIicgKyB0ZW1wb0Nzc0NsYXNzICsgJ1wiIGl0ZW1wcm9wPVwibXVzaWNhbEtleVwiPlRlbXBvIDogJyArIHRyYWNrLmdldFRlbXBvKCkgKyAnIEJQTTwvcD4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgIDxwIGNsYXNzPVwiJyArIHRvbmFsaXR5Q3NzQ2xhc3MgKyAnXCIgaXRlbXByb3A9XCJtdXNpY2FsS2V5XCI+VG9uYWxpdMOpIDogJyArIHRyYWNrLmdldEtleSgpICsgJyAnICsgdHJhY2suZ2V0TW9kZSgpICsgJzwvcD4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICAgICAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICAgICAgICBodG1sICs9ICcgPC9maWd1cmU+JztcbiAgICAgICAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkodHJhY2spKSArICdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJzwvYT4nO1xuXG4gICAgICByZXR1cm4gaHRtbDtcblxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImF1dG9jb21wbGV0ZVwiKSB7IC8vIEF1dG9jb21wbMOpdGlvblxuXG4gICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiYXV0b2NvbXBsZXRlLScgKyB0cmFjay5pZCArICdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8c3Ryb25nPicgKyB0cmFjay50aXRsZSArICc8L3N0cm9uZz48YnI+JztcbiAgICAgICAgICBodG1sICs9ICcgPGVtPicgKyB0cmFjay5hcnRpc3QubmFtZSArICc8L2VtPic7XG4gICAgICAgICAgaHRtbCArPSAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIGh0bWw7XG5cbiAgICB9IGVsc2UgeyAvLyBDYXNlIGQnYWlkZVxuXG4gICAgICB2YXIgaHRtbCA9ICc8YSBjbGFzcz1cIml0ZW0gdGl0bGVcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8aDI+U3VnZ2VzdGlvbnM8L2gyPic7XG4gICAgICAgICAgaHRtbCArPSAnPC9hPic7XG4gICAgICAgICAgaHRtbCArPSAnPGEgaWQ9XCJ0cmFja3MtaGVscFwiIGhyZWY9XCIjXCI+JztcbiAgICAgICAgICBodG1sICs9ICcgIDxpIGNsYXNzPVwiaGVscCBjaXJjbGUgaWNvblwiPjwvaT4nO1xuICAgICAgICAgIGh0bWwgKz0gJzwvYT4nO1xuXG4gICAgICByZXR1cm4gaHRtbDtcblxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIEZhY2FkZSBwZXJtZXR0YW50IGQnw6l2aXRlciBsJ2Fib25kYW5jZSBkZSBjb25kaXRpb25zIGRhbnMgbGUgY29kZVxuICAgKlxuICAgKiBAbWV0aG9kIGFsZXJ0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgZCdhbGVydGUgKHN1Y2PDqHMsIGVycmV1ciwgbWVzc2FnZSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSBkJ2FsZXJ0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZXIgRHVyw6llIGRlIHZpZSBkZSBsYSBub3RpZmljYXRpb25cbiAgICovXG4gIGFsZXJ0OiBmdW5jdGlvbih0eXBlLCBtZXNzYWdlLCB0aW1lcikge1xuICAgIGlmIChHVUkubm90aWZBbGxvd2VkKSB7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgICAgICByZXR1cm4gYWxlcnRpZnkuc3VjY2VzcyhtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgIHJldHVybiBhbGVydGlmeS5lcnJvcihtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3YXJuaW5nXCI6XG4gICAgICAgICAgcmV0dXJuIGFsZXJ0aWZ5Lndhcm5pbmcobWVzc2FnZSwgdGltZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWVzc2FnZVwiOlxuICAgICAgICAgIHJldHVybiBhbGVydGlmeS5tZXNzYWdlKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBTdXBwcmVzc2lvbiBkZSB0b3V0ZXMgbGVzIG5vdGlmaWNhdGlvbnMgYWN0aXZlc1xuICAgKlxuICAgKiBAbWV0aG9kIGNsZWFuTm90aWZpY2F0aW9uc1xuICAgKi9cbiAgY2xlYW5Ob3RpZmljYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICBhbGVydGlmeS5kaXNtaXNzQWxsKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBBZmZpY2hhZ2UgZGVzIHN1Z2dlc3Rpb25zIGhhcm1vbmlxdWVzIMOgIGxhIGZpbiBkdSBwcm9jZXNzdXMgZGUgcmVjaGVyY2hlXG4gICAqXG4gICAqIEBtZXRob2QgZGlzcGxheUZpbmFsVHJhY2tsaXN0XG4gICAqL1xuICBkaXNwbGF5RmluYWxUcmFja2xpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiI2hhcm1vbmljLXRyYWNrc1wiIClcbiAgICAgIC5zaWRlYmFyKCBcInNldHRpbmdcIiwgXCJ0cmFuc2l0aW9uXCIsIFwic2NhbGUgZG93blwiIClcbiAgICAgIC5zaWRlYmFyKCBcInNob3dcIiApO1xuICB9LFxuICAvKipcbiAgICogTWluaS1jbGFzc2UgZGUgZ2VzdGlvbiBkZXMgc2Nyb2xsYmFycy5cbiAgICogTGVzIHNjcm9sbGJhcnMgZMOpcGVuZGVudCBkdSBwbHVnaW4gbUN1c3RvbVNjcm9sbGJhci5cbiAgICpcbiAgICogQGNsYXNzIEdVSS5zY3JvbGxcbiAgICovXG4gIHNjcm9sbDoge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIGRlcyBzY3JvbGxiYXJzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI3BsYXlsaXN0LCAjZmF2b3JpdGVzXCIgKS5tQ3VzdG9tU2Nyb2xsYmFyKHtcbiAgICAgICAgdGhlbWU6IFwiZGFya1wiLFxuICAgICAgICBzY3JvbGxJbmVydGlhOiAwXG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWluaXRpYWxpc2F0aW9uIGNvbXBsw6h0ZSBkJ3VuZSBzY3JvbGxiYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oJGNvbnRhaW5lcikge1xuICAgICAgJGNvbnRhaW5lci5tQ3VzdG9tU2Nyb2xsYmFyKCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEZXN0cnVjdGlvbiBkJ3VuZSBzY3JvbGxiYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAqL1xuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCRjb250YWluZXIpIHtcbiAgICAgICRjb250YWluZXIubUN1c3RvbVNjcm9sbGJhciggXCJkZXN0cm95XCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBNaW5pLWNsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGUgY2hhcmdlbWVudFxuICAgKlxuICAgKiBAY2xhc3MgR1VJLmxvYWRpbmdcbiAgICovXG4gIGxvYWRpbmc6IHtcbiAgICAvKipcbiAgICAgKiBBY3RpdmVyIGxlIGxvYWRlclxuICAgICAqXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLnBhZ2UuZGltbWVyXCIgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRMOpc2FjdGl2ZXIgbGUgbG9hZGVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIi51aS5wYWdlLmRpbW1lclwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlcyDDqWzDqW1lbnRzIHJlbGF0aWZzIGF1IG1lbnVcbiAgICpcbiAgICogQGNsYXNzIEdVSS5tZW51XG4gICAqL1xuICBtZW51OiB7XG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGxlIG1lbnUgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZVxuICAgICAqL1xuICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNtZW51XCIgKS5zaWRlYmFyKCBcInRvZ2dsZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbGEgcGxheWxpc3QgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZVBsYXlsaXN0XG4gICAgICovXG4gICAgdG9nZ2xlUGxheWxpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjcGxheWxpc3RcIiwgXCJibHVlXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsZXMgZmF2b3JpcyAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlRmF2b3JpdGVzXG4gICAgICovXG4gICAgdG9nZ2xlRmF2b3JpdGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI2Zhdm9yaXRlc1wiLCBcInJlZFwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbGVzIGFtYmlhbmNlcyAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlQXRtb3NwaGVyZXNcbiAgICAgKi9cbiAgICB0b2dnbGVBdG1vc3BoZXJlczogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiNhdG1vc3BoZXJlc1wiLCBcImdyZWVuXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsZXMgbW9yY2VhdXggaGFybW9uaXF1ZXMgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZUhhcm1vbmljVHJhY2tzXG4gICAgICovXG4gICAgdG9nZ2xlSGFybW9uaWNUcmFja3M6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjaGFybW9uaWMtdHJhY2tzXCIsIFwidmlvbGV0XCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsJ3V0aWxpc2F0ZXVyIChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVVc2VyXG4gICAgICovXG4gICAgdG9nZ2xlVXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiN1c2VyXCIsIFwibWFyb29uXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciB1bmUgc2lkZWJhclxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVTaWRlYmFyXG4gICAgICovXG4gICAgdG9nZ2xlU2lkZWJhcjogZnVuY3Rpb24oaWQsIGNvbG9yKSB7XG4gICAgICAkKCBpZCApXG4gICAgICAgIC5zaWRlYmFyKHtcbiAgICAgICAgICBvblNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCggaWQgKyBcIi1idG5cIiApLmFkZENsYXNzKCBjb2xvciArIFwiLWl0ZW1cIiApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25IaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIGlkICsgXCItYnRuXCIgKS5yZW1vdmVDbGFzcyggY29sb3IgKyBcIi1pdGVtXCIgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zaWRlYmFyKCBcInNldHRpbmdcIiwgXCJ0cmFuc2l0aW9uXCIsIFwib3ZlcmxheVwiIClcbiAgICAgICAgLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciB0b3V0ZXMgbGVzIHNpZGViYXJzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZUFsbFxuICAgICAqL1xuICAgIHRvZ2dsZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBPbiBhZmZpY2hlIGxlIG1lbnUgZHUgYmFzXG4gICAgICBHVUkubWVudS50b2dnbGUoKTtcbiAgICAgIC8vIE9uIGFmZmljaGUgdG91dGVzIGxlcyBhdXRyZXMgc2lkZWJhcnNcbiAgICAgIHZhciBjb2xvcnMgPSBbXCJibHVlXCIsIFwicmVkXCIsIFwiZ3JlZW5cIiwgXCJ2aW9sZXRcIiwgXCJtYXJvb25cIl07XG4gICAgICAkKCBcIi5zaWRlYmFyXCIgKS5ub3QoIFwiI21lbnVcIiApLmVhY2goZnVuY3Rpb24oaSwgZWx0KSB7XG4gICAgICAgIHZhciBpZCA9ICQoIGVsdCApLmF0dHIoIFwiaWRcIiApO1xuICAgICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiNcIiArIGlkLCBjb2xvcnNbaV0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyDDoCBsYSBwbGF5bGlzdFxuICAgKlxuICAgKiBAY2xhc3MgR1VJLnBsYXlsaXN0XG4gICAqL1xuICBwbGF5bGlzdDoge1xuICAgIC8qKlxuICAgICAqIFLDqWN1cMOpcmF0aW9uIGQndW5lIHBsYXlsaXN0IHNhdXZlZ2FyZMOpZSBkYW5zIGxlIGxvY2FsIHN0b3JhZ2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmV0cmlldmVcbiAgICAgKi9cbiAgICByZXRyaWV2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2F2ZWRQbGF5bGlzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWxpc3RcIiksXG4gICAgICAgICAgaWRzID0gW107XG5cbiAgICAgIGlmIChzYXZlZFBsYXlsaXN0ICE9PSBudWxsKSB7XG4gICAgICAgIFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzID0gSlNPTi5wYXJzZShzYXZlZFBsYXlsaXN0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWRzLnB1c2goUGxheWxpc3Quc2VsZWN0ZWRUcmFja3NbaV0uX2lkKTtcbiAgICAgICAgfVxuICAgICAgICBQbGF5bGlzdC50cmFja3NJZHMgPSBpZHM7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90UmFuZG9tXG4gICAgICovXG4gICAgbm90UmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmFuZG9tKGZhbHNlKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJhbmRvbVwiLCBcIm1pbnVzXCIgKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJub3QtcmFuZG9tLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkxlY3R1cmUgYWzDqWF0b2lyZSBkw6lzYWN0aXbDqWVcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIGxlY3R1cmUgYWzDqWF0b2lyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgKi9cbiAgICByYW5kb206IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yYW5kb20odHJ1ZSk7XG4gICAgICAkKCBcIiNub3QtcmFuZG9tLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwibWludXNcIiwgXCJyYW5kb21cIiApO1xuICAgICAgJCggXCIjbm90LXJhbmRvbS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyYW5kb20tYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJMZWN0dXJlIGFsw6lhdG9pcmUgYWN0aXbDqWVcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSByw6lww6l0aXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm9SZXBlYXRcbiAgICAgKi9cbiAgICBub1JlcGVhdDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJlcGVhdCgwKTtcbiAgICAgICQoIFwiI3JlcGVhdC1hbGwtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZWZyZXNoXCIsIFwibWludXNcIiApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJuby1yZXBlYXQtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJQYXMgZGUgcsOpcMOpdGl0aW9uXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWN0aXZhdGlvbiBkZSBsYSByw6lww6l0aXRpb24gZCd1biBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlcGVhdE9uZVxuICAgICAqL1xuICAgIHJlcGVhdE9uZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJlcGVhdCgyKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcIm1pbnVzXCIsIFwicmVwZWF0XCIgKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyZXBlYXQtb25lLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiUsOpcMOpdGl0aW9uIGR1IG1vcmNlYXUgZW4gY291cnNcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkZSB0b3VzIGxlcyBtb3JjZWF1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXBlYXRBbGxcbiAgICAgKi9cbiAgICByZXBlYXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yZXBlYXQoMSk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVwZWF0XCIsIFwicmVmcmVzaFwiICk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJlcGVhdC1hbGwtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJSw6lww6l0aXRpb24gZGUgdG91cyBsZXMgbW9yY2VhdXhcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtdXRlXG4gICAgICovXG4gICAgbXV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm11dGUodHJ1ZSk7XG4gICAgICAkKCBcIiN1bm11dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJ1bm11dGVcIiwgXCJtdXRlXCIgKTtcbiAgICAgICQoIFwiI3VubXV0ZS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJtdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlNvbiBjb3Vww6kgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCB1bm11dGVcbiAgICAgKi9cbiAgICB1bm11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5tdXRlKGZhbHNlKTtcbiAgICAgICQoIFwiI211dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJtdXRlXCIsIFwidW5tdXRlXCIgKTtcbiAgICAgICQoIFwiI211dGUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwidW5tdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiU29uIHLDqXRhYmxpICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTYXV2ZWdhcmRlIGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlIGRhbnMgbGUgbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzYXZlSW5Ccm93c2VyXG4gICAgICovXG4gICAgc2F2ZUluQnJvd3NlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGxheWxpc3QgPSBKU09OLnN0cmluZ2lmeShQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlsaXN0XCIsIHBsYXlsaXN0KTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBzYXV2ZWdhcmTDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNhdXZlZ2FyZGUgZGUgbGEgcGxheWxpc3QgY291cmFudGUgc3VyIERlZXplclxuICAgICAqXG4gICAgICogQG1ldGhvZCBzYXZlT25EZWV6ZXJcbiAgICAgKi9cbiAgICBzYXZlT25EZWV6ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHVzZXIgIT09IG51bGwpIHtcbiAgICAgICAgRFouYXBpKFwidXNlci9tZS9wbGF5bGlzdHNcIiwgXCJQT1NUXCIsIHt0aXRsZSA6IFwiSEFSTU9ORUVaRVJcIn0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgIFBsYXlsaXN0LmRlZXplcklkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgIERaLmFwaShcInBsYXlsaXN0L1wiICsgcmVzcG9uc2UuaWQgKyBcIi90cmFja3NcIiwgXCJQT1NUXCIsIHtzb25nczogUGxheWxpc3QudHJhY2tzSWRzLmpvaW4oKX0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJWb3RyZSBwbGF5bGlzdCBlc3Qgc3VyIERlZXplciAhXCIsIDUpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlZvdXMgbifDqnRlcyBwYXMgY29ubmVjdMOpKGUpICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBFeHBvcnQgQ1NWIGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGV4cG9ydFxuICAgICAqL1xuICAgIGV4cG9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNjc3YtZXhwb3J0XCIgKS50YWJsZVRvQ1NWKCk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiUGxheWxpc3QgZXhwb3J0w6llICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBFZmZhY2VtZW50IGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlbGV0ZVxuICAgICAqL1xuICAgIGRlbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiVm91bGV6LXZvdXMgdnJhaW1lbnQgc3VwcHJpbWVyIHZvdHJlIHBsYXlsaXN0ID88YnI+XCI7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiQ2VsbGUtY2kgc2VyYSBzdXBwcmltw6llIGTDqWZpbml0aXZlbWVudCBkdSBuYXZpZ2F0ZXVyIGV0IHN1ciBEZWV6ZXIuXCI7XG4gICAgICAgIGFsZXJ0aWZ5LmRlZmF1bHRzLmdsb3NzYXJ5LnRpdGxlID0gXCJBdHRlbnRpb24gIVwiO1xuICAgICAgICAvLyBTaSBsJ3V0aWxpc2F0ZXVyIGVzdCBkJ2FjY29yZCA6XG4gICAgICAgIGFsZXJ0aWZ5LmNvbmZpcm0obWVzc2FnZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gLSBvbiBzdXBwcmltZSBsYSBwbGF5bGlzdCBkZSBsYSBzZXNzaW9uIGNvdXJhbnRlXG4gICAgICAgICAgUGxheWxpc3QucmVzZXQoKTtcbiAgICAgICAgICAvLyAtIG9uIHN1cHByaW1lIGxhIHBsYXlsaXN0IGR1IGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5bGlzdFwiKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwbGF5bGlzdFwiKTtcbiAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBlZmZhY8OpZSBkdSBuYXZpZ2F0ZXVyICFcIiwgNSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdVSS5hbGVydChcIndhcm5pbmdcIiwgXCJQbGF5bGlzdCBub24gc2F1dmVnYXJkw6llIGxvY2FsZW1lbnRcIiwgNSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIC0gb24gc3VwcHJpbWUgbGEgcGxheWxpc3Qgc3VyIERlZXplclxuICAgICAgICAgIGlmIChQbGF5bGlzdC5kZWV6ZXJJZCAhPSAtMSkge1xuICAgICAgICAgICAgRFouYXBpKFwicGxheWxpc3QvXCIgKyBQbGF5bGlzdC5kZWV6ZXJJZCwgXCJERUxFVEVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IGVmZmFjw6llIHN1ciBEZWV6ZXIgIVwiLCA1KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHVUkuYWxlcnQoXCJ3YXJuaW5nXCIsIFwiUGxheWxpc3Qgbm9uIHNhdXZlZ2FyZMOpZSBzdXIgRGVlemVyXCIsIDUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuc2V0KFwibGFiZWxzXCIsIHsgb2s6XCJPdWlcIiwgY2FuY2VsOlwiTm9uXCIgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlZvdHJlIHBsYXlsaXN0IGVzdCB2aWRlICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBQYXNzYWdlIGF1IG1vcmNlYXUgcHLDqWPDqWRlbnRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcHJldmlvdXNcbiAgICAgKi9cbiAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnByZXYoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsbGVyIGVuIGFycmnDqHJlIGRhbnMgbGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBiYWNrXG4gICAgICovXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uID4gMTApIHtcbiAgICAgICAgR1VJLnBsYXllci50cmFja1Bvc2l0aW9uIC09IDEwO1xuICAgICAgfVxuICAgICAgR1VJLnBsYXllci5zZWVrKEdVSS5wbGF5ZXIudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMaXJlIGxhIHBsYXlsaXN0IGRlcHVpcyBsZSBkw6lidXRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS5wbGF5ZXIudHJhY2tzTG9hZGVkKSB7XG4gICAgICAgIEdVSS5wbGF5ZXIucGxheSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLnBsYXllci5wbGF5VHJhY2tzKFBsYXlsaXN0LnRyYWNrc0lkcyk7XG4gICAgICAgIEdVSS5wbGF5ZXIudHJhY2tzTG9hZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIExpcmUgbGEgcGxheWxpc3Qgw6AgcGFydGlyIGQndW4gbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBwbGF5RnJvbVxuICAgICAqL1xuICAgIHBsYXlGcm9tOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbmRleCA9IHBhcnNlSW50KCQoIHRoaXMgKS5maW5kKCBcIiNwbGF5bGlzdC10cmFjay1pbmRleFwiICkudmFsKCkpO1xuICAgICAgR1VJLnBsYXllci5wbGF5VHJhY2tzKFBsYXlsaXN0LnRyYWNrc0lkcywgaW5kZXgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWV0dHJlIGVuIHBhdXNlIHVuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnBhdXNlKCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMZWN0dXJlIG91IHBhdXNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHBsYXlQYXVzZVxuICAgICAqL1xuICAgIHBsYXlQYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuaXNQbGF5aW5nID8gR1VJLnBsYXlsaXN0LnBhdXNlKCkgOiBHVUkucGxheWxpc3QucGxheSgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWxsZXIgZW4gYXZhbnQgZGFucyBsZSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGJhY2tcbiAgICAgKi9cbiAgICBmb3J0aDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uIDwgOTApIHtcbiAgICAgICAgR1VJLnBsYXllci50cmFja1Bvc2l0aW9uICs9IDEwO1xuICAgICAgfVxuICAgICAgR1VJLnBsYXllci5zZWVrKEdVSS5wbGF5ZXIudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBQYXNzYWdlIGF1IG1vcmNlYXUgc3VpdmFudFxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXh0XG4gICAgICovXG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm5leHQoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFqb3V0IGQndW4gbW9yY2VhdSDDoCBsYSBwbGF5bGlzdFxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRUcmFja1xuICAgICAqL1xuICAgIGFkZFRyYWNrOiBmdW5jdGlvbihlbHRJZCkge1xuICAgICAgdmFyIHRyYWNrID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoJCggXCIjXCIgKyBlbHRJZCApLm5leHQoKS52YWwoKSkpO1xuICAgICAgUGxheWxpc3QuYWRkVHJhY2sodHJhY2spO1xuICAgICAgR1VJLnBsYXllci50cmFja3NMb2FkZWQgPSBmYWxzZTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJNb3JjZWF1IGFqb3V0w6kgw6Agdm90cmUgcGxheWxpc3RcIiwgNSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggZmF2b3Jpc1xuICAgKlxuICAgKiBAY2xhc3MgR1VJLmZhdm9yaXRlc1xuICAgKi9cbiAgZmF2b3JpdGVzOiB7XG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsYSB2aXNpYmlsaXTDqSBkZSBsJ2lQb2RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaXBvZFxuICAgICAqL1xuICAgIGlwb2Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRpcG9kID0gJCggXCIjaXBvZC13cmFwcGVyXCIgKSxcbiAgICAgICAgICAkaXBvZFN0YXRlID0gJCggXCIjZmF2LWlwb2QgLnN0YXRlXCIgKTtcbiAgICAgICRpcG9kLmlzKCBcIjp2aXNpYmxlXCIgKSA/ICRpcG9kLmZhZGVPdXQoKSA6ICRpcG9kLmZhZGVJbigpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkaXBvZFN0YXRlLCBcImlQb2QgYWN0aXbDqSAhXCIsIFwiaVBvZCBkw6lzYWN0aXbDqSAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgaW5mb2J1bGxlc1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0b29sdGlwXG4gICAgICovXG4gICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRvb2x0aXBTdGF0ZSA9ICQoIFwiI2Zhdi10b29sdGlwIC5zdGF0ZVwiICk7XG4gICAgICBpZiAoR1VJLnRvb2x0aXBBbGxvd2VkKSB7XG4gICAgICAgIEdVSS50b29sdGlwQWxsb3dlZCA9IGZhbHNlO1xuICAgICAgICAkKCBcIlt0aXRsZSAhPSAnJ11cIiApLnBvcHVwKCBcImRlc3Ryb3lcIiApOyAvLyBTZW1hbnRpYyBVSVxuICAgICAgICAkKCBcIlt0aXRsZSAhPSAnJ11cIiApLnF0aXAoIFwiZGVzdHJveVwiLCB0cnVlICk7IC8vIHFUaXDCslxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLnRvb2x0aXBBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgR1VJLnRvb2x0aXBzKCk7XG4gICAgICB9XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCR0b29sdGlwU3RhdGUsIFwiSW5mb2J1bGxlcyBhY3RpdsOpZXMgIVwiLCBcIkluZm9idWxsZXMgZMOpc2FjdGl2w6llcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgbm90aWZpY2F0aW9uc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBub3RpZnlcbiAgICAgKi9cbiAgICBub3RpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRub3RpZlN0YXRlID0gJCggXCIjZmF2LW5vdGlmeSAuc3RhdGVcIiApO1xuICAgICAgR1VJLm5vdGlmQWxsb3dlZCA/IChHVUkubm90aWZBbGxvd2VkID0gZmFsc2UpIDogKEdVSS5ub3RpZkFsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJG5vdGlmU3RhdGUsIFwiTm90aWZpY2F0aW9ucyBhY3RpdsOpZXMgIVwiLCBcIk5vdGlmaWNhdGlvbnMgZMOpc2FjdGl2w6llcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgc29ucyBkJ2FtYmlhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvdW5kXG4gICAgICovXG4gICAgc291bmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRzb3VuZFN0YXRlID0gJCggXCIjZmF2LXNvdW5kIC5zdGF0ZVwiICk7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID8gKEdVSS5zb3VuZEFsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLnNvdW5kQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkc291bmRTdGF0ZSwgXCJTb25zIGQnYW1iaWFuY2UgYWN0aXbDqXMgIVwiLCBcIlNvbnMgZCdhbWJpYW5jZSBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbCdhdXRvY29tcGzDqXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgYXV0b2NvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkYXV0b2NvbXBsZXRlU3RhdGUgPSAkKCBcIiNmYXYtYXV0b2NvbXBsZXRlIC5zdGF0ZVwiICk7XG4gICAgICBpZiAoR1VJLmF1dG9jb21wbGV0ZUFsbG93ZWQpIHtcbiAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5mYWRlT3V0KCk7XG4gICAgICAgIEdVSS5hdXRvY29tcGxldGVBbGxvd2VkID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hdXRvY29tcGxldGVBbGxvd2VkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkYXV0b2NvbXBsZXRlU3RhdGUsIFwiQXV0b2NvbXBsw6l0aW9uIGFjdGl2w6llICFcIiwgXCJBdXRvY29tcGzDqXRpb24gZMOpc2FjdGl2w6llICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlcyBkb3VibG9ucyBkYW5zIGxlcyBzdWdnZXN0aW9uc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBkdXBsaWNhdGVcbiAgICAgKi9cbiAgICBkdXBsaWNhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRkdXBsaWNhdGVTdGF0ZSA9ICQoIFwiI2Zhdi1kdXBsaWNhdGUgLnN0YXRlXCIgKTtcbiAgICAgIEdVSS5kdXBsaWNhdGVzQWxsb3dlZCA/IChHVUkuZHVwbGljYXRlc0FsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLmR1cGxpY2F0ZXNBbGxvd2VkID0gdHJ1ZSk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRkdXBsaWNhdGVTdGF0ZSwgXCJEb3VibG9ucyBhY3RpdsOpcyAhXCIsIFwiRG91YmxvbnMgZMOpc2FjdGl2w6lzICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGQndW5lIHRvbMOpcmFuY2UgcG91ciBsZSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0ZW1wb1JhbmdlXG4gICAgICovXG4gICAgdGVtcG9SYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGVtcG9WYXJpYXRpb24gPSAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ11cIiApLnZhbCgpO1xuICAgICAgJCggXCJpbnB1dFt0eXBlPSdyYW5nZSddICsgc3BhblwiICkudGV4dCggdGVtcG9WYXJpYXRpb24gKyBcIiAlXCIgKTtcbiAgICAgIEdVSS50ZW1wb1ZhcmlhdGlvbiA9ICh0ZW1wb1ZhcmlhdGlvbiAvIDEwMCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgcGFyIGTDqWZhdXRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVmYXVsdFNvcnRpbmdcbiAgICAgKi9cbiAgICBkZWZhdWx0U29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJkZWZhdWx0XCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgZmF2b3Jpc2FudCBsZSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0ZW1wb0ZpcnN0U29ydGluZ1xuICAgICAqL1xuICAgIHRlbXBvRmlyc3RTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcInRlbXBvRmlyc3RcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBmYXZvcmlzYW50IGxhIHRvbmFsaXTDqVxuICAgICAqXG4gICAgICogQG1ldGhvZCBrZXlGaXJzdFNvcnRpbmdcbiAgICAgKi9cbiAgICBrZXlGaXJzdFNvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwia2V5Rmlyc3RcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBjcm9pc3NhbnQgZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXNjVGVtcG9Tb3J0aW5nXG4gICAgICovXG4gICAgYXNjVGVtcG9Tb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImFzY1RlbXBvXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50IGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlc2NUZW1wb1NvcnRpbmdcbiAgICAgKi9cbiAgICBkZXNjVGVtcG9Tb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlc2NUZW1wb1wiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkdSB0cmkgcGxhY2Vib1xuICAgICAqXG4gICAgICogQG1ldGhvZCBub1NvcnRpbmdcbiAgICAgKi9cbiAgICBub1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwibm9uZVwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ2hhbmdlbWVudCBkJ8OpdGF0IChvbi9vZmYpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNoYW5nZVN0YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICRzdGF0ZSBDaGFtcCBjYWNow6kgY29udGVuYW50IGwnw6l0YXQgZGUgbCdvYmpldCBkYW5zIGxlIERPTVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwb3NpdGl2ZU1lc3NhZ2UgTWVzc2FnZSBkJ2FjdGl2YXRpb24gKHZlcnQpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5lZ2F0aXZlTWVzc2FnZSBNZXNzYWdlIGRlIGTDqXNhY3RpdmF0aW9uIChyb3VnZSlcbiAgICAgKi9cbiAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oJHN0YXRlLCBvbk1lc3NhZ2UsIG9mZk1lc3NhZ2UpIHtcbiAgICAgIGlmICgkc3RhdGUudmFsKCkgPT0gXCJvblwiKSB7XG4gICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIG9mZk1lc3NhZ2UsIDUpO1xuICAgICAgICAkc3RhdGUudmFsKCBcIm9mZlwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIG9uTWVzc2FnZSwgNSk7XG4gICAgICAgICRzdGF0ZS52YWwoIFwib25cIiApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXV4IGFtYmlhbmNlc1xuICAgKlxuICAgKiBAY2xhc3MgR1VJLmF0bW9zcGhlcmVzXG4gICAqL1xuICBhdG1vc3BoZXJlczoge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIGR1IHBsdWdpbiBWZWdhcyBwb3VyIGxlcyBiYWNrZ3JvdW5kcyBhbmltw6lzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHZlZ2FzXG4gICAgICovXG4gICAgYmFja2dyb3VuZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIjbWFpblwiICkudmVnYXMoe1xuICAgICAgICAgIHRyYW5zaXRpb246ICdmYWRlJyxcbiAgICAgICAgICBzbGlkZTogMCxcbiAgICAgICAgICBzbGlkZXM6IFtcbiAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9uZXV0cmFsLmpwZ1wiIH0sXG4gICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvcm9jay5qcGdcIiB9LFxuICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2VsZWN0cm8uanBnXCIgfSxcbiAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9oaXBob3AuanBnXCIgfSxcbiAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9mb2xrLmpwZ1wiIH0sXG4gICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvY2xhc3NpY2FsLmpwZ1wiIH0sXG4gICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvamF6ei5qcGdcIiB9LFxuICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL21ldGFsLmpwZ1wiIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGFuaW1hdGlvbjogJ2tlbmJ1cm5zJ1xuICAgICAgfSk7XG4gICAgICAkKCBcIiNtYWluXCIgKS52ZWdhcygncGF1c2UnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENoYW5nZW1lbnQgZCdhbWJpYW5jZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBhcHBseVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBJbmRpY2UgZGUgbCdhbWJpYW5jZSBkYW5zIFZlZ2FzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0bW8gTm9tIGRlIGwnYW1iaWFuY2VcbiAgICAgKi9cbiAgICBhcHBseTogZnVuY3Rpb24oaW5kZXgsIGF0bW8pIHtcbiAgICAgICQoIFwiI1wiICsgYXRtbyArIFwiLWF0bW9cIiApLmFkZENsYXNzKCBcImdyZWVuLWl0ZW1cIiApO1xuICAgICAgJCggXCIjXCIgKyBhdG1vICsgXCItYXRtb1wiICkuc2libGluZ3MoKS5yZW1vdmVDbGFzcyggXCJncmVlbi1pdGVtXCIgKTtcbiAgICAgICQoIFwiI21haW5cIiApLnZlZ2FzKFwianVtcFwiLCBpbmRleCk7XG4gICAgICAvLyAkKCBcIi5wdXNoZXJcIiApLmF0dHIoIFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kOnVybCgnaW1hZ2VzL2JhY2tncm91bmQvXCIgKyBhdG1vICsgXCIuanBnJykgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQgIWltcG9ydGFudFwiICk7XG4gICAgICBpZiAoR1VJLnNvdW5kQWxsb3dlZCAmJiBhdG1vICE9IFwibmV1dHJhbFwiKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbyggXCIuL3NvdW5kcy9cIiArIGF0bW8gKyBcIi5vZ2dcIik7XG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIG5ldXRyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXV0cmFsXG4gICAgICovXG4gICAgbmV1dHJhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoMCwgXCJuZXV0cmFsXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgUm9ja1xuICAgICAqXG4gICAgICogQG1ldGhvZCByb2NrXG4gICAgICovXG4gICAgcm9jazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoMSwgXCJyb2NrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRWxlY3Ryb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBlbGVjdHJvXG4gICAgICovXG4gICAgZWxlY3RybzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoMiwgXCJlbGVjdHJvXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgSGlwLUhvcFxuICAgICAqXG4gICAgICogQG1ldGhvZCBoaXBob3BcbiAgICAgKi9cbiAgICBoaXBob3A6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDMsIFwiaGlwaG9wXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRm9sa1xuICAgICAqXG4gICAgICogQG1ldGhvZCBmb2xrXG4gICAgICovXG4gICAgZm9sazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoNCwgXCJmb2xrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgQ2xhc3NpcXVlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNsYXNzaWNhbFxuICAgICAqL1xuICAgIGNsYXNzaWNhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoNSwgXCJjbGFzc2ljYWxcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBKYXp6XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGphenpcbiAgICAgKi9cbiAgICBqYXp6OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSg2LCBcImphenpcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBNZXRhbFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtZXRhbFxuICAgICAqL1xuICAgIG1ldGFsOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSg3LCBcIm1ldGFsXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXUgY29tcHRlIHV0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBjbGFzcyBHVUkuYWNjb3VudFxuICAgKi9cbiAgYWNjb3VudDoge1xuICAgIC8qKlxuICAgICAqIFbDqXJpZmljYXRpb24gdmlzYW50IMOgIGNvbm5hw650cmUgbGUgc3RhdHV0IGRlIGNvbm5leGlvblxuICAgICAqXG4gICAgICogQG1ldGhvZCBzdGF0dXNcbiAgICAgKi9cbiAgICBzdGF0dXM6IGZ1bmN0aW9uKCkge1xuICAgICAgRFouZ2V0TG9naW5TdGF0dXMoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIFx0aWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xuICAgICAgICAgIEdVSS5hY2NvdW50LmluZm8oKTtcbiAgICAgIFx0fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGxhIGNvbm5leGlvbiBkJ3VuIHV0aWxpc2F0ZXVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ2luXG4gICAgICovXG4gICAgbG9naW46IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS51c2VyID09PSBudWxsKSB7XG4gICAgICAgIERaLmxvZ2luKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXMgPT0gXCJjb25uZWN0ZWRcIikgeyAvLyBTaSB0b3V0IHNlIHBhc3NlIGJpZW5cbiAgICAgICAgICAgIEdVSS5hY2NvdW50LmluZm8oKTtcbiAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJDb25uZXhpb24gT0sgIVwiLCAzKTtcbiAgICAgICAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI3VzZXJcIiwgXCJtYXJvb25cIiApO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIFNpIGxhIGNvbm5leGlvbiDDqWNob3VlXG4gICAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkNvbm5leGlvbiByZWZ1c8OpZSAhXCIsIDUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgeyBwZXJtczogXCJiYXNpY19hY2Nlc3MsbWFuYWdlX2xpYnJhcnksZGVsZXRlX2xpYnJhcnlcIiB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbGEgZMOpY29ubmV4aW9uIGQndW4gdXRpbGlzYXRldXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9nb3V0XG4gICAgICovXG4gICAgbG9nb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgIERaLmxvZ291dCgpO1xuICAgICAgJCggXCIjdXNlci1jb25uZWN0ZWRcIiApLmhpZGUoKTtcbiAgICAgICQoIFwiI3VzZXItbm90LWNvbm5lY3RlZFwiICkuc2hvdygpO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkTDqWNvbm5leGlvbiBPSyAhXCIsIDMpO1xuICAgICAgJCggXCIjdXNlclwiICkuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUsOpY3Vww6lyYXRpb24gZGVzIGluZm9ybWF0aW9ucyBkJ3VuIHV0aWxpc2F0ZXVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluZm9cbiAgICAgKi9cbiAgICBpbmZvOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLmFwaShcIi91c2VyL21lXCIsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciB1c2VyID0gbmV3IFVzZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5pbnNjcmlwdGlvbl9kYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubGluayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnBpY3R1cmVfc21hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICBHVUkudXNlciA9IHVzZXI7XG4gICAgICAgICQoIFwiI3VzZXItaW1nXCIgKS5hdHRyKHsgc3JjOnVzZXIuZ2V0UGljdHVyZSgpLCBhbHQ6dXNlci5nZXROYW1lKCkgfSk7XG4gICAgICAgICQoIFwiI3VzZXItbmFtZVwiICkudGV4dCggdXNlci5nZXROYW1lKCkgKS5hdHRyKCBcImhyZWZcIiwgdXNlci5nZXRMaW5rKCkgKTtcbiAgICAgICAgJCggXCIjdXNlci1kYXRlXCIgKS50ZXh0KCBcIkluc2NyaXQgbGUgXCIgKyB1c2VyLmdldEluc2NyaXB0aW9uRGF0ZSgpICk7XG4gICAgICAgICQoIFwiI3VzZXItbm90LWNvbm5lY3RlZFwiICkuaGlkZSgpO1xuICAgICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBkaXZlcnMgw6l2w6luZW1lbnRzXG4gICAqXG4gICAqIEBjbGFzcyBHVUkubWlzY1xuICAgKi9cbiAgbWlzYzoge1xuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZHUgY2xpYyBzdXIgbGUgbG9nb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2dvXG4gICAgICovXG4gICAgbG9nbzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWlzYy5zaG93TW9kYWwoICQoIFwiI2Fib3V0XCIgKSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkdSBjbGljIHN1ciBsYSBjYXNlIGQnYWlkZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBoZWxwXG4gICAgICovXG4gICAgaGVscDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWlzYy5zaG93TW9kYWwoICQoIFwiI2hlbHBcIiApICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hhZ2UgZCd1bmUgYm/DrnRlIG1vZGFsZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzaG93TW9kYWxcbiAgICAgKi9cbiAgICBzaG93TW9kYWw6IGZ1bmN0aW9uKCRzZWxlY3Rvcikge1xuICAgICAgJHNlbGVjdG9yLm1vZGFsKCBcInNob3dcIiApO1xuICAgIH1cbiAgfVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIm9NZnBBblwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL2FwcC9qcy9tb2R1bGVzL0dVSS5qc1wiLFwiLy4uLy4uL2FwcC9qcy9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBDbGFzc2UgbWV0dGFudCBlbiDFk3V2cmUgbGUgcGF0dGVybiBJdGVyYXRvci5cbiAqIENldHRlIGNsYXNzZSBmb3Vybml0IHVuIG1veWVuIGQnaXTDqXJlciBwbHVzIHNpbXBsZW1lbnQgc3VyIGxlcyBjb2xsZWN0aW9ucy5cbiAqXG4gKiBAbW9kdWxlIEl0ZXJhdG9yXG4gKiBAY2xhc3MgSXRlcmF0b3JcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gaXRlbXMgQ29sbGVjdGlvbiBkJ29iamV0cyDDoCBwYXJjb3VyaXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBJdGVyYXRvciA9IGZ1bmN0aW9uKGl0ZW1zKSB7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEl0ZXJhdG9yKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciAhIExhIGNsYXNzZSBJdGVyYXRvciBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRleCBkZSBiYXNlIMOgIHBhcnRpciBkdXF1ZWwgY29tbWVuY2UgdW5lIGl0w6lyYXRpb24uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBpbmRleFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICB0aGlzLl9pbmRleCA9IDA7XG4gIC8qKlxuICAgKiBDb2xsZWN0aW9uIGQnb2JqZXRzIMOgIHBhcmNvdXJpci5cbiAgICpcbiAgICogQHByb3BlcnR5IGl0ZW1zXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG5cbn07XG5cbi8qKlxuICogUHJvdG90eXBlIGRlIGwnSXRlcmF0b3JcbiAqL1xuSXRlcmF0b3IucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogTcOpdGhvZGUgdsOpcmlmaWFudCBzJ2lsIHkgYSB1biDDqWzDqW1lbnQgc3VpdmFudCBkYW5zIGxhIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBtZXRob2QgaGFzTmV4dFxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBWcmFpIHMnaWwgeSBhIHVuIMOpbMOpbWVudCBzdWl2YW50XG4gICAqL1xuICBoYXNOZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5faW5kZXggPCB0aGlzLl9pdGVtcy5sZW5ndGg7XG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSByZW52b3lhbnQgbCfDqWzDqW1lbnQgY291cmFudCBsb3JzIGRlIGwnaXTDqXJhdGlvbi5cbiAgICogTCdpbmRleCBlc3QgcGFyIGFpbGxldXJzIGluY3LDqW1lbnTDqSBwb3VyIGNvbnRpbnVlciBsZSBwYXJjb3Vycy5cbiAgICpcbiAgICogQG1ldGhvZCBuZXh0XG4gICAqIEByZXR1cm4ge09iamVjdH0gTCdvYmpldCBjb3VyYW50IGRlIGxhIGNvbGxlY3Rpb25cbiAgICovXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtc1t0aGlzLl9pbmRleCsrXTtcbiAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9hcHAvanMvbW9kdWxlcy9JdGVyYXRvci5qc1wiLFwiLy4uLy4uL2FwcC9qcy9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZm91cm5pc3NhbnQgZGVzIGVudGl0w6lzIHJlbGF0aXZlcyDDoCBsYSBtdXNpcXVlLlxuICpcbiAqIEBtb2R1bGUgTXVzaWNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBNdXNpYyA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gbW9yY2VhdSBkZSBtdXNpcXVlLlxuICAgKlxuICAgKiBAY2xhc3MgVHJhY2tcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZCBJZGVudGlmaWFudCBEZWV6ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRpdHJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcnRpc3QgQXJ0aXN0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY292ZXIgUG9jaGV0dGUgZCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRvbmFsaXTDqVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBNb2RlIChtYWpldXIgb3UgbWluZXVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG8gVGVtcG8gKGVuIEJQTSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsb3RUYWcgVGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKiBAcGFyYW0ge0FycmF5fSBoYXJtb25pZXMgVGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBUcmFjazogZnVuY3Rpb24oaWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBoYXJtb25pZXMpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5UcmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciAhIExhIGNsYXNzZSBUcmFjayBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWFudCBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIC8qKlxuICAgICAqIFRpdHJlIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGl0bGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICAgIC8qKlxuICAgICAqIEFydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfYXJ0aXN0XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fYXJ0aXN0ID0gYXJ0aXN0O1xuICAgIC8qKlxuICAgICAqIFBvY2hldHRlIGQnYWxidW1cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfY292ZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jb3ZlciA9IGNvdmVyO1xuICAgIC8qKlxuICAgICAqIFRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2tleVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICAvKipcbiAgICAgKiBNb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX21vZGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICAvKipcbiAgICAgKiBUZW1wbyBkdSBtb3JjZWF1IChlbiBCUE0pXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG8gPSB0ZW1wbztcbiAgICAvKipcbiAgICAgKiBUYWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2NhbWVsb3RUYWdcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZztcbiAgICAvKipcbiAgICAgKiBUYWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaGFybW9uaWVzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICovXG4gICAgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzO1xuXG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZMOpZmluaXNzYW50IHVuZSBoYXJtb25pZSBtdXNpY2FsZS5cbiAgICpcbiAgICogQGNsYXNzIEhhcm1vbnlcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBVbiBvYmpldCBtb3JjZWF1IChUcmFjaylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRlbXBvVmFyaWF0aW9uIFZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQWN0aXZlIEwnaGFybW9uaWUgZXN0LWVsbGUgZWZmZWN0aXZlID9cbiAgICovXG4gIEhhcm1vbnk6IGZ1bmN0aW9uKHRyYWNrLCB0ZW1wb1ZhcmlhdGlvbiwgaXNBY3RpdmUpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5IYXJtb255KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEhhcm1vbnkgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90cmFja1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl90cmFjayA9IHRyYWNrLFxuICAgIC8qKlxuICAgICAqIFZhcmlhdGlvbiBkdSB0ZW1wbyBwYXIgcmFwcG9ydCDDoCB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvVmFyaWF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbixcbiAgICAvKipcbiAgICAgKiBCb29sw6llbiB2w6lyaWZpYW50IHNpIGwnaGFybW9uaWUgZXN0IGVmZmVjdGl2ZSBvdSBub25cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaXNBY3RpdmVcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuX2lzQWN0aXZlID0gaXNBY3RpdmUsXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1pbmltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtaW5pbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpIC0gKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1heGltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWF4XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtYXhpbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01heCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpICsgKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH07XG5cbiAgfVxuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBUcmFja1xuICovXG5NdXNpYy5UcmFjay5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2lkZW50aWZpYW50IGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJZFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEwnaWQgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRpdGxlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldFRpdGxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RpdGxlOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGl0bGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIHNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyB0aGlzLl90aXRsZSA9IHRpdGxlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QXJ0aXN0XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0QXJ0aXN0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FydGlzdDsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0QXJ0aXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWwgYXJ0aXN0ZSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRBcnRpc3Q6IGZ1bmN0aW9uKGFydGlzdCkgeyB0aGlzLl9hcnRpc3QgPSBhcnRpc3Q7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q292ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBnZXRDb3ZlcjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jb3ZlcjsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgcG9jaGV0dGUgZCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldENvdmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBzZXRDb3ZlcjogZnVuY3Rpb24oY292ZXIpIHsgdGhpcy5fY292ZXIgPSBjb3ZlcjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0S2V5XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldEtleTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9rZXk7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0S2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0S2V5OiBmdW5jdGlvbihrZXkpIHsgdGhpcy5fa2V5ID0ga2V5OyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldE1vZGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBnZXRNb2RlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX21vZGU7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIG1vZGUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1vZGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKi9cbiAgc2V0TW9kZTogZnVuY3Rpb24obW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldFRlbXBvOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RlbXBvOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGVtcG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0VGVtcG86IGZ1bmN0aW9uKHRlbXBvKSB7IHRoaXMuX3RlbXBvID0gdGVtcG87IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q2FtZWxvdFRhZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldENhbWVsb3RUYWc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldENhbWVsb3RUYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oY2FtZWxvdFRhZykgeyB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRIYXJtb25pZXNcbiAgICogQHJldHVybiB7QXJyYXl9IExlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldEhhcm1vbmllczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9oYXJtb25pZXM7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBzZXRIYXJtb25pZXNcbiAgICogQHBhcmFtIHtBcnJheX0gTGVzIG5vdXZlYXV4IHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0SGFybW9uaWVzOiBmdW5jdGlvbihoYXJtb25pZXMpIHsgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzOyB9LFxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgSGFybW9ueVxuICovXG5NdXNpYy5IYXJtb255LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUcmFja1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IExlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIGdldFRyYWNrOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RyYWNrOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VHJhY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IExlIG5vdXZlYXUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgc2V0VHJhY2s6IGZ1bmN0aW9uKHRyYWNrKSB7IHRoaXMuX3RyYWNrID0gdHJhY2s7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1ZhcmlhdGlvblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKi9cbiAgZ2V0VGVtcG9WYXJpYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG9WYXJpYXRpb247IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKlxuICAgKiBAbWV0aG9kIHNldFRlbXBvVmFyaWF0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBMYSBub3V2ZWxsZSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gICBzZXRUZW1wb1ZhcmlhdGlvbjogZnVuY3Rpb24odGVtcG9WYXJpYXRpb24pIHsgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIHNhdm9pciBzaSBsJ2hhcm1vbmllIGVzdCBlZmZlY3RpdmUgb3Ugbm9uXG4gICAqXG4gICAqIEBtZXRob2QgaXNBY3RpdmVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVnJhaSBvdSBmYXV4XG4gICAqL1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9pc0FjdGl2ZTsgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qc1wiLFwiLy4uLy4uL2FwcC9qcy9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZW5jYXBzdWxhbnQgbGUgbGVjdGV1ciBhdWRpbyBmb3VybmkgcGFyIERlZXplciAoRFoucGxheWVyKS5cbiAqIExhIGNsYXNzZSBxdSdpbCBjb250aWVudCBlc3Qgw6AgbGEgZm9pcyB1biBTaW5nbGV0b24gZXQgdW4gQWRhcHRlci5cbiAqXG4gKiBAbW9kdWxlIFBsYXllclxuICogQGNsYXNzIFBsYXllclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllciA9IChmdW5jdGlvbigpIHtcblxuICAvKipcbiAgICogQXR0cmlidXQgKHByaXbDqSkgcmVwcsOpc2VudGFudCB1bmUgaW5zdGFuY2UgZGUgbGEgY2xhc3NlIGVsbGUtbcOqbWUgKGNmLiBTaW5nbGV0b24pXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwbGF5ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgdW5kZWZpbmVkXG4gICAqL1xuICB2YXIgcGxheWVyLFxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdGV1ciAocHJpdsOpKSBjaGFyZ8OpIGQnaW5pdGlhbGlzZXIgbGUgcGxheWVyIChjZi4gU2luZ2xldG9uKVxuICAgICAqXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICAgIGNvbnN0cnVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBtb3JjZWF1eCBzb250IGNoYXJnw6lzIGRhbnMgbGUgbGVjdGV1clxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkgdHJhY2tzTG9hZGVkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50cmFja3NMb2FkZWQgPSBmYWxzZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF0dHJpYnV0IGluZGlxdWFudCBsYSBwb3NpdGlvbiBkZSBsYSB0w6p0ZSBkZSBsZWN0dXJlIGRhbnMgbGUgbW9yY2VhdSBlbiBjb3Vyc1xuICAgICAgICAgKiBMYSB2YWxldXIgc2Ugc2l0dWUgZW50cmUgMCBldCAxMDAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB0cmFja1Bvc2l0aW9uXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHJhY2tQb3NpdGlvbiA9IDAsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNw6l0aG9kZSBlZmZlY3R1YW50IHLDqWVsbGVtZW50IGwnaW5pdGlhbGlzYXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBpbml0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6ICcxNjk3MTEnLFxuICAgICAgICAgICAgICBjaGFubmVsVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FwcCcsXG4gICAgICAgICAgICAgIHBsYXllcjoge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogJ3BsYXllcicsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogODAsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnc3F1YXJlJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFyZ2VtZW50IGV0IGxlY3R1cmUgZGVzIG1vcmNlYXV4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcGxheVRyYWNrc1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBpZHMgVGFibGVhdSBjb250ZW5hbnQgbGVzIGlkZW50aWZpYW50cyBkZXMgbW9yY2VhdXhcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEluZGljZSBkdSBwcmVtaWVyIG1vcmNlYXVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheVRyYWNrcyA9IGZ1bmN0aW9uKGlkcywgaW5kZXgpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucGxheVRyYWNrcyhpZHMsIGluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExlY3R1cmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwbGF5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucGxheSgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogUGF1c2VcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5wYXVzZSgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU3VpdmFudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHN1aXZhbnRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcsOpY8OpZGVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHByZXZcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5wcmV2KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbGxlciDDoC4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHNlZWtcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvcyBQb3NpdGlvbiBkZSBsYSB0w6p0ZSBkZSBsZWN0dXJlIChlbnRyZSAwIGV0IDEwMClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2VlayA9IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAgIERaLnBsYXllci5zZWVrKHBvcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3RpdmVyL0TDqXNhY3RpdmVyIGxlIHNvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIG11dGVcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc011dGUgVnJhaSBvdSBmYXV4XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm11dGUgPSBmdW5jdGlvbihpc011dGUpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2V0TXV0ZShpc011dGUpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc1JhbmRvbSBWcmFpIG91IGZhdXhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmFuZG9tID0gZnVuY3Rpb24oaXNSYW5kb20pIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2V0U2h1ZmZsZShpc1JhbmRvbSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3RpdmVyL0TDqXNhY3RpdmVyIGxhIGxlY3R1cmUgcsOpcMOpdMOpZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHJlcGVhdFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gY29kZSAwIChubyByZXBlYXQpLCAxIChyZXBlYXQgYWxsKSwgb3UgMiAocmVwZWF0IG9uZSlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVwZWF0ID0gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgIERaLnBsYXllci5zZXRSZXBlYXQoY29kZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgcmV0dXJuIG5ldyBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkw6lsaXZyYW50IGwndW5pcXVlIGluc3RhbmNlIGRlIGxhIGNsYXNzZSAoY2YuIFNpbmdsZXRvbilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0UGxheWVyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBVbmUgaW5zdGFuY2UgZGUgcGxheWVyXG4gICAgICovXG4gICAgdGhpcy5nZXRQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChwbGF5ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwbGF5ZXIgPSBuZXcgY29uc3RydWN0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGxheWVyO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwib01mcEFuXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzXCIsXCIvLi4vLi4vYXBwL2pzL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBlbmNhcHN1bGFudCBsZSBsZWN0ZXVyIGF1ZGlvIGZvdXJuaSBwYXIgRGVlemVyXG4gKiBMZSBtb2R1bGUgcydhcHB1aWUgc3VyIGxlIG1vZMOobGUgTVZWTSBkZSBWdWUuanMuXG4gKlxuICogQG1vZHVsZSBQbGF5bGlzdFxuICogQGNsYXNzIFBsYXlsaXN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUGxheWxpc3QgPSBuZXcgVnVlKHtcbiAgZWw6IFwiI2FwcFwiLFxuICBkYXRhOiB7XG4gICAgLyoqXG4gICAgICogQXR0cmlidXQgcmVwcsOpc2VudGFudCBsJ2lkIGRlIGxhIHBsYXlsaXN0IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkZWV6ZXJJZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgLTFcbiAgICAgKi9cbiAgICBkZWV6ZXJJZDogLTEsXG4gICAgLyoqXG4gICAgICogQXR0cmlidXQgcmVwcsOpc2VudGFudCBsYSBsaXN0ZSBkZXMgbW9yY2VhdXggc291cyBmb3JtZSBkJ2lkZW50aWZpYW50cyBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB0cmFja3NJZHNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQGRlZmF1bHQgW11cbiAgICAgKi9cbiAgICB0cmFja3NJZHM6IFtdLFxuICAgIC8qKlxuICAgICAqIEF0dHJpYnV0IHJlcHLDqXNlbnRhbnQgbGEgbGlzdGUgZGVzIG1vcmNlYXV4IHNvdXMgZm9ybWUgZCdvYmpldHMgVHJhY2tcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RlZFRyYWNrc1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAqL1xuICAgIHNlbGVjdGVkVHJhY2tzOiBbXVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgLyoqXG4gICAgICogQWpvdXQgZCd1biBtb3JjZWF1IMOgIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFkZFRyYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyYWNrIE9iamV0IFRyYWNrXG4gICAgICovXG4gICAgYWRkVHJhY2s6IGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICB0aGlzLnRyYWNrc0lkcy5wdXNoKHRyYWNrLl9pZCk7XG4gICAgICB0aGlzLnNlbGVjdGVkVHJhY2tzLnB1c2godHJhY2spO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU3VwcHJlc3Npb24gZCd1biBtb3JjZWF1IGRlIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVRyYWNrXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGkgSW5kZXggZHUgbW9yY2VhdSBkYW5zIGxhIHBsYXlsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlVHJhY2s6IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHRoaXMudHJhY2tzSWRzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3Muc3BsaWNlKGksIDEpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUsOpaW5pdGlhbGlzZXIgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyYWNrc0lkcyA9IFtdO1xuICAgICAgdGhpcy5zZWxlY3RlZFRyYWNrcyA9IFtdO1xuICAgIH1cbiAgfVxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwib01mcEFuXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vYXBwL2pzL21vZHVsZXMvUGxheWxpc3QuanNcIixcIi8uLi8uLi9hcHAvanMvbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogQ2xhc3NlIG1ldHRhbnQgZW4gxZN1dnJlIGxlIHBhdHRlcm4gU3RyYXRlZ3kuXG4gKiBDZXR0ZSBjbGFzc2UgZm91cm5pdCB1biBtb3llbiBkJ2VuY2Fwc3VsZXIgdW5lIHPDqXJpZSBkJ2FsZ29yaXRobWVzIGRlIHRyaS5cbiAqXG4gKiBAbW9kdWxlIFNvcnRpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBTb3J0aW5nID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGfDqW7DqXJpcXVlIHJlcHLDqXNlbnRhbnQgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQGNsYXNzIFN0cmF0ZWd5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgU3RyYXRlZ3k6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIEFsZ29yaXRobWUgZGUgdHJpIGNvdXJhbnRcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBhbGdvcml0aG1cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHRoaXMuX2FsZ29yaXRobTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHBhciBkw6lmYXV0LlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gb3UgKFhPUikgZW4gdG9uYWxpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIERlZmF1bHRcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgcGFyIGTDqWZhdXRcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpLFxuICAgICAgICAgICAgdGVtcG8gPSB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICAgICAgdGVtcG9NaW4gPSBoYXJtb255LnRlbXBvTWluKCksXG4gICAgICAgICAgICB0ZW1wb01heCA9IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgICAgIGlzTWF0Y2hpbmcgPSAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmICh0ZW1wbyA+PSB0ZW1wb01pbiAmJiB0ZW1wbyA8PSB0ZW1wb01heCAmJiBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgMCwgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB1bmUgY29uZGl0aW9uICh0ZW1wbyBvdSB0b25hbGl0w6kpIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoKHRlbXBvID49IHRlbXBvTWluICYmIHRlbXBvIDw9IHRlbXBvTWF4KSB8fCBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICBpZiAoIUdVSS5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgICAgYXJ0aXN0ID0gdHJhY2suZ2V0QXJ0aXN0KCk7XG5cbiAgICAgICAgICAvLyBTaSBsJ2FydGlzdGUgbidhIHBhcyDDqXTDqSByZW5jb250csOpIGRhbnMgbGVzIHN1Z2dlc3Rpb25zIHByw6ljw6lkZW50ZXMuLi5cbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGFydGlzdCwgYXJ0aXN0cykgPT0gLTEpIHtcbiAgICAgICAgICAgIGFydGlzdHMucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgdHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2tzID0gc2ltaWxhclRyYWNrcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRyYWNrcztcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgdmFsb3Jpc2FudCBsZSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvLCBzdWl2aXMgZGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBUZW1wb0ZpcnN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgVGVtcG9GaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIHZhbG9yaXNhbnQgbGUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBuYlRlbXBvTWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wb1xuICAgICAgICAgIGFydGlzdHMgPSBbXSwgLy8gVG91cyBsZXMgYXJ0aXN0ZXMgcmVuY29udHLDqXMgZGFucyBsZXMgcsOpc3VsdGF0c1xuICAgICAgICAgIHRyYWNrcyA9IFtdLCAvLyBMZXMgbW9yY2VhdXggw6AgcmVudm95ZXIgw6AgbCdpc3N1ZSBkdSB0cmlcbiAgICAgICAgICByZWFycmFuZ2UgPSBmdW5jdGlvbihyZW1vdmVJbmRleCwgaW5zZXJ0SW5kZXgsIHRyYWNrKSB7XG4gICAgICAgICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShyZW1vdmVJbmRleCwgMSk7XG4gICAgICAgICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShpbnNlcnRJbmRleCwgMCwgdHJhY2spO1xuICAgICAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICBjdXJyZW50VGVtcG8gPSB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICAgICAgdGVtcG9NaW4gPSBoYXJtb255LnRlbXBvTWluKCksXG4gICAgICAgICAgICB0ZW1wb01heCA9IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgICAgIGlzTWF0Y2hpbmcgPSAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmIChjdXJyZW50VGVtcG8gPj0gdGVtcG9NaW4gJiYgY3VycmVudFRlbXBvIDw9IHRlbXBvTWF4ICYmIGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCAwLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0ZW1wby4uLlxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXgpIHtcbiAgICAgICAgICAgIG5iVGVtcG9NYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRvbmFsaXTDqS4uLlxuICAgICAgICB9IGVsc2UgaWYgKGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wb1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMgKyBuYlRlbXBvTWF0Y2hlcywgdHJhY2spO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgaWYgKCFHVUkuZHVwbGljYXRlc0FsbG93ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpO1xuXG4gICAgICAgICAgLy8gU2kgbCdhcnRpc3RlIG4nYSBwYXMgw6l0w6kgcmVuY29udHLDqSBkYW5zIGxlcyBzdWdnZXN0aW9ucyBwcsOpY8OpZGVudGVzLi4uXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShhcnRpc3QsIGFydGlzdHMpID09IC0xKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goYXJ0aXN0KTtcbiAgICAgICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrcyA9IHNpbWlsYXJUcmFja3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHZhbG9yaXNhbnQgbGEgdG9uYWxpdMOpLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdG9uYWxpdMOpLCBzdWl2aXMgZGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIEtleUZpcnN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgS2V5Rmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSB2YWxvcmlzYW50IGxhIHRvbmFsaXTDqVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciBuYlBlcmZlY3RNYXRjaGVzID0gMCwgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqVxuICAgICAgICAgIG5iS2V5TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0b25hbGl0w6lcbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8vIFBvdXIgY2hhcXVlIG1vcmNlYXUsIG9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcyBpbmRpc3BlbnNhYmxlc1xuICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgY3VycmVudFRlbXBvID0gdHJhY2suZ2V0VGVtcG8oKSxcbiAgICAgICAgICAgIHRlbXBvTWluID0gaGFybW9ueS50ZW1wb01pbigpLFxuICAgICAgICAgICAgdGVtcG9NYXggPSBoYXJtb255LnRlbXBvTWF4KCksXG4gICAgICAgICAgICBpc01hdGNoaW5nID0gKCQuaW5BcnJheSh0cmFjay5nZXRDYW1lbG90VGFnKCksIHJlZlRyYWNrLmdldEhhcm1vbmllcygpKSAhPSAtMSk7XG5cbiAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSByZW1wbGl0IHRvdXRlcyBsZXMgY29uZGl0aW9ucyBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICBpZiAoY3VycmVudFRlbXBvID49IHRlbXBvTWluICYmIGN1cnJlbnRUZW1wbyA8PSB0ZW1wb01heCAmJiBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgMCwgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdG9uYWxpdMOpLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJLZXlNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRlbXBvLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRlbXBvID49IHRlbXBvTWluICYmIGN1cnJlbnRUZW1wbyA8PSB0ZW1wb01heCkge1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMgKyBuYktleU1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vIFNpIGxlcyBkb3VibG9ucyBuZSBzb250IHBhcyBhdXRvcmlzw6lzLCBvbiBmaWx0cmVcbiAgICAgIGlmICghR1VJLmR1cGxpY2F0ZXNBbGxvd2VkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhY2tzO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4LCBjb21wYXRpYmxlcyBvdSBub24sIHNvbnQgcmFuZ8OpcyBkdSBCUE0gbGUgcGx1cyBsZW50IGF1IEJQTSBsZSBwbHVzIHJhcGlkZS5cbiAgICpcbiAgICogQGNsYXNzIEFzY2VuZGluZ1RlbXBvXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgQXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgcmV0dXJuIF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCwgY29tcGF0aWJsZXMgb3Ugbm9uLCBzb250IHJhbmfDqXMgZHUgQlBNIGxlIHBsdXMgcmFwaWRlIGF1IEJQTSBsZSBwbHVzIGxlbnQuXG4gICAqXG4gICAqIEBjbGFzcyBEZXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBkw6ljcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgc2ltaWxhclRyYWNrcyA9IF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICAgIHJldHVybiBzaW1pbGFyVHJhY2tzLnJldmVyc2UoKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1biBhbGdvcml0aG1lIGZpY3RpZiBuJ2VmZmVjdHVhbnQgYXVjdW4gdHJpLlxuICAgKiBDZXR0ZSBjbGFzc2UgbidleGlzdGUgcXVlIHBvdXIgZGVzIHJhaXNvbnMgc8OpbWFudGlxdWVzLlxuICAgKlxuICAgKiBAY2xhc3MgTm9uZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIE5vbmU6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIG4nYXBwbGlxdWFudCBhdWN1biB0cmlcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICByZXR1cm4gc2ltaWxhclRyYWNrcztcbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgU3RyYXRlZ3lcbiAqL1xuU29ydGluZy5TdHJhdGVneS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsZ29yaXRobVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqL1xuICBnZXRBbGdvcml0aG06IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QWxnb3JpdGhtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhbGdvcml0aG0gTGUgbm91dmVsIGFsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKi9cbiAgc2V0QWxnb3JpdGhtOiBmdW5jdGlvbihhbGdvcml0aG0pIHtcbiAgICB0aGlzLl9hbGdvcml0aG0gPSBhbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBhYnN0cmFpdGUgZGUgdHJpLlxuICAgKiBDZXR0ZSBkZXJuacOocmUgc2UgY29udGVudGUgZGUgZMOpbMOpZ3VlciBsZSB0cmkgw6AgdW5lIG3DqXRob2RlIGNvbmNyw6h0ZS5cbiAgICpcbiAgICogQG1ldGhvZCBzb3J0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqSwgc2Vsb24gbCdhbGdvcml0aG1lIGNvdXJhbnRcbiAgICovXG4gIHNvcnQ6IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZ29yaXRobS5zb3J0KHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKTtcbiAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9hcHAvanMvbW9kdWxlcy9Tb3J0aW5nLmpzXCIsXCIvLi4vLi4vYXBwL2pzL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCB1bmUgY2xhc3NlIHBvdXIgbGEgZ2VzdGlvbiBzaW1wbGlmacOpZSBkZXMgdXRpbGlzYXRldXJzXG4gKlxuICogQG1vZHVsZSBVc2VyXG4gKiBAY2xhc3MgVXNlclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgSWRlbnRpZmlhbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFBzZXVkb1xuICogQHBhcmFtIHtTdHJpbmd9IGluc2NyaXB0aW9uRGF0ZSBEYXRlIGQnaW5zY3JpcHRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5rIExpZW4gdmVycyBsZSBwcm9maWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBwaWN0dXJlIExpZW4gdmVycyBsJ2F2YXRhclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXIgPSBmdW5jdGlvbihpZCwgbmFtZSwgaW5zY3JpcHRpb25EYXRlLCBsaW5rLCBwaWN0dXJlKSB7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVzZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIFVzZXIgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gIH1cblxuICAvKipcbiAgICogSWRlbnRpZmlhbnRcbiAgICpcbiAgICogQHByb3BlcnR5IGlkXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRoaXMuX2lkID0gaWQ7XG4gIC8qKlxuICAgKiBQc2V1ZG9cbiAgICpcbiAgICogQHByb3BlcnR5IG5hbWVcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJcIlxuICAgKi9cbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIC8qKlxuICAgKiBEYXRlIGQnaW5zY3JpcHRpb25cbiAgICpcbiAgICogQHByb3BlcnR5IGluc2NyaXB0aW9uRGF0ZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcIlwiXG4gICAqL1xuICB0aGlzLl9pbnNjcmlwdGlvbkRhdGUgPSBpbnNjcmlwdGlvbkRhdGU7XG4gIC8qKlxuICAgKiBMaWVuIHZlcnMgbGUgcHJvZmlsXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBsaW5rXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiXCJcbiAgICovXG4gIHRoaXMuX2xpbmsgPSBsaW5rO1xuICAvKipcbiAgICogTGllbiB2ZXJzIGwnYXZhdGFyXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwaWN0dXJlXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiXCJcbiAgICovXG4gIHRoaXMuX3BpY3R1cmUgPSBwaWN0dXJlO1xuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBVc2VyXG4gKi9cblVzZXIucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdpZGVudGlmaWFudCBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SWRcbiAgICogQHJldHVybiB7TnVtYmVyfSBMJ2lkIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgcHNldWRvIGRlIGwndXRpbGlzYXRldXJcbiAgICpcbiAgICogQG1ldGhvZCBnZXROYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgcHNldWRvIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldE5hbWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbmFtZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIGRhdGUgZCdpbnNjcmlwdGlvbiBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SW5zY3JpcHRpb25EYXRlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgZGF0ZSBkJ2luc2NyaXB0aW9uIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldEluc2NyaXB0aW9uRGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aGlzLl9pbnNjcmlwdGlvbkRhdGUpLFxuICAgICAgICBkID0gZGF0ZS5nZXREYXRlKCksXG4gICAgICAgIG0gPSBkYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgICB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBkICsgXCIvXCIgKyBtICsgXCIvXCIgKyB5O1xuICB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbGllbiB2ZXJzIGxlIHByb2ZpbCBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0TGlua1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIGxpZW4gdmVycyBsZSBwcm9maWwgZGUgbCd1dGlsaXNhdGV1clxuICAgKi9cbiAgZ2V0TGluazogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9saW5rOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhdmF0YXIgZGUgbCd1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAbWV0aG9kIGdldFBpY3R1cmVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMJ2F2YXRhciBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqL1xuICBnZXRQaWN0dXJlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3BpY3R1cmU7IH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwib01mcEFuXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vYXBwL2pzL21vZHVsZXMvVXNlci5qc1wiLFwiLy4uLy4uL2FwcC9qcy9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiAgT2JqZXRzIHV0aWxlcyBwb3VyIGxlIHRyYWl0ZW1lbnQgZGVzIHLDqXBvbnNlcyB2ZW5hbnQgZCdFY2hvIE5lc3RcbiAqXG4gKiBAbW9kdWxlIFZvY2FidWxhcnlcbiAqIEBjbGFzcyBWb2NhYnVsYXJ5XG4gKiBAY29uc3RydWN0b3JcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBWb2NhYnVsYXJ5ID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBNb2RlIChtYWpldXIgZXQgbWluZXVyKVxuICpcbiAqIEBwcm9wZXJ0eSBtb2Rlc1xuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkubW9kZXMgPSB7XG4gICAgXCIwXCI6IFwibWluZXVyXCIsXG4gICAgXCIxXCI6IFwibWFqZXVyXCJcbn07XG5cbi8qKlxuICogTm90ZXMsIHNlbG9uIGxhIG5vdGF0aW9uIHN5bGxhYmlxdWVcbiAqXG4gKiBAcHJvcGVydHkgbm90ZXNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmtleXMgPSB7XG4gICAgXCIwXCI6IFwiZG9cIixcbiAgICBcIjFcIjogXCJkbyNcIixcbiAgICBcIjJcIjogXCJyw6lcIixcbiAgICBcIjNcIjogXCJtaWJcIixcbiAgICBcIjRcIjogXCJtaVwiLFxuICAgIFwiNVwiOiBcImZhXCIsXG4gICAgXCI2XCI6IFwiZmEjXCIsXG4gICAgXCI3XCI6IFwic29sXCIsXG4gICAgXCI4XCI6IFwibGFiXCIsXG4gICAgXCI5XCI6IFwibGFcIixcbiAgICBcIjEwXCI6IFwic2liXCIsXG4gICAgXCIxMVwiOiBcInNpXCJcbn07XG5cbi8qKlxuICogTWl4IGhhcm1vbmlxdWUgKG1vZGUgKyBub3RlID0gdW4gdGFnIHN1ciBsYSByb3VlIGRlIENhbWVsb3QpXG4gKlxuICogQHByb3BlcnR5IGhhcm1vbmljTWl4XG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5oYXJtb25pY01peCA9IHtcbiAgICBcIm1pbmV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI1QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyw6lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI3QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMkFcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNEFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkFcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjFBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjhBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIzQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMEFcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIm1hamV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI4QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiM0JcIlxuICAgICAgICB9LFxuICAgICAgICBcInLDqVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEwQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNUJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjdCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYSNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIyQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUJcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjRCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2liXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMUJcIlxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUcmFkdWN0aW9uIGRlIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICpcbiAqIEBwcm9wZXJ0eSBjYW1lbG90V2hlZWxcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbCA9IHtcbiAgICBcIjFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQS1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxQVwiLCBcIjEyQVwiLCBcIjJBXCIsIFwiMUJcIl1cbiAgICB9LFxuICAgIFwiMkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJBXCIsIFwiMUFcIiwgXCIzQVwiLCBcIjJCXCJdXG4gICAgfSxcbiAgICBcIjNBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQVwiLCBcIjJBXCIsIFwiNEFcIiwgXCIzQlwiXVxuICAgIH0sXG4gICAgXCI0QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjRBXCIsIFwiM0FcIiwgXCI1QVwiLCBcIjRCXCJdXG4gICAgfSxcbiAgICBcIjVBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNUFcIiwgXCI0QVwiLCBcIjZBXCIsIFwiNUJcIl1cbiAgICB9LFxuICAgIFwiNkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QVwiLCBcIjVBXCIsIFwiN0FcIiwgXCI2QlwiXVxuICAgIH0sXG4gICAgXCI3QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdBXCIsIFwiNkFcIiwgXCI4QVwiLCBcIjdCXCJdXG4gICAgfSxcbiAgICBcIjhBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEFcIiwgXCI3QVwiLCBcIjlBXCIsIFwiOEJcIl1cbiAgICB9LFxuICAgIFwiOUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QVwiLCBcIjhBXCIsIFwiMTBBXCIsIFwiOUJcIl1cbiAgICB9LFxuICAgIFwiMTBBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQiBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBBXCIsIFwiOUFcIiwgXCIxMUFcIiwgXCIxMEJcIl1cbiAgICB9LFxuICAgIFwiMTFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBGbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMUFcIiwgXCIxMEFcIiwgXCIxMkFcIiwgXCIxMUJcIl1cbiAgICB9LFxuICAgIFwiMTJBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMkFcIiwgXCIxMUFcIiwgXCIxQVwiLCBcIjEyQlwiXVxuICAgIH0sXG4gICAgXCIxQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkIgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjFCXCIsIFwiMTJCXCIsIFwiMkJcIiwgXCIxQVwiXVxuICAgIH0sXG4gICAgXCIyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYtU2hhcnAgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJCXCIsIFwiMUJcIiwgXCIzQlwiLCBcIjJBXCJdXG4gICAgfSxcbiAgICBcIjNCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQlwiLCBcIjJCXCIsIFwiNEJcIiwgXCIzQVwiXVxuICAgIH0sXG4gICAgXCI0QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNEJcIiwgXCIzQlwiLCBcIjVCXCIsIFwiNEFcIl1cbiAgICB9LFxuICAgIFwiNUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjVCXCIsIFwiNEJcIiwgXCI2QlwiLCBcIjVBXCJdXG4gICAgfSxcbiAgICBcIjZCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QlwiLCBcIjVCXCIsIFwiN0JcIiwgXCI2QVwiXVxuICAgIH0sXG4gICAgXCI3QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdCXCIsIFwiNkJcIiwgXCI4QlwiLCBcIjdBXCJdXG4gICAgfSxcbiAgICBcIjhCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEJcIiwgXCI3QlwiLCBcIjlCXCIsIFwiOEFcIl1cbiAgICB9LFxuICAgIFwiOUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QlwiLCBcIjhCXCIsIFwiMTBCXCIsIFwiOUFcIl1cbiAgICB9LFxuICAgIFwiMTBCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBCXCIsIFwiOUJcIiwgXCIxMUJcIiwgXCIxMEFcIl1cbiAgICB9LFxuICAgIFwiMTFCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTFCXCIsIFwiMTBCXCIsIFwiMTJCXCIsIFwiMTFBXCJdXG4gICAgfSxcbiAgICBcIjEyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEyQlwiLCBcIjExQlwiLCBcIjFCXCIsIFwiMTJBXCJdXG4gICAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9hcHAvanMvbW9kdWxlcy9Wb2NhYnVsYXJ5LmpzXCIsXCIvLi4vLi4vYXBwL2pzL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIm9NZnBBblwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIm9NZnBBblwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFZvY2FidWxhcnkgPSByZXF1aXJlKCcuLi8uLi9hcHAvanMvbW9kdWxlcy9Wb2NhYnVsYXJ5LmpzJyksXG4gICAgSXRlcmF0b3IgPSByZXF1aXJlKCcuLi8uLi9hcHAvanMvbW9kdWxlcy9JdGVyYXRvci5qcycpLFxuICAgIE11c2ljID0gcmVxdWlyZSgnLi4vLi4vYXBwL2pzL21vZHVsZXMvTXVzaWMuanMnKSxcbiAgICBBamF4ID0gcmVxdWlyZSgnLi4vLi4vYXBwL2pzL21vZHVsZXMvQWpheC5qcycpLFxuICAgIFNvcnRpbmcgPSByZXF1aXJlKCcuLi8uLi9hcHAvanMvbW9kdWxlcy9Tb3J0aW5nLmpzJyksXG4gICAgUGxheWVyID0gcmVxdWlyZSgnLi4vLi4vYXBwL2pzL21vZHVsZXMvUGxheWVyJyksXG4gICAgUGxheWxpc3QgPSByZXF1aXJlKCcuLi8uLi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdCcpLFxuICAgIFVzZXIgPSByZXF1aXJlKCcuLi8uLi9hcHAvanMvbW9kdWxlcy9Vc2VyJyksXG4gICAgLy8gTGUgbW9kdWxlIEdVSSBuJ2VzdCBwYXMgdnJhaW1lbnQgdGVzdMOpIGljaS4gVm9pciBsZXMgdGVzdHMgZm9uY3Rpb25uZWxzLlxuICAgIEdVSSA9IHJlcXVpcmUoJy4uLy4uL2FwcC9qcy9tb2R1bGVzL0dVSScpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5RVW5pdC50ZXN0KCBcIlZvY2FidWxhcnlcIiwgZnVuY3Rpb24oIGFzc2VydCApIHtcbiAgYXNzZXJ0LmV4cGVjdCggNCApO1xuXG4gIHZhciBtb2RlID0gVm9jYWJ1bGFyeS5tb2Rlc1swXSxcbiAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1s5XVxuICAgICAgaGFybW9uaWNNaXggPSBWb2NhYnVsYXJ5Lmhhcm1vbmljTWl4W21vZGVdW2tleV0udGFnLFxuICAgICAgY2FtZWxvdFdoZWVsID0gVm9jYWJ1bGFyeS5jYW1lbG90V2hlZWxbaGFybW9uaWNNaXhdLm1hdGNoZXM7XG5cbiAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlLCBcIm1pbmV1clwiLCBcIk1vZGUgOiBtaW5ldXJcIik7XG4gIGFzc2VydC5kZWVwRXF1YWwoa2V5LCBcImxhXCIsIFwiVG9uYWxpdMOpIDogTGFcIik7XG4gIGFzc2VydC5kZWVwRXF1YWwoaGFybW9uaWNNaXgsIFwiOEFcIiwgXCJUYWcgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFwiKTtcbiAgYXNzZXJ0LmRlZXBFcXVhbChjYW1lbG90V2hlZWwsIFtcIjhBXCIsIFwiN0FcIiwgXCI5QVwiLCBcIjhCXCJdLCBcIkhhcm1vbmllcyBwb3NzaWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFwiKTtcbn0pO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5RVW5pdC50ZXN0KCBcIkl0ZXJhdG9yXCIsIGZ1bmN0aW9uKCBhc3NlcnQgKSB7XG4gIGFzc2VydC5leHBlY3QoIDggKTtcblxuICB2YXIgY29sbGVjdGlvbiA9IFtcIlRvdG9cIiwgXCJUYXRhXCIsIFwiVGl0aVwiXSxcbiAgICAgIGl0ZXJhdG9yID0gbmV3IEl0ZXJhdG9yKGNvbGxlY3Rpb24pO1xuXG4gIGFzc2VydC5vayhpdGVyYXRvci5oYXNOZXh0KCksIFwiw4lsw6ltZW50IHN1aXZhbnRcIik7XG4gIGFzc2VydC5lcXVhbChpdGVyYXRvci5uZXh0KCksIFwiVG90b1wiLCBcIlByZW1pw6hyZSBpdMOpcmF0aW9uXCIpO1xuICBhc3NlcnQub2soaXRlcmF0b3IuaGFzTmV4dCgpLCBcIsOJbMOpbWVudCBzdWl2YW50XCIpO1xuICBhc3NlcnQuZXF1YWwoaXRlcmF0b3IubmV4dCgpLCBcIlRhdGFcIiwgXCJEZXV4acOobWUgaXTDqXJhdGlvblwiKTtcbiAgYXNzZXJ0Lm9rKGl0ZXJhdG9yLmhhc05leHQoKSwgXCLDiWzDqW1lbnQgc3VpdmFudFwiKTtcbiAgYXNzZXJ0LmVxdWFsKGl0ZXJhdG9yLm5leHQoKSwgXCJUaXRpXCIsIFwiVHJvaXNpw6htZSBpdMOpcmF0aW9uXCIpO1xuICBhc3NlcnQubm90T2soaXRlcmF0b3IuaGFzTmV4dCgpLCBcIlBhcyBkJ8OpbMOpbWVudCBzdWl2YW50XCIpO1xuICBhc3NlcnQudGhyb3dzKFxuICAgIGZ1bmN0aW9uKCkge1xuICAgICAgSXRlcmF0b3IoY29sbGVjdGlvbik7XG4gICAgfSxcbiAgICBFcnJvcixcbiAgICBcIkVycmV1ciAhIExhIGNsYXNzZSBJdGVyYXRvciBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiXG4gICk7XG59KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuUVVuaXQudGVzdCggXCJNdXNpY1wiLCBmdW5jdGlvbiggYXNzZXJ0ICkge1xuICBhc3NlcnQuZXhwZWN0KCA1ICk7XG5cbiAgdmFyIGlkID0gMTIzNDU2NyxcbiAgICAgIHRpdGxlID0gXCJGYXIgQmV5b25kIFRoZSBTdW5cIixcbiAgICAgIGFydGlzdCA9IFwiWW5nd2llIE1hbG1zdGVlblwiLFxuICAgICAgY292ZXIgPSBcInJpc2luZy1mb3JjZS5wbmdcIixcbiAgICAgIGtleSA9IFwiZmFcIixcbiAgICAgIG1vZGUgPSBcIm1pbmV1clwiLFxuICAgICAgdGVtcG8gPSAxMjUsXG4gICAgICBjYW1lbG90VGFnID0gXCI0QVwiLFxuICAgICAgaGFybW9uaWVzID0gW1wiNEFcIiwgXCIzQVwiLCBcIjVBXCIsIFwiNEJcIl0sXG4gICAgICB0ZW1wb1ZhcmlhdGlvbiA9IDAuMDUsXG4gICAgICBpc0FjdGl2ZSA9IHRydWUsXG4gICAgICB0cmFjayA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyksXG4gICAgICBoYXJtb255ID0gbmV3IE11c2ljLkhhcm1vbnkodHJhY2ssIHRlbXBvVmFyaWF0aW9uLCBpc0FjdGl2ZSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHRyYWNrLmdldFRpdGxlKCksIFwiRmFyIEJleW9uZCBUaGUgU3VuXCIsIFwiVGl0cmUgZHUgbW9yY2VhdVwiKTtcbiAgYXNzZXJ0Lm9rKHRyYWNrLmdldEhhcm1vbmllcygpIGluc3RhbmNlb2YgQXJyYXksIFwiSGFybW9uaWVzIHBvc3NpYmxlc1wiKTtcbiAgYXNzZXJ0LmVxdWFsKGhhcm1vbnkuZ2V0VHJhY2soKS5nZXRUZW1wbygpLCAxMjUsIFwiVGVtcG8gZHUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZSBhdSBzZWluIGQndW5lIGhhcm1vbmllXCIpO1xuICBhc3NlcnQudGhyb3dzKFxuICAgIGZ1bmN0aW9uKCkge1xuICAgICAgTXVzaWMuVHJhY2sodGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG4gICAgfSxcbiAgICBFcnJvcixcbiAgICBcIkVycmV1ciAhIExhIGNsYXNzZSBUcmFjayBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiXG4gICk7XG4gIGFzc2VydC50aHJvd3MoXG4gICAgZnVuY3Rpb24oKSB7XG4gICAgICBNdXNpYy5IYXJtb255KHRyYWNrLCB0ZW1wb1ZhcmlhdGlvbiwgaXNBY3RpdmUpO1xuICAgIH0sXG4gICAgRXJyb3IsXG4gICAgXCJFcnJldXIgISBMYSBjbGFzc2UgSGFybW9ueSBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiXG4gICk7XG59KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuUVVuaXQudGVzdCggXCJBamF4XCIsIGZ1bmN0aW9uKCBhc3NlcnQgKSB7XG4gIGFzc2VydC5leHBlY3QoIDQgKTtcblxuICB2YXIgcmVxdWVzdEZhY3RvcnkgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpLFxuICAgICAgZGVlemVyUmVxdWVzdCA9IHJlcXVlc3RGYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiXCIpLFxuICAgICAgZWNob25lc3RSZXF1ZXN0ID0gcmVxdWVzdEZhY3RvcnkuZ2V0QWpheFJlcXVlc3QoXCJlY2hvbmVzdFwiLCBcIlwiKTtcblxuICBhc3NlcnQub2soZGVlemVyUmVxdWVzdCBpbnN0YW5jZW9mIEFqYXguUmVxdWVzdCwgXCJJbnN0YW5jZSBkZSBSZXF1ZXN0XCIpO1xuICBhc3NlcnQub2soZWNob25lc3RSZXF1ZXN0IGluc3RhbmNlb2YgQWpheC5SZXF1ZXN0LCBcIkluc3RhbmNlIGRlIFJlcXVlc3RcIik7XG4gIGFzc2VydC5vayhkZWV6ZXJSZXF1ZXN0IGluc3RhbmNlb2YgQWpheC5EZWV6ZXJBUElSZXF1ZXN0LCBcIkluc3RhbmNlIGRlIERlZXplckFQSVJlcXVlc3RcIik7XG4gIGFzc2VydC5vayhlY2hvbmVzdFJlcXVlc3QgaW5zdGFuY2VvZiBBamF4LkVjaG9OZXN0QVBJUmVxdWVzdCwgXCJJbnN0YW5jZSBkZSBFY2hvTmVzdEFQSVJlcXVlc3RcIik7XG59KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuUVVuaXQudGVzdCggXCJTb3J0aW5nXCIsIGZ1bmN0aW9uKCBhc3NlcnQgKSB7XG4gIGFzc2VydC5leHBlY3QoIDIzICk7XG5cbiAgdmFyIHNvcnRpbmdTdHJhdGVneSA9IG5ldyBTb3J0aW5nLlN0cmF0ZWd5KCksXG4gICAgICBkZWZhdWx0U29ydGluZyA9IG5ldyBTb3J0aW5nLkRlZmF1bHQoKSxcbiAgICAgIHRlbXBvRmlyc3RTb3J0aW5nID0gbmV3IFNvcnRpbmcuVGVtcG9GaXJzdCgpLFxuICAgICAga2V5Rmlyc3RTb3J0aW5nID0gbmV3IFNvcnRpbmcuS2V5Rmlyc3QoKSxcbiAgICAgIGFzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkFzY2VuZGluZ1RlbXBvKCksXG4gICAgICBkZXNjVGVtcG9Tb3J0aW5nID0gbmV3IFNvcnRpbmcuRGVzY2VuZGluZ1RlbXBvKCksXG4gICAgICBub1NvcnRpbmcgPSBuZXcgU29ydGluZy5Ob25lKCk7XG5cbiAgYXNzZXJ0LmVxdWFsKHNvcnRpbmdTdHJhdGVneS5nZXRBbGdvcml0aG0oKSwgdW5kZWZpbmVkLCBcIlN0cmF0w6lnaWUgZGUgdHJpIG5vbiBkw6lmaW5pZVwiKTtcbiAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZWZhdWx0U29ydGluZyk7XG4gIGFzc2VydC5vayhzb3J0aW5nU3RyYXRlZ3kuZ2V0QWxnb3JpdGhtKCkgaW5zdGFuY2VvZiBTb3J0aW5nLkRlZmF1bHQsIFwiQWZmZWN0YXRpb24gZCd1bmUgc3RyYXTDqWdpZSBkZSB0cmlcIik7XG5cbiAgdmFyIGlkID0gMSxcbiAgICAgIHRpdGxlID0gXCJUaXRyZSAxXCIsXG4gICAgICBhcnRpc3QgPSBcIkFydGlzdGUgMVwiLFxuICAgICAgY292ZXIgPSBcImNvdmVyLTEucG5nXCIsXG4gICAgICBrZXkgPSBcIm5vdGUgMVwiLFxuICAgICAgbW9kZSA9IFwibW9kZSAxXCIsXG4gICAgICB0ZW1wbyA9IDE0NSxcbiAgICAgIGNhbWVsb3RUYWcgPSBcIlRhZyAxXCIsXG4gICAgICBoYXJtb25pZXMgPSBbXCJUYWcgMVwiLCBcIlRhZyAyXCIsIFwiVGFnIDNcIiwgXCJUYWcgNFwiXSxcbiAgICAgIHRyYWNrMSA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG5cbiAgdmFyIGlkID0gMixcbiAgICAgIHRpdGxlID0gXCJUaXRyZSAyXCIsXG4gICAgICBhcnRpc3QgPSBcIkFydGlzdGUgMlwiLFxuICAgICAgY292ZXIgPSBcImNvdmVyLTIucG5nXCIsXG4gICAgICBrZXkgPSBcIm5vdGUgMlwiLFxuICAgICAgbW9kZSA9IFwibW9kZSAyXCIsXG4gICAgICB0ZW1wbyA9IDE1MCxcbiAgICAgIGNhbWVsb3RUYWcgPSBcIlRhZyAyXCIsXG4gICAgICBoYXJtb25pZXMgPSBbXSxcbiAgICAgIHRyYWNrMiA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG5cbiAgdmFyIGlkID0gMyxcbiAgICAgIHRpdGxlID0gXCJUaXRyZSAzXCIsXG4gICAgICBhcnRpc3QgPSBcIkFydGlzdGUgM1wiLFxuICAgICAgY292ZXIgPSBcImNvdmVyLTMucG5nXCIsXG4gICAgICBrZXkgPSBcIm5vdGUgM1wiLFxuICAgICAgbW9kZSA9IFwibW9kZSAzXCIsXG4gICAgICB0ZW1wbyA9IDEwMCxcbiAgICAgIGNhbWVsb3RUYWcgPSBcIlRhZyA1XCIsXG4gICAgICBoYXJtb25pZXMgPSBbXSxcbiAgICAgIHRyYWNrMyA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG5cbiAgdmFyIGlkID0gNCxcbiAgICAgIHRpdGxlID0gXCJUaXRyZSA0XCIsXG4gICAgICBhcnRpc3QgPSBcIkFydGlzdGUgNFwiLFxuICAgICAgY292ZXIgPSBcImNvdmVyLTQucG5nXCIsXG4gICAgICBrZXkgPSBcIm5vdGUgNFwiLFxuICAgICAgbW9kZSA9IFwibW9kZSA0XCIsXG4gICAgICB0ZW1wbyA9IDIwMCxcbiAgICAgIGNhbWVsb3RUYWcgPSBcIlRhZyA0XCIsXG4gICAgICBoYXJtb25pZXMgPSBbXSxcbiAgICAgIHRyYWNrNCA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG5cbiAgdmFyIGlkID0gNSxcbiAgICAgIHRpdGxlID0gXCJUaXRyZSA1XCIsXG4gICAgICBhcnRpc3QgPSBcIkFydGlzdGUgNVwiLFxuICAgICAgY292ZXIgPSBcImNvdmVyLTUucG5nXCIsXG4gICAgICBrZXkgPSBcIm5vdGUgNVwiLFxuICAgICAgbW9kZSA9IFwibW9kZSA1XCIsXG4gICAgICB0ZW1wbyA9IDE0MCxcbiAgICAgIGNhbWVsb3RUYWcgPSBcIlRhZyA2XCIsXG4gICAgICBoYXJtb25pZXMgPSBbXSxcbiAgICAgIHRyYWNrNSA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG5cbiAgdmFyIHRlbXBvVmFyaWF0aW9uID0gMC4wNSxcbiAgICAgIGlzQWN0aXZlID0gdHJ1ZSxcbiAgICAgIGhhcm1vbnkgPSBuZXcgTXVzaWMuSGFybW9ueSh0cmFjazEsIHRlbXBvVmFyaWF0aW9uLCBpc0FjdGl2ZSk7XG5cbiAgdmFyIHNpbWlsYXJUcmFja3MgPSBbdHJhY2syLCB0cmFjazMsIHRyYWNrNCwgdHJhY2s1XSxcbiAgICAgIHNvcnRlZFRyYWNrcyA9IG51bGw7XG5cbiAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZWZhdWx0U29ydGluZyk7XG4gIHNvcnRlZFRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHRyYWNrMSwgaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMF0sIHRyYWNrMiwgXCJUcmkgcGFyIGTDqWZhdXQgKDEvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMV0sIHRyYWNrNSwgXCJUcmkgcGFyIGTDqWZhdXQgKDIvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMl0sIHRyYWNrNCwgXCJUcmkgcGFyIGTDqWZhdXQgKDMvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbM10sIHRyYWNrMywgXCJUcmkgcGFyIGTDqWZhdXQgKDQvNClcIik7XG5cbiAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobSh0ZW1wb0ZpcnN0U29ydGluZyk7XG4gIHNvcnRlZFRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHRyYWNrMSwgaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMF0sIHRyYWNrMiwgXCLCqyBUZW1wbyBGaXJzdCDCuyAoMS80KVwiKTtcbiAgYXNzZXJ0LmVxdWFsKHNvcnRlZFRyYWNrc1sxXSwgdHJhY2s1LCBcIsKrIFRlbXBvIEZpcnN0IMK7ICgyLzQpXCIpO1xuICBhc3NlcnQuZXF1YWwoc29ydGVkVHJhY2tzWzJdLCB0cmFjazQsIFwiwqsgVGVtcG8gRmlyc3QgwrsgKDMvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbM10sIHRyYWNrMywgXCLCqyBUZW1wbyBGaXJzdCDCuyAoNC80KVwiKTtcblxuICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGtleUZpcnN0U29ydGluZyk7XG4gIHNvcnRlZFRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHRyYWNrMSwgaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMF0sIHRyYWNrMiwgXCLCqyBLZXkgRmlyc3QgwrsgKDEvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMV0sIHRyYWNrNCwgXCLCqyBLZXkgRmlyc3QgwrsgKDIvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMl0sIHRyYWNrNSwgXCLCqyBLZXkgRmlyc3QgwrsgKDMvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbM10sIHRyYWNrMywgXCLCqyBLZXkgRmlyc3QgwrsgKDQvNClcIik7XG5cbiAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShhc2NUZW1wb1NvcnRpbmcpO1xuICBzb3J0ZWRUcmFja3MgPSBzb3J0aW5nU3RyYXRlZ3kuc29ydCh0cmFjazEsIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpO1xuICBhc3NlcnQuZXF1YWwoc29ydGVkVHJhY2tzWzBdLCB0cmFjazMsIFwiVHJpIGNyb2lzc2FudCBzZWxvbiBsZSB0ZW1wbyAoMS80KVwiKTtcbiAgYXNzZXJ0LmVxdWFsKHNvcnRlZFRyYWNrc1sxXSwgdHJhY2s1LCBcIlRyaSBjcm9pc3NhbnQgc2Vsb24gbGUgdGVtcG8gKDIvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMl0sIHRyYWNrMiwgXCJUcmkgY3JvaXNzYW50IHNlbG9uIGxlIHRlbXBvICgzLzQpXCIpO1xuICBhc3NlcnQuZXF1YWwoc29ydGVkVHJhY2tzWzNdLCB0cmFjazQsIFwiVHJpIGNyb2lzc2FudCBzZWxvbiBsZSB0ZW1wbyAoNC80KVwiKTtcblxuICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGRlc2NUZW1wb1NvcnRpbmcpO1xuICBzb3J0ZWRUcmFja3MgPSBzb3J0aW5nU3RyYXRlZ3kuc29ydCh0cmFjazEsIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpO1xuICBhc3NlcnQuZXF1YWwoc29ydGVkVHJhY2tzWzBdLCB0cmFjazQsIFwiVHJpIGTDqWNyb2lzc2FudCBzZWxvbiBsZSB0ZW1wbyAoMS80KVwiKTtcbiAgYXNzZXJ0LmVxdWFsKHNvcnRlZFRyYWNrc1sxXSwgdHJhY2syLCBcIlRyaSBkw6ljcm9pc3NhbnQgc2Vsb24gbGUgdGVtcG8gKDIvNClcIik7XG4gIGFzc2VydC5lcXVhbChzb3J0ZWRUcmFja3NbMl0sIHRyYWNrNSwgXCJUcmkgZMOpY3JvaXNzYW50IHNlbG9uIGxlIHRlbXBvICgzLzQpXCIpO1xuICBhc3NlcnQuZXF1YWwoc29ydGVkVHJhY2tzWzNdLCB0cmFjazMsIFwiVHJpIGTDqWNyb2lzc2FudCBzZWxvbiBsZSB0ZW1wbyAoNC80KVwiKTtcblxuICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKG5vU29ydGluZyk7XG4gIHNvcnRlZFRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHRyYWNrMSwgaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIGFzc2VydC5kZWVwRXF1YWwoc29ydGVkVHJhY2tzLCBzaW1pbGFyVHJhY2tzLCBcIkF1Y3VuIHRyaVwiKTtcbn0pO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5RVW5pdC50ZXN0KCBcIlBsYXllclwiLCBmdW5jdGlvbiggYXNzZXJ0ICkge1xuICBhc3NlcnQuZXhwZWN0KCAxICk7XG5cbiAgdmFyIHBsYXllcjEgPSBQbGF5ZXIuZ2V0UGxheWVyKCksXG4gICAgICBwbGF5ZXIyID0gUGxheWVyLmdldFBsYXllcigpO1xuXG4gIGFzc2VydC5kZWVwRXF1YWwocGxheWVyMiwgcGxheWVyMSwgXCJVbmUgc2V1bGUgaW5zdGFuY2UgZGUgUGxheWVyIGVzdCBkw6lsaXZyw6llIChTaW5nbGV0b24pXCIpO1xufSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblFVbml0LnRlc3QoIFwiUGxheWxpc3RcIiwgZnVuY3Rpb24oIGFzc2VydCApIHtcbiAgYXNzZXJ0LmV4cGVjdCggNyApO1xuXG4gIHZhciBpZCA9IDEyMzQ1NjcsXG4gICAgICB0aXRsZSA9IFwiRmFyIEJleW9uZCBUaGUgU3VuXCIsXG4gICAgICBhcnRpc3QgPSBcIlluZ3dpZSBNYWxtc3RlZW5cIixcbiAgICAgIGNvdmVyID0gXCJyaXNpbmctZm9yY2UucG5nXCIsXG4gICAgICBrZXkgPSBcImZhXCIsXG4gICAgICBtb2RlID0gXCJtaW5ldXJcIixcbiAgICAgIHRlbXBvID0gMTI1LFxuICAgICAgY2FtZWxvdFRhZyA9IFwiNEFcIixcbiAgICAgIGhhcm1vbmllcyA9IFtcIjRBXCIsIFwiM0FcIiwgXCI1QVwiLCBcIjRCXCJdLFxuICAgICAgdHJhY2sgPSBuZXcgTXVzaWMuVHJhY2soaWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBoYXJtb25pZXMpO1xuXG4gIGFzc2VydC5vayhQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcy5sZW5ndGggPT0gMCwgXCJMYSBwbGF5bGlzdCBlc3QgdmlkZSDDoCBsJ2luaXRpYWxpc2F0aW9uICgxLzIpXCIpO1xuICBhc3NlcnQub2soUGxheWxpc3QudHJhY2tzSWRzLmxlbmd0aCA9PSAwLCBcIkxhIHBsYXlsaXN0IGVzdCB2aWRlIMOgIGwnaW5pdGlhbGlzYXRpb24gKDIvMilcIik7XG5cbiAgUGxheWxpc3QuYWRkVHJhY2sodHJhY2spO1xuICBhc3NlcnQubm90T2soUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MubGVuZ3RoID09IDAsIFwiTGEgcGxheWxpc3QgZXN0IG1pc2Ugw6Agam91ciBsb3JzIGQndW4gYWpvdXQgKDEvMilcIik7XG4gIGFzc2VydC5ub3RPayhQbGF5bGlzdC50cmFja3NJZHMubGVuZ3RoID09IDAsIFwiTGEgcGxheWxpc3QgZXN0IG1pc2Ugw6Agam91ciBsb3JzIGQndW4gYWpvdXQgKDIvMilcIik7XG4gIGFzc2VydC5lcXVhbChQbGF5bGlzdC5zZWxlY3RlZFRyYWNrc1swXS5nZXRUaXRsZSgpLCBcIkZhciBCZXlvbmQgVGhlIFN1blwiLCBcIkxlIG1vcmNlYXUgZXN0IGNoYXJnw6kgZGFucyBsYSBwbGF5bGlzdFwiKTtcblxuICBQbGF5bGlzdC5yZW1vdmVUcmFjaygwKTtcbiAgYXNzZXJ0Lm9rKFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzLmxlbmd0aCA9PSAwLCBcIkxhIHBsYXlsaXN0IGVzdCBtaXNlIMOgIGpvdXIgbG9ycyBkJ3VuZSBzdXBwcmVzc2lvbiAoMS8yKVwiKTtcbiAgYXNzZXJ0Lm9rKFBsYXlsaXN0LnRyYWNrc0lkcy5sZW5ndGggPT0gMCwgXCJMYSBwbGF5bGlzdCBlc3QgbWlzZSDDoCBqb3VyIGxvcnMgZCd1bmUgc3VwcHJlc3Npb24gKDIvMilcIik7XG59KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuUVVuaXQudGVzdCggXCJVc2VyXCIsIGZ1bmN0aW9uKCBhc3NlcnQgKSB7XG4gIGFzc2VydC5leHBlY3QoIDMgKTtcblxuICB2YXIgaWQgPSAxLFxuICAgICAgbmFtZSA9IFwiVG90b1wiLFxuICAgICAgaW5zY3JpcHRpb25EYXRlID0gXCIwMS8wMS8yMDAwXCIsXG4gICAgICBsaW5rID0gXCJodHRwOi8vd3d3LnVybC5jb21cIixcbiAgICAgIHBpY3R1cmUgPSBcImh0dHA6Ly93d3cudXJsLmNvbS9pbWFnZVwiLFxuICAgICAgdXNlciA9IG5ldyBVc2VyKGlkLCBuYW1lLCBpbnNjcmlwdGlvbkRhdGUsIGxpbmssIHBpY3R1cmUpO1xuXG4gIGFzc2VydC5vayh1c2VyIGluc3RhbmNlb2YgVXNlciwgXCJVdGlsaXNhdGV1ciBjcsOpw6lcIik7XG4gIGFzc2VydC5lcXVhbCh1c2VyLmdldE5hbWUoKSwgbmFtZSwgXCJIeWRyYXRhdGlvbiBPS1wiKTtcbiAgYXNzZXJ0LnRocm93cyhcbiAgICBmdW5jdGlvbigpIHtcbiAgICAgIFVzZXIoaWQsIG5hbWUsIGluc2NyaXB0aW9uRGF0ZSwgbGluaywgcGljdHVyZSlcbiAgICB9LFxuICAgIEVycm9yLFxuICAgIFwiRXJyZXVyICEgTGEgY2xhc3NlIFVzZXIgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIlxuICApO1xuXG59KTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJvTWZwQW5cIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlXzdhNTRjMTY1LmpzXCIsXCIvXCIpIl19
