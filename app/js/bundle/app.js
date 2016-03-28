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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Ajax.js","/../modules")
},{"+7ZJp0":14,"buffer":11}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Player = require('./Player.js'),
    Playlist = require('./Playlist.js'),
    Sorting = require('./Sorting.js'),
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
   * Attribut indiquant si la recherche est autorisée
   *
   * @property searchAllowed
   * @type {Boolean}
   * @default true
   */
  searchAllowed: true,
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
   * Attribut indiquant si les sidebars ont été initialisées
   *
   * @property sidebarInitialized
   * @type {Boolean}
   * @default false
   */
  sidebarInitialized: false,
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
    GUI.menu.configSidebar("#playlist", "blue");
    GUI.menu.configSidebar("#favorites", "red");
    GUI.menu.configSidebar("#atmospheres", "green");
    GUI.menu.configSidebar("#harmonic-tracks", "violet");
    GUI.menu.configSidebar("#user", "maroon");
    GUI.scroll.init();
    GUI.playlist.retrieve();
    GUI.player = Player.getPlayer();
    GUI.player.init();
    GUI.playlist.autochange();
    GUI.account.status();
  },
  /**
   * Hacks CSS
   *
   * @method css
   */
  css: function() {
    $( ".pusher" ).css("height", "100%");
    if ($( window ).width() < 600) {
      $( "#menu" ).switchClass( "five", "four" );
      GUI.soundAllowed = false;
    } else {
      $( "#menu" ).switchClass( "four", "five" );
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
      // Semantic UI
      $( "[data-title != ''], [data-content != '']" ).popup();
      // jQuery UI
      $( document ).tooltip({
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
                        [".toggle-menu", "click", GUI.menu.toggleSidebar],
                        ["#playlist-btn", "click", GUI.menu.toggleSidebar],
                        ["#favorites-btn", "click", GUI.menu.toggleSidebar],
                        ["#atmospheres-btn", "click", GUI.menu.toggleSidebar],
                        ["#harmonic-tracks-btn", "click", GUI.menu.toggleSidebar],
                        ["#user-btn", "click", GUI.menu.toggleSidebar],
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
                            [".next-btn", "click", GUI.playlist.next],
                            ["#playlist", "trackChanged", GUI.playlist.icon],
                            ["#playlist", "trackRemoved", GUI.playlist.removeTrack],
                            ["#playlist-warning", "click", GUI.playlist.removeWarning]
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
                        ["#request", "click", GUI.search.warning],
                        ["#toggle-carousel", "click", GUI.misc.toggleCarousel],
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

    var html = "",
        artistName = "",
        maxStringLength = 0;

    if (type == "base-track") { // Morceau de base

      artistName = track.getArtist();
      maxStringLength = 100;

      // Si le nom de l'artiste est exagérément long, on le tronque à l'affichage
      if (artistName.length > maxStringLength) {
        artistName = artistName.substr(0, maxStringLength) + " ...";
      }

      html += '<div class="track" itemscope itemtype="https://schema.org/MusicRecording">';
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

      artistName = track.getArtist();
      maxStringLength = 100;

      var tempoCssClass = "red",
          tonalityCssClass = "red";

      // On gère le cas où le nom de l'artiste est exagérément long
      if (artistName.length > maxStringLength) {
        artistName = artistName.substr(0, maxStringLength) + " ...";
      }

      // On signale les morceaux compatibles
      if (isTempoCompatible) { tempoCssClass = "green"; }
      if (isKeyCompatible) { tonalityCssClass = "green"; }

      html += '<a class="harmonic-track" itemscope itemtype="https://schema.org/MusicComposition">';
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

      html += '<div id="autocomplete-' + track.getId() + '">';
      html += ' <strong>' + track.getTitle() + '</strong><br>';
      html += ' <em>' + track.getArtist() + '</em>';
      html += '</div>';

      return html;

    } else { // Case d'aide

      html += '<a class="item title">';
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
    var notification = null;
    if (GUI.notifAllowed) {
      switch (type) {
        case "success":
          notification = alertify.success(message, timer);
          break;
        case "error":
          notification = alertify.error(message, timer);
          break;
        case "warning":
          notification = alertify.warning(message, timer);
          break;
        case "message":
          notification = alertify.message(message, timer);
          break;
      }
      return notification;
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
    $( "#toggle-carousel" ).trigger( "click" );
    $( "#harmonic-tracks" )
      .sidebar( "setting", "transition", "scale down" )
      .sidebar( "show" );
  },
  /**
   * Mini-classe de gestion de la barre de recherche
   *
   * @class GUI.search
   */
  search: {
    /**
     * Activation du moteur de recherche
     *
     * @method on
     */
    on: function() {
      $( "#request" )
        .val( "" )
        .prop( "readonly", false )
        .next()
        .switchClass( "ban", "search" );

      GUI.searchAllowed = true;
      $( "#toggle-carousel" ).trigger( "click" );
    },
    /**
     * Désactivation du moteur de recherche
     *
     * @method off
     */
    off: function() {
      $( "#request" )
        .val( "Utilisez les suggestions harmoniques !" )
        .prop( "readonly", true )
        .next()
        .switchClass( "search", "ban" );
      GUI.searchAllowed = false;
    },
    /**
     * Gestion de l'alerte concernant l'état de la recherche
     *
     * @method warning
     */
    warning: function() {
      if (!GUI.searchAllowed) {
        var message = "Voulez-vous vraiment lancer une nouvelle recherche ?<br>";
            message += "La progression harmonique de votre playlist ne sera plus garantie...";

        alertify.defaults.glossary.title = "Attention !";
        alertify.confirm(message, function() {
          GUI.search.on();
        }).set("labels", { ok:"Oui", cancel:"Non" });
      }
    },
    /**
     * Invisibilité de l'autocomplétion en dessous de 3 caractères
     *
     * @method hideAutocomplete
     */
    hideAutocomplete: function() {
      var keyword = $( "#request" ).val();
      if (keyword.length < 3) {
        $( "#autocomplete" ).slideUp();
      }
    }
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
      $container.mCustomScrollbar({
        mouseWheelPixels: 300
      });
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
     * Configuration d'une sidebar
     *
     * @method configSidebar
     */
    configSidebar: function(id, color) {
      $( id )
        .sidebar({
          onShow: function() {
            $( id + "-btn" ).addClass( color + "-item" );
          },
          onHide: function() {
            $( id + "-btn" ).removeClass( color + "-item" );
          }
        })
        .sidebar( "setting", "transition", "overlay" );
    },
    /**
     * Afficher/Cacher une sidebar
     *
     * @method toggleSidebar
     */
    toggleSidebar: function() {
      // Comme il y a plusieurs boutons pour le menu, c'est géré par une classe
      if ($( this ).hasClass("toggle-menu")) {
        $( "#menu" ).sidebar( "toggle" );
      } else {
        // Le pattern de nommage est le suivant : sidebarname-btn
        var btnId = $( this ).attr( "id" ),
            sidebarId = btnId.substr(0, btnId.lastIndexOf("-"));

        $( "#" + sidebarId ).sidebar( "toggle" );
      }
    },
    /**
     * Afficher/Cacher toutes les sidebars
     *
     * @method toggleAll
     */
    toggleAll: function() {
      $( ".sidebar" ).sidebar( "toggle" );
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
     * Changement automatique de morceau
     *
     * @method autochange
     */
     autochange: function() {
       DZ.Event.subscribe("track_end", function() {
         GUI.playlist.next();
       });
     },
    /**
     * Passage au morceau précédent
     *
     * @method previous
     */
    previous: function() {
      GUI.player.prev();
      $( "#playlist" ).trigger( "trackChanged" );
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
        GUI.player.playTracks(Playlist.tracksIds, function() {
          GUI.player.tracksLoaded = true;
          $( "#playlist" ).trigger( "trackChanged" );
        });
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
      $( "#playlist" ).trigger( "trackChanged" );
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
      GUI.player.isPlaying() ? GUI.playlist.pause() : GUI.playlist.play();
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
      $( "#playlist" ).trigger( "trackChanged" );
    },
    /**
     * Ajout d'un morceau à la playlist
     *
     * @method addTrack
     */
    addTrack: function(eltId) {
      var track = JSON.parse(decodeURIComponent($( "#" + eltId ).next().val()));
      Playlist.addTrack(track);
      GUI.player.addToQueue([track._id]);
      GUI.alert("success", "Morceau ajouté à votre playlist", 5);
    },
    /**
     * Actions à effectuer après suppression d'un morceau de la playlist
     *
     * @method removeTrack
     */
    removeTrack: function() {
      GUI.player.tracksLoaded = false;
      GUI.player.isPlaying() ? GUI.playlist.play() : GUI.player.playTracks([]);
      GUI.alert("success", "Morceau supprimé !", 5);
    },
    /**
     * Gestion de l'icône de lecture
     *
     * @method icon
     */
    icon: function() {
      // On utilise setTimeout car Deezer ne propose pas de callback pour les contrôles
      setTimeout(function() {
        var index = DZ.player.getCurrentIndex();
        $( ".playlist-item", "#playlist" ).find( ".spinner" ).fadeOut();
        $( "#track-" + index ).find( ".spinner" ).fadeIn();
      }, 1000);
    },
    /**
     * Suppression de l'alerte
     *
     * @method removeWarning
     */
    removeWarning: function() {
      $( this ).hide();
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
        $( "[data-title != ''], [data-content != '']" ).popup( "destroy" ); // Semantic UI
        $( "[title != '']" ).tooltip( "destroy" ); // jQuery UI
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
        GUI.autocompleteAllowed = false;
      } else {
        GUI.autocompleteAllowed = true;
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
      Sorting.duplicatesAllowed ? (Sorting.duplicatesAllowed = false) : (Sorting.duplicatesAllowed = true);
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
      if ($( window ).width() >= 600) {
        $( "#main" ).vegas({
            transition: "swirlLeft",
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
            ]
        });
        $( "#main" ).vegas('pause');
      }
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
      GUI.user = null;
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
    },
    /**
     * Affichage ou non du carousel de résultats
     *
     * @method toggleCarousel
     */
    toggleCarousel: function() {
      var $tracks = $( "#tracks" ),
          $toggle = $( "#toggle-carousel i" );

      if (!$tracks.is( ":empty" ) && $tracks.is( ":visible" )) {
        $tracks.slideUp();
        $toggle
          .switchClass( "up", "down" )
          .css( "border-color", "#F04A3C" );
      } else {
        if (!$tracks.is( ":empty" )) {
          if (GUI.searchAllowed) {
            $tracks.slideDown();
            $toggle
              .switchClass( "down", "up")
              .css( "border-color", "#188AE3" );
          } else {
            GUI.search.warning();
          }
        } else {
          GUI.alert("error", "Aucune recherche effectuée !", 5);
        }
      }
    }
  }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/GUI.js","/../modules")
},{"+7ZJp0":14,"./Player.js":5,"./Playlist.js":6,"./Sorting.js":7,"./User.js":8,"buffer":11}],3:[function(require,module,exports){
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
},{"+7ZJp0":14,"buffer":11}],4:[function(require,module,exports){
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Music.js","/../modules")
},{"+7ZJp0":14,"buffer":11}],5:[function(require,module,exports){
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
         * Lecture en cours ?
         *
         * @method isPlaying
         * @return {Boolean} Vrai si la lecture est en cours, faux sinon
         */
        this.isPlaying = function() {
          return DZ.player.isPlaying();
        },
        /**
         * Ajouter des morceaux à la file d'attente
         *
         * @method addToQueue
         * @param {Array} ids Tableau contenant les identifiants des morceaux
         */
        this.addToQueue = function(ids) {
          DZ.player.addToQueue(ids);
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
},{"+7ZJp0":14,"buffer":11}],6:[function(require,module,exports){
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
      $( "#playlist" ).trigger( "trackRemoved" );
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Playlist.js","/../modules")
},{"+7ZJp0":14,"buffer":11}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
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
     * @param {Object} harmony Harmonie recherchée
     * @param {Array} similarTracks Morceaux similaires
     * @return {Array} Tableau de morceaux trié
     */
    this.sort = function(harmony, similarTracks) {
      return similarTracks;
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/Sorting.js","/../modules")
},{"+7ZJp0":14,"./Music.js":4,"buffer":11}],8:[function(require,module,exports){
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../modules/User.js","/../modules")
},{"+7ZJp0":14,"buffer":11}],9:[function(require,module,exports){
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
},{"+7ZJp0":14,"buffer":11}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Import des modules
var Vocabulary = require('../modules/Vocabulary.js'),
    Iterator = require('../modules/Iterator.js'),
    Music = require('../modules/Music.js'),
    Ajax = require('../modules/Ajax.js'),
    GUI = require('../modules/GUI.js'),
    Sorting = require('../modules/Sorting.js'),
    Playlist = require('../modules/Playlist.js');

// Variables diverses
var similarTracks = [],
    refId,
    refTrack,
    baseHarmony,
    factory;

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

    factory = new Ajax.RequestFactory();

    $search.find( "input" ).keyup(function() {
      trackAutocomplete();
      GUI.search.hideAutocomplete();
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

          request = factory.getAjaxRequest("deezer", "/search/track");
          request.addParam("q", keyword);
          request.addParam("limit", 10);
          request.send(success, error);

          function success(response) {

            $( "#autocomplete" ).empty();
            var html = "";

            for (var i = 0, len = response.data.length; i < len; i++) {
              var track = response.data[i],
                  customTrack = new Music.Track(
                                                  track.id,
                                                  track.title,
                                                  track.artist.name,
                                                  track.album.title,
                                                  track.album.release_date,
                                                  track.album.cover_medium,
                                                  "",
                                                  "",
                                                  0,
                                                  "",
                                                  []
                                                );

              html += GUI.template("autocomplete", customTrack, null, null);
              selectedTrack("autocomplete-" + track.id, customTrack);
            }
            $( "#autocomplete" ).append( html );
            $( "#autocomplete" ).show();
          }

          function error(response) {
            console.log(response);
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
    GUI.cleanNotifications();

    var keyword = $search.find( "input" ).val();

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        // On récupère toutes les informations sur chaque morceau
        for (var i = 0, len = response.data.length; i < len; i++) {
            var track = response.data[i],
                customTrack = new Music.Track(
                                                track.id,
                                                track.title,
                                                track.artist.name,
                                                track.album.title,
                                                track.album.release_date,
                                                track.album.cover_medium,
                                                "",
                                                "",
                                                0,
                                                "",
                                                []
                                              );
            // On construit le template
            var html = GUI.template("base-track", customTrack, null, null);
            $owl.data('owlCarousel').addItem(html);
            // On ajoute un écouteur d'événement de type clic pour chaque morceau
            selectedTrack("submit-" + track.id, customTrack);
        }
        // On affiche les résultats
        $( "#toggle-carousel i" )
          .switchClass( "down", "up" )
          .css( "border-color", "#188AE3" );
    }

    function error(response) {
      console.log(response);
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(eltId, track) {
    $( document ).off( "click", "#" + eltId );
    $( document ).on( "click", "#" + eltId, function() {
        // On remet les compteurs à 0...
        if (similarTracks.length > 0) similarTracks = [];
        // On désactive la recherche
        GUI.search.off();
        // On définit la référence
        refId = eltId;
        refTrack = track;
        // Affectation d'un algorithme de tri
        setSortingStrategy();
        // On efface les notifications
        GUI.cleanNotifications();
        // On affiche un loader pour faire patienter l'internaute
        GUI.loading.on();
        // On récupère le résumé audio du morceau sélectionné sur Echo Nest
        getInitialAudioSummary(track.getId());
        // On récupère les informations détaillées du morceau sur Deezer
        getTrackInfo(track.getId());
    });
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
function getInitialAudioSummary(trackId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + trackId);
    request.addParam("bucket", "audio_summary");
    request.send(success, error);

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
                buildRefTrackProfile(key, mode, tempo);

                // On affiche tout ça à l'utilisateur
                var info = "<strong>« " + title + " »</strong><br>";
                    info += "<em>" + artist + "</em><br>";
                    info += "<u>Tonalité</u> : " + key + " " + mode + "<br>";
                    info += "<u>Tempo</u> : " + tempo + " BPM";

                GUI.alert("message", info, 0);
            } else {
              buildRefTrackProfile("", "", 0);
              GUI.alert("error", "Le résumé audio de ce morceau n'est pas disponible sur Echo Nest.", 10);
              GUI.alert("error", "Suggestion harmonique impossible", 10);
            }
        } else {
          buildRefTrackProfile("", "", 0);
          GUI.alert("error", "Ce morceau n'a pas été trouvé sur Echo Nest.", 10);
          GUI.alert("error", "Suggestion harmonique impossible", 10);
        }
    }

    function error(response) {
      console.log(response);
    }

}

// Construction du profil du morceau de référence
function buildRefTrackProfile(key, mode, tempo) {

    // On met à jour le morceau de référence avec les données musicales
    if (key !== "" && mode !== "" && tempo !== 0) {
      var camelotTag = Vocabulary.harmonicMix[mode][key].tag,
          harmonies = Vocabulary.camelotWheel[camelotTag].matches;

      refTrack.setKey(key);
      refTrack.setMode(mode);
      refTrack.setTempo(tempo);
      refTrack.setCamelotTag(camelotTag);
      refTrack.setHarmonies(harmonies);
    }

    // On ajoute le morceau à la playlist
    $( "#" + refId ).next().val(encodeURIComponent(JSON.stringify(refTrack)));
    GUI.playlist.addTrack(refId);

    // On en profite pour construire l'harmonie de base
    buildHarmonyProfile(refTrack);

}

// Construction du profil de base de l'harmonie recherchée
function buildHarmonyProfile(track) {
    harmony = new Music.Harmony(track, null, GUI.tempoVariation);
}

// Récupération des informations sur un morceau, notamment pour avoir l'id de l'artiste (Deezer)
function getTrackInfo(trackId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/track/" + trackId);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        getSimilarArtists(response.artist.id);
    }

    function error(response) {
      console.log(response);
    }

}

// Récupération des artistes similaires (Deezer)
function getSimilarArtists(artistId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/artist/" + artistId + "/related");
    request.addParam("limit", 10);
    request.send(success, error);

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

    function error(response) {
      console.log(response);
    }

}

// Récupération des chansons les plus populaires de chaque artiste similaire (Deezer)
function getTopTracks(similarArtists) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/batch");
    request.addParam("limit", 10);
    request.addParam("methods", similarArtists);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        // var ids = [];
        for (var i = 0, len = response.batch_result.length; i < len; i++) {
            var artist = response.batch_result[i];
            $.each(artist.data, function(i, item) {
                var topTrack = item,
                    album = item.album;

                // ids.push(topTrack.id);
                getTopTrackInfo(topTrack.id, album);
            });
        }
        // getTopTracksInfo(ids);
    }

    function error(response) {
      console.log(response);
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfo(id, album) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("echonest", "/track/profile"); // song...
    /* var tracksIds = [];
    for (var i = 0, len = ids.length; i < len; i++) {
      tracksIds.push("deezer:track:" + ids[i]);
    } */
    request.addParam("bucket", "audio_summary");
    request.addParam("id", "deezer:track:" + id);
    // request.addParam("track_id", tracksIds);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(final) {
        // Il faut que les morceaux soient trouvés sur Echo Nest
       if (final.response.track !== undefined) {
           // Il faut que les morceaux possèdent un résumé audio sur Echo Nest
           if (!$.isEmptyObject(final.response.track.audio_summary)) {
          // var ids = [];
          // for (var i = 0, len = final.response.songs.length; i < len; i++) {
            //  On récupère toutes les informations utiles
            var track = final.response.track, // final.response.songs[i]
                title = track.title,
                artist = track.artist, // track.artist_name
                keyIndex = track.audio_summary.key,
                key = Vocabulary.keys[keyIndex],
                modeIndex = track.audio_summary.mode,
                mode = Vocabulary.modes[modeIndex],
                tempo = Math.round(track.audio_summary.tempo),
                camelotTag = Vocabulary.harmonicMix[mode][key].tag;

            // ids.push(track.id);
            // On alimente un tableau de morceaux pour des tris ultérieurs
            var topTrack = new Music.Track(
                                            id,
                                            title,
                                            artist,
                                            album.title,
                                            album.release_date,
                                            album.cover_medium,
                                            key,
                                            mode,
                                            tempo,
                                            camelotTag, []
                                          );
            similarTracks.push(topTrack);
          // }
        }
      }
    }

    function error(response) {
      console.log(response);
    }

}

// Lorsque se terminent toutes les requêtes Ajax en cours...
$( document ).ajaxStop(function() {
  // ... on enlève le loader vu que c'est la fin des requêtes...
  GUI.loading.off();
  // ... et on lance le tri des morceaux récupérés (s'il y en a)
  if (similarTracks.length > 0) {
    similarTracks = sortingStrategy.sort(harmony, similarTracks);
    displayTracks(similarTracks);
  }
});

// Affichage des morceaux selon un ordre déterminé par le tri
function displayTracks(tracks) {

  $( "#autocomplete" ).hide();
  GUI.scroll.destroy($harmonicTracks);
  $harmonicTracks.empty();

  var html = GUI.template("help", null, null, null);

  // Itérations sur notre collection de morceaux
  iterator = new Iterator(tracks);
  while (iterator.hasNext()) {

    var track = iterator.next();

    harmony.setOtherTrack(track);
    var isTempoCompatible = harmony.tempoCompatibility(),
        isKeyCompatible = harmony.keyCompatibility();

    html += GUI.template("harmonic-track", track, isTempoCompatible, isKeyCompatible);
    selectedTrack("suggestion-" + track.getId(), track);

  }

  $harmonicTracks.append(html);
  GUI.scroll.reset($harmonicTracks);
  GUI.displayFinalTracklist();
  similarTracks = [];

}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_e870f3ae.js","/")
},{"+7ZJp0":14,"../modules/Ajax.js":1,"../modules/GUI.js":2,"../modules/Iterator.js":3,"../modules/Music.js":4,"../modules/Playlist.js":6,"../modules/Sorting.js":7,"../modules/Vocabulary.js":9,"buffer":11}],11:[function(require,module,exports){
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
},{"+7ZJp0":14,"base64-js":12,"buffer":11,"ieee754":13}],12:[function(require,module,exports){
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
},{"+7ZJp0":14,"buffer":11}],13:[function(require,module,exports){
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
},{"+7ZJp0":14,"buffer":11}],14:[function(require,module,exports){
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
},{"+7ZJp0":14,"buffer":11}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9BamF4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL2FwcC9qcy9tb2R1bGVzL0l0ZXJhdG9yLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvU29ydGluZy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVXNlci5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL3NjcmlwdHMvZmFrZV9lODcwZjNhZS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCB1bmUgYXJjaGl0ZWN0dXJlIHLDqXV0aWxpc2FibGUgcG91ciBnw6lyZXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gKlxuICogQG1vZHVsZSBBamF4XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQWpheCA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBnw6luw6lyaXF1ZSBwb3VyIGxlcyByZXF1w6p0ZXMgQWpheFxuICAgKlxuICAgKiBAY2xhc3MgUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBkZSByZXF1w6p0ZSAoR0VUIG91IFBPU1QpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJMIGRlIHJlcXXDqnRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSBUeXBlIGRlIGRvbm7DqWVzIHJlbnZvecOpZXMgKEpTT04sIFhNTCwgLi4uKVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgKi9cbiAgUmVxdWVzdDogZnVuY3Rpb24odHlwZSwgdXJsLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIC8qKlxuICAgICAqIFR5cGUgZGUgcmVxdcOqdGUgKEdFVCBvdSBQT1NUKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAvKipcbiAgICAgKiBVUkwgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB1cmxcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgLyoqXG4gICAgICogVHlwZSBkZSBkb25uw6llcyByZW52b3nDqWVzIChKU09OLCBYTUwsIC4uLilcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhVHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2RhdGFUeXBlID0gZGF0YVR5cGU7XG4gICAgLyoqXG4gICAgICogUGFyYW3DqHRyZXMgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4IHZlcnMgbCdBUEkgZGUgRGVlemVyXG4gICAqXG4gICAqIEBjbGFzcyBEZWV6ZXJBUElSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAZXh0ZW5kcyBSZXF1ZXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIENoZW1pbiBkZSBsYSByZXF1w6p0ZVxuICAgKi9cbiAgRGVlemVyQVBJUmVxdWVzdDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgQWpheC5SZXF1ZXN0LmNhbGwodGhpcywgXCJHRVRcIiwgXCJodHRwOi8vYXBpLmRlZXplci5jb21cIiArIHBhdGgsIFwianNvbnBcIiwgeyBcIm91dHB1dFwiOiBcImpzb25wXCIgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpcmFudCBsZXMgcmVxdcOqdGVzIEFqYXggdmVycyBsJ0FQSSBkJ0VjaG8gTmVzdFxuICAgKlxuICAgKiBAY2xhc3MgRWNob05lc3RBUElSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAZXh0ZW5kcyBSZXF1ZXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIENoZW1pbiBkZSBsYSByZXF1w6p0ZVxuICAgKi9cbiAgRWNob05lc3RBUElSZXF1ZXN0OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBBamF4LlJlcXVlc3QuY2FsbCh0aGlzLCBcIkdFVFwiLCBcImh0dHA6Ly9kZXZlbG9wZXIuZWNob25lc3QuY29tL2FwaS92NFwiICsgcGF0aCwgXCJqc29ucFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwiYXBpX2tleVwiOiBcIlZVU1VBMUhONEhNV1VJTjVQXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZm9ybWF0XCI6IFwianNvbnBcIlxuICAgICAgICAgICAgICAgICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgY29uc3RydWlzYW50IMOgIGxhIGRlbWFuZGUgZGVzIHJlcXXDqnRlcyBBamF4IGQndW4gY2VydGFpbiB0eXBlXG4gICAqXG4gICAqIEBjbGFzcyBSZXF1ZXN0RmFjdG9yeVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFJlcXVlc3RGYWN0b3J5OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBjaGFyZ8OpZSBkJ2luc3RhbmNpZXIgbGVzIGNsYXNzZXMgZ8OpcmFudCBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0QWpheFJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXBpIEFQSSDDoCBpbnRlcnJvZ2VyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBVbiBvYmpldCBkZSB0eXBlIEFqYXhcbiAgICAgKi9cbiAgICAgIHRoaXMuZ2V0QWpheFJlcXVlc3QgPSBmdW5jdGlvbihhcGksIHBhdGgpIHtcbiAgICAgICAgICB2YXIgYWpheFJlcXVlc3Q7XG4gICAgICAgICAgaWYgKGFwaSA9PT0gXCJkZWV6ZXJcIikge1xuICAgICAgICAgICAgICBhamF4UmVxdWVzdCA9IG5ldyBBamF4LkRlZXplckFQSVJlcXVlc3QocGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcGkgPT09IFwiZWNob25lc3RcIikge1xuICAgICAgICAgICAgICBhamF4UmVxdWVzdCA9IG5ldyBBamF4LkVjaG9OZXN0QVBJUmVxdWVzdChwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFqYXhSZXF1ZXN0O1xuICAgICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbGEgY2xhc3NlIG3DqHJlIDogQWpheFxuICovXG4gQWpheC5SZXF1ZXN0LnByb3RvdHlwZSA9IHtcbiAgIC8qKlxuICAgICogTcOpdGhvZGUgcGVybWV0dGFudCBkJ2Fqb3V0ZXIgdW4gcGFyYW3DqHRyZSDDoCBsYSByZXF1w6p0ZVxuICAgICpcbiAgICAqIEBtZXRob2QgYWRkUGFyYW1cbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgQ2zDqSBkdSBwYXJhbcOodHJlXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgVmFsZXVyIGR1IHBhcmFtw6h0cmVcbiAgICAqL1xuICAgYWRkUGFyYW06IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgdGhpcy5fZGF0YVtrZXldID0gdmFsdWU7XG4gICB9LFxuICAgLyoqXG4gICAgKiBNw6l0aG9kZSBjaGFyZ8OpZSBkJ2Vudm95ZXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gICAgKlxuICAgICogQG1ldGhvZCBzZW5kXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzIEZvbmN0aW9uIMOgIGV4w6ljdXRlciBhdSBzdWNjw6hzIGRlIGxhIHJlcXXDqnRlXG4gICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcnJvciBGb25jdGlvbiDDoCBleMOpY3V0ZXIgbG9ycyBkJ3VuZSBlcnJldXIgZGFucyBsYSByZXF1w6p0ZVxuICAgICovXG4gICBzZW5kOiBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcikge1xuICAgICAkLmFqYXgoe1xuICAgICAgICAgdHlwZTogdGhpcy5fdHlwZSxcbiAgICAgICAgIHVybDogdGhpcy5fdXJsLFxuICAgICAgICAgZGF0YVR5cGU6IHRoaXMuX2RhdGFUeXBlLFxuICAgICAgICAgZGF0YTogdGhpcy5fZGF0YSxcbiAgICAgICAgIHRyYWRpdGlvbmFsOiB0cnVlLFxuICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICB9LFxuICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgICAgIH1cbiAgICAgfSk7XG4gICB9XG4gfTtcblxuLyoqXG4gKiBDbG9uYWdlIGRlIHByb3RvdHlwZSBwb3VyIGNyw6llciBkZXMgY2xhc3NlcyBmaWxsZXNcbiAqL1xuQWpheC5EZWV6ZXJBUElSZXF1ZXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWpheC5SZXF1ZXN0LnByb3RvdHlwZSk7XG5BamF4LkRlZXplckFQSVJlcXVlc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWpheC5EZWV6ZXJBUElSZXF1ZXN0O1xuXG5BamF4LkVjaG9OZXN0QVBJUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFqYXguUmVxdWVzdC5wcm90b3R5cGUpO1xuQWpheC5FY2hvTmVzdEFQSVJlcXVlc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWpheC5FY2hvTmVzdEFQSVJlcXVlc3Q7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9BamF4LmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuL1BsYXllci5qcycpLFxuICAgIFBsYXlsaXN0ID0gcmVxdWlyZSgnLi9QbGF5bGlzdC5qcycpLFxuICAgIFNvcnRpbmcgPSByZXF1aXJlKCcuL1NvcnRpbmcuanMnKSxcbiAgICBVc2VyID0gcmVxdWlyZSgnLi9Vc2VyLmpzJyk7XG5cbi8qKlxuICogTW9kdWxlIGfDqXJhbnQgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlXG4gKlxuICogQG1vZHVsZSBHVUlcbiAqIEBjbGFzcyBHVUlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBHVUkgPSB7XG4gIC8qKlxuICAgKiBMZWN0ZXVyIG1hbmlwdWzDqSBwYXIgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlLlxuICAgKiBDJ2VzdCDDoCBsYSBmb2lzIHVuIFNpbmdsZXRvbiBldCB1biBBZGFwdGVyLlxuICAgKlxuICAgKiBAcHJvcGVydHkgcGxheWVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHBsYXllcjogbnVsbCxcbiAgLyoqXG4gICAqIFV0aWxpc2F0ZXVyIGNvdXJhbnRcbiAgICpcbiAgICogQHByb3BlcnR5IHVzZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgdXNlcjogbnVsbCxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsYSByZWNoZXJjaGUgZXN0IGF1dG9yaXPDqWVcbiAgICpcbiAgICogQHByb3BlcnR5IHNlYXJjaEFsbG93ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHNlYXJjaEFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIGluZm9idWxsZXMgc29udCBhdXRvcmlzw6llc1xuICAgKlxuICAgKiBAcHJvcGVydHkgdG9vbHRpcEFsbG93ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHRvb2x0aXBBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBub3RpZmljYXRpb25zIHNvbnQgYXV0b3Jpc8OpZXNcbiAgICpcbiAgICogQHByb3BlcnR5IG5vdGlmQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgbm90aWZBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBzb25zIGQnYW1iaWFuY2Ugc29udCBhdXRvcmlzw6lzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBzb3VuZEFsbG93ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHNvdW5kQWxsb3dlZDogdHJ1ZSxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsJ2F1dG9jb21wbMOpdGlvbiBlc3QgYXV0b3Jpc8OpZSBkYW5zIGxhIHJlY2hlcmNoZVxuICAgKlxuICAgKiBAcHJvcGVydHkgYXV0b2NvbXBsZXRlQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgYXV0b2NvbXBsZXRlQWxsb3dlZDogdHJ1ZSxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBsYSB2YXJpYXRpb24gY291cmFudGUgZHUgdGVtcG8gKGVudHJlIDAgZXQgMSlcbiAgICpcbiAgICogQHByb3BlcnR5IHRlbXBvVmFyaWF0aW9uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDAuMDVcbiAgICovXG4gIHRlbXBvVmFyaWF0aW9uOiAwLjA1LFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgc8OpbGVjdGlvbm7DqVxuICAgKlxuICAgKiBAcHJvcGVydHkgc2VsZWN0ZWRTb3J0aW5nXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiZGVmYXVsdFwiXG4gICAqL1xuICBzZWxlY3RlZFNvcnRpbmc6IFwiZGVmYXVsdFwiLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBzaWRlYmFycyBvbnQgw6l0w6kgaW5pdGlhbGlzw6llc1xuICAgKlxuICAgKiBAcHJvcGVydHkgc2lkZWJhckluaXRpYWxpemVkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgc2lkZWJhckluaXRpYWxpemVkOiBmYWxzZSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIGNoYXJnw6llIGQnaW5pdGlhbGlzZXIgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlLlxuICAgKiBDZXR0ZSBtw6l0aG9kZSBzJ2luc3BpcmUgZHUgcGF0dGVybiBUZW1wbGF0ZSBkYW5zIHNhIGNvbmNlcHRpb24uXG4gICAqXG4gICAqIEBtZXRob2QgaW5pdFxuICAgKi9cbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgR1VJLmF0bW9zcGhlcmVzLmJhY2tncm91bmRzKCk7IC8vIFBvc2l0aW9uIGlkw6lhbGUgcG91ciDDqXZpdGVyIGxlcyBidWdzICE/XG4gICAgR1VJLmNzcygpO1xuICAgIEdVSS5jYXJvdXNlbCgpO1xuICAgIEdVSS5kcmFnKCk7XG4gICAgR1VJLnRvb2x0aXBzKCk7XG4gICAgR1VJLmNoZWNrYm94ZXMoKTtcbiAgICBHVUkubGlzdGVuZXJzKCk7XG4gICAgR1VJLm1lbnUuY29uZmlnU2lkZWJhcihcIiNwbGF5bGlzdFwiLCBcImJsdWVcIik7XG4gICAgR1VJLm1lbnUuY29uZmlnU2lkZWJhcihcIiNmYXZvcml0ZXNcIiwgXCJyZWRcIik7XG4gICAgR1VJLm1lbnUuY29uZmlnU2lkZWJhcihcIiNhdG1vc3BoZXJlc1wiLCBcImdyZWVuXCIpO1xuICAgIEdVSS5tZW51LmNvbmZpZ1NpZGViYXIoXCIjaGFybW9uaWMtdHJhY2tzXCIsIFwidmlvbGV0XCIpO1xuICAgIEdVSS5tZW51LmNvbmZpZ1NpZGViYXIoXCIjdXNlclwiLCBcIm1hcm9vblwiKTtcbiAgICBHVUkuc2Nyb2xsLmluaXQoKTtcbiAgICBHVUkucGxheWxpc3QucmV0cmlldmUoKTtcbiAgICBHVUkucGxheWVyID0gUGxheWVyLmdldFBsYXllcigpO1xuICAgIEdVSS5wbGF5ZXIuaW5pdCgpO1xuICAgIEdVSS5wbGF5bGlzdC5hdXRvY2hhbmdlKCk7XG4gICAgR1VJLmFjY291bnQuc3RhdHVzKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBIYWNrcyBDU1NcbiAgICpcbiAgICogQG1ldGhvZCBjc3NcbiAgICovXG4gIGNzczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIucHVzaGVyXCIgKS5jc3MoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICAgIGlmICgkKCB3aW5kb3cgKS53aWR0aCgpIDwgNjAwKSB7XG4gICAgICAkKCBcIiNtZW51XCIgKS5zd2l0Y2hDbGFzcyggXCJmaXZlXCIsIFwiZm91clwiICk7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnN3aXRjaENsYXNzKCBcImZvdXJcIiwgXCJmaXZlXCIgKTtcbiAgICAgIEdVSS5zb3VuZEFsbG93ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGR1IGNhcm91c2VsIGNvbnRlbmFudCBsZXMgcsOpc3VsdGF0cyBkZSByZWNoZXJjaGUuXG4gICAqIExlIGNhcm91c2VsIGVzdCBnw6lyw6kgcGFyIGxlIHBsdWdpbiBPV0wgQ2Fyb3VzZWwuXG4gICAqXG4gICAqIEBtZXRob2QgY2Fyb3VzZWxcbiAgICovXG4gIGNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiN0cmFja3NcIiApLm93bENhcm91c2VsKHtcbiAgICAgIGl0ZW1zOiAxMCxcbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgYXV0b1BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVRpbWVvdXQ6IDEwMCxcbiAgICAgIHN0b3BPbkhvdmVyOiB0cnVlLFxuICAgICAgbGF6eUxvYWQgOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkdSBkcmFnICYgZHJvcCBzdXIgbCdpUG9kLlxuICAgKiBMZSBkcmFnICYgZHJvcCBlc3QgZ8OpcsOpIHBhciBqUXVlcnkgVUkuXG4gICAqXG4gICAqIEBtZXRob2QgZHJhZ1xuICAgKi9cbiAgZHJhZzogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjaXBvZC13cmFwcGVyXCIgKS5kcmFnZ2FibGUoeyBzY3JvbGw6IGZhbHNlIH0pO1xuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIHRvb2x0aXBzLlxuICAgKiBMZXMgdG9vbHRpcHMgc29udCBnw6lyw6llcyBwYXIgU2VtYW50aWMgVUkgZXQgcVRpcMKyLlxuICAgKlxuICAgKiBAbWV0aG9kIHRvb2x0aXBzXG4gICAqL1xuICB0b29sdGlwczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKEdVSS50b29sdGlwQWxsb3dlZCkge1xuICAgICAgLy8gU2VtYW50aWMgVUlcbiAgICAgICQoIFwiW2RhdGEtdGl0bGUgIT0gJyddLCBbZGF0YS1jb250ZW50ICE9ICcnXVwiICkucG9wdXAoKTtcbiAgICAgIC8vIGpRdWVyeSBVSVxuICAgICAgJCggZG9jdW1lbnQgKS50b29sdGlwKHtcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICBteTogXCJjZW50ZXIgdG9wXCIsXG4gICAgICAgICAgYXQ6IFwiY2VudGVyIGJvdHRvbSs1XCIsXG4gICAgICAgICAgd2l0aGluOiBcIiNpcG9kLXdyYXBwZXJcIlxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZGVzIGNoZWNrYm94ZXMuXG4gICAqIExlcyBjaGVja2JveGVzIHNvbnQgZ8OpcsOpZXMgcGFyIFNlbWFudGljIFVJLlxuICAgKlxuICAgKiBAbWV0aG9kIGNoZWNrYm94ZXNcbiAgICovXG4gIGNoZWNrYm94ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkuY2hlY2tib3hcIiApLmNoZWNrYm94KCk7XG4gIH0sXG4gIC8qKlxuICAgKiBEw6lmaW5pdGlvbiBkZSB0b3VzIGxlcyDDqWNvdXRldXJzIGQnw6l2w6luZW1lbnRzXG4gICAqXG4gICAqIEBtZXRob2QgbGlzdGVuZXJzXG4gICAqL1xuICBsaXN0ZW5lcnM6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZXMgc2lkZWJhcnNcbiAgICB2YXIgbWVudUV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIi50b2dnbGUtbWVudVwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVNpZGViYXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVNpZGViYXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdm9yaXRlcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVTaWRlYmFyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNhdG1vc3BoZXJlcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVTaWRlYmFyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNoYXJtb25pYy10cmFja3MtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlU2lkZWJhcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdXNlci1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVTaWRlYmFyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIi50b2dnbGUtYWxsXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlQWxsXVxuICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlIGxhIHBsYXlsaXN0XG4gICAgdmFyIHBsYXlsaXN0RXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNyYW5kb20tYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5vdFJhbmRvbSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbm90LXJhbmRvbS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmFuZG9tLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNyZXBlYXQtYWxsLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5ub1JlcGVhdCwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbm8tcmVwZWF0LWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yZXBlYXRPbmUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JlcGVhdC1vbmUtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJlcGVhdEFsbCwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbXV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QudW5tdXRlLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN1bm11dGUtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm11dGUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3NhdmUtYnJvd3Nlci1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Quc2F2ZUluQnJvd3Nlcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3NhdmUtZGVlemVyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5zYXZlT25EZWV6ZXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNleHBvcnQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmV4cG9ydF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2RlbGV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuZGVsZXRlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucHJldmlvdXMtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnByZXZpb3VzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIuYmFjay1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuYmFja10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBsYXktYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnBsYXksIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBsYXlsaXN0LWl0ZW1cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheUZyb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBhdXNlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wYXVzZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBsYXktcGF1c2UtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnBsYXlQYXVzZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLmZvcnRoLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5mb3J0aF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLm5leHQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5leHRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNwbGF5bGlzdFwiLCBcInRyYWNrQ2hhbmdlZFwiLCBHVUkucGxheWxpc3QuaWNvbl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0XCIsIFwidHJhY2tSZW1vdmVkXCIsIEdVSS5wbGF5bGlzdC5yZW1vdmVUcmFja10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0LXdhcm5pbmdcIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVtb3ZlV2FybmluZ11cbiAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZXMgZmF2b3Jpc1xuICAgIHZhciBmYXZvcml0ZXNFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtaXBvZFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuaXBvZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtdG9vbHRpcFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMudG9vbHRpcF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtbm90aWZ5XCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5ub3RpZnldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LXNvdW5kXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5zb3VuZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtYXV0b2NvbXBsZXRlXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hdXRvY29tcGxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWR1cGxpY2F0ZVwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZHVwbGljYXRlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1yYW5nZVwiLCBcImlucHV0XCIsIEdVSS5mYXZvcml0ZXMudGVtcG9SYW5nZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZGVmYXVsdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kZWZhdWx0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtdGVtcG8tZmlyc3Qtc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMudGVtcG9GaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWtleS1maXJzdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5rZXlGaXJzdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWFzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hc2NUZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWRlc2MtdGVtcG8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZGVzY1RlbXBvU29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtbm8tc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMubm9Tb3J0aW5nXVxuICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBhbWJpYW5jZXNcbiAgICB2YXIgYXRtb3NwaGVyZXNFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbmV1dHJhbC1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLm5ldXRyYWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JvY2stYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5yb2NrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNlbGVjdHJvLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZWxlY3Ryb10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjaGlwaG9wLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuaGlwaG9wXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmb2xrLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuZm9sa10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjY2xhc3NpY2FsLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuY2xhc3NpY2FsXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNqYXp6LWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMuamF6el0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjbWV0YWwtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5tZXRhbF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyByZWxhdGlmcyBhdSBjb21wdGUgdXRpbGlzYXRldXJcbiAgICB2YXIgdXNlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dpblwiLCBcImNsaWNrXCIsIEdVSS5hY2NvdW50LmxvZ2luXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvdXRcIiwgXCJjbGlja1wiLCBHVUkuYWNjb3VudC5sb2dvdXRdLFxuICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRpdmVyc1xuICAgIHZhciBvdGhlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MubG9nb10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmVxdWVzdFwiLCBcImNsaWNrXCIsIEdVSS5zZWFyY2gud2FybmluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdG9nZ2xlLWNhcm91c2VsXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MudG9nZ2xlQ2Fyb3VzZWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3RyYWNrcy1oZWxwXCIsIFwiY2xpY2tcIiwgR1VJLm1pc2MuaGVscCwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFt3aW5kb3csIFwicmVzaXplXCIsIEdVSS5jc3NdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIEFqb3V0IGRlcyDDqWNvdXRldXJzIGQnw6l2w6luZW1lbnRzXG4gICAgYWRkRXZlbnRzKG1lbnVFdmVudHMpO1xuICAgIGFkZEV2ZW50cyhwbGF5bGlzdEV2ZW50cyk7XG4gICAgYWRkRXZlbnRzKGZhdm9yaXRlc0V2ZW50cyk7XG4gICAgYWRkRXZlbnRzKGF0bW9zcGhlcmVzRXZlbnRzKTtcbiAgICBhZGRFdmVudHModXNlckV2ZW50cyk7XG4gICAgYWRkRXZlbnRzKG90aGVyRXZlbnRzKTtcblxuICAgIC8vIEZvbmN0aW9ucyBkJ2Fqb3V0IGQnw6l2w6luZW1lbnRzXG4gICAgZnVuY3Rpb24gYWRkRXZlbnRzKGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChlW2ldWzNdID09IFwiYXN5bmNcIikge1xuICAgICAgICAgICQoIGRvY3VtZW50ICkub24oIGVbaV1bMV0sIGVbaV1bMF0sIGVbaV1bMl0pOyAvLyBkw6lsw6lnYXRpb25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCBlW2ldWzBdICkub24oIGVbaV1bMV0sIGVbaV1bMl0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgdGVtcGxhdGUgY3LDqWFudCBkeW5hbWlxdWVtZW50IHVuIGZyYWdtZW50IEhUTUxcbiAgICpcbiAgICogQG1ldGhvZCB0ZW1wbGF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIGRlIHRlbXBsYXRlIChzdWdnZXN0aW9ucyBkZSBiYXNlIG91IGhhcm1vbmlxdWVzKVxuICAgKiBAcGFyYW0ge09iamVjdH0gdHJhY2sgT2JqZXQgcmVwcsOpc2VudGFudCBtb3JjZWF1IGRlIG11c2lxdWVcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1RlbXBvQ29tcGF0aWJsZSBDb21wYXRpYmlsaXTDqSBvdSBub24gZHUgdGVtcG9cbiAgICogQHBhcmFtIHtCb29sZWFufSBpc0tleUNvbXBhdGlibGUgQ29tcGF0aWJpbGl0w6kgb3Ugbm9uIGRlIGxhIHRvbmFsaXTDqVxuICAgKi9cbiAgdGVtcGxhdGU6IGZ1bmN0aW9uKHR5cGUsIHRyYWNrLCBpc1RlbXBvQ29tcGF0aWJsZSwgaXNLZXlDb21wYXRpYmxlKSB7XG5cbiAgICB2YXIgaHRtbCA9IFwiXCIsXG4gICAgICAgIGFydGlzdE5hbWUgPSBcIlwiLFxuICAgICAgICBtYXhTdHJpbmdMZW5ndGggPSAwO1xuXG4gICAgaWYgKHR5cGUgPT0gXCJiYXNlLXRyYWNrXCIpIHsgLy8gTW9yY2VhdSBkZSBiYXNlXG5cbiAgICAgIGFydGlzdE5hbWUgPSB0cmFjay5nZXRBcnRpc3QoKTtcbiAgICAgIG1heFN0cmluZ0xlbmd0aCA9IDEwMDtcblxuICAgICAgLy8gU2kgbGUgbm9tIGRlIGwnYXJ0aXN0ZSBlc3QgZXhhZ8OpcsOpbWVudCBsb25nLCBvbiBsZSB0cm9ucXVlIMOgIGwnYWZmaWNoYWdlXG4gICAgICBpZiAoYXJ0aXN0TmFtZS5sZW5ndGggPiBtYXhTdHJpbmdMZW5ndGgpIHtcbiAgICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICAgIH1cblxuICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInRyYWNrXCIgaXRlbXNjb3BlIGl0ZW10eXBlPVwiaHR0cHM6Ly9zY2hlbWEub3JnL011c2ljUmVjb3JkaW5nXCI+JztcbiAgICAgIGh0bWwgKz0gJyA8ZmlndXJlIGlkPVwic3VibWl0LScgKyB0cmFjay5nZXRJZCgpICsgJ1wiPic7XG4gICAgICBodG1sICs9ICcgICA8aW1nIGNsYXNzPVwibGF6eU93bFwiIGRhdGEtc3JjPVwiJyArIHRyYWNrLmdldENvdmVyKCkgKyAnXCIgYWx0PVwiJyArIHRyYWNrLmdldFRpdGxlKCkgKyAnXCI+JztcbiAgICAgIGh0bWwgKz0gJyAgIDxmaWdjYXB0aW9uPic7XG4gICAgICBodG1sICs9ICcgICAgIDxkaXY+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgICA8aDMgY2xhc3M9XCJ0cmFjay10aXRsZVwiIGl0ZW1wcm9wPVwibmFtZVwiPicgKyB0cmFjay5nZXRUaXRsZSgpICsgJzwvaDM+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgICA8cCBjbGFzcz1cImFydGlzdC1uYW1lXCIgaXRlbXByb3A9XCJieUFydGlzdFwiPicgKyBhcnRpc3ROYW1lICsgXCI8L3A+XCI7XG4gICAgICBodG1sICs9ICcgICAgIDwvZGl2Pic7XG4gICAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICAgIGh0bWwgKz0gJyA8L2ZpZ3VyZT4nO1xuICAgICAgaHRtbCArPSAnIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9XCInICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHRyYWNrKSkgKyAnXCI+JztcbiAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiaGFybW9uaWMtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGhhcm1vbmlxdWVcblxuICAgICAgYXJ0aXN0TmFtZSA9IHRyYWNrLmdldEFydGlzdCgpO1xuICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwO1xuXG4gICAgICB2YXIgdGVtcG9Dc3NDbGFzcyA9IFwicmVkXCIsXG4gICAgICAgICAgdG9uYWxpdHlDc3NDbGFzcyA9IFwicmVkXCI7XG5cbiAgICAgIC8vIE9uIGfDqHJlIGxlIGNhcyBvw7kgbGUgbm9tIGRlIGwnYXJ0aXN0ZSBlc3QgZXhhZ8OpcsOpbWVudCBsb25nXG4gICAgICBpZiAoYXJ0aXN0TmFtZS5sZW5ndGggPiBtYXhTdHJpbmdMZW5ndGgpIHtcbiAgICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICAgIH1cblxuICAgICAgLy8gT24gc2lnbmFsZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXNcbiAgICAgIGlmIChpc1RlbXBvQ29tcGF0aWJsZSkgeyB0ZW1wb0Nzc0NsYXNzID0gXCJncmVlblwiOyB9XG4gICAgICBpZiAoaXNLZXlDb21wYXRpYmxlKSB7IHRvbmFsaXR5Q3NzQ2xhc3MgPSBcImdyZWVuXCI7IH1cblxuICAgICAgaHRtbCArPSAnPGEgY2xhc3M9XCJoYXJtb25pYy10cmFja1wiIGl0ZW1zY29wZSBpdGVtdHlwZT1cImh0dHBzOi8vc2NoZW1hLm9yZy9NdXNpY0NvbXBvc2l0aW9uXCI+JztcbiAgICAgIGh0bWwgKz0gJyA8ZmlndXJlIGlkPVwic3VnZ2VzdGlvbi0nICsgdHJhY2suZ2V0SWQoKSArICdcIj4nO1xuICAgICAgaHRtbCArPSAnICAgPGltZyBzcmM9XCInICsgdHJhY2suZ2V0Q292ZXIoKSArICdcIiBhbHQ9XCInICsgdHJhY2suZ2V0VGl0bGUoKSArICdcIj4nO1xuICAgICAgaHRtbCArPSAnICAgPGZpZ2NhcHRpb24+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgaHRtbCArPSAnICAgICAgPGgzIGl0ZW1wcm9wPVwibmFtZVwiPicgKyB0cmFjay5nZXRUaXRsZSgpICsgJzwvaDM+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgIDxwIGNsYXNzPVwiYXJ0aXN0LW5hbWVcIiBpdGVtcHJvcD1cImNvbXBvc2VyXCI+JyArIGFydGlzdE5hbWUgKyAnPC9wPic7XG4gICAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cIicgKyB0ZW1wb0Nzc0NsYXNzICsgJ1wiIGl0ZW1wcm9wPVwibXVzaWNhbEtleVwiPlRlbXBvIDogJyArIHRyYWNrLmdldFRlbXBvKCkgKyAnIEJQTTwvcD4nO1xuICAgICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCInICsgdG9uYWxpdHlDc3NDbGFzcyArICdcIiBpdGVtcHJvcD1cIm11c2ljYWxLZXlcIj5Ub25hbGl0w6kgOiAnICsgdHJhY2suZ2V0S2V5KCkgKyAnICcgKyB0cmFjay5nZXRNb2RlKCkgKyAnPC9wPic7XG4gICAgICBodG1sICs9ICcgICAgIDwvZGl2Pic7XG4gICAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICAgIGh0bWwgKz0gJyA8L2ZpZ3VyZT4nO1xuICAgICAgaHRtbCArPSAnIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgdmFsdWU9XCInICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHRyYWNrKSkgKyAnXCI+JztcbiAgICAgIGh0bWwgKz0gJzwvYT4nO1xuXG4gICAgICByZXR1cm4gaHRtbDtcblxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImF1dG9jb21wbGV0ZVwiKSB7IC8vIEF1dG9jb21wbMOpdGlvblxuXG4gICAgICBodG1sICs9ICc8ZGl2IGlkPVwiYXV0b2NvbXBsZXRlLScgKyB0cmFjay5nZXRJZCgpICsgJ1wiPic7XG4gICAgICBodG1sICs9ICcgPHN0cm9uZz4nICsgdHJhY2suZ2V0VGl0bGUoKSArICc8L3N0cm9uZz48YnI+JztcbiAgICAgIGh0bWwgKz0gJyA8ZW0+JyArIHRyYWNrLmdldEFydGlzdCgpICsgJzwvZW0+JztcbiAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIHsgLy8gQ2FzZSBkJ2FpZGVcblxuICAgICAgaHRtbCArPSAnPGEgY2xhc3M9XCJpdGVtIHRpdGxlXCI+JztcbiAgICAgIGh0bWwgKz0gJyA8aDI+U3VnZ2VzdGlvbnM8L2gyPic7XG4gICAgICBodG1sICs9ICc8L2E+JztcbiAgICAgIGh0bWwgKz0gJzxhIGlkPVwidHJhY2tzLWhlbHBcIiBocmVmPVwiI1wiPic7XG4gICAgICBodG1sICs9ICcgIDxpIGNsYXNzPVwiaGVscCBjaXJjbGUgaWNvblwiPjwvaT4nO1xuICAgICAgaHRtbCArPSAnPC9hPic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgRmFjYWRlIHBlcm1ldHRhbnQgZCfDqXZpdGVyIGwnYWJvbmRhbmNlIGRlIGNvbmRpdGlvbnMgZGFucyBsZSBjb2RlXG4gICAqXG4gICAqIEBtZXRob2QgYWxlcnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBkJ2FsZXJ0ZSAoc3VjY8OocywgZXJyZXVyLCBtZXNzYWdlKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBNZXNzYWdlIGQnYWxlcnRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lciBEdXLDqWUgZGUgdmllIGRlIGxhIG5vdGlmaWNhdGlvblxuICAgKi9cbiAgYWxlcnQ6IGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2UsIHRpbWVyKSB7XG4gICAgdmFyIG5vdGlmaWNhdGlvbiA9IG51bGw7XG4gICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IGFsZXJ0aWZ5LnN1Y2Nlc3MobWVzc2FnZSwgdGltZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXJyb3JcIjpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBhbGVydGlmeS5lcnJvcihtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3YXJuaW5nXCI6XG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gYWxlcnRpZnkud2FybmluZyhtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtZXNzYWdlXCI6XG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gYWxlcnRpZnkubWVzc2FnZShtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9uO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFN1cHByZXNzaW9uIGRlIHRvdXRlcyBsZXMgbm90aWZpY2F0aW9ucyBhY3RpdmVzXG4gICAqXG4gICAqIEBtZXRob2QgY2xlYW5Ob3RpZmljYXRpb25zXG4gICAqL1xuICBjbGVhbk5vdGlmaWNhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIGFsZXJ0aWZ5LmRpc21pc3NBbGwoKTtcbiAgfSxcbiAgLyoqXG4gICAqIEFmZmljaGFnZSBkZXMgc3VnZ2VzdGlvbnMgaGFybW9uaXF1ZXMgw6AgbGEgZmluIGR1IHByb2Nlc3N1cyBkZSByZWNoZXJjaGVcbiAgICpcbiAgICogQG1ldGhvZCBkaXNwbGF5RmluYWxUcmFja2xpc3RcbiAgICovXG4gIGRpc3BsYXlGaW5hbFRyYWNrbGlzdDogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjdG9nZ2xlLWNhcm91c2VsXCIgKS50cmlnZ2VyKCBcImNsaWNrXCIgKTtcbiAgICAkKCBcIiNoYXJtb25pYy10cmFja3NcIiApXG4gICAgICAuc2lkZWJhciggXCJzZXR0aW5nXCIsIFwidHJhbnNpdGlvblwiLCBcInNjYWxlIGRvd25cIiApXG4gICAgICAuc2lkZWJhciggXCJzaG93XCIgKTtcbiAgfSxcbiAgLyoqXG4gICAqIE1pbmktY2xhc3NlIGRlIGdlc3Rpb24gZGUgbGEgYmFycmUgZGUgcmVjaGVyY2hlXG4gICAqXG4gICAqIEBjbGFzcyBHVUkuc2VhcmNoXG4gICAqL1xuICBzZWFyY2g6IHtcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGR1IG1vdGV1ciBkZSByZWNoZXJjaGVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNyZXF1ZXN0XCIgKVxuICAgICAgICAudmFsKCBcIlwiIClcbiAgICAgICAgLnByb3AoIFwicmVhZG9ubHlcIiwgZmFsc2UgKVxuICAgICAgICAubmV4dCgpXG4gICAgICAgIC5zd2l0Y2hDbGFzcyggXCJiYW5cIiwgXCJzZWFyY2hcIiApO1xuXG4gICAgICBHVUkuc2VhcmNoQWxsb3dlZCA9IHRydWU7XG4gICAgICAkKCBcIiN0b2dnbGUtY2Fyb3VzZWxcIiApLnRyaWdnZXIoIFwiY2xpY2tcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRMOpc2FjdGl2YXRpb24gZHUgbW90ZXVyIGRlIHJlY2hlcmNoZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBvZmZcbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIjcmVxdWVzdFwiIClcbiAgICAgICAgLnZhbCggXCJVdGlsaXNleiBsZXMgc3VnZ2VzdGlvbnMgaGFybW9uaXF1ZXMgIVwiIClcbiAgICAgICAgLnByb3AoIFwicmVhZG9ubHlcIiwgdHJ1ZSApXG4gICAgICAgIC5uZXh0KClcbiAgICAgICAgLnN3aXRjaENsYXNzKCBcInNlYXJjaFwiLCBcImJhblwiICk7XG4gICAgICBHVUkuc2VhcmNoQWxsb3dlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsJ2FsZXJ0ZSBjb25jZXJuYW50IGwnw6l0YXQgZGUgbGEgcmVjaGVyY2hlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHdhcm5pbmdcbiAgICAgKi9cbiAgICB3YXJuaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghR1VJLnNlYXJjaEFsbG93ZWQpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIlZvdWxlei12b3VzIHZyYWltZW50IGxhbmNlciB1bmUgbm91dmVsbGUgcmVjaGVyY2hlID88YnI+XCI7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiTGEgcHJvZ3Jlc3Npb24gaGFybW9uaXF1ZSBkZSB2b3RyZSBwbGF5bGlzdCBuZSBzZXJhIHBsdXMgZ2FyYW50aWUuLi5cIjtcblxuICAgICAgICBhbGVydGlmeS5kZWZhdWx0cy5nbG9zc2FyeS50aXRsZSA9IFwiQXR0ZW50aW9uICFcIjtcbiAgICAgICAgYWxlcnRpZnkuY29uZmlybShtZXNzYWdlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBHVUkuc2VhcmNoLm9uKCk7XG4gICAgICAgIH0pLnNldChcImxhYmVsc1wiLCB7IG9rOlwiT3VpXCIsIGNhbmNlbDpcIk5vblwiIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogSW52aXNpYmlsaXTDqSBkZSBsJ2F1dG9jb21wbMOpdGlvbiBlbiBkZXNzb3VzIGRlIDMgY2FyYWN0w6hyZXNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaGlkZUF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIGhpZGVBdXRvY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleXdvcmQgPSAkKCBcIiNyZXF1ZXN0XCIgKS52YWwoKTtcbiAgICAgIGlmIChrZXl3b3JkLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5zbGlkZVVwKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTWluaS1jbGFzc2UgZGUgZ2VzdGlvbiBkZXMgc2Nyb2xsYmFycy5cbiAgICogTGVzIHNjcm9sbGJhcnMgZMOpcGVuZGVudCBkdSBwbHVnaW4gbUN1c3RvbVNjcm9sbGJhci5cbiAgICpcbiAgICogQGNsYXNzIEdVSS5zY3JvbGxcbiAgICovXG4gIHNjcm9sbDoge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIGRlcyBzY3JvbGxiYXJzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI3BsYXlsaXN0LCAjZmF2b3JpdGVzXCIgKS5tQ3VzdG9tU2Nyb2xsYmFyKHtcbiAgICAgICAgdGhlbWU6IFwiZGFya1wiLFxuICAgICAgICBzY3JvbGxJbmVydGlhOiAwXG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWluaXRpYWxpc2F0aW9uIGNvbXBsw6h0ZSBkJ3VuZSBzY3JvbGxiYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oJGNvbnRhaW5lcikge1xuICAgICAgJGNvbnRhaW5lci5tQ3VzdG9tU2Nyb2xsYmFyKHtcbiAgICAgICAgbW91c2VXaGVlbFBpeGVsczogMzAwXG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIERlc3RydWN0aW9uIGQndW5lIHNjcm9sbGJhclxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZXN0cm95XG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oJGNvbnRhaW5lcikge1xuICAgICAgJGNvbnRhaW5lci5tQ3VzdG9tU2Nyb2xsYmFyKCBcImRlc3Ryb3lcIiApO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIE1pbmktY2xhc3NlIGludGVybmUgZ8OpcmFudCBsZSBjaGFyZ2VtZW50XG4gICAqXG4gICAqIEBjbGFzcyBHVUkubG9hZGluZ1xuICAgKi9cbiAgbG9hZGluZzoge1xuICAgIC8qKlxuICAgICAqIEFjdGl2ZXIgbGUgbG9hZGVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9uXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkucGFnZS5kaW1tZXJcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZlciBsZSBsb2FkZXJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb2ZmXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLnBhZ2UuZGltbWVyXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXUgbWVudVxuICAgKlxuICAgKiBAY2xhc3MgR1VJLm1lbnVcbiAgICovXG4gIG1lbnU6IHtcbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIGQndW5lIHNpZGViYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY29uZmlnU2lkZWJhclxuICAgICAqL1xuICAgIGNvbmZpZ1NpZGViYXI6IGZ1bmN0aW9uKGlkLCBjb2xvcikge1xuICAgICAgJCggaWQgKVxuICAgICAgICAuc2lkZWJhcih7XG4gICAgICAgICAgb25TaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIGlkICsgXCItYnRuXCIgKS5hZGRDbGFzcyggY29sb3IgKyBcIi1pdGVtXCIgKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uSGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCBpZCArIFwiLWJ0blwiICkucmVtb3ZlQ2xhc3MoIGNvbG9yICsgXCItaXRlbVwiICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc2lkZWJhciggXCJzZXR0aW5nXCIsIFwidHJhbnNpdGlvblwiLCBcIm92ZXJsYXlcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIHVuZSBzaWRlYmFyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZVNpZGViYXJcbiAgICAgKi9cbiAgICB0b2dnbGVTaWRlYmFyOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIENvbW1lIGlsIHkgYSBwbHVzaWV1cnMgYm91dG9ucyBwb3VyIGxlIG1lbnUsIGMnZXN0IGfDqXLDqSBwYXIgdW5lIGNsYXNzZVxuICAgICAgaWYgKCQoIHRoaXMgKS5oYXNDbGFzcyhcInRvZ2dsZS1tZW51XCIpKSB7XG4gICAgICAgICQoIFwiI21lbnVcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIExlIHBhdHRlcm4gZGUgbm9tbWFnZSBlc3QgbGUgc3VpdmFudCA6IHNpZGViYXJuYW1lLWJ0blxuICAgICAgICB2YXIgYnRuSWQgPSAkKCB0aGlzICkuYXR0ciggXCJpZFwiICksXG4gICAgICAgICAgICBzaWRlYmFySWQgPSBidG5JZC5zdWJzdHIoMCwgYnRuSWQubGFzdEluZGV4T2YoXCItXCIpKTtcblxuICAgICAgICAkKCBcIiNcIiArIHNpZGViYXJJZCApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGVyL0NhY2hlciB0b3V0ZXMgbGVzIHNpZGViYXJzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRvZ2dsZUFsbFxuICAgICAqL1xuICAgIHRvZ2dsZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIi5zaWRlYmFyXCIgKS5zaWRlYmFyKCBcInRvZ2dsZVwiICk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyDDoCBsYSBwbGF5bGlzdFxuICAgKlxuICAgKiBAY2xhc3MgR1VJLnBsYXlsaXN0XG4gICAqL1xuICBwbGF5bGlzdDoge1xuICAgIC8qKlxuICAgICAqIFLDqWN1cMOpcmF0aW9uIGQndW5lIHBsYXlsaXN0IHNhdXZlZ2FyZMOpZSBkYW5zIGxlIGxvY2FsIHN0b3JhZ2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmV0cmlldmVcbiAgICAgKi9cbiAgICByZXRyaWV2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2F2ZWRQbGF5bGlzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWxpc3RcIiksXG4gICAgICAgICAgaWRzID0gW107XG5cbiAgICAgIGlmIChzYXZlZFBsYXlsaXN0ICE9PSBudWxsKSB7XG4gICAgICAgIFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzID0gSlNPTi5wYXJzZShzYXZlZFBsYXlsaXN0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWRzLnB1c2goUGxheWxpc3Quc2VsZWN0ZWRUcmFja3NbaV0uX2lkKTtcbiAgICAgICAgfVxuICAgICAgICBQbGF5bGlzdC50cmFja3NJZHMgPSBpZHM7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90UmFuZG9tXG4gICAgICovXG4gICAgbm90UmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmFuZG9tKGZhbHNlKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJhbmRvbVwiLCBcIm1pbnVzXCIgKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJub3QtcmFuZG9tLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkxlY3R1cmUgYWzDqWF0b2lyZSBkw6lzYWN0aXbDqWVcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIGxlY3R1cmUgYWzDqWF0b2lyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgKi9cbiAgICByYW5kb206IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yYW5kb20odHJ1ZSk7XG4gICAgICAkKCBcIiNub3QtcmFuZG9tLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwibWludXNcIiwgXCJyYW5kb21cIiApO1xuICAgICAgJCggXCIjbm90LXJhbmRvbS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyYW5kb20tYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJMZWN0dXJlIGFsw6lhdG9pcmUgYWN0aXbDqWVcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkZSBsYSByw6lww6l0aXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm9SZXBlYXRcbiAgICAgKi9cbiAgICBub1JlcGVhdDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJlcGVhdCgwKTtcbiAgICAgICQoIFwiI3JlcGVhdC1hbGwtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZWZyZXNoXCIsIFwibWludXNcIiApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJuby1yZXBlYXQtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJQYXMgZGUgcsOpcMOpdGl0aW9uXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWN0aXZhdGlvbiBkZSBsYSByw6lww6l0aXRpb24gZCd1biBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlcGVhdE9uZVxuICAgICAqL1xuICAgIHJlcGVhdE9uZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJlcGVhdCgyKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcIm1pbnVzXCIsIFwicmVwZWF0XCIgKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyZXBlYXQtb25lLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiUsOpcMOpdGl0aW9uIGR1IG1vcmNlYXUgZW4gY291cnNcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkZSB0b3VzIGxlcyBtb3JjZWF1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXBlYXRBbGxcbiAgICAgKi9cbiAgICByZXBlYXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yZXBlYXQoMSk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVwZWF0XCIsIFwicmVmcmVzaFwiICk7XG4gICAgICAkKCBcIiNyZXBlYXQtb25lLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJlcGVhdC1hbGwtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJSw6lww6l0aXRpb24gZGUgdG91cyBsZXMgbW9yY2VhdXhcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCBtdXRlXG4gICAgICovXG4gICAgbXV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm11dGUodHJ1ZSk7XG4gICAgICAkKCBcIiN1bm11dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJ1bm11dGVcIiwgXCJtdXRlXCIgKTtcbiAgICAgICQoIFwiI3VubXV0ZS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJtdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlNvbiBjb3Vww6kgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGR1IG1vZGUgc2lsZW5jaWV1eFxuICAgICAqXG4gICAgICogQG1ldGhvZCB1bm11dGVcbiAgICAgKi9cbiAgICB1bm11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5tdXRlKGZhbHNlKTtcbiAgICAgICQoIFwiI211dGUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJtdXRlXCIsIFwidW5tdXRlXCIgKTtcbiAgICAgICQoIFwiI211dGUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwidW5tdXRlLWJ0blwiICk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiU29uIHLDqXRhYmxpICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTYXV2ZWdhcmRlIGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlIGRhbnMgbGUgbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzYXZlSW5Ccm93c2VyXG4gICAgICovXG4gICAgc2F2ZUluQnJvd3NlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGxheWxpc3QgPSBKU09OLnN0cmluZ2lmeShQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlsaXN0XCIsIHBsYXlsaXN0KTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBzYXV2ZWdhcmTDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNhdXZlZ2FyZGUgZGUgbGEgcGxheWxpc3QgY291cmFudGUgc3VyIERlZXplclxuICAgICAqXG4gICAgICogQG1ldGhvZCBzYXZlT25EZWV6ZXJcbiAgICAgKi9cbiAgICBzYXZlT25EZWV6ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHVzZXIgIT09IG51bGwpIHtcbiAgICAgICAgRFouYXBpKFwidXNlci9tZS9wbGF5bGlzdHNcIiwgXCJQT1NUXCIsIHt0aXRsZSA6IFwiSEFSTU9ORUVaRVJcIn0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgIFBsYXlsaXN0LmRlZXplcklkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgIERaLmFwaShcInBsYXlsaXN0L1wiICsgcmVzcG9uc2UuaWQgKyBcIi90cmFja3NcIiwgXCJQT1NUXCIsIHtzb25nczogUGxheWxpc3QudHJhY2tzSWRzLmpvaW4oKX0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJWb3RyZSBwbGF5bGlzdCBlc3Qgc3VyIERlZXplciAhXCIsIDUpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlZvdXMgbifDqnRlcyBwYXMgY29ubmVjdMOpKGUpICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBFeHBvcnQgQ1NWIGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGV4cG9ydFxuICAgICAqL1xuICAgIGV4cG9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNjc3YtZXhwb3J0XCIgKS50YWJsZVRvQ1NWKCk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiUGxheWxpc3QgZXhwb3J0w6llICFcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBFZmZhY2VtZW50IGRlIGxhIHBsYXlsaXN0IGNvdXJhbnRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlbGV0ZVxuICAgICAqL1xuICAgIGRlbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiVm91bGV6LXZvdXMgdnJhaW1lbnQgc3VwcHJpbWVyIHZvdHJlIHBsYXlsaXN0ID88YnI+XCI7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiQ2VsbGUtY2kgc2VyYSBzdXBwcmltw6llIGTDqWZpbml0aXZlbWVudCBkdSBuYXZpZ2F0ZXVyIGV0IHN1ciBEZWV6ZXIuXCI7XG4gICAgICAgIGFsZXJ0aWZ5LmRlZmF1bHRzLmdsb3NzYXJ5LnRpdGxlID0gXCJBdHRlbnRpb24gIVwiO1xuICAgICAgICAvLyBTaSBsJ3V0aWxpc2F0ZXVyIGVzdCBkJ2FjY29yZCA6XG4gICAgICAgIGFsZXJ0aWZ5LmNvbmZpcm0obWVzc2FnZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gLSBvbiBzdXBwcmltZSBsYSBwbGF5bGlzdCBkZSBsYSBzZXNzaW9uIGNvdXJhbnRlXG4gICAgICAgICAgUGxheWxpc3QucmVzZXQoKTtcbiAgICAgICAgICAvLyAtIG9uIHN1cHByaW1lIGxhIHBsYXlsaXN0IGR1IGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5bGlzdFwiKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwbGF5bGlzdFwiKTtcbiAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBlZmZhY8OpZSBkdSBuYXZpZ2F0ZXVyICFcIiwgNSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdVSS5hbGVydChcIndhcm5pbmdcIiwgXCJQbGF5bGlzdCBub24gc2F1dmVnYXJkw6llIGxvY2FsZW1lbnRcIiwgNSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIC0gb24gc3VwcHJpbWUgbGEgcGxheWxpc3Qgc3VyIERlZXplclxuICAgICAgICAgIGlmIChQbGF5bGlzdC5kZWV6ZXJJZCAhPSAtMSkge1xuICAgICAgICAgICAgRFouYXBpKFwicGxheWxpc3QvXCIgKyBQbGF5bGlzdC5kZWV6ZXJJZCwgXCJERUxFVEVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IGVmZmFjw6llIHN1ciBEZWV6ZXIgIVwiLCA1KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHVUkuYWxlcnQoXCJ3YXJuaW5nXCIsIFwiUGxheWxpc3Qgbm9uIHNhdXZlZ2FyZMOpZSBzdXIgRGVlemVyXCIsIDUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuc2V0KFwibGFiZWxzXCIsIHsgb2s6XCJPdWlcIiwgY2FuY2VsOlwiTm9uXCIgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlZvdHJlIHBsYXlsaXN0IGVzdCB2aWRlICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGF1dG9tYXRpcXVlIGRlIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXV0b2NoYW5nZVxuICAgICAqL1xuICAgICBhdXRvY2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgICBEWi5FdmVudC5zdWJzY3JpYmUoXCJ0cmFja19lbmRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICBHVUkucGxheWxpc3QubmV4dCgpO1xuICAgICAgIH0pO1xuICAgICB9LFxuICAgIC8qKlxuICAgICAqIFBhc3NhZ2UgYXUgbW9yY2VhdSBwcsOpY8OpZGVudFxuICAgICAqXG4gICAgICogQG1ldGhvZCBwcmV2aW91c1xuICAgICAqL1xuICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucHJldigpO1xuICAgICAgJCggXCIjcGxheWxpc3RcIiApLnRyaWdnZXIoIFwidHJhY2tDaGFuZ2VkXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFsbGVyIGVuIGFycmnDqHJlIGRhbnMgbGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBiYWNrXG4gICAgICovXG4gICAgYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uID4gMTApIHtcbiAgICAgICAgR1VJLnBsYXllci50cmFja1Bvc2l0aW9uIC09IDEwO1xuICAgICAgfVxuICAgICAgR1VJLnBsYXllci5zZWVrKEdVSS5wbGF5ZXIudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMaXJlIGxhIHBsYXlsaXN0IGRlcHVpcyBsZSBkw6lidXRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKEdVSS5wbGF5ZXIudHJhY2tzTG9hZGVkKSB7XG4gICAgICAgIEdVSS5wbGF5ZXIucGxheSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLnBsYXllci5wbGF5VHJhY2tzKFBsYXlsaXN0LnRyYWNrc0lkcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgR1VJLnBsYXllci50cmFja3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICQoIFwiI3BsYXlsaXN0XCIgKS50cmlnZ2VyKCBcInRyYWNrQ2hhbmdlZFwiICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogTGlyZSBsYSBwbGF5bGlzdCDDoCBwYXJ0aXIgZCd1biBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHBsYXlGcm9tXG4gICAgICovXG4gICAgcGxheUZyb206IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoJCggdGhpcyApLmZpbmQoIFwiI3BsYXlsaXN0LXRyYWNrLWluZGV4XCIgKS52YWwoKSk7XG4gICAgICBHVUkucGxheWVyLnBsYXlUcmFja3MoUGxheWxpc3QudHJhY2tzSWRzLCBpbmRleCk7XG4gICAgICAkKCBcIiNwbGF5bGlzdFwiICkudHJpZ2dlciggXCJ0cmFja0NoYW5nZWRcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWV0dHJlIGVuIHBhdXNlIHVuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgKi9cbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnBhdXNlKCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMZWN0dXJlIG91IHBhdXNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHBsYXlQYXVzZVxuICAgICAqL1xuICAgIHBsYXlQYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLmlzUGxheWluZygpID8gR1VJLnBsYXlsaXN0LnBhdXNlKCkgOiBHVUkucGxheWxpc3QucGxheSgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWxsZXIgZW4gYXZhbnQgZGFucyBsZSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGJhY2tcbiAgICAgKi9cbiAgICBmb3J0aDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uIDwgOTApIHtcbiAgICAgICAgR1VJLnBsYXllci50cmFja1Bvc2l0aW9uICs9IDEwO1xuICAgICAgfVxuICAgICAgR1VJLnBsYXllci5zZWVrKEdVSS5wbGF5ZXIudHJhY2tQb3NpdGlvbik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBQYXNzYWdlIGF1IG1vcmNlYXUgc3VpdmFudFxuICAgICAqXG4gICAgICogQG1ldGhvZCBuZXh0XG4gICAgICovXG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm5leHQoKTtcbiAgICAgICQoIFwiI3BsYXlsaXN0XCIgKS50cmlnZ2VyKCBcInRyYWNrQ2hhbmdlZFwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBam91dCBkJ3VuIG1vcmNlYXUgw6AgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkVHJhY2tcbiAgICAgKi9cbiAgICBhZGRUcmFjazogZnVuY3Rpb24oZWx0SWQpIHtcbiAgICAgIHZhciB0cmFjayA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KCQoIFwiI1wiICsgZWx0SWQgKS5uZXh0KCkudmFsKCkpKTtcbiAgICAgIFBsYXlsaXN0LmFkZFRyYWNrKHRyYWNrKTtcbiAgICAgIEdVSS5wbGF5ZXIuYWRkVG9RdWV1ZShbdHJhY2suX2lkXSk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiTW9yY2VhdSBham91dMOpIMOgIHZvdHJlIHBsYXlsaXN0XCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWN0aW9ucyDDoCBlZmZlY3R1ZXIgYXByw6hzIHN1cHByZXNzaW9uIGQndW4gbW9yY2VhdSBkZSBsYSBwbGF5bGlzdFxuICAgICAqXG4gICAgICogQG1ldGhvZCByZW1vdmVUcmFja1xuICAgICAqL1xuICAgIHJlbW92ZVRyYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIudHJhY2tzTG9hZGVkID0gZmFsc2U7XG4gICAgICBHVUkucGxheWVyLmlzUGxheWluZygpID8gR1VJLnBsYXlsaXN0LnBsYXkoKSA6IEdVSS5wbGF5ZXIucGxheVRyYWNrcyhbXSk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiTW9yY2VhdSBzdXBwcmltw6kgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbCdpY8O0bmUgZGUgbGVjdHVyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBpY29uXG4gICAgICovXG4gICAgaWNvbjogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBPbiB1dGlsaXNlIHNldFRpbWVvdXQgY2FyIERlZXplciBuZSBwcm9wb3NlIHBhcyBkZSBjYWxsYmFjayBwb3VyIGxlcyBjb250csO0bGVzXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5kZXggPSBEWi5wbGF5ZXIuZ2V0Q3VycmVudEluZGV4KCk7XG4gICAgICAgICQoIFwiLnBsYXlsaXN0LWl0ZW1cIiwgXCIjcGxheWxpc3RcIiApLmZpbmQoIFwiLnNwaW5uZXJcIiApLmZhZGVPdXQoKTtcbiAgICAgICAgJCggXCIjdHJhY2stXCIgKyBpbmRleCApLmZpbmQoIFwiLnNwaW5uZXJcIiApLmZhZGVJbigpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTdXBwcmVzc2lvbiBkZSBsJ2FsZXJ0ZVxuICAgICAqXG4gICAgICogQG1ldGhvZCByZW1vdmVXYXJuaW5nXG4gICAgICovXG4gICAgcmVtb3ZlV2FybmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAkKCB0aGlzICkuaGlkZSgpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXV4IGZhdm9yaXNcbiAgICpcbiAgICogQGNsYXNzIEdVSS5mYXZvcml0ZXNcbiAgICovXG4gIGZhdm9yaXRlczoge1xuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbGEgdmlzaWJpbGl0w6kgZGUgbCdpUG9kXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGlwb2RcbiAgICAgKi9cbiAgICBpcG9kOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkaXBvZCA9ICQoIFwiI2lwb2Qtd3JhcHBlclwiICksXG4gICAgICAgICAgJGlwb2RTdGF0ZSA9ICQoIFwiI2Zhdi1pcG9kIC5zdGF0ZVwiICk7XG4gICAgICAkaXBvZC5pcyggXCI6dmlzaWJsZVwiICkgPyAkaXBvZC5mYWRlT3V0KCkgOiAkaXBvZC5mYWRlSW4oKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJGlwb2RTdGF0ZSwgXCJpUG9kIGFjdGl2w6kgIVwiLCBcImlQb2QgZMOpc2FjdGl2w6kgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIGluZm9idWxsZXNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9vbHRpcFxuICAgICAqL1xuICAgIHRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0b29sdGlwU3RhdGUgPSAkKCBcIiNmYXYtdG9vbHRpcCAuc3RhdGVcIiApO1xuICAgICAgaWYgKEdVSS50b29sdGlwQWxsb3dlZCkge1xuICAgICAgICBHVUkudG9vbHRpcEFsbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgJCggXCJbZGF0YS10aXRsZSAhPSAnJ10sIFtkYXRhLWNvbnRlbnQgIT0gJyddXCIgKS5wb3B1cCggXCJkZXN0cm95XCIgKTsgLy8gU2VtYW50aWMgVUlcbiAgICAgICAgJCggXCJbdGl0bGUgIT0gJyddXCIgKS50b29sdGlwKCBcImRlc3Ryb3lcIiApOyAvLyBqUXVlcnkgVUlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS50b29sdGlwQWxsb3dlZCA9IHRydWU7XG4gICAgICAgIEdVSS50b29sdGlwcygpO1xuICAgICAgfVxuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkdG9vbHRpcFN0YXRlLCBcIkluZm9idWxsZXMgYWN0aXbDqWVzICFcIiwgXCJJbmZvYnVsbGVzIGTDqXNhY3RpdsOpZXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIG5vdGlmaWNhdGlvbnNcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90aWZ5XG4gICAgICovXG4gICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkbm90aWZTdGF0ZSA9ICQoIFwiI2Zhdi1ub3RpZnkgLnN0YXRlXCIgKTtcbiAgICAgIEdVSS5ub3RpZkFsbG93ZWQgPyAoR1VJLm5vdGlmQWxsb3dlZCA9IGZhbHNlKSA6IChHVUkubm90aWZBbGxvd2VkID0gdHJ1ZSk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRub3RpZlN0YXRlLCBcIk5vdGlmaWNhdGlvbnMgYWN0aXbDqWVzICFcIiwgXCJOb3RpZmljYXRpb25zIGTDqXNhY3RpdsOpZXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIHNvbnMgZCdhbWJpYW5jZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3VuZFxuICAgICAqL1xuICAgIHNvdW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkc291bmRTdGF0ZSA9ICQoIFwiI2Zhdi1zb3VuZCAuc3RhdGVcIiApO1xuICAgICAgR1VJLnNvdW5kQWxsb3dlZCA/IChHVUkuc291bmRBbGxvd2VkID0gZmFsc2UpIDogKEdVSS5zb3VuZEFsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJHNvdW5kU3RhdGUsIFwiU29ucyBkJ2FtYmlhbmNlIGFjdGl2w6lzICFcIiwgXCJTb25zIGQnYW1iaWFuY2UgZMOpc2FjdGl2w6lzICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGwnYXV0b2NvbXBsw6l0aW9uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIGF1dG9jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGF1dG9jb21wbGV0ZVN0YXRlID0gJCggXCIjZmF2LWF1dG9jb21wbGV0ZSAuc3RhdGVcIiApO1xuICAgICAgaWYgKEdVSS5hdXRvY29tcGxldGVBbGxvd2VkKSB7XG4gICAgICAgICQoIFwiI2F1dG9jb21wbGV0ZVwiICkuZmFkZU91dCgpO1xuICAgICAgICBHVUkuYXV0b2NvbXBsZXRlQWxsb3dlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLmF1dG9jb21wbGV0ZUFsbG93ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkYXV0b2NvbXBsZXRlU3RhdGUsIFwiQXV0b2NvbXBsw6l0aW9uIGFjdGl2w6llICFcIiwgXCJBdXRvY29tcGzDqXRpb24gZMOpc2FjdGl2w6llICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlcyBkb3VibG9ucyBkYW5zIGxlcyBzdWdnZXN0aW9uc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBkdXBsaWNhdGVcbiAgICAgKi9cbiAgICBkdXBsaWNhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRkdXBsaWNhdGVTdGF0ZSA9ICQoIFwiI2Zhdi1kdXBsaWNhdGUgLnN0YXRlXCIgKTtcbiAgICAgIFNvcnRpbmcuZHVwbGljYXRlc0FsbG93ZWQgPyAoU29ydGluZy5kdXBsaWNhdGVzQWxsb3dlZCA9IGZhbHNlKSA6IChTb3J0aW5nLmR1cGxpY2F0ZXNBbGxvd2VkID0gdHJ1ZSk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRkdXBsaWNhdGVTdGF0ZSwgXCJEb3VibG9ucyBhY3RpdsOpcyAhXCIsIFwiRG91YmxvbnMgZMOpc2FjdGl2w6lzICFcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGQndW5lIHRvbMOpcmFuY2UgcG91ciBsZSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0ZW1wb1JhbmdlXG4gICAgICovXG4gICAgdGVtcG9SYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGVtcG9WYXJpYXRpb24gPSAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ11cIiApLnZhbCgpO1xuICAgICAgJCggXCJpbnB1dFt0eXBlPSdyYW5nZSddICsgc3BhblwiICkudGV4dCggdGVtcG9WYXJpYXRpb24gKyBcIiAlXCIgKTtcbiAgICAgIEdVSS50ZW1wb1ZhcmlhdGlvbiA9ICh0ZW1wb1ZhcmlhdGlvbiAvIDEwMCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgcGFyIGTDqWZhdXRcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVmYXVsdFNvcnRpbmdcbiAgICAgKi9cbiAgICBkZWZhdWx0U29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJkZWZhdWx0XCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgZmF2b3Jpc2FudCBsZSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0ZW1wb0ZpcnN0U29ydGluZ1xuICAgICAqL1xuICAgIHRlbXBvRmlyc3RTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcInRlbXBvRmlyc3RcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBmYXZvcmlzYW50IGxhIHRvbmFsaXTDqVxuICAgICAqXG4gICAgICogQG1ldGhvZCBrZXlGaXJzdFNvcnRpbmdcbiAgICAgKi9cbiAgICBrZXlGaXJzdFNvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwia2V5Rmlyc3RcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBjcm9pc3NhbnQgZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXNjVGVtcG9Tb3J0aW5nXG4gICAgICovXG4gICAgYXNjVGVtcG9Tb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImFzY1RlbXBvXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGRlIGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50IGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlc2NUZW1wb1NvcnRpbmdcbiAgICAgKi9cbiAgICBkZXNjVGVtcG9Tb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlc2NUZW1wb1wiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkdSB0cmkgcGxhY2Vib1xuICAgICAqXG4gICAgICogQG1ldGhvZCBub1NvcnRpbmdcbiAgICAgKi9cbiAgICBub1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwibm9uZVwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ2hhbmdlbWVudCBkJ8OpdGF0IChvbi9vZmYpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNoYW5nZVN0YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICRzdGF0ZSBDaGFtcCBjYWNow6kgY29udGVuYW50IGwnw6l0YXQgZGUgbCdvYmpldCBkYW5zIGxlIERPTVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwb3NpdGl2ZU1lc3NhZ2UgTWVzc2FnZSBkJ2FjdGl2YXRpb24gKHZlcnQpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5lZ2F0aXZlTWVzc2FnZSBNZXNzYWdlIGRlIGTDqXNhY3RpdmF0aW9uIChyb3VnZSlcbiAgICAgKi9cbiAgICBjaGFuZ2VTdGF0ZTogZnVuY3Rpb24oJHN0YXRlLCBvbk1lc3NhZ2UsIG9mZk1lc3NhZ2UpIHtcbiAgICAgIGlmICgkc3RhdGUudmFsKCkgPT0gXCJvblwiKSB7XG4gICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIG9mZk1lc3NhZ2UsIDUpO1xuICAgICAgICAkc3RhdGUudmFsKCBcIm9mZlwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIG9uTWVzc2FnZSwgNSk7XG4gICAgICAgICRzdGF0ZS52YWwoIFwib25cIiApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgbGVzIMOpbMOpbWVudHMgcmVsYXRpZnMgYXV4IGFtYmlhbmNlc1xuICAgKlxuICAgKiBAY2xhc3MgR1VJLmF0bW9zcGhlcmVzXG4gICAqL1xuICBhdG1vc3BoZXJlczoge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIGR1IHBsdWdpbiBWZWdhcyBwb3VyIGxlcyBiYWNrZ3JvdW5kcyBhbmltw6lzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHZlZ2FzXG4gICAgICovXG4gICAgYmFja2dyb3VuZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCQoIHdpbmRvdyApLndpZHRoKCkgPj0gNjAwKSB7XG4gICAgICAgICQoIFwiI21haW5cIiApLnZlZ2FzKHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwic3dpcmxMZWZ0XCIsXG4gICAgICAgICAgICBzbGlkZTogMCxcbiAgICAgICAgICAgIHNsaWRlczogW1xuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvbmV1dHJhbC5qcGdcIiB9LFxuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvcm9jay5qcGdcIiB9LFxuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvZWxlY3Ryby5qcGdcIiB9LFxuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvaGlwaG9wLmpwZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9mb2xrLmpwZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9jbGFzc2ljYWwuanBnXCIgfSxcbiAgICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2phenouanBnXCIgfSxcbiAgICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL21ldGFsLmpwZ1wiIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICAgICQoIFwiI21haW5cIiApLnZlZ2FzKCdwYXVzZScpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQ2hhbmdlbWVudCBkJ2FtYmlhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFwcGx5XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEluZGljZSBkZSBsJ2FtYmlhbmNlIGRhbnMgVmVnYXNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXRtbyBOb20gZGUgbCdhbWJpYW5jZVxuICAgICAqL1xuICAgIGFwcGx5OiBmdW5jdGlvbihpbmRleCwgYXRtbykge1xuICAgICAgJCggXCIjXCIgKyBhdG1vICsgXCItYXRtb1wiICkuYWRkQ2xhc3MoIFwiZ3JlZW4taXRlbVwiICk7XG4gICAgICAkKCBcIiNcIiArIGF0bW8gKyBcIi1hdG1vXCIgKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCBcImdyZWVuLWl0ZW1cIiApO1xuICAgICAgJCggXCIjbWFpblwiICkudmVnYXMoXCJqdW1wXCIsIGluZGV4KTtcbiAgICAgIC8vICQoIFwiLnB1c2hlclwiICkuYXR0ciggXCJzdHlsZVwiLCBcImJhY2tncm91bmQ6dXJsKCdpbWFnZXMvYmFja2dyb3VuZC9cIiArIGF0bW8gKyBcIi5qcGcnKSBuby1yZXBlYXQgY2VudGVyIGNlbnRlciBmaXhlZCAhaW1wb3J0YW50XCIgKTtcbiAgICAgIGlmIChHVUkuc291bmRBbGxvd2VkICYmIGF0bW8gIT0gXCJuZXV0cmFsXCIpIHtcbiAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKCBcIi4vc291bmRzL1wiICsgYXRtbyArIFwiLm9nZ1wiKTtcbiAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgbmV1dHJlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5ldXRyYWxcbiAgICAgKi9cbiAgICBuZXV0cmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSgwLCBcIm5ldXRyYWxcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBSb2NrXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJvY2tcbiAgICAgKi9cbiAgICByb2NrOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSgxLCBcInJvY2tcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBFbGVjdHJvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGVsZWN0cm9cbiAgICAgKi9cbiAgICBlbGVjdHJvOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSgyLCBcImVsZWN0cm9cIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBIaXAtSG9wXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGhpcGhvcFxuICAgICAqL1xuICAgIGhpcGhvcDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoMywgXCJoaXBob3BcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBGb2xrXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZvbGtcbiAgICAgKi9cbiAgICBmb2xrOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSg0LCBcImZvbGtcIik7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBDbGFzc2lxdWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY2xhc3NpY2FsXG4gICAgICovXG4gICAgY2xhc3NpY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSg1LCBcImNsYXNzaWNhbFwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIEphenpcbiAgICAgKlxuICAgICAqIEBtZXRob2QgamF6elxuICAgICAqL1xuICAgIGpheno6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDYsIFwiamF6elwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIE1ldGFsXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG1ldGFsXG4gICAgICovXG4gICAgbWV0YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDcsIFwibWV0YWxcIik7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdSBjb21wdGUgdXRpbGlzYXRldXJcbiAgICpcbiAgICogQGNsYXNzIEdVSS5hY2NvdW50XG4gICAqL1xuICBhY2NvdW50OiB7XG4gICAgLyoqXG4gICAgICogVsOpcmlmaWNhdGlvbiB2aXNhbnQgw6AgY29ubmHDrnRyZSBsZSBzdGF0dXQgZGUgY29ubmV4aW9uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHN0YXR1c1xuICAgICAqL1xuICAgIHN0YXR1czogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgXHRpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgICAgR1VJLmFjY291bnQuaW5mbygpO1xuICAgICAgXHR9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbGEgY29ubmV4aW9uIGQndW4gdXRpbGlzYXRldXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9naW5cbiAgICAgKi9cbiAgICBsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnVzZXIgPT09IG51bGwpIHtcbiAgICAgICAgRFoubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlICYmIHJlc3BvbnNlLnN0YXR1cyA9PSBcImNvbm5lY3RlZFwiKSB7IC8vIFNpIHRvdXQgc2UgcGFzc2UgYmllblxuICAgICAgICAgICAgR1VJLmFjY291bnQuaW5mbygpO1xuICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkNvbm5leGlvbiBPSyAhXCIsIDMpO1xuICAgICAgICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjdXNlclwiLCBcIm1hcm9vblwiICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7IHBlcm1zOiBcImJhc2ljX2FjY2VzcyxtYW5hZ2VfbGlicmFyeSxkZWxldGVfbGlicmFyeVwiIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsYSBkw6ljb25uZXhpb24gZCd1biB1dGlsaXNhdGV1clxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2dvdXRcbiAgICAgKi9cbiAgICBsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoubG9nb3V0KCk7XG4gICAgICBHVUkudXNlciA9IG51bGw7XG4gICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuaGlkZSgpO1xuICAgICAgJCggXCIjdXNlci1ub3QtY29ubmVjdGVkXCIgKS5zaG93KCk7XG4gICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiRMOpY29ubmV4aW9uIE9LICFcIiwgMyk7XG4gICAgICAkKCBcIiN1c2VyXCIgKS5zaWRlYmFyKCBcInRvZ2dsZVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIGQndW4gdXRpbGlzYXRldXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaW5mb1xuICAgICAqL1xuICAgIGluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgRFouYXBpKFwiL3VzZXIvbWVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIHVzZXIgPSBuZXcgVXNlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmluc2NyaXB0aW9uX2RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5saW5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UucGljdHVyZV9zbWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgIEdVSS51c2VyID0gdXNlcjtcbiAgICAgICAgJCggXCIjdXNlci1pbWdcIiApLmF0dHIoeyBzcmM6dXNlci5nZXRQaWN0dXJlKCksIGFsdDp1c2VyLmdldE5hbWUoKSB9KTtcbiAgICAgICAgJCggXCIjdXNlci1uYW1lXCIgKS50ZXh0KCB1c2VyLmdldE5hbWUoKSApLmF0dHIoIFwiaHJlZlwiLCB1c2VyLmdldExpbmsoKSApO1xuICAgICAgICAkKCBcIiN1c2VyLWRhdGVcIiApLnRleHQoIFwiSW5zY3JpdCBsZSBcIiArIHVzZXIuZ2V0SW5zY3JpcHRpb25EYXRlKCkgKTtcbiAgICAgICAgJCggXCIjdXNlci1ub3QtY29ubmVjdGVkXCIgKS5oaWRlKCk7XG4gICAgICAgICQoIFwiI3VzZXItY29ubmVjdGVkXCIgKS5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGRpdmVycyDDqXbDqW5lbWVudHNcbiAgICpcbiAgICogQGNsYXNzIEdVSS5taXNjXG4gICAqL1xuICBtaXNjOiB7XG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkdSBjbGljIHN1ciBsZSBsb2dvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ29cbiAgICAgKi9cbiAgICBsb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5taXNjLnNob3dNb2RhbCggJCggXCIjYWJvdXRcIiApICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGR1IGNsaWMgc3VyIGxhIGNhc2UgZCdhaWRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGhlbHBcbiAgICAgKi9cbiAgICBoZWxwOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5taXNjLnNob3dNb2RhbCggJCggXCIjaGVscFwiICkgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGFnZSBkJ3VuZSBib8OudGUgbW9kYWxlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNob3dNb2RhbFxuICAgICAqL1xuICAgIHNob3dNb2RhbDogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XG4gICAgICAkc2VsZWN0b3IubW9kYWwoIFwic2hvd1wiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hhZ2Ugb3Ugbm9uIGR1IGNhcm91c2VsIGRlIHLDqXN1bHRhdHNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlQ2Fyb3VzZWxcbiAgICAgKi9cbiAgICB0b2dnbGVDYXJvdXNlbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRyYWNrcyA9ICQoIFwiI3RyYWNrc1wiICksXG4gICAgICAgICAgJHRvZ2dsZSA9ICQoIFwiI3RvZ2dsZS1jYXJvdXNlbCBpXCIgKTtcblxuICAgICAgaWYgKCEkdHJhY2tzLmlzKCBcIjplbXB0eVwiICkgJiYgJHRyYWNrcy5pcyggXCI6dmlzaWJsZVwiICkpIHtcbiAgICAgICAgJHRyYWNrcy5zbGlkZVVwKCk7XG4gICAgICAgICR0b2dnbGVcbiAgICAgICAgICAuc3dpdGNoQ2xhc3MoIFwidXBcIiwgXCJkb3duXCIgKVxuICAgICAgICAgIC5jc3MoIFwiYm9yZGVyLWNvbG9yXCIsIFwiI0YwNEEzQ1wiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoISR0cmFja3MuaXMoIFwiOmVtcHR5XCIgKSkge1xuICAgICAgICAgIGlmIChHVUkuc2VhcmNoQWxsb3dlZCkge1xuICAgICAgICAgICAgJHRyYWNrcy5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICR0b2dnbGVcbiAgICAgICAgICAgICAgLnN3aXRjaENsYXNzKCBcImRvd25cIiwgXCJ1cFwiKVxuICAgICAgICAgICAgICAuY3NzKCBcImJvcmRlci1jb2xvclwiLCBcIiMxODhBRTNcIiApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBHVUkuc2VhcmNoLndhcm5pbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJBdWN1bmUgcmVjaGVyY2hlIGVmZmVjdHXDqWUgIVwiLCA1KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL0dVSS5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIENsYXNzZSBtZXR0YW50IGVuIMWTdXZyZSBsZSBwYXR0ZXJuIEl0ZXJhdG9yLlxuICogQ2V0dGUgY2xhc3NlIGZvdXJuaXQgdW4gbW95ZW4gZCdpdMOpcmVyIHBsdXMgc2ltcGxlbWVudCBzdXIgbGVzIGNvbGxlY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgSXRlcmF0b3JcbiAqIEBjbGFzcyBJdGVyYXRvclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtcyBDb2xsZWN0aW9uIGQnb2JqZXRzIMOgIHBhcmNvdXJpclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yID0gZnVuY3Rpb24oaXRlbXMpIHtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSXRlcmF0b3IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEl0ZXJhdG9yIGRvaXQgw6p0cmUgaW5zdGFuY2nDqWUgYXZlYyBsJ29ww6lyYXRldXIgwqsgbmV3IMK7XCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IGRlIGJhc2Ugw6AgcGFydGlyIGR1cXVlbCBjb21tZW5jZSB1bmUgaXTDqXJhdGlvbi5cbiAgICpcbiAgICogQHByb3BlcnR5IGluZGV4XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRoaXMuX2luZGV4ID0gMDtcbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gZCdvYmpldHMgw6AgcGFyY291cmlyLlxuICAgKlxuICAgKiBAcHJvcGVydHkgaXRlbXNcbiAgICogQHR5cGUge0FycmF5fVxuICAgKiBAZGVmYXVsdCBbXVxuICAgKi9cbiAgdGhpcy5faXRlbXMgPSBpdGVtcztcblxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbCdJdGVyYXRvclxuICovXG5JdGVyYXRvci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBNw6l0aG9kZSB2w6lyaWZpYW50IHMnaWwgeSBhIHVuIMOpbMOpbWVudCBzdWl2YW50IGRhbnMgbGEgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBoYXNOZXh0XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgcydpbCB5IGEgdW4gw6lsw6ltZW50IHN1aXZhbnRcbiAgICovXG4gIGhhc05leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgfSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIHJlbnZveWFudCBsJ8OpbMOpbWVudCBjb3VyYW50IGxvcnMgZGUgbCdpdMOpcmF0aW9uLlxuICAgKiBMJ2luZGV4IGVzdCBwYXIgYWlsbGV1cnMgaW5jcsOpbWVudMOpIHBvdXIgY29udGludWVyIGxlIHBhcmNvdXJzLlxuICAgKlxuICAgKiBAbWV0aG9kIG5leHRcbiAgICogQHJldHVybiB7T2JqZWN0fSBMJ29iamV0IGNvdXJhbnQgZGUgbGEgY29sbGVjdGlvblxuICAgKi9cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zW3RoaXMuX2luZGV4KytdO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvSXRlcmF0b3IuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZm91cm5pc3NhbnQgZGVzIGVudGl0w6lzIHJlbGF0aXZlcyDDoCBsYSBtdXNpcXVlLlxuICpcbiAqIEBtb2R1bGUgTXVzaWNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBNdXNpYyA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gbW9yY2VhdSBkZSBtdXNpcXVlLlxuICAgKlxuICAgKiBAY2xhc3MgVHJhY2tcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZCBJZGVudGlmaWFudCBEZWV6ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRpdHJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcnRpc3QgQXJ0aXN0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWxidW0gTm9tIGRlIGwnYWxidW1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgRGF0ZSBkZSBzb3J0aWUgZGUgbCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY292ZXIgUG9jaGV0dGUgZCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRvbmFsaXTDqVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBNb2RlIChtYWpldXIgb3UgbWluZXVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG8gVGVtcG8gKGVuIEJQTSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsb3RUYWcgVGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKiBAcGFyYW0ge0FycmF5fSBoYXJtb25pZXMgVGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBUcmFjazogZnVuY3Rpb24oaWQsIHRpdGxlLCBhcnRpc3QsIGFsYnVtLCBkYXRlLCBjb3Zlciwga2V5LCBtb2RlLCB0ZW1wbywgY2FtZWxvdFRhZywgaGFybW9uaWVzKSB7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTXVzaWMuVHJhY2spKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgVHJhY2sgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWRlbnRpZmlhbnQgZHUgbW9yY2VhdSBzdXIgRGVlemVyXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2lkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5faWQgPSBpZDtcbiAgICAvKipcbiAgICAgKiBUaXRyZSBkdSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RpdGxlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgICAvKipcbiAgICAgKiBBcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2FydGlzdFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2FydGlzdCA9IGFydGlzdDtcbiAgICAvKipcbiAgICAgKiBOb20gZGUgbCdhbGJ1bVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9hbGJ1bVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2FsYnVtID0gYWxidW07XG4gICAgLyoqXG4gICAgICogRGF0ZSBkZSBzb3J0aWUgZGUgbCdhbGJ1bVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9kYXRlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fZGF0ZSA9IGRhdGU7XG4gICAgLyoqXG4gICAgICogUG9jaGV0dGUgZCdhbGJ1bVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9jb3ZlclxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2NvdmVyID0gY292ZXI7XG4gICAgLyoqXG4gICAgICogVG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfa2V5XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIC8qKlxuICAgICAqIE1vZGUgZHUgbW9yY2VhdSAobWFqZXVyIG91IG1pbmV1cilcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfbW9kZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX21vZGUgPSBtb2RlO1xuICAgIC8qKlxuICAgICAqIFRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGVtcG9cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl90ZW1wbyA9IHRlbXBvO1xuICAgIC8qKlxuICAgICAqIFRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfY2FtZWxvdFRhZ1xuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2NhbWVsb3RUYWcgPSBjYW1lbG90VGFnO1xuICAgIC8qKlxuICAgICAqIFRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9oYXJtb25pZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQGRlZmF1bHQgW11cbiAgICAgKi9cbiAgICB0aGlzLl9oYXJtb25pZXMgPSBoYXJtb25pZXM7XG5cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW5lIGhhcm1vbmllIG11c2ljYWxlLlxuICAgKlxuICAgKiBAY2xhc3MgSGFybW9ueVxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IG90aGVyVHJhY2sgQXV0cmUgbW9yY2VhdSwgcG91ciBsYSBjb21wYXJhaXNvblxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG9WYXJpYXRpb24gVmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqL1xuICBIYXJtb255OiBmdW5jdGlvbihyZWZUcmFjaywgb3RoZXJUcmFjaywgdGVtcG9WYXJpYXRpb24pIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5IYXJtb255KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEhhcm1vbnkgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9yZWZUcmFja1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl9yZWZUcmFjayA9IHJlZlRyYWNrLFxuICAgIC8qKlxuICAgICAqIEF1dHJlIG1vcmNlYXUsIHBvdXIgbGEgY29tcGFyYWlzb25cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfb3RoZXJUcmFja1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl9vdGhlclRyYWNrID0gb3RoZXJUcmFjayxcbiAgICAvKipcbiAgICAgKiBWYXJpYXRpb24gZHUgdGVtcG8gcGFyIHJhcHBvcnQgw6AgdW4gbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90ZW1wb1ZhcmlhdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHRoaXMuX3RlbXBvVmFyaWF0aW9uID0gdGVtcG9WYXJpYXRpb24sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1pbmltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtaW5pbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLl9yZWZUcmFjay5nZXRUZW1wbygpIC0gKHRoaXMuX3JlZlRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1heGltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWF4XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtYXhpbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01heCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLl9yZWZUcmFjay5nZXRUZW1wbygpICsgKHRoaXMuX3JlZlRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZMOpdGVybWluYW50IGxhIGNvbXBhdGliaWxpdMOpIGVuIHRlbXBvIGVudHJlIGxlcyBkZXV4IG1vcmNlYXV4IGNvbXBhcsOpc1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0ZW1wb0NvbXBhdGliaWxpdHlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBWcmFpIGVuIGNhcyBkZSBjb21wYXRpYmlsaXTDqSwgZmF1eCBzaW5vblxuICAgICAqL1xuICAgIHRoaXMudGVtcG9Db21wYXRpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fb3RoZXJUcmFjay5nZXRUZW1wbygpID49IHRoaXMudGVtcG9NaW4oKSAmJiB0aGlzLl9vdGhlclRyYWNrLmdldFRlbXBvKCkgPD0gdGhpcy50ZW1wb01heCgpKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGTDqXRlcm1pbmFudCBsYSBjb21wYXRpYmlsaXTDqSBlbiB0b25hbGl0w6kgZW50cmUgbGVzIGRldXggbW9yY2VhdXggY29tcGFyw6lzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGtleUNvbXBhdGliaWxpdHlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBWcmFpIGVuIGNhcyBkZSBjb21wYXRpYmlsaXTDqSwgZmF1eCBzaW5vblxuICAgICAqL1xuICAgIHRoaXMua2V5Q29tcGF0aWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKCQuaW5BcnJheSh0aGlzLl9vdGhlclRyYWNrLmdldENhbWVsb3RUYWcoKSwgdGhpcy5fcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcbiAgICB9O1xuXG4gIH1cblxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgVHJhY2tcbiAqL1xuTXVzaWMuVHJhY2sucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdpZGVudGlmaWFudCBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SWRcbiAgICogQHJldHVybiB7TnVtYmVyfSBMJ2lkIGR1IG1vcmNlYXVcbiAgICovXG4gICBnZXRJZDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9pZDsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRpdHJlIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUaXRsZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIHRpdHJlIGR1IG1vcmNlYXVcbiAgICovXG4gICBnZXRUaXRsZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl90aXRsZTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldFRpdGxlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWF1IHRpdHJlIGR1IG1vcmNlYXVcbiAgICovXG4gICBzZXRUaXRsZTogZnVuY3Rpb24odGl0bGUpIHsgdGhpcy5fdGl0bGUgPSB0aXRsZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGwnYXJ0aXN0ZSDDoCBsJ29yaWdpbmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFydGlzdFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IEwnYXJ0aXN0ZSDDoCBsJ29yaWdpbmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldEFydGlzdDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hcnRpc3Q7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGwnYXJ0aXN0ZSDDoCBsJ29yaWdpbmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldEFydGlzdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGUgbm91dmVsIGFydGlzdGUgZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0QXJ0aXN0OiBmdW5jdGlvbihhcnRpc3QpIHsgdGhpcy5fYXJ0aXN0ID0gYXJ0aXN0OyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbm9tIGRlIGwnYWxidW1cbiAgICpcbiAgICogQG1ldGhvZCBnZXRBbGJ1bVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIG5vbSBkZSBsJ2FsYnVtXG4gICAqL1xuICBnZXRBbGJ1bTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hbGJ1bTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgbm9tIGRlIGwnYWxidW1cbiAgICpcbiAgICogQG1ldGhvZCBzZXRBbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGUgbm91dmVhdSBub20gZGUgbCdhbGJ1bVxuICAgKi9cbiAgc2V0QWxidW06IGZ1bmN0aW9uKGFsYnVtKSB7IHRoaXMuX2FsYnVtID0gYWxidW07IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSBkYXRlIGRlIHNvcnRpZSBkZSBsJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0RGF0ZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExhIGRhdGUgZGUgc29ydGllIGRlIGwnYWxidW1cbiAgICovXG4gIGdldERhdGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fZGF0ZTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgZGF0ZSBkZSBzb3J0aWUgZGUgbCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldERhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExhIG5vdXZlbGxlIGRhdGUgZGUgc29ydGllIGRlIGwnYWxidW1cbiAgICovXG4gIHNldERhdGU6IGZ1bmN0aW9uKGRhdGUpIHsgdGhpcy5fZGF0ZSA9IGRhdGU7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q292ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBnZXRDb3ZlcjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jb3ZlcjsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgcG9jaGV0dGUgZCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldENvdmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBzZXRDb3ZlcjogZnVuY3Rpb24oY292ZXIpIHsgdGhpcy5fY292ZXIgPSBjb3ZlcjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0S2V5XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldEtleTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9rZXk7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0S2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0S2V5OiBmdW5jdGlvbihrZXkpIHsgdGhpcy5fa2V5ID0ga2V5OyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldE1vZGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBnZXRNb2RlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX21vZGU7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIG1vZGUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1vZGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKi9cbiAgc2V0TW9kZTogZnVuY3Rpb24obW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldFRlbXBvOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RlbXBvOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGVtcG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0VGVtcG86IGZ1bmN0aW9uKHRlbXBvKSB7IHRoaXMuX3RlbXBvID0gdGVtcG87IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q2FtZWxvdFRhZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldENhbWVsb3RUYWc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldENhbWVsb3RUYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oY2FtZWxvdFRhZykgeyB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRIYXJtb25pZXNcbiAgICogQHJldHVybiB7QXJyYXl9IExlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldEhhcm1vbmllczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9oYXJtb25pZXM7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBzZXRIYXJtb25pZXNcbiAgICogQHBhcmFtIHtBcnJheX0gTGVzIG5vdXZlYXV4IHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0SGFybW9uaWVzOiBmdW5jdGlvbihoYXJtb25pZXMpIHsgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzOyB9LFxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgSGFybW9ueVxuICovXG5NdXNpYy5IYXJtb255LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBnZXRSZWZUcmFja1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IExlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIGdldFJlZlRyYWNrOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3JlZlRyYWNrOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0UmVmVHJhY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IExlIG5vdXZlYXUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgc2V0UmVmVHJhY2s6IGZ1bmN0aW9uKHJlZlRyYWNrKSB7IHRoaXMuX3JlZlRyYWNrID0gcmVmVHJhY2s7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2F1dHJlIG1vcmNlYXUsIHV0aWxpc8OpIMOgIHRpdHJlIGRlIGNvbXBhcmFpc29uXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0T3RoZXJUcmFja1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IExlIG1vcmNlYXUgw6AgY29tcGFyZXIgYXZlYyBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqL1xuICBnZXRPdGhlclRyYWNrOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX290aGVyVHJhY2s7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGwnYXV0cmUgbW9yY2VhdSwgdXRpbGlzw6kgw6AgdGl0cmUgZGUgY29tcGFyYWlzb25cbiAgICpcbiAgICogQG1ldGhvZCBzZXRPdGhlclRyYWNrXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBMZSBub3V2ZWF1IG1vcmNlYXUgw6AgY29tcGFyZXIgYXZlYyBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqL1xuICBzZXRPdGhlclRyYWNrOiBmdW5jdGlvbihvdGhlclRyYWNrKSB7IHRoaXMuX290aGVyVHJhY2sgPSBvdGhlclRyYWNrOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGEgdmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0VGVtcG9WYXJpYXRpb25cbiAgICogQHJldHVybiB7TnVtYmVyfSBMYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gIGdldFRlbXBvVmFyaWF0aW9uOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RlbXBvVmFyaWF0aW9uOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICpcbiAgICogQG1ldGhvZCBzZXRUZW1wb1ZhcmlhdGlvblxuICAgKiBAcGFyYW0ge051bWJlcn0gTGEgbm91dmVsbGUgdmFyaWF0aW9uIGR1IHRlbXBvXG4gICAqL1xuICAgc2V0VGVtcG9WYXJpYXRpb246IGZ1bmN0aW9uKHRlbXBvVmFyaWF0aW9uKSB7IHRoaXMuX3RlbXBvVmFyaWF0aW9uID0gdGVtcG9WYXJpYXRpb247IH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9NdXNpYy5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBlbmNhcHN1bGFudCBsZSBsZWN0ZXVyIGF1ZGlvIGZvdXJuaSBwYXIgRGVlemVyIChEWi5wbGF5ZXIpLlxuICogTGEgY2xhc3NlIHF1J2lsIGNvbnRpZW50IGVzdCDDoCBsYSBmb2lzIHVuIFNpbmdsZXRvbiBldCB1biBBZGFwdGVyLlxuICpcbiAqIEBtb2R1bGUgUGxheWVyXG4gKiBAY2xhc3MgUGxheWVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyID0gKGZ1bmN0aW9uKCkge1xuXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCAocHJpdsOpKSByZXByw6lzZW50YW50IHVuZSBpbnN0YW5jZSBkZSBsYSBjbGFzc2UgZWxsZS1tw6ptZSAoY2YuIFNpbmdsZXRvbilcbiAgICpcbiAgICogQHByb3BlcnR5IHBsYXllclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAZGVmYXVsdCB1bmRlZmluZWRcbiAgICovXG4gIHZhciBwbGF5ZXIsXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0ZXVyIChwcml2w6kpIGNoYXJnw6kgZCdpbml0aWFsaXNlciBsZSBwbGF5ZXIgKGNmLiBTaW5nbGV0b24pXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgICAgY29uc3RydWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIG1vcmNlYXV4IHNvbnQgY2hhcmfDqXMgZGFucyBsZSBsZWN0ZXVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm9wZXJ0eSB0cmFja3NMb2FkZWRcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRyYWNrc0xvYWRlZCA9IGZhbHNlLFxuICAgICAgICAvKipcbiAgICAgICAgICogQXR0cmlidXQgaW5kaXF1YW50IGxhIHBvc2l0aW9uIGRlIGxhIHTDqnRlIGRlIGxlY3R1cmUgZGFucyBsZSBtb3JjZWF1IGVuIGNvdXJzXG4gICAgICAgICAqIExhIHZhbGV1ciBzZSBzaXR1ZSBlbnRyZSAwIGV0IDEwMC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHRyYWNrUG9zaXRpb25cbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50cmFja1Bvc2l0aW9uID0gMCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE3DqXRob2RlIGVmZmVjdHVhbnQgcsOpZWxsZW1lbnQgbCdpbml0aWFsaXNhdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLmluaXQoe1xuICAgICAgICAgICAgICBhcHBJZDogJzE2OTcxMScsXG4gICAgICAgICAgICAgIGNoYW5uZWxVcmw6ICdodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBwJyxcbiAgICAgICAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiAncGxheWVyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogODAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA4MCxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdzcXVhcmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExlY3R1cmUgZW4gY291cnMgP1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGlzUGxheWluZ1xuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBWcmFpIHNpIGxhIGxlY3R1cmUgZXN0IGVuIGNvdXJzLCBmYXV4IHNpbm9uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlzUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBEWi5wbGF5ZXIuaXNQbGF5aW5nKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBam91dGVyIGRlcyBtb3JjZWF1eCDDoCBsYSBmaWxlIGQnYXR0ZW50ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIGFkZFRvUXVldWVcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gaWRzIFRhYmxlYXUgY29udGVuYW50IGxlcyBpZGVudGlmaWFudHMgZGVzIG1vcmNlYXV4XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZFRvUXVldWUgPSBmdW5jdGlvbihpZHMpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuYWRkVG9RdWV1ZShpZHMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhcmdlbWVudCBldCBsZWN0dXJlIGRlcyBtb3JjZWF1eFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHBsYXlUcmFja3NcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gaWRzIFRhYmxlYXUgY29udGVuYW50IGxlcyBpZGVudGlmaWFudHMgZGVzIG1vcmNlYXV4XG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBJbmRpY2UgZHUgcHJlbWllciBtb3JjZWF1XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXlUcmFja3MgPSBmdW5jdGlvbihpZHMsIGluZGV4KSB7XG4gICAgICAgICAgRFoucGxheWVyLnBsYXlUcmFja3MoaWRzLCBpbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMZWN0dXJlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcGxheVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgRFoucGxheWVyLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhdXNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucGF1c2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN1aXZhbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBzdWl2YW50XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIubmV4dCgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogUHLDqWPDqWRlbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwcmV2XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucHJldigpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWxsZXIgw6AuLi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBzZWVrXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwb3MgUG9zaXRpb24gZGUgbGEgdMOqdGUgZGUgbGVjdHVyZSAoZW50cmUgMCBldCAxMDApXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNlZWsgPSBmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2Vlayhwb3MpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsZSBzb25cbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBtdXRlXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNNdXRlIFZyYWkgb3UgZmF1eFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tdXRlID0gZnVuY3Rpb24oaXNNdXRlKSB7XG4gICAgICAgICAgRFoucGxheWVyLnNldE11dGUoaXNNdXRlKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFjdGl2ZXIvRMOpc2FjdGl2ZXIgbGEgbGVjdHVyZSBhbMOpYXRvaXJlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSYW5kb20gVnJhaSBvdSBmYXV4XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJhbmRvbSA9IGZ1bmN0aW9uKGlzUmFuZG9tKSB7XG4gICAgICAgICAgRFoucGxheWVyLnNldFNodWZmbGUoaXNSYW5kb20pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsYSBsZWN0dXJlIHLDqXDDqXTDqWVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByZXBlYXRcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgMCAobm8gcmVwZWF0KSwgMSAocmVwZWF0IGFsbCksIG91IDIgKHJlcGVhdCBvbmUpXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2V0UmVwZWF0KGNvZGUpO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICByZXR1cm4gbmV3IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGTDqWxpdnJhbnQgbCd1bmlxdWUgaW5zdGFuY2UgZGUgbGEgY2xhc3NlIChjZi4gU2luZ2xldG9uKVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRQbGF5ZXJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuZSBpbnN0YW5jZSBkZSBwbGF5ZXJcbiAgICAgKi9cbiAgICB0aGlzLmdldFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHBsYXllciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBsYXllciA9IG5ldyBjb25zdHJ1Y3QoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfTtcbiAgfTtcblxufSkoKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1BsYXllci5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBlbmNhcHN1bGFudCBsZSBsZWN0ZXVyIGF1ZGlvIGZvdXJuaSBwYXIgRGVlemVyXG4gKiBMZSBtb2R1bGUgcydhcHB1aWUgc3VyIGxlIG1vZMOobGUgTVZWTSBkZSBWdWUuanMuXG4gKlxuICogQG1vZHVsZSBQbGF5bGlzdFxuICogQGNsYXNzIFBsYXlsaXN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gUGxheWxpc3QgPSBuZXcgVnVlKHtcbiAgZWw6IFwiI2FwcFwiLFxuICBkYXRhOiB7XG4gICAgLyoqXG4gICAgICogQXR0cmlidXQgcmVwcsOpc2VudGFudCBsJ2lkIGRlIGxhIHBsYXlsaXN0IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkZWV6ZXJJZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgLTFcbiAgICAgKi9cbiAgICBkZWV6ZXJJZDogLTEsXG4gICAgLyoqXG4gICAgICogQXR0cmlidXQgcmVwcsOpc2VudGFudCBsYSBsaXN0ZSBkZXMgbW9yY2VhdXggc291cyBmb3JtZSBkJ2lkZW50aWZpYW50cyBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB0cmFja3NJZHNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQGRlZmF1bHQgW11cbiAgICAgKi9cbiAgICB0cmFja3NJZHM6IFtdLFxuICAgIC8qKlxuICAgICAqIEF0dHJpYnV0IHJlcHLDqXNlbnRhbnQgbGEgbGlzdGUgZGVzIG1vcmNlYXV4IHNvdXMgZm9ybWUgZCdvYmpldHMgVHJhY2tcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RlZFRyYWNrc1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAqL1xuICAgIHNlbGVjdGVkVHJhY2tzOiBbXVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgLyoqXG4gICAgICogQWpvdXQgZCd1biBtb3JjZWF1IMOgIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFkZFRyYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyYWNrIE9iamV0IFRyYWNrXG4gICAgICovXG4gICAgYWRkVHJhY2s6IGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICB0aGlzLnRyYWNrc0lkcy5wdXNoKHRyYWNrLl9pZCk7XG4gICAgICB0aGlzLnNlbGVjdGVkVHJhY2tzLnB1c2godHJhY2spO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU3VwcHJlc3Npb24gZCd1biBtb3JjZWF1IGRlIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVRyYWNrXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGkgSW5kZXggZHUgbW9yY2VhdSBkYW5zIGxhIHBsYXlsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlVHJhY2s6IGZ1bmN0aW9uKGkpIHtcbiAgICAgIHRoaXMudHJhY2tzSWRzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgJCggXCIjcGxheWxpc3RcIiApLnRyaWdnZXIoIFwidHJhY2tSZW1vdmVkXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWluaXRpYWxpc2VyIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlc2V0XG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cmFja3NJZHMgPSBbXTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3MgPSBbXTtcbiAgICB9XG4gIH1cbn0pO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvUGxheWxpc3QuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIE11c2ljID0gcmVxdWlyZSgnLi9NdXNpYy5qcycpO1xuXG4vKipcbiAqIENsYXNzZSBtZXR0YW50IGVuIMWTdXZyZSBsZSBwYXR0ZXJuIFN0cmF0ZWd5LlxuICogQ2V0dGUgY2xhc3NlIGZvdXJuaXQgdW4gbW95ZW4gZCdlbmNhcHN1bGVyIHVuZSBzw6lyaWUgZCdhbGdvcml0aG1lcyBkZSB0cmkuXG4gKlxuICogQG1vZHVsZSBTb3J0aW5nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gU29ydGluZyA9IHtcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgZG91YmxvbnMgc29udCBhdXRvcmlzw6lzIGRhbnMgbGVzIHN1Z2dlc3Rpb25zXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBkdXBsaWNhdGVzQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGR1cGxpY2F0ZXNBbGxvd2VkOiBmYWxzZSxcbiAgLyoqXG4gICAqIENsYXNzZSBnw6luw6lyaXF1ZSByZXByw6lzZW50YW50IGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBjbGFzcyBTdHJhdGVneVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFN0cmF0ZWd5OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBBbGdvcml0aG1lIGRlIHRyaSBjb3VyYW50XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgYWxnb3JpdGhtXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgdGhpcy5fYWxnb3JpdGhtID0gbnVsbDtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHBhciBkw6lmYXV0LlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gb3UgKFhPUikgZW4gdG9uYWxpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIERlZmF1bHRcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZWZhdWx0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgcGFyIGTDqWZhdXRcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDA7IC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIGluZm8gPSBTb3J0aW5nLnV0aWxzLmdldFRyYWNrSW5mbyhoYXJtb255LCBzaW1pbGFyVHJhY2tzW2ldKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnRUZW1wbyA+PSBpbmZvLnRlbXBvTWluICYmIGluZm8uY3VycmVudFRlbXBvIDw9IGluZm8udGVtcG9NYXggJiYgaW5mby5pc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICBTb3J0aW5nLnV0aWxzLnJlYXJyYW5nZShzaW1pbGFyVHJhY2tzLCBpLCAwLCBzaW1pbGFyVHJhY2tzW2ldKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdW5lIGNvbmRpdGlvbiAodGVtcG8gb3UgdG9uYWxpdMOpKSBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICB9IGVsc2UgaWYgKChpbmZvLmN1cnJlbnRUZW1wbyA+PSBpbmZvLnRlbXBvTWluICYmIGluZm8uY3VycmVudFRlbXBvIDw9IGluZm8udGVtcG9NYXgpIHx8IGluZm8uaXNNYXRjaGluZykge1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIG5iUGVyZmVjdE1hdGNoZXMsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgcmV0dXJuIFNvcnRpbmcudXRpbHMuZHVwbGljYXRlRmlsdGVyKHNpbWlsYXJUcmFja3MpO1xuXG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHZhbG9yaXNhbnQgbGUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbywgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgVGVtcG9GaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFRlbXBvRmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSB2YWxvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIG5iUGVyZmVjdE1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgbmJUZW1wb01hdGNoZXMgPSAwOyAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG9cblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIGluZm8gPSBTb3J0aW5nLnV0aWxzLmdldFRyYWNrSW5mbyhoYXJtb255LCBzaW1pbGFyVHJhY2tzW2ldKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnRUZW1wbyA+PSBpbmZvLnRlbXBvTWluICYmIGluZm8uY3VycmVudFRlbXBvIDw9IGluZm8udGVtcG9NYXggJiYgaW5mby5pc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICBTb3J0aW5nLnV0aWxzLnJlYXJyYW5nZShzaW1pbGFyVHJhY2tzLCBpLCAwLCBzaW1pbGFyVHJhY2tzW2ldKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRlbXBvLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaW5mby5jdXJyZW50VGVtcG8gPj0gaW5mby50ZW1wb01pbiAmJiBpbmZvLmN1cnJlbnRUZW1wbyA8PSBpbmZvLnRlbXBvTWF4KSB7XG4gICAgICAgICAgICBuYlRlbXBvTWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIG5iUGVyZmVjdE1hdGNoZXMsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdG9uYWxpdMOpLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaW5mby5pc01hdGNoaW5nKSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG9cbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIG5iUGVyZmVjdE1hdGNoZXMgKyBuYlRlbXBvTWF0Y2hlcywgc2ltaWxhclRyYWNrc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICByZXR1cm4gU29ydGluZy51dGlscy5kdXBsaWNhdGVGaWx0ZXIoc2ltaWxhclRyYWNrcyk7XG5cbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgdmFsb3Jpc2FudCBsYSB0b25hbGl0w6kuXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6ksIHN1aXZpcyBkZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8uXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgS2V5Rmlyc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBLZXlGaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIHZhbG9yaXNhbnQgbGEgdG9uYWxpdMOpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIG5iUGVyZmVjdE1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgbmJLZXlNYXRjaGVzID0gMDsgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRvbmFsaXTDqVxuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8vIFBvdXIgY2hhcXVlIG1vcmNlYXUsIG9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcyBpbmRpc3BlbnNhYmxlc1xuICAgICAgICB2YXIgaW5mbyA9IFNvcnRpbmcudXRpbHMuZ2V0VHJhY2tJbmZvKGhhcm1vbnksIHNpbWlsYXJUcmFja3NbaV0pO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGluZm8uY3VycmVudFRlbXBvID49IGluZm8udGVtcG9NaW4gJiYgaW5mby5jdXJyZW50VGVtcG8gPD0gaW5mby50ZW1wb01heCAmJiBpbmZvLmlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIDAsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdG9uYWxpdMOpLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaW5mby5pc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYktleU1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBsZXMgcGx1cyBwZXJ0aW5lbnRzXG4gICAgICAgICAgICBTb3J0aW5nLnV0aWxzLnJlYXJyYW5nZShzaW1pbGFyVHJhY2tzLCBpLCBuYlBlcmZlY3RNYXRjaGVzLCBzaW1pbGFyVHJhY2tzW2ldKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRlbXBvLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaW5mby5jdXJyZW50VGVtcG8gPj0gaW5mby50ZW1wb01pbiAmJiBpbmZvLmN1cnJlbnRUZW1wbyA8PSBpbmZvLnRlbXBvTWF4KSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgICBTb3J0aW5nLnV0aWxzLnJlYXJyYW5nZShzaW1pbGFyVHJhY2tzLCBpLCBuYlBlcmZlY3RNYXRjaGVzICsgbmJLZXlNYXRjaGVzLCBzaW1pbGFyVHJhY2tzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vIFNpIGxlcyBkb3VibG9ucyBuZSBzb250IHBhcyBhdXRvcmlzw6lzLCBvbiBmaWx0cmVcbiAgICAgIHJldHVybiBTb3J0aW5nLnV0aWxzLmR1cGxpY2F0ZUZpbHRlcihzaW1pbGFyVHJhY2tzKTtcblxuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4LCBjb21wYXRpYmxlcyBvdSBub24sIHNvbnQgcmFuZ8OpcyBkdSBCUE0gbGUgcGx1cyBsZW50IGF1IEJQTSBsZSBwbHVzIHJhcGlkZS5cbiAgICpcbiAgICogQGNsYXNzIEFzY2VuZGluZ1RlbXBvXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgQXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBjcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgcmV0dXJuIF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCwgY29tcGF0aWJsZXMgb3Ugbm9uLCBzb250IHJhbmfDqXMgZHUgQlBNIGxlIHBsdXMgcmFwaWRlIGF1IEJQTSBsZSBwbHVzIGxlbnQuXG4gICAqXG4gICAqIEBjbGFzcyBEZXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBkw6ljcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgc2ltaWxhclRyYWNrcyA9IF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICAgIHJldHVybiBzaW1pbGFyVHJhY2tzLnJldmVyc2UoKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1biBhbGdvcml0aG1lIGZpY3RpZiBuJ2VmZmVjdHVhbnQgYXVjdW4gdHJpLlxuICAgKiBDZXR0ZSBjbGFzc2UgbidleGlzdGUgcXVlIHBvdXIgZGVzIHJhaXNvbnMgc8OpbWFudGlxdWVzLlxuICAgKlxuICAgKiBAY2xhc3MgTm9uZVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIE5vbmU6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIG4nYXBwbGlxdWFudCBhdWN1biB0cmlcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICByZXR1cm4gc2ltaWxhclRyYWNrcztcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogTWluaS1jbGFzc2UgcmVncm91cGFudCBsZXMgbcOpdGhvZGVzIHV0aWxpdGFpcmVzIHBvdXIgbGUgdHJpXG4gICAqXG4gICAqIEBjbGFzcyBTb3J0aW5nLnV0aWxzXG4gICAqL1xuICB1dGlsczoge1xuICAgIC8qKlxuICAgICAqIFJldG91cm5lIHF1ZWxxdWVzIGluZm9ybWF0aW9ucyBpbXBvcnRhbnRlcyBzdXIgdW4gbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRUcmFja0luZm9cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBNb3JjZWF1IGNvdXJhbnRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEluZm9ybWF0aW9ucyBzdXIgbGUgbW9yY2VhdVxuICAgICAqL1xuICAgIGdldFRyYWNrSW5mbzogZnVuY3Rpb24oaGFybW9ueSwgdHJhY2spIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGN1cnJlbnRUZW1wbzogdHJhY2suZ2V0VGVtcG8oKSxcbiAgICAgICAgdGVtcG9NaW46IGhhcm1vbnkudGVtcG9NaW4oKSxcbiAgICAgICAgdGVtcG9NYXg6IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgaXNNYXRjaGluZzogKCQuaW5BcnJheSh0cmFjay5nZXRDYW1lbG90VGFnKCksIGhhcm1vbnkuZ2V0UmVmVHJhY2soKS5nZXRIYXJtb25pZXMoKSkgIT0gLTEpXG4gICAgICB9O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRmlsdHJlIGxlIHRyaSBpbml0aWFsIGVuIGZvbmN0aW9uIGR1IHN0YXR1dCBkZXMgZG91YmxvbnMgKGF1dG9yaXPDqXMgb3Ugbm9uKVxuICAgICAqXG4gICAgICogQG1ldGhvZCBkdXBsaWNhdGVGaWx0ZXJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIFRhYmxlYXUgZGUgbW9yY2VhdXggw6AgZmlsdHJlclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IGZpbHRyw6lcbiAgICAgKi9cbiAgICBkdXBsaWNhdGVGaWx0ZXI6IGZ1bmN0aW9uKHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciB0cmFja3MgPSBbXSxcbiAgICAgICAgICBhcnRpc3RzID0gW107XG5cbiAgICAgIGlmICghU29ydGluZy5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgICAgYXJ0aXN0ID0gdHJhY2suZ2V0QXJ0aXN0KCk7XG5cbiAgICAgICAgICAvLyBTaSBsJ2FydGlzdGUgbidhIHBhcyDDqXTDqSByZW5jb250csOpIGRhbnMgbGVzIHN1Z2dlc3Rpb25zIHByw6ljw6lkZW50ZXMuLi5cbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGFydGlzdCwgYXJ0aXN0cykgPT0gLTEpIHtcbiAgICAgICAgICAgIGFydGlzdHMucHVzaChhcnRpc3QpO1xuICAgICAgICAgICAgdHJhY2tzLnB1c2godHJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2tzID0gc2ltaWxhclRyYWNrcztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSw6lhZ2VuY2VtZW50IGRlcyBtb3JjZWF1eCBkYW5zIHVuIHRhYmxlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVhcnJhbmdlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZW1vdmVJbmRleCBJbmRleCBkdSBtb3JjZWF1IMOgIGJvdWdlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbnNlcnRJbmRleCBJbmRleCBvw7kgaW5zw6lyZXIgbGUgbW9yY2VhdVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gTW9yY2VhdSBjb3VyYW50XG4gICAgICovXG4gICAgcmVhcnJhbmdlOiBmdW5jdGlvbihzaW1pbGFyVHJhY2tzLCByZW1vdmVJbmRleCwgaW5zZXJ0SW5kZXgsIHRyYWNrKSB7XG4gICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShyZW1vdmVJbmRleCwgMSk7XG4gICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShpbnNlcnRJbmRleCwgMCwgdHJhY2spO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbGEgY2xhc3NlIFN0cmF0ZWd5XG4gKi9cblNvcnRpbmcuU3RyYXRlZ3kucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRBbGdvcml0aG1cbiAgICogQHJldHVybiB7T2JqZWN0fSBMJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKi9cbiAgZ2V0QWxnb3JpdGhtOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxnb3JpdGhtO1xuICB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsZ29yaXRobVxuICAgKiBAcGFyYW0ge09iamVjdH0gYWxnb3JpdGhtIExlIG5vdXZlbCBhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICovXG4gIHNldEFsZ29yaXRobTogZnVuY3Rpb24oYWxnb3JpdGhtKSB7XG4gICAgdGhpcy5fYWxnb3JpdGhtID0gYWxnb3JpdGhtO1xuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgYWJzdHJhaXRlIGRlIHRyaS5cbiAgICogQ2V0dGUgZGVybmnDqHJlIHNlIGNvbnRlbnRlIGRlIGTDqWzDqWd1ZXIgbGUgdHJpIMOgIHVuZSBtw6l0aG9kZSBjb25jcsOodGUuXG4gICAqXG4gICAqIEBtZXRob2Qgc29ydFxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6ksIHNlbG9uIGwnYWxnb3JpdGhtZSBjb3VyYW50XG4gICAqL1xuICBzb3J0OiBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZ29yaXRobS5zb3J0KGhhcm1vbnksIHNpbWlsYXJUcmFja3MpO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvU29ydGluZy5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCB1bmUgY2xhc3NlIHBvdXIgbGEgZ2VzdGlvbiBzaW1wbGlmacOpZSBkZXMgdXRpbGlzYXRldXJzXG4gKlxuICogQG1vZHVsZSBVc2VyXG4gKiBAY2xhc3MgVXNlclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgSWRlbnRpZmlhbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFBzZXVkb1xuICogQHBhcmFtIHtTdHJpbmd9IGluc2NyaXB0aW9uRGF0ZSBEYXRlIGQnaW5zY3JpcHRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5rIExpZW4gdmVycyBsZSBwcm9maWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBwaWN0dXJlIExpZW4gdmVycyBsJ2F2YXRhclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXIgPSBmdW5jdGlvbihpZCwgbmFtZSwgaW5zY3JpcHRpb25EYXRlLCBsaW5rLCBwaWN0dXJlKSB7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFVzZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIFVzZXIgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gIH1cblxuICAvKipcbiAgICogSWRlbnRpZmlhbnRcbiAgICpcbiAgICogQHByb3BlcnR5IGlkXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRoaXMuX2lkID0gaWQ7XG4gIC8qKlxuICAgKiBQc2V1ZG9cbiAgICpcbiAgICogQHByb3BlcnR5IG5hbWVcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJcIlxuICAgKi9cbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIC8qKlxuICAgKiBEYXRlIGQnaW5zY3JpcHRpb25cbiAgICpcbiAgICogQHByb3BlcnR5IGluc2NyaXB0aW9uRGF0ZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcIlwiXG4gICAqL1xuICB0aGlzLl9pbnNjcmlwdGlvbkRhdGUgPSBpbnNjcmlwdGlvbkRhdGU7XG4gIC8qKlxuICAgKiBMaWVuIHZlcnMgbGUgcHJvZmlsXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBsaW5rXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiXCJcbiAgICovXG4gIHRoaXMuX2xpbmsgPSBsaW5rO1xuICAvKipcbiAgICogTGllbiB2ZXJzIGwnYXZhdGFyXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwaWN0dXJlXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiXCJcbiAgICovXG4gIHRoaXMuX3BpY3R1cmUgPSBwaWN0dXJlO1xuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBVc2VyXG4gKi9cblVzZXIucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdpZGVudGlmaWFudCBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SWRcbiAgICogQHJldHVybiB7TnVtYmVyfSBMJ2lkIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgcHNldWRvIGRlIGwndXRpbGlzYXRldXJcbiAgICpcbiAgICogQG1ldGhvZCBnZXROYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgcHNldWRvIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldE5hbWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbmFtZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIGRhdGUgZCdpbnNjcmlwdGlvbiBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0SW5zY3JpcHRpb25EYXRlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgZGF0ZSBkJ2luc2NyaXB0aW9uIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldEluc2NyaXB0aW9uRGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aGlzLl9pbnNjcmlwdGlvbkRhdGUpLFxuICAgICAgICBkID0gZGF0ZS5nZXREYXRlKCksXG4gICAgICAgIG0gPSBkYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgICB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBkICsgXCIvXCIgKyBtICsgXCIvXCIgKyB5O1xuICB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbGllbiB2ZXJzIGxlIHByb2ZpbCBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0TGlua1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIGxpZW4gdmVycyBsZSBwcm9maWwgZGUgbCd1dGlsaXNhdGV1clxuICAgKi9cbiAgZ2V0TGluazogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9saW5rOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhdmF0YXIgZGUgbCd1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAbWV0aG9kIGdldFBpY3R1cmVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMJ2F2YXRhciBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqL1xuICBnZXRQaWN0dXJlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3BpY3R1cmU7IH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9Vc2VyLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogIE9iamV0cyB1dGlsZXMgcG91ciBsZSB0cmFpdGVtZW50IGRlcyByw6lwb25zZXMgdmVuYW50IGQnRWNobyBOZXN0XG4gKlxuICogQG1vZHVsZSBWb2NhYnVsYXJ5XG4gKiBAY2xhc3MgVm9jYWJ1bGFyeVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gVm9jYWJ1bGFyeSA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogTW9kZSAobWFqZXVyIGV0IG1pbmV1cilcbiAqXG4gKiBAcHJvcGVydHkgbW9kZXNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5Lm1vZGVzID0ge1xuICAgIFwiMFwiOiBcIm1pbmV1clwiLFxuICAgIFwiMVwiOiBcIm1hamV1clwiXG59O1xuXG4vKipcbiAqIE5vdGVzLCBzZWxvbiBsYSBub3RhdGlvbiBzeWxsYWJpcXVlXG4gKlxuICogQHByb3BlcnR5IG5vdGVzXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5rZXlzID0ge1xuICAgIFwiMFwiOiBcImRvXCIsXG4gICAgXCIxXCI6IFwiZG8jXCIsXG4gICAgXCIyXCI6IFwicsOpXCIsXG4gICAgXCIzXCI6IFwibWliXCIsXG4gICAgXCI0XCI6IFwibWlcIixcbiAgICBcIjVcIjogXCJmYVwiLFxuICAgIFwiNlwiOiBcImZhI1wiLFxuICAgIFwiN1wiOiBcInNvbFwiLFxuICAgIFwiOFwiOiBcImxhYlwiLFxuICAgIFwiOVwiOiBcImxhXCIsXG4gICAgXCIxMFwiOiBcInNpYlwiLFxuICAgIFwiMTFcIjogXCJzaVwiXG59O1xuXG4vKipcbiAqIE1peCBoYXJtb25pcXVlIChtb2RlICsgbm90ZSA9IHVuIHRhZyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90KVxuICpcbiAqIEBwcm9wZXJ0eSBoYXJtb25pY01peFxuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkuaGFybW9uaWNNaXggPSB7XG4gICAgXCJtaW5ldXJcIjoge1xuICAgICAgICBcImRvXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImRvI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEyQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwicsOpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiN0FcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjJBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjlBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjRBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYSNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMUFcIlxuICAgICAgICB9LFxuICAgICAgICBcInNvbFwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjZBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI4QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2liXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiM0FcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTBBXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJtYWpldXJcIjoge1xuICAgICAgICBcImRvXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOEJcIlxuICAgICAgICB9LFxuICAgICAgICBcImRvI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjNCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyw6lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMEJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjVCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEyQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI3QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmEjXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMkJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNvbFwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjlCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI0QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMUJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjZCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjFCXCJcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVHJhZHVjdGlvbiBkZSBsYSByb3VlIGRlIENhbWVsb3RcbiAqXG4gKiBAcHJvcGVydHkgY2FtZWxvdFdoZWVsXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5jYW1lbG90V2hlZWwgPSB7XG4gICAgXCIxQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEtRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMUFcIiwgXCIxMkFcIiwgXCIyQVwiLCBcIjFCXCJdXG4gICAgfSxcbiAgICBcIjJBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRS1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIyQVwiLCBcIjFBXCIsIFwiM0FcIiwgXCIyQlwiXVxuICAgIH0sXG4gICAgXCIzQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkItRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiM0FcIiwgXCIyQVwiLCBcIjRBXCIsIFwiM0JcIl1cbiAgICB9LFxuICAgIFwiNEFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI0QVwiLCBcIjNBXCIsIFwiNUFcIiwgXCI0QlwiXVxuICAgIH0sXG4gICAgXCI1QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkMgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjVBXCIsIFwiNEFcIiwgXCI2QVwiLCBcIjVCXCJdXG4gICAgfSxcbiAgICBcIjZBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNkFcIiwgXCI1QVwiLCBcIjdBXCIsIFwiNkJcIl1cbiAgICB9LFxuICAgIFwiN0FcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJEIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI3QVwiLCBcIjZBXCIsIFwiOEFcIiwgXCI3QlwiXVxuICAgIH0sXG4gICAgXCI4QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjhBXCIsIFwiN0FcIiwgXCI5QVwiLCBcIjhCXCJdXG4gICAgfSxcbiAgICBcIjlBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRSBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOUFcIiwgXCI4QVwiLCBcIjEwQVwiLCBcIjlCXCJdXG4gICAgfSxcbiAgICBcIjEwQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkIgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEwQVwiLCBcIjlBXCIsIFwiMTFBXCIsIFwiMTBCXCJdXG4gICAgfSxcbiAgICBcIjExQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkcgRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTFBXCIsIFwiMTBBXCIsIFwiMTJBXCIsIFwiMTFCXCJdXG4gICAgfSxcbiAgICBcIjEyQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQtRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTJBXCIsIFwiMTFBXCIsIFwiMUFcIiwgXCIxMkJcIl1cbiAgICB9LFxuICAgIFwiMUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJCIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxQlwiLCBcIjEyQlwiLCBcIjJCXCIsIFwiMUFcIl1cbiAgICB9LFxuICAgIFwiMkJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGLVNoYXJwIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIyQlwiLCBcIjFCXCIsIFwiM0JcIiwgXCIyQVwiXVxuICAgIH0sXG4gICAgXCIzQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiM0JcIiwgXCIyQlwiLCBcIjRCXCIsIFwiM0FcIl1cbiAgICB9LFxuICAgIFwiNEJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJBLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjRCXCIsIFwiM0JcIiwgXCI1QlwiLCBcIjRBXCJdXG4gICAgfSxcbiAgICBcIjVCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRS1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI1QlwiLCBcIjRCXCIsIFwiNkJcIiwgXCI1QVwiXVxuICAgIH0sXG4gICAgXCI2QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkItRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNkJcIiwgXCI1QlwiLCBcIjdCXCIsIFwiNkFcIl1cbiAgICB9LFxuICAgIFwiN0JcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJGIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI3QlwiLCBcIjZCXCIsIFwiOEJcIiwgXCI3QVwiXVxuICAgIH0sXG4gICAgXCI4QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkMgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjhCXCIsIFwiN0JcIiwgXCI5QlwiLCBcIjhBXCJdXG4gICAgfSxcbiAgICBcIjlCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOUJcIiwgXCI4QlwiLCBcIjEwQlwiLCBcIjlBXCJdXG4gICAgfSxcbiAgICBcIjEwQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEwQlwiLCBcIjlCXCIsIFwiMTFCXCIsIFwiMTBBXCJdXG4gICAgfSxcbiAgICBcIjExQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjExQlwiLCBcIjEwQlwiLCBcIjEyQlwiLCBcIjExQVwiXVxuICAgIH0sXG4gICAgXCIxMkJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMkJcIiwgXCIxMUJcIiwgXCIxQlwiLCBcIjEyQVwiXVxuICAgIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9Wb2NhYnVsYXJ5LmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIEltcG9ydCBkZXMgbW9kdWxlc1xudmFyIFZvY2FidWxhcnkgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1ZvY2FidWxhcnkuanMnKSxcbiAgICBJdGVyYXRvciA9IHJlcXVpcmUoJy4uL21vZHVsZXMvSXRlcmF0b3IuanMnKSxcbiAgICBNdXNpYyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvTXVzaWMuanMnKSxcbiAgICBBamF4ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9BamF4LmpzJyksXG4gICAgR1VJID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9HVUkuanMnKSxcbiAgICBTb3J0aW5nID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9Tb3J0aW5nLmpzJyksXG4gICAgUGxheWxpc3QgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1BsYXlsaXN0LmpzJyk7XG5cbi8vIFZhcmlhYmxlcyBkaXZlcnNlc1xudmFyIHNpbWlsYXJUcmFja3MgPSBbXSxcbiAgICByZWZJZCxcbiAgICByZWZUcmFjayxcbiAgICBiYXNlSGFybW9ueSxcbiAgICBmYWN0b3J5O1xuXG4vLyBTw6lsZWN0ZXVycyBqUXVlcnlcbnZhciAkc2VhcmNoLFxuICAgICRvd2wsXG4gICAgJGhhcm1vbmljVHJhY2tzO1xuXG4vLyBTdHJhdMOpZ2llcyBkZSB0cmkgZGVzIG1vcmNlYXV4XG52YXIgc29ydGluZ1N0cmF0ZWd5ID0gbmV3IFNvcnRpbmcuU3RyYXRlZ3koKSxcbiAgICBkZWZhdWx0U29ydGluZyA9IG5ldyBTb3J0aW5nLkRlZmF1bHQoKSxcbiAgICB0ZW1wb0ZpcnN0U29ydGluZyA9IG5ldyBTb3J0aW5nLlRlbXBvRmlyc3QoKSxcbiAgICBrZXlGaXJzdFNvcnRpbmcgPSBuZXcgU29ydGluZy5LZXlGaXJzdCgpLFxuICAgIGFzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkFzY2VuZGluZ1RlbXBvKCksXG4gICAgZGVzY1RlbXBvU29ydGluZyA9IG5ldyBTb3J0aW5nLkRlc2NlbmRpbmdUZW1wbygpLFxuICAgIG5vU29ydGluZyA9IG5ldyBTb3J0aW5nLk5vbmUoKTtcblxuLy8gUG9pbnQgZCdlbnRyw6llIGRlIGwnYXBwbGljYXRpb25cbiQoIGRvY3VtZW50ICkucmVhZHkoIGluaXQgKTtcblxuLy8gSW5pdGlhbGlzYXRpb24gZGUgbCdhcHBsaWNhdGlvblxuZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIEdVSS5pbml0KCk7XG5cbiAgICAkc2VhcmNoID0gJCggXCIjc2VhcmNoXCIgKTtcbiAgICAkb3dsID0gJCggXCIjdHJhY2tzXCIgKTtcbiAgICAkaGFybW9uaWNUcmFja3MgPSAkKCBcIiNoYXJtb25pYy10cmFja3NcIiApO1xuXG4gICAgZmFjdG9yeSA9IG5ldyBBamF4LlJlcXVlc3RGYWN0b3J5KCk7XG5cbiAgICAkc2VhcmNoLmZpbmQoIFwiaW5wdXRcIiApLmtleXVwKGZ1bmN0aW9uKCkge1xuICAgICAgdHJhY2tBdXRvY29tcGxldGUoKTtcbiAgICAgIEdVSS5zZWFyY2guaGlkZUF1dG9jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgZ28oKTtcblxufVxuXG4vLyBHZXN0aW9uIGRlIGwnYXV0b2NvbXBsw6l0aW9uIGRhbnMgbGUgY2hhbXAgZGUgcmVjaGVyY2hlXG5mdW5jdGlvbiB0cmFja0F1dG9jb21wbGV0ZSgpIHtcblxuICAvLyBBdXRvY29tcGzDqXRpb24gT0tcbiAgaWYgKEdVSS5hdXRvY29tcGxldGVBbGxvd2VkKSB7XG4gICAgJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS5hdXRvY29tcGxldGUoe1xuICAgICAgICBzb3VyY2U6IGZ1bmN0aW9uKCByZXF1ZXN0LCByZXNwb25zZSApIHtcblxuICAgICAgICAgIHZhciBrZXl3b3JkID0gJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS52YWwoKTtcblxuICAgICAgICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL3NlYXJjaC90cmFja1wiKTtcbiAgICAgICAgICByZXF1ZXN0LmFkZFBhcmFtKFwicVwiLCBrZXl3b3JkKTtcbiAgICAgICAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMTApO1xuICAgICAgICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBlcnJvcik7XG5cbiAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICQoIFwiI2F1dG9jb21wbGV0ZVwiICkuZW1wdHkoKTtcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlc3BvbnNlLmRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHRyYWNrID0gcmVzcG9uc2UuZGF0YVtpXSxcbiAgICAgICAgICAgICAgICAgIGN1c3RvbVRyYWNrID0gbmV3IE11c2ljLlRyYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2sudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLmFydGlzdC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hbGJ1bS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0ucmVsZWFzZV9kYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hbGJ1bS5jb3Zlcl9tZWRpdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGh0bWwgKz0gR1VJLnRlbXBsYXRlKFwiYXV0b2NvbXBsZXRlXCIsIGN1c3RvbVRyYWNrLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgc2VsZWN0ZWRUcmFjayhcImF1dG9jb21wbGV0ZS1cIiArIHRyYWNrLmlkLCBjdXN0b21UcmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmFwcGVuZCggaHRtbCApO1xuICAgICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5zaG93KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1pbkxlbmd0aDogM1xuICAgICAgfSk7XG4gIH0gZWxzZSB7IC8vIFBhcyBkJ2F1dG9jb21wbMOpdGlvblxuICAgICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHsgc291cmNlOiBbXSB9KTtcbiAgfVxuXG59XG5cbi8vIMOAIGxhIHNvdW1pc3Npb24gZHUgZm9ybXVsYWlyZSwgb24gcsOpY3Vww6hyZSBkZXMgbW9yY2VhdXggc3VyIERlZXplclxuZnVuY3Rpb24gZ28oKSB7XG4gICRzZWFyY2guc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICgkKCB3aW5kb3cgKS53aWR0aCgpID4gNjAwKSB7XG4gICAgICAgIHNlYXJjaFRyYWNrcygpO1xuICAgICAgICBHVUkuYWxlcnQoXCJtZXNzYWdlXCIsIFwiQ2hvaXNpc3NleiB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXCIsIDUpO1xuICAgICAgICAkc2VhcmNoLmZpbmQoIFwiaW5wdXRcIiApLnZhbCggXCJcIiApO1xuICAgICAgfVxuICB9KTtcbn1cblxuLy8gR2VzdGlvbiBkZXMgYWxnb3JpdGhtZXMgZGUgdHJpIGRlcyBtb3JjZWF1eFxuZnVuY3Rpb24gc2V0U29ydGluZ1N0cmF0ZWd5KCkge1xuICBzd2l0Y2ggKEdVSS5zZWxlY3RlZFNvcnRpbmcpIHtcbiAgICBjYXNlIFwidGVtcG9GaXJzdFwiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobSh0ZW1wb0ZpcnN0U29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwia2V5Rmlyc3RcIjpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0oa2V5Rmlyc3RTb3J0aW5nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJhc2NUZW1wb1wiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShhc2NUZW1wb1NvcnRpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImRlc2NUZW1wb1wiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZXNjVGVtcG9Tb3J0aW5nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJub25lXCI6XG4gICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKG5vU29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShkZWZhdWx0U29ydGluZyk7XG4gIH1cbn1cblxuLy8gUmVjaGVyY2hlIGRlIG1vcmNlYXV4IHN1ciBEZWV6ZXJcbmZ1bmN0aW9uIHNlYXJjaFRyYWNrcygpIHtcblxuICAgIC8vIFLDqWluaXRpYWxpc2F0aW9uIGRlIGxhIHJlY2hlcmNoZVxuICAgIGlmICgkb3dsLmlzKCBcIjp2aXNpYmxlXCIgKSkgJG93bC5lbXB0eSgpO1xuICAgIEdVSS5jbGVhbk5vdGlmaWNhdGlvbnMoKTtcblxuICAgIHZhciBrZXl3b3JkID0gJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS52YWwoKTtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL3NlYXJjaC90cmFja1wiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwicVwiLCBrZXl3b3JkKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMjApO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBlcnJvcik7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgc3VyIGNoYXF1ZSBtb3JjZWF1XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2sgPSByZXNwb25zZS5kYXRhW2ldLFxuICAgICAgICAgICAgICAgIGN1c3RvbVRyYWNrID0gbmV3IE11c2ljLlRyYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLmFydGlzdC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0udGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hbGJ1bS5yZWxlYXNlX2RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hbGJ1bS5jb3Zlcl9tZWRpdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gT24gY29uc3RydWl0IGxlIHRlbXBsYXRlXG4gICAgICAgICAgICB2YXIgaHRtbCA9IEdVSS50ZW1wbGF0ZShcImJhc2UtdHJhY2tcIiwgY3VzdG9tVHJhY2ssIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgJG93bC5kYXRhKCdvd2xDYXJvdXNlbCcpLmFkZEl0ZW0oaHRtbCk7XG4gICAgICAgICAgICAvLyBPbiBham91dGUgdW4gw6ljb3V0ZXVyIGQnw6l2w6luZW1lbnQgZGUgdHlwZSBjbGljIHBvdXIgY2hhcXVlIG1vcmNlYXVcbiAgICAgICAgICAgIHNlbGVjdGVkVHJhY2soXCJzdWJtaXQtXCIgKyB0cmFjay5pZCwgY3VzdG9tVHJhY2spO1xuICAgICAgICB9XG4gICAgICAgIC8vIE9uIGFmZmljaGUgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgJCggXCIjdG9nZ2xlLWNhcm91c2VsIGlcIiApXG4gICAgICAgICAgLnN3aXRjaENsYXNzKCBcImRvd25cIiwgXCJ1cFwiIClcbiAgICAgICAgICAuY3NzKCBcImJvcmRlci1jb2xvclwiLCBcIiMxODhBRTNcIiApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfVxuXG59XG5cbi8vIEdlc3Rpb24gZHUgY2xpYyBzdXIgdW4gw6lsw6ltZW50IGRlIGxhIGxpc3RlIGRlIHN1Z2dlc3Rpb25zXG5mdW5jdGlvbiBzZWxlY3RlZFRyYWNrKGVsdElkLCB0cmFjaykge1xuICAgICQoIGRvY3VtZW50ICkub2ZmKCBcImNsaWNrXCIsIFwiI1wiICsgZWx0SWQgKTtcbiAgICAkKCBkb2N1bWVudCApLm9uKCBcImNsaWNrXCIsIFwiI1wiICsgZWx0SWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBPbiByZW1ldCBsZXMgY29tcHRldXJzIMOgIDAuLi5cbiAgICAgICAgaWYgKHNpbWlsYXJUcmFja3MubGVuZ3RoID4gMCkgc2ltaWxhclRyYWNrcyA9IFtdO1xuICAgICAgICAvLyBPbiBkw6lzYWN0aXZlIGxhIHJlY2hlcmNoZVxuICAgICAgICBHVUkuc2VhcmNoLm9mZigpO1xuICAgICAgICAvLyBPbiBkw6lmaW5pdCBsYSByw6lmw6lyZW5jZVxuICAgICAgICByZWZJZCA9IGVsdElkO1xuICAgICAgICByZWZUcmFjayA9IHRyYWNrO1xuICAgICAgICAvLyBBZmZlY3RhdGlvbiBkJ3VuIGFsZ29yaXRobWUgZGUgdHJpXG4gICAgICAgIHNldFNvcnRpbmdTdHJhdGVneSgpO1xuICAgICAgICAvLyBPbiBlZmZhY2UgbGVzIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgR1VJLmNsZWFuTm90aWZpY2F0aW9ucygpO1xuICAgICAgICAvLyBPbiBhZmZpY2hlIHVuIGxvYWRlciBwb3VyIGZhaXJlIHBhdGllbnRlciBsJ2ludGVybmF1dGVcbiAgICAgICAgR1VJLmxvYWRpbmcub24oKTtcbiAgICAgICAgLy8gT24gcsOpY3Vww6hyZSBsZSByw6lzdW3DqSBhdWRpbyBkdSBtb3JjZWF1IHPDqWxlY3Rpb25uw6kgc3VyIEVjaG8gTmVzdFxuICAgICAgICBnZXRJbml0aWFsQXVkaW9TdW1tYXJ5KHRyYWNrLmdldElkKCkpO1xuICAgICAgICAvLyBPbiByw6ljdXDDqHJlIGxlcyBpbmZvcm1hdGlvbnMgZMOpdGFpbGzDqWVzIGR1IG1vcmNlYXUgc3VyIERlZXplclxuICAgICAgICBnZXRUcmFja0luZm8odHJhY2suZ2V0SWQoKSk7XG4gICAgfSk7XG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgbGUgbW9yY2VhdSBzw6lsZWN0aW9ubsOpIChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRJbml0aWFsQXVkaW9TdW1tYXJ5KHRyYWNrSWQpIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZWNob25lc3RcIiwgXCIvdHJhY2svcHJvZmlsZVwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiaWRcIiwgXCJkZWV6ZXI6dHJhY2s6XCIgKyB0cmFja0lkKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiYnVja2V0XCIsIFwiYXVkaW9fc3VtbWFyeVwiKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBMZSBtb3JjZWF1IGVzdC1pbCB0cm91dsOpIHN1ciBFY2hvIE5lc3Qgw6AgcGFydGlyIGRlIGwnaWRlbnRpZmlhbnQgRGVlemVyID9cbiAgICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJUcm91dsOpIHN1ciBFY2hvIE5lc3QgIVwiLCAzKTtcbiAgICAgICAgICAgIC8vIExlIG1vcmNlYXUgdHJvdXbDqSBzdXIgRWNobyBOZXN0IGEtdC1pbCB1biByw6lzdW3DqSBhdWRpbyA/XG4gICAgICAgICAgICBpZiAoISQuaXNFbXB0eU9iamVjdChmaW5hbC5yZXNwb25zZS50cmFjay5hdWRpb19zdW1tYXJ5KSkge1xuICAgICAgICAgICAgICAgIC8vIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgdXRpbGVzIGR1IG1vcmNlYXVcbiAgICAgICAgICAgICAgICB2YXIgdHJhY2sgPSBmaW5hbC5yZXNwb25zZS50cmFjayxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSB0cmFjay50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgYXJ0aXN0ID0gdHJhY2suYXJ0aXN0LFxuICAgICAgICAgICAgICAgICAgICBrZXlJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkua2V5LFxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBWb2NhYnVsYXJ5LmtleXNba2V5SW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICBtb2RlSW5kZXggPSB0cmFjay5hdWRpb19zdW1tYXJ5Lm1vZGUsXG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBWb2NhYnVsYXJ5Lm1vZGVzW21vZGVJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIHRlbXBvID0gTWF0aC5yb3VuZCh0cmFjay5hdWRpb19zdW1tYXJ5LnRlbXBvKTtcblxuICAgICAgICAgICAgICAgIC8vIE9uIGNvbnN0cnVpdCBsZSBwcm9maWwgZHUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAgICAgICAgICAgIGJ1aWxkUmVmVHJhY2tQcm9maWxlKGtleSwgbW9kZSwgdGVtcG8pO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gYWZmaWNoZSB0b3V0IMOnYSDDoCBsJ3V0aWxpc2F0ZXVyXG4gICAgICAgICAgICAgICAgdmFyIGluZm8gPSBcIjxzdHJvbmc+wqsgXCIgKyB0aXRsZSArIFwiIMK7PC9zdHJvbmc+PGJyPlwiO1xuICAgICAgICAgICAgICAgICAgICBpbmZvICs9IFwiPGVtPlwiICsgYXJ0aXN0ICsgXCI8L2VtPjxicj5cIjtcbiAgICAgICAgICAgICAgICAgICAgaW5mbyArPSBcIjx1PlRvbmFsaXTDqTwvdT4gOiBcIiArIGtleSArIFwiIFwiICsgbW9kZSArIFwiPGJyPlwiO1xuICAgICAgICAgICAgICAgICAgICBpbmZvICs9IFwiPHU+VGVtcG88L3U+IDogXCIgKyB0ZW1wbyArIFwiIEJQTVwiO1xuXG4gICAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBpbmZvLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ1aWxkUmVmVHJhY2tQcm9maWxlKFwiXCIsIFwiXCIsIDApO1xuICAgICAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkxlIHLDqXN1bcOpIGF1ZGlvIGRlIGNlIG1vcmNlYXUgbidlc3QgcGFzIGRpc3BvbmlibGUgc3VyIEVjaG8gTmVzdC5cIiwgMTApO1xuICAgICAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlN1Z2dlc3Rpb24gaGFybW9uaXF1ZSBpbXBvc3NpYmxlXCIsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFJlZlRyYWNrUHJvZmlsZShcIlwiLCBcIlwiLCAwKTtcbiAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkNlIG1vcmNlYXUgbidhIHBhcyDDqXTDqSB0cm91dsOpIHN1ciBFY2hvIE5lc3QuXCIsIDEwKTtcbiAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIlN1Z2dlc3Rpb24gaGFybW9uaXF1ZSBpbXBvc3NpYmxlXCIsIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfVxuXG59XG5cbi8vIENvbnN0cnVjdGlvbiBkdSBwcm9maWwgZHUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuZnVuY3Rpb24gYnVpbGRSZWZUcmFja1Byb2ZpbGUoa2V5LCBtb2RlLCB0ZW1wbykge1xuXG4gICAgLy8gT24gbWV0IMOgIGpvdXIgbGUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZSBhdmVjIGxlcyBkb25uw6llcyBtdXNpY2FsZXNcbiAgICBpZiAoa2V5ICE9PSBcIlwiICYmIG1vZGUgIT09IFwiXCIgJiYgdGVtcG8gIT09IDApIHtcbiAgICAgIHZhciBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZyxcbiAgICAgICAgICBoYXJtb25pZXMgPSBWb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbFtjYW1lbG90VGFnXS5tYXRjaGVzO1xuXG4gICAgICByZWZUcmFjay5zZXRLZXkoa2V5KTtcbiAgICAgIHJlZlRyYWNrLnNldE1vZGUobW9kZSk7XG4gICAgICByZWZUcmFjay5zZXRUZW1wbyh0ZW1wbyk7XG4gICAgICByZWZUcmFjay5zZXRDYW1lbG90VGFnKGNhbWVsb3RUYWcpO1xuICAgICAgcmVmVHJhY2suc2V0SGFybW9uaWVzKGhhcm1vbmllcyk7XG4gICAgfVxuXG4gICAgLy8gT24gYWpvdXRlIGxlIG1vcmNlYXUgw6AgbGEgcGxheWxpc3RcbiAgICAkKCBcIiNcIiArIHJlZklkICkubmV4dCgpLnZhbChlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkocmVmVHJhY2spKSk7XG4gICAgR1VJLnBsYXlsaXN0LmFkZFRyYWNrKHJlZklkKTtcblxuICAgIC8vIE9uIGVuIHByb2ZpdGUgcG91ciBjb25zdHJ1aXJlIGwnaGFybW9uaWUgZGUgYmFzZVxuICAgIGJ1aWxkSGFybW9ueVByb2ZpbGUocmVmVHJhY2spO1xuXG59XG5cbi8vIENvbnN0cnVjdGlvbiBkdSBwcm9maWwgZGUgYmFzZSBkZSBsJ2hhcm1vbmllIHJlY2hlcmNow6llXG5mdW5jdGlvbiBidWlsZEhhcm1vbnlQcm9maWxlKHRyYWNrKSB7XG4gICAgaGFybW9ueSA9IG5ldyBNdXNpYy5IYXJtb255KHRyYWNrLCBudWxsLCBHVUkudGVtcG9WYXJpYXRpb24pO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIHN1ciB1biBtb3JjZWF1LCBub3RhbW1lbnQgcG91ciBhdm9pciBsJ2lkIGRlIGwnYXJ0aXN0ZSAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0VHJhY2tJbmZvKHRyYWNrSWQpIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL3RyYWNrL1wiICsgdHJhY2tJZCk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIGVycm9yKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgZ2V0U2ltaWxhckFydGlzdHMocmVzcG9uc2UuYXJ0aXN0LmlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH1cblxufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgYXJ0aXN0ZXMgc2ltaWxhaXJlcyAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0U2ltaWxhckFydGlzdHMoYXJ0aXN0SWQpIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL2FydGlzdC9cIiArIGFydGlzdElkICsgXCIvcmVsYXRlZFwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMTApO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBlcnJvcik7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBhcnRpc3RzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwicmVxdWVzdF9tZXRob2RcIjpcImdldFwiLFxuICAgICAgICAgICAgICAgIFwicmVsYXRpdmVfdXJsXCI6XCJhcnRpc3QvXCIgKyByZXNwb25zZS5kYXRhW2ldLmlkICsgXCIvdG9wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFydGlzdHMgPSBKU09OLnN0cmluZ2lmeShhcnRpc3RzKTtcbiAgICAgICAgZ2V0VG9wVHJhY2tzKGFydGlzdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfVxuXG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBjaGFuc29ucyBsZXMgcGx1cyBwb3B1bGFpcmVzIGRlIGNoYXF1ZSBhcnRpc3RlIHNpbWlsYWlyZSAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0VG9wVHJhY2tzKHNpbWlsYXJBcnRpc3RzKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9iYXRjaFwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMTApO1xuICAgIHJlcXVlc3QuYWRkUGFyYW0oXCJtZXRob2RzXCIsIHNpbWlsYXJBcnRpc3RzKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAvLyB2YXIgaWRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5iYXRjaF9yZXN1bHQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhcnRpc3QgPSByZXNwb25zZS5iYXRjaF9yZXN1bHRbaV07XG4gICAgICAgICAgICAkLmVhY2goYXJ0aXN0LmRhdGEsIGZ1bmN0aW9uKGksIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9wVHJhY2sgPSBpdGVtLFxuICAgICAgICAgICAgICAgICAgICBhbGJ1bSA9IGl0ZW0uYWxidW07XG5cbiAgICAgICAgICAgICAgICAvLyBpZHMucHVzaCh0b3BUcmFjay5pZCk7XG4gICAgICAgICAgICAgICAgZ2V0VG9wVHJhY2tJbmZvKHRvcFRyYWNrLmlkLCBhbGJ1bSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXRUb3BUcmFja3NJbmZvKGlkcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9XG5cbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGluZm9ybWF0aW9ucyBkZSB0ZW1wbyBldCBkZSB0b25hbGl0w6kgcG91ciB0b3VzIGxlcyB0b3AgbW9yY2VhdXggKEVjaG8gTmVzdClcbmZ1bmN0aW9uIGdldFRvcFRyYWNrSW5mbyhpZCwgYWxidW0pIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBmYWN0b3J5LmdldEFqYXhSZXF1ZXN0KFwiZWNob25lc3RcIiwgXCIvdHJhY2svcHJvZmlsZVwiKTsgLy8gc29uZy4uLlxuICAgIC8qIHZhciB0cmFja3NJZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0cmFja3NJZHMucHVzaChcImRlZXplcjp0cmFjazpcIiArIGlkc1tpXSk7XG4gICAgfSAqL1xuICAgIHJlcXVlc3QuYWRkUGFyYW0oXCJidWNrZXRcIiwgXCJhdWRpb19zdW1tYXJ5XCIpO1xuICAgIHJlcXVlc3QuYWRkUGFyYW0oXCJpZFwiLCBcImRlZXplcjp0cmFjazpcIiArIGlkKTtcbiAgICAvLyByZXF1ZXN0LmFkZFBhcmFtKFwidHJhY2tfaWRcIiwgdHJhY2tzSWRzKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBJbCBmYXV0IHF1ZSBsZXMgbW9yY2VhdXggc29pZW50IHRyb3V2w6lzIHN1ciBFY2hvIE5lc3RcbiAgICAgICBpZiAoZmluYWwucmVzcG9uc2UudHJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAvLyBJbCBmYXV0IHF1ZSBsZXMgbW9yY2VhdXggcG9zc8OoZGVudCB1biByw6lzdW3DqSBhdWRpbyBzdXIgRWNobyBOZXN0XG4gICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgLy8gdmFyIGlkcyA9IFtdO1xuICAgICAgICAgIC8vIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaW5hbC5yZXNwb25zZS5zb25ncy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gIE9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcm1hdGlvbnMgdXRpbGVzXG4gICAgICAgICAgICB2YXIgdHJhY2sgPSBmaW5hbC5yZXNwb25zZS50cmFjaywgLy8gZmluYWwucmVzcG9uc2Uuc29uZ3NbaV1cbiAgICAgICAgICAgICAgICB0aXRsZSA9IHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmFydGlzdCwgLy8gdHJhY2suYXJ0aXN0X25hbWVcbiAgICAgICAgICAgICAgICBrZXlJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkua2V5LFxuICAgICAgICAgICAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1trZXlJbmRleF0sXG4gICAgICAgICAgICAgICAgbW9kZUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5tb2RlLFxuICAgICAgICAgICAgICAgIG1vZGUgPSBWb2NhYnVsYXJ5Lm1vZGVzW21vZGVJbmRleF0sXG4gICAgICAgICAgICAgICAgdGVtcG8gPSBNYXRoLnJvdW5kKHRyYWNrLmF1ZGlvX3N1bW1hcnkudGVtcG8pLFxuICAgICAgICAgICAgICAgIGNhbWVsb3RUYWcgPSBWb2NhYnVsYXJ5Lmhhcm1vbmljTWl4W21vZGVdW2tleV0udGFnO1xuXG4gICAgICAgICAgICAvLyBpZHMucHVzaCh0cmFjay5pZCk7XG4gICAgICAgICAgICAvLyBPbiBhbGltZW50ZSB1biB0YWJsZWF1IGRlIG1vcmNlYXV4IHBvdXIgZGVzIHRyaXMgdWx0w6lyaWV1cnNcbiAgICAgICAgICAgIHZhciB0b3BUcmFjayA9IG5ldyBNdXNpYy5UcmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnRpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bS5yZWxlYXNlX2RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsYnVtLmNvdmVyX21lZGl1bSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FtZWxvdFRhZywgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBzaW1pbGFyVHJhY2tzLnB1c2godG9wVHJhY2spO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfVxuXG59XG5cbi8vIExvcnNxdWUgc2UgdGVybWluZW50IHRvdXRlcyBsZXMgcmVxdcOqdGVzIEFqYXggZW4gY291cnMuLi5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoZnVuY3Rpb24oKSB7XG4gIC8vIC4uLiBvbiBlbmzDqHZlIGxlIGxvYWRlciB2dSBxdWUgYydlc3QgbGEgZmluIGRlcyByZXF1w6p0ZXMuLi5cbiAgR1VJLmxvYWRpbmcub2ZmKCk7XG4gIC8vIC4uLiBldCBvbiBsYW5jZSBsZSB0cmkgZGVzIG1vcmNlYXV4IHLDqWN1cMOpcsOpcyAocydpbCB5IGVuIGEpXG4gIGlmIChzaW1pbGFyVHJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICBzaW1pbGFyVHJhY2tzID0gc29ydGluZ1N0cmF0ZWd5LnNvcnQoaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gICAgZGlzcGxheVRyYWNrcyhzaW1pbGFyVHJhY2tzKTtcbiAgfVxufSk7XG5cbi8vIEFmZmljaGFnZSBkZXMgbW9yY2VhdXggc2Vsb24gdW4gb3JkcmUgZMOpdGVybWluw6kgcGFyIGxlIHRyaVxuZnVuY3Rpb24gZGlzcGxheVRyYWNrcyh0cmFja3MpIHtcblxuICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmhpZGUoKTtcbiAgR1VJLnNjcm9sbC5kZXN0cm95KCRoYXJtb25pY1RyYWNrcyk7XG4gICRoYXJtb25pY1RyYWNrcy5lbXB0eSgpO1xuXG4gIHZhciBodG1sID0gR1VJLnRlbXBsYXRlKFwiaGVscFwiLCBudWxsLCBudWxsLCBudWxsKTtcblxuICAvLyBJdMOpcmF0aW9ucyBzdXIgbm90cmUgY29sbGVjdGlvbiBkZSBtb3JjZWF1eFxuICBpdGVyYXRvciA9IG5ldyBJdGVyYXRvcih0cmFja3MpO1xuICB3aGlsZSAoaXRlcmF0b3IuaGFzTmV4dCgpKSB7XG5cbiAgICB2YXIgdHJhY2sgPSBpdGVyYXRvci5uZXh0KCk7XG5cbiAgICBoYXJtb255LnNldE90aGVyVHJhY2sodHJhY2spO1xuICAgIHZhciBpc1RlbXBvQ29tcGF0aWJsZSA9IGhhcm1vbnkudGVtcG9Db21wYXRpYmlsaXR5KCksXG4gICAgICAgIGlzS2V5Q29tcGF0aWJsZSA9IGhhcm1vbnkua2V5Q29tcGF0aWJpbGl0eSgpO1xuXG4gICAgaHRtbCArPSBHVUkudGVtcGxhdGUoXCJoYXJtb25pYy10cmFja1wiLCB0cmFjaywgaXNUZW1wb0NvbXBhdGlibGUsIGlzS2V5Q29tcGF0aWJsZSk7XG4gICAgc2VsZWN0ZWRUcmFjayhcInN1Z2dlc3Rpb24tXCIgKyB0cmFjay5nZXRJZCgpLCB0cmFjayk7XG5cbiAgfVxuXG4gICRoYXJtb25pY1RyYWNrcy5hcHBlbmQoaHRtbCk7XG4gIEdVSS5zY3JvbGwucmVzZXQoJGhhcm1vbmljVHJhY2tzKTtcbiAgR1VJLmRpc3BsYXlGaW5hbFRyYWNrbGlzdCgpO1xuICBzaW1pbGFyVHJhY2tzID0gW107XG5cbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2U4NzBmM2FlLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSJdfQ==
