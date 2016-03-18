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
var Player = require('./Player.js'),
    Playlist = require('./Playlist.js');

/**
 * Module gérant l'interface graphique
 *
 * @module GUI
 * @class GUI
 */
module.exports = GUI = {
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
   * Lecteur manipulé par l'interface graphique.
   * C'est à la fois un Singleton et un Adapter.
   *
   * @property player
   * @type {Object}
   * @default null
   */
  player: null,
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
      $( "[data-title != '']" ).popup(); // Semantic UI
      $( "[title != '']" ).qtip({ // qTip²
        style: {
            classes: 'qtip-dark'
        }
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

    // Écouteurs d'événements relatifs à l'utilisateur
    var userEvents = [
                        ["#login", "click", GUI.user.login],
                        ["#logout", "click", GUI.user.logout],
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

      var artistName = track.artist.name,
          maxStringLength = 100;

      // Si le nom de l'artiste est exagérément long, on le tronque à l'affichage
      if (artistName.length > maxStringLength) {
        artistName = artistName.substr(0, maxStringLength) + " ...";
      }

      var html = '<div id="submit-' + track.id + '" class="track" itemscope itemtype="https://schema.org/MusicRecording">';
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
          html += ' <figure>';
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
   * @class scrollbar
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
   * @class loading
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
      GUI.player.random(false);
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
      GUI.player.random(true);
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
      GUI.player.repeat(0);
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
      GUI.player.repeat(2);
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
      GUI.player.prev();
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
      GUI.player.seek(GUI.trackPosition);
    },
    /**
     * Lire un morceau
     *
     * @method play
     */
    play: function() {
      if (GUI.tracksLoaded) {
        GUI.player.play();
      } else {
        GUI.player.playTracks(Playlist.tracksIds);
        GUI.tracksLoaded = true;
      }
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
     * Aller en avant dans le morceau
     *
     * @method back
     */
    forth: function() {
      if (GUI.trackPosition < 90) {
        GUI.trackPosition += 10;
      }
      GUI.player.seek(GUI.trackPosition);
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
   * Classe interne gérant divers événements
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/GUI.js","/../modules")
},{"+7ZJp0":13,"./Player.js":5,"./Playlist.js":6,"buffer":10}],3:[function(require,module,exports){
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
   * Attribut (privé) contenant une référence vers le SDK de Deezer
   *
   * @property Deezer
   * @type {Object}
   * @default DZ
   */
      Deezer = DZ, // https://cdns-files.dzcdn.net/js/min/dz.js
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
          Deezer.init({
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
         * Chargement des morceaux dans le lecteur
         *
         * @method playTracks
         * @param {Array} ids Tableau contenant les identifiants des morceaux
         */
        this.playTracks = function(ids) {
          Deezer.player.playTracks(ids);
        },
        /**
         * Lecture
         *
         * @method play
         */
        this.play = function() {
          Deezer.player.play();
        },
        /**
         * Pause
         *
         * @method pause
         */
        this.pause = function() {
          Deezer.player.pause();
        },
        /**
         * Suivant
         *
         * @method suivant
         */
        this.next = function() {
          Deezer.player.next();
        },
        /**
         * Précédent
         *
         * @method prev
         */
        this.prev = function() {
          Deezer.player.prev();
        },
        /**
         * Aller à...
         *
         * @method seek
         * @param {Number} pos Position de la tête de lecture (entre 0 et 100)
         */
        this.seek = function(pos) {
          Deezer.player.seek(pos);
        },
        /**
         * Activer/Désactiver le son
         *
         * @method mute
         * @param {Boolean} isMute Vrai ou faux
         */
        this.mute = function(isMute) {
          Deezer.player.setMute(isMute);
        },
        /**
         * Activer/Désactiver la lecture aléatoire
         *
         * @method random
         * @param {Boolean} isRandom Vrai ou faux
         */
        this.random = function(isRandom) {
          Deezer.player.setShuffle(isRandom);
        },
        /**
         * Activer/Désactiver la lecture répétée
         *
         * @method repeat
         * @param {Number} code 0 (no repeat), 1 (repeat all), ou 2 (repeat one)
         */
        this.repeat = function(code) {
          Deezer.player.setRepeat(code);
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
    Playlist = require('../modules/Playlist');

// Variables diverses
var similarTracks = [],
    refTrack,
    harmony;

// Sélecteurs jQuery
var $search,
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
$( document ).ready( init );

// Initialisation de l'application
function init() {

    GUI.init();

    $search = $( "#search" );
    $owl = $( "#tracks" );
    $harmonicTracks = $( "#harmonic-tracks" );

    $search.find( "input" ).keyup(function() {
      trackAutocomplete();
      var keyword = $( this ).val();
      if (keyword.length < 3) {
        $( "#autocomplete" ).fadeOut();
      }
    });

      go();

}

// Gestion de l'autocomplétion dans le champ de recherche
function trackAutocomplete() {

  // Autocomplétion OK
  if (GUI.autocompleteAllowed) {
    $search.find( "input" ).autocomplete({
        source: function( request, response ) {

          var keyword = $search.find( "input" ).val();

          request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/search/track");
          request.addParam("q", keyword);
          request.addParam("limit", 10);
          request.send(success, null);

          function success(response) {

            $( "#autocomplete" ).empty();
            var html = "";

            for (var i = 0, len = response.data.length; i < len; i++) {
              var track = response.data[i];
              html += GUI.template("autocomplete", track, null, null);
              selectedTrack("autocomplete-" + track.id, track.id);
            }
            $( "#autocomplete" ).append( html );
            $( "#autocomplete" ).show();
          }
        },
        minLength: 3
      });
  } else { // Pas d'autocomplétion
    $search.find( "input" ).autocomplete({ source: [] });
  }

}

// À la soumission du formulaire, on récupère des morceaux sur Deezer
function go() {
  $search.submit(function(e) {
      e.preventDefault();
      if ($( window ).width() > 600) {
        searchTracks();
        GUI.alert("message", "Choisissez un morceau de référence", 5);
        $search.find( "input" ).val( "" );
      }
  });
}

// Gestion des algorithmes de tri des morceaux
function setSortingStrategy() {
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
}

// Recherche de morceaux sur Deezer
function searchTracks() {

    // Réinitialisation de la recherche
    if ($owl.is( ":visible" )) $owl.empty();
    if (similarTracks.length > 0) similarTracks = [];
    GUI.cleanNotifications();

    var keyword = $search.find( "input" ).val();

    // Paramétrage et envoi de la requête
    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, null);

    // Traitement de la réponse au succès
    function success(response) {
        // On récupère toutes les informations sur chaque morceau
        for (var i = 0, len = response.data.length; i < len; i++) {
            var track = response.data[i];
            // On affiche les résultats
            var html = GUI.template("base-track", track, null, null);
            $owl.data('owlCarousel').addItem(html);
            if (!$owl.is( ":visible" )) {
              $owl.fadeIn();
            }
            // On ajoute un écouteur d'événement de type clic pour chaque morceau
            selectedTrack("submit-" + track.id, track.id);
        }
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(eltId, trackId) {
    $( document ).on( "click", "#" + eltId, function() {
        // Affectation d'un algorithme de tri
        setSortingStrategy();
        // On efface les notifications
        GUI.cleanNotifications();
        // On affiche un loader pour faire patienter l'internaute
        GUI.loading.on();
        // On récupère le résumé audio du morceau sélectionné sur Echo Nest
        getInitialAudioSummary(trackId);
        // On récupère les informations détaillées du morceau sur Deezer
        getTrackInfos(trackId);
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

                GUI.alert("message", "« " + title + " » par " + artist, 0);
                GUI.alert("message", "Tonalité : " + key + " " + mode, 0);
                GUI.alert("message", "Tempo : " + tempo + " BPM", 0);
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
        getSimilarArtists(response.artist.id);
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
        var artists = [];
        for (var i = 0, len = response.data.length; i < len; i++) {
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
        for (var i = 0, len = response.batch_result.length; i < len; i++) {
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
  GUI.loading.off();
  // ... et on lance le tri des morceaux récupérés (s'il y en a)
  if (similarTracks.length > 0) {
    similarTracks = sortingStrategy.sort(refTrack, harmony, similarTracks);
    displayTracks(similarTracks);
  }
});

// Affichage des morceaux selon un ordre déterminé par le tri
function displayTracks(tracks) {

  GUI.scroll.destroy($harmonicTracks);
  $harmonicTracks.empty();

  var html = GUI.template("help", null, null, null);

  // Itérations sur notre collection de morceaux
  iterator = new Iterator(tracks);
  while (iterator.hasNext()) {

    var track = iterator.next(),
        isTempoCompatible = false,
        isKeyCompatible = false;

    // On signale les morceaux compatibles en termes de tempo
    if (track.getTempo() >= harmony.tempoMin() && track.getTempo() <= harmony.tempoMax()) {
      isTempoCompatible = true;
    }

    // On signale les morceaux compatibles en termes de tonalité
    if ($.inArray(track.getCamelotTag(), refTrack.getHarmonies()) != -1) {
      isKeyCompatible = true;
    }

    html += GUI.template("harmonic-track", track, isTempoCompatible, isKeyCompatible);

  }

  $harmonicTracks.append(html);
  GUI.scroll.reset($harmonicTracks);
  GUI.displayFinalTracklist();

}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_88dfd2a7.js","/")
},{"+7ZJp0":13,"../modules/Ajax.js":1,"../modules/GUI.js":2,"../modules/Iterator.js":3,"../modules/Music.js":4,"../modules/Playlist":6,"../modules/Sorting.js":7,"../modules/Vocabulary.js":8,"buffer":10}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9BamF4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL2FwcC9qcy9tb2R1bGVzL0l0ZXJhdG9yLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvU29ydGluZy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL3NjcmlwdHMvZmFrZV84OGRmZDJhNy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZm91cm5pc3NhbnQgdW5lIGFyY2hpdGVjdHVyZSByw6l1dGlsaXNhYmxlIHBvdXIgZ8OpcmVyIGxlcyByZXF1w6p0ZXMgQWpheFxuICpcbiAqIEBtb2R1bGUgQWpheFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEFqYXggPSB7XG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpbsOpcmlxdWUgcG91ciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICpcbiAgICogQGNsYXNzIFJlcXVlc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgZGUgcmVxdcOqdGUgKEdFVCBvdSBQT1NUKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSTCBkZSByZXF1w6p0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVR5cGUgVHlwZSBkZSBkb25uw6llcyByZW52b3nDqWVzIChKU09OLCBYTUwsIC4uLilcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgUGFyYW3DqHRyZXMgZGUgcmVxdcOqdGVcbiAgICovXG4gIFJlcXVlc3Q6IGZ1bmN0aW9uKHR5cGUsIHVybCwgZGF0YVR5cGUsIGRhdGEpIHtcbiAgICAvKipcbiAgICAgKiBUeXBlIGRlIHJlcXXDqnRlIChHRVQgb3UgUE9TVClcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB0eXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgLyoqXG4gICAgICogVVJMIGRlIHJlcXXDqnRlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgdXJsXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fdXJsID0gdXJsO1xuICAgIC8qKlxuICAgICAqIFR5cGUgZGUgZG9ubsOpZXMgcmVudm95w6llcyAoSlNPTiwgWE1MLCAuLi4pXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgZGF0YVR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9kYXRhVHlwZSA9IGRhdGFUeXBlO1xuICAgIC8qKlxuICAgICAqIFBhcmFtw6h0cmVzIGRlIHJlcXXDqnRlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgZGF0YVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheCB2ZXJzIGwnQVBJIGRlIERlZXplclxuICAgKlxuICAgKiBAY2xhc3MgRGVlemVyQVBJUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQGV4dGVuZHMgUmVxdWVzdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICovXG4gIERlZXplckFQSVJlcXVlc3Q6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIEFqYXguUmVxdWVzdC5jYWxsKHRoaXMsIFwiR0VUXCIsIFwiaHR0cDovL2FwaS5kZWV6ZXIuY29tXCIgKyBwYXRoLCBcImpzb25wXCIsIHsgXCJvdXRwdXRcIjogXCJqc29ucFwiIH0pO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4IHZlcnMgbCdBUEkgZCdFY2hvIE5lc3RcbiAgICpcbiAgICogQGNsYXNzIEVjaG9OZXN0QVBJUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQGV4dGVuZHMgUmVxdWVzdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICovXG4gIEVjaG9OZXN0QVBJUmVxdWVzdDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgQWpheC5SZXF1ZXN0LmNhbGwodGhpcywgXCJHRVRcIiwgXCJodHRwOi8vZGV2ZWxvcGVyLmVjaG9uZXN0LmNvbS9hcGkvdjRcIiArIHBhdGgsIFwianNvbnBcIiwge1xuICAgICAgICAgICAgICAgICAgICBcImFwaV9rZXlcIjogXCJWVVNVQTFITjRITVdVSU41UFwiLFxuICAgICAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiBcImpzb25wXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYnVja2V0XCI6IFwiYXVkaW9fc3VtbWFyeVwiXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBjb25zdHJ1aXNhbnQgw6AgbGEgZGVtYW5kZSBkZXMgcmVxdcOqdGVzIEFqYXggZCd1biBjZXJ0YWluIHR5cGVcbiAgICpcbiAgICogQGNsYXNzIFJlcXVlc3RGYWN0b3J5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgUmVxdWVzdEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnaW5zdGFuY2llciBsZXMgY2xhc3NlcyBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheFxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBamF4UmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhcGkgQVBJIMOgIGludGVycm9nZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuIG9iamV0IGRlIHR5cGUgQWpheFxuICAgICAqL1xuICAgICAgdGhpcy5nZXRBamF4UmVxdWVzdCA9IGZ1bmN0aW9uKGFwaSwgcGF0aCkge1xuICAgICAgICAgIHZhciBhamF4UmVxdWVzdDtcbiAgICAgICAgICBpZiAoYXBpID09PSBcImRlZXplclwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRGVlemVyQVBJUmVxdWVzdChwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFwaSA9PT0gXCJlY2hvbmVzdFwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRWNob05lc3RBUElSZXF1ZXN0KHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWpheFJlcXVlc3Q7XG4gICAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgbcOocmUgOiBBamF4XG4gKi9cbiBBamF4LlJlcXVlc3QucHJvdG90eXBlID0ge1xuICAgLyoqXG4gICAgKiBNw6l0aG9kZSBwZXJtZXR0YW50IGQnYWpvdXRlciB1biBwYXJhbcOodHJlIMOgIGxhIHJlcXXDqnRlXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRQYXJhbVxuICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBDbMOpIGR1IHBhcmFtw6h0cmVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBWYWxldXIgZHUgcGFyYW3DqHRyZVxuICAgICovXG4gICBhZGRQYXJhbTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgIH0sXG4gICAvKipcbiAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnZW52b3llciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNlbmRcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1Y2Nlc3MgRm9uY3Rpb24gw6AgZXjDqWN1dGVyIGF1IHN1Y2PDqHMgZGUgbGEgcmVxdcOqdGVcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yIEZvbmN0aW9uIMOgIGV4w6ljdXRlciBsb3JzIGQndW5lIGVycmV1ciBkYW5zIGxhIHJlcXXDqnRlXG4gICAgKi9cbiAgIHNlbmQ6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgICQuYWpheCh7XG4gICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxuICAgICAgICAgdXJsOiB0aGlzLl91cmwsXG4gICAgICAgICBkYXRhVHlwZTogdGhpcy5fZGF0YVR5cGUsXG4gICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgIH0sXG4gICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICBlcnJvcihyZXNwb25zZSk7XG4gICAgICAgICB9XG4gICAgIH0pO1xuICAgfVxuIH07XG5cbi8qKlxuICogQ2xvbmFnZSBkZSBwcm90b3R5cGUgcG91ciBjcsOpZXIgZGVzIGNsYXNzZXMgZmlsbGVzXG4gKi9cbkFqYXguRGVlemVyQVBJUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFqYXguUmVxdWVzdC5wcm90b3R5cGUpO1xuQWpheC5EZWV6ZXJBUElSZXF1ZXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFqYXguRGVlemVyQVBJUmVxdWVzdDtcblxuQWpheC5FY2hvTmVzdEFQSVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBamF4LlJlcXVlc3QucHJvdG90eXBlKTtcbkFqYXguRWNob05lc3RBUElSZXF1ZXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFqYXguRWNob05lc3RBUElSZXF1ZXN0O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvQWpheC5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi9QbGF5ZXIuanMnKSxcbiAgICBQbGF5bGlzdCA9IHJlcXVpcmUoJy4vUGxheWxpc3QuanMnKTtcblxuLyoqXG4gKiBNb2R1bGUgZ8OpcmFudCBsJ2ludGVyZmFjZSBncmFwaGlxdWVcbiAqXG4gKiBAbW9kdWxlIEdVSVxuICogQGNsYXNzIEdVSVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEdVSSA9IHtcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgaW5mb2J1bGxlcyBzb250IGF1dG9yaXPDqWVzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB0b29sdGlwQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgdG9vbHRpcEFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIG5vdGlmaWNhdGlvbnMgc29udCBhdXRvcmlzw6llc1xuICAgKlxuICAgKiBAcHJvcGVydHkgbm90aWZBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBub3RpZkFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIHNvbnMgZCdhbWJpYW5jZSBzb250IGF1dG9yaXPDqXNcbiAgICpcbiAgICogQHByb3BlcnR5IHNvdW5kQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgc291bmRBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGwnYXV0b2NvbXBsw6l0aW9uIGVzdCBhdXRvcmlzw6llIGRhbnMgbGEgcmVjaGVyY2hlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBhdXRvY29tcGxldGVBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBhdXRvY29tcGxldGVBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBkb3VibG9ucyBzb250IGF1dG9yaXPDqXMgZGFucyBsZXMgc3VnZ2VzdGlvbnNcbiAgICpcbiAgICogQHByb3BlcnR5IGR1cGxpY2F0ZXNBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZHVwbGljYXRlc0FsbG93ZWQ6IGZhbHNlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IGxhIHZhcmlhdGlvbiBjb3VyYW50ZSBkdSB0ZW1wbyAoZW50cmUgMCBldCAxKVxuICAgKlxuICAgKiBAcHJvcGVydHkgdGVtcG9WYXJpYXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMC4wNVxuICAgKi9cbiAgdGVtcG9WYXJpYXRpb246IDAuMDUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBzw6lsZWN0aW9ubsOpXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBzZWxlY3RlZFNvcnRpbmdcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJkZWZhdWx0XCJcbiAgICovXG4gIHNlbGVjdGVkU29ydGluZzogXCJkZWZhdWx0XCIsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIG1vcmNlYXV4IHNvbnQgY2hhcmfDqXMgZGFucyBsZSBsZWN0ZXVyXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB0cmFja3NMb2FkZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICB0cmFja3NMb2FkZWQ6IGZhbHNlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IGxhIHBvc2l0aW9uIGRlIGxhIHTDqnRlIGRlIGxlY3R1cmUgZGFucyBsZSBtb3JjZWF1IGVuIGNvdXJzXG4gICAqIExhIHZhbGV1ciBzZSBzaXR1ZSBlbnRyZSAwIGV0IDEwMC5cbiAgICpcbiAgICogQHByb3BlcnR5IHRyYWNrUG9zaXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgdHJhY2tQb3NpdGlvbjogMCxcbiAgLyoqXG4gICAqIExlY3RldXIgbWFuaXB1bMOpIHBhciBsJ2ludGVyZmFjZSBncmFwaGlxdWUuXG4gICAqIEMnZXN0IMOgIGxhIGZvaXMgdW4gU2luZ2xldG9uIGV0IHVuIEFkYXB0ZXIuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwbGF5ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgcGxheWVyOiBudWxsLFxuICAvKipcbiAgICogTcOpdGhvZGUgY2hhcmfDqWUgZCdpbml0aWFsaXNlciBsJ2ludGVyZmFjZSBncmFwaGlxdWUuXG4gICAqIENldHRlIG3DqXRob2RlIHMnaW5zcGlyZSBkdSBwYXR0ZXJuIFRlbXBsYXRlIGRhbnMgc2EgY29uY2VwdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAvKiAkKCBcIiNtYWluXCIgKS52ZWdhcyh7XG4gICAgICAgIHRyYW5zaXRpb246ICdmYWRlJyxcbiAgICAgICAgc2xpZGU6IDAsXG4gICAgICAgIHNsaWRlczogW1xuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9uZXV0cmFsLmpwZ1wiIH0sXG4gICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL3JvY2suanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvZWxlY3Ryby5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9oaXBob3AuanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvZm9say5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9jbGFzc2ljYWwuanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvamF6ei5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9tZXRhbC5qcGdcIiB9XG4gICAgICAgIF0sXG4gICAgICAgIGFuaW1hdGlvbjogJ2tlbmJ1cm5zJyxcbiAgICAgICAgd2FsazogZnVuY3Rpb24gKGluZGV4LCBzbGlkZVNldHRpbmdzKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTbGlkZSBpbmRleCBcIiArIGluZGV4ICsgXCIgaW1hZ2UgXCIgKyBzbGlkZVNldHRpbmdzLnNyYyk7XG4gICAgICAgICAgaWYgKEdVSS5zb3VuZEFsbG93ZWQgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oIFwiLi9zb3VuZHMvXCIgKyBpbmRleCArIFwiLm9nZ1wiKTtcbiAgICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCBcIiNtYWluXCIgKS52ZWdhcygncGF1c2UnKTsgKi9cblxuICAgIEdVSS5jc3MoKTtcbiAgICBHVUkuY2Fyb3VzZWwoKTtcbiAgICBHVUkuZHJhZygpO1xuICAgIEdVSS50b29sdGlwcygpO1xuICAgIEdVSS5jaGVja2JveGVzKCk7XG4gICAgR1VJLmxpc3RlbmVycygpO1xuICAgIEdVSS5zY3JvbGwuaW5pdCgpO1xuICAgIEdVSS5wbGF5bGlzdC5yZXRyaWV2ZSgpO1xuICAgIEdVSS5wbGF5ZXIgPSBQbGF5ZXIuZ2V0UGxheWVyKCk7XG4gICAgR1VJLnBsYXllci5pbml0KCk7XG4gIH0sXG4gIC8qKlxuICAgKiBIYWNrcyBDU1NcbiAgICpcbiAgICogQG1ldGhvZCBjc3NcbiAgICovXG4gIGNzczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIucHVzaGVyXCIgKS5jc3MoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICAgIGlmICgkKCB3aW5kb3cgKS53aWR0aCgpIDw9IDYwMCkge1xuICAgICAgJCggXCIjbWVudVwiICkuc3dpdGNoQ2xhc3MoIFwiZml2ZVwiLCBcImZvdXJcIiApO1xuICAgICAgR1VJLnRvb2x0aXBBbGxvd2VkID0gZmFsc2U7XG4gICAgICBHVUkubm90aWZBbGxvd2VkID0gZmFsc2U7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnN3aXRjaENsYXNzKCBcImZvdXJcIiwgXCJmaXZlXCIgKTtcbiAgICAgIEdVSS50b29sdGlwQWxsb3dlZCA9IHRydWU7XG4gICAgICBHVUkubm90aWZBbGxvd2VkID0gdHJ1ZTtcbiAgICAgIEdVSS5zb3VuZEFsbG93ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGR1IGNhcm91c2VsIGNvbnRlbmFudCBsZXMgcsOpc3VsdGF0cyBkZSByZWNoZXJjaGUuXG4gICAqIExlIGNhcm91c2VsIGVzdCBnw6lyw6kgcGFyIGxlIHBsdWdpbiBPV0wgQ2Fyb3VzZWwuXG4gICAqXG4gICAqIEBtZXRob2QgY2Fyb3VzZWxcbiAgICovXG4gIGNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiN0cmFja3NcIiApLm93bENhcm91c2VsKHtcbiAgICAgIGl0ZW1zOiAxMCxcbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgYXV0b1BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVRpbWVvdXQ6IDEwMCxcbiAgICAgIHN0b3BPbkhvdmVyOiB0cnVlLFxuICAgICAgbGF6eUxvYWQgOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkdSBkcmFnICYgZHJvcCBzdXIgbCdpUG9kLlxuICAgKiBMZSBkcmFnICYgZHJvcCBlc3QgZ8OpcsOpIHBhciBqUXVlcnkgVUkuXG4gICAqXG4gICAqIEBtZXRob2QgZHJhZ1xuICAgKi9cbiAgZHJhZzogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjaXBvZC13cmFwcGVyXCIgKS5kcmFnZ2FibGUoeyBzY3JvbGw6IGZhbHNlIH0pO1xuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIHRvb2x0aXBzLlxuICAgKiBMZXMgdG9vbHRpcHMgc29udCBnw6lyw6llcyBwYXIgU2VtYW50aWMgVUkgZXQgcVRpcMKyLlxuICAgKlxuICAgKiBAbWV0aG9kIHRvb2x0aXBzXG4gICAqL1xuICB0b29sdGlwczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKEdVSS50b29sdGlwQWxsb3dlZCkge1xuICAgICAgJCggXCJbZGF0YS10aXRsZSAhPSAnJ11cIiApLnBvcHVwKCk7IC8vIFNlbWFudGljIFVJXG4gICAgICAkKCBcIlt0aXRsZSAhPSAnJ11cIiApLnF0aXAoeyAvLyBxVGlwwrJcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIGNsYXNzZXM6ICdxdGlwLWRhcmsnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGRlcyBjaGVja2JveGVzLlxuICAgKiBMZXMgY2hlY2tib3hlcyBzb250IGfDqXLDqWVzIHBhciBTZW1hbnRpYyBVSS5cbiAgICpcbiAgICogQG1ldGhvZCBjaGVja2JveGVzXG4gICAqL1xuICBjaGVja2JveGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLmNoZWNrYm94XCIgKS5jaGVja2JveCgpO1xuICB9LFxuICAvKipcbiAgICogRMOpZmluaXRpb24gZGUgdG91cyBsZXMgw6ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50c1xuICAgKlxuICAgKiBAbWV0aG9kIGxpc3RlbmVyc1xuICAgKi9cbiAgbGlzdGVuZXJzOiBmdW5jdGlvbigpIHtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGVzIHNpZGViYXJzXG4gICAgdmFyIG1lbnVFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIudG9nZ2xlLW1lbnVcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVBsYXlsaXN0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXZvcml0ZXMtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlRmF2b3JpdGVzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNhdG1vc3BoZXJlcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBdG1vc3BoZXJlc10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjaGFybW9uaWMtdHJhY2tzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZUhhcm1vbmljVHJhY2tzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN1c2VyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVVzZXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1hbGxcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBbGxdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGUgbGEgcGxheWxpc3RcbiAgICB2YXIgcGxheWxpc3RFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JhbmRvbS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Qubm90UmFuZG9tLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNub3QtcmFuZG9tLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yYW5kb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JlcGVhdC1hbGwtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5vUmVwZWF0LCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNuby1yZXBlYXQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJlcGVhdE9uZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmVwZWF0LW9uZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVwZWF0QWxsLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtdXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC51bm11dGUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3VubXV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubXV0ZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Quc2F2ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2V4cG9ydC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuZXhwb3J0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZGVsZXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5kZWxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5wcmV2aW91cy1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucHJldmlvdXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5iYWNrLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5iYWNrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBhdXNlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wYXVzZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLmZvcnRoLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5mb3J0aF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLm5leHQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5leHRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5oYXJtb25pYy10cmFja1wiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5hZGRUcmFjaywgXCJhc3luY1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBmYXZvcmlzXG4gICAgdmFyIGZhdm9yaXRlc0V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1pcG9kXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5pcG9kXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10b29sdGlwXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy50b29sdGlwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1ub3RpZnlcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLm5vdGlmeV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtc291bmRcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLnNvdW5kXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1hdXRvY29tcGxldGVcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmF1dG9jb21wbGV0ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZHVwbGljYXRlXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kdXBsaWNhdGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LXRlbXBvLXJhbmdlXCIsIFwiaW5wdXRcIiwgR1VJLmZhdm9yaXRlcy50ZW1wb1JhbmdlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1kZWZhdWx0LXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmRlZmF1bHRTb3J0aW5nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1maXJzdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy50ZW1wb0ZpcnN0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYta2V5LWZpcnN0LXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmtleUZpcnN0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtYXNjLXRlbXBvLXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmFzY1RlbXBvU29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZGVzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kZXNjVGVtcG9Tb3J0aW5nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1uby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5ub1NvcnRpbmddXG4gICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGVzIGFtYmlhbmNlc1xuICAgIHZhciBhdG1vc3BoZXJlc0V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNuZXV0cmFsLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMubmV1dHJhbF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcm9jay1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLnJvY2tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2VsZWN0cm8tYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5lbGVjdHJvXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNoaXBob3AtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5oaXBob3BdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2ZvbGstYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5mb2xrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNjbGFzc2ljYWwtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5jbGFzc2ljYWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2phenotYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5qYXp6XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtZXRhbC1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLm1ldGFsXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIHJlbGF0aWZzIMOgIGwndXRpbGlzYXRldXJcbiAgICB2YXIgdXNlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dpblwiLCBcImNsaWNrXCIsIEdVSS51c2VyLmxvZ2luXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvdXRcIiwgXCJjbGlja1wiLCBHVUkudXNlci5sb2dvdXRdLFxuICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRpdmVyc1xuICAgIHZhciBvdGhlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MubG9nb10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdHJhY2tzLWhlbHBcIiwgXCJjbGlja1wiLCBHVUkubWlzYy5oZWxwLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW3dpbmRvdywgXCJyZXNpemVcIiwgR1VJLmNzc11cbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gQWpvdXQgZGVzIMOpY291dGV1cnMgZCfDqXbDqW5lbWVudHNcbiAgICBhZGRFdmVudHMobWVudUV2ZW50cyk7XG4gICAgYWRkRXZlbnRzKHBsYXlsaXN0RXZlbnRzKTtcbiAgICBhZGRFdmVudHMoZmF2b3JpdGVzRXZlbnRzKTtcbiAgICBhZGRFdmVudHMoYXRtb3NwaGVyZXNFdmVudHMpO1xuICAgIGFkZEV2ZW50cyh1c2VyRXZlbnRzKTtcbiAgICBhZGRFdmVudHMob3RoZXJFdmVudHMpO1xuXG4gICAgLy8gRm9uY3Rpb25zIGQnYWpvdXQgZCfDqXbDqW5lbWVudHNcbiAgICBmdW5jdGlvbiBhZGRFdmVudHMoZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGVbaV1bM10gPT0gXCJhc3luY1wiKSB7XG4gICAgICAgICAgJCggZG9jdW1lbnQgKS5vbiggZVtpXVsxXSwgZVtpXVswXSwgZVtpXVsyXSk7IC8vIGTDqWzDqWdhdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoIGVbaV1bMF0gKS5vbiggZVtpXVsxXSwgZVtpXVsyXSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSB0ZW1wbGF0ZSBjcsOpYW50IGR5bmFtaXF1ZW1lbnQgdW4gZnJhZ21lbnQgSFRNTFxuICAgKlxuICAgKiBAbWV0aG9kIHRlbXBsYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgZGUgdGVtcGxhdGUgKHN1Z2dlc3Rpb25zIGRlIGJhc2Ugb3UgaGFybW9uaXF1ZXMpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBPYmpldCByZXByw6lzZW50YW50IG1vcmNlYXUgZGUgbXVzaXF1ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzVGVtcG9Db21wYXRpYmxlIENvbXBhdGliaWxpdMOpIG91IG5vbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzS2V5Q29tcGF0aWJsZSBDb21wYXRpYmlsaXTDqSBvdSBub24gZGUgbGEgdG9uYWxpdMOpXG4gICAqL1xuICB0ZW1wbGF0ZTogZnVuY3Rpb24odHlwZSwgdHJhY2ssIGlzVGVtcG9Db21wYXRpYmxlLCBpc0tleUNvbXBhdGlibGUpIHtcbiAgICBpZiAodHlwZSA9PSBcImJhc2UtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGRlIGJhc2VcblxuICAgICAgdmFyIGFydGlzdE5hbWUgPSB0cmFjay5hcnRpc3QubmFtZSxcbiAgICAgICAgICBtYXhTdHJpbmdMZW5ndGggPSAxMDA7XG5cbiAgICAgIC8vIFNpIGxlIG5vbSBkZSBsJ2FydGlzdGUgZXN0IGV4YWfDqXLDqW1lbnQgbG9uZywgb24gbGUgdHJvbnF1ZSDDoCBsJ2FmZmljaGFnZVxuICAgICAgaWYgKGFydGlzdE5hbWUubGVuZ3RoID4gbWF4U3RyaW5nTGVuZ3RoKSB7XG4gICAgICAgIGFydGlzdE5hbWUgPSBhcnRpc3ROYW1lLnN1YnN0cigwLCBtYXhTdHJpbmdMZW5ndGgpICsgXCIgLi4uXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBodG1sID0gJzxkaXYgaWQ9XCJzdWJtaXQtJyArIHRyYWNrLmlkICsgJ1wiIGNsYXNzPVwidHJhY2tcIiBpdGVtc2NvcGUgaXRlbXR5cGU9XCJodHRwczovL3NjaGVtYS5vcmcvTXVzaWNSZWNvcmRpbmdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8ZmlndXJlPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgPGltZyBjbGFzcz1cImxhenlPd2xcIiBkYXRhLXNyYz1cIicgKyB0cmFjay5hbGJ1bS5jb3Zlcl9tZWRpdW0gKyAnXCIgYWx0PVwiJyArIHRyYWNrLnRpdGxlICsgJ1wiPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgPGZpZ2NhcHRpb24+JztcbiAgICAgICAgICBodG1sICs9ICcgICAgIDxkaXY+JztcbiAgICAgICAgICBodG1sICs9ICcgICAgICAgPGgzIGNsYXNzPVwidHJhY2stdGl0bGVcIiBpdGVtcHJvcD1cIm5hbWVcIj4nICsgdHJhY2sudGl0bGUgKyAnPC9oMz4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgICA8cCBjbGFzcz1cImFydGlzdC1uYW1lXCIgaXRlbXByb3A9XCJieUFydGlzdFwiPicgKyBhcnRpc3ROYW1lICsgXCI8L3A+XCI7XG4gICAgICAgICAgaHRtbCArPSAnICAgICA8L2Rpdj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgIDwvZmlnY2FwdGlvbj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8L2ZpZ3VyZT4nO1xuICAgICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiaGFybW9uaWMtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGhhcm1vbmlxdWVcblxuICAgICAgdmFyIGFydGlzdE5hbWUgPSB0cmFjay5nZXRBcnRpc3QoKSxcbiAgICAgICAgICBtYXhTdHJpbmdMZW5ndGggPSAxMDAsXG4gICAgICAgICAgdGVtcG9Dc3NDbGFzcyA9IFwicmVkXCIsXG4gICAgICAgICAgdG9uYWxpdHlDc3NDbGFzcyA9IFwicmVkXCI7XG5cbiAgICAgIC8vIE9uIGfDqHJlIGxlIGNhcyBvw7kgbGUgbm9tIGRlIGwnYXJ0aXN0ZSBlc3QgZXhhZ8OpcsOpbWVudCBsb25nXG4gICAgICBpZiAoYXJ0aXN0TmFtZS5sZW5ndGggPiBtYXhTdHJpbmdMZW5ndGgpIHtcbiAgICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICAgIH1cblxuICAgICAgLy8gT24gc2lnbmFsZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVybWVzIGRlIHRlbXBvXG4gICAgICBpZiAoaXNUZW1wb0NvbXBhdGlibGUpIHtcbiAgICAgICAgdGVtcG9Dc3NDbGFzcyA9IFwiZ3JlZW5cIjtcbiAgICAgIH1cblxuICAgICAgLy8gT24gc2lnbmFsZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVybWVzIGRlIHRvbmFsaXTDqVxuICAgICAgaWYgKGlzS2V5Q29tcGF0aWJsZSkge1xuICAgICAgICB0b25hbGl0eUNzc0NsYXNzID0gXCJncmVlblwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgaHRtbCA9ICc8YSBjbGFzcz1cImhhcm1vbmljLXRyYWNrXCIgaXRlbXNjb3BlIGl0ZW10eXBlPVwiaHR0cHM6Ly9zY2hlbWEub3JnL011c2ljQ29tcG9zaXRpb25cIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8ZmlndXJlPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgPGltZyBzcmM9XCInICsgdHJhY2suZ2V0Q292ZXIoKSArICdcIiBhbHQ9XCInICsgdHJhY2suZ2V0VGl0bGUoKSArICdcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgIDxmaWdjYXB0aW9uPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgICA8ZGl2Pic7XG4gICAgICAgICAgaHRtbCArPSAnICAgICAgPGgzIGl0ZW1wcm9wPVwibmFtZVwiPicgKyB0cmFjay5nZXRUaXRsZSgpICsgJzwvaDM+JztcbiAgICAgICAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cImFydGlzdC1uYW1lXCIgaXRlbXByb3A9XCJjb21wb3NlclwiPicgKyBhcnRpc3ROYW1lICsgJzwvcD4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAgIDxwIGNsYXNzPVwiJyArIHRlbXBvQ3NzQ2xhc3MgKyAnXCIgaXRlbXByb3A9XCJtdXNpY2FsS2V5XCI+VGVtcG8gOiAnICsgdHJhY2suZ2V0VGVtcG8oKSArICcgQlBNPC9wPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCInICsgdG9uYWxpdHlDc3NDbGFzcyArICdcIiBpdGVtcHJvcD1cIm11c2ljYWxLZXlcIj5Ub25hbGl0w6kgOiAnICsgdHJhY2suZ2V0S2V5KCkgKyAnICcgKyB0cmFjay5nZXRNb2RlKCkgKyAnPC9wPic7XG4gICAgICAgICAgaHRtbCArPSAnICAgICA8L2Rpdj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgIDwvZmlnY2FwdGlvbj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8L2ZpZ3VyZT4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8aW5wdXQgdHlwZT1cImhpZGRlblwiIHZhbHVlPVwiJyArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeSh0cmFjaykpICsgJ1wiPic7XG4gICAgICAgICAgaHRtbCArPSAnPC9hPic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiYXV0b2NvbXBsZXRlXCIpIHsgLy8gQXV0b2NvbXBsw6l0aW9uXG5cbiAgICAgIHZhciBodG1sID0gJzxkaXYgaWQ9XCJhdXRvY29tcGxldGUtJyArIHRyYWNrLmlkICsgJ1wiPic7XG4gICAgICAgICAgaHRtbCArPSAnIDxzdHJvbmc+JyArIHRyYWNrLnRpdGxlICsgJzwvc3Ryb25nPjxicj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyA8ZW0+JyArIHRyYWNrLmFydGlzdC5uYW1lICsgJzwvZW0+JztcbiAgICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgICByZXR1cm4gaHRtbDtcblxuICAgIH0gZWxzZSB7IC8vIENhc2UgZCdhaWRlXG5cbiAgICAgIHZhciBodG1sID0gJzxhIGNsYXNzPVwiaXRlbSB0aXRsZVwiPic7XG4gICAgICAgICAgaHRtbCArPSAnIDxoMj5TdWdnZXN0aW9uczwvaDI+JztcbiAgICAgICAgICBodG1sICs9ICc8L2E+JztcbiAgICAgICAgICBodG1sICs9ICc8YSBpZD1cInRyYWNrcy1oZWxwXCIgaHJlZj1cIiNcIj4nO1xuICAgICAgICAgIGh0bWwgKz0gJyAgPGkgY2xhc3M9XCJoZWxwIGNpcmNsZSBpY29uXCI+PC9pPic7XG4gICAgICAgICAgaHRtbCArPSAnPC9hPic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgRmFjYWRlIHBlcm1ldHRhbnQgZCfDqXZpdGVyIGwnYWJvbmRhbmNlIGRlIGNvbmRpdGlvbnMgZGFucyBsZSBjb2RlXG4gICAqXG4gICAqIEBtZXRob2QgYWxlcnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBkJ2FsZXJ0ZSAoc3VjY8OocywgZXJyZXVyLCBtZXNzYWdlKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBNZXNzYWdlIGQnYWxlcnRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lciBEdXLDqWUgZGUgdmllIGRlIGxhIG5vdGlmaWNhdGlvblxuICAgKi9cbiAgYWxlcnQ6IGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2UsIHRpbWVyKSB7XG4gICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgICAgIHJldHVybiBhbGVydGlmeS5zdWNjZXNzKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yXCI6XG4gICAgICAgICAgcmV0dXJuIGFsZXJ0aWZ5LmVycm9yKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1lc3NhZ2VcIjpcbiAgICAgICAgICByZXR1cm4gYWxlcnRpZnkubWVzc2FnZShtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogU3VwcHJlc3Npb24gZGUgdG91dGVzIGxlcyBub3RpZmljYXRpb25zIGFjdGl2ZXNcbiAgICpcbiAgICogQG1ldGhvZCBjbGVhbk5vdGlmaWNhdGlvbnNcbiAgICovXG4gIGNsZWFuTm90aWZpY2F0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgYWxlcnRpZnkuZGlzbWlzc0FsbCgpO1xuICB9LFxuICAvKipcbiAgICogQWZmaWNoYWdlIGRlcyBzdWdnZXN0aW9ucyBoYXJtb25pcXVlcyDDoCBsYSBmaW4gZHUgcHJvY2Vzc3VzIGRlIHJlY2hlcmNoZVxuICAgKlxuICAgKiBAbWV0aG9kIGRpc3BsYXlGaW5hbFRyYWNrbGlzdFxuICAgKi9cbiAgZGlzcGxheUZpbmFsVHJhY2tsaXN0OiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiNoYXJtb25pYy10cmFja3NcIiApXG4gICAgICAuc2lkZWJhciggXCJzZXR0aW5nXCIsIFwidHJhbnNpdGlvblwiLCBcInNjYWxlIGRvd25cIiApXG4gICAgICAuc2lkZWJhciggXCJzaG93XCIgKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1pbmktY2xhc3NlIGRlIGdlc3Rpb24gZGVzIHNjcm9sbGJhcnMuXG4gICAqIExlcyBzY3JvbGxiYXJzIGTDqXBlbmRlbnQgZHUgcGx1Z2luIG1DdXN0b21TY3JvbGxiYXIuXG4gICAqXG4gICAqIEBjbGFzcyBzY3JvbGxiYXJcbiAgICovXG4gIHNjcm9sbDoge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIGRlcyBzY3JvbGxiYXJzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI3BsYXlsaXN0LCAjZmF2b3JpdGVzXCIgKS5tQ3VzdG9tU2Nyb2xsYmFyKHtcbiAgICAgICAgdGhlbWU6IFwiZGFya1wiLFxuICAgICAgICBzY3JvbGxJbmVydGlhOiAwXG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWluaXRpYWxpc2F0aW9uIGNvbXBsw6h0ZSBkJ3VuZSBzY3JvbGxiYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oJGNvbnRhaW5lcikge1xuICAgICAgJGNvbnRhaW5lci5tQ3VzdG9tU2Nyb2xsYmFyKCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEZXN0cnVjdGlvbiBkJ3VuZSBzY3JvbGxiYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAqL1xuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCRjb250YWluZXIpIHtcbiAgICAgICRjb250YWluZXIubUN1c3RvbVNjcm9sbGJhciggXCJkZXN0cm95XCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBNaW5pLWNsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGUgY2hhcmdlbWVudFxuICAgKlxuICAgKiBAY2xhc3MgbG9hZGluZ1xuICAgKi9cbiAgbG9hZGluZzoge1xuICAgIC8qKlxuICAgICAqIEFjdGl2ZXIgbGUgbG9hZGVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9uXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkucGFnZS5kaW1tZXJcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZlciBsZSBsb2FkZXJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb2ZmXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLnBhZ2UuZGltbWVyXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXUgbWVudVxuICAgKlxuICAgKiBAY2xhc3MgbWVudVxuICAgKi9cbiAgbWVudToge1xuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciBsZSBtZW51IChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVcbiAgICAgKi9cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIjbWVudVwiICkuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGxhIHBsYXlsaXN0IChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVQbGF5bGlzdFxuICAgICAqL1xuICAgIHRvZ2dsZVBsYXlsaXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI3BsYXlsaXN0XCIsIFwiYmx1ZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbGVzIGZhdm9yaXMgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZUZhdm9yaXRlc1xuICAgICAqL1xuICAgIHRvZ2dsZUZhdm9yaXRlczogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiNmYXZvcml0ZXNcIiwgXCJyZWRcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIGxlcyBhbWJpYW5jZXMgKHNpZGViYXIpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZUF0bW9zcGhlcmVzXG4gICAgICovXG4gICAgdG9nZ2xlQXRtb3NwaGVyZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjYXRtb3NwaGVyZXNcIiwgXCJncmVlblwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbGVzIG1vcmNlYXV4IGhhcm1vbmlxdWVzIChzaWRlYmFyKVxuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVIYXJtb25pY1RyYWNrc1xuICAgICAqL1xuICAgIHRvZ2dsZUhhcm1vbmljVHJhY2tzOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI2hhcm1vbmljLXRyYWNrc1wiLCBcInZpb2xldFwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgbCd1dGlsaXNhdGV1ciAoc2lkZWJhcilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlVXNlclxuICAgICAqL1xuICAgIHRvZ2dsZVVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjdXNlclwiLCBcIm1hcm9vblwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgdW5lIHNpZGViYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlU2lkZWJhclxuICAgICAqL1xuICAgIHRvZ2dsZVNpZGViYXI6IGZ1bmN0aW9uKGlkLCBjb2xvcikge1xuICAgICAgJCggaWQgKVxuICAgICAgICAuc2lkZWJhcih7XG4gICAgICAgICAgb25TaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIGlkICsgXCItYnRuXCIgKS5hZGRDbGFzcyggY29sb3IgKyBcIi1pdGVtXCIgKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCBpZCArIFwiLWJ0blwiICkucmVtb3ZlQ2xhc3MoIGNvbG9yICsgXCItaXRlbVwiICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc2lkZWJhciggXCJzZXR0aW5nXCIsIFwidHJhbnNpdGlvblwiLCBcIm92ZXJsYXlcIiApXG4gICAgICAgIC5zaWRlYmFyKCBcInRvZ2dsZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgdG91dGVzIGxlcyBzaWRlYmFyc1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVBbGxcbiAgICAgKi9cbiAgICB0b2dnbGVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gT24gYWZmaWNoZSBsZSBtZW51IGR1IGJhc1xuICAgICAgR1VJLm1lbnUudG9nZ2xlKCk7XG4gICAgICAvLyBPbiBhZmZpY2hlIHRvdXRlcyBsZXMgYXV0cmVzIHNpZGViYXJzXG4gICAgICB2YXIgY29sb3JzID0gW1wiYmx1ZVwiLCBcInJlZFwiLCBcImdyZWVuXCIsIFwidmlvbGV0XCIsIFwibWFyb29uXCJdO1xuICAgICAgJCggXCIuc2lkZWJhclwiICkubm90KCBcIiNtZW51XCIgKS5lYWNoKGZ1bmN0aW9uKGksIGVsdCkge1xuICAgICAgICB2YXIgaWQgPSAkKCBlbHQgKS5hdHRyKCBcImlkXCIgKTtcbiAgICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjXCIgKyBpZCwgY29sb3JzW2ldKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgw6AgbGEgcGxheWxpc3RcbiAgICpcbiAgICogQGNsYXNzIHBsYXlsaXN0XG4gICAqL1xuICBwbGF5bGlzdDoge1xuICAgIC8qKlxuICAgICAqIFLDqWN1cMOpcmF0aW9uIGQndW5lIHBsYXlsaXN0IHNhdXZlZ2FyZMOpZSBkYW5zIGxlIGxvY2FsIHN0b3JhZ2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmV0cmlldmVcbiAgICAgKi9cbiAgICByZXRyaWV2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2F2ZWRQbGF5bGlzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWxpc3RcIik7XG4gICAgICBpZiAoc2F2ZWRQbGF5bGlzdCAhPT0gbnVsbCkge1xuICAgICAgICBQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyA9IEpTT04ucGFyc2Uoc2F2ZWRQbGF5bGlzdCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90UmFuZG9tXG4gICAgICovXG4gICAgbm90UmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmFuZG9tKGZhbHNlKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJhbmRvbVwiLCBcInJlbW92ZVwiICk7XG4gICAgICAkKCBcIiNyYW5kb20tYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwibm90LXJhbmRvbS1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJMZWN0dXJlIGFsw6lhdG9pcmUgZMOpc2FjdGl2w6llXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWN0aXZhdGlvbiBkZSBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICovXG4gICAgcmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmFuZG9tKHRydWUpO1xuICAgICAgJCggXCIjbm90LXJhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlbW92ZVwiLCBcInJhbmRvbVwiICk7XG4gICAgICAkKCBcIiNub3QtcmFuZG9tLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJhbmRvbS1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkxlY3R1cmUgYWzDqWF0b2lyZSBhY3RpdsOpZVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvblxuICAgICAqXG4gICAgICogQG1ldGhvZCBub1JlcGVhdFxuICAgICAqL1xuICAgIG5vUmVwZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmVwZWF0KDApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlZnJlc2hcIiwgXCJyZW1vdmVcIiApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJuby1yZXBlYXRidG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIlBhcyBkZSByw6lww6l0aXRpb25cIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkJ3VuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVwZWF0T25lXG4gICAgICovXG4gICAgcmVwZWF0T25lOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmVwZWF0KDIpO1xuICAgICAgJCggXCIjbm8tcmVwZWF0LWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVtb3ZlXCIsIFwicmVwZWF0XCIgKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyZXBlYXQtb25lLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiUsOpcMOpdGl0aW9uIGR1IG1vcmNlYXUgZW4gY291cnNcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkZSB0b3VzIGxlcyBtb3JjZWF1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXBlYXRBbGxcbiAgICAgKi9cbiAgICByZXBlYXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yZXBlYXQoMSk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVwZWF0XCIsIFwicmVmcmVzaFwiICk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJlcGVhdC1hbGwtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJSw6lww6l0aXRpb24gZGUgdG91cyBsZXMgbW9yY2VhdXhcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtdXRlXG4gICAgICovXG4gICAgbXV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm11dGUodHJ1ZSk7XG4gICAgICAkKCBcIiN1bm11dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJ1bm11dGVcIiwgXCJtdXRlXCIgKTtcbiAgICAgICQoIFwiI3VubXV0ZS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJtdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlNvbiBjb3Vww6kgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCB1bm11dGVcbiAgICAgKi9cbiAgICB1bm11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5tdXRlKGZhbHNlKTtcbiAgICAgICQoIFwiI211dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJtdXRlXCIsIFwidW5tdXRlXCIgKTtcbiAgICAgICQoIFwiI211dGUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwidW5tdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiU29uIHLDqXRhYmxpICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTYXV2ZWdhcmRlIGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlIGRhbnMgbGUgbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzYXZlXG4gICAgICovXG4gICAgc2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGxheWxpc3QgPSBKU09OLnN0cmluZ2lmeShQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlsaXN0XCIsIHBsYXlsaXN0KTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBzYXV2ZWdhcmTDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEV4cG9ydCBDU1YgZGUgbGEgcGxheWxpc3QgY291cmFudGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZXhwb3J0XG4gICAgICovXG4gICAgZXhwb3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI2Nzdi1leHBvcnRcIiApLnRhYmxlVG9DU1YoKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBleHBvcnTDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEVmZmFjZW1lbnQgZGUgbGEgcGxheWxpc3QgY291cmFudGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVsZXRlXG4gICAgICovXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzID0gW107XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInBsYXlsaXN0XCIpO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IGVmZmFjw6llICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBQYXNzYWdlIGF1IG1vcmNlYXUgcHLDqWPDqWRlbnRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcHJldmlvdXNcbiAgICAgKi9cbiAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnByZXYoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsbGVyIGVuIGFycmnDqHJlIGRhbnMgbGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBiYWNrXG4gICAgICovXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnRyYWNrUG9zaXRpb24gPiAxMCkge1xuICAgICAgICBHVUkudHJhY2tQb3NpdGlvbiAtPSAxMDtcbiAgICAgIH1cbiAgICAgIEdVSS5wbGF5ZXIuc2VlayhHVUkudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMaXJlIHVuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS50cmFja3NMb2FkZWQpIHtcbiAgICAgICAgR1VJLnBsYXllci5wbGF5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkucGxheWVyLnBsYXlUcmFja3MoUGxheWxpc3QudHJhY2tzSWRzKTtcbiAgICAgICAgR1VJLnRyYWNrc0xvYWRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNZXR0cmUgZW4gcGF1c2UgdW4gbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucGF1c2UoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsbGVyIGVuIGF2YW50IGRhbnMgbGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBiYWNrXG4gICAgICovXG4gICAgZm9ydGg6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS50cmFja1Bvc2l0aW9uIDwgOTApIHtcbiAgICAgICAgR1VJLnRyYWNrUG9zaXRpb24gKz0gMTA7XG4gICAgICB9XG4gICAgICBHVUkucGxheWVyLnNlZWsoR1VJLnRyYWNrUG9zaXRpb24pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUGFzc2FnZSBhdSBtb3JjZWF1IHN1aXZhbnRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbmV4dFxuICAgICAqL1xuICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5uZXh0KCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBam91dCBkJ3VuIG1vcmNlYXUgw6AgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkVHJhY2tcbiAgICAgKi9cbiAgICBhZGRUcmFjazogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdHJhY2sgPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudCgkKCB0aGlzICkuY2hpbGRyZW4oKS5lcSgxKS52YWwoKSkpO1xuICAgICAgUGxheWxpc3QuYWRkVHJhY2tUb1BsYXlsaXN0KHRyYWNrKTtcbiAgICAgIEdVSS50cmFja3NMb2FkZWQgPSBmYWxzZTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJNb3JjZWF1IGFqb3V0w6kgw6Agdm90cmUgcGxheWxpc3RcIiwgNSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggZmF2b3Jpc1xuICAgKlxuICAgKiBAY2xhc3MgZmF2b3JpdGVzXG4gICAqL1xuICBmYXZvcml0ZXM6IHtcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGxhIHZpc2liaWxpdMOpIGRlIGwnaVBvZFxuICAgICAqXG4gICAgICogQG1ldGhvZCBpcG9kXG4gICAgICovXG4gICAgaXBvZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGlwb2QgPSAkKCBcIiNpcG9kLXdyYXBwZXJcIiApLFxuICAgICAgICAgICRpcG9kU3RhdGUgPSAkKCBcIiNmYXYtaXBvZCAuc3RhdGVcIiApO1xuICAgICAgJGlwb2QuaXMoIFwiOnZpc2libGVcIiApID8gJGlwb2QuZmFkZU91dCgpIDogJGlwb2QuZmFkZUluKCk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRpcG9kU3RhdGUsIFwiaVBvZCBhY3RpdsOpICFcIiwgXCJpUG9kIGTDqXNhY3RpdsOpICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlcyBpbmZvYnVsbGVzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvb2x0aXBcbiAgICAgKi9cbiAgICB0b29sdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdG9vbHRpcFN0YXRlID0gJCggXCIjZmF2LXRvb2x0aXAgLnN0YXRlXCIgKTtcbiAgICAgIGlmIChHVUkudG9vbHRpcEFsbG93ZWQpIHtcbiAgICAgICAgR1VJLnRvb2x0aXBBbGxvd2VkID0gZmFsc2U7XG4gICAgICAgICQoIFwiW3RpdGxlICE9ICcnXVwiICkucG9wdXAoIFwiZGVzdHJveVwiICk7IC8vIFNlbWFudGljIFVJXG4gICAgICAgICQoIFwiW3RpdGxlICE9ICcnXVwiICkucXRpcCggXCJkZXN0cm95XCIsIHRydWUgKTsgLy8gcVRpcMKyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkudG9vbHRpcEFsbG93ZWQgPSB0cnVlO1xuICAgICAgICBHVUkudG9vbHRpcHMoKTtcbiAgICAgIH1cbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJHRvb2x0aXBTdGF0ZSwgXCJJbmZvYnVsbGVzIGFjdGl2w6llcyAhXCIsIFwiSW5mb2J1bGxlcyBkw6lzYWN0aXbDqWVzICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlcyBub3RpZmljYXRpb25zXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vdGlmeVxuICAgICAqL1xuICAgIG5vdGlmeTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJG5vdGlmU3RhdGUgPSAkKCBcIiNmYXYtbm90aWZ5IC5zdGF0ZVwiICk7XG4gICAgICBHVUkubm90aWZBbGxvd2VkID8gKEdVSS5ub3RpZkFsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLm5vdGlmQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkbm90aWZTdGF0ZSwgXCJOb3RpZmljYXRpb25zIGFjdGl2w6llcyAhXCIsIFwiTm90aWZpY2F0aW9ucyBkw6lzYWN0aXbDqWVzICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlcyBzb25zIGQnYW1iaWFuY2VcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc291bmRcbiAgICAgKi9cbiAgICBzb3VuZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHNvdW5kU3RhdGUgPSAkKCBcIiNmYXYtc291bmQgLnN0YXRlXCIgKTtcbiAgICAgIEdVSS5zb3VuZEFsbG93ZWQgPyAoR1VJLnNvdW5kQWxsb3dlZCA9IGZhbHNlKSA6IChHVUkuc291bmRBbGxvd2VkID0gdHJ1ZSk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRzb3VuZFN0YXRlLCBcIlNvbnMgZCdhbWJpYW5jZSBhY3RpdsOpcyAhXCIsIFwiU29ucyBkJ2FtYmlhbmNlIGTDqXNhY3RpdsOpcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsJ2F1dG9jb21wbMOpdGlvblxuICAgICAqXG4gICAgICogQG1ldGhvZCBhdXRvY29tcGxldGVcbiAgICAgKi9cbiAgICBhdXRvY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRhdXRvY29tcGxldGVTdGF0ZSA9ICQoIFwiI2Zhdi1hdXRvY29tcGxldGUgLnN0YXRlXCIgKTtcbiAgICAgIGlmIChHVUkuYXV0b2NvbXBsZXRlQWxsb3dlZCkge1xuICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmZhZGVPdXQoKTtcbiAgICAgICAgR1VJLmF1dG9jb21wbGV0ZUFsbG93ZWQgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLmF1dG9jb21wbGV0ZUFsbG93ZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRhdXRvY29tcGxldGVTdGF0ZSwgXCJBdXRvY29tcGzDqXRpb24gYWN0aXbDqWUgIVwiLCBcIkF1dG9jb21wbMOpdGlvbiBkw6lzYWN0aXbDqWUgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIGRvdWJsb25zIGRhbnMgbGVzIHN1Z2dlc3Rpb25zXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIGR1cGxpY2F0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGR1cGxpY2F0ZVN0YXRlID0gJCggXCIjZmF2LWR1cGxpY2F0ZSAuc3RhdGVcIiApO1xuICAgICAgR1VJLmR1cGxpY2F0ZXNBbGxvd2VkID8gKEdVSS5kdXBsaWNhdGVzQWxsb3dlZCA9IGZhbHNlKSA6IChHVUkuZHVwbGljYXRlc0FsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJGR1cGxpY2F0ZVN0YXRlLCBcIkRvdWJsb25zIGFjdGl2w6lzICFcIiwgXCJEb3VibG9ucyBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZCd1bmUgdG9sw6lyYW5jZSBwb3VyIGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvUmFuZ2VcbiAgICAgKi9cbiAgICB0ZW1wb1JhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZW1wb1ZhcmlhdGlvbiA9ICQoIFwiaW5wdXRbdHlwZT0ncmFuZ2UnXVwiICkudmFsKCk7XG4gICAgICAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ10gKyBzcGFuXCIgKS50ZXh0KCB0ZW1wb1ZhcmlhdGlvbiArIFwiICVcIiApO1xuICAgICAgR1VJLnRlbXBvVmFyaWF0aW9uID0gKHRlbXBvVmFyaWF0aW9uIC8gMTAwKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBwYXIgZMOpZmF1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWZhdWx0U29ydGluZ1xuICAgICAqL1xuICAgIGRlZmF1bHRTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlZmF1bHRcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBmYXZvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvRmlyc3RTb3J0aW5nXG4gICAgICovXG4gICAgdGVtcG9GaXJzdFNvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwidGVtcG9GaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGZhdm9yaXNhbnQgbGEgdG9uYWxpdMOpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGtleUZpcnN0U29ydGluZ1xuICAgICAqL1xuICAgIGtleUZpcnN0U29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJrZXlGaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGNyb2lzc2FudCBkdSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBhc2NUZW1wb1NvcnRpbmdcbiAgICAgKi9cbiAgICBhc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiYXNjVGVtcG9cIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBkw6ljcm9pc3NhbnQgZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVzY1RlbXBvU29ydGluZ1xuICAgICAqL1xuICAgIGRlc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiZGVzY1RlbXBvXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGR1IHRyaSBwbGFjZWJvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vU29ydGluZ1xuICAgICAqL1xuICAgIG5vU29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJub25lXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnw6l0YXQgKG9uL29mZilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY2hhbmdlU3RhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gJHN0YXRlIENoYW1wIGNhY2jDqSBjb250ZW5hbnQgbCfDqXRhdCBkZSBsJ29iamV0IGRhbnMgbGUgRE9NXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBvc2l0aXZlTWVzc2FnZSBNZXNzYWdlIGQnYWN0aXZhdGlvbiAodmVydClcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmVnYXRpdmVNZXNzYWdlIE1lc3NhZ2UgZGUgZMOpc2FjdGl2YXRpb24gKHJvdWdlKVxuICAgICAqL1xuICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbigkc3RhdGUsIG9uTWVzc2FnZSwgb2ZmTWVzc2FnZSkge1xuICAgICAgaWYgKCRzdGF0ZS52YWwoKSA9PSBcIm9uXCIpIHtcbiAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgb2ZmTWVzc2FnZSwgNSk7XG4gICAgICAgICRzdGF0ZS52YWwoIFwib2ZmXCIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgb25NZXNzYWdlLCA1KTtcbiAgICAgICAgJHN0YXRlLnZhbCggXCJvblwiICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggYW1iaWFuY2VzXG4gICAqXG4gICAqIEBjbGFzcyBhdG1vc3BoZXJlc1xuICAgKi9cbiAgYXRtb3NwaGVyZXM6IHtcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnYW1iaWFuY2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXBwbHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXRtbyBOb20gZGUgbCdhbWJpYW5jZVxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbihhdG1vKSB7XG4gICAgICAkKCBcIiNcIiArIGF0bW8gKyBcIi1hdG1vXCIgKS5hZGRDbGFzcyggXCJncmVlbi1pdGVtXCIgKTtcbiAgICAgICQoIFwiI1wiICsgYXRtbyArIFwiLWF0bW9cIiApLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoIFwiZ3JlZW4taXRlbVwiICk7XG4gICAgICAkKCBcIi5wdXNoZXJcIiApLmF0dHIoIFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kOnVybCgnaW1hZ2VzL2JhY2tncm91bmQvXCIgKyBhdG1vICsgXCIuanBnJykgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXIgZml4ZWQgIWltcG9ydGFudFwiICk7XG4gICAgICBpZiAoR1VJLnNvdW5kQWxsb3dlZCAmJiBhdG1vICE9IFwibmV1dHJhbFwiKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbyggXCIuL3NvdW5kcy9cIiArIGF0bW8gKyBcIi5vZ2dcIik7XG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIG5ldXRyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXV0cmFsXG4gICAgICovXG4gICAgbmV1dHJhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJuZXV0cmFsXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgUm9ja1xuICAgICAqXG4gICAgICogQG1ldGhvZCByb2NrXG4gICAgICovXG4gICAgcm9jazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJyb2NrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRWxlY3Ryb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBlbGVjdHJvXG4gICAgICovXG4gICAgZWxlY3RybzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJlbGVjdHJvXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgSGlwLUhvcFxuICAgICAqXG4gICAgICogQG1ldGhvZCBoaXBob3BcbiAgICAgKi9cbiAgICBoaXBob3A6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KFwiaGlwaG9wXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgRm9sa1xuICAgICAqXG4gICAgICogQG1ldGhvZCBmb2xrXG4gICAgICovXG4gICAgZm9sazogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJmb2xrXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgQ2xhc3NpcXVlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNsYXNzaWNhbFxuICAgICAqL1xuICAgIGNsYXNzaWNhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoXCJjbGFzc2ljYWxcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBKYXp6XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGphenpcbiAgICAgKi9cbiAgICBqYXp6OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseShcImphenpcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBNZXRhbFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtZXRhbFxuICAgICAqL1xuICAgIG1ldGFsOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseShcIm1ldGFsXCIpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgw6AgbCd1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAY2xhc3MgdXNlclxuICAgKi9cbiAgdXNlcjoge1xuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbGEgY29ubmV4aW9uIGQndW4gdXRpbGlzYXRldXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9naW5cbiAgICAgKi9cbiAgICBsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9IFwiY29ubmVjdGVkXCIpIHsgLy8gU2kgbCd1dGlsaXNhdGV1ciBuJ2VzdCBwYXMgY29ubmVjdMOpXG4gICAgICAgICAgRFoubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gXCJjb25uZWN0ZWRcIikgeyAvLyBTaSB0b3V0IHNlIHBhc3NlIGJpZW5cbiAgICAgICAgICAgICAgRFouYXBpKFwiL3VzZXIvbWVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWltZ1wiICkuYXR0cih7IHNyYzpyZXNwb25zZS5waWN0dXJlX3NtYWxsLCBhbHQ6cmVzcG9uc2UubmFtZSB9KTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5hbWVcIiApLnRleHQoIHJlc3BvbnNlLm5hbWUgKS5hdHRyKCBcImhyZWZcIiwgcmVzcG9uc2UubGluayApO1xuICAgICAgICAgICAgICAgICQoIFwiI3VzZXItZW1haWxcIiApLnRleHQoIHJlc3BvbnNlLmVtYWlsICk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShyZXNwb25zZS5pbnNjcmlwdGlvbl9kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBtID0gZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWRhdGVcIiApLnRleHQoIFwiSW5zY3JpdCBsZSBcIiArIGQgKyBcIi9cIiArIG0gKyBcIi9cIiArIHkgKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuc2hvdygpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkNvbm5leGlvbiBPSyAhXCIsIDMpO1xuICAgICAgICAgICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiN1c2VyXCIsIFwibWFyb29uXCIgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFNpIGxhIGNvbm5leGlvbiDDqWNob3VlXG4gICAgICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiQ29ubmV4aW9uIHJlZnVzw6llICFcIiwgNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgeyBwZXJtczogXCJiYXNpY19hY2Nlc3MsZW1haWxcIiB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGxhIGTDqWNvbm5leGlvbiBkJ3VuIHV0aWxpc2F0ZXVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ291dFxuICAgICAqL1xuICAgIGxvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5sb2dvdXQoKTtcbiAgICAgICQoIFwiI3VzZXItY29ubmVjdGVkXCIgKS5oaWRlKCk7XG4gICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLnNob3coKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJEw6ljb25uZXhpb24gT0sgIVwiLCAzKTtcbiAgICAgICQoIFwiI3VzZXJcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGRpdmVycyDDqXbDqW5lbWVudHNcbiAgICpcbiAgICogQGNsYXNzIG1pc2NcbiAgICovXG4gIG1pc2M6IHtcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGR1IGNsaWMgc3VyIGxlIGxvZ29cbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9nb1xuICAgICAqL1xuICAgIGxvZ286IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1pc2Muc2hvd01vZGFsKCAkKCBcIiNhYm91dFwiICkgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZHUgY2xpYyBzdXIgbGEgY2FzZSBkJ2FpZGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaGVscFxuICAgICAqL1xuICAgIGhlbHA6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1pc2Muc2hvd01vZGFsKCAkKCBcIiNoZWxwXCIgKSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoYWdlIGQndW5lIGJvw650ZSBtb2RhbGVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc2hvd01vZGFsXG4gICAgICovXG4gICAgc2hvd01vZGFsOiBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICAgICRzZWxlY3Rvci5tb2RhbCggXCJzaG93XCIgKTtcbiAgICB9XG4gIH1cbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL0dVSS5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIENsYXNzZSBtZXR0YW50IGVuIMWTdXZyZSBsZSBwYXR0ZXJuIEl0ZXJhdG9yLlxuICogQ2V0dGUgY2xhc3NlIGZvdXJuaXQgdW4gbW95ZW4gZCdpdMOpcmVyIHBsdXMgc2ltcGxlbWVudCBzdXIgbGVzIGNvbGxlY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgSXRlcmF0b3JcbiAqIEBjbGFzcyBJdGVyYXRvclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtcyBDb2xsZWN0aW9uIGQnb2JqZXRzIMOgIHBhcmNvdXJpclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yID0gZnVuY3Rpb24oaXRlbXMpIHtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSXRlcmF0b3IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEl0ZXJhdG9yIGRvaXQgw6p0cmUgaW5zdGFuY2nDqWUgYXZlYyBsJ29ww6lyYXRldXIgwqsgbmV3IMK7XCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IGRlIGJhc2Ugw6AgcGFydGlyIGR1cXVlbCBjb21tZW5jZSB1bmUgaXTDqXJhdGlvbi5cbiAgICpcbiAgICogQHByb3BlcnR5IGluZGV4XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRoaXMuX2luZGV4ID0gMDtcblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBkJ29iamV0cyDDoCBwYXJjb3VyaXIuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBpdGVtc1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICB0aGlzLl9pdGVtcyA9IGl0ZW1zO1xufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbCdJdGVyYXRvclxuICovXG5JdGVyYXRvci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBNw6l0aG9kZSB2w6lyaWZpYW50IHMnaWwgeSBhIHVuIMOpbMOpbWVudCBzdWl2YW50IGRhbnMgbGEgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBoYXNOZXh0XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgcydpbCB5IGEgdW4gw6lsw6ltZW50IHN1aXZhbnRcbiAgICovXG4gIGhhc05leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgfSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIHJlbnZveWFudCBsJ8OpbMOpbWVudCBjb3VyYW50IGxvcnMgZGUgbCdpdMOpcmF0aW9uLlxuICAgKiBMJ2luZGV4IGVzdCBwYXIgYWlsbGV1cnMgaW5jcsOpbWVudMOpIHBvdXIgY29udGludWVyIGxlIHBhcmNvdXJzLlxuICAgKlxuICAgKiBAbWV0aG9kIG5leHRcbiAgICogQHJldHVybiB7T2JqZWN0fSBMJ29iamV0IGNvdXJhbnQgZGUgbGEgY29sbGVjdGlvblxuICAgKi9cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zW3RoaXMuX2luZGV4KytdO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvSXRlcmF0b3IuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZm91cm5pc3NhbnQgZGVzIGVudGl0w6lzIHJlbGF0aXZlcyDDoCBsYSBtdXNpcXVlLlxuICpcbiAqIEBtb2R1bGUgTXVzaWNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBNdXNpYyA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gbW9yY2VhdSBkZSBtdXNpcXVlLlxuICAgKlxuICAgKiBAY2xhc3MgVHJhY2tcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZCBJZGVudGlmaWFudCBEZWV6ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRpdHJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcnRpc3QgQXJ0aXN0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY292ZXIgUG9jaGV0dGUgZCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRvbmFsaXTDqVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBNb2RlIChtYWpldXIgb3UgbWluZXVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG8gVGVtcG8gKGVuIEJQTSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsb3RUYWcgVGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKiBAcGFyYW0ge0FycmF5fSBoYXJtb25pZXMgVGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBUcmFjazogZnVuY3Rpb24oaWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBoYXJtb25pZXMpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5UcmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciAhIExhIGNsYXNzZSBUcmFjayBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWFudCBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIC8qKlxuICAgICAqIFRpdHJlIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGl0bGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICAgIC8qKlxuICAgICAqIEFydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfYXJ0aXN0XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fYXJ0aXN0ID0gYXJ0aXN0O1xuICAgIC8qKlxuICAgICAqIFBvY2hldHRlIGQnYWxidW1cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfY292ZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jb3ZlciA9IGNvdmVyO1xuICAgIC8qKlxuICAgICAqIFRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2tleVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICAvKipcbiAgICAgKiBNb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX21vZGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICAvKipcbiAgICAgKiBUZW1wbyBkdSBtb3JjZWF1IChlbiBCUE0pXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG8gPSB0ZW1wbztcbiAgICAvKipcbiAgICAgKiBUYWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2NhbWVsb3RUYWdcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZztcbiAgICAvKipcbiAgICAgKiBUYWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaGFybW9uaWVzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICovXG4gICAgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzO1xuXG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZMOpZmluaXNzYW50IHVuZSBoYXJtb25pZSBtdXNpY2FsZS5cbiAgICpcbiAgICogQGNsYXNzIEhhcm1vbnlcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBVbiBvYmpldCBtb3JjZWF1IChUcmFjaylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRlbXBvVmFyaWF0aW9uIFZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQWN0aXZlIEwnaGFybW9uaWUgZXN0LWVsbGUgZWZmZWN0aXZlID9cbiAgICovXG4gIEhhcm1vbnk6IGZ1bmN0aW9uKHRyYWNrLCB0ZW1wb1ZhcmlhdGlvbiwgaXNBY3RpdmUpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5IYXJtb255KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEhhcm1vbnkgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90cmFja1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl90cmFjayA9IHRyYWNrLFxuICAgIC8qKlxuICAgICAqIFZhcmlhdGlvbiBkdSB0ZW1wbyBwYXIgcmFwcG9ydCDDoCB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvVmFyaWF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbixcbiAgICAvKipcbiAgICAgKiBCb29sw6llbiB2w6lyaWZpYW50IHNpIGwnaGFybW9uaWUgZXN0IGVmZmVjdGl2ZSBvdSBub25cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaXNBY3RpdmVcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuX2lzQWN0aXZlID0gaXNBY3RpdmUsXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1pbmltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtaW5pbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpIC0gKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1heGltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWF4XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtYXhpbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01heCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpICsgKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH07XG5cbiAgfVxuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBUcmFja1xuICovXG5NdXNpYy5UcmFjay5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2lkZW50aWZpYW50IGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJZFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEwnaWQgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRpdGxlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldFRpdGxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RpdGxlOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGl0bGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIHNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyB0aGlzLl90aXRsZSA9IHRpdGxlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QXJ0aXN0XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0QXJ0aXN0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FydGlzdDsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0QXJ0aXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWwgYXJ0aXN0ZSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRBcnRpc3Q6IGZ1bmN0aW9uKGFydGlzdCkgeyB0aGlzLl9hcnRpc3QgPSBhcnRpc3Q7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q292ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBnZXRDb3ZlcjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jb3ZlcjsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgcG9jaGV0dGUgZCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldENvdmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBzZXRDb3ZlcjogZnVuY3Rpb24oY292ZXIpIHsgdGhpcy5fY292ZXIgPSBjb3ZlcjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0S2V5XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldEtleTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9rZXk7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0S2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0S2V5OiBmdW5jdGlvbihrZXkpIHsgdGhpcy5fa2V5ID0ga2V5OyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldE1vZGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBnZXRNb2RlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX21vZGU7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIG1vZGUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1vZGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKi9cbiAgc2V0TW9kZTogZnVuY3Rpb24obW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldFRlbXBvOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RlbXBvOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGVtcG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0VGVtcG86IGZ1bmN0aW9uKHRlbXBvKSB7IHRoaXMuX3RlbXBvID0gdGVtcG87IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q2FtZWxvdFRhZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldENhbWVsb3RUYWc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldENhbWVsb3RUYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oY2FtZWxvdFRhZykgeyB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRIYXJtb25pZXNcbiAgICogQHJldHVybiB7QXJyYXl9IExlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldEhhcm1vbmllczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9oYXJtb25pZXM7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBzZXRIYXJtb25pZXNcbiAgICogQHBhcmFtIHtBcnJheX0gTGVzIG5vdXZlYXV4IHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0SGFybW9uaWVzOiBmdW5jdGlvbihoYXJtb25pZXMpIHsgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzOyB9LFxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgSGFybW9ueVxuICovXG5NdXNpYy5IYXJtb255LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUcmFja1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IExlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIGdldFRyYWNrOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RyYWNrOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VHJhY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IExlIG5vdXZlYXUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgc2V0VHJhY2s6IGZ1bmN0aW9uKHRyYWNrKSB7IHRoaXMuX3RyYWNrID0gdHJhY2s7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1ZhcmlhdGlvblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKi9cbiAgZ2V0VGVtcG9WYXJpYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG9WYXJpYXRpb247IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKlxuICAgKiBAbWV0aG9kIHNldFRlbXBvVmFyaWF0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBMYSBub3V2ZWxsZSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gICBzZXRUZW1wb1ZhcmlhdGlvbjogZnVuY3Rpb24odGVtcG9WYXJpYXRpb24pIHsgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIHNhdm9pciBzaSBsJ2hhcm1vbmllIGVzdCBlZmZlY3RpdmUgb3Ugbm9uXG4gICAqXG4gICAqIEBtZXRob2QgaXNBY3RpdmVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVnJhaSBvdSBmYXV4XG4gICAqL1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9pc0FjdGl2ZTsgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL011c2ljLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGVuY2Fwc3VsYW50IGxlIGxlY3RldXIgYXVkaW8gZm91cm5pIHBhciBEZWV6ZXIgKERaLnBsYXllcikuXG4gKiBMYSBjbGFzc2UgcXUnaWwgY29udGllbnQgZXN0IMOgIGxhIGZvaXMgdW4gU2luZ2xldG9uIGV0IHVuIEFkYXB0ZXIuXG4gKlxuICogQG1vZHVsZSBQbGF5ZXJcbiAqIEBjbGFzcyBQbGF5ZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgLyoqXG4gICAqIEF0dHJpYnV0IChwcml2w6kpIHJlcHLDqXNlbnRhbnQgdW5lIGluc3RhbmNlIGRlIGxhIGNsYXNzZSBlbGxlLW3Dqm1lIChjZi4gU2luZ2xldG9uKVxuICAgKlxuICAgKiBAcHJvcGVydHkgcGxheWVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgKi9cbiAgdmFyIHBsYXllcixcbiAgLyoqXG4gICAqIEF0dHJpYnV0IChwcml2w6kpIGNvbnRlbmFudCB1bmUgcsOpZsOpcmVuY2UgdmVycyBsZSBTREsgZGUgRGVlemVyXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBEZWV6ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgRFpcbiAgICovXG4gICAgICBEZWV6ZXIgPSBEWiwgLy8gaHR0cHM6Ly9jZG5zLWZpbGVzLmR6Y2RuLm5ldC9qcy9taW4vZHouanNcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RldXIgKHByaXbDqSkgY2hhcmfDqSBkJ2luaXRpYWxpc2VyIGxlIHBsYXllciAoY2YuIFNpbmdsZXRvbilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgICBjb25zdHJ1Y3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE3DqXRob2RlIGVmZmVjdHVhbnQgcsOpZWxsZW1lbnQgbCdpbml0aWFsaXNhdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgRGVlemVyLmluaXQoe1xuICAgICAgICAgICAgICBhcHBJZDogJzE2OTcxMScsXG4gICAgICAgICAgICAgIGNoYW5uZWxVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBwJyxcbiAgICAgICAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiAncGxheWVyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogODAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA4MCxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdzcXVhcmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYXJnZW1lbnQgZGVzIG1vcmNlYXV4IGRhbnMgbGUgbGVjdGV1clxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHBsYXlUcmFja3NcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gaWRzIFRhYmxlYXUgY29udGVuYW50IGxlcyBpZGVudGlmaWFudHMgZGVzIG1vcmNlYXV4XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXlUcmFja3MgPSBmdW5jdGlvbihpZHMpIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnBsYXlUcmFja3MoaWRzKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExlY3R1cmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwbGF5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhdXNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnBhdXNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdWl2YW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2Qgc3VpdmFudFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgRGVlemVyLnBsYXllci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcsOpY8OpZGVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHByZXZcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERlZXplci5wbGF5ZXIucHJldigpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWxsZXIgw6AuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBzZWVrXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3MgUG9zaXRpb24gZGUgbGEgdMOqdGUgZGUgbGVjdHVyZSAoZW50cmUgMCBldCAxMDApXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNlZWsgPSBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnNlZWsocG9zKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFjdGl2ZXIvRMOpc2FjdGl2ZXIgbGUgc29uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgbXV0ZVxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzTXV0ZSBWcmFpIG91IGZhdXhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubXV0ZSA9IGZ1bmN0aW9uKGlzTXV0ZSkge1xuICAgICAgICAgIERlZXplci5wbGF5ZXIuc2V0TXV0ZShpc011dGUpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc1JhbmRvbSBWcmFpIG91IGZhdXhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmFuZG9tID0gZnVuY3Rpb24oaXNSYW5kb20pIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnNldFNodWZmbGUoaXNSYW5kb20pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsYSBsZWN0dXJlIHLDqXDDqXTDqWVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByZXBlYXRcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgMCAobm8gcmVwZWF0KSwgMSAocmVwZWF0IGFsbCksIG91IDIgKHJlcGVhdCBvbmUpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICBEZWV6ZXIucGxheWVyLnNldFJlcGVhdChjb2RlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICByZXR1cm4gbmV3IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGTDqWxpdnJhbnQgbCd1bmlxdWUgaW5zdGFuY2UgZGUgbGEgY2xhc3NlIChjZi4gU2luZ2xldG9uKVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRQbGF5ZXJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuZSBpbnN0YW5jZSBkZSBwbGF5ZXJcbiAgICAgKi9cbiAgICB0aGlzLmdldFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHBsYXllciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBsYXllciA9IG5ldyBjb25zdHJ1Y3QoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfTtcbiAgfTtcblxufSkoKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1BsYXllci5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBlbmNhcHN1bGFudCBsZSBsZWN0ZXVyIGF1ZGlvIGZvdXJuaSBwYXIgRGVlemVyXG4gKiBMZSBtb2R1bGUgcydhcHB1aWUgc3VyIGxlIG1vZMOobGUgTVZWTSBkZSBWdWUuanMuXG4gKlxuICogQG1vZHVsZSBQbGF5bGlzdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlsaXN0ID0gbmV3IFZ1ZSh7XG4gIGVsOiBcIiNhcHBcIixcbiAgZGF0YToge1xuICAgIHRyYWNrc0lkczogW10sXG4gICAgc2VsZWN0ZWRUcmFja3M6IFtdXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRUcmFja1RvUGxheWxpc3Q6IGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICB0aGlzLnRyYWNrc0lkcy5wdXNoKHRyYWNrLl9pZCk7XG4gICAgICB0aGlzLnNlbGVjdGVkVHJhY2tzLnB1c2godHJhY2spO1xuICAgIH0sXG4gICAgcmVtb3ZlVHJhY2tGcm9tUGxheWxpc3Q6IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHRoaXMudHJhY2tzSWRzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3Muc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfVxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9QbGF5bGlzdC5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIENsYXNzZSBtZXR0YW50IGVuIMWTdXZyZSBsZSBwYXR0ZXJuIFN0cmF0ZWd5LlxuICogQ2V0dGUgY2xhc3NlIGZvdXJuaXQgdW4gbW95ZW4gZCdlbmNhcHN1bGVyIHVuZSBzw6lyaWUgZCdhbGdvcml0aG1lcyBkZSB0cmkuXG4gKlxuICogQG1vZHVsZSBTb3J0aW5nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gU29ydGluZyA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBnw6luw6lyaXF1ZSByZXByw6lzZW50YW50IGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBjbGFzcyBTdHJhdGVneVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFN0cmF0ZWd5OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBBbGdvcml0aG1lIGRlIHRyaSBjb3VyYW50XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgYWxnb3JpdGhtXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB0aGlzLl9hbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBwYXIgZMOpZmF1dC5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIG91IChYT1IpIGVuIHRvbmFsaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBEZWZhdWx0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgRGVmYXVsdDogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIHBhciBkw6lmYXV0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIG5iUGVyZmVjdE1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgYXJ0aXN0cyA9IFtdLCAvLyBUb3VzIGxlcyBhcnRpc3RlcyByZW5jb250csOpcyBkYW5zIGxlcyByw6lzdWx0YXRzXG4gICAgICAgICAgdHJhY2tzID0gW10sIC8vIExlcyBtb3JjZWF1eCDDoCByZW52b3llciDDoCBsJ2lzc3VlIGR1IHRyaVxuICAgICAgICAgIHJlYXJyYW5nZSA9IGZ1bmN0aW9uKHJlbW92ZUluZGV4LCBpbnNlcnRJbmRleCwgdHJhY2spIHtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKGluc2VydEluZGV4LCAwLCB0cmFjayk7XG4gICAgICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKSxcbiAgICAgICAgICAgIHRlbXBvID0gdHJhY2suZ2V0VGVtcG8oKSxcbiAgICAgICAgICAgIHRlbXBvTWluID0gaGFybW9ueS50ZW1wb01pbigpLFxuICAgICAgICAgICAgdGVtcG9NYXggPSBoYXJtb255LnRlbXBvTWF4KCksXG4gICAgICAgICAgICBpc01hdGNoaW5nID0gKCQuaW5BcnJheSh0cmFjay5nZXRDYW1lbG90VGFnKCksIHJlZlRyYWNrLmdldEhhcm1vbmllcygpKSAhPSAtMSk7XG5cbiAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSByZW1wbGl0IHRvdXRlcyBsZXMgY29uZGl0aW9ucyBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICBpZiAodGVtcG8gPj0gdGVtcG9NaW4gJiYgdGVtcG8gPD0gdGVtcG9NYXggJiYgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIDAsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdW5lIGNvbmRpdGlvbiAodGVtcG8gb3UgdG9uYWxpdMOpKSBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICB9IGVsc2UgaWYgKCh0ZW1wbyA+PSB0ZW1wb01pbiAmJiB0ZW1wbyA8PSB0ZW1wb01heCkgfHwgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgaWYgKCFHVUkuZHVwbGljYXRlc0FsbG93ZWQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpO1xuXG4gICAgICAgICAgLy8gU2kgbCdhcnRpc3RlIG4nYSBwYXMgw6l0w6kgcmVuY29udHLDqSBkYW5zIGxlcyBzdWdnZXN0aW9ucyBwcsOpY8OpZGVudGVzLi4uXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShhcnRpc3QsIGFydGlzdHMpID09IC0xKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goYXJ0aXN0KTtcbiAgICAgICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrcyA9IHNpbWlsYXJUcmFja3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHZhbG9yaXNhbnQgbGUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbywgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgVGVtcG9GaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFRlbXBvRmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSB2YWxvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIG5iUGVyZmVjdE1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgbmJUZW1wb01hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG9cbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8vIFBvdXIgY2hhcXVlIG1vcmNlYXUsIG9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcyBpbmRpc3BlbnNhYmxlc1xuICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgY3VycmVudFRlbXBvID0gdHJhY2suZ2V0VGVtcG8oKSxcbiAgICAgICAgICAgIHRlbXBvTWluID0gaGFybW9ueS50ZW1wb01pbigpLFxuICAgICAgICAgICAgdGVtcG9NYXggPSBoYXJtb255LnRlbXBvTWF4KCksXG4gICAgICAgICAgICBpc01hdGNoaW5nID0gKCQuaW5BcnJheSh0cmFjay5nZXRDYW1lbG90VGFnKCksIHJlZlRyYWNrLmdldEhhcm1vbmllcygpKSAhPSAtMSk7XG5cbiAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSByZW1wbGl0IHRvdXRlcyBsZXMgY29uZGl0aW9ucyBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICBpZiAoY3VycmVudFRlbXBvID49IHRlbXBvTWluICYmIGN1cnJlbnRUZW1wbyA8PSB0ZW1wb01heCAmJiBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgMCwgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdGVtcG8uLi5cbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50VGVtcG8gPj0gdGVtcG9NaW4gJiYgY3VycmVudFRlbXBvIDw9IHRlbXBvTWF4KSB7XG4gICAgICAgICAgICBuYlRlbXBvTWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0b25hbGl0w6kuLi5cbiAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG9cbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzICsgbmJUZW1wb01hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vIFNpIGxlcyBkb3VibG9ucyBuZSBzb250IHBhcyBhdXRvcmlzw6lzLCBvbiBmaWx0cmVcbiAgICAgIGlmICghR1VJLmR1cGxpY2F0ZXNBbGxvd2VkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhY2tzO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSB2YWxvcmlzYW50IGxhIHRvbmFsaXTDqS5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqSwgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wby5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBLZXlGaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIEtleUZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgdmFsb3Jpc2FudCBsYSB0b25hbGl0w6lcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBuYktleU1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgYXJ0aXN0cyA9IFtdLCAvLyBUb3VzIGxlcyBhcnRpc3RlcyByZW5jb250csOpcyBkYW5zIGxlcyByw6lzdWx0YXRzXG4gICAgICAgICAgdHJhY2tzID0gW10sIC8vIExlcyBtb3JjZWF1eCDDoCByZW52b3llciDDoCBsJ2lzc3VlIGR1IHRyaVxuICAgICAgICAgIHJlYXJyYW5nZSA9IGZ1bmN0aW9uKHJlbW92ZUluZGV4LCBpbnNlcnRJbmRleCwgdHJhY2spIHtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgICAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKGluc2VydEluZGV4LCAwLCB0cmFjayk7XG4gICAgICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgIGN1cnJlbnRUZW1wbyA9IHRyYWNrLmdldFRlbXBvKCksXG4gICAgICAgICAgICB0ZW1wb01pbiA9IGhhcm1vbnkudGVtcG9NaW4oKSxcbiAgICAgICAgICAgIHRlbXBvTWF4ID0gaGFybW9ueS50ZW1wb01heCgpLFxuICAgICAgICAgICAgaXNNYXRjaGluZyA9ICgkLmluQXJyYXkodHJhY2suZ2V0Q2FtZWxvdFRhZygpLCByZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXggJiYgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIDAsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRvbmFsaXTDqS4uLlxuICAgICAgICB9IGVsc2UgaWYgKGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iS2V5TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0ZW1wby4uLlxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXgpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6lcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzICsgbmJLZXlNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICBpZiAoIUdVSS5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgICAgYXJ0aXN0ID0gdHJhY2suZ2V0QXJ0aXN0KCk7XG5cbiAgICAgICAgICAvLyBTaSBsJ2FydGlzdGUgbidhIHBhcyDDqXTDqSByZW5jb250csOpIGRhbnMgbGVzIHN1Z2dlc3Rpb25zIHByw6ljw6lkZW50ZXMuLi5cbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGFydGlzdCwgYXJ0aXN0cykgPT0gLTEpIHtcbiAgICAgICAgICAgIGFydGlzdHMucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgdHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2tzID0gc2ltaWxhclRyYWNrcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRyYWNrcztcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCwgY29tcGF0aWJsZXMgb3Ugbm9uLCBzb250IHJhbmfDqXMgZHUgQlBNIGxlIHBsdXMgbGVudCBhdSBCUE0gbGUgcGx1cyByYXBpZGUuXG4gICAqXG4gICAqIEBjbGFzcyBBc2NlbmRpbmdUZW1wb1xuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIEFzY2VuZGluZ1RlbXBvOiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHJldHVybiBfLnNvcnRCeShzaW1pbGFyVHJhY2tzLCAnX3RlbXBvJyk7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIGTDqWNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXgsIGNvbXBhdGlibGVzIG91IG5vbiwgc29udCByYW5nw6lzIGR1IEJQTSBsZSBwbHVzIHJhcGlkZSBhdSBCUE0gbGUgcGx1cyBsZW50LlxuICAgKlxuICAgKiBAY2xhc3MgRGVzY2VuZGluZ1RlbXBvXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgRGVzY2VuZGluZ1RlbXBvOiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgZMOpY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHNpbWlsYXJUcmFja3MgPSBfLnNvcnRCeShzaW1pbGFyVHJhY2tzLCAnX3RlbXBvJyk7XG4gICAgICByZXR1cm4gc2ltaWxhclRyYWNrcy5yZXZlcnNlKCk7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gYWxnb3JpdGhtZSBmaWN0aWYgbidlZmZlY3R1YW50IGF1Y3VuIHRyaS5cbiAgICogQ2V0dGUgY2xhc3NlIG4nZXhpc3RlIHF1ZSBwb3VyIGRlcyByYWlzb25zIHPDqW1hbnRpcXVlcy5cbiAgICpcbiAgICogQGNsYXNzIE5vbmVcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBOb25lOiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBuJ2FwcGxpcXVhbnQgYXVjdW4gdHJpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgcmV0dXJuIHNpbWlsYXJUcmFja3M7XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbGEgY2xhc3NlIFN0cmF0ZWd5XG4gKi9cblNvcnRpbmcuU3RyYXRlZ3kucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRBbGdvcml0aG1cbiAgICogQHJldHVybiB7T2JqZWN0fSBMJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKi9cbiAgZ2V0QWxnb3JpdGhtOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxnb3JpdGhtO1xuICB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsZ29yaXRobVxuICAgKiBAcGFyYW0ge09iamVjdH0gYWxnb3JpdGhtIExlIG5vdXZlbCBhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICovXG4gIHNldEFsZ29yaXRobTogZnVuY3Rpb24oYWxnb3JpdGhtKSB7XG4gICAgdGhpcy5fYWxnb3JpdGhtID0gYWxnb3JpdGhtO1xuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgYWJzdHJhaXRlIGRlIHRyaS5cbiAgICogQ2V0dGUgZGVybmnDqHJlIHNlIGNvbnRlbnRlIGRlIGTDqWzDqWd1ZXIgbGUgdHJpIMOgIHVuZSBtw6l0aG9kZSBjb25jcsOodGUuXG4gICAqXG4gICAqIEBtZXRob2Qgc29ydFxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6ksIHNlbG9uIGwnYWxnb3JpdGhtZSBjb3VyYW50XG4gICAqL1xuICBzb3J0OiBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgIHJldHVybiB0aGlzLl9hbGdvcml0aG0uc29ydChyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9Tb3J0aW5nLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogIE9iamV0cyB1dGlsZXMgcG91ciBsZSB0cmFpdGVtZW50IGRlcyByw6lwb25zZXMgdmVuYW50IGQnRWNobyBOZXN0XG4gKlxuICogQG1vZHVsZSBWb2NhYnVsYXJ5XG4gKiBAY2xhc3MgVm9jYWJ1bGFyeVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gVm9jYWJ1bGFyeSA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogTW9kZSAobWFqZXVyIGV0IG1pbmV1cilcbiAqXG4gKiBAcHJvcGVydHkgbW9kZXNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5Lm1vZGVzID0ge1xuICAgIFwiMFwiOiBcIm1pbmV1clwiLFxuICAgIFwiMVwiOiBcIm1hamV1clwiXG59O1xuXG4vKipcbiAqIE5vdGVzLCBzZWxvbiBsYSBub3RhdGlvbiBzeWxsYWJpcXVlXG4gKlxuICogQHByb3BlcnR5IG5vdGVzXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5rZXlzID0ge1xuICAgIFwiMFwiOiBcImRvXCIsXG4gICAgXCIxXCI6IFwiZG8jXCIsXG4gICAgXCIyXCI6IFwicsOpXCIsXG4gICAgXCIzXCI6IFwibWliXCIsXG4gICAgXCI0XCI6IFwibWlcIixcbiAgICBcIjVcIjogXCJmYVwiLFxuICAgIFwiNlwiOiBcImZhI1wiLFxuICAgIFwiN1wiOiBcInNvbFwiLFxuICAgIFwiOFwiOiBcImxhYlwiLFxuICAgIFwiOVwiOiBcImxhXCIsXG4gICAgXCIxMFwiOiBcInNpYlwiLFxuICAgIFwiMTFcIjogXCJzaVwiXG59O1xuXG4vKipcbiAqIE1peCBoYXJtb25pcXVlIChtb2RlICsgbm90ZSA9IHVuIHRhZyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90KVxuICpcbiAqIEBwcm9wZXJ0eSBoYXJtb25pY01peFxuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkuaGFybW9uaWNNaXggPSB7XG4gICAgXCJtaW5ldXJcIjoge1xuICAgICAgICBcImRvXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImRvI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEyQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwicsOpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiN0FcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjJBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjlBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjRBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYSNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMUFcIlxuICAgICAgICB9LFxuICAgICAgICBcInNvbFwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjZBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI4QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2liXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiM0FcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTBBXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJtYWpldXJcIjoge1xuICAgICAgICBcImRvXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOEJcIlxuICAgICAgICB9LFxuICAgICAgICBcImRvI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjNCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyw6lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMEJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjVCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEyQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI3QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmEjXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMkJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNvbFwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjlCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI0QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMUJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjZCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjFCXCJcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVHJhZHVjdGlvbiBkZSBsYSByb3VlIGRlIENhbWVsb3RcbiAqXG4gKiBAcHJvcGVydHkgY2FtZWxvdFdoZWVsXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5jYW1lbG90V2hlZWwgPSB7XG4gICAgXCIxQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEtRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMUFcIiwgXCIxMkFcIiwgXCIyQVwiLCBcIjFCXCJdXG4gICAgfSxcbiAgICBcIjJBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRS1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIyQVwiLCBcIjFBXCIsIFwiM0FcIiwgXCIyQlwiXVxuICAgIH0sXG4gICAgXCIzQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkItRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiM0FcIiwgXCIyQVwiLCBcIjRBXCIsIFwiM0JcIl1cbiAgICB9LFxuICAgIFwiNEFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI0QVwiLCBcIjNBXCIsIFwiNUFcIiwgXCI0QlwiXVxuICAgIH0sXG4gICAgXCI1QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkMgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjVBXCIsIFwiNEFcIiwgXCI2QVwiLCBcIjVCXCJdXG4gICAgfSxcbiAgICBcIjZBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNkFcIiwgXCI1QVwiLCBcIjdBXCIsIFwiNkJcIl1cbiAgICB9LFxuICAgIFwiN0FcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJEIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI3QVwiLCBcIjZBXCIsIFwiOEFcIiwgXCI3QlwiXVxuICAgIH0sXG4gICAgXCI4QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjhBXCIsIFwiN0FcIiwgXCI5QVwiLCBcIjhCXCJdXG4gICAgfSxcbiAgICBcIjlBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRSBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOUFcIiwgXCI4QVwiLCBcIjEwQVwiLCBcIjlCXCJdXG4gICAgfSxcbiAgICBcIjEwQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkIgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEwQVwiLCBcIjlBXCIsIFwiMTFBXCIsIFwiMTBCXCJdXG4gICAgfSxcbiAgICBcIjExQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkcgRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTFBXCIsIFwiMTBBXCIsIFwiMTJBXCIsIFwiMTFCXCJdXG4gICAgfSxcbiAgICBcIjEyQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQtRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTJBXCIsIFwiMTFBXCIsIFwiMUFcIiwgXCIxMkJcIl1cbiAgICB9LFxuICAgIFwiMUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJCIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxQlwiLCBcIjEyQlwiLCBcIjJCXCIsIFwiMUFcIl1cbiAgICB9LFxuICAgIFwiMkJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGLVNoYXJwIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIyQlwiLCBcIjFCXCIsIFwiM0JcIiwgXCIyQVwiXVxuICAgIH0sXG4gICAgXCIzQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiM0JcIiwgXCIyQlwiLCBcIjRCXCIsIFwiM0FcIl1cbiAgICB9LFxuICAgIFwiNEJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJBLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjRCXCIsIFwiM0JcIiwgXCI1QlwiLCBcIjRBXCJdXG4gICAgfSxcbiAgICBcIjVCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRS1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI1QlwiLCBcIjRCXCIsIFwiNkJcIiwgXCI1QVwiXVxuICAgIH0sXG4gICAgXCI2QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkItRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNkJcIiwgXCI1QlwiLCBcIjdCXCIsIFwiNkFcIl1cbiAgICB9LFxuICAgIFwiN0JcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI3QlwiLCBcIjZCXCIsIFwiOEJcIiwgXCI3QVwiXVxuICAgIH0sXG4gICAgXCI4QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkMgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjhCXCIsIFwiN0JcIiwgXCI5QlwiLCBcIjhBXCJdXG4gICAgfSxcbiAgICBcIjlCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOUJcIiwgXCI4QlwiLCBcIjEwQlwiLCBcIjlBXCJdXG4gICAgfSxcbiAgICBcIjEwQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEwQlwiLCBcIjlCXCIsIFwiMTFCXCIsIFwiMTBBXCJdXG4gICAgfSxcbiAgICBcIjExQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjExQlwiLCBcIjEwQlwiLCBcIjEyQlwiLCBcIjExQVwiXVxuICAgIH0sXG4gICAgXCIxMkJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMkJcIiwgXCIxMUJcIiwgXCIxQlwiLCBcIjEyQVwiXVxuICAgIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9Wb2NhYnVsYXJ5LmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIEltcG9ydCBkZXMgbW9kdWxlc1xudmFyIFZvY2FidWxhcnkgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1ZvY2FidWxhcnkuanMnKSxcbiAgICBJdGVyYXRvciA9IHJlcXVpcmUoJy4uL21vZHVsZXMvSXRlcmF0b3IuanMnKSxcbiAgICBNdXNpYyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvTXVzaWMuanMnKSxcbiAgICBBamF4ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9BamF4LmpzJyksXG4gICAgR1VJID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9HVUkuanMnKSxcbiAgICBTb3J0aW5nID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9Tb3J0aW5nLmpzJyksXG4gICAgUGxheWxpc3QgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1BsYXlsaXN0Jyk7XG5cbi8vIFZhcmlhYmxlcyBkaXZlcnNlc1xudmFyIHNpbWlsYXJUcmFja3MgPSBbXSxcbiAgICByZWZUcmFjayxcbiAgICBoYXJtb255O1xuXG4vLyBTw6lsZWN0ZXVycyBqUXVlcnlcbnZhciAkc2VhcmNoLFxuICAgICRvd2wsXG4gICAgJGhhcm1vbmljVHJhY2tzO1xuXG4vLyBTdHJhdMOpZ2llcyBkZSB0cmkgZGVzIG1vcmNlYXV4XG52YXIgc29ydGluZ1N0cmF0ZWd5ID0gbmV3IFNvcnRpbmcuU3RyYXRlZ3koKSxcbiAgICBkZWZhdWx0U29ydGluZyA9IG5ldyBTb3J0aW5nLkRlZmF1bHQoKSxcbiAgICB0ZW1wb0ZpcnN0U29ydGluZyA9IG5ldyBTb3J0aW5nLlRlbXBvRmlyc3QoKSxcbiAgICBrZXlGaXJzdFNvcnRpbmcgPSBuZXcgU29ydGluZy5LZXlGaXJzdCgpLFxuICAgIGFzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkFzY2VuZGluZ1RlbXBvKCksXG4gICAgZGVzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkRlc2NlbmRpbmdUZW1wbygpLFxuICAgIG5vU29ydGluZyA9IG5ldyBTb3J0aW5nLk5vbmUoKTtcblxuLy8gUG9pbnQgZCdlbnRyw6llIGRlIGwnYXBwbGljYXRpb25cbiQoIGRvY3VtZW50ICkucmVhZHkoIGluaXQgKTtcblxuLy8gSW5pdGlhbGlzYXRpb24gZGUgbCdhcHBsaWNhdGlvblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIEdVSS5pbml0KCk7XG5cbiAgICAkc2VhcmNoID0gJCggXCIjc2VhcmNoXCIgKTtcbiAgICAkb3dsID0gJCggXCIjdHJhY2tzXCIgKTtcbiAgICAkaGFybW9uaWNUcmFja3MgPSAkKCBcIiNoYXJtb25pYy10cmFja3NcIiApO1xuXG4gICAgJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgIHRyYWNrQXV0b2NvbXBsZXRlKCk7XG4gICAgICB2YXIga2V5d29yZCA9ICQoIHRoaXMgKS52YWwoKTtcbiAgICAgIGlmIChrZXl3b3JkLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5mYWRlT3V0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAgIGdvKCk7XG5cbn1cblxuLy8gR2VzdGlvbiBkZSBsJ2F1dG9jb21wbMOpdGlvbiBkYW5zIGxlIGNoYW1wIGRlIHJlY2hlcmNoZVxuZnVuY3Rpb24gdHJhY2tBdXRvY29tcGxldGUoKSB7XG5cbiAgLy8gQXV0b2NvbXBsw6l0aW9uIE9LXG4gIGlmIChHVUkuYXV0b2NvbXBsZXRlQWxsb3dlZCkge1xuICAgICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHtcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiggcmVxdWVzdCwgcmVzcG9uc2UgKSB7XG5cbiAgICAgICAgICB2YXIga2V5d29yZCA9ICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkudmFsKCk7XG5cbiAgICAgICAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgICAgICAgcmVxdWVzdC5hZGRQYXJhbShcInFcIiwga2V5d29yZCk7XG4gICAgICAgICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICAgICAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICQoIFwiI2F1dG9jb21wbGV0ZVwiICkuZW1wdHkoKTtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlc3BvbnNlLmRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHRyYWNrID0gcmVzcG9uc2UuZGF0YVtpXTtcbiAgICAgICAgICAgICAgaHRtbCArPSBHVUkudGVtcGxhdGUoXCJhdXRvY29tcGxldGVcIiwgdHJhY2ssIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICBzZWxlY3RlZFRyYWNrKFwiYXV0b2NvbXBsZXRlLVwiICsgdHJhY2suaWQsIHRyYWNrLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoIFwiI2F1dG9jb21wbGV0ZVwiICkuYXBwZW5kKCBodG1sICk7XG4gICAgICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1pbkxlbmd0aDogM1xuICAgICAgfSk7XG4gIH0gZWxzZSB7IC8vIFBhcyBkJ2F1dG9jb21wbMOpdGlvblxuICAgICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHsgc291cmNlOiBbXSB9KTtcbiAgfVxuXG59XG5cbi8vIMOAIGxhIHNvdW1pc3Npb24gZHUgZm9ybXVsYWlyZSwgb24gcsOpY3Vww6hyZSBkZXMgbW9yY2VhdXggc3VyIERlZXplclxuZnVuY3Rpb24gZ28oKSB7XG4gICRzZWFyY2guc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICgkKCB3aW5kb3cgKS53aWR0aCgpID4gNjAwKSB7XG4gICAgICAgIHNlYXJjaFRyYWNrcygpO1xuICAgICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiQ2hvaXNpc3NleiB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXCIsIDUpO1xuICAgICAgICAkc2VhcmNoLmZpbmQoIFwiaW5wdXRcIiApLnZhbCggXCJcIiApO1xuICAgICAgfVxuICB9KTtcbn1cblxuLy8gR2VzdGlvbiBkZXMgYWxnb3JpdGhtZXMgZGUgdHJpIGRlcyBtb3JjZWF1eFxuZnVuY3Rpb24gc2V0U29ydGluZ1N0cmF0ZWd5KCkge1xuICBzd2l0Y2ggKEdVSS5zZWxlY3RlZFNvcnRpbmcpIHtcbiAgICBjYXNlIFwidGVtcG9GaXJzdFwiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobSh0ZW1wb0ZpcnN0U29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwia2V5Rmlyc3RcIjpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0oa2V5Rmlyc3RTb3J0aW5nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhc2NUZW1wb1wiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShhc2NUZW1wb1NvcnRpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImRlc2NUZW1wb1wiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZXNjVGVtcG9Tb3J0aW5nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJub25lXCI6XG4gICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKG5vU29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZWZhdWx0U29ydGluZyk7XG4gIH1cbn1cblxuLy8gUmVjaGVyY2hlIGRlIG1vcmNlYXV4IHN1ciBEZWV6ZXJcbmZ1bmN0aW9uIHNlYXJjaFRyYWNrcygpIHtcblxuICAgIC8vIFLDqWluaXRpYWxpc2F0aW9uIGRlIGxhIHJlY2hlcmNoZVxuICAgIGlmICgkb3dsLmlzKCBcIjp2aXNpYmxlXCIgKSkgJG93bC5lbXB0eSgpO1xuICAgIGlmIChzaW1pbGFyVHJhY2tzLmxlbmd0aCA+IDApIHNpbWlsYXJUcmFja3MgPSBbXTtcbiAgICBHVUkuY2xlYW5Ob3RpZmljYXRpb25zKCk7XG5cbiAgICB2YXIga2V5d29yZCA9ICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkudmFsKCk7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcInFcIiwga2V5d29yZCk7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDIwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgc3VyIGNoYXF1ZSBtb3JjZWF1XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2sgPSByZXNwb25zZS5kYXRhW2ldO1xuICAgICAgICAgICAgLy8gT24gYWZmaWNoZSBsZXMgcsOpc3VsdGF0c1xuICAgICAgICAgICAgdmFyIGh0bWwgPSBHVUkudGVtcGxhdGUoXCJiYXNlLXRyYWNrXCIsIHRyYWNrLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICRvd2wuZGF0YSgnb3dsQ2Fyb3VzZWwnKS5hZGRJdGVtKGh0bWwpO1xuICAgICAgICAgICAgaWYgKCEkb3dsLmlzKCBcIjp2aXNpYmxlXCIgKSkge1xuICAgICAgICAgICAgICAkb3dsLmZhZGVJbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT24gYWpvdXRlIHVuIMOpY291dGV1ciBkJ8OpdsOpbmVtZW50IGRlIHR5cGUgY2xpYyBwb3VyIGNoYXF1ZSBtb3JjZWF1XG4gICAgICAgICAgICBzZWxlY3RlZFRyYWNrKFwic3VibWl0LVwiICsgdHJhY2suaWQsIHRyYWNrLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vLyBHZXN0aW9uIGR1IGNsaWMgc3VyIHVuIMOpbMOpbWVudCBkZSBsYSBsaXN0ZSBkZSBzdWdnZXN0aW9uc1xuZnVuY3Rpb24gc2VsZWN0ZWRUcmFjayhlbHRJZCwgdHJhY2tJZCkge1xuICAgICQoIGRvY3VtZW50ICkub24oIFwiY2xpY2tcIiwgXCIjXCIgKyBlbHRJZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEFmZmVjdGF0aW9uIGQndW4gYWxnb3JpdGhtZSBkZSB0cmlcbiAgICAgICAgc2V0U29ydGluZ1N0cmF0ZWd5KCk7XG4gICAgICAgIC8vIE9uIGVmZmFjZSBsZXMgbm90aWZpY2F0aW9uc1xuICAgICAgICBHVUkuY2xlYW5Ob3RpZmljYXRpb25zKCk7XG4gICAgICAgIC8vIE9uIGFmZmljaGUgdW4gbG9hZGVyIHBvdXIgZmFpcmUgcGF0aWVudGVyIGwnaW50ZXJuYXV0ZVxuICAgICAgICBHVUkubG9hZGluZy5vbigpO1xuICAgICAgICAvLyBPbiByw6ljdXDDqHJlIGxlIHLDqXN1bcOpIGF1ZGlvIGR1IG1vcmNlYXUgc8OpbGVjdGlvbm7DqSBzdXIgRWNobyBOZXN0XG4gICAgICAgIGdldEluaXRpYWxBdWRpb1N1bW1hcnkodHJhY2tJZCk7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgbGVzIGluZm9ybWF0aW9ucyBkw6l0YWlsbMOpZXMgZHUgbW9yY2VhdSBzdXIgRGVlemVyXG4gICAgICAgIGdldFRyYWNrSW5mb3ModHJhY2tJZCk7XG4gICAgfSk7XG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgbGUgbW9yY2VhdSBzw6lsZWN0aW9ubsOpIChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRJbml0aWFsQXVkaW9TdW1tYXJ5KHRyYWNrSWQpIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpLmdldEFqYXhSZXF1ZXN0KFwiZWNob25lc3RcIiwgXCIvdHJhY2svcHJvZmlsZVwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiaWRcIiwgXCJkZWV6ZXI6dHJhY2s6XCIgKyB0cmFja0lkKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKGZpbmFsKSB7XG4gICAgICAgIC8vIExlIG1vcmNlYXUgZXN0LWlsIHRyb3V2w6kgc3VyIEVjaG8gTmVzdCDDoCBwYXJ0aXIgZGUgbCdpZGVudGlmaWFudCBEZWV6ZXIgP1xuICAgICAgICBpZiAoZmluYWwucmVzcG9uc2UudHJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlRyb3V2w6kgc3VyIEVjaG8gTmVzdCAhXCIsIDMpO1xuICAgICAgICAgICAgLy8gTGUgbW9yY2VhdSB0cm91dsOpIHN1ciBFY2hvIE5lc3QgYS10LWlsIHVuIHLDqXN1bcOpIGF1ZGlvID9cbiAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgICAgICAgLy8gT24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9ybWF0aW9ucyB1dGlsZXMgZHUgbW9yY2VhdVxuICAgICAgICAgICAgICAgIHZhciB0cmFjayA9IGZpbmFsLnJlc3BvbnNlLnRyYWNrLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5hcnRpc3QsXG4gICAgICAgICAgICAgICAgICAgIGtleUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5rZXksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1trZXlJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGVJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkubW9kZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IFZvY2FidWxhcnkubW9kZXNbbW9kZUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcG8gPSBNYXRoLnJvdW5kKHRyYWNrLmF1ZGlvX3N1bW1hcnkudGVtcG8pO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gY29uc3RydWl0IGxlIHByb2ZpbCBkdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICAgICAgICAgICAgYnVpbGRSZWZUcmFja1Byb2ZpbGUodHJhY2tJZCwgdGl0bGUsIGFydGlzdCwgXCJcIiwga2V5LCBtb2RlLCB0ZW1wbyk7XG5cbiAgICAgICAgICAgICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiwqsgXCIgKyB0aXRsZSArIFwiIMK7IHBhciBcIiArIGFydGlzdCwgMCk7XG4gICAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIlRvbmFsaXTDqSA6IFwiICsga2V5ICsgXCIgXCIgKyBtb2RlLCAwKTtcbiAgICAgICAgICAgICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiVGVtcG8gOiBcIiArIHRlbXBvICsgXCIgQlBNXCIsIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnVpbGRSZWZUcmFja1Byb2ZpbGUodHJhY2tJZCwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgXCJcIiwgMCk7XG4gICAgICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiTGUgcsOpc3Vtw6kgYXVkaW8gZGUgY2UgbW9yY2VhdSBuJ2VzdCBwYXMgZGlzcG9uaWJsZSBzdXIgRWNobyBOZXN0LlwiLCAxMCk7XG4gICAgICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiU3VnZ2VzdGlvbiBoYXJtb25pcXVlIGltcG9zc2libGVcIiwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUmVmVHJhY2tQcm9maWxlKHRyYWNrSWQsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIDApO1xuICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiQ2UgbW9yY2VhdSBuJ2EgcGFzIMOpdMOpIHRyb3V2w6kgc3VyIEVjaG8gTmVzdC5cIiwgMTApO1xuICAgICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiU3VnZ2VzdGlvbiBoYXJtb25pcXVlIGltcG9zc2libGVcIiwgMTApO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8vIENvbnN0cnVjdGlvbiBkdSBwcm9maWwgZHUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuZnVuY3Rpb24gYnVpbGRSZWZUcmFja1Byb2ZpbGUoaWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvKSB7XG5cbiAgICAvLyBPbiBkw6l0ZXJtaW5lIGxlIHRhZyBkZSBDYW1lbG90IGV0IGxlcyBoYXJtb25pZXMgw6AgcGFydGlyIGRlcyBpbmZvcyDDoCBkaXNwb3NpdGlvblxuICAgIGlmICh0aXRsZSAhPSBcIlwiKSB7XG4gICAgICB2YXIgY2FtZWxvdFRhZyA9IFZvY2FidWxhcnkuaGFybW9uaWNNaXhbbW9kZV1ba2V5XS50YWcsXG4gICAgICAgICAgaGFybW9uaWVzID0gVm9jYWJ1bGFyeS5jYW1lbG90V2hlZWxbY2FtZWxvdFRhZ10ubWF0Y2hlcztcbiAgICB9XG5cbiAgICByZWZUcmFjayA9IG5ldyBNdXNpYy5UcmFjayhpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8sIGNhbWVsb3RUYWcsIGhhcm1vbmllcyk7XG4gICAgYnVpbGRIYXJtb255UHJvZmlsZShyZWZUcmFjayk7XG5cbn1cblxuLy8gQ29uc3RydWN0aW9uIGR1IHByb2ZpbCBkZSBsJ2hhcm1vbmllIHJlY2hlcmNow6llXG5mdW5jdGlvbiBidWlsZEhhcm1vbnlQcm9maWxlKHRyYWNrKSB7XG4gICAgaGFybW9ueSA9IG5ldyBNdXNpYy5IYXJtb255KHRyYWNrLCBHVUkudGVtcG9WYXJpYXRpb24sIHRydWUpO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIHN1ciB1biBtb3JjZWF1LCBub3RhbW1lbnQgcG91ciBhdm9pciBsJ2lkIGRlIGwnYXJ0aXN0ZSAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0VHJhY2tJbmZvcyh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi90cmFjay9cIiArIHRyYWNrSWQpO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBudWxsKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgZ2V0U2ltaWxhckFydGlzdHMocmVzcG9uc2UuYXJ0aXN0LmlkKTtcbiAgICB9XG5cbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGFydGlzdGVzIHNpbWlsYWlyZXMgKERlZXplcilcbmZ1bmN0aW9uIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9hcnRpc3QvXCIgKyBhcnRpc3RJZCArIFwiL3JlbGF0ZWRcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBhcnRpc3RzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwicmVxdWVzdF9tZXRob2RcIjpcImdldFwiLFxuICAgICAgICAgICAgICAgIFwicmVsYXRpdmVfdXJsXCI6XCJhcnRpc3QvXCIgKyByZXNwb25zZS5kYXRhW2ldLmlkICsgXCIvdG9wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFydGlzdHMgPSBKU09OLnN0cmluZ2lmeShhcnRpc3RzKTtcbiAgICAgICAgZ2V0VG9wVHJhY2tzKGFydGlzdHMpO1xuICAgIH1cblxufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgY2hhbnNvbnMgbGVzIHBsdXMgcG9wdWxhaXJlcyBkZSBjaGFxdWUgYXJ0aXN0ZSBzaW1pbGFpcmUgKERlZXplcilcbmZ1bmN0aW9uIGdldFRvcFRyYWNrcyhzaW1pbGFyQXJ0aXN0cykge1xuXG4gICAgLy8gUGFyYW3DqXRyYWdlIGV0IGVudm9pIGRlIGxhIHJlcXXDqnRlXG4gICAgcmVxdWVzdCA9IG5ldyBBamF4LlJlcXVlc3RGYWN0b3J5KCkuZ2V0QWpheFJlcXVlc3QoXCJkZWV6ZXJcIiwgXCIvYmF0Y2hcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibWV0aG9kc1wiLCBzaW1pbGFyQXJ0aXN0cyk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJ0aXN0ID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0W2ldO1xuICAgICAgICAgICAgJC5lYWNoKGFydGlzdC5kYXRhLCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcFRyYWNrID0gaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgY292ZXIgPSBpdGVtLmFsYnVtLmNvdmVyX21lZGl1bTtcblxuICAgICAgICAgICAgICAgIGdldFRvcFRyYWNrSW5mb3ModG9wVHJhY2suaWQsIGNvdmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgdG91cyBsZXMgdG9wIG1vcmNlYXV4IChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRUb3BUcmFja0luZm9zKHRvcFRyYWNrSWQsIGNvdmVyKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImlkXCIsIFwiZGVlemVyOnRyYWNrOlwiICsgdG9wVHJhY2tJZCk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBJbCBmYXV0IHF1ZSBsZXMgbW9yY2VhdXggc29pZW50IHRyb3V2w6lzIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIElsIGZhdXQgcXVlIGxlcyBtb3JjZWF1eCBwb3Nzw6hkZW50IHVuIHLDqXN1bcOpIGF1ZGlvIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgICAgICAgLy8gIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgdXRpbGVzXG4gICAgICAgICAgICAgICAgdmFyIHRyYWNrID0gZmluYWwucmVzcG9uc2UudHJhY2ssXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdHJhY2sudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmFydGlzdCxcbiAgICAgICAgICAgICAgICAgICAga2V5SW5kZXggPSB0cmFjay5hdWRpb19zdW1tYXJ5LmtleSxcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gVm9jYWJ1bGFyeS5rZXlzW2tleUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5tb2RlLFxuICAgICAgICAgICAgICAgICAgICBtb2RlID0gVm9jYWJ1bGFyeS5tb2Rlc1ttb2RlSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbyA9IE1hdGgucm91bmQodHJhY2suYXVkaW9fc3VtbWFyeS50ZW1wbyksXG4gICAgICAgICAgICAgICAgICAgIGNhbWVsb3RUYWcgPSBWb2NhYnVsYXJ5Lmhhcm1vbmljTWl4W21vZGVdW2tleV0udGFnO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gYWxpbWVudGUgdW4gdGFibGVhdSBkZSBtb3JjZWF1eCBwb3VyIGRlcyB0cmlzIHVsdMOpcmlldXJzXG4gICAgICAgICAgICAgICAgdmFyIHRvcFRyYWNrID0gbmV3IE11c2ljLlRyYWNrKHRvcFRyYWNrSWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBbXSk7XG4gICAgICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5wdXNoKHRvcFRyYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vLyBMb3JzcXVlIHNlIHRlcm1pbmVudCB0b3V0ZXMgbGVzIHJlcXXDqnRlcyBBamF4IGVuIGNvdXJzLi4uXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKGZ1bmN0aW9uKCkge1xuICAvLyAuLi4gb24gZW5sw6h2ZSBsZSBsb2FkZXIgdnUgcXVlIGMnZXN0IGxhIGZpbiBkZXMgcmVxdcOqdGVzLi4uXG4gIEdVSS5sb2FkaW5nLm9mZigpO1xuICAvLyAuLi4gZXQgb24gbGFuY2UgbGUgdHJpIGRlcyBtb3JjZWF1eCByw6ljdXDDqXLDqXMgKHMnaWwgeSBlbiBhKVxuICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgc2ltaWxhclRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKTtcbiAgICBkaXNwbGF5VHJhY2tzKHNpbWlsYXJUcmFja3MpO1xuICB9XG59KTtcblxuLy8gQWZmaWNoYWdlIGRlcyBtb3JjZWF1eCBzZWxvbiB1biBvcmRyZSBkw6l0ZXJtaW7DqSBwYXIgbGUgdHJpXG5mdW5jdGlvbiBkaXNwbGF5VHJhY2tzKHRyYWNrcykge1xuXG4gIEdVSS5zY3JvbGwuZGVzdHJveSgkaGFybW9uaWNUcmFja3MpO1xuICAkaGFybW9uaWNUcmFja3MuZW1wdHkoKTtcblxuICB2YXIgaHRtbCA9IEdVSS50ZW1wbGF0ZShcImhlbHBcIiwgbnVsbCwgbnVsbCwgbnVsbCk7XG5cbiAgLy8gSXTDqXJhdGlvbnMgc3VyIG5vdHJlIGNvbGxlY3Rpb24gZGUgbW9yY2VhdXhcbiAgaXRlcmF0b3IgPSBuZXcgSXRlcmF0b3IodHJhY2tzKTtcbiAgd2hpbGUgKGl0ZXJhdG9yLmhhc05leHQoKSkge1xuXG4gICAgdmFyIHRyYWNrID0gaXRlcmF0b3IubmV4dCgpLFxuICAgICAgICBpc1RlbXBvQ29tcGF0aWJsZSA9IGZhbHNlLFxuICAgICAgICBpc0tleUNvbXBhdGlibGUgPSBmYWxzZTtcblxuICAgIC8vIE9uIHNpZ25hbGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlcm1lcyBkZSB0ZW1wb1xuICAgIGlmICh0cmFjay5nZXRUZW1wbygpID49IGhhcm1vbnkudGVtcG9NaW4oKSAmJiB0cmFjay5nZXRUZW1wbygpIDw9IGhhcm1vbnkudGVtcG9NYXgoKSkge1xuICAgICAgaXNUZW1wb0NvbXBhdGlibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIE9uIHNpZ25hbGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlcm1lcyBkZSB0b25hbGl0w6lcbiAgICBpZiAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKSB7XG4gICAgICBpc0tleUNvbXBhdGlibGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGh0bWwgKz0gR1VJLnRlbXBsYXRlKFwiaGFybW9uaWMtdHJhY2tcIiwgdHJhY2ssIGlzVGVtcG9Db21wYXRpYmxlLCBpc0tleUNvbXBhdGlibGUpO1xuXG4gIH1cblxuICAkaGFybW9uaWNUcmFja3MuYXBwZW5kKGh0bWwpO1xuICBHVUkuc2Nyb2xsLnJlc2V0KCRoYXJtb25pY1RyYWNrcyk7XG4gIEdVSS5kaXNwbGF5RmluYWxUcmFja2xpc3QoKTtcblxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfODhkZmQyYTcuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIl19
