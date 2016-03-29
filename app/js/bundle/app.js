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
    if ($( "#tracks" ).is( ":visible" )) {
      $( "#toggle-carousel" ).trigger( "click" );
    }
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
        var btnId = $( this ).attr( "id" );
        if (btnId !== undefined) {
          sidebarId = btnId.substr(0, btnId.lastIndexOf("-"));
        }

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
        $( document ).tooltip( "destroy" ); // jQuery UI
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
    harmony,
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f12d6738.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9BamF4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL2FwcC9qcy9tb2R1bGVzL0l0ZXJhdG9yLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9NdXNpYy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9hcHAvanMvbW9kdWxlcy9QbGF5bGlzdC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvU29ydGluZy5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVXNlci5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvYXBwL2pzL3NjcmlwdHMvZmFrZV9mMTJkNjczOC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvSEFSTU9ORUVaRVIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9IQVJNT05FRVpFUi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L0hBUk1PTkVFWkVSL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9kQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGZvdXJuaXNzYW50IHVuZSBhcmNoaXRlY3R1cmUgcsOpdXRpbGlzYWJsZSBwb3VyIGfDqXJlciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAqXG4gKiBAbW9kdWxlIEFqYXhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBBamF4ID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGfDqW7DqXJpcXVlIHBvdXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gICAqXG4gICAqIEBjbGFzcyBSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIGRlIHJlcXXDqnRlIChHRVQgb3UgUE9TVClcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkwgZGUgcmVxdcOqdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFUeXBlIFR5cGUgZGUgZG9ubsOpZXMgcmVudm95w6llcyAoSlNPTiwgWE1MLCAuLi4pXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFBhcmFtw6h0cmVzIGRlIHJlcXXDqnRlXG4gICAqL1xuICBSZXF1ZXN0OiBmdW5jdGlvbih0eXBlLCB1cmwsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgLyoqXG4gICAgICogVHlwZSBkZSByZXF1w6p0ZSAoR0VUIG91IFBPU1QpXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgdHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIC8qKlxuICAgICAqIFVSTCBkZSByZXF1w6p0ZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHVybFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX3VybCA9IHVybDtcbiAgICAvKipcbiAgICAgKiBUeXBlIGRlIGRvbm7DqWVzIHJlbnZvecOpZXMgKEpTT04sIFhNTCwgLi4uKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRhdGFUeXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fZGF0YVR5cGUgPSBkYXRhVHlwZTtcbiAgICAvKipcbiAgICAgKiBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRhdGFcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IHt9XG4gICAgICovXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpcmFudCBsZXMgcmVxdcOqdGVzIEFqYXggdmVycyBsJ0FQSSBkZSBEZWV6ZXJcbiAgICpcbiAgICogQGNsYXNzIERlZXplckFQSVJlcXVlc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBleHRlbmRzIFJlcXVlc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAqL1xuICBEZWV6ZXJBUElSZXF1ZXN0OiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBBamF4LlJlcXVlc3QuY2FsbCh0aGlzLCBcIkdFVFwiLCBcImh0dHA6Ly9hcGkuZGVlemVyLmNvbVwiICsgcGF0aCwgXCJqc29ucFwiLCB7IFwib3V0cHV0XCI6IFwianNvbnBcIiB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheCB2ZXJzIGwnQVBJIGQnRWNobyBOZXN0XG4gICAqXG4gICAqIEBjbGFzcyBFY2hvTmVzdEFQSVJlcXVlc3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBleHRlbmRzIFJlcXVlc3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAqL1xuICBFY2hvTmVzdEFQSVJlcXVlc3Q6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIEFqYXguUmVxdWVzdC5jYWxsKHRoaXMsIFwiR0VUXCIsIFwiaHR0cDovL2RldmVsb3Blci5lY2hvbmVzdC5jb20vYXBpL3Y0XCIgKyBwYXRoLCBcImpzb25wXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJhcGlfa2V5XCI6IFwiVlVTVUExSE40SE1XVUlONVBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmb3JtYXRcIjogXCJqc29ucFwiXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBjb25zdHJ1aXNhbnQgw6AgbGEgZGVtYW5kZSBkZXMgcmVxdcOqdGVzIEFqYXggZCd1biBjZXJ0YWluIHR5cGVcbiAgICpcbiAgICogQGNsYXNzIFJlcXVlc3RGYWN0b3J5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgUmVxdWVzdEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnaW5zdGFuY2llciBsZXMgY2xhc3NlcyBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheFxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBamF4UmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhcGkgQVBJIMOgIGludGVycm9nZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuIG9iamV0IGRlIHR5cGUgQWpheFxuICAgICAqL1xuICAgICAgdGhpcy5nZXRBamF4UmVxdWVzdCA9IGZ1bmN0aW9uKGFwaSwgcGF0aCkge1xuICAgICAgICAgIHZhciBhamF4UmVxdWVzdDtcbiAgICAgICAgICBpZiAoYXBpID09PSBcImRlZXplclwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRGVlemVyQVBJUmVxdWVzdChwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFwaSA9PT0gXCJlY2hvbmVzdFwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRWNob05lc3RBUElSZXF1ZXN0KHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWpheFJlcXVlc3Q7XG4gICAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgbcOocmUgOiBBamF4XG4gKi9cbiBBamF4LlJlcXVlc3QucHJvdG90eXBlID0ge1xuICAgLyoqXG4gICAgKiBNw6l0aG9kZSBwZXJtZXR0YW50IGQnYWpvdXRlciB1biBwYXJhbcOodHJlIMOgIGxhIHJlcXXDqnRlXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRQYXJhbVxuICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBDbMOpIGR1IHBhcmFtw6h0cmVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBWYWxldXIgZHUgcGFyYW3DqHRyZVxuICAgICovXG4gICBhZGRQYXJhbTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgIH0sXG4gICAvKipcbiAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnZW52b3llciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNlbmRcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1Y2Nlc3MgRm9uY3Rpb24gw6AgZXjDqWN1dGVyIGF1IHN1Y2PDqHMgZGUgbGEgcmVxdcOqdGVcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yIEZvbmN0aW9uIMOgIGV4w6ljdXRlciBsb3JzIGQndW5lIGVycmV1ciBkYW5zIGxhIHJlcXXDqnRlXG4gICAgKi9cbiAgIHNlbmQ6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgICQuYWpheCh7XG4gICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxuICAgICAgICAgdXJsOiB0aGlzLl91cmwsXG4gICAgICAgICBkYXRhVHlwZTogdGhpcy5fZGF0YVR5cGUsXG4gICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgICAgICAgdHJhZGl0aW9uYWw6IHRydWUsXG4gICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgIH0sXG4gICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgZXJyb3IocmVzcG9uc2UpO1xuICAgICAgICAgfVxuICAgICB9KTtcbiAgIH1cbiB9O1xuXG4vKipcbiAqIENsb25hZ2UgZGUgcHJvdG90eXBlIHBvdXIgY3LDqWVyIGRlcyBjbGFzc2VzIGZpbGxlc1xuICovXG5BamF4LkRlZXplckFQSVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBamF4LlJlcXVlc3QucHJvdG90eXBlKTtcbkFqYXguRGVlemVyQVBJUmVxdWVzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBamF4LkRlZXplckFQSVJlcXVlc3Q7XG5cbkFqYXguRWNob05lc3RBUElSZXF1ZXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWpheC5SZXF1ZXN0LnByb3RvdHlwZSk7XG5BamF4LkVjaG9OZXN0QVBJUmVxdWVzdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBamF4LkVjaG9OZXN0QVBJUmVxdWVzdDtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL0FqYXguanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmpzJyksXG4gICAgUGxheWxpc3QgPSByZXF1aXJlKCcuL1BsYXlsaXN0LmpzJyksXG4gICAgU29ydGluZyA9IHJlcXVpcmUoJy4vU29ydGluZy5qcycpLFxuICAgIFVzZXIgPSByZXF1aXJlKCcuL1VzZXIuanMnKTtcblxuLyoqXG4gKiBNb2R1bGUgZ8OpcmFudCBsJ2ludGVyZmFjZSBncmFwaGlxdWVcbiAqXG4gKiBAbW9kdWxlIEdVSVxuICogQGNsYXNzIEdVSVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEdVSSA9IHtcbiAgLyoqXG4gICAqIExlY3RldXIgbWFuaXB1bMOpIHBhciBsJ2ludGVyZmFjZSBncmFwaGlxdWUuXG4gICAqIEMnZXN0IMOgIGxhIGZvaXMgdW4gU2luZ2xldG9uIGV0IHVuIEFkYXB0ZXIuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwbGF5ZXJcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgcGxheWVyOiBudWxsLFxuICAvKipcbiAgICogVXRpbGlzYXRldXIgY291cmFudFxuICAgKlxuICAgKiBAcHJvcGVydHkgdXNlclxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICB1c2VyOiBudWxsLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxhIHJlY2hlcmNoZSBlc3QgYXV0b3Jpc8OpZVxuICAgKlxuICAgKiBAcHJvcGVydHkgc2VhcmNoQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgc2VhcmNoQWxsb3dlZDogdHJ1ZSxcbiAgLyoqXG4gICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgaW5mb2J1bGxlcyBzb250IGF1dG9yaXPDqWVzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB0b29sdGlwQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgdG9vbHRpcEFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIG5vdGlmaWNhdGlvbnMgc29udCBhdXRvcmlzw6llc1xuICAgKlxuICAgKiBAcHJvcGVydHkgbm90aWZBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBub3RpZkFsbG93ZWQ6IHRydWUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIHNvbnMgZCdhbWJpYW5jZSBzb250IGF1dG9yaXPDqXNcbiAgICpcbiAgICogQHByb3BlcnR5IHNvdW5kQWxsb3dlZFxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgc291bmRBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGwnYXV0b2NvbXBsw6l0aW9uIGVzdCBhdXRvcmlzw6llIGRhbnMgbGEgcmVjaGVyY2hlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBhdXRvY29tcGxldGVBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBhdXRvY29tcGxldGVBbGxvd2VkOiB0cnVlLFxuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IGxhIHZhcmlhdGlvbiBjb3VyYW50ZSBkdSB0ZW1wbyAoZW50cmUgMCBldCAxKVxuICAgKlxuICAgKiBAcHJvcGVydHkgdGVtcG9WYXJpYXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMC4wNVxuICAgKi9cbiAgdGVtcG9WYXJpYXRpb246IDAuMDUsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBzw6lsZWN0aW9ubsOpXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBzZWxlY3RlZFNvcnRpbmdcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJkZWZhdWx0XCJcbiAgICovXG4gIHNlbGVjdGVkU29ydGluZzogXCJkZWZhdWx0XCIsXG4gIC8qKlxuICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgc2kgbGVzIHNpZGViYXJzIG9udCDDqXTDqSBpbml0aWFsaXPDqWVzXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBzaWRlYmFySW5pdGlhbGl6ZWRcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBzaWRlYmFySW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAvKipcbiAgICogTcOpdGhvZGUgY2hhcmfDqWUgZCdpbml0aWFsaXNlciBsJ2ludGVyZmFjZSBncmFwaGlxdWUuXG4gICAqIENldHRlIG3DqXRob2RlIHMnaW5zcGlyZSBkdSBwYXR0ZXJuIFRlbXBsYXRlIGRhbnMgc2EgY29uY2VwdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBpbml0XG4gICAqL1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICBHVUkuYXRtb3NwaGVyZXMuYmFja2dyb3VuZHMoKTsgLy8gUG9zaXRpb24gaWTDqWFsZSBwb3VyIMOpdml0ZXIgbGVzIGJ1Z3MgIT9cbiAgICBHVUkuY3NzKCk7XG4gICAgR1VJLmNhcm91c2VsKCk7XG4gICAgR1VJLmRyYWcoKTtcbiAgICBHVUkudG9vbHRpcHMoKTtcbiAgICBHVUkuY2hlY2tib3hlcygpO1xuICAgIEdVSS5saXN0ZW5lcnMoKTtcbiAgICBHVUkubWVudS5jb25maWdTaWRlYmFyKFwiI3BsYXlsaXN0XCIsIFwiYmx1ZVwiKTtcbiAgICBHVUkubWVudS5jb25maWdTaWRlYmFyKFwiI2Zhdm9yaXRlc1wiLCBcInJlZFwiKTtcbiAgICBHVUkubWVudS5jb25maWdTaWRlYmFyKFwiI2F0bW9zcGhlcmVzXCIsIFwiZ3JlZW5cIik7XG4gICAgR1VJLm1lbnUuY29uZmlnU2lkZWJhcihcIiNoYXJtb25pYy10cmFja3NcIiwgXCJ2aW9sZXRcIik7XG4gICAgR1VJLm1lbnUuY29uZmlnU2lkZWJhcihcIiN1c2VyXCIsIFwibWFyb29uXCIpO1xuICAgIEdVSS5zY3JvbGwuaW5pdCgpO1xuICAgIEdVSS5wbGF5bGlzdC5yZXRyaWV2ZSgpO1xuICAgIEdVSS5wbGF5ZXIgPSBQbGF5ZXIuZ2V0UGxheWVyKCk7XG4gICAgR1VJLnBsYXllci5pbml0KCk7XG4gICAgR1VJLnBsYXlsaXN0LmF1dG9jaGFuZ2UoKTtcbiAgICBHVUkuYWNjb3VudC5zdGF0dXMoKTtcbiAgfSxcbiAgLyoqXG4gICAqIEhhY2tzIENTU1xuICAgKlxuICAgKiBAbWV0aG9kIGNzc1xuICAgKi9cbiAgY3NzOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIi5wdXNoZXJcIiApLmNzcyhcImhlaWdodFwiLCBcIjEwMCVcIik7XG4gICAgaWYgKCQoIHdpbmRvdyApLndpZHRoKCkgPCA2MDApIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnN3aXRjaENsYXNzKCBcImZpdmVcIiwgXCJmb3VyXCIgKTtcbiAgICAgIEdVSS5zb3VuZEFsbG93ZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCggXCIjbWVudVwiICkuc3dpdGNoQ2xhc3MoIFwiZm91clwiLCBcImZpdmVcIiApO1xuICAgICAgR1VJLnNvdW5kQWxsb3dlZCA9IHRydWU7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogSW5pdGlhbGlzYXRpb24gZHUgY2Fyb3VzZWwgY29udGVuYW50IGxlcyByw6lzdWx0YXRzIGRlIHJlY2hlcmNoZS5cbiAgICogTGUgY2Fyb3VzZWwgZXN0IGfDqXLDqSBwYXIgbGUgcGx1Z2luIE9XTCBDYXJvdXNlbC5cbiAgICpcbiAgICogQG1ldGhvZCBjYXJvdXNlbFxuICAgKi9cbiAgY2Fyb3VzZWw6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiI3RyYWNrc1wiICkub3dsQ2Fyb3VzZWwoe1xuICAgICAgaXRlbXM6IDEwLFxuICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXG4gICAgICBhdXRvUGxheTogdHJ1ZSxcbiAgICAgIGF1dG9wbGF5VGltZW91dDogMTAwLFxuICAgICAgc3RvcE9uSG92ZXI6IHRydWUsXG4gICAgICBsYXp5TG9hZCA6IHRydWVcbiAgICB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIEluaXRpYWxpc2F0aW9uIGR1IGRyYWcgJiBkcm9wIHN1ciBsJ2lQb2QuXG4gICAqIExlIGRyYWcgJiBkcm9wIGVzdCBnw6lyw6kgcGFyIGpRdWVyeSBVSS5cbiAgICpcbiAgICogQG1ldGhvZCBkcmFnXG4gICAqL1xuICBkcmFnOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiNpcG9kLXdyYXBwZXJcIiApLmRyYWdnYWJsZSh7IHNjcm9sbDogZmFsc2UgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkZXMgdG9vbHRpcHMuXG4gICAqIExlcyB0b29sdGlwcyBzb250IGfDqXLDqWVzIHBhciBTZW1hbnRpYyBVSSBldCBxVGlwwrIuXG4gICAqXG4gICAqIEBtZXRob2QgdG9vbHRpcHNcbiAgICovXG4gIHRvb2x0aXBzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoR1VJLnRvb2x0aXBBbGxvd2VkKSB7XG4gICAgICAvLyBTZW1hbnRpYyBVSVxuICAgICAgJCggXCJbZGF0YS10aXRsZSAhPSAnJ10sIFtkYXRhLWNvbnRlbnQgIT0gJyddXCIgKS5wb3B1cCgpO1xuICAgICAgLy8galF1ZXJ5IFVJXG4gICAgICAkKCBkb2N1bWVudCApLnRvb2x0aXAoe1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIG15OiBcImNlbnRlciB0b3BcIixcbiAgICAgICAgICBhdDogXCJjZW50ZXIgYm90dG9tKzVcIixcbiAgICAgICAgICB3aXRoaW46IFwiI2lwb2Qtd3JhcHBlclwiXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXNhdGlvbiBkZXMgY2hlY2tib3hlcy5cbiAgICogTGVzIGNoZWNrYm94ZXMgc29udCBnw6lyw6llcyBwYXIgU2VtYW50aWMgVUkuXG4gICAqXG4gICAqIEBtZXRob2QgY2hlY2tib3hlc1xuICAgKi9cbiAgY2hlY2tib3hlczogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIi51aS5jaGVja2JveFwiICkuY2hlY2tib3goKTtcbiAgfSxcbiAgLyoqXG4gICAqIETDqWZpbml0aW9uIGRlIHRvdXMgbGVzIMOpY291dGV1cnMgZCfDqXbDqW5lbWVudHNcbiAgICpcbiAgICogQG1ldGhvZCBsaXN0ZW5lcnNcbiAgICovXG4gIGxpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBzaWRlYmFyc1xuICAgIHZhciBtZW51RXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1tZW51XCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlU2lkZWJhcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjcGxheWxpc3QtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlU2lkZWJhcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2b3JpdGVzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVNpZGViYXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2F0bW9zcGhlcmVzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVNpZGViYXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2hhcm1vbmljLXRyYWNrcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVTaWRlYmFyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN1c2VyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZVNpZGViYXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1hbGxcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBbGxdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGUgbGEgcGxheWxpc3RcbiAgICB2YXIgcGxheWxpc3RFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JhbmRvbS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Qubm90UmFuZG9tLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNub3QtcmFuZG9tLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yYW5kb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JlcGVhdC1hbGwtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5vUmVwZWF0LCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNuby1yZXBlYXQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJlcGVhdE9uZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmVwZWF0LW9uZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVwZWF0QWxsLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtdXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC51bm11dGUsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3VubXV0ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubXV0ZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1icm93c2VyLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5zYXZlSW5Ccm93c2VyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1kZWV6ZXItYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnNhdmVPbkRlZXplcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2V4cG9ydC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuZXhwb3J0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZGVsZXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5kZWxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5wcmV2aW91cy1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucHJldmlvdXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5iYWNrLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5iYWNrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheWxpc3QtaXRlbVwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wbGF5RnJvbSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGF1c2UtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnBhdXNlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1wYXVzZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheVBhdXNlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIuZm9ydGgtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LmZvcnRoXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIubmV4dC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QubmV4dF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3BsYXlsaXN0XCIsIFwidHJhY2tDaGFuZ2VkXCIsIEdVSS5wbGF5bGlzdC5pY29uXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcGxheWxpc3RcIiwgXCJ0cmFja1JlbW92ZWRcIiwgR1VJLnBsYXlsaXN0LnJlbW92ZVRyYWNrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcGxheWxpc3Qtd2FybmluZ1wiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yZW1vdmVXYXJuaW5nXVxuICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBmYXZvcmlzXG4gICAgdmFyIGZhdm9yaXRlc0V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1pcG9kXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5pcG9kXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10b29sdGlwXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy50b29sdGlwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1ub3RpZnlcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLm5vdGlmeV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtc291bmRcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLnNvdW5kXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1hdXRvY29tcGxldGVcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmF1dG9jb21wbGV0ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZHVwbGljYXRlXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kdXBsaWNhdGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LXRlbXBvLXJhbmdlXCIsIFwiaW5wdXRcIiwgR1VJLmZhdm9yaXRlcy50ZW1wb1JhbmdlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1kZWZhdWx0LXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmRlZmF1bHRTb3J0aW5nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1maXJzdC1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy50ZW1wb0ZpcnN0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYta2V5LWZpcnN0LXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmtleUZpcnN0U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtYXNjLXRlbXBvLXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmFzY1RlbXBvU29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZGVzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kZXNjVGVtcG9Tb3J0aW5nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1uby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5ub1NvcnRpbmddXG4gICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGVzIGFtYmlhbmNlc1xuICAgIHZhciBhdG1vc3BoZXJlc0V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNuZXV0cmFsLWF0bW9cIiwgXCJjbGlja1wiLCBHVUkuYXRtb3NwaGVyZXMubmV1dHJhbF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcm9jay1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLnJvY2tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2VsZWN0cm8tYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5lbGVjdHJvXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNoaXBob3AtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5oaXBob3BdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2ZvbGstYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5mb2xrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNjbGFzc2ljYWwtYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5jbGFzc2ljYWxdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2phenotYXRtb1wiLCBcImNsaWNrXCIsIEdVSS5hdG1vc3BoZXJlcy5qYXp6XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtZXRhbC1hdG1vXCIsIFwiY2xpY2tcIiwgR1VJLmF0bW9zcGhlcmVzLm1ldGFsXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIHJlbGF0aWZzIGF1IGNvbXB0ZSB1dGlsaXNhdGV1clxuICAgIHZhciB1c2VyRXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2xvZ2luXCIsIFwiY2xpY2tcIiwgR1VJLmFjY291bnQubG9naW5dLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2xvZ291dFwiLCBcImNsaWNrXCIsIEdVSS5hY2NvdW50LmxvZ291dF0sXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGl2ZXJzXG4gICAgdmFyIG90aGVyRXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2xvZ29cIiwgXCJjbGlja1wiLCBHVUkubWlzYy5sb2dvXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNyZXF1ZXN0XCIsIFwiY2xpY2tcIiwgR1VJLnNlYXJjaC53YXJuaW5nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN0b2dnbGUtY2Fyb3VzZWxcIiwgXCJjbGlja1wiLCBHVUkubWlzYy50b2dnbGVDYXJvdXNlbF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdHJhY2tzLWhlbHBcIiwgXCJjbGlja1wiLCBHVUkubWlzYy5oZWxwLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW3dpbmRvdywgXCJyZXNpemVcIiwgR1VJLmNzc11cbiAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgLy8gQWpvdXQgZGVzIMOpY291dGV1cnMgZCfDqXbDqW5lbWVudHNcbiAgICBhZGRFdmVudHMobWVudUV2ZW50cyk7XG4gICAgYWRkRXZlbnRzKHBsYXlsaXN0RXZlbnRzKTtcbiAgICBhZGRFdmVudHMoZmF2b3JpdGVzRXZlbnRzKTtcbiAgICBhZGRFdmVudHMoYXRtb3NwaGVyZXNFdmVudHMpO1xuICAgIGFkZEV2ZW50cyh1c2VyRXZlbnRzKTtcbiAgICBhZGRFdmVudHMob3RoZXJFdmVudHMpO1xuXG4gICAgLy8gRm9uY3Rpb25zIGQnYWpvdXQgZCfDqXbDqW5lbWVudHNcbiAgICBmdW5jdGlvbiBhZGRFdmVudHMoZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGVbaV1bM10gPT0gXCJhc3luY1wiKSB7XG4gICAgICAgICAgJCggZG9jdW1lbnQgKS5vbiggZVtpXVsxXSwgZVtpXVswXSwgZVtpXVsyXSk7IC8vIGTDqWzDqWdhdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoIGVbaV1bMF0gKS5vbiggZVtpXVsxXSwgZVtpXVsyXSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSB0ZW1wbGF0ZSBjcsOpYW50IGR5bmFtaXF1ZW1lbnQgdW4gZnJhZ21lbnQgSFRNTFxuICAgKlxuICAgKiBAbWV0aG9kIHRlbXBsYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgZGUgdGVtcGxhdGUgKHN1Z2dlc3Rpb25zIGRlIGJhc2Ugb3UgaGFybW9uaXF1ZXMpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBPYmpldCByZXByw6lzZW50YW50IG1vcmNlYXUgZGUgbXVzaXF1ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzVGVtcG9Db21wYXRpYmxlIENvbXBhdGliaWxpdMOpIG91IG5vbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzS2V5Q29tcGF0aWJsZSBDb21wYXRpYmlsaXTDqSBvdSBub24gZGUgbGEgdG9uYWxpdMOpXG4gICAqL1xuICB0ZW1wbGF0ZTogZnVuY3Rpb24odHlwZSwgdHJhY2ssIGlzVGVtcG9Db21wYXRpYmxlLCBpc0tleUNvbXBhdGlibGUpIHtcblxuICAgIHZhciBodG1sID0gXCJcIixcbiAgICAgICAgYXJ0aXN0TmFtZSA9IFwiXCIsXG4gICAgICAgIG1heFN0cmluZ0xlbmd0aCA9IDA7XG5cbiAgICBpZiAodHlwZSA9PSBcImJhc2UtdHJhY2tcIikgeyAvLyBNb3JjZWF1IGRlIGJhc2VcblxuICAgICAgYXJ0aXN0TmFtZSA9IHRyYWNrLmdldEFydGlzdCgpO1xuICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwO1xuXG4gICAgICAvLyBTaSBsZSBub20gZGUgbCdhcnRpc3RlIGVzdCBleGFnw6lyw6ltZW50IGxvbmcsIG9uIGxlIHRyb25xdWUgw6AgbCdhZmZpY2hhZ2VcbiAgICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICBhcnRpc3ROYW1lID0gYXJ0aXN0TmFtZS5zdWJzdHIoMCwgbWF4U3RyaW5nTGVuZ3RoKSArIFwiIC4uLlwiO1xuICAgICAgfVxuXG4gICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwidHJhY2tcIiBpdGVtc2NvcGUgaXRlbXR5cGU9XCJodHRwczovL3NjaGVtYS5vcmcvTXVzaWNSZWNvcmRpbmdcIj4nO1xuICAgICAgaHRtbCArPSAnIDxmaWd1cmUgaWQ9XCJzdWJtaXQtJyArIHRyYWNrLmdldElkKCkgKyAnXCI+JztcbiAgICAgIGh0bWwgKz0gJyAgIDxpbWcgY2xhc3M9XCJsYXp5T3dsXCIgZGF0YS1zcmM9XCInICsgdHJhY2suZ2V0Q292ZXIoKSArICdcIiBhbHQ9XCInICsgdHJhY2suZ2V0VGl0bGUoKSArICdcIj4nO1xuICAgICAgaHRtbCArPSAnICAgPGZpZ2NhcHRpb24+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgaHRtbCArPSAnICAgICAgIDxoMyBjbGFzcz1cInRyYWNrLXRpdGxlXCIgaXRlbXByb3A9XCJuYW1lXCI+JyArIHRyYWNrLmdldFRpdGxlKCkgKyAnPC9oMz4nO1xuICAgICAgaHRtbCArPSAnICAgICAgIDxwIGNsYXNzPVwiYXJ0aXN0LW5hbWVcIiBpdGVtcHJvcD1cImJ5QXJ0aXN0XCI+JyArIGFydGlzdE5hbWUgKyBcIjwvcD5cIjtcbiAgICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICAgIGh0bWwgKz0gJyAgIDwvZmlnY2FwdGlvbj4nO1xuICAgICAgaHRtbCArPSAnIDwvZmlndXJlPic7XG4gICAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkodHJhY2spKSArICdcIj4nO1xuICAgICAgaHRtbCArPSAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIGh0bWw7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJoYXJtb25pYy10cmFja1wiKSB7IC8vIE1vcmNlYXUgaGFybW9uaXF1ZVxuXG4gICAgICBhcnRpc3ROYW1lID0gdHJhY2suZ2V0QXJ0aXN0KCk7XG4gICAgICBtYXhTdHJpbmdMZW5ndGggPSAxMDA7XG5cbiAgICAgIHZhciB0ZW1wb0Nzc0NsYXNzID0gXCJyZWRcIixcbiAgICAgICAgICB0b25hbGl0eUNzc0NsYXNzID0gXCJyZWRcIjtcblxuICAgICAgLy8gT24gZ8OocmUgbGUgY2FzIG/DuSBsZSBub20gZGUgbCdhcnRpc3RlIGVzdCBleGFnw6lyw6ltZW50IGxvbmdcbiAgICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICBhcnRpc3ROYW1lID0gYXJ0aXN0TmFtZS5zdWJzdHIoMCwgbWF4U3RyaW5nTGVuZ3RoKSArIFwiIC4uLlwiO1xuICAgICAgfVxuXG4gICAgICAvLyBPbiBzaWduYWxlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlc1xuICAgICAgaWYgKGlzVGVtcG9Db21wYXRpYmxlKSB7IHRlbXBvQ3NzQ2xhc3MgPSBcImdyZWVuXCI7IH1cbiAgICAgIGlmIChpc0tleUNvbXBhdGlibGUpIHsgdG9uYWxpdHlDc3NDbGFzcyA9IFwiZ3JlZW5cIjsgfVxuXG4gICAgICBodG1sICs9ICc8YSBjbGFzcz1cImhhcm1vbmljLXRyYWNrXCIgaXRlbXNjb3BlIGl0ZW10eXBlPVwiaHR0cHM6Ly9zY2hlbWEub3JnL011c2ljQ29tcG9zaXRpb25cIj4nO1xuICAgICAgaHRtbCArPSAnIDxmaWd1cmUgaWQ9XCJzdWdnZXN0aW9uLScgKyB0cmFjay5nZXRJZCgpICsgJ1wiPic7XG4gICAgICBodG1sICs9ICcgICA8aW1nIHNyYz1cIicgKyB0cmFjay5nZXRDb3ZlcigpICsgJ1wiIGFsdD1cIicgKyB0cmFjay5nZXRUaXRsZSgpICsgJ1wiPic7XG4gICAgICBodG1sICs9ICcgICA8ZmlnY2FwdGlvbj4nO1xuICAgICAgaHRtbCArPSAnICAgICA8ZGl2Pic7XG4gICAgICBodG1sICs9ICcgICAgICA8aDMgaXRlbXByb3A9XCJuYW1lXCI+JyArIHRyYWNrLmdldFRpdGxlKCkgKyAnPC9oMz4nO1xuICAgICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCJhcnRpc3QtbmFtZVwiIGl0ZW1wcm9wPVwiY29tcG9zZXJcIj4nICsgYXJ0aXN0TmFtZSArICc8L3A+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgIDxwIGNsYXNzPVwiJyArIHRlbXBvQ3NzQ2xhc3MgKyAnXCIgaXRlbXByb3A9XCJtdXNpY2FsS2V5XCI+VGVtcG8gOiAnICsgdHJhY2suZ2V0VGVtcG8oKSArICcgQlBNPC9wPic7XG4gICAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cIicgKyB0b25hbGl0eUNzc0NsYXNzICsgJ1wiIGl0ZW1wcm9wPVwibXVzaWNhbEtleVwiPlRvbmFsaXTDqSA6ICcgKyB0cmFjay5nZXRLZXkoKSArICcgJyArIHRyYWNrLmdldE1vZGUoKSArICc8L3A+JztcbiAgICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICAgIGh0bWwgKz0gJyAgIDwvZmlnY2FwdGlvbj4nO1xuICAgICAgaHRtbCArPSAnIDwvZmlndXJlPic7XG4gICAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkodHJhY2spKSArICdcIj4nO1xuICAgICAgaHRtbCArPSAnPC9hPic7XG5cbiAgICAgIHJldHVybiBodG1sO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiYXV0b2NvbXBsZXRlXCIpIHsgLy8gQXV0b2NvbXBsw6l0aW9uXG5cbiAgICAgIGh0bWwgKz0gJzxkaXYgaWQ9XCJhdXRvY29tcGxldGUtJyArIHRyYWNrLmdldElkKCkgKyAnXCI+JztcbiAgICAgIGh0bWwgKz0gJyA8c3Ryb25nPicgKyB0cmFjay5nZXRUaXRsZSgpICsgJzwvc3Ryb25nPjxicj4nO1xuICAgICAgaHRtbCArPSAnIDxlbT4nICsgdHJhY2suZ2V0QXJ0aXN0KCkgKyAnPC9lbT4nO1xuICAgICAgaHRtbCArPSAnPC9kaXY+JztcblxuICAgICAgcmV0dXJuIGh0bWw7XG5cbiAgICB9IGVsc2UgeyAvLyBDYXNlIGQnYWlkZVxuXG4gICAgICBodG1sICs9ICc8YSBjbGFzcz1cIml0ZW0gdGl0bGVcIj4nO1xuICAgICAgaHRtbCArPSAnIDxoMj5TdWdnZXN0aW9uczwvaDI+JztcbiAgICAgIGh0bWwgKz0gJzwvYT4nO1xuICAgICAgaHRtbCArPSAnPGEgaWQ9XCJ0cmFja3MtaGVscFwiIGhyZWY9XCIjXCI+JztcbiAgICAgIGh0bWwgKz0gJyAgPGkgY2xhc3M9XCJoZWxwIGNpcmNsZSBpY29uXCI+PC9pPic7XG4gICAgICBodG1sICs9ICc8L2E+JztcblxuICAgICAgcmV0dXJuIGh0bWw7XG5cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBGYWNhZGUgcGVybWV0dGFudCBkJ8Opdml0ZXIgbCdhYm9uZGFuY2UgZGUgY29uZGl0aW9ucyBkYW5zIGxlIGNvZGVcbiAgICpcbiAgICogQG1ldGhvZCBhbGVydFxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIGQnYWxlcnRlIChzdWNjw6hzLCBlcnJldXIsIG1lc3NhZ2UpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgZCdhbGVydGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVyIER1csOpZSBkZSB2aWUgZGUgbGEgbm90aWZpY2F0aW9uXG4gICAqL1xuICBhbGVydDogZnVuY3Rpb24odHlwZSwgbWVzc2FnZSwgdGltZXIpIHtcbiAgICB2YXIgbm90aWZpY2F0aW9uID0gbnVsbDtcbiAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdWNjZXNzXCI6XG4gICAgICAgICAgbm90aWZpY2F0aW9uID0gYWxlcnRpZnkuc3VjY2VzcyhtZXNzYWdlLCB0aW1lcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IGFsZXJ0aWZ5LmVycm9yKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndhcm5pbmdcIjpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBhbGVydGlmeS53YXJuaW5nKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1lc3NhZ2VcIjpcbiAgICAgICAgICBub3RpZmljYXRpb24gPSBhbGVydGlmeS5tZXNzYWdlKG1lc3NhZ2UsIHRpbWVyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJldHVybiBub3RpZmljYXRpb247XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogU3VwcHJlc3Npb24gZGUgdG91dGVzIGxlcyBub3RpZmljYXRpb25zIGFjdGl2ZXNcbiAgICpcbiAgICogQG1ldGhvZCBjbGVhbk5vdGlmaWNhdGlvbnNcbiAgICovXG4gIGNsZWFuTm90aWZpY2F0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgYWxlcnRpZnkuZGlzbWlzc0FsbCgpO1xuICB9LFxuICAvKipcbiAgICogQWZmaWNoYWdlIGRlcyBzdWdnZXN0aW9ucyBoYXJtb25pcXVlcyDDoCBsYSBmaW4gZHUgcHJvY2Vzc3VzIGRlIHJlY2hlcmNoZVxuICAgKlxuICAgKiBAbWV0aG9kIGRpc3BsYXlGaW5hbFRyYWNrbGlzdFxuICAgKi9cbiAgZGlzcGxheUZpbmFsVHJhY2tsaXN0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoJCggXCIjdHJhY2tzXCIgKS5pcyggXCI6dmlzaWJsZVwiICkpIHtcbiAgICAgICQoIFwiI3RvZ2dsZS1jYXJvdXNlbFwiICkudHJpZ2dlciggXCJjbGlja1wiICk7XG4gICAgfVxuICAgICQoIFwiI2hhcm1vbmljLXRyYWNrc1wiIClcbiAgICAgIC5zaWRlYmFyKCBcInNldHRpbmdcIiwgXCJ0cmFuc2l0aW9uXCIsIFwic2NhbGUgZG93blwiIClcbiAgICAgIC5zaWRlYmFyKCBcInNob3dcIiApO1xuICB9LFxuICAvKipcbiAgICogTWluaS1jbGFzc2UgZGUgZ2VzdGlvbiBkZSBsYSBiYXJyZSBkZSByZWNoZXJjaGVcbiAgICpcbiAgICogQGNsYXNzIEdVSS5zZWFyY2hcbiAgICovXG4gIHNlYXJjaDoge1xuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZHUgbW90ZXVyIGRlIHJlY2hlcmNoZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI3JlcXVlc3RcIiApXG4gICAgICAgIC52YWwoIFwiXCIgKVxuICAgICAgICAucHJvcCggXCJyZWFkb25seVwiLCBmYWxzZSApXG4gICAgICAgIC5uZXh0KClcbiAgICAgICAgLnN3aXRjaENsYXNzKCBcImJhblwiLCBcInNlYXJjaFwiICk7XG5cbiAgICAgIEdVSS5zZWFyY2hBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICQoIFwiI3RvZ2dsZS1jYXJvdXNlbFwiICkudHJpZ2dlciggXCJjbGlja1wiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBEw6lzYWN0aXZhdGlvbiBkdSBtb3RldXIgZGUgcmVjaGVyY2hlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG9mZlxuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNyZXF1ZXN0XCIgKVxuICAgICAgICAudmFsKCBcIlV0aWxpc2V6IGxlcyBzdWdnZXN0aW9ucyBoYXJtb25pcXVlcyAhXCIgKVxuICAgICAgICAucHJvcCggXCJyZWFkb25seVwiLCB0cnVlIClcbiAgICAgICAgLm5leHQoKVxuICAgICAgICAuc3dpdGNoQ2xhc3MoIFwic2VhcmNoXCIsIFwiYmFuXCIgKTtcbiAgICAgIEdVSS5zZWFyY2hBbGxvd2VkID0gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGwnYWxlcnRlIGNvbmNlcm5hbnQgbCfDqXRhdCBkZSBsYSByZWNoZXJjaGVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgd2FybmluZ1xuICAgICAqL1xuICAgIHdhcm5pbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFHVUkuc2VhcmNoQWxsb3dlZCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiVm91bGV6LXZvdXMgdnJhaW1lbnQgbGFuY2VyIHVuZSBub3V2ZWxsZSByZWNoZXJjaGUgPzxicj5cIjtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJMYSBwcm9ncmVzc2lvbiBoYXJtb25pcXVlIGRlIHZvdHJlIHBsYXlsaXN0IG5lIHNlcmEgcGx1cyBnYXJhbnRpZS4uLlwiO1xuXG4gICAgICAgIGFsZXJ0aWZ5LmRlZmF1bHRzLmdsb3NzYXJ5LnRpdGxlID0gXCJBdHRlbnRpb24gIVwiO1xuICAgICAgICBhbGVydGlmeS5jb25maXJtKG1lc3NhZ2UsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIEdVSS5zZWFyY2gub24oKTtcbiAgICAgICAgfSkuc2V0KFwibGFiZWxzXCIsIHsgb2s6XCJPdWlcIiwgY2FuY2VsOlwiTm9uXCIgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBJbnZpc2liaWxpdMOpIGRlIGwnYXV0b2NvbXBsw6l0aW9uIGVuIGRlc3NvdXMgZGUgMyBjYXJhY3TDqHJlc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBoaWRlQXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgaGlkZUF1dG9jb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5d29yZCA9ICQoIFwiI3JlcXVlc3RcIiApLnZhbCgpO1xuICAgICAgaWYgKGtleXdvcmQubGVuZ3RoIDwgMykge1xuICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLnNsaWRlVXAoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBNaW5pLWNsYXNzZSBkZSBnZXN0aW9uIGRlcyBzY3JvbGxiYXJzLlxuICAgKiBMZXMgc2Nyb2xsYmFycyBkw6lwZW5kZW50IGR1IHBsdWdpbiBtQ3VzdG9tU2Nyb2xsYmFyLlxuICAgKlxuICAgKiBAY2xhc3MgR1VJLnNjcm9sbFxuICAgKi9cbiAgc2Nyb2xsOiB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGlzYXRpb24gZGVzIHNjcm9sbGJhcnNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIjcGxheWxpc3QsICNmYXZvcml0ZXNcIiApLm1DdXN0b21TY3JvbGxiYXIoe1xuICAgICAgICB0aGVtZTogXCJkYXJrXCIsXG4gICAgICAgIHNjcm9sbEluZXJ0aWE6IDBcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUsOpaW5pdGlhbGlzYXRpb24gY29tcGzDqHRlIGQndW5lIHNjcm9sbGJhclxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXNldFxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigkY29udGFpbmVyKSB7XG4gICAgICAkY29udGFpbmVyLm1DdXN0b21TY3JvbGxiYXIoe1xuICAgICAgICBtb3VzZVdoZWVsUGl4ZWxzOiAzMDBcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGVzdHJ1Y3Rpb24gZCd1bmUgc2Nyb2xsYmFyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigkY29udGFpbmVyKSB7XG4gICAgICAkY29udGFpbmVyLm1DdXN0b21TY3JvbGxiYXIoIFwiZGVzdHJveVwiICk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTWluaS1jbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlIGNoYXJnZW1lbnRcbiAgICpcbiAgICogQGNsYXNzIEdVSS5sb2FkaW5nXG4gICAqL1xuICBsb2FkaW5nOiB7XG4gICAgLyoqXG4gICAgICogQWN0aXZlciBsZSBsb2FkZXJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25cbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIi51aS5wYWdlLmRpbW1lclwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmVyIGxlIGxvYWRlclxuICAgICAqXG4gICAgICogQG1ldGhvZCBvZmZcbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkucGFnZS5kaW1tZXJcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdSBtZW51XG4gICAqXG4gICAqIEBjbGFzcyBHVUkubWVudVxuICAgKi9cbiAgbWVudToge1xuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gZCd1bmUgc2lkZWJhclxuICAgICAqXG4gICAgICogQG1ldGhvZCBjb25maWdTaWRlYmFyXG4gICAgICovXG4gICAgY29uZmlnU2lkZWJhcjogZnVuY3Rpb24oaWQsIGNvbG9yKSB7XG4gICAgICAkKCBpZCApXG4gICAgICAgIC5zaWRlYmFyKHtcbiAgICAgICAgICBvblNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCggaWQgKyBcIi1idG5cIiApLmFkZENsYXNzKCBjb2xvciArIFwiLWl0ZW1cIiApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25IaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIGlkICsgXCItYnRuXCIgKS5yZW1vdmVDbGFzcyggY29sb3IgKyBcIi1pdGVtXCIgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zaWRlYmFyKCBcInNldHRpbmdcIiwgXCJ0cmFuc2l0aW9uXCIsIFwib3ZlcmxheVwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBZmZpY2hlci9DYWNoZXIgdW5lIHNpZGViYXJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlU2lkZWJhclxuICAgICAqL1xuICAgIHRvZ2dsZVNpZGViYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gQ29tbWUgaWwgeSBhIHBsdXNpZXVycyBib3V0b25zIHBvdXIgbGUgbWVudSwgYydlc3QgZ8OpcsOpIHBhciB1bmUgY2xhc3NlXG4gICAgICBpZiAoJCggdGhpcyApLmhhc0NsYXNzKFwidG9nZ2xlLW1lbnVcIikpIHtcbiAgICAgICAgJCggXCIjbWVudVwiICkuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTGUgcGF0dGVybiBkZSBub21tYWdlIGVzdCBsZSBzdWl2YW50IDogc2lkZWJhcm5hbWUtYnRuXG4gICAgICAgIHZhciBidG5JZCA9ICQoIHRoaXMgKS5hdHRyKCBcImlkXCIgKTtcbiAgICAgICAgaWYgKGJ0bklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzaWRlYmFySWQgPSBidG5JZC5zdWJzdHIoMCwgYnRuSWQubGFzdEluZGV4T2YoXCItXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoIFwiI1wiICsgc2lkZWJhcklkICkuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoZXIvQ2FjaGVyIHRvdXRlcyBsZXMgc2lkZWJhcnNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdG9nZ2xlQWxsXG4gICAgICovXG4gICAgdG9nZ2xlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnNpZGViYXJcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlcyDDqWzDqW1lbnRzIHJlbGF0aWZzIMOgIGxhIHBsYXlsaXN0XG4gICAqXG4gICAqIEBjbGFzcyBHVUkucGxheWxpc3RcbiAgICovXG4gIHBsYXlsaXN0OiB7XG4gICAgLyoqXG4gICAgICogUsOpY3Vww6lyYXRpb24gZCd1bmUgcGxheWxpc3Qgc2F1dmVnYXJkw6llIGRhbnMgbGUgbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQG1ldGhvZCByZXRyaWV2ZVxuICAgICAqL1xuICAgIHJldHJpZXZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzYXZlZFBsYXlsaXN0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwbGF5bGlzdFwiKSxcbiAgICAgICAgICBpZHMgPSBbXTtcblxuICAgICAgaWYgKHNhdmVkUGxheWxpc3QgIT09IG51bGwpIHtcbiAgICAgICAgUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MgPSBKU09OLnBhcnNlKHNhdmVkUGxheWxpc3QpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZHMucHVzaChQbGF5bGlzdC5zZWxlY3RlZFRyYWNrc1tpXS5faWQpO1xuICAgICAgICB9XG4gICAgICAgIFBsYXlsaXN0LnRyYWNrc0lkcyA9IGlkcztcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGRlIGxhIGxlY3R1cmUgYWzDqWF0b2lyZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBub3RSYW5kb21cbiAgICAgKi9cbiAgICBub3RSYW5kb206IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5yYW5kb20oZmFsc2UpO1xuICAgICAgJCggXCIjcmFuZG9tLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmFuZG9tXCIsIFwibWludXNcIiApO1xuICAgICAgJCggXCIjcmFuZG9tLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm5vdC1yYW5kb20tYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiTGVjdHVyZSBhbMOpYXRvaXJlIGTDqXNhY3RpdsOpZVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZGUgbGEgbGVjdHVyZSBhbMOpYXRvaXJlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJhbmRvbVxuICAgICAqL1xuICAgIHJhbmRvbTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJhbmRvbSh0cnVlKTtcbiAgICAgICQoIFwiI25vdC1yYW5kb20tYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJtaW51c1wiLCBcInJhbmRvbVwiICk7XG4gICAgICAkKCBcIiNub3QtcmFuZG9tLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJhbmRvbS1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIkxlY3R1cmUgYWzDqWF0b2lyZSBhY3RpdsOpZVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIETDqXNhY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvblxuICAgICAqXG4gICAgICogQG1ldGhvZCBub1JlcGVhdFxuICAgICAqL1xuICAgIG5vUmVwZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmVwZWF0KDApO1xuICAgICAgJCggXCIjcmVwZWF0LWFsbC1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlZnJlc2hcIiwgXCJtaW51c1wiICk7XG4gICAgICAkKCBcIiNyZXBlYXQtYWxsLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm5vLXJlcGVhdC1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIlBhcyBkZSByw6lww6l0aXRpb25cIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3RpdmF0aW9uIGRlIGxhIHLDqXDDqXRpdGlvbiBkJ3VuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVwZWF0T25lXG4gICAgICovXG4gICAgcmVwZWF0T25lOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucmVwZWF0KDIpO1xuICAgICAgJCggXCIjbm8tcmVwZWF0LWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwibWludXNcIiwgXCJyZXBlYXRcIiApO1xuICAgICAgJCggXCIjbm8tcmVwZWF0LWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJlcGVhdC1vbmUtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgXCJSw6lww6l0aXRpb24gZHUgbW9yY2VhdSBlbiBjb3Vyc1wiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZGUgbGEgcsOpcMOpdGl0aW9uIGRlIHRvdXMgbGVzIG1vcmNlYXV4XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlcGVhdEFsbFxuICAgICAqL1xuICAgIHJlcGVhdEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLnJlcGVhdCgxKTtcbiAgICAgICQoIFwiI3JlcGVhdC1vbmUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZXBlYXRcIiwgXCJyZWZyZXNoXCIgKTtcbiAgICAgICQoIFwiI3JlcGVhdC1vbmUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwicmVwZWF0LWFsbC1idG5cIiApO1xuICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIlLDqXDDqXRpdGlvbiBkZSB0b3VzIGxlcyBtb3JjZWF1eFwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFjdGl2YXRpb24gZHUgbW9kZSBzaWxlbmNpZXV4XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG11dGVcbiAgICAgKi9cbiAgICBtdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIubXV0ZSh0cnVlKTtcbiAgICAgICQoIFwiI3VubXV0ZS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInVubXV0ZVwiLCBcIm11dGVcIiApO1xuICAgICAgJCggXCIjdW5tdXRlLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm11dGUtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiU29uIGNvdXDDqSAhXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRMOpc2FjdGl2YXRpb24gZHUgbW9kZSBzaWxlbmNpZXV4XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHVubXV0ZVxuICAgICAqL1xuICAgIHVubXV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkucGxheWVyLm11dGUoZmFsc2UpO1xuICAgICAgJCggXCIjbXV0ZS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcIm11dGVcIiwgXCJ1bm11dGVcIiApO1xuICAgICAgJCggXCIjbXV0ZS1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJ1bm11dGUtYnRuXCIgKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJTb24gcsOpdGFibGkgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNhdXZlZ2FyZGUgZGUgbGEgcGxheWxpc3QgY291cmFudGUgZGFucyBsZSBsb2NhbCBzdG9yYWdlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNhdmVJbkJyb3dzZXJcbiAgICAgKi9cbiAgICBzYXZlSW5Ccm93c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwbGF5bGlzdCA9IEpTT04uc3RyaW5naWZ5KFBsYXlsaXN0LnNlbGVjdGVkVHJhY2tzKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGxheWxpc3RcIiwgcGxheWxpc3QpO1xuICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IHNhdXZlZ2FyZMOpZSAhXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU2F1dmVnYXJkZSBkZSBsYSBwbGF5bGlzdCBjb3VyYW50ZSBzdXIgRGVlemVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNhdmVPbkRlZXplclxuICAgICAqL1xuICAgIHNhdmVPbkRlZXplcjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodXNlciAhPT0gbnVsbCkge1xuICAgICAgICBEWi5hcGkoXCJ1c2VyL21lL3BsYXlsaXN0c1wiLCBcIlBPU1RcIiwge3RpdGxlIDogXCJIQVJNT05FRVpFUlwifSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgUGxheWxpc3QuZGVlemVySWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgRFouYXBpKFwicGxheWxpc3QvXCIgKyByZXNwb25zZS5pZCArIFwiL3RyYWNrc1wiLCBcIlBPU1RcIiwge3NvbmdzOiBQbGF5bGlzdC50cmFja3NJZHMuam9pbigpfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlZvdHJlIHBsYXlsaXN0IGVzdCBzdXIgRGVlemVyICFcIiwgNSk7XG4gICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiVm91cyBuJ8OqdGVzIHBhcyBjb25uZWN0w6koZSkgIVwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEV4cG9ydCBDU1YgZGUgbGEgcGxheWxpc3QgY291cmFudGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZXhwb3J0XG4gICAgICovXG4gICAgZXhwb3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI2Nzdi1leHBvcnRcIiApLnRhYmxlVG9DU1YoKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJQbGF5bGlzdCBleHBvcnTDqWUgIVwiLCA1KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEVmZmFjZW1lbnQgZGUgbGEgcGxheWxpc3QgY291cmFudGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVsZXRlXG4gICAgICovXG4gICAgZGVsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJWb3VsZXotdm91cyB2cmFpbWVudCBzdXBwcmltZXIgdm90cmUgcGxheWxpc3QgPzxicj5cIjtcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJDZWxsZS1jaSBzZXJhIHN1cHByaW3DqWUgZMOpZmluaXRpdmVtZW50IGR1IG5hdmlnYXRldXIgZXQgc3VyIERlZXplci5cIjtcbiAgICAgICAgYWxlcnRpZnkuZGVmYXVsdHMuZ2xvc3NhcnkudGl0bGUgPSBcIkF0dGVudGlvbiAhXCI7XG4gICAgICAgIC8vIFNpIGwndXRpbGlzYXRldXIgZXN0IGQnYWNjb3JkIDpcbiAgICAgICAgYWxlcnRpZnkuY29uZmlybShtZXNzYWdlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyAtIG9uIHN1cHByaW1lIGxhIHBsYXlsaXN0IGRlIGxhIHNlc3Npb24gY291cmFudGVcbiAgICAgICAgICBQbGF5bGlzdC5yZXNldCgpO1xuICAgICAgICAgIC8vIC0gb24gc3VwcHJpbWUgbGEgcGxheWxpc3QgZHUgbG9jYWwgc3RvcmFnZVxuICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXlsaXN0XCIpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInBsYXlsaXN0XCIpO1xuICAgICAgICAgICAgR1VJLmFsZXJ0KFwic3VjY2Vzc1wiLCBcIlBsYXlsaXN0IGVmZmFjw6llIGR1IG5hdmlnYXRldXIgIVwiLCA1KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgR1VJLmFsZXJ0KFwid2FybmluZ1wiLCBcIlBsYXlsaXN0IG5vbiBzYXV2ZWdhcmTDqWUgbG9jYWxlbWVudFwiLCA1KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gLSBvbiBzdXBwcmltZSBsYSBwbGF5bGlzdCBzdXIgRGVlemVyXG4gICAgICAgICAgaWYgKFBsYXlsaXN0LmRlZXplcklkICE9IC0xKSB7XG4gICAgICAgICAgICBEWi5hcGkoXCJwbGF5bGlzdC9cIiArIFBsYXlsaXN0LmRlZXplcklkLCBcIkRFTEVURVwiLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiUGxheWxpc3QgZWZmYWPDqWUgc3VyIERlZXplciAhXCIsIDUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdVSS5hbGVydChcIndhcm5pbmdcIiwgXCJQbGF5bGlzdCBub24gc2F1dmVnYXJkw6llIHN1ciBEZWV6ZXJcIiwgNSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5zZXQoXCJsYWJlbHNcIiwgeyBvazpcIk91aVwiLCBjYW5jZWw6XCJOb25cIiB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hbGVydChcImVycm9yXCIsIFwiVm90cmUgcGxheWxpc3QgZXN0IHZpZGUgIVwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENoYW5nZW1lbnQgYXV0b21hdGlxdWUgZGUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBhdXRvY2hhbmdlXG4gICAgICovXG4gICAgIGF1dG9jaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgIERaLkV2ZW50LnN1YnNjcmliZShcInRyYWNrX2VuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgIEdVSS5wbGF5bGlzdC5uZXh0KCk7XG4gICAgICAgfSk7XG4gICAgIH0sXG4gICAgLyoqXG4gICAgICogUGFzc2FnZSBhdSBtb3JjZWF1IHByw6ljw6lkZW50XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHByZXZpb3VzXG4gICAgICovXG4gICAgcHJldmlvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci5wcmV2KCk7XG4gICAgICAkKCBcIiNwbGF5bGlzdFwiICkudHJpZ2dlciggXCJ0cmFja0NoYW5nZWRcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWxsZXIgZW4gYXJyacOocmUgZGFucyBsZSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGJhY2tcbiAgICAgKi9cbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChHVUkucGxheWVyLnRyYWNrUG9zaXRpb24gPiAxMCkge1xuICAgICAgICBHVUkucGxheWVyLnRyYWNrUG9zaXRpb24gLT0gMTA7XG4gICAgICB9XG4gICAgICBHVUkucGxheWVyLnNlZWsoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIExpcmUgbGEgcGxheWxpc3QgZGVwdWlzIGxlIGTDqWJ1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBwbGF5XG4gICAgICovXG4gICAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnBsYXllci50cmFja3NMb2FkZWQpIHtcbiAgICAgICAgR1VJLnBsYXllci5wbGF5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkucGxheWVyLnBsYXlUcmFja3MoUGxheWxpc3QudHJhY2tzSWRzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBHVUkucGxheWVyLnRyYWNrc0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgJCggXCIjcGxheWxpc3RcIiApLnRyaWdnZXIoIFwidHJhY2tDaGFuZ2VkXCIgKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBMaXJlIGxhIHBsYXlsaXN0IMOgIHBhcnRpciBkJ3VuIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheUZyb21cbiAgICAgKi9cbiAgICBwbGF5RnJvbTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5kZXggPSBwYXJzZUludCgkKCB0aGlzICkuZmluZCggXCIjcGxheWxpc3QtdHJhY2staW5kZXhcIiApLnZhbCgpKTtcbiAgICAgIEdVSS5wbGF5ZXIucGxheVRyYWNrcyhQbGF5bGlzdC50cmFja3NJZHMsIGluZGV4KTtcbiAgICAgICQoIFwiI3BsYXlsaXN0XCIgKS50cmlnZ2VyKCBcInRyYWNrQ2hhbmdlZFwiICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNZXR0cmUgZW4gcGF1c2UgdW4gbW9yY2VhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIucGF1c2UoKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIExlY3R1cmUgb3UgcGF1c2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcGxheVBhdXNlXG4gICAgICovXG4gICAgcGxheVBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIuaXNQbGF5aW5nKCkgPyBHVUkucGxheWxpc3QucGF1c2UoKSA6IEdVSS5wbGF5bGlzdC5wbGF5KCk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbGxlciBlbiBhdmFudCBkYW5zIGxlIG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYmFja1xuICAgICAqL1xuICAgIGZvcnRoOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChHVUkucGxheWVyLnRyYWNrUG9zaXRpb24gPCA5MCkge1xuICAgICAgICBHVUkucGxheWVyLnRyYWNrUG9zaXRpb24gKz0gMTA7XG4gICAgICB9XG4gICAgICBHVUkucGxheWVyLnNlZWsoR1VJLnBsYXllci50cmFja1Bvc2l0aW9uKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFBhc3NhZ2UgYXUgbW9yY2VhdSBzdWl2YW50XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5leHRcbiAgICAgKi9cbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5wbGF5ZXIubmV4dCgpO1xuICAgICAgJCggXCIjcGxheWxpc3RcIiApLnRyaWdnZXIoIFwidHJhY2tDaGFuZ2VkXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFqb3V0IGQndW4gbW9yY2VhdSDDoCBsYSBwbGF5bGlzdFxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRUcmFja1xuICAgICAqL1xuICAgIGFkZFRyYWNrOiBmdW5jdGlvbihlbHRJZCkge1xuICAgICAgdmFyIHRyYWNrID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoJCggXCIjXCIgKyBlbHRJZCApLm5leHQoKS52YWwoKSkpO1xuICAgICAgUGxheWxpc3QuYWRkVHJhY2sodHJhY2spO1xuICAgICAgR1VJLnBsYXllci5hZGRUb1F1ZXVlKFt0cmFjay5faWRdKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJNb3JjZWF1IGFqb3V0w6kgw6Agdm90cmUgcGxheWxpc3RcIiwgNSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBY3Rpb25zIMOgIGVmZmVjdHVlciBhcHLDqHMgc3VwcHJlc3Npb24gZCd1biBtb3JjZWF1IGRlIGxhIHBsYXlsaXN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVRyYWNrXG4gICAgICovXG4gICAgcmVtb3ZlVHJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnBsYXllci50cmFja3NMb2FkZWQgPSBmYWxzZTtcbiAgICAgIEdVSS5wbGF5ZXIuaXNQbGF5aW5nKCkgPyBHVUkucGxheWxpc3QucGxheSgpIDogR1VJLnBsYXllci5wbGF5VHJhY2tzKFtdKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJNb3JjZWF1IHN1cHByaW3DqSAhXCIsIDUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsJ2ljw7RuZSBkZSBsZWN0dXJlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGljb25cbiAgICAgKi9cbiAgICBpY29uOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIE9uIHV0aWxpc2Ugc2V0VGltZW91dCBjYXIgRGVlemVyIG5lIHByb3Bvc2UgcGFzIGRlIGNhbGxiYWNrIHBvdXIgbGVzIGNvbnRyw7RsZXNcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbmRleCA9IERaLnBsYXllci5nZXRDdXJyZW50SW5kZXgoKTtcbiAgICAgICAgJCggXCIucGxheWxpc3QtaXRlbVwiLCBcIiNwbGF5bGlzdFwiICkuZmluZCggXCIuc3Bpbm5lclwiICkuZmFkZU91dCgpO1xuICAgICAgICAkKCBcIiN0cmFjay1cIiArIGluZGV4ICkuZmluZCggXCIuc3Bpbm5lclwiICkuZmFkZUluKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFN1cHByZXNzaW9uIGRlIGwnYWxlcnRlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVdhcm5pbmdcbiAgICAgKi9cbiAgICByZW1vdmVXYXJuaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIHRoaXMgKS5oaWRlKCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggZmF2b3Jpc1xuICAgKlxuICAgKiBAY2xhc3MgR1VJLmZhdm9yaXRlc1xuICAgKi9cbiAgZmF2b3JpdGVzOiB7XG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsYSB2aXNpYmlsaXTDqSBkZSBsJ2lQb2RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaXBvZFxuICAgICAqL1xuICAgIGlwb2Q6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRpcG9kID0gJCggXCIjaXBvZC13cmFwcGVyXCIgKSxcbiAgICAgICAgICAkaXBvZFN0YXRlID0gJCggXCIjZmF2LWlwb2QgLnN0YXRlXCIgKTtcbiAgICAgICRpcG9kLmlzKCBcIjp2aXNpYmxlXCIgKSA/ICRpcG9kLmZhZGVPdXQoKSA6ICRpcG9kLmZhZGVJbigpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkaXBvZFN0YXRlLCBcImlQb2QgYWN0aXbDqSAhXCIsIFwiaVBvZCBkw6lzYWN0aXbDqSAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgaW5mb2J1bGxlc1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0b29sdGlwXG4gICAgICovXG4gICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHRvb2x0aXBTdGF0ZSA9ICQoIFwiI2Zhdi10b29sdGlwIC5zdGF0ZVwiICk7XG4gICAgICBpZiAoR1VJLnRvb2x0aXBBbGxvd2VkKSB7XG4gICAgICAgIEdVSS50b29sdGlwQWxsb3dlZCA9IGZhbHNlO1xuICAgICAgICAkKCBcIltkYXRhLXRpdGxlICE9ICcnXSwgW2RhdGEtY29udGVudCAhPSAnJ11cIiApLnBvcHVwKCBcImRlc3Ryb3lcIiApOyAvLyBTZW1hbnRpYyBVSVxuICAgICAgICAkKCBkb2N1bWVudCApLnRvb2x0aXAoIFwiZGVzdHJveVwiICk7IC8vIGpRdWVyeSBVSVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR1VJLnRvb2x0aXBBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgR1VJLnRvb2x0aXBzKCk7XG4gICAgICB9XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCR0b29sdGlwU3RhdGUsIFwiSW5mb2J1bGxlcyBhY3RpdsOpZXMgIVwiLCBcIkluZm9idWxsZXMgZMOpc2FjdGl2w6llcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgbm90aWZpY2F0aW9uc1xuICAgICAqXG4gICAgICogQG1ldGhvZCBub3RpZnlcbiAgICAgKi9cbiAgICBub3RpZnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRub3RpZlN0YXRlID0gJCggXCIjZmF2LW5vdGlmeSAuc3RhdGVcIiApO1xuICAgICAgR1VJLm5vdGlmQWxsb3dlZCA/IChHVUkubm90aWZBbGxvd2VkID0gZmFsc2UpIDogKEdVSS5ub3RpZkFsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJG5vdGlmU3RhdGUsIFwiTm90aWZpY2F0aW9ucyBhY3RpdsOpZXMgIVwiLCBcIk5vdGlmaWNhdGlvbnMgZMOpc2FjdGl2w6llcyAhXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZXMgc29ucyBkJ2FtYmlhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvdW5kXG4gICAgICovXG4gICAgc291bmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRzb3VuZFN0YXRlID0gJCggXCIjZmF2LXNvdW5kIC5zdGF0ZVwiICk7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID8gKEdVSS5zb3VuZEFsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLnNvdW5kQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkc291bmRTdGF0ZSwgXCJTb25zIGQnYW1iaWFuY2UgYWN0aXbDqXMgIVwiLCBcIlNvbnMgZCdhbWJpYW5jZSBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGUgbCdhdXRvY29tcGzDqXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgYXV0b2NvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkYXV0b2NvbXBsZXRlU3RhdGUgPSAkKCBcIiNmYXYtYXV0b2NvbXBsZXRlIC5zdGF0ZVwiICk7XG4gICAgICBpZiAoR1VJLmF1dG9jb21wbGV0ZUFsbG93ZWQpIHtcbiAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5mYWRlT3V0KCk7XG4gICAgICAgIEdVSS5hdXRvY29tcGxldGVBbGxvd2VkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBHVUkuYXV0b2NvbXBsZXRlQWxsb3dlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRhdXRvY29tcGxldGVTdGF0ZSwgXCJBdXRvY29tcGzDqXRpb24gYWN0aXbDqWUgIVwiLCBcIkF1dG9jb21wbMOpdGlvbiBkw6lzYWN0aXbDqWUgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZGVzIGRvdWJsb25zIGRhbnMgbGVzIHN1Z2dlc3Rpb25zXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIGR1cGxpY2F0ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGR1cGxpY2F0ZVN0YXRlID0gJCggXCIjZmF2LWR1cGxpY2F0ZSAuc3RhdGVcIiApO1xuICAgICAgU29ydGluZy5kdXBsaWNhdGVzQWxsb3dlZCA/IChTb3J0aW5nLmR1cGxpY2F0ZXNBbGxvd2VkID0gZmFsc2UpIDogKFNvcnRpbmcuZHVwbGljYXRlc0FsbG93ZWQgPSB0cnVlKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJGR1cGxpY2F0ZVN0YXRlLCBcIkRvdWJsb25zIGFjdGl2w6lzICFcIiwgXCJEb3VibG9ucyBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZCd1bmUgdG9sw6lyYW5jZSBwb3VyIGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvUmFuZ2VcbiAgICAgKi9cbiAgICB0ZW1wb1JhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZW1wb1ZhcmlhdGlvbiA9ICQoIFwiaW5wdXRbdHlwZT0ncmFuZ2UnXVwiICkudmFsKCk7XG4gICAgICAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ10gKyBzcGFuXCIgKS50ZXh0KCB0ZW1wb1ZhcmlhdGlvbiArIFwiICVcIiApO1xuICAgICAgR1VJLnRlbXBvVmFyaWF0aW9uID0gKHRlbXBvVmFyaWF0aW9uIC8gMTAwKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBwYXIgZMOpZmF1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWZhdWx0U29ydGluZ1xuICAgICAqL1xuICAgIGRlZmF1bHRTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlZmF1bHRcIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBmYXZvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvRmlyc3RTb3J0aW5nXG4gICAgICovXG4gICAgdGVtcG9GaXJzdFNvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwidGVtcG9GaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGZhdm9yaXNhbnQgbGEgdG9uYWxpdMOpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGtleUZpcnN0U29ydGluZ1xuICAgICAqL1xuICAgIGtleUZpcnN0U29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJrZXlGaXJzdFwiO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogU8OpbGVjdGlvbiBkZSBsJ2FsZ29yaXRobWUgZGUgdHJpIGNyb2lzc2FudCBkdSB0ZW1wb1xuICAgICAqXG4gICAgICogQG1ldGhvZCBhc2NUZW1wb1NvcnRpbmdcbiAgICAgKi9cbiAgICBhc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiYXNjVGVtcG9cIjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFPDqWxlY3Rpb24gZGUgbCdhbGdvcml0aG1lIGRlIHRyaSBkw6ljcm9pc3NhbnQgZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVzY1RlbXBvU29ydGluZ1xuICAgICAqL1xuICAgIGRlc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiZGVzY1RlbXBvXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTw6lsZWN0aW9uIGR1IHRyaSBwbGFjZWJvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vU29ydGluZ1xuICAgICAqL1xuICAgIG5vU29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJub25lXCI7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnw6l0YXQgKG9uL29mZilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY2hhbmdlU3RhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gJHN0YXRlIENoYW1wIGNhY2jDqSBjb250ZW5hbnQgbCfDqXRhdCBkZSBsJ29iamV0IGRhbnMgbGUgRE9NXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBvc2l0aXZlTWVzc2FnZSBNZXNzYWdlIGQnYWN0aXZhdGlvbiAodmVydClcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmVnYXRpdmVNZXNzYWdlIE1lc3NhZ2UgZGUgZMOpc2FjdGl2YXRpb24gKHJvdWdlKVxuICAgICAqL1xuICAgIGNoYW5nZVN0YXRlOiBmdW5jdGlvbigkc3RhdGUsIG9uTWVzc2FnZSwgb2ZmTWVzc2FnZSkge1xuICAgICAgaWYgKCRzdGF0ZS52YWwoKSA9PSBcIm9uXCIpIHtcbiAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgb2ZmTWVzc2FnZSwgNSk7XG4gICAgICAgICRzdGF0ZS52YWwoIFwib2ZmXCIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgb25NZXNzYWdlLCA1KTtcbiAgICAgICAgJHN0YXRlLnZhbCggXCJvblwiICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGludGVybmUgZ8OpcmFudCBsZXMgw6lsw6ltZW50cyByZWxhdGlmcyBhdXggYW1iaWFuY2VzXG4gICAqXG4gICAqIEBjbGFzcyBHVUkuYXRtb3NwaGVyZXNcbiAgICovXG4gIGF0bW9zcGhlcmVzOiB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGlzYXRpb24gZHUgcGx1Z2luIFZlZ2FzIHBvdXIgbGVzIGJhY2tncm91bmRzIGFuaW3DqXNcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdmVnYXNcbiAgICAgKi9cbiAgICBiYWNrZ3JvdW5kczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoJCggd2luZG93ICkud2lkdGgoKSA+PSA2MDApIHtcbiAgICAgICAgJCggXCIjbWFpblwiICkudmVnYXMoe1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJzd2lybExlZnRcIixcbiAgICAgICAgICAgIHNsaWRlOiAwLFxuICAgICAgICAgICAgc2xpZGVzOiBbXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9uZXV0cmFsLmpwZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9yb2NrLmpwZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9lbGVjdHJvLmpwZ1wiIH0sXG4gICAgICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9oaXBob3AuanBnXCIgfSxcbiAgICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2ZvbGsuanBnXCIgfSxcbiAgICAgICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2NsYXNzaWNhbC5qcGdcIiB9LFxuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvamF6ei5qcGdcIiB9LFxuICAgICAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvbWV0YWwuanBnXCIgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICAgICAgJCggXCIjbWFpblwiICkudmVnYXMoJ3BhdXNlJyk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDaGFuZ2VtZW50IGQnYW1iaWFuY2VcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYXBwbHlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggSW5kaWNlIGRlIGwnYW1iaWFuY2UgZGFucyBWZWdhc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdG1vIE5vbSBkZSBsJ2FtYmlhbmNlXG4gICAgICovXG4gICAgYXBwbHk6IGZ1bmN0aW9uKGluZGV4LCBhdG1vKSB7XG4gICAgICAkKCBcIiNcIiArIGF0bW8gKyBcIi1hdG1vXCIgKS5hZGRDbGFzcyggXCJncmVlbi1pdGVtXCIgKTtcbiAgICAgICQoIFwiI1wiICsgYXRtbyArIFwiLWF0bW9cIiApLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoIFwiZ3JlZW4taXRlbVwiICk7XG4gICAgICAkKCBcIiNtYWluXCIgKS52ZWdhcyhcImp1bXBcIiwgaW5kZXgpO1xuICAgICAgLy8gJCggXCIucHVzaGVyXCIgKS5hdHRyKCBcInN0eWxlXCIsIFwiYmFja2dyb3VuZDp1cmwoJ2ltYWdlcy9iYWNrZ3JvdW5kL1wiICsgYXRtbyArIFwiLmpwZycpIG5vLXJlcGVhdCBjZW50ZXIgY2VudGVyIGZpeGVkICFpbXBvcnRhbnRcIiApO1xuICAgICAgaWYgKEdVSS5zb3VuZEFsbG93ZWQgJiYgYXRtbyAhPSBcIm5ldXRyYWxcIikge1xuICAgICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oIFwiLi9zb3VuZHMvXCIgKyBhdG1vICsgXCIub2dnXCIpO1xuICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBbWJpYW5jZSBuZXV0cmVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbmV1dHJhbFxuICAgICAqL1xuICAgIG5ldXRyYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDAsIFwibmV1dHJhbFwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIFJvY2tcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgcm9ja1xuICAgICAqL1xuICAgIHJvY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDEsIFwicm9ja1wiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIEVsZWN0cm9cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZWxlY3Ryb1xuICAgICAqL1xuICAgIGVsZWN0cm86IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDIsIFwiZWxlY3Ryb1wiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIEhpcC1Ib3BcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaGlwaG9wXG4gICAgICovXG4gICAgaGlwaG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5hdG1vc3BoZXJlcy5hcHBseSgzLCBcImhpcGhvcFwiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIEZvbGtcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZm9sa1xuICAgICAqL1xuICAgIGZvbGs6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDQsIFwiZm9sa1wiKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFtYmlhbmNlIENsYXNzaXF1ZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBjbGFzc2ljYWxcbiAgICAgKi9cbiAgICBjbGFzc2ljYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLmF0bW9zcGhlcmVzLmFwcGx5KDUsIFwiY2xhc3NpY2FsXCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgSmF6elxuICAgICAqXG4gICAgICogQG1ldGhvZCBqYXp6XG4gICAgICovXG4gICAgamF6ejogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoNiwgXCJqYXp6XCIpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQW1iaWFuY2UgTWV0YWxcbiAgICAgKlxuICAgICAqIEBtZXRob2QgbWV0YWxcbiAgICAgKi9cbiAgICBtZXRhbDogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuYXRtb3NwaGVyZXMuYXBwbHkoNywgXCJtZXRhbFwiKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgaW50ZXJuZSBnw6lyYW50IGxlcyDDqWzDqW1lbnRzIHJlbGF0aWZzIGF1IGNvbXB0ZSB1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAY2xhc3MgR1VJLmFjY291bnRcbiAgICovXG4gIGFjY291bnQ6IHtcbiAgICAvKipcbiAgICAgKiBWw6lyaWZpY2F0aW9uIHZpc2FudCDDoCBjb25uYcOudHJlIGxlIHN0YXR1dCBkZSBjb25uZXhpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc3RhdHVzXG4gICAgICovXG4gICAgc3RhdHVzOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLmdldExvZ2luU3RhdHVzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBcdGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcbiAgICAgICAgICBHVUkuYWNjb3VudC5pbmZvKCk7XG4gICAgICBcdH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2VzdGlvbiBkZSBsYSBjb25uZXhpb24gZCd1biB1dGlsaXNhdGV1clxuICAgICAqXG4gICAgICogQG1ldGhvZCBsb2dpblxuICAgICAqL1xuICAgIGxvZ2luOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChHVUkudXNlciA9PT0gbnVsbCkge1xuICAgICAgICBEWi5sb2dpbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5hdXRoUmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzID09IFwiY29ubmVjdGVkXCIpIHsgLy8gU2kgdG91dCBzZSBwYXNzZSBiaWVuXG4gICAgICAgICAgICBHVUkuYWNjb3VudC5pbmZvKCk7XG4gICAgICAgICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiQ29ubmV4aW9uIE9LICFcIiwgMyk7XG4gICAgICAgICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiN1c2VyXCIsIFwibWFyb29uXCIgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHsgcGVybXM6IFwiYmFzaWNfYWNjZXNzLG1hbmFnZV9saWJyYXJ5LGRlbGV0ZV9saWJyYXJ5XCIgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGRlIGxhIGTDqWNvbm5leGlvbiBkJ3VuIHV0aWxpc2F0ZXVyXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGxvZ291dFxuICAgICAqL1xuICAgIGxvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5sb2dvdXQoKTtcbiAgICAgIEdVSS51c2VyID0gbnVsbDtcbiAgICAgICQoIFwiI3VzZXItY29ubmVjdGVkXCIgKS5oaWRlKCk7XG4gICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLnNob3coKTtcbiAgICAgIEdVSS5hbGVydChcInN1Y2Nlc3NcIiwgXCJEw6ljb25uZXhpb24gT0sgIVwiLCAzKTtcbiAgICAgICQoIFwiI3VzZXJcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZCd1biB1dGlsaXNhdGV1clxuICAgICAqXG4gICAgICogQG1ldGhvZCBpbmZvXG4gICAgICovXG4gICAgaW5mbzogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5hcGkoXCIvdXNlci9tZVwiLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB2YXIgdXNlciA9IG5ldyBVc2VyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuaW5zY3JpcHRpb25fZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmxpbmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5waWN0dXJlX3NtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgR1VJLnVzZXIgPSB1c2VyO1xuICAgICAgICAkKCBcIiN1c2VyLWltZ1wiICkuYXR0cih7IHNyYzp1c2VyLmdldFBpY3R1cmUoKSwgYWx0OnVzZXIuZ2V0TmFtZSgpIH0pO1xuICAgICAgICAkKCBcIiN1c2VyLW5hbWVcIiApLnRleHQoIHVzZXIuZ2V0TmFtZSgpICkuYXR0ciggXCJocmVmXCIsIHVzZXIuZ2V0TGluaygpICk7XG4gICAgICAgICQoIFwiI3VzZXItZGF0ZVwiICkudGV4dCggXCJJbnNjcml0IGxlIFwiICsgdXNlci5nZXRJbnNjcmlwdGlvbkRhdGUoKSApO1xuICAgICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLmhpZGUoKTtcbiAgICAgICAgJCggXCIjdXNlci1jb25uZWN0ZWRcIiApLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBpbnRlcm5lIGfDqXJhbnQgZGl2ZXJzIMOpdsOpbmVtZW50c1xuICAgKlxuICAgKiBAY2xhc3MgR1VJLm1pc2NcbiAgICovXG4gIG1pc2M6IHtcbiAgICAvKipcbiAgICAgKiBHZXN0aW9uIGR1IGNsaWMgc3VyIGxlIGxvZ29cbiAgICAgKlxuICAgICAqIEBtZXRob2QgbG9nb1xuICAgICAqL1xuICAgIGxvZ286IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1pc2Muc2hvd01vZGFsKCAkKCBcIiNhYm91dFwiICkgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdlc3Rpb24gZHUgY2xpYyBzdXIgbGEgY2FzZSBkJ2FpZGVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgaGVscFxuICAgICAqL1xuICAgIGhlbHA6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1pc2Muc2hvd01vZGFsKCAkKCBcIiNoZWxwXCIgKSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQWZmaWNoYWdlIGQndW5lIGJvw650ZSBtb2RhbGVcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc2hvd01vZGFsXG4gICAgICovXG4gICAgc2hvd01vZGFsOiBmdW5jdGlvbigkc2VsZWN0b3IpIHtcbiAgICAgICRzZWxlY3Rvci5tb2RhbCggXCJzaG93XCIgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEFmZmljaGFnZSBvdSBub24gZHUgY2Fyb3VzZWwgZGUgcsOpc3VsdGF0c1xuICAgICAqXG4gICAgICogQG1ldGhvZCB0b2dnbGVDYXJvdXNlbFxuICAgICAqL1xuICAgIHRvZ2dsZUNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdHJhY2tzID0gJCggXCIjdHJhY2tzXCIgKSxcbiAgICAgICAgICAkdG9nZ2xlID0gJCggXCIjdG9nZ2xlLWNhcm91c2VsIGlcIiApO1xuXG4gICAgICBpZiAoISR0cmFja3MuaXMoIFwiOmVtcHR5XCIgKSAmJiAkdHJhY2tzLmlzKCBcIjp2aXNpYmxlXCIgKSkge1xuICAgICAgICAkdHJhY2tzLnNsaWRlVXAoKTtcbiAgICAgICAgJHRvZ2dsZVxuICAgICAgICAgIC5zd2l0Y2hDbGFzcyggXCJ1cFwiLCBcImRvd25cIiApXG4gICAgICAgICAgLmNzcyggXCJib3JkZXItY29sb3JcIiwgXCIjRjA0QTNDXCIgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghJHRyYWNrcy5pcyggXCI6ZW1wdHlcIiApKSB7XG4gICAgICAgICAgaWYgKEdVSS5zZWFyY2hBbGxvd2VkKSB7XG4gICAgICAgICAgICAkdHJhY2tzLnNsaWRlRG93bigpO1xuICAgICAgICAgICAgJHRvZ2dsZVxuICAgICAgICAgICAgICAuc3dpdGNoQ2xhc3MoIFwiZG93blwiLCBcInVwXCIpXG4gICAgICAgICAgICAgIC5jc3MoIFwiYm9yZGVyLWNvbG9yXCIsIFwiIzE4OEFFM1wiICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEdVSS5zZWFyY2gud2FybmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBHVUkuYWxlcnQoXCJlcnJvclwiLCBcIkF1Y3VuZSByZWNoZXJjaGUgZWZmZWN0dcOpZSAhXCIsIDUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvR1VJLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogQ2xhc3NlIG1ldHRhbnQgZW4gxZN1dnJlIGxlIHBhdHRlcm4gSXRlcmF0b3IuXG4gKiBDZXR0ZSBjbGFzc2UgZm91cm5pdCB1biBtb3llbiBkJ2l0w6lyZXIgcGx1cyBzaW1wbGVtZW50IHN1ciBsZXMgY29sbGVjdGlvbnMuXG4gKlxuICogQG1vZHVsZSBJdGVyYXRvclxuICogQGNsYXNzIEl0ZXJhdG9yXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zIENvbGxlY3Rpb24gZCdvYmpldHMgw6AgcGFyY291cmlyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gSXRlcmF0b3IgPSBmdW5jdGlvbihpdGVtcykge1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJdGVyYXRvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgSXRlcmF0b3IgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gIH1cblxuICAvKipcbiAgICogSW5kZXggZGUgYmFzZSDDoCBwYXJ0aXIgZHVxdWVsIGNvbW1lbmNlIHVuZSBpdMOpcmF0aW9uLlxuICAgKlxuICAgKiBAcHJvcGVydHkgaW5kZXhcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgdGhpcy5faW5kZXggPSAwO1xuICAvKipcbiAgICogQ29sbGVjdGlvbiBkJ29iamV0cyDDoCBwYXJjb3VyaXIuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBpdGVtc1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICB0aGlzLl9pdGVtcyA9IGl0ZW1zO1xuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsJ0l0ZXJhdG9yXG4gKi9cbkl0ZXJhdG9yLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIE3DqXRob2RlIHbDqXJpZmlhbnQgcydpbCB5IGEgdW4gw6lsw6ltZW50IHN1aXZhbnQgZGFucyBsYSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGhhc05leHRcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVnJhaSBzJ2lsIHkgYSB1biDDqWzDqW1lbnQgc3VpdmFudFxuICAgKi9cbiAgaGFzTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4IDwgdGhpcy5faXRlbXMubGVuZ3RoO1xuICB9LFxuICAvKipcbiAgICogTcOpdGhvZGUgcmVudm95YW50IGwnw6lsw6ltZW50IGNvdXJhbnQgbG9ycyBkZSBsJ2l0w6lyYXRpb24uXG4gICAqIEwnaW5kZXggZXN0IHBhciBhaWxsZXVycyBpbmNyw6ltZW50w6kgcG91ciBjb250aW51ZXIgbGUgcGFyY291cnMuXG4gICAqXG4gICAqIEBtZXRob2QgbmV4dFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEwnb2JqZXQgY291cmFudCBkZSBsYSBjb2xsZWN0aW9uXG4gICAqL1xuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXNbdGhpcy5faW5kZXgrK107XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9JdGVyYXRvci5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCBkZXMgZW50aXTDqXMgcmVsYXRpdmVzIMOgIGxhIG11c2lxdWUuXG4gKlxuICogQG1vZHVsZSBNdXNpY1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IE11c2ljID0ge1xuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1biBtb3JjZWF1IGRlIG11c2lxdWUuXG4gICAqXG4gICAqIEBjbGFzcyBUcmFja1xuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIElkZW50aWZpYW50IERlZXplclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGl0cmVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFydGlzdCBBcnRpc3RlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhbGJ1bSBOb20gZGUgbCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0ZSBEYXRlIGRlIHNvcnRpZSBkZSBsJ2FsYnVtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb3ZlciBQb2NoZXR0ZSBkJ2FsYnVtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVG9uYWxpdMOpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtb2RlIE1vZGUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0ZW1wbyBUZW1wbyAoZW4gQlBNKVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2FtZWxvdFRhZyBUYWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqIEBwYXJhbSB7QXJyYXl9IGhhcm1vbmllcyBUYWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIFRyYWNrOiBmdW5jdGlvbihpZCwgdGl0bGUsIGFydGlzdCwgYWxidW0sIGRhdGUsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBoYXJtb25pZXMpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5UcmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciAhIExhIGNsYXNzZSBUcmFjayBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWFudCBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIC8qKlxuICAgICAqIFRpdHJlIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGl0bGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICAgIC8qKlxuICAgICAqIEFydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfYXJ0aXN0XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fYXJ0aXN0ID0gYXJ0aXN0O1xuICAgIC8qKlxuICAgICAqIE5vbSBkZSBsJ2FsYnVtXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2FsYnVtXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fYWxidW0gPSBhbGJ1bTtcbiAgICAvKipcbiAgICAgKiBEYXRlIGRlIHNvcnRpZSBkZSBsJ2FsYnVtXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2RhdGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9kYXRlID0gZGF0ZTtcbiAgICAvKipcbiAgICAgKiBQb2NoZXR0ZSBkJ2FsYnVtXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2NvdmVyXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fY292ZXIgPSBjb3ZlcjtcbiAgICAvKipcbiAgICAgKiBUb25hbGl0w6kgZHUgbW9yY2VhdVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9rZXlcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9rZXkgPSBrZXk7XG4gICAgLyoqXG4gICAgICogTW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9tb2RlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fbW9kZSA9IG1vZGU7XG4gICAgLyoqXG4gICAgICogVGVtcG8gZHUgbW9yY2VhdSAoZW4gQlBNKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90ZW1wb1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHRoaXMuX3RlbXBvID0gdGVtcG87XG4gICAgLyoqXG4gICAgICogVGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9jYW1lbG90VGFnXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fY2FtZWxvdFRhZyA9IGNhbWVsb3RUYWc7XG4gICAgLyoqXG4gICAgICogVGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2hhcm1vbmllc1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAqL1xuICAgIHRoaXMuX2hhcm1vbmllcyA9IGhhcm1vbmllcztcblxuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGTDqWZpbmlzc2FudCB1bmUgaGFybW9uaWUgbXVzaWNhbGUuXG4gICAqXG4gICAqIEBjbGFzcyBIYXJtb255XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3RoZXJUcmFjayBBdXRyZSBtb3JjZWF1LCBwb3VyIGxhIGNvbXBhcmFpc29uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0ZW1wb1ZhcmlhdGlvbiBWYXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gIEhhcm1vbnk6IGZ1bmN0aW9uKHJlZlRyYWNrLCBvdGhlclRyYWNrLCB0ZW1wb1ZhcmlhdGlvbikge1xuXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE11c2ljLkhhcm1vbnkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgSGFybW9ueSBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3JlZlRyYWNrXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX3JlZlRyYWNrID0gcmVmVHJhY2ssXG4gICAgLyoqXG4gICAgICogQXV0cmUgbW9yY2VhdSwgcG91ciBsYSBjb21wYXJhaXNvblxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF9vdGhlclRyYWNrXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX290aGVyVHJhY2sgPSBvdGhlclRyYWNrLFxuICAgIC8qKlxuICAgICAqIFZhcmlhdGlvbiBkdSB0ZW1wbyBwYXIgcmFwcG9ydCDDoCB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvVmFyaWF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbixcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBjYWxjdWxhbnQgbGUgdGVtcG8gbWluaW1hbCBhdSByZWdhcmQgZGUgbGEgdmFyaWF0aW9uIGF1dG9yaXPDqWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdGVtcG9NaW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIG1pbmltYWxcbiAgICAgKi9cbiAgICB0aGlzLnRlbXBvTWluID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuX3JlZlRyYWNrLmdldFRlbXBvKCkgLSAodGhpcy5fcmVmVHJhY2suZ2V0VGVtcG8oKSAqIHRoaXMuX3RlbXBvVmFyaWF0aW9uKSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBjYWxjdWxhbnQgbGUgdGVtcG8gbWF4aW1hbCBhdSByZWdhcmQgZGUgbGEgdmFyaWF0aW9uIGF1dG9yaXPDqWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgdGVtcG9NYXhcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIG1heGltYWxcbiAgICAgKi9cbiAgICB0aGlzLnRlbXBvTWF4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuX3JlZlRyYWNrLmdldFRlbXBvKCkgKyAodGhpcy5fcmVmVHJhY2suZ2V0VGVtcG8oKSAqIHRoaXMuX3RlbXBvVmFyaWF0aW9uKSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkw6l0ZXJtaW5hbnQgbGEgY29tcGF0aWJpbGl0w6kgZW4gdGVtcG8gZW50cmUgbGVzIGRldXggbW9yY2VhdXggY29tcGFyw6lzXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvQ29tcGF0aWJpbGl0eVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgZW4gY2FzIGRlIGNvbXBhdGliaWxpdMOpLCBmYXV4IHNpbm9uXG4gICAgICovXG4gICAgdGhpcy50ZW1wb0NvbXBhdGliaWxpdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9vdGhlclRyYWNrLmdldFRlbXBvKCkgPj0gdGhpcy50ZW1wb01pbigpICYmIHRoaXMuX290aGVyVHJhY2suZ2V0VGVtcG8oKSA8PSB0aGlzLnRlbXBvTWF4KCkpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZMOpdGVybWluYW50IGxhIGNvbXBhdGliaWxpdMOpIGVuIHRvbmFsaXTDqSBlbnRyZSBsZXMgZGV1eCBtb3JjZWF1eCBjb21wYXLDqXNcbiAgICAgKlxuICAgICAqIEBtZXRob2Qga2V5Q29tcGF0aWJpbGl0eVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgZW4gY2FzIGRlIGNvbXBhdGliaWxpdMOpLCBmYXV4IHNpbm9uXG4gICAgICovXG4gICAgdGhpcy5rZXlDb21wYXRpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAoJC5pbkFycmF5KHRoaXMuX290aGVyVHJhY2suZ2V0Q2FtZWxvdFRhZygpLCB0aGlzLl9yZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpO1xuICAgIH07XG5cbiAgfVxuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBUcmFja1xuICovXG5NdXNpYy5UcmFjay5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2lkZW50aWZpYW50IGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJZFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEwnaWQgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRpdGxlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldFRpdGxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RpdGxlOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGl0bGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIHNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyB0aGlzLl90aXRsZSA9IHRpdGxlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QXJ0aXN0XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0QXJ0aXN0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FydGlzdDsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0QXJ0aXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWwgYXJ0aXN0ZSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRBcnRpc3Q6IGZ1bmN0aW9uKGFydGlzdCkgeyB0aGlzLl9hcnRpc3QgPSBhcnRpc3Q7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSBub20gZGUgbCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsYnVtXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgbm9tIGRlIGwnYWxidW1cbiAgICovXG4gIGdldEFsYnVtOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FsYnVtOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSBub20gZGUgbCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldEFsYnVtXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWF1IG5vbSBkZSBsJ2FsYnVtXG4gICAqL1xuICBzZXRBbGJ1bTogZnVuY3Rpb24oYWxidW0pIHsgdGhpcy5fYWxidW0gPSBhbGJ1bTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIGRhdGUgZGUgc29ydGllIGRlIGwnYWxidW1cbiAgICpcbiAgICogQG1ldGhvZCBnZXREYXRlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgZGF0ZSBkZSBzb3J0aWUgZGUgbCdhbGJ1bVxuICAgKi9cbiAgZ2V0RGF0ZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9kYXRlOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsYSBkYXRlIGRlIHNvcnRpZSBkZSBsJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0RGF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGEgbm91dmVsbGUgZGF0ZSBkZSBzb3J0aWUgZGUgbCdhbGJ1bVxuICAgKi9cbiAgc2V0RGF0ZTogZnVuY3Rpb24oZGF0ZSkgeyB0aGlzLl9kYXRlID0gZGF0ZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHBvY2hldHRlIGQnYWxidW1cbiAgICpcbiAgICogQG1ldGhvZCBnZXRDb3ZlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExhIHBvY2hldHRlIGQnYWxidW1cbiAgICovXG4gIGdldENvdmVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NvdmVyOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0Q292ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IExhIG5vdXZlbGxlIHBvY2hldHRlIGQnYWxidW1cbiAgICovXG4gIHNldENvdmVyOiBmdW5jdGlvbihjb3ZlcikgeyB0aGlzLl9jb3ZlciA9IGNvdmVyOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRLZXlcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgZ2V0S2V5OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2tleTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRLZXlcbiAgICogQHBhcmFtIHtTdHJpbmd9IExhIG5vdXZlbGxlIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRLZXk6IGZ1bmN0aW9uKGtleSkgeyB0aGlzLl9rZXkgPSBrZXk7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0TW9kZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIG1vZGUgZHUgbW9yY2VhdSAobWFqZXVyIG91IG1pbmV1cilcbiAgICovXG4gIGdldE1vZGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbW9kZTsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgbW9kZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0TW9kZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gTGUgbm91dmVhdSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBzZXRNb2RlOiBmdW5jdGlvbihtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGVtcG8gZHUgbW9yY2VhdSAoZW4gQlBNKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRlbXBvXG4gICAqIEByZXR1cm4ge051bWJlcn0gTGUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgZ2V0VGVtcG86IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG87IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBzZXRUZW1wb1xuICAgKiBAcGFyYW0ge051bWJlcn0gTGUgbm91dmVhdSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRUZW1wbzogZnVuY3Rpb24odGVtcG8pIHsgdGhpcy5fdGVtcG8gPSB0ZW1wbzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRDYW1lbG90VGFnXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgZ2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jYW1lbG90VGFnOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0Q2FtZWxvdFRhZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gTGUgbm91dmVhdSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBzZXRDYW1lbG90VGFnOiBmdW5jdGlvbihjYW1lbG90VGFnKSB7IHRoaXMuX2NhbWVsb3RUYWcgPSBjYW1lbG90VGFnOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIGdldEhhcm1vbmllc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gTGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgZ2V0SGFybW9uaWVzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2hhcm1vbmllczsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGVzIHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldEhhcm1vbmllc1xuICAgKiBAcGFyYW0ge0FycmF5fSBMZXMgbm91dmVhdXggdGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBzZXRIYXJtb25pZXM6IGZ1bmN0aW9uKGhhcm1vbmllcykgeyB0aGlzLl9oYXJtb25pZXMgPSBoYXJtb25pZXM7IH0sXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBIYXJtb255XG4gKi9cbk11c2ljLkhhcm1vbnkucHJvdG90eXBlID0ge1xuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFJlZlRyYWNrXG4gICAqIEByZXR1cm4ge09iamVjdH0gTGUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgZ2V0UmVmVHJhY2s6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fcmVmVHJhY2s7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBzZXRSZWZUcmFja1xuICAgKiBAcGFyYW0ge09iamVjdH0gTGUgbm91dmVhdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqL1xuICBzZXRSZWZUcmFjazogZnVuY3Rpb24ocmVmVHJhY2spIHsgdGhpcy5fcmVmVHJhY2sgPSByZWZUcmFjazsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGwnYXV0cmUgbW9yY2VhdSwgdXRpbGlzw6kgw6AgdGl0cmUgZGUgY29tcGFyYWlzb25cbiAgICpcbiAgICogQG1ldGhvZCBnZXRPdGhlclRyYWNrXG4gICAqIEByZXR1cm4ge09iamVjdH0gTGUgbW9yY2VhdSDDoCBjb21wYXJlciBhdmVjIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIGdldE90aGVyVHJhY2s6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fb3RoZXJUcmFjazsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhdXRyZSBtb3JjZWF1LCB1dGlsaXPDqSDDoCB0aXRyZSBkZSBjb21wYXJhaXNvblxuICAgKlxuICAgKiBAbWV0aG9kIHNldE90aGVyVHJhY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IExlIG5vdXZlYXUgbW9yY2VhdSDDoCBjb21wYXJlciBhdmVjIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIHNldE90aGVyVHJhY2s6IGZ1bmN0aW9uKG90aGVyVHJhY2spIHsgdGhpcy5fb3RoZXJUcmFjayA9IG90aGVyVHJhY2s7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1ZhcmlhdGlvblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKi9cbiAgZ2V0VGVtcG9WYXJpYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG9WYXJpYXRpb247IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKlxuICAgKiBAbWV0aG9kIHNldFRlbXBvVmFyaWF0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBMYSBub3V2ZWxsZSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gICBzZXRUZW1wb1ZhcmlhdGlvbjogZnVuY3Rpb24odGVtcG9WYXJpYXRpb24pIHsgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbjsgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL011c2ljLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGVuY2Fwc3VsYW50IGxlIGxlY3RldXIgYXVkaW8gZm91cm5pIHBhciBEZWV6ZXIgKERaLnBsYXllcikuXG4gKiBMYSBjbGFzc2UgcXUnaWwgY29udGllbnQgZXN0IMOgIGxhIGZvaXMgdW4gU2luZ2xldG9uIGV0IHVuIEFkYXB0ZXIuXG4gKlxuICogQG1vZHVsZSBQbGF5ZXJcbiAqIEBjbGFzcyBQbGF5ZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgLyoqXG4gICAqIEF0dHJpYnV0IChwcml2w6kpIHJlcHLDqXNlbnRhbnQgdW5lIGluc3RhbmNlIGRlIGxhIGNsYXNzZSBlbGxlLW3Dqm1lIChjZi4gU2luZ2xldG9uKVxuICAgKlxuICAgKiBAcHJvcGVydHkgcGxheWVyXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgKi9cbiAgdmFyIHBsYXllcixcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RldXIgKHByaXbDqSkgY2hhcmfDqSBkJ2luaXRpYWxpc2VyIGxlIHBsYXllciAoY2YuIFNpbmdsZXRvbilcbiAgICAgKlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgICBjb25zdHJ1Y3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF0dHJpYnV0IGluZGlxdWFudCBzaSBsZXMgbW9yY2VhdXggc29udCBjaGFyZ8OpcyBkYW5zIGxlIGxlY3RldXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHRyYWNrc0xvYWRlZFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHJhY2tzTG9hZGVkID0gZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRyaWJ1dCBpbmRpcXVhbnQgbGEgcG9zaXRpb24gZGUgbGEgdMOqdGUgZGUgbGVjdHVyZSBkYW5zIGxlIG1vcmNlYXUgZW4gY291cnNcbiAgICAgICAgICogTGEgdmFsZXVyIHNlIHNpdHVlIGVudHJlIDAgZXQgMTAwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkgdHJhY2tQb3NpdGlvblxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRyYWNrUG9zaXRpb24gPSAwLFxuICAgICAgICAvKipcbiAgICAgICAgICogTcOpdGhvZGUgZWZmZWN0dWFudCByw6llbGxlbWVudCBsJ2luaXRpYWxpc2F0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgRFouaW5pdCh7XG4gICAgICAgICAgICAgIGFwcElkOiAnMTY5NzExJyxcbiAgICAgICAgICAgICAgY2hhbm5lbFVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcHAnLFxuICAgICAgICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICdwbGF5ZXInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogJ3NxdWFyZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogTGVjdHVyZSBlbiBjb3VycyA/XG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgaXNQbGF5aW5nXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgc2kgbGEgbGVjdHVyZSBlc3QgZW4gY291cnMsIGZhdXggc2lub25cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIERaLnBsYXllci5pc1BsYXlpbmcoKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFqb3V0ZXIgZGVzIG1vcmNlYXV4IMOgIGxhIGZpbGUgZCdhdHRlbnRlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgYWRkVG9RdWV1ZVxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBpZHMgVGFibGVhdSBjb250ZW5hbnQgbGVzIGlkZW50aWZpYW50cyBkZXMgbW9yY2VhdXhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkVG9RdWV1ZSA9IGZ1bmN0aW9uKGlkcykge1xuICAgICAgICAgIERaLnBsYXllci5hZGRUb1F1ZXVlKGlkcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFyZ2VtZW50IGV0IGxlY3R1cmUgZGVzIG1vcmNlYXV4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZXRob2QgcGxheVRyYWNrc1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBpZHMgVGFibGVhdSBjb250ZW5hbnQgbGVzIGlkZW50aWZpYW50cyBkZXMgbW9yY2VhdXhcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEluZGljZSBkdSBwcmVtaWVyIG1vcmNlYXVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGxheVRyYWNrcyA9IGZ1bmN0aW9uKGlkcywgaW5kZXgpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucGxheVRyYWNrcyhpZHMsIGluZGV4KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExlY3R1cmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwbGF5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIucGxheSgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogUGF1c2VcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBwYXVzZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5wYXVzZSgpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU3VpdmFudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHN1aXZhbnRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcsOpY8OpZGVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHByZXZcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERaLnBsYXllci5wcmV2KCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbGxlciDDoC4uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHNlZWtcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvcyBQb3NpdGlvbiBkZSBsYSB0w6p0ZSBkZSBsZWN0dXJlIChlbnRyZSAwIGV0IDEwMClcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2VlayA9IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAgIERaLnBsYXllci5zZWVrKHBvcyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3RpdmVyL0TDqXNhY3RpdmVyIGxlIHNvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIG11dGVcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc011dGUgVnJhaSBvdSBmYXV4XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm11dGUgPSBmdW5jdGlvbihpc011dGUpIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2V0TXV0ZShpc011dGUpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZlci9Ew6lzYWN0aXZlciBsYSBsZWN0dXJlIGFsw6lhdG9pcmVcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc1JhbmRvbSBWcmFpIG91IGZhdXhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmFuZG9tID0gZnVuY3Rpb24oaXNSYW5kb20pIHtcbiAgICAgICAgICBEWi5wbGF5ZXIuc2V0U2h1ZmZsZShpc1JhbmRvbSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBY3RpdmVyL0TDqXNhY3RpdmVyIGxhIGxlY3R1cmUgcsOpcMOpdMOpZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWV0aG9kIHJlcGVhdFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gY29kZSAwIChubyByZXBlYXQpLCAxIChyZXBlYXQgYWxsKSwgb3UgMiAocmVwZWF0IG9uZSlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmVwZWF0ID0gZnVuY3Rpb24oY29kZSkge1xuICAgICAgICAgIERaLnBsYXllci5zZXRSZXBlYXQoY29kZSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gIHJldHVybiBuZXcgZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZMOpbGl2cmFudCBsJ3VuaXF1ZSBpbnN0YW5jZSBkZSBsYSBjbGFzc2UgKGNmLiBTaW5nbGV0b24pXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFBsYXllclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVW5lIGluc3RhbmNlIGRlIHBsYXllclxuICAgICAqL1xuICAgIHRoaXMuZ2V0UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocGxheWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGxheWVyID0gbmV3IGNvbnN0cnVjdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9O1xuICB9O1xuXG59KSgpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvUGxheWVyLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGVuY2Fwc3VsYW50IGxlIGxlY3RldXIgYXVkaW8gZm91cm5pIHBhciBEZWV6ZXJcbiAqIExlIG1vZHVsZSBzJ2FwcHVpZSBzdXIgbGUgbW9kw6hsZSBNVlZNIGRlIFZ1ZS5qcy5cbiAqXG4gKiBAbW9kdWxlIFBsYXlsaXN0XG4gKiBAY2xhc3MgUGxheWxpc3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBQbGF5bGlzdCA9IG5ldyBWdWUoe1xuICBlbDogXCIjYXBwXCIsXG4gIGRhdGE6IHtcbiAgICAvKipcbiAgICAgKiBBdHRyaWJ1dCByZXByw6lzZW50YW50IGwnaWQgZGUgbGEgcGxheWxpc3Qgc3VyIERlZXplclxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGRlZXplcklkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAqL1xuICAgIGRlZXplcklkOiAtMSxcbiAgICAvKipcbiAgICAgKiBBdHRyaWJ1dCByZXByw6lzZW50YW50IGxhIGxpc3RlIGRlcyBtb3JjZWF1eCBzb3VzIGZvcm1lIGQnaWRlbnRpZmlhbnRzIERlZXplclxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHRyYWNrc0lkc1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAqL1xuICAgIHRyYWNrc0lkczogW10sXG4gICAgLyoqXG4gICAgICogQXR0cmlidXQgcmVwcsOpc2VudGFudCBsYSBsaXN0ZSBkZXMgbW9yY2VhdXggc291cyBmb3JtZSBkJ29iamV0cyBUcmFja1xuICAgICAqXG4gICAgICogQHByb3BlcnR5IHNlbGVjdGVkVHJhY2tzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICovXG4gICAgc2VsZWN0ZWRUcmFja3M6IFtdXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICAvKipcbiAgICAgKiBBam91dCBkJ3VuIG1vcmNlYXUgw6AgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkVHJhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJhY2sgT2JqZXQgVHJhY2tcbiAgICAgKi9cbiAgICBhZGRUcmFjazogZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIHRoaXMudHJhY2tzSWRzLnB1c2godHJhY2suX2lkKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3MucHVzaCh0cmFjayk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBTdXBwcmVzc2lvbiBkJ3VuIG1vcmNlYXUgZGUgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlVHJhY2tcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaSBJbmRleCBkdSBtb3JjZWF1IGRhbnMgbGEgcGxheWxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVUcmFjazogZnVuY3Rpb24oaSkge1xuICAgICAgdGhpcy50cmFja3NJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5zZWxlY3RlZFRyYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAkKCBcIiNwbGF5bGlzdFwiICkudHJpZ2dlciggXCJ0cmFja1JlbW92ZWRcIiApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUsOpaW5pdGlhbGlzZXIgbGEgcGxheWxpc3RcbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVzZXRcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyYWNrc0lkcyA9IFtdO1xuICAgICAgdGhpcy5zZWxlY3RlZFRyYWNrcyA9IFtdO1xuICAgIH1cbiAgfVxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9QbGF5bGlzdC5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgTXVzaWMgPSByZXF1aXJlKCcuL011c2ljLmpzJyk7XG5cbi8qKlxuICogQ2xhc3NlIG1ldHRhbnQgZW4gxZN1dnJlIGxlIHBhdHRlcm4gU3RyYXRlZ3kuXG4gKiBDZXR0ZSBjbGFzc2UgZm91cm5pdCB1biBtb3llbiBkJ2VuY2Fwc3VsZXIgdW5lIHPDqXJpZSBkJ2FsZ29yaXRobWVzIGRlIHRyaS5cbiAqXG4gKiBAbW9kdWxlIFNvcnRpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBTb3J0aW5nID0ge1xuICAvKipcbiAgICogQXR0cmlidXQgaW5kaXF1YW50IHNpIGxlcyBkb3VibG9ucyBzb250IGF1dG9yaXPDqXMgZGFucyBsZXMgc3VnZ2VzdGlvbnNcbiAgICpcbiAgICogQHByb3BlcnR5IGR1cGxpY2F0ZXNBbGxvd2VkXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZHVwbGljYXRlc0FsbG93ZWQ6IGZhbHNlLFxuICAvKipcbiAgICogQ2xhc3NlIGfDqW7DqXJpcXVlIHJlcHLDqXNlbnRhbnQgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQGNsYXNzIFN0cmF0ZWd5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgU3RyYXRlZ3k6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIEFsZ29yaXRobWUgZGUgdHJpIGNvdXJhbnRcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBhbGdvcml0aG1cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICB0aGlzLl9hbGdvcml0aG0gPSBudWxsO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgcGFyIGTDqWZhdXQuXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBvdSAoWE9SKSBlbiB0b25hbGl0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgRGVmYXVsdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBwYXIgZMOpZmF1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciBuYlBlcmZlY3RNYXRjaGVzID0gMDsgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqVxuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8vIFBvdXIgY2hhcXVlIG1vcmNlYXUsIG9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcyBpbmRpc3BlbnNhYmxlc1xuICAgICAgICB2YXIgaW5mbyA9IFNvcnRpbmcudXRpbHMuZ2V0VHJhY2tJbmZvKGhhcm1vbnksIHNpbWlsYXJUcmFja3NbaV0pO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGluZm8uY3VycmVudFRlbXBvID49IGluZm8udGVtcG9NaW4gJiYgaW5mby5jdXJyZW50VGVtcG8gPD0gaW5mby50ZW1wb01heCAmJiBpbmZvLmlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIDAsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB1bmUgY29uZGl0aW9uICh0ZW1wbyBvdSB0b25hbGl0w6kpIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoKGluZm8uY3VycmVudFRlbXBvID49IGluZm8udGVtcG9NaW4gJiYgaW5mby5jdXJyZW50VGVtcG8gPD0gaW5mby50ZW1wb01heCkgfHwgaW5mby5pc01hdGNoaW5nKSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgU29ydGluZy51dGlscy5yZWFycmFuZ2Uoc2ltaWxhclRyYWNrcywgaSwgbmJQZXJmZWN0TWF0Y2hlcywgc2ltaWxhclRyYWNrc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICByZXR1cm4gU29ydGluZy51dGlscy5kdXBsaWNhdGVGaWx0ZXIoc2ltaWxhclRyYWNrcyk7XG5cbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgdmFsb3Jpc2FudCBsZSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvLCBzdWl2aXMgZGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBUZW1wb0ZpcnN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgVGVtcG9GaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIHZhbG9yaXNhbnQgbGUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBuYlRlbXBvTWF0Y2hlcyA9IDA7IC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wb1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIC8vIFBvdXIgY2hhcXVlIG1vcmNlYXUsIG9uIHLDqWN1cMOocmUgdG91dGVzIGxlcyBpbmZvcyBpbmRpc3BlbnNhYmxlc1xuICAgICAgICB2YXIgaW5mbyA9IFNvcnRpbmcudXRpbHMuZ2V0VHJhY2tJbmZvKGhhcm1vbnksIHNpbWlsYXJUcmFja3NbaV0pO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGluZm8uY3VycmVudFRlbXBvID49IGluZm8udGVtcG9NaW4gJiYgaW5mby5jdXJyZW50VGVtcG8gPD0gaW5mby50ZW1wb01heCAmJiBpbmZvLmlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iUGVyZmVjdE1hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQgZW4gZMOpYnV0IGRlIHRhYmxlYXVcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIDAsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdGVtcG8uLi5cbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLmN1cnJlbnRUZW1wbyA+PSBpbmZvLnRlbXBvTWluICYmIGluZm8uY3VycmVudFRlbXBvIDw9IGluZm8udGVtcG9NYXgpIHtcbiAgICAgICAgICAgIG5iVGVtcG9NYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgU29ydGluZy51dGlscy5yZWFycmFuZ2Uoc2ltaWxhclRyYWNrcywgaSwgbmJQZXJmZWN0TWF0Y2hlcywgc2ltaWxhclRyYWNrc1tpXSk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0b25hbGl0w6kuLi5cbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLmlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wb1xuICAgICAgICAgICAgU29ydGluZy51dGlscy5yZWFycmFuZ2Uoc2ltaWxhclRyYWNrcywgaSwgbmJQZXJmZWN0TWF0Y2hlcyArIG5iVGVtcG9NYXRjaGVzLCBzaW1pbGFyVHJhY2tzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vIFNpIGxlcyBkb3VibG9ucyBuZSBzb250IHBhcyBhdXRvcmlzw6lzLCBvbiBmaWx0cmVcbiAgICAgIHJldHVybiBTb3J0aW5nLnV0aWxzLmR1cGxpY2F0ZUZpbHRlcihzaW1pbGFyVHJhY2tzKTtcblxuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSB2YWxvcmlzYW50IGxhIHRvbmFsaXTDqS5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6kgYXBwYXJhaXNzZW50IGVuIHByaW9yaXTDqS5cbiAgICogQXBwYXJhaXNzZW50IGVuc3VpdGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRvbmFsaXTDqSwgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wby5cbiAgICogQXBwYXJhaXNzZW50IGVuZmluIGxlcyBtb3JjZWF1eCBub24gY29tcGF0aWJsZXMuXG4gICAqXG4gICAqIEBjbGFzcyBLZXlGaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIEtleUZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBkZSB0cmkgdmFsb3Jpc2FudCBsYSB0b25hbGl0w6lcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICB2YXIgbmJQZXJmZWN0TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0ZW1wbyBldCBlbiB0b25hbGl0w6lcbiAgICAgICAgICBuYktleU1hdGNoZXMgPSAwOyAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdG9uYWxpdMOpXG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgLy8gUG91ciBjaGFxdWUgbW9yY2VhdSwgb24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9zIGluZGlzcGVuc2FibGVzXG4gICAgICAgIHZhciBpbmZvID0gU29ydGluZy51dGlscy5nZXRUcmFja0luZm8oaGFybW9ueSwgc2ltaWxhclRyYWNrc1tpXSk7XG5cbiAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSByZW1wbGl0IHRvdXRlcyBsZXMgY29uZGl0aW9ucyBkdSBtaXggaGFybW9uaXF1ZS4uLlxuICAgICAgICBpZiAoaW5mby5jdXJyZW50VGVtcG8gPj0gaW5mby50ZW1wb01pbiAmJiBpbmZvLmN1cnJlbnRUZW1wbyA8PSBpbmZvLnRlbXBvTWF4ICYmIGluZm8uaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgU29ydGluZy51dGlscy5yZWFycmFuZ2Uoc2ltaWxhclRyYWNrcywgaSwgMCwgc2ltaWxhclRyYWNrc1tpXSk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0b25hbGl0w6kuLi5cbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLmlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iS2V5TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIG5iUGVyZmVjdE1hdGNoZXMsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdGVtcG8uLi5cbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLmN1cnJlbnRUZW1wbyA+PSBpbmZvLnRlbXBvTWluICYmIGluZm8uY3VycmVudFRlbXBvIDw9IGluZm8udGVtcG9NYXgpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6lcbiAgICAgICAgICAgIFNvcnRpbmcudXRpbHMucmVhcnJhbmdlKHNpbWlsYXJUcmFja3MsIGksIG5iUGVyZmVjdE1hdGNoZXMgKyBuYktleU1hdGNoZXMsIHNpbWlsYXJUcmFja3NbaV0pO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gU2kgbGVzIGRvdWJsb25zIG5lIHNvbnQgcGFzIGF1dG9yaXPDqXMsIG9uIGZpbHRyZVxuICAgICAgcmV0dXJuIFNvcnRpbmcudXRpbHMuZHVwbGljYXRlRmlsdGVyKHNpbWlsYXJUcmFja3MpO1xuXG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIGNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXgsIGNvbXBhdGlibGVzIG91IG5vbiwgc29udCByYW5nw6lzIGR1IEJQTSBsZSBwbHVzIGxlbnQgYXUgQlBNIGxlIHBsdXMgcmFwaWRlLlxuICAgKlxuICAgKiBAY2xhc3MgQXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBBc2NlbmRpbmdUZW1wbzogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIGNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICByZXR1cm4gU29ydGluZy51dGlscy5kdXBsaWNhdGVGaWx0ZXIoXy5zb3J0Qnkoc2ltaWxhclRyYWNrcywgJ190ZW1wbycpKTtcbiAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgZMOpY3JvaXNzYW50LCBlbiBmb25jdGlvbiBkdSB0ZW1wby5cbiAgICogSWNpIGxlcyBtb3JjZWF1eCwgY29tcGF0aWJsZXMgb3Ugbm9uLCBzb250IHJhbmfDqXMgZHUgQlBNIGxlIHBsdXMgcmFwaWRlIGF1IEJQTSBsZSBwbHVzIGxlbnQuXG4gICAqXG4gICAqIEBjbGFzcyBEZXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBEZXNjZW5kaW5nVGVtcG86IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBkw6ljcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgc2ltaWxhclRyYWNrcyA9IF8uc29ydEJ5KHNpbWlsYXJUcmFja3MsICdfdGVtcG8nKTtcbiAgICAgIHJldHVybiBTb3J0aW5nLnV0aWxzLmR1cGxpY2F0ZUZpbHRlcihzaW1pbGFyVHJhY2tzLnJldmVyc2UoKSk7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gYWxnb3JpdGhtZSBmaWN0aWYgbidlZmZlY3R1YW50IGF1Y3VuIHRyaS5cbiAgICogQ2V0dGUgY2xhc3NlIG4nZXhpc3RlIHF1ZSBwb3VyIGRlcyByYWlzb25zIHPDqW1hbnRpcXVlcy5cbiAgICpcbiAgICogQGNsYXNzIE5vbmVcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBOb25lOiBmdW5jdGlvbigpIHtcbiAgICAvKipcbiAgICAgKiBNw6l0aG9kZSBuJ2FwcGxpcXVhbnQgYXVjdW4gdHJpXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24oaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgcmV0dXJuIFNvcnRpbmcudXRpbHMuZHVwbGljYXRlRmlsdGVyKHNpbWlsYXJUcmFja3MpO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBNaW5pLWNsYXNzZSByZWdyb3VwYW50IGxlcyBtw6l0aG9kZXMgdXRpbGl0YWlyZXMgcG91ciBsZSB0cmlcbiAgICpcbiAgICogQGNsYXNzIFNvcnRpbmcudXRpbHNcbiAgICovXG4gIHV0aWxzOiB7XG4gICAgLyoqXG4gICAgICogUmV0b3VybmUgcXVlbHF1ZXMgaW5mb3JtYXRpb25zIGltcG9ydGFudGVzIHN1ciB1biBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFRyYWNrSW5mb1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRyYWNrIE1vcmNlYXUgY291cmFudFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gSW5mb3JtYXRpb25zIHN1ciBsZSBtb3JjZWF1XG4gICAgICovXG4gICAgZ2V0VHJhY2tJbmZvOiBmdW5jdGlvbihoYXJtb255LCB0cmFjaykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY3VycmVudFRlbXBvOiB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICB0ZW1wb01pbjogaGFybW9ueS50ZW1wb01pbigpLFxuICAgICAgICB0ZW1wb01heDogaGFybW9ueS50ZW1wb01heCgpLFxuICAgICAgICBpc01hdGNoaW5nOiAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgaGFybW9ueS5nZXRSZWZUcmFjaygpLmdldEhhcm1vbmllcygpKSAhPSAtMSlcbiAgICAgIH07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBGaWx0cmUgbGUgdHJpIGluaXRpYWwgZW4gZm9uY3Rpb24gZHUgc3RhdHV0IGRlcyBkb3VibG9ucyAoYXV0b3Jpc8OpcyBvdSBub24pXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGR1cGxpY2F0ZUZpbHRlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgVGFibGVhdSBkZSBtb3JjZWF1eCDDoCBmaWx0cmVyXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggZmlsdHLDqVxuICAgICAqL1xuICAgIGR1cGxpY2F0ZUZpbHRlcjogZnVuY3Rpb24oc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIHRyYWNrcyA9IFtdLFxuICAgICAgICAgIGFydGlzdHMgPSBbXTtcblxuICAgICAgaWYgKCFTb3J0aW5nLmR1cGxpY2F0ZXNBbGxvd2VkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzaW1pbGFyVHJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cbiAgICAgICAgICB2YXIgdHJhY2sgPSBzaW1pbGFyVHJhY2tzW2ldLFxuICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5nZXRBcnRpc3QoKTtcblxuICAgICAgICAgIC8vIFNpIGwnYXJ0aXN0ZSBuJ2EgcGFzIMOpdMOpIHJlbmNvbnRyw6kgZGFucyBsZXMgc3VnZ2VzdGlvbnMgcHLDqWPDqWRlbnRlcy4uLlxuICAgICAgICAgIGlmICgkLmluQXJyYXkoYXJ0aXN0LCBhcnRpc3RzKSA9PSAtMSkge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKGFydGlzdCk7XG4gICAgICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja3MgPSBzaW1pbGFyVHJhY2tzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYWNrcztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFLDqWFnZW5jZW1lbnQgZGVzIG1vcmNlYXV4IGRhbnMgdW4gdGFibGVhdVxuICAgICAqXG4gICAgICogQG1ldGhvZCByZWFycmFuZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlbW92ZUluZGV4IEluZGV4IGR1IG1vcmNlYXUgw6AgYm91Z2VyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluc2VydEluZGV4IEluZGV4IG/DuSBpbnPDqXJlciBsZSBtb3JjZWF1XG4gICAgICogQHJldHVybiB7T2JqZWN0fSBNb3JjZWF1IGNvdXJhbnRcbiAgICAgKi9cbiAgICByZWFycmFuZ2U6IGZ1bmN0aW9uKHNpbWlsYXJUcmFja3MsIHJlbW92ZUluZGV4LCBpbnNlcnRJbmRleCwgdHJhY2spIHtcbiAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgIHNpbWlsYXJUcmFja3Muc3BsaWNlKGluc2VydEluZGV4LCAwLCB0cmFjayk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgU3RyYXRlZ3lcbiAqL1xuU29ydGluZy5TdHJhdGVneS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2FsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAbWV0aG9kIGdldEFsZ29yaXRobVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqL1xuICBnZXRBbGdvcml0aG06IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QWxnb3JpdGhtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhbGdvcml0aG0gTGUgbm91dmVsIGFsZ29yaXRobWUgY291cmFudCBkZSBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKi9cbiAgc2V0QWxnb3JpdGhtOiBmdW5jdGlvbihhbGdvcml0aG0pIHtcbiAgICB0aGlzLl9hbGdvcml0aG0gPSBhbGdvcml0aG07XG4gIH0sXG4gIC8qKlxuICAgKiBNw6l0aG9kZSBhYnN0cmFpdGUgZGUgdHJpLlxuICAgKiBDZXR0ZSBkZXJuacOocmUgc2UgY29udGVudGUgZGUgZMOpbMOpZ3VlciBsZSB0cmkgw6AgdW5lIG3DqXRob2RlIGNvbmNyw6h0ZS5cbiAgICpcbiAgICogQG1ldGhvZCBzb3J0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqSwgc2Vsb24gbCdhbGdvcml0aG1lIGNvdXJhbnRcbiAgICovXG4gIHNvcnQ6IGZ1bmN0aW9uKGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxnb3JpdGhtLnNvcnQoaGFybW9ueSwgc2ltaWxhclRyYWNrcyk7XG4gIH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vbW9kdWxlcy9Tb3J0aW5nLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogTW9kdWxlIGZvdXJuaXNzYW50IHVuZSBjbGFzc2UgcG91ciBsYSBnZXN0aW9uIHNpbXBsaWZpw6llIGRlcyB1dGlsaXNhdGV1cnNcbiAqXG4gKiBAbW9kdWxlIFVzZXJcbiAqIEBjbGFzcyBVc2VyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBJZGVudGlmaWFudFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgUHNldWRvXG4gKiBAcGFyYW0ge1N0cmluZ30gaW5zY3JpcHRpb25EYXRlIERhdGUgZCdpbnNjcmlwdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmsgTGllbiB2ZXJzIGxlIHByb2ZpbFxuICogQHBhcmFtIHtTdHJpbmd9IHBpY3R1cmUgTGllbiB2ZXJzIGwnYXZhdGFyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gVXNlciA9IGZ1bmN0aW9uKGlkLCBuYW1lLCBpbnNjcmlwdGlvbkRhdGUsIGxpbmssIHBpY3R1cmUpIHtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVXNlcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJldXIgISBMYSBjbGFzc2UgVXNlciBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZGVudGlmaWFudFxuICAgKlxuICAgKiBAcHJvcGVydHkgaWRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgdGhpcy5faWQgPSBpZDtcbiAgLyoqXG4gICAqIFBzZXVkb1xuICAgKlxuICAgKiBAcHJvcGVydHkgbmFtZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcIlwiXG4gICAqL1xuICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgLyoqXG4gICAqIERhdGUgZCdpbnNjcmlwdGlvblxuICAgKlxuICAgKiBAcHJvcGVydHkgaW5zY3JpcHRpb25EYXRlXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiXCJcbiAgICovXG4gIHRoaXMuX2luc2NyaXB0aW9uRGF0ZSA9IGluc2NyaXB0aW9uRGF0ZTtcbiAgLyoqXG4gICAqIExpZW4gdmVycyBsZSBwcm9maWxcbiAgICpcbiAgICogQHByb3BlcnR5IGxpbmtcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJcIlxuICAgKi9cbiAgdGhpcy5fbGluayA9IGxpbms7XG4gIC8qKlxuICAgKiBMaWVuIHZlcnMgbCdhdmF0YXJcbiAgICpcbiAgICogQHByb3BlcnR5IHBpY3R1cmVcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgXCJcIlxuICAgKi9cbiAgdGhpcy5fcGljdHVyZSA9IHBpY3R1cmU7XG5cbn07XG5cbi8qKlxuICogUHJvdG90eXBlIGRlIFVzZXJcbiAqL1xuVXNlci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2lkZW50aWZpYW50IGRlIGwndXRpbGlzYXRldXJcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJZFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEwnaWQgZGUgbCd1dGlsaXNhdGV1clxuICAgKi9cbiAgZ2V0SWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5faWQ7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSBwc2V1ZG8gZGUgbCd1dGlsaXNhdGV1clxuICAgKlxuICAgKiBAbWV0aG9kIGdldE5hbWVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSBwc2V1ZG8gZGUgbCd1dGlsaXNhdGV1clxuICAgKi9cbiAgZ2V0TmFtZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9uYW1lOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGEgZGF0ZSBkJ2luc2NyaXB0aW9uIGRlIGwndXRpbGlzYXRldXJcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJbnNjcmlwdGlvbkRhdGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSBkYXRlIGQnaW5zY3JpcHRpb24gZGUgbCd1dGlsaXNhdGV1clxuICAgKi9cbiAgZ2V0SW5zY3JpcHRpb25EYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRoaXMuX2luc2NyaXB0aW9uRGF0ZSksXG4gICAgICAgIGQgPSBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgbSA9IGRhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgIHkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGQgKyBcIi9cIiArIG0gKyBcIi9cIiArIHk7XG4gIH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSBsaWVuIHZlcnMgbGUgcHJvZmlsIGRlIGwndXRpbGlzYXRldXJcbiAgICpcbiAgICogQG1ldGhvZCBnZXRMaW5rXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgbGllbiB2ZXJzIGxlIHByb2ZpbCBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqL1xuICBnZXRMaW5rOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2xpbms7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2F2YXRhciBkZSBsJ3V0aWxpc2F0ZXVyXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0UGljdHVyZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IEwnYXZhdGFyIGRlIGwndXRpbGlzYXRldXJcbiAgICovXG4gIGdldFBpY3R1cmU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fcGljdHVyZTsgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1VzZXIuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiAgT2JqZXRzIHV0aWxlcyBwb3VyIGxlIHRyYWl0ZW1lbnQgZGVzIHLDqXBvbnNlcyB2ZW5hbnQgZCdFY2hvIE5lc3RcbiAqXG4gKiBAbW9kdWxlIFZvY2FidWxhcnlcbiAqIEBjbGFzcyBWb2NhYnVsYXJ5XG4gKiBAY29uc3RydWN0b3JcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBWb2NhYnVsYXJ5ID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBNb2RlIChtYWpldXIgZXQgbWluZXVyKVxuICpcbiAqIEBwcm9wZXJ0eSBtb2Rlc1xuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkubW9kZXMgPSB7XG4gICAgXCIwXCI6IFwibWluZXVyXCIsXG4gICAgXCIxXCI6IFwibWFqZXVyXCJcbn07XG5cbi8qKlxuICogTm90ZXMsIHNlbG9uIGxhIG5vdGF0aW9uIHN5bGxhYmlxdWVcbiAqXG4gKiBAcHJvcGVydHkgbm90ZXNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmtleXMgPSB7XG4gICAgXCIwXCI6IFwiZG9cIixcbiAgICBcIjFcIjogXCJkbyNcIixcbiAgICBcIjJcIjogXCJyw6lcIixcbiAgICBcIjNcIjogXCJtaWJcIixcbiAgICBcIjRcIjogXCJtaVwiLFxuICAgIFwiNVwiOiBcImZhXCIsXG4gICAgXCI2XCI6IFwiZmEjXCIsXG4gICAgXCI3XCI6IFwic29sXCIsXG4gICAgXCI4XCI6IFwibGFiXCIsXG4gICAgXCI5XCI6IFwibGFcIixcbiAgICBcIjEwXCI6IFwic2liXCIsXG4gICAgXCIxMVwiOiBcInNpXCJcbn07XG5cbi8qKlxuICogTWl4IGhhcm1vbmlxdWUgKG1vZGUgKyBub3RlID0gdW4gdGFnIHN1ciBsYSByb3VlIGRlIENhbWVsb3QpXG4gKlxuICogQHByb3BlcnR5IGhhcm1vbmljTWl4XG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5oYXJtb25pY01peCA9IHtcbiAgICBcIm1pbmV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI1QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJyw6lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI3QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMkFcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNEFcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkFcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjFBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjhBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIzQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMEFcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIm1hamV1clwiOiB7XG4gICAgICAgIFwiZG9cIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI4QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZG8jXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiM0JcIlxuICAgICAgICB9LFxuICAgICAgICBcInLDqVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEwQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWliXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNUJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1pXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTJCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjdCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmYSNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIyQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic29sXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOUJcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjRCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJsYVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjExQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2liXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNkJcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMUJcIlxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUcmFkdWN0aW9uIGRlIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICpcbiAqIEBwcm9wZXJ0eSBjYW1lbG90V2hlZWxcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbCA9IHtcbiAgICBcIjFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQS1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxQVwiLCBcIjEyQVwiLCBcIjJBXCIsIFwiMUJcIl1cbiAgICB9LFxuICAgIFwiMkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJBXCIsIFwiMUFcIiwgXCIzQVwiLCBcIjJCXCJdXG4gICAgfSxcbiAgICBcIjNBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQVwiLCBcIjJBXCIsIFwiNEFcIiwgXCIzQlwiXVxuICAgIH0sXG4gICAgXCI0QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjRBXCIsIFwiM0FcIiwgXCI1QVwiLCBcIjRCXCJdXG4gICAgfSxcbiAgICBcIjVBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNUFcIiwgXCI0QVwiLCBcIjZBXCIsIFwiNUJcIl1cbiAgICB9LFxuICAgIFwiNkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QVwiLCBcIjVBXCIsIFwiN0FcIiwgXCI2QlwiXVxuICAgIH0sXG4gICAgXCI3QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdBXCIsIFwiNkFcIiwgXCI4QVwiLCBcIjdCXCJdXG4gICAgfSxcbiAgICBcIjhBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEFcIiwgXCI3QVwiLCBcIjlBXCIsIFwiOEJcIl1cbiAgICB9LFxuICAgIFwiOUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QVwiLCBcIjhBXCIsIFwiMTBBXCIsIFwiOUJcIl1cbiAgICB9LFxuICAgIFwiMTBBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQiBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBBXCIsIFwiOUFcIiwgXCIxMUFcIiwgXCIxMEJcIl1cbiAgICB9LFxuICAgIFwiMTFBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRyBGbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMUFcIiwgXCIxMEFcIiwgXCIxMkFcIiwgXCIxMUJcIl1cbiAgICB9LFxuICAgIFwiMTJBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMkFcIiwgXCIxMUFcIiwgXCIxQVwiLCBcIjEyQlwiXVxuICAgIH0sXG4gICAgXCIxQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkIgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjFCXCIsIFwiMTJCXCIsIFwiMkJcIiwgXCIxQVwiXVxuICAgIH0sXG4gICAgXCIyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYtU2hhcnAgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjJCXCIsIFwiMUJcIiwgXCIzQlwiLCBcIjJBXCJdXG4gICAgfSxcbiAgICBcIjNCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRC1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIzQlwiLCBcIjJCXCIsIFwiNEJcIiwgXCIzQVwiXVxuICAgIH0sXG4gICAgXCI0QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkEtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNEJcIiwgXCIzQlwiLCBcIjVCXCIsIFwiNEFcIl1cbiAgICB9LFxuICAgIFwiNUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJFLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjVCXCIsIFwiNEJcIiwgXCI2QlwiLCBcIjVBXCJdXG4gICAgfSxcbiAgICBcIjZCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQi1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI2QlwiLCBcIjVCXCIsIFwiN0JcIiwgXCI2QVwiXVxuICAgIH0sXG4gICAgXCI3QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkYgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjdCXCIsIFwiNkJcIiwgXCI4QlwiLCBcIjdBXCJdXG4gICAgfSxcbiAgICBcIjhCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQyBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiOEJcIiwgXCI3QlwiLCBcIjlCXCIsIFwiOEFcIl1cbiAgICB9LFxuICAgIFwiOUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI5QlwiLCBcIjhCXCIsIFwiMTBCXCIsIFwiOUFcIl1cbiAgICB9LFxuICAgIFwiMTBCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTBCXCIsIFwiOUJcIiwgXCIxMUJcIiwgXCIxMEFcIl1cbiAgICB9LFxuICAgIFwiMTFCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQSBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTFCXCIsIFwiMTBCXCIsIFwiMTJCXCIsIFwiMTFBXCJdXG4gICAgfSxcbiAgICBcIjEyQlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEyQlwiLCBcIjExQlwiLCBcIjFCXCIsIFwiMTJBXCJdXG4gICAgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL1ZvY2FidWxhcnkuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gSW1wb3J0IGRlcyBtb2R1bGVzXG52YXIgVm9jYWJ1bGFyeSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvVm9jYWJ1bGFyeS5qcycpLFxuICAgIEl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9JdGVyYXRvci5qcycpLFxuICAgIE11c2ljID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9NdXNpYy5qcycpLFxuICAgIEFqYXggPSByZXF1aXJlKCcuLi9tb2R1bGVzL0FqYXguanMnKSxcbiAgICBHVUkgPSByZXF1aXJlKCcuLi9tb2R1bGVzL0dVSS5qcycpLFxuICAgIFNvcnRpbmcgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1NvcnRpbmcuanMnKSxcbiAgICBQbGF5bGlzdCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvUGxheWxpc3QuanMnKTtcblxuLy8gVmFyaWFibGVzIGRpdmVyc2VzXG52YXIgc2ltaWxhclRyYWNrcyA9IFtdLFxuICAgIHJlZklkLFxuICAgIHJlZlRyYWNrLFxuICAgIGhhcm1vbnksXG4gICAgZmFjdG9yeTtcblxuLy8gU8OpbGVjdGV1cnMgalF1ZXJ5XG52YXIgJHNlYXJjaCxcbiAgICAkb3dsLFxuICAgICRoYXJtb25pY1RyYWNrcztcblxuLy8gU3RyYXTDqWdpZXMgZGUgdHJpIGRlcyBtb3JjZWF1eFxudmFyIHNvcnRpbmdTdHJhdGVneSA9IG5ldyBTb3J0aW5nLlN0cmF0ZWd5KCksXG4gICAgZGVmYXVsdFNvcnRpbmcgPSBuZXcgU29ydGluZy5EZWZhdWx0KCksXG4gICAgdGVtcG9GaXJzdFNvcnRpbmcgPSBuZXcgU29ydGluZy5UZW1wb0ZpcnN0KCksXG4gICAga2V5Rmlyc3RTb3J0aW5nID0gbmV3IFNvcnRpbmcuS2V5Rmlyc3QoKSxcbiAgICBhc2NUZW1wb1NvcnRpbmcgPSBuZXcgU29ydGluZy5Bc2NlbmRpbmdUZW1wbygpLFxuICAgIGRlc2NUZW1wb1NvcnRpbmcgPSBuZXcgU29ydGluZy5EZXNjZW5kaW5nVGVtcG8oKSxcbiAgICBub1NvcnRpbmcgPSBuZXcgU29ydGluZy5Ob25lKCk7XG5cbi8vIFBvaW50IGQnZW50csOpZSBkZSBsJ2FwcGxpY2F0aW9uXG4kKCBkb2N1bWVudCApLnJlYWR5KCBpbml0ICk7XG5cbi8vIEluaXRpYWxpc2F0aW9uIGRlIGwnYXBwbGljYXRpb25cbmZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBHVUkuaW5pdCgpO1xuXG4gICAgJHNlYXJjaCA9ICQoIFwiI3NlYXJjaFwiICk7XG4gICAgJG93bCA9ICQoIFwiI3RyYWNrc1wiICk7XG4gICAgJGhhcm1vbmljVHJhY2tzID0gJCggXCIjaGFybW9uaWMtdHJhY2tzXCIgKTtcblxuICAgIGZhY3RvcnkgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpO1xuXG4gICAgJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgIHRyYWNrQXV0b2NvbXBsZXRlKCk7XG4gICAgICBHVUkuc2VhcmNoLmhpZGVBdXRvY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIGdvKCk7XG5cbn1cblxuLy8gR2VzdGlvbiBkZSBsJ2F1dG9jb21wbMOpdGlvbiBkYW5zIGxlIGNoYW1wIGRlIHJlY2hlcmNoZVxuZnVuY3Rpb24gdHJhY2tBdXRvY29tcGxldGUoKSB7XG5cbiAgLy8gQXV0b2NvbXBsw6l0aW9uIE9LXG4gIGlmIChHVUkuYXV0b2NvbXBsZXRlQWxsb3dlZCkge1xuICAgICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHtcbiAgICAgICAgc291cmNlOiBmdW5jdGlvbiggcmVxdWVzdCwgcmVzcG9uc2UgKSB7XG5cbiAgICAgICAgICB2YXIga2V5d29yZCA9ICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkudmFsKCk7XG5cbiAgICAgICAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgICAgICAgcmVxdWVzdC5hZGRQYXJhbShcInFcIiwga2V5d29yZCk7XG4gICAgICAgICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICAgICAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmVtcHR5KCk7XG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhciB0cmFjayA9IHJlc3BvbnNlLmRhdGFbaV0sXG4gICAgICAgICAgICAgICAgICBjdXN0b21UcmFjayA9IG5ldyBNdXNpYy5UcmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hcnRpc3QubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0udGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLmFsYnVtLnJlbGVhc2VfZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0uY292ZXJfbWVkaXVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBodG1sICs9IEdVSS50ZW1wbGF0ZShcImF1dG9jb21wbGV0ZVwiLCBjdXN0b21UcmFjaywgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgIHNlbGVjdGVkVHJhY2soXCJhdXRvY29tcGxldGUtXCIgKyB0cmFjay5pZCwgY3VzdG9tVHJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5hcHBlbmQoIGh0bWwgKTtcbiAgICAgICAgICAgICQoIFwiI2F1dG9jb21wbGV0ZVwiICkuc2hvdygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtaW5MZW5ndGg6IDNcbiAgICAgIH0pO1xuICB9IGVsc2UgeyAvLyBQYXMgZCdhdXRvY29tcGzDqXRpb25cbiAgICAkc2VhcmNoLmZpbmQoIFwiaW5wdXRcIiApLmF1dG9jb21wbGV0ZSh7IHNvdXJjZTogW10gfSk7XG4gIH1cblxufVxuXG4vLyDDgCBsYSBzb3VtaXNzaW9uIGR1IGZvcm11bGFpcmUsIG9uIHLDqWN1cMOocmUgZGVzIG1vcmNlYXV4IHN1ciBEZWV6ZXJcbmZ1bmN0aW9uIGdvKCkge1xuICAkc2VhcmNoLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoJCggd2luZG93ICkud2lkdGgoKSA+IDYwMCkge1xuICAgICAgICBzZWFyY2hUcmFja3MoKTtcbiAgICAgICAgR1VJLmFsZXJ0KFwibWVzc2FnZVwiLCBcIkNob2lzaXNzZXogdW4gbW9yY2VhdSBkZSByw6lmw6lyZW5jZVwiLCA1KTtcbiAgICAgICAgJHNlYXJjaC5maW5kKCBcImlucHV0XCIgKS52YWwoIFwiXCIgKTtcbiAgICAgIH1cbiAgfSk7XG59XG5cbi8vIEdlc3Rpb24gZGVzIGFsZ29yaXRobWVzIGRlIHRyaSBkZXMgbW9yY2VhdXhcbmZ1bmN0aW9uIHNldFNvcnRpbmdTdHJhdGVneSgpIHtcbiAgc3dpdGNoIChHVUkuc2VsZWN0ZWRTb3J0aW5nKSB7XG4gICAgY2FzZSBcInRlbXBvRmlyc3RcIjpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0odGVtcG9GaXJzdFNvcnRpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImtleUZpcnN0XCI6XG4gICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGtleUZpcnN0U29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiYXNjVGVtcG9cIjpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0oYXNjVGVtcG9Tb3J0aW5nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZXNjVGVtcG9cIjpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0oZGVzY1RlbXBvU29ydGluZyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShub1NvcnRpbmcpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0oZGVmYXVsdFNvcnRpbmcpO1xuICB9XG59XG5cbi8vIFJlY2hlcmNoZSBkZSBtb3JjZWF1eCBzdXIgRGVlemVyXG5mdW5jdGlvbiBzZWFyY2hUcmFja3MoKSB7XG5cbiAgICAvLyBSw6lpbml0aWFsaXNhdGlvbiBkZSBsYSByZWNoZXJjaGVcbiAgICBpZiAoJG93bC5pcyggXCI6dmlzaWJsZVwiICkpICRvd2wuZW1wdHkoKTtcbiAgICBHVUkuY2xlYW5Ob3RpZmljYXRpb25zKCk7XG5cbiAgICB2YXIga2V5d29yZCA9ICRzZWFyY2guZmluZCggXCJpbnB1dFwiICkudmFsKCk7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcInFcIiwga2V5d29yZCk7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDIwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAvLyBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHN1ciBjaGFxdWUgbW9yY2VhdVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIHRyYWNrID0gcmVzcG9uc2UuZGF0YVtpXSxcbiAgICAgICAgICAgICAgICBjdXN0b21UcmFjayA9IG5ldyBNdXNpYy5UcmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2sudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFjay5hcnRpc3QubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLmFsYnVtLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0ucmVsZWFzZV9kYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2suYWxidW0uY292ZXJfbWVkaXVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIE9uIGNvbnN0cnVpdCBsZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgdmFyIGh0bWwgPSBHVUkudGVtcGxhdGUoXCJiYXNlLXRyYWNrXCIsIGN1c3RvbVRyYWNrLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgICRvd2wuZGF0YSgnb3dsQ2Fyb3VzZWwnKS5hZGRJdGVtKGh0bWwpO1xuICAgICAgICAgICAgLy8gT24gYWpvdXRlIHVuIMOpY291dGV1ciBkJ8OpdsOpbmVtZW50IGRlIHR5cGUgY2xpYyBwb3VyIGNoYXF1ZSBtb3JjZWF1XG4gICAgICAgICAgICBzZWxlY3RlZFRyYWNrKFwic3VibWl0LVwiICsgdHJhY2suaWQsIGN1c3RvbVRyYWNrKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPbiBhZmZpY2hlIGxlcyByw6lzdWx0YXRzXG4gICAgICAgICQoIFwiI3RvZ2dsZS1jYXJvdXNlbCBpXCIgKVxuICAgICAgICAgIC5zd2l0Y2hDbGFzcyggXCJkb3duXCIsIFwidXBcIiApXG4gICAgICAgICAgLmNzcyggXCJib3JkZXItY29sb3JcIiwgXCIjMTg4QUUzXCIgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH1cblxufVxuXG4vLyBHZXN0aW9uIGR1IGNsaWMgc3VyIHVuIMOpbMOpbWVudCBkZSBsYSBsaXN0ZSBkZSBzdWdnZXN0aW9uc1xuZnVuY3Rpb24gc2VsZWN0ZWRUcmFjayhlbHRJZCwgdHJhY2spIHtcbiAgICAkKCBkb2N1bWVudCApLm9mZiggXCJjbGlja1wiLCBcIiNcIiArIGVsdElkICk7XG4gICAgJCggZG9jdW1lbnQgKS5vbiggXCJjbGlja1wiLCBcIiNcIiArIGVsdElkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gT24gcmVtZXQgbGVzIGNvbXB0ZXVycyDDoCAwLi4uXG4gICAgICAgIGlmIChzaW1pbGFyVHJhY2tzLmxlbmd0aCA+IDApIHNpbWlsYXJUcmFja3MgPSBbXTtcbiAgICAgICAgLy8gT24gZMOpc2FjdGl2ZSBsYSByZWNoZXJjaGVcbiAgICAgICAgR1VJLnNlYXJjaC5vZmYoKTtcbiAgICAgICAgLy8gT24gZMOpZmluaXQgbGEgcsOpZsOpcmVuY2VcbiAgICAgICAgcmVmSWQgPSBlbHRJZDtcbiAgICAgICAgcmVmVHJhY2sgPSB0cmFjaztcbiAgICAgICAgLy8gQWZmZWN0YXRpb24gZCd1biBhbGdvcml0aG1lIGRlIHRyaVxuICAgICAgICBzZXRTb3J0aW5nU3RyYXRlZ3koKTtcbiAgICAgICAgLy8gT24gZWZmYWNlIGxlcyBub3RpZmljYXRpb25zXG4gICAgICAgIEdVSS5jbGVhbk5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgLy8gT24gYWZmaWNoZSB1biBsb2FkZXIgcG91ciBmYWlyZSBwYXRpZW50ZXIgbCdpbnRlcm5hdXRlXG4gICAgICAgIEdVSS5sb2FkaW5nLm9uKCk7XG4gICAgICAgIC8vIE9uIHLDqWN1cMOocmUgbGUgcsOpc3Vtw6kgYXVkaW8gZHUgbW9yY2VhdSBzw6lsZWN0aW9ubsOpIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgZ2V0SW5pdGlhbEF1ZGlvU3VtbWFyeSh0cmFjay5nZXRJZCgpKTtcbiAgICAgICAgLy8gT24gcsOpY3Vww6hyZSBsZXMgaW5mb3JtYXRpb25zIGTDqXRhaWxsw6llcyBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgICAgZ2V0VHJhY2tJbmZvKHRyYWNrLmdldElkKCkpO1xuICAgIH0pO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIGRlIHRlbXBvIGV0IGRlIHRvbmFsaXTDqSBwb3VyIGxlIG1vcmNlYXUgc8OpbGVjdGlvbm7DqSAoRWNobyBOZXN0KVxuZnVuY3Rpb24gZ2V0SW5pdGlhbEF1ZGlvU3VtbWFyeSh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImlkXCIsIFwiZGVlemVyOnRyYWNrOlwiICsgdHJhY2tJZCk7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImJ1Y2tldFwiLCBcImF1ZGlvX3N1bW1hcnlcIik7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIGVycm9yKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZmluYWwpIHtcbiAgICAgICAgLy8gTGUgbW9yY2VhdSBlc3QtaWwgdHJvdXbDqSBzdXIgRWNobyBOZXN0IMOgIHBhcnRpciBkZSBsJ2lkZW50aWZpYW50IERlZXplciA/XG4gICAgICAgIGlmIChmaW5hbC5yZXNwb25zZS50cmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBHVUkuYWxlcnQoXCJzdWNjZXNzXCIsIFwiVHJvdXbDqSBzdXIgRWNobyBOZXN0ICFcIiwgMyk7XG4gICAgICAgICAgICAvLyBMZSBtb3JjZWF1IHRyb3V2w6kgc3VyIEVjaG8gTmVzdCBhLXQtaWwgdW4gcsOpc3Vtw6kgYXVkaW8gP1xuICAgICAgICAgICAgaWYgKCEkLmlzRW1wdHlPYmplY3QoZmluYWwucmVzcG9uc2UudHJhY2suYXVkaW9fc3VtbWFyeSkpIHtcbiAgICAgICAgICAgICAgICAvLyBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHV0aWxlcyBkdSBtb3JjZWF1XG4gICAgICAgICAgICAgICAgdmFyIHRyYWNrID0gZmluYWwucmVzcG9uc2UudHJhY2ssXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gdHJhY2sudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmFydGlzdCxcbiAgICAgICAgICAgICAgICAgICAga2V5SW5kZXggPSB0cmFjay5hdWRpb19zdW1tYXJ5LmtleSxcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gVm9jYWJ1bGFyeS5rZXlzW2tleUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5tb2RlLFxuICAgICAgICAgICAgICAgICAgICBtb2RlID0gVm9jYWJ1bGFyeS5tb2Rlc1ttb2RlSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbyA9IE1hdGgucm91bmQodHJhY2suYXVkaW9fc3VtbWFyeS50ZW1wbyk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbiBjb25zdHJ1aXQgbGUgcHJvZmlsIGR1IG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgICAgICAgICAgICBidWlsZFJlZlRyYWNrUHJvZmlsZShrZXksIG1vZGUsIHRlbXBvKTtcblxuICAgICAgICAgICAgICAgIC8vIE9uIGFmZmljaGUgdG91dCDDp2Egw6AgbCd1dGlsaXNhdGV1clxuICAgICAgICAgICAgICAgIHZhciBpbmZvID0gXCI8c3Ryb25nPsKrIFwiICsgdGl0bGUgKyBcIiDCuzwvc3Ryb25nPjxicj5cIjtcbiAgICAgICAgICAgICAgICAgICAgaW5mbyArPSBcIjxlbT5cIiArIGFydGlzdCArIFwiPC9lbT48YnI+XCI7XG4gICAgICAgICAgICAgICAgICAgIGluZm8gKz0gXCI8dT5Ub25hbGl0w6k8L3U+IDogXCIgKyBrZXkgKyBcIiBcIiArIG1vZGUgKyBcIjxicj5cIjtcbiAgICAgICAgICAgICAgICAgICAgaW5mbyArPSBcIjx1PlRlbXBvPC91PiA6IFwiICsgdGVtcG8gKyBcIiBCUE1cIjtcblxuICAgICAgICAgICAgICAgIEdVSS5hbGVydChcIm1lc3NhZ2VcIiwgaW5mbywgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBidWlsZFJlZlRyYWNrUHJvZmlsZShcIlwiLCBcIlwiLCAwKTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJMZSByw6lzdW3DqSBhdWRpbyBkZSBjZSBtb3JjZWF1IG4nZXN0IHBhcyBkaXNwb25pYmxlIHN1ciBFY2hvIE5lc3QuXCIsIDEwKTtcbiAgICAgICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJTdWdnZXN0aW9uIGhhcm1vbmlxdWUgaW1wb3NzaWJsZVwiLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRSZWZUcmFja1Byb2ZpbGUoXCJcIiwgXCJcIiwgMCk7XG4gICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJDZSBtb3JjZWF1IG4nYSBwYXMgw6l0w6kgdHJvdXbDqSBzdXIgRWNobyBOZXN0LlwiLCAxMCk7XG4gICAgICAgICAgR1VJLmFsZXJ0KFwiZXJyb3JcIiwgXCJTdWdnZXN0aW9uIGhhcm1vbmlxdWUgaW1wb3NzaWJsZVwiLCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH1cblxufVxuXG4vLyBDb25zdHJ1Y3Rpb24gZHUgcHJvZmlsIGR1IG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbmZ1bmN0aW9uIGJ1aWxkUmVmVHJhY2tQcm9maWxlKGtleSwgbW9kZSwgdGVtcG8pIHtcblxuICAgIC8vIE9uIG1ldCDDoCBqb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2UgYXZlYyBsZXMgZG9ubsOpZXMgbXVzaWNhbGVzXG4gICAgaWYgKGtleSAhPT0gXCJcIiAmJiBtb2RlICE9PSBcIlwiICYmIHRlbXBvICE9PSAwKSB7XG4gICAgICB2YXIgY2FtZWxvdFRhZyA9IFZvY2FidWxhcnkuaGFybW9uaWNNaXhbbW9kZV1ba2V5XS50YWcsXG4gICAgICAgICAgaGFybW9uaWVzID0gVm9jYWJ1bGFyeS5jYW1lbG90V2hlZWxbY2FtZWxvdFRhZ10ubWF0Y2hlcztcblxuICAgICAgcmVmVHJhY2suc2V0S2V5KGtleSk7XG4gICAgICByZWZUcmFjay5zZXRNb2RlKG1vZGUpO1xuICAgICAgcmVmVHJhY2suc2V0VGVtcG8odGVtcG8pO1xuICAgICAgcmVmVHJhY2suc2V0Q2FtZWxvdFRhZyhjYW1lbG90VGFnKTtcbiAgICAgIHJlZlRyYWNrLnNldEhhcm1vbmllcyhoYXJtb25pZXMpO1xuICAgIH1cblxuICAgIC8vIE9uIGFqb3V0ZSBsZSBtb3JjZWF1IMOgIGxhIHBsYXlsaXN0XG4gICAgJCggXCIjXCIgKyByZWZJZCApLm5leHQoKS52YWwoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHJlZlRyYWNrKSkpO1xuICAgIEdVSS5wbGF5bGlzdC5hZGRUcmFjayhyZWZJZCk7XG5cbiAgICAvLyBPbiBlbiBwcm9maXRlIHBvdXIgY29uc3RydWlyZSBsJ2hhcm1vbmllIGRlIGJhc2VcbiAgICBidWlsZEhhcm1vbnlQcm9maWxlKHJlZlRyYWNrKTtcblxufVxuXG4vLyBDb25zdHJ1Y3Rpb24gZHUgcHJvZmlsIGRlIGJhc2UgZGUgbCdoYXJtb25pZSByZWNoZXJjaMOpZVxuZnVuY3Rpb24gYnVpbGRIYXJtb255UHJvZmlsZSh0cmFjaykge1xuICAgIGhhcm1vbnkgPSBuZXcgTXVzaWMuSGFybW9ueSh0cmFjaywgbnVsbCwgR1VJLnRlbXBvVmFyaWF0aW9uKTtcbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGluZm9ybWF0aW9ucyBzdXIgdW4gbW9yY2VhdSwgbm90YW1tZW50IHBvdXIgYXZvaXIgbCdpZCBkZSBsJ2FydGlzdGUgKERlZXplcilcbmZ1bmN0aW9uIGdldFRyYWNrSW5mbyh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi90cmFjay9cIiArIHRyYWNrSWQpO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBlcnJvcik7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIGdldFNpbWlsYXJBcnRpc3RzKHJlc3BvbnNlLmFydGlzdC5pZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9XG5cbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGFydGlzdGVzIHNpbWlsYWlyZXMgKERlZXplcilcbmZ1bmN0aW9uIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9hcnRpc3QvXCIgKyBhcnRpc3RJZCArIFwiL3JlbGF0ZWRcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgZXJyb3IpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICB2YXIgYXJ0aXN0cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RfbWV0aG9kXCI6XCJnZXRcIixcbiAgICAgICAgICAgICAgICBcInJlbGF0aXZlX3VybFwiOlwiYXJ0aXN0L1wiICsgcmVzcG9uc2UuZGF0YVtpXS5pZCArIFwiL3RvcFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBhcnRpc3RzID0gSlNPTi5zdHJpbmdpZnkoYXJ0aXN0cyk7XG4gICAgICAgIGdldFRvcFRyYWNrcyhhcnRpc3RzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH1cblxufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgY2hhbnNvbnMgbGVzIHBsdXMgcG9wdWxhaXJlcyBkZSBjaGFxdWUgYXJ0aXN0ZSBzaW1pbGFpcmUgKERlZXplcilcbmZ1bmN0aW9uIGdldFRvcFRyYWNrcyhzaW1pbGFyQXJ0aXN0cykge1xuXG4gICAgLy8gUGFyYW3DqXRyYWdlIGV0IGVudm9pIGRlIGxhIHJlcXXDqnRlXG4gICAgcmVxdWVzdCA9IGZhY3RvcnkuZ2V0QWpheFJlcXVlc3QoXCJkZWV6ZXJcIiwgXCIvYmF0Y2hcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibWV0aG9kc1wiLCBzaW1pbGFyQXJ0aXN0cyk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIGVycm9yKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gdmFyIGlkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJ0aXN0ID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0W2ldO1xuICAgICAgICAgICAgJC5lYWNoKGFydGlzdC5kYXRhLCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcFRyYWNrID0gaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgYWxidW0gPSBpdGVtLmFsYnVtO1xuXG4gICAgICAgICAgICAgICAgLy8gaWRzLnB1c2godG9wVHJhY2suaWQpO1xuICAgICAgICAgICAgICAgIGdldFRvcFRyYWNrSW5mbyh0b3BUcmFjay5pZCwgYWxidW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2V0VG9wVHJhY2tzSW5mbyhpZHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfVxuXG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgdG91cyBsZXMgdG9wIG1vcmNlYXV4IChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRUb3BUcmFja0luZm8oaWQsIGFsYnVtKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gZmFjdG9yeS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7IC8vIHNvbmcuLi5cbiAgICAvKiB2YXIgdHJhY2tzSWRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGlkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdHJhY2tzSWRzLnB1c2goXCJkZWV6ZXI6dHJhY2s6XCIgKyBpZHNbaV0pO1xuICAgIH0gKi9cbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiYnVja2V0XCIsIFwiYXVkaW9fc3VtbWFyeVwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiaWRcIiwgXCJkZWV6ZXI6dHJhY2s6XCIgKyBpZCk7XG4gICAgLy8gcmVxdWVzdC5hZGRQYXJhbShcInRyYWNrX2lkXCIsIHRyYWNrc0lkcyk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIGVycm9yKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZmluYWwpIHtcbiAgICAgICAgLy8gSWwgZmF1dCBxdWUgbGVzIG1vcmNlYXV4IHNvaWVudCB0cm91dsOpcyBzdXIgRWNobyBOZXN0XG4gICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgLy8gSWwgZmF1dCBxdWUgbGVzIG1vcmNlYXV4IHBvc3PDqGRlbnQgdW4gcsOpc3Vtw6kgYXVkaW8gc3VyIEVjaG8gTmVzdFxuICAgICAgICAgICBpZiAoISQuaXNFbXB0eU9iamVjdChmaW5hbC5yZXNwb25zZS50cmFjay5hdWRpb19zdW1tYXJ5KSkge1xuICAgICAgICAgIC8vIHZhciBpZHMgPSBbXTtcbiAgICAgICAgICAvLyBmb3IgKHZhciBpID0gMCwgbGVuID0gZmluYWwucmVzcG9uc2Uuc29uZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIC8vICBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHV0aWxlc1xuICAgICAgICAgICAgdmFyIHRyYWNrID0gZmluYWwucmVzcG9uc2UudHJhY2ssIC8vIGZpbmFsLnJlc3BvbnNlLnNvbmdzW2ldXG4gICAgICAgICAgICAgICAgdGl0bGUgPSB0cmFjay50aXRsZSxcbiAgICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5hcnRpc3QsIC8vIHRyYWNrLmFydGlzdF9uYW1lXG4gICAgICAgICAgICAgICAga2V5SW5kZXggPSB0cmFjay5hdWRpb19zdW1tYXJ5LmtleSxcbiAgICAgICAgICAgICAgICBrZXkgPSBWb2NhYnVsYXJ5LmtleXNba2V5SW5kZXhdLFxuICAgICAgICAgICAgICAgIG1vZGVJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkubW9kZSxcbiAgICAgICAgICAgICAgICBtb2RlID0gVm9jYWJ1bGFyeS5tb2Rlc1ttb2RlSW5kZXhdLFxuICAgICAgICAgICAgICAgIHRlbXBvID0gTWF0aC5yb3VuZCh0cmFjay5hdWRpb19zdW1tYXJ5LnRlbXBvKSxcbiAgICAgICAgICAgICAgICBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZztcblxuICAgICAgICAgICAgLy8gaWRzLnB1c2godHJhY2suaWQpO1xuICAgICAgICAgICAgLy8gT24gYWxpbWVudGUgdW4gdGFibGVhdSBkZSBtb3JjZWF1eCBwb3VyIGRlcyB0cmlzIHVsdMOpcmlldXJzXG4gICAgICAgICAgICB2YXIgdG9wVHJhY2sgPSBuZXcgTXVzaWMuVHJhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bS50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW0ucmVsZWFzZV9kYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bS5jb3Zlcl9tZWRpdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVsb3RUYWcsIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5wdXNoKHRvcFRyYWNrKTtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH1cblxufVxuXG4vLyBMb3JzcXVlIHNlIHRlcm1pbmVudCB0b3V0ZXMgbGVzIHJlcXXDqnRlcyBBamF4IGVuIGNvdXJzLi4uXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKGZ1bmN0aW9uKCkge1xuICAvLyAuLi4gb24gZW5sw6h2ZSBsZSBsb2FkZXIgdnUgcXVlIGMnZXN0IGxhIGZpbiBkZXMgcmVxdcOqdGVzLi4uXG4gIEdVSS5sb2FkaW5nLm9mZigpO1xuICAvLyAuLi4gZXQgb24gbGFuY2UgbGUgdHJpIGRlcyBtb3JjZWF1eCByw6ljdXDDqXLDqXMgKHMnaWwgeSBlbiBhKVxuICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgc2ltaWxhclRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KGhhcm1vbnksIHNpbWlsYXJUcmFja3MpO1xuICAgIGRpc3BsYXlUcmFja3Moc2ltaWxhclRyYWNrcyk7XG4gIH1cbn0pO1xuXG4vLyBBZmZpY2hhZ2UgZGVzIG1vcmNlYXV4IHNlbG9uIHVuIG9yZHJlIGTDqXRlcm1pbsOpIHBhciBsZSB0cmlcbmZ1bmN0aW9uIGRpc3BsYXlUcmFja3ModHJhY2tzKSB7XG5cbiAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5oaWRlKCk7XG4gIEdVSS5zY3JvbGwuZGVzdHJveSgkaGFybW9uaWNUcmFja3MpO1xuICAkaGFybW9uaWNUcmFja3MuZW1wdHkoKTtcblxuICB2YXIgaHRtbCA9IEdVSS50ZW1wbGF0ZShcImhlbHBcIiwgbnVsbCwgbnVsbCwgbnVsbCk7XG5cbiAgLy8gSXTDqXJhdGlvbnMgc3VyIG5vdHJlIGNvbGxlY3Rpb24gZGUgbW9yY2VhdXhcbiAgaXRlcmF0b3IgPSBuZXcgSXRlcmF0b3IodHJhY2tzKTtcbiAgd2hpbGUgKGl0ZXJhdG9yLmhhc05leHQoKSkge1xuXG4gICAgdmFyIHRyYWNrID0gaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgaGFybW9ueS5zZXRPdGhlclRyYWNrKHRyYWNrKTtcbiAgICB2YXIgaXNUZW1wb0NvbXBhdGlibGUgPSBoYXJtb255LnRlbXBvQ29tcGF0aWJpbGl0eSgpLFxuICAgICAgICBpc0tleUNvbXBhdGlibGUgPSBoYXJtb255LmtleUNvbXBhdGliaWxpdHkoKTtcblxuICAgIGh0bWwgKz0gR1VJLnRlbXBsYXRlKFwiaGFybW9uaWMtdHJhY2tcIiwgdHJhY2ssIGlzVGVtcG9Db21wYXRpYmxlLCBpc0tleUNvbXBhdGlibGUpO1xuICAgIHNlbGVjdGVkVHJhY2soXCJzdWdnZXN0aW9uLVwiICsgdHJhY2suZ2V0SWQoKSwgdHJhY2spO1xuXG4gIH1cblxuICAkaGFybW9uaWNUcmFja3MuYXBwZW5kKGh0bWwpO1xuICBHVUkuc2Nyb2xsLnJlc2V0KCRoYXJtb25pY1RyYWNrcyk7XG4gIEdVSS5kaXNwbGF5RmluYWxUcmFja2xpc3QoKTtcbiAgc2ltaWxhclRyYWNrcyA9IFtdO1xuXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV9mMTJkNjczOC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
