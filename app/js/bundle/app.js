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
   * @param {String} path Chemin de la requête
   */
  DeezerAPIRequest: function(path) {
    /**
     * Type de requête (GET ou POST)
     *
     * @property type
     * @type {String}
     * @default "GET"
     */
      this._type = "GET";
      /**
       * URL de requête
       *
       * @property url
       * @type {String}
       * @default "http://api.deezer.com"
       */
      this._url = "http://api.deezer.com" + path;
      /**
       * Type de données renvoyées (JSON, XML, ...)
       *
       * @property dataType
       * @type {String}
       * @default "jsonp"
       */
      this._dataType = "jsonp";
      /**
       * Paramètres de requête
       *
       * @property data
       * @type {Object}
       * @default {}
       */
      this._data = {
          "output": "jsonp",
      };
  },
  /**
   * Classe gérant les requêtes Ajax vers l'API d'Echo Nest
   *
   * @class EchoNestAPIRequest
   * @constructor
   * @param {String} path Chemin de la requête
   */
  EchoNestAPIRequest: function(path) {
    /**
     * Type de requête (GET ou POST)
     *
     * @property type
     * @type {String}
     * @default "GET"
     */
      this._type = "GET";
      /**
       * URL de requête
       *
       * @property url
       * @type {String}
       * @default "http://developer.echonest.com/api/v4"
       */
      this._url = "http://developer.echonest.com/api/v4" + path;
      /**
       * Type de données renvoyées (JSON, XML, ...)
       *
       * @property dataType
       * @type {String}
       * @default "jsonp"
       */
      this._dataType = "jsonp";
      /**
       * Paramètres de requête
       *
       * @property data
       * @type {Object}
       * @default {}
       */
      this._data = {
          "api_key": "VUSUA1HN4HMWUIN5P",
          "format": "jsonp",
          "bucket": "audio_summary"
      };
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
 */
module.exports = GUI = {
  notifAllowed: true,
  soundAllowed: true,
  duplicatesAllowed: false,
  tempoVariation: 0.05,
  selectedSorting: "default",
  tracksLoaded: false,
  trackPosition: 0,
  content: [],
  init: function() {
    // Gestion des ambiances
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
    GUI.popups();
    GUI.listeners();

    var savedPlaylist = localStorage.getItem("playlist");
    if (savedPlaylist !== null) {
      Playlist.selectedTracks = JSON.parse(savedPlaylist);
    }

  },
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
  drag: function() {
    $( "#ipod-wrapper" ).draggable({ scroll: false });
  },
  tooltips: function() {
    $( "[title != '']" ).qtip({
      style: {
          classes: 'qtip-dark'
      }
    });
  },
  scrollbar: function() {
    $( "#playlist, #favorites" ).mCustomScrollbar({
      theme:"dark",
      scrollInertia: 0
    });
  },
  css: function() {
    $( ".pusher" ).css("height", "100%");
  },
  checkboxes: function() {
      $( ".ui.checkbox" ).checkbox();
  },
  popups: function() {
    $( "#options > span" ).popup();
  },
  menu: {
    toggle: function() {
      $( "#menu" ).sidebar( "toggle" );
    },
    togglePlaylist: function() {
      GUI.menu.toggleSidebar( "#playlist", "blue" );
    },
    toggleFavorites: function() {
      GUI.menu.toggleSidebar( "#favorites", "red" );
    },
    toggleAtmospheres: function() {
      GUI.menu.toggleSidebar( "#atmospheres", "green" );
    },
    toggleHarmonicTracks: function() {
      GUI.menu.toggleSidebar( "#harmonic-tracks", "violet" );
    },
    toggleUser: function() {
      GUI.menu.toggleSidebar( "#user", "maroon" );
    },
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
              alertify.success("Connexion OK !", 3);
              GUI.menu.toggleSidebar( "#user", "maroon" );
            } else { // Si la connexion échoue
              alertify.error("Connexion refusée !");
            }
          }, { perms: "basic_access,email" });
      	}
      });
    },
    logout: function() {
      DZ.logout();
      $( "#user-connected" ).hide();
      $( "#user-not-connected" ).show();
      alertify.success("Déconnexion OK !", 3);
      $( "#user" ).sidebar( "toggle" );
    },
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
  playlist: {
    notRandom: function() {
      DZ.player.setShuffle(false);
      $( "#random-btn .icon" ).switchClass( "random", "remove" );
      $( "#random-btn" ).attr( "id", "not-random-btn" );
      if (GUI.notifAllowed) {
        alertify.error("Lecture aléatoire désactivée", 5);
      }
    },
    random: function() {
      DZ.player.setShuffle(true);
      $( "#not-random-btn .icon" ).switchClass( "remove", "random" );
      $( "#not-random-btn" ).attr( "id", "random-btn" );
      if (GUI.notifAllowed) {
        alertify.success("Lecture aléatoire activée", 5);
      }
    },
    noRepeat: function() {
      DZ.player.setRepeat(0);
      $( "#repeat-all-btn .icon" ).switchClass( "refresh", "remove" );
      $( "#repeat-all-btn" ).attr( "id", "no-repeatbtn" );
      if (GUI.notifAllowed) {
        alertify.message("Pas de répétition", 5);
      }
    },
    repeatOne: function() {
      DZ.player.setRepeat(2);
      $( "#no-repeat-btn .icon" ).switchClass( "remove", "repeat" );
      $( "#no-repeat-btn" ).attr( "id", "repeat-one-btn" );
      if (GUI.notifAllowed) {
        alertify.message("Répétition du morceau en cours", 5);
      }
    },
    repeatAll: function() {
      DZ.player.setRepeat(1);
      $( "#repeat-one-btn .icon" ).switchClass( "repeat", "refresh" );
      $( "#repeat-one-btn" ).attr( "id", "repeat-all-btn" );
      if (GUI.notifAllowed) {
        alertify.message("Répétition de tous les morceaux", 5);
      }
    },
    mute: function() {
      DZ.player.setMute(true);
      $( "#mute-btn .icon" ).switchClass( "mute", "unmute" );
      $( "#mute-btn" ).attr( "id", "unmute-btn" );
      if (GUI.notifAllowed) {
        alertify.error("Son coupé !", 5);
      }
    },
    unmute: function() {
      DZ.player.setMute(false);
      $( "#unmute-btn .icon" ).switchClass( "unmute", "mute" );
      $( "#unmute-btn" ).attr( "id", "mute-btn" );
      if (GUI.notifAllowed) {
        alertify.success("Son rétabli !", 5);
      }
    },
    save: function() {
      var playlist = JSON.stringify(Playlist.selectedTracks);
      localStorage.setItem("playlist", playlist);
      if (GUI.notifAllowed) {
        alertify.success("Playlist sauvegardée !", 5);
      }
    },
    export: function() {
      $( "#csv-export" ).tableToCSV();
      if (GUI.notifAllowed) {
        alertify.success("Playlist exportée !", 5);
      }
    },
    delete: function() {
      Playlist.selectedTracks = [];
      localStorage.removeItem("playlist");
      if (GUI.notifAllowed) {
        alertify.success("Playlist effacée !", 5);
      }
    },
    previous: function() {
      DZ.player.prev();
    },
    back: function() {
      if (GUI.trackPosition > 10) {
        GUI.trackPosition -= 10;
      }
      DZ.player.seek(GUI.trackPosition);
    },
    play: function() {
      if (GUI.tracksLoaded) {
        DZ.player.play();
      } else {
        DZ.player.playTracks(Playlist.tracksIds);
        GUI.tracksLoaded = true;
      }
    },
    pause: function() {
      DZ.player.pause();
    },
    forth: function() {
      if (GUI.trackPosition < 90) {
        GUI.trackPosition += 10;
      }
      DZ.player.seek(GUI.trackPosition);
    },
    next: function() {
      DZ.player.next();
    }
  },
  favorites: {
    ipod: function() {
      var $ipod = $( "#ipod-wrapper" ),
          $ipodState = $( "#fav-ipod .state" );
      $ipod.is( ":visible" ) ? $ipod.fadeOut() : $ipod.fadeIn();
      GUI.favorites.displayMessage($ipodState, "iPod activé !", "iPod désactivé !");
      GUI.favorites.changeState($ipodState);
    },
    notify: function() {
      var $notifState = $( "#fav-notify .state" );
      GUI.notifAllowed ? (GUI.notifAllowed = false) : (GUI.notifAllowed = true);
      GUI.favorites.displayMessage($notifState, "Notifications activées !", "Notifications désactivées !");
      GUI.favorites.changeState($notifState);
    },
    sound: function() {
      var $soundState = $( "#fav-sound .state" );
      GUI.soundAllowed ? (GUI.soundAllowed = false) : (GUI.soundAllowed = true);
      GUI.favorites.displayMessage($soundState, "Sons d'ambiance activés !", "Sons d'ambiance désactivés !");
      GUI.favorites.changeState($soundState);
    },
    duplicate: function() {
      var $duplicateState = $( "#fav-duplicate .state" );
      GUI.duplicatesAllowed ? (GUI.duplicatesAllowed = false) : (GUI.duplicatesAllowed = true);
      GUI.favorites.displayMessage($duplicateState, "Doublons activés !", "Doublons désactivés !");
      GUI.favorites.changeState($duplicateState);
    },
    changeState: function($state) {
      if ($state.val() == "activated") {
        $state.val( "deactivated" );
      } else {
        $state.val( "activated" );
      }
    },
    displayMessage: function($state, positiveMessage, negativeMessage) {
      if (GUI.notifAllowed) {
        if ($state.val() == "activated") {
          alertify.error(negativeMessage, 5);
        } else {
          alertify.success(positiveMessage, 5);
        }
      }
    },
    tempoRange: function() {
      var tempoVariation = $( "input[type='range']" ).val();
      $( "input[type='range'] + span" ).text( tempoVariation + " %" );
      GUI.tempoVariation = (tempoVariation / 100);
    },
    defaultSorting: function() {
      GUI.selectedSorting = "default";
    },
    tempoSorting: function() {
      GUI.selectedSorting = "tempoFirst";
    },
    keySorting: function() {
      GUI.selectedSorting = "keyFirst";
    },
    ascTempoSorting: function() {
      GUI.selectedSorting = "ascTempo";
    },
    descTempoSorting: function() {
      GUI.selectedSorting = "descTempo";
    },
    noSorting: function() {
      GUI.selectedSorting = "none";
    }
  },
  /* atmospheres: {
    applyAtmosphere: function(index) {
      $( "#main" ).vegas( "jump", index );
    }
  }, */
  events: {
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
    showInfoPopup: function() {
      $( ".ui.modal" ).modal( "show" );
    },
    addTrackToPlaylist: function() {
      var track = JSON.parse(decodeURIComponent($( this ).children().eq(1).val()));
      Playlist.addTrackToPlaylist(track);
      GUI.tracksLoaded = false;
      if (GUI.notifAllowed) {
        alertify.success("Morceau ajouté à votre playlist", 5);
      }
    }
  },
  listeners: function() {

    // Écouteurs d'événements des sidebars
    var menuEvents = [
                        [".toggle-menu", "click", GUI.menu.toggle],
                        ["#playlist-btn", "click", GUI.menu.togglePlaylist],
                        ["#favorites-btn", "click", GUI.menu.toggleFavorites],
                        ["#atmospheres-btn", "click", GUI.menu.toggleAtmospheres],
                        ["#harmonic-tracks-btn", "click", GUI.menu.toggleHarmonicTracks],
                        ["#user-btn", "click", GUI.menu.toggleUser],
                        ["#login", "click", GUI.menu.login],
                        ["#logout", "click", GUI.menu.logout],
                        [".toggle-all", "click", GUI.menu.toggleAll]
                      ];

    addEvents(menuEvents);

    // Écouteurs d'événements de la playlist
    var playlistEvents = [
                            ["#not-random-btn", "click", GUI.playlist.random, "async"],
                            ["#random-btn", "click", GUI.playlist.notRandom, "async"],
                            ["#no-repeat-btn", "click", GUI.playlist.repeatOne, "async"],
                            ["#repeat-one-btn", "click", GUI.playlist.repeatAll, "async"],
                            ["#repeat-all-btn", "click", GUI.playlist.noRepeat, "async"],
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
                            [".next-btn", "click", GUI.playlist.next]
                         ];

    addEvents(playlistEvents);

    // Écouteurs d'événements des favoris
    var favoritesEvents = [
                           ["#fav-ipod", "click", GUI.favorites.ipod],
                           ["#fav-notify", "click", GUI.favorites.notify],
                           ["#fav-sound", "click", GUI.favorites.sound],
                           ["#fav-duplicate", "click", GUI.favorites.duplicate],
                           ["#fav-tempo-range", "input", GUI.favorites.tempoRange],
                           ["#fav-default-sorting", "click", GUI.favorites.defaultSorting],
                           ["#fav-tempo-sorting", "click", GUI.favorites.tempoSorting],
                           ["#fav-key-sorting", "click", GUI.favorites.keySorting],
                           ["#fav-asc-tempo-sorting", "click", GUI.favorites.ascTempoSorting],
                           ["#fav-desc-tempo-sorting", "click", GUI.favorites.descTempoSorting],
                           ["#fav-no-sorting", "click", GUI.favorites.noSorting]
                         ];

    addEvents(favoritesEvents);

    // Écouteurs d'événements des ambiances
    var atmospheres = [
                        "#neutral-atmo",
                        "#rock-atmo",
                        "#electro-atmo",
                        "#hiphop-atmo",
                        "#folk-atmo",
                        "#classical-atmo",
                        "#jazz-atmo",
                        "#metal-atmo"
                      ];

    $( "#atmospheres .item" ).each(function(index, element) {

      var id = $( this ).attr( "id" ),
          name = id.substring(0, id.indexOf("-"));

      $( element ).click(function() {
        $( this ).addClass( "green-item" );
        $( this ).siblings().removeClass( "green-item" );
        // GUI.atmospheres.applyAtmosphere(index);
        $( ".pusher" ).attr( "style", "background:url('images/background/" + name + ".jpg') no-repeat center center fixed !important" );
        if (GUI.soundAllowed && name != "neutral") {
          var audio = new Audio( "./sounds/" + name + ".ogg");
          audio.play();
        }
      });

    });

    // Écouteurs d'événements divers
    var otherEvents = [
                        ["#logo", "click", GUI.events.logo],
                        ["#tracks-help", "click", GUI.events.showInfoPopup, "async"],
                        [".harmonic-track", "click", GUI.events.addTrackToPlaylist, "async"]
                      ];

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
module.exports = Player = (function() {

  var player,
      construct = function() {
        this.init = function(tracks) {
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
      },
      test: function() {
        console.log("Tata");
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
        if (GUI.notifAllowed) {
          alertify.message("Choisissez un morceau de référence", 5);
        }

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
            var html = '<div id="' + track.id + '" class="track">';
                html += ' <figure>';
                html += '   <img class="lazyOwl" data-src="' + track.album.cover_medium + '" alt="' + track.title + '">';
                html += '   <figcaption>';
                html += '     <div>';
                html += '       <h3 class="track-title">' + track.title + '</h3>';
                html += '       <p class="artist-name">' + artistName + "</p>";
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
            if (GUI.notifAllowed) {
              alertify.success("Trouvé sur Echo Nest !", 3);
            }
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

                if (GUI.notifAllowed) {
                  titleNotif = alertify.message("« " + title + " » par " + artist, 0);
                  keyNotif = alertify.message("Tonalité : " + key + " " + mode, 0);
                  tempoNotif = alertify.message("Tempo : " + tempo + " BPM", 0);
                }
            } else {
              buildRefTrackProfile(trackId, "", "", "", "", "", 0);
              if (GUI.notifAllowed) {
                alertify.error("Le résumé audio de ce morceau n'est pas disponible sur Echo Nest.", 10);
                alertify.error("Suggestion harmonique impossible", 10);
              }
            }
        } else {
          buildRefTrackProfile(trackId, "", "", "", "", "", 0);
          if (GUI.notifAllowed) {
            alertify.error("Ce morceau n'a pas été trouvé sur Echo Nest.", 10);
            alertify.error("Suggestion harmonique impossible", 10);
          }
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
    html += '<a class="harmonic-track">';
    html += ' <figure>';
    html += '   <img src="' + item.getCover() + '" alt="' + item.getTitle() + '">';
    html += '   <figcaption>';
    html += '     <div>';
    html += '      <h3>' + item.getTitle() + '</h3>';
    html += '      <p class="artist-name">' + artistName + '</p>';
    html += '      <p class="' + tempoCssClass + '">Tempo : ' + item.getTempo() + ' BPM</p>';
    html += '      <p class="' + tonalityCssClass + '">Tonalité : ' + item.getKey() + ' ' + item.getMode() + '</p>';
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

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_8dd07d2c.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvcGxheWxpc3QtaGFybW9uaXF1ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L3BsYXlsaXN0LWhhcm1vbmlxdWUvYXBwL2pzL21vZHVsZXMvQWpheC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvcGxheWxpc3QtaGFybW9uaXF1ZS9hcHAvanMvbW9kdWxlcy9HVUkuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L3BsYXlsaXN0LWhhcm1vbmlxdWUvYXBwL2pzL21vZHVsZXMvSXRlcmF0b3IuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L3BsYXlsaXN0LWhhcm1vbmlxdWUvYXBwL2pzL21vZHVsZXMvTXVzaWMuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L3BsYXlsaXN0LWhhcm1vbmlxdWUvYXBwL2pzL21vZHVsZXMvUGxheWVyLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9wbGF5bGlzdC1oYXJtb25pcXVlL2FwcC9qcy9tb2R1bGVzL1BsYXlsaXN0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9wbGF5bGlzdC1oYXJtb25pcXVlL2FwcC9qcy9tb2R1bGVzL1NvcnRpbmcuanMiLCIvaG9tZS9iYWRhL0RvY3VtZW50cy9FdHVkZXMvRE5SMkkvTTIvUHJvamV0L3BsYXlsaXN0LWhhcm1vbmlxdWUvYXBwL2pzL21vZHVsZXMvVm9jYWJ1bGFyeS5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvcGxheWxpc3QtaGFybW9uaXF1ZS9hcHAvanMvc2NyaXB0cy9mYWtlXzhkZDA3ZDJjLmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9wbGF5bGlzdC1oYXJtb25pcXVlL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvcGxheWxpc3QtaGFybW9uaXF1ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL2hvbWUvYmFkYS9Eb2N1bWVudHMvRXR1ZGVzL0ROUjJJL00yL1Byb2pldC9wbGF5bGlzdC1oYXJtb25pcXVlL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9ob21lL2JhZGEvRG9jdW1lbnRzL0V0dWRlcy9ETlIySS9NMi9Qcm9qZXQvcGxheWxpc3QtaGFybW9uaXF1ZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIE1vZHVsZSBmb3Vybmlzc2FudCB1bmUgYXJjaGl0ZWN0dXJlIHLDqXV0aWxpc2FibGUgcG91ciBnw6lyZXIgbGVzIHJlcXXDqnRlcyBBamF4XG4gKlxuICogQG1vZHVsZSBBamF4XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQWpheCA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBnw6luw6lyaXF1ZSBwb3VyIGxlcyByZXF1w6p0ZXMgQWpheFxuICAgKlxuICAgKiBAY2xhc3MgUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBkZSByZXF1w6p0ZSAoR0VUIG91IFBPU1QpXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJMIGRlIHJlcXXDqnRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSBUeXBlIGRlIGRvbm7DqWVzIHJlbnZvecOpZXMgKEpTT04sIFhNTCwgLi4uKVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgKi9cbiAgUmVxdWVzdDogZnVuY3Rpb24odHlwZSwgdXJsLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIC8qKlxuICAgICAqIFR5cGUgZGUgcmVxdcOqdGUgKEdFVCBvdSBQT1NUKVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAvKipcbiAgICAgKiBVUkwgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB1cmxcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgLyoqXG4gICAgICogVHlwZSBkZSBkb25uw6llcyByZW52b3nDqWVzIChKU09OLCBYTUwsIC4uLilcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhVHlwZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2RhdGFUeXBlID0gZGF0YVR5cGU7XG4gICAgLyoqXG4gICAgICogUGFyYW3DqHRyZXMgZGUgcmVxdcOqdGVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAZGVmYXVsdCB7fVxuICAgICAqL1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4IHZlcnMgbCdBUEkgZGUgRGVlemVyXG4gICAqXG4gICAqIEBjbGFzcyBEZWV6ZXJBUElSZXF1ZXN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICovXG4gIERlZXplckFQSVJlcXVlc3Q6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAvKipcbiAgICAgKiBUeXBlIGRlIHJlcXXDqnRlIChHRVQgb3UgUE9TVClcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB0eXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIkdFVFwiXG4gICAgICovXG4gICAgICB0aGlzLl90eXBlID0gXCJHRVRcIjtcbiAgICAgIC8qKlxuICAgICAgICogVVJMIGRlIHJlcXXDqnRlXG4gICAgICAgKlxuICAgICAgICogQHByb3BlcnR5IHVybFxuICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAqIEBkZWZhdWx0IFwiaHR0cDovL2FwaS5kZWV6ZXIuY29tXCJcbiAgICAgICAqL1xuICAgICAgdGhpcy5fdXJsID0gXCJodHRwOi8vYXBpLmRlZXplci5jb21cIiArIHBhdGg7XG4gICAgICAvKipcbiAgICAgICAqIFR5cGUgZGUgZG9ubsOpZXMgcmVudm95w6llcyAoSlNPTiwgWE1MLCAuLi4pXG4gICAgICAgKlxuICAgICAgICogQHByb3BlcnR5IGRhdGFUeXBlXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICogQGRlZmF1bHQgXCJqc29ucFwiXG4gICAgICAgKi9cbiAgICAgIHRoaXMuX2RhdGFUeXBlID0gXCJqc29ucFwiO1xuICAgICAgLyoqXG4gICAgICAgKiBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgICAgICpcbiAgICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICogQGRlZmF1bHQge31cbiAgICAgICAqL1xuICAgICAgdGhpcy5fZGF0YSA9IHtcbiAgICAgICAgICBcIm91dHB1dFwiOiBcImpzb25wXCIsXG4gICAgICB9O1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGfDqXJhbnQgbGVzIHJlcXXDqnRlcyBBamF4IHZlcnMgbCdBUEkgZCdFY2hvIE5lc3RcbiAgICpcbiAgICogQGNsYXNzIEVjaG9OZXN0QVBJUmVxdWVzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggQ2hlbWluIGRlIGxhIHJlcXXDqnRlXG4gICAqL1xuICBFY2hvTmVzdEFQSVJlcXVlc3Q6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAvKipcbiAgICAgKiBUeXBlIGRlIHJlcXXDqnRlIChHRVQgb3UgUE9TVClcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB0eXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIkdFVFwiXG4gICAgICovXG4gICAgICB0aGlzLl90eXBlID0gXCJHRVRcIjtcbiAgICAgIC8qKlxuICAgICAgICogVVJMIGRlIHJlcXXDqnRlXG4gICAgICAgKlxuICAgICAgICogQHByb3BlcnR5IHVybFxuICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAqIEBkZWZhdWx0IFwiaHR0cDovL2RldmVsb3Blci5lY2hvbmVzdC5jb20vYXBpL3Y0XCJcbiAgICAgICAqL1xuICAgICAgdGhpcy5fdXJsID0gXCJodHRwOi8vZGV2ZWxvcGVyLmVjaG9uZXN0LmNvbS9hcGkvdjRcIiArIHBhdGg7XG4gICAgICAvKipcbiAgICAgICAqIFR5cGUgZGUgZG9ubsOpZXMgcmVudm95w6llcyAoSlNPTiwgWE1MLCAuLi4pXG4gICAgICAgKlxuICAgICAgICogQHByb3BlcnR5IGRhdGFUeXBlXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICogQGRlZmF1bHQgXCJqc29ucFwiXG4gICAgICAgKi9cbiAgICAgIHRoaXMuX2RhdGFUeXBlID0gXCJqc29ucFwiO1xuICAgICAgLyoqXG4gICAgICAgKiBQYXJhbcOodHJlcyBkZSByZXF1w6p0ZVxuICAgICAgICpcbiAgICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICogQGRlZmF1bHQge31cbiAgICAgICAqL1xuICAgICAgdGhpcy5fZGF0YSA9IHtcbiAgICAgICAgICBcImFwaV9rZXlcIjogXCJWVVNVQTFITjRITVdVSU41UFwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IFwianNvbnBcIixcbiAgICAgICAgICBcImJ1Y2tldFwiOiBcImF1ZGlvX3N1bW1hcnlcIlxuICAgICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBjb25zdHJ1aXNhbnQgw6AgbGEgZGVtYW5kZSBkZXMgcmVxdcOqdGVzIEFqYXggZCd1biBjZXJ0YWluIHR5cGVcbiAgICpcbiAgICogQGNsYXNzIFJlcXVlc3RGYWN0b3J5XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgUmVxdWVzdEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnaW5zdGFuY2llciBsZXMgY2xhc3NlcyBnw6lyYW50IGxlcyByZXF1w6p0ZXMgQWpheFxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBamF4UmVxdWVzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhcGkgQVBJIMOgIGludGVycm9nZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBDaGVtaW4gZGUgbGEgcmVxdcOqdGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFVuIG9iamV0IGRlIHR5cGUgQWpheFxuICAgICAqL1xuICAgICAgdGhpcy5nZXRBamF4UmVxdWVzdCA9IGZ1bmN0aW9uKGFwaSwgcGF0aCkge1xuICAgICAgICAgIHZhciBhamF4UmVxdWVzdDtcbiAgICAgICAgICBpZiAoYXBpID09PSBcImRlZXplclwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRGVlemVyQVBJUmVxdWVzdChwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFwaSA9PT0gXCJlY2hvbmVzdFwiKSB7XG4gICAgICAgICAgICAgIGFqYXhSZXF1ZXN0ID0gbmV3IEFqYXguRWNob05lc3RBUElSZXF1ZXN0KHBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWpheFJlcXVlc3Q7XG4gICAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBsYSBjbGFzc2UgbcOocmUgOiBBamF4XG4gKi9cbiBBamF4LlJlcXVlc3QucHJvdG90eXBlID0ge1xuICAgLyoqXG4gICAgKiBNw6l0aG9kZSBwZXJtZXR0YW50IGQnYWpvdXRlciB1biBwYXJhbcOodHJlIMOgIGxhIHJlcXXDqnRlXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRQYXJhbVxuICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBDbMOpIGR1IHBhcmFtw6h0cmVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBWYWxldXIgZHUgcGFyYW3DqHRyZVxuICAgICovXG4gICBhZGRQYXJhbTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgIH0sXG4gICAvKipcbiAgICAqIE3DqXRob2RlIGNoYXJnw6llIGQnZW52b3llciBsZXMgcmVxdcOqdGVzIEFqYXhcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNlbmRcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1Y2Nlc3MgRm9uY3Rpb24gw6AgZXjDqWN1dGVyIGF1IHN1Y2PDqHMgZGUgbGEgcmVxdcOqdGVcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yIEZvbmN0aW9uIMOgIGV4w6ljdXRlciBsb3JzIGQndW5lIGVycmV1ciBkYW5zIGxhIHJlcXXDqnRlXG4gICAgKi9cbiAgIHNlbmQ6IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgICQuYWpheCh7XG4gICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxuICAgICAgICAgdXJsOiB0aGlzLl91cmwsXG4gICAgICAgICBkYXRhVHlwZTogdGhpcy5fZGF0YVR5cGUsXG4gICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgIH0sXG4gICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICBlcnJvcihyZXNwb25zZSk7XG4gICAgICAgICB9XG4gICAgIH0pO1xuICAgfVxuIH07XG5cbi8qKlxuICogQ2xvbmFnZSBkZSBwcm90b3R5cGUgcG91ciBjcsOpZXIgZGVzIGNsYXNzZXMgZmlsbGVzXG4gKi9cbkFqYXguRGVlemVyQVBJUmVxdWVzdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFqYXguUmVxdWVzdC5wcm90b3R5cGUpO1xuQWpheC5EZWV6ZXJBUElSZXF1ZXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFqYXguRGVlemVyQVBJUmVxdWVzdDtcblxuQWpheC5FY2hvTmVzdEFQSVJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBamF4LlJlcXVlc3QucHJvdG90eXBlKTtcbkFqYXguRWNob05lc3RBUElSZXF1ZXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFqYXguRWNob05lc3RBUElSZXF1ZXN0O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvQWpheC5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgUGxheWxpc3QgPSByZXF1aXJlKCcuL1BsYXlsaXN0LmpzJyk7XG5cbi8qKlxuICogTW9kdWxlIGfDqXJhbnQgbCdpbnRlcmZhY2UgZ3JhcGhpcXVlXG4gKlxuICogQG1vZHVsZSBHVUlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBHVUkgPSB7XG4gIG5vdGlmQWxsb3dlZDogdHJ1ZSxcbiAgc291bmRBbGxvd2VkOiB0cnVlLFxuICBkdXBsaWNhdGVzQWxsb3dlZDogZmFsc2UsXG4gIHRlbXBvVmFyaWF0aW9uOiAwLjA1LFxuICBzZWxlY3RlZFNvcnRpbmc6IFwiZGVmYXVsdFwiLFxuICB0cmFja3NMb2FkZWQ6IGZhbHNlLFxuICB0cmFja1Bvc2l0aW9uOiAwLFxuICBjb250ZW50OiBbXSxcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgLy8gR2VzdGlvbiBkZXMgYW1iaWFuY2VzXG4gICAgLyogJCggXCIjbWFpblwiICkudmVnYXMoe1xuICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZScsXG4gICAgICAgIHNsaWRlOiAwLFxuICAgICAgICBzbGlkZXM6IFtcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvbmV1dHJhbC5qcGdcIiB9LFxuICAgICAgICAgICAgeyBzcmM6IFwiLi9pbWFnZXMvYmFja2dyb3VuZC9yb2NrLmpwZ1wiIH0sXG4gICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2VsZWN0cm8uanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvaGlwaG9wLmpwZ1wiIH0sXG4gICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2ZvbGsuanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvY2xhc3NpY2FsLmpwZ1wiIH0sXG4gICAgICAgICAgICB7IHNyYzogXCIuL2ltYWdlcy9iYWNrZ3JvdW5kL2phenouanBnXCIgfSxcbiAgICAgICAgICAgIHsgc3JjOiBcIi4vaW1hZ2VzL2JhY2tncm91bmQvbWV0YWwuanBnXCIgfVxuICAgICAgICBdLFxuICAgICAgICBhbmltYXRpb246ICdrZW5idXJucycsXG4gICAgICAgIHdhbGs6IGZ1bmN0aW9uIChpbmRleCwgc2xpZGVTZXR0aW5ncykge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2xpZGUgaW5kZXggXCIgKyBpbmRleCArIFwiIGltYWdlIFwiICsgc2xpZGVTZXR0aW5ncy5zcmMpO1xuICAgICAgICAgIGlmIChHVUkuc291bmRBbGxvd2VkICYmIGluZGV4ID4gMCkge1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKCBcIi4vc291bmRzL1wiICsgaW5kZXggKyBcIi5vZ2dcIik7XG4gICAgICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCggXCIjbWFpblwiICkudmVnYXMoJ3BhdXNlJyk7ICovXG5cbiAgICBHVUkuY2Fyb3VzZWwoKTtcbiAgICBHVUkuZHJhZygpO1xuICAgIEdVSS50b29sdGlwcygpO1xuICAgIEdVSS5zY3JvbGxiYXIoKTtcbiAgICBHVUkuY3NzKCk7XG4gICAgR1VJLmNoZWNrYm94ZXMoKTtcbiAgICBHVUkucG9wdXBzKCk7XG4gICAgR1VJLmxpc3RlbmVycygpO1xuXG4gICAgdmFyIHNhdmVkUGxheWxpc3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBsYXlsaXN0XCIpO1xuICAgIGlmIChzYXZlZFBsYXlsaXN0ICE9PSBudWxsKSB7XG4gICAgICBQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyA9IEpTT04ucGFyc2Uoc2F2ZWRQbGF5bGlzdCk7XG4gICAgfVxuXG4gIH0sXG4gIGNhcm91c2VsOiBmdW5jdGlvbigpIHtcbiAgICAkKCBcIiN0cmFja3NcIiApLm93bENhcm91c2VsKHtcbiAgICAgIGl0ZW1zOiAxMCxcbiAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgYXV0b1BsYXk6IHRydWUsXG4gICAgICBhdXRvcGxheVRpbWVvdXQ6IDEwMCxcbiAgICAgIHN0b3BPbkhvdmVyOiB0cnVlLFxuICAgICAgbGF6eUxvYWQgOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIGRyYWc6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiI2lwb2Qtd3JhcHBlclwiICkuZHJhZ2dhYmxlKHsgc2Nyb2xsOiBmYWxzZSB9KTtcbiAgfSxcbiAgdG9vbHRpcHM6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiW3RpdGxlICE9ICcnXVwiICkucXRpcCh7XG4gICAgICBzdHlsZToge1xuICAgICAgICAgIGNsYXNzZXM6ICdxdGlwLWRhcmsnXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHNjcm9sbGJhcjogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIjcGxheWxpc3QsICNmYXZvcml0ZXNcIiApLm1DdXN0b21TY3JvbGxiYXIoe1xuICAgICAgdGhlbWU6XCJkYXJrXCIsXG4gICAgICBzY3JvbGxJbmVydGlhOiAwXG4gICAgfSk7XG4gIH0sXG4gIGNzczogZnVuY3Rpb24oKSB7XG4gICAgJCggXCIucHVzaGVyXCIgKS5jc3MoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICB9LFxuICBjaGVja2JveGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiLnVpLmNoZWNrYm94XCIgKS5jaGVja2JveCgpO1xuICB9LFxuICBwb3B1cHM6IGZ1bmN0aW9uKCkge1xuICAgICQoIFwiI29wdGlvbnMgPiBzcGFuXCIgKS5wb3B1cCgpO1xuICB9LFxuICBtZW51OiB7XG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICQoIFwiI21lbnVcIiApLnNpZGViYXIoIFwidG9nZ2xlXCIgKTtcbiAgICB9LFxuICAgIHRvZ2dsZVBsYXlsaXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI3BsYXlsaXN0XCIsIFwiYmx1ZVwiICk7XG4gICAgfSxcbiAgICB0b2dnbGVGYXZvcml0ZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjZmF2b3JpdGVzXCIsIFwicmVkXCIgKTtcbiAgICB9LFxuICAgIHRvZ2dsZUF0bW9zcGhlcmVzOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI2F0bW9zcGhlcmVzXCIsIFwiZ3JlZW5cIiApO1xuICAgIH0sXG4gICAgdG9nZ2xlSGFybW9uaWNUcmFja3M6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjaGFybW9uaWMtdHJhY2tzXCIsIFwidmlvbGV0XCIgKTtcbiAgICB9LFxuICAgIHRvZ2dsZVVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLm1lbnUudG9nZ2xlU2lkZWJhciggXCIjdXNlclwiLCBcIm1hcm9vblwiICk7XG4gICAgfSxcbiAgICBsb2dpbjogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5nZXRMb2dpblN0YXR1cyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgXHRpZiAocmVzcG9uc2Uuc3RhdHVzICE9IFwiY29ubmVjdGVkXCIpIHsgLy8gU2kgbCd1dGlsaXNhdGV1ciBuJ2VzdCBwYXMgY29ubmVjdMOpXG4gICAgICAgICAgRFoubG9naW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gXCJjb25uZWN0ZWRcIikgeyAvLyBTaSB0b3V0IHNlIHBhc3NlIGJpZW5cbiAgICAgICAgICAgICAgRFouYXBpKFwiL3VzZXIvbWVcIiwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWltZ1wiICkuYXR0cih7IHNyYzpyZXNwb25zZS5waWN0dXJlX3NtYWxsLCBhbHQ6cmVzcG9uc2UubmFtZSB9KTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5hbWVcIiApLnRleHQoIHJlc3BvbnNlLm5hbWUgKS5hdHRyKCBcImhyZWZcIiwgcmVzcG9uc2UubGluayApO1xuICAgICAgICAgICAgICAgICQoIFwiI3VzZXItZW1haWxcIiApLnRleHQoIHJlc3BvbnNlLmVtYWlsICk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShyZXNwb25zZS5pbnNjcmlwdGlvbl9kYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBtID0gZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgICAgICAgICAgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWRhdGVcIiApLnRleHQoIFwiSW5zY3JpdCBsZSBcIiArIGQgKyBcIi9cIiArIG0gKyBcIi9cIiArIHkgKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLW5vdC1jb25uZWN0ZWRcIiApLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuc2hvdygpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYWxlcnRpZnkuc3VjY2VzcyhcIkNvbm5leGlvbiBPSyAhXCIsIDMpO1xuICAgICAgICAgICAgICBHVUkubWVudS50b2dnbGVTaWRlYmFyKCBcIiN1c2VyXCIsIFwibWFyb29uXCIgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFNpIGxhIGNvbm5leGlvbiDDqWNob3VlXG4gICAgICAgICAgICAgIGFsZXJ0aWZ5LmVycm9yKFwiQ29ubmV4aW9uIHJlZnVzw6llICFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgeyBwZXJtczogXCJiYXNpY19hY2Nlc3MsZW1haWxcIiB9KTtcbiAgICAgIFx0fVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBsb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoubG9nb3V0KCk7XG4gICAgICAkKCBcIiN1c2VyLWNvbm5lY3RlZFwiICkuaGlkZSgpO1xuICAgICAgJCggXCIjdXNlci1ub3QtY29ubmVjdGVkXCIgKS5zaG93KCk7XG4gICAgICBhbGVydGlmeS5zdWNjZXNzKFwiRMOpY29ubmV4aW9uIE9LICFcIiwgMyk7XG4gICAgICAkKCBcIiN1c2VyXCIgKS5zaWRlYmFyKCBcInRvZ2dsZVwiICk7XG4gICAgfSxcbiAgICB0b2dnbGVTaWRlYmFyOiBmdW5jdGlvbihpZCwgY29sb3IpIHtcbiAgICAgICQoIGlkIClcbiAgICAgICAgLnNpZGViYXIoe1xuICAgICAgICAgIG9uU2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCBpZCArIFwiLWJ0blwiICkuYWRkQ2xhc3MoIGNvbG9yICsgXCItaXRlbVwiICk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCggaWQgKyBcIi1idG5cIiApLnJlbW92ZUNsYXNzKCBjb2xvciArIFwiLWl0ZW1cIiApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnNpZGViYXIoIFwic2V0dGluZ1wiLCBcInRyYW5zaXRpb25cIiwgXCJvdmVybGF5XCIgKVxuICAgICAgICAuc2lkZWJhciggXCJ0b2dnbGVcIiApO1xuICAgIH0sXG4gICAgdG9nZ2xlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIE9uIGFmZmljaGUgbGUgbWVudSBkdSBiYXNcbiAgICAgIEdVSS5tZW51LnRvZ2dsZSgpO1xuICAgICAgLy8gT24gYWZmaWNoZSB0b3V0ZXMgbGVzIGF1dHJlcyBzaWRlYmFyc1xuICAgICAgdmFyIGNvbG9ycyA9IFtcImJsdWVcIiwgXCJyZWRcIiwgXCJncmVlblwiLCBcInZpb2xldFwiLCBcIm1hcm9vblwiXTtcbiAgICAgICQoIFwiLnNpZGViYXJcIiApLm5vdCggXCIjbWVudVwiICkuZWFjaChmdW5jdGlvbihpLCBlbHQpIHtcbiAgICAgICAgdmFyIGlkID0gJCggZWx0ICkuYXR0ciggXCJpZFwiICk7XG4gICAgICAgIEdVSS5tZW51LnRvZ2dsZVNpZGViYXIoIFwiI1wiICsgaWQsIGNvbG9yc1tpXSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHBsYXlsaXN0OiB7XG4gICAgbm90UmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5zZXRTaHVmZmxlKGZhbHNlKTtcbiAgICAgICQoIFwiI3JhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJhbmRvbVwiLCBcInJlbW92ZVwiICk7XG4gICAgICAkKCBcIiNyYW5kb20tYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwibm90LXJhbmRvbS1idG5cIiApO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkuZXJyb3IoXCJMZWN0dXJlIGFsw6lhdG9pcmUgZMOpc2FjdGl2w6llXCIsIDUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5zZXRTaHVmZmxlKHRydWUpO1xuICAgICAgJCggXCIjbm90LXJhbmRvbS1idG4gLmljb25cIiApLnN3aXRjaENsYXNzKCBcInJlbW92ZVwiLCBcInJhbmRvbVwiICk7XG4gICAgICAkKCBcIiNub3QtcmFuZG9tLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInJhbmRvbS1idG5cIiApO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkuc3VjY2VzcyhcIkxlY3R1cmUgYWzDqWF0b2lyZSBhY3RpdsOpZVwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG5vUmVwZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5zZXRSZXBlYXQoMCk7XG4gICAgICAkKCBcIiNyZXBlYXQtYWxsLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVmcmVzaFwiLCBcInJlbW92ZVwiICk7XG4gICAgICAkKCBcIiNyZXBlYXQtYWxsLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcIm5vLXJlcGVhdGJ0blwiICk7XG4gICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICBhbGVydGlmeS5tZXNzYWdlKFwiUGFzIGRlIHLDqXDDqXRpdGlvblwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcGVhdE9uZTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIuc2V0UmVwZWF0KDIpO1xuICAgICAgJCggXCIjbm8tcmVwZWF0LWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwicmVtb3ZlXCIsIFwicmVwZWF0XCIgKTtcbiAgICAgICQoIFwiI25vLXJlcGVhdC1idG5cIiApLmF0dHIoIFwiaWRcIiwgXCJyZXBlYXQtb25lLWJ0blwiICk7XG4gICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICBhbGVydGlmeS5tZXNzYWdlKFwiUsOpcMOpdGl0aW9uIGR1IG1vcmNlYXUgZW4gY291cnNcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXBlYXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoucGxheWVyLnNldFJlcGVhdCgxKTtcbiAgICAgICQoIFwiI3JlcGVhdC1vbmUtYnRuIC5pY29uXCIgKS5zd2l0Y2hDbGFzcyggXCJyZXBlYXRcIiwgXCJyZWZyZXNoXCIgKTtcbiAgICAgICQoIFwiI3JlcGVhdC1vbmUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwicmVwZWF0LWFsbC1idG5cIiApO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkubWVzc2FnZShcIlLDqXDDqXRpdGlvbiBkZSB0b3VzIGxlcyBtb3JjZWF1eFwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoucGxheWVyLnNldE11dGUodHJ1ZSk7XG4gICAgICAkKCBcIiNtdXRlLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwibXV0ZVwiLCBcInVubXV0ZVwiICk7XG4gICAgICAkKCBcIiNtdXRlLWJ0blwiICkuYXR0ciggXCJpZFwiLCBcInVubXV0ZS1idG5cIiApO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkuZXJyb3IoXCJTb24gY291cMOpICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1bm11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgRFoucGxheWVyLnNldE11dGUoZmFsc2UpO1xuICAgICAgJCggXCIjdW5tdXRlLWJ0biAuaWNvblwiICkuc3dpdGNoQ2xhc3MoIFwidW5tdXRlXCIsIFwibXV0ZVwiICk7XG4gICAgICAkKCBcIiN1bm11dGUtYnRuXCIgKS5hdHRyKCBcImlkXCIsIFwibXV0ZS1idG5cIiApO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkuc3VjY2VzcyhcIlNvbiByw6l0YWJsaSAhXCIsIDUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGxheWxpc3QgPSBKU09OLnN0cmluZ2lmeShQbGF5bGlzdC5zZWxlY3RlZFRyYWNrcyk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBsYXlsaXN0XCIsIHBsYXlsaXN0KTtcbiAgICAgIGlmIChHVUkubm90aWZBbGxvd2VkKSB7XG4gICAgICAgIGFsZXJ0aWZ5LnN1Y2Nlc3MoXCJQbGF5bGlzdCBzYXV2ZWdhcmTDqWUgIVwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGV4cG9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAkKCBcIiNjc3YtZXhwb3J0XCIgKS50YWJsZVRvQ1NWKCk7XG4gICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICBhbGVydGlmeS5zdWNjZXNzKFwiUGxheWxpc3QgZXhwb3J0w6llICFcIiwgNSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgUGxheWxpc3Quc2VsZWN0ZWRUcmFja3MgPSBbXTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicGxheWxpc3RcIik7XG4gICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICBhbGVydGlmeS5zdWNjZXNzKFwiUGxheWxpc3QgZWZmYWPDqWUgIVwiLCA1KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgIERaLnBsYXllci5wcmV2KCk7XG4gICAgfSxcbiAgICBiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChHVUkudHJhY2tQb3NpdGlvbiA+IDEwKSB7XG4gICAgICAgIEdVSS50cmFja1Bvc2l0aW9uIC09IDEwO1xuICAgICAgfVxuICAgICAgRFoucGxheWVyLnNlZWsoR1VJLnRyYWNrUG9zaXRpb24pO1xuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoR1VJLnRyYWNrc0xvYWRlZCkge1xuICAgICAgICBEWi5wbGF5ZXIucGxheSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRFoucGxheWVyLnBsYXlUcmFja3MoUGxheWxpc3QudHJhY2tzSWRzKTtcbiAgICAgICAgR1VJLnRyYWNrc0xvYWRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIucGF1c2UoKTtcbiAgICB9LFxuICAgIGZvcnRoOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChHVUkudHJhY2tQb3NpdGlvbiA8IDkwKSB7XG4gICAgICAgIEdVSS50cmFja1Bvc2l0aW9uICs9IDEwO1xuICAgICAgfVxuICAgICAgRFoucGxheWVyLnNlZWsoR1VJLnRyYWNrUG9zaXRpb24pO1xuICAgIH0sXG4gICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICBEWi5wbGF5ZXIubmV4dCgpO1xuICAgIH1cbiAgfSxcbiAgZmF2b3JpdGVzOiB7XG4gICAgaXBvZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJGlwb2QgPSAkKCBcIiNpcG9kLXdyYXBwZXJcIiApLFxuICAgICAgICAgICRpcG9kU3RhdGUgPSAkKCBcIiNmYXYtaXBvZCAuc3RhdGVcIiApO1xuICAgICAgJGlwb2QuaXMoIFwiOnZpc2libGVcIiApID8gJGlwb2QuZmFkZU91dCgpIDogJGlwb2QuZmFkZUluKCk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmRpc3BsYXlNZXNzYWdlKCRpcG9kU3RhdGUsIFwiaVBvZCBhY3RpdsOpICFcIiwgXCJpUG9kIGTDqXNhY3RpdsOpICFcIik7XG4gICAgICBHVUkuZmF2b3JpdGVzLmNoYW5nZVN0YXRlKCRpcG9kU3RhdGUpO1xuICAgIH0sXG4gICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkbm90aWZTdGF0ZSA9ICQoIFwiI2Zhdi1ub3RpZnkgLnN0YXRlXCIgKTtcbiAgICAgIEdVSS5ub3RpZkFsbG93ZWQgPyAoR1VJLm5vdGlmQWxsb3dlZCA9IGZhbHNlKSA6IChHVUkubm90aWZBbGxvd2VkID0gdHJ1ZSk7XG4gICAgICBHVUkuZmF2b3JpdGVzLmRpc3BsYXlNZXNzYWdlKCRub3RpZlN0YXRlLCBcIk5vdGlmaWNhdGlvbnMgYWN0aXbDqWVzICFcIiwgXCJOb3RpZmljYXRpb25zIGTDqXNhY3RpdsOpZXMgIVwiKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJG5vdGlmU3RhdGUpO1xuICAgIH0sXG4gICAgc291bmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRzb3VuZFN0YXRlID0gJCggXCIjZmF2LXNvdW5kIC5zdGF0ZVwiICk7XG4gICAgICBHVUkuc291bmRBbGxvd2VkID8gKEdVSS5zb3VuZEFsbG93ZWQgPSBmYWxzZSkgOiAoR1VJLnNvdW5kQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5kaXNwbGF5TWVzc2FnZSgkc291bmRTdGF0ZSwgXCJTb25zIGQnYW1iaWFuY2UgYWN0aXbDqXMgIVwiLCBcIlNvbnMgZCdhbWJpYW5jZSBkw6lzYWN0aXbDqXMgIVwiKTtcbiAgICAgIEdVSS5mYXZvcml0ZXMuY2hhbmdlU3RhdGUoJHNvdW5kU3RhdGUpO1xuICAgIH0sXG4gICAgZHVwbGljYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkZHVwbGljYXRlU3RhdGUgPSAkKCBcIiNmYXYtZHVwbGljYXRlIC5zdGF0ZVwiICk7XG4gICAgICBHVUkuZHVwbGljYXRlc0FsbG93ZWQgPyAoR1VJLmR1cGxpY2F0ZXNBbGxvd2VkID0gZmFsc2UpIDogKEdVSS5kdXBsaWNhdGVzQWxsb3dlZCA9IHRydWUpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5kaXNwbGF5TWVzc2FnZSgkZHVwbGljYXRlU3RhdGUsIFwiRG91YmxvbnMgYWN0aXbDqXMgIVwiLCBcIkRvdWJsb25zIGTDqXNhY3RpdsOpcyAhXCIpO1xuICAgICAgR1VJLmZhdm9yaXRlcy5jaGFuZ2VTdGF0ZSgkZHVwbGljYXRlU3RhdGUpO1xuICAgIH0sXG4gICAgY2hhbmdlU3RhdGU6IGZ1bmN0aW9uKCRzdGF0ZSkge1xuICAgICAgaWYgKCRzdGF0ZS52YWwoKSA9PSBcImFjdGl2YXRlZFwiKSB7XG4gICAgICAgICRzdGF0ZS52YWwoIFwiZGVhY3RpdmF0ZWRcIiApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHN0YXRlLnZhbCggXCJhY3RpdmF0ZWRcIiApO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGlzcGxheU1lc3NhZ2U6IGZ1bmN0aW9uKCRzdGF0ZSwgcG9zaXRpdmVNZXNzYWdlLCBuZWdhdGl2ZU1lc3NhZ2UpIHtcbiAgICAgIGlmIChHVUkubm90aWZBbGxvd2VkKSB7XG4gICAgICAgIGlmICgkc3RhdGUudmFsKCkgPT0gXCJhY3RpdmF0ZWRcIikge1xuICAgICAgICAgIGFsZXJ0aWZ5LmVycm9yKG5lZ2F0aXZlTWVzc2FnZSwgNSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnRpZnkuc3VjY2Vzcyhwb3NpdGl2ZU1lc3NhZ2UsIDUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZW1wb1JhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZW1wb1ZhcmlhdGlvbiA9ICQoIFwiaW5wdXRbdHlwZT0ncmFuZ2UnXVwiICkudmFsKCk7XG4gICAgICAkKCBcImlucHV0W3R5cGU9J3JhbmdlJ10gKyBzcGFuXCIgKS50ZXh0KCB0ZW1wb1ZhcmlhdGlvbiArIFwiICVcIiApO1xuICAgICAgR1VJLnRlbXBvVmFyaWF0aW9uID0gKHRlbXBvVmFyaWF0aW9uIC8gMTAwKTtcbiAgICB9LFxuICAgIGRlZmF1bHRTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImRlZmF1bHRcIjtcbiAgICB9LFxuICAgIHRlbXBvU29ydGluZzogZnVuY3Rpb24oKSB7XG4gICAgICBHVUkuc2VsZWN0ZWRTb3J0aW5nID0gXCJ0ZW1wb0ZpcnN0XCI7XG4gICAgfSxcbiAgICBrZXlTb3J0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIEdVSS5zZWxlY3RlZFNvcnRpbmcgPSBcImtleUZpcnN0XCI7XG4gICAgfSxcbiAgICBhc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiYXNjVGVtcG9cIjtcbiAgICB9LFxuICAgIGRlc2NUZW1wb1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwiZGVzY1RlbXBvXCI7XG4gICAgfSxcbiAgICBub1NvcnRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgR1VJLnNlbGVjdGVkU29ydGluZyA9IFwibm9uZVwiO1xuICAgIH1cbiAgfSxcbiAgLyogYXRtb3NwaGVyZXM6IHtcbiAgICBhcHBseUF0bW9zcGhlcmU6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAkKCBcIiNtYWluXCIgKS52ZWdhcyggXCJqdW1wXCIsIGluZGV4ICk7XG4gICAgfVxuICB9LCAqL1xuICBldmVudHM6IHtcbiAgICBsb2dvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcbiAgICAgIHByZS5zdHlsZS5tYXhIZWlnaHQgPSBcIjQwMHB4XCI7XG4gICAgICBwcmUuc3R5bGUub3ZlcmZsb3dXcmFwID0gXCJicmVhay13b3JkXCI7XG4gICAgICBwcmUuc3R5bGUubWFyZ2luID0gXCItMTZweCAtMTZweCAtMTZweCAwXCI7XG4gICAgICBwcmUuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiMjRweFwiO1xuICAgICAgcHJlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCQoJyNhYm91dCcpLnRleHQoKSkpO1xuICAgICAgYWxlcnRpZnkuY29uZmlybShwcmUsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGFsZXJ0aWZ5LnN1Y2Nlc3MoJ0FjY2VwdGVkJyk7XG4gICAgICAgICAgfSxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBhbGVydGlmeS5lcnJvcignRGVjbGluZWQnKTtcbiAgICAgICAgICB9KS5zZXR0aW5nKCdsYWJlbHMnLHsnb2snOidBY2NlcHQnLCAnY2FuY2VsJzogJ0RlY2xpbmUnfSk7XG5cbiAgICB9LFxuICAgIHNob3dJbmZvUG9wdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgJCggXCIudWkubW9kYWxcIiApLm1vZGFsKCBcInNob3dcIiApO1xuICAgIH0sXG4gICAgYWRkVHJhY2tUb1BsYXlsaXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0cmFjayA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KCQoIHRoaXMgKS5jaGlsZHJlbigpLmVxKDEpLnZhbCgpKSk7XG4gICAgICBQbGF5bGlzdC5hZGRUcmFja1RvUGxheWxpc3QodHJhY2spO1xuICAgICAgR1VJLnRyYWNrc0xvYWRlZCA9IGZhbHNlO1xuICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgYWxlcnRpZnkuc3VjY2VzcyhcIk1vcmNlYXUgYWpvdXTDqSDDoCB2b3RyZSBwbGF5bGlzdFwiLCA1KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGxpc3RlbmVyczogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBzaWRlYmFyc1xuICAgIHZhciBtZW51RXZlbnRzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1tZW51XCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNwbGF5bGlzdC1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVQbGF5bGlzdF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2b3JpdGVzLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5tZW51LnRvZ2dsZUZhdm9yaXRlc10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjYXRtb3NwaGVyZXMtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLm1lbnUudG9nZ2xlQXRtb3NwaGVyZXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2hhcm1vbmljLXRyYWNrcy1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVIYXJtb25pY1RyYWNrc10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCIjdXNlci1idG5cIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVVc2VyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dpblwiLCBcImNsaWNrXCIsIEdVSS5tZW51LmxvZ2luXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvdXRcIiwgXCJjbGlja1wiLCBHVUkubWVudS5sb2dvdXRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnRvZ2dsZS1hbGxcIiwgXCJjbGlja1wiLCBHVUkubWVudS50b2dnbGVBbGxdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIGFkZEV2ZW50cyhtZW51RXZlbnRzKTtcblxuICAgIC8vIMOJY291dGV1cnMgZCfDqXbDqW5lbWVudHMgZGUgbGEgcGxheWxpc3RcbiAgICB2YXIgcGxheWxpc3RFdmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI25vdC1yYW5kb20tYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnJhbmRvbSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjcmFuZG9tLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5ub3RSYW5kb20sIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI25vLXJlcGVhdC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucmVwZWF0T25lLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNyZXBlYXQtb25lLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5yZXBlYXRBbGwsIFwiYXN5bmNcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI3JlcGVhdC1hbGwtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5vUmVwZWF0LCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNtdXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5tdXRlLCBcImFzeW5jXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN1bm11dGUtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0LnVubXV0ZSwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjc2F2ZS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3Quc2F2ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2V4cG9ydC1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QuZXhwb3J0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZGVsZXRlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5kZWxldGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5wcmV2aW91cy1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucHJldmlvdXNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5iYWNrLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5iYWNrXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIucGxheS1idG5cIiwgXCJjbGlja1wiLCBHVUkucGxheWxpc3QucGxheV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLnBhdXNlLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5wYXVzZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLmZvcnRoLWJ0blwiLCBcImNsaWNrXCIsIEdVSS5wbGF5bGlzdC5mb3J0aF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiLm5leHQtYnRuXCIsIFwiY2xpY2tcIiwgR1VJLnBsYXlsaXN0Lm5leHRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIGFkZEV2ZW50cyhwbGF5bGlzdEV2ZW50cyk7XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRlcyBmYXZvcmlzXG4gICAgdmFyIGZhdm9yaXRlc0V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtaXBvZFwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuaXBvZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LW5vdGlmeVwiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMubm90aWZ5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtc291bmRcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLnNvdW5kXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNmYXYtZHVwbGljYXRlXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5kdXBsaWNhdGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1yYW5nZVwiLCBcImlucHV0XCIsIEdVSS5mYXZvcml0ZXMudGVtcG9SYW5nZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWRlZmF1bHQtc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMuZGVmYXVsdFNvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy50ZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1rZXktc29ydGluZ1wiLCBcImNsaWNrXCIsIEdVSS5mYXZvcml0ZXMua2V5U29ydGluZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXCIjZmF2LWFzYy10ZW1wby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5hc2NUZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1kZXNjLXRlbXBvLXNvcnRpbmdcIiwgXCJjbGlja1wiLCBHVUkuZmF2b3JpdGVzLmRlc2NUZW1wb1NvcnRpbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1wiI2Zhdi1uby1zb3J0aW5nXCIsIFwiY2xpY2tcIiwgR1VJLmZhdm9yaXRlcy5ub1NvcnRpbmddXG4gICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIGFkZEV2ZW50cyhmYXZvcml0ZXNFdmVudHMpO1xuXG4gICAgLy8gw4ljb3V0ZXVycyBkJ8OpdsOpbmVtZW50cyBkZXMgYW1iaWFuY2VzXG4gICAgdmFyIGF0bW9zcGhlcmVzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIjbmV1dHJhbC1hdG1vXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNyb2NrLWF0bW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI2VsZWN0cm8tYXRtb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjaGlwaG9wLWF0bW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI2ZvbGstYXRtb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjY2xhc3NpY2FsLWF0bW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI2phenotYXRtb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjbWV0YWwtYXRtb1wiXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICQoIFwiI2F0bW9zcGhlcmVzIC5pdGVtXCIgKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG5cbiAgICAgIHZhciBpZCA9ICQoIHRoaXMgKS5hdHRyKCBcImlkXCIgKSxcbiAgICAgICAgICBuYW1lID0gaWQuc3Vic3RyaW5nKDAsIGlkLmluZGV4T2YoXCItXCIpKTtcblxuICAgICAgJCggZWxlbWVudCApLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCB0aGlzICkuYWRkQ2xhc3MoIFwiZ3JlZW4taXRlbVwiICk7XG4gICAgICAgICQoIHRoaXMgKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCBcImdyZWVuLWl0ZW1cIiApO1xuICAgICAgICAvLyBHVUkuYXRtb3NwaGVyZXMuYXBwbHlBdG1vc3BoZXJlKGluZGV4KTtcbiAgICAgICAgJCggXCIucHVzaGVyXCIgKS5hdHRyKCBcInN0eWxlXCIsIFwiYmFja2dyb3VuZDp1cmwoJ2ltYWdlcy9iYWNrZ3JvdW5kL1wiICsgbmFtZSArIFwiLmpwZycpIG5vLXJlcGVhdCBjZW50ZXIgY2VudGVyIGZpeGVkICFpbXBvcnRhbnRcIiApO1xuICAgICAgICBpZiAoR1VJLnNvdW5kQWxsb3dlZCAmJiBuYW1lICE9IFwibmV1dHJhbFwiKSB7XG4gICAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKCBcIi4vc291bmRzL1wiICsgbmFtZSArIFwiLm9nZ1wiKTtcbiAgICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICAvLyDDiWNvdXRldXJzIGQnw6l2w6luZW1lbnRzIGRpdmVyc1xuICAgIHZhciBvdGhlckV2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiNsb2dvXCIsIFwiY2xpY2tcIiwgR1VJLmV2ZW50cy5sb2dvXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIiN0cmFja3MtaGVscFwiLCBcImNsaWNrXCIsIEdVSS5ldmVudHMuc2hvd0luZm9Qb3B1cCwgXCJhc3luY1wiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIi5oYXJtb25pYy10cmFja1wiLCBcImNsaWNrXCIsIEdVSS5ldmVudHMuYWRkVHJhY2tUb1BsYXlsaXN0LCBcImFzeW5jXCJdXG4gICAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgIGFkZEV2ZW50cyhvdGhlckV2ZW50cyk7XG5cbiAgICAvLyBGb25jdGlvbnMgZCdham91dCBkJ8OpdsOpbmVtZW50c1xuICAgIGZ1bmN0aW9uIGFkZEV2ZW50cyhlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVbaV1bM10gPT0gXCJhc3luY1wiKSB7XG4gICAgICAgICAgJCggZG9jdW1lbnQgKS5vbiggZVtpXVsxXSwgZVtpXVswXSwgZVtpXVsyXSk7IC8vIGTDqWzDqWdhdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoIGVbaV1bMF0gKS5vbiggZVtpXVsxXSwgZVtpXVsyXSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL0dVSS5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIENsYXNzZSBtZXR0YW50IGVuIMWTdXZyZSBsZSBwYXR0ZXJuIEl0ZXJhdG9yLlxuICogQ2V0dGUgY2xhc3NlIGZvdXJuaXQgdW4gbW95ZW4gZCdpdMOpcmVyIHBsdXMgc2ltcGxlbWVudCBzdXIgbGVzIGNvbGxlY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgSXRlcmF0b3JcbiAqIEBjbGFzcyBJdGVyYXRvclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtcyBDb2xsZWN0aW9uIGQnb2JqZXRzIMOgIHBhcmNvdXJpclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yID0gZnVuY3Rpb24oaXRlbXMpIHtcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSXRlcmF0b3IpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEl0ZXJhdG9yIGRvaXQgw6p0cmUgaW5zdGFuY2nDqWUgYXZlYyBsJ29ww6lyYXRldXIgwqsgbmV3IMK7XCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IGRlIGJhc2Ugw6AgcGFydGlyIGR1cXVlbCBjb21tZW5jZSB1bmUgaXTDqXJhdGlvbi5cbiAgICpcbiAgICogQHByb3BlcnR5IGluZGV4XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRoaXMuX2luZGV4ID0gMDtcblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBkJ29iamV0cyDDoCBwYXJjb3VyaXIuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBpdGVtc1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqIEBkZWZhdWx0IFtdXG4gICAqL1xuICB0aGlzLl9pdGVtcyA9IGl0ZW1zO1xufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgbCdJdGVyYXRvclxuICovXG5JdGVyYXRvci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBNw6l0aG9kZSB2w6lyaWZpYW50IHMnaWwgeSBhIHVuIMOpbMOpbWVudCBzdWl2YW50IGRhbnMgbGEgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBoYXNOZXh0XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFZyYWkgcydpbCB5IGEgdW4gw6lsw6ltZW50IHN1aXZhbnRcbiAgICovXG4gIGhhc05leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgfSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIHJlbnZveWFudCBsJ8OpbMOpbWVudCBjb3VyYW50IGxvcnMgZGUgbCdpdMOpcmF0aW9uLlxuICAgKiBMJ2luZGV4IGVzdCBwYXIgYWlsbGV1cnMgaW5jcsOpbWVudMOpIHBvdXIgY29udGludWVyIGxlIHBhcmNvdXJzLlxuICAgKlxuICAgKiBAbWV0aG9kIG5leHRcbiAgICogQHJldHVybiB7T2JqZWN0fSBMJ29iamV0IGNvdXJhbnQgZGUgbGEgY29sbGVjdGlvblxuICAgKi9cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zW3RoaXMuX2luZGV4KytdO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvSXRlcmF0b3IuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBNb2R1bGUgZm91cm5pc3NhbnQgZGVzIGVudGl0w6lzIHJlbGF0aXZlcyDDoCBsYSBtdXNpcXVlLlxuICpcbiAqIEBtb2R1bGUgTXVzaWNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBNdXNpYyA9IHtcbiAgLyoqXG4gICAqIENsYXNzZSBkw6lmaW5pc3NhbnQgdW4gbW9yY2VhdSBkZSBtdXNpcXVlLlxuICAgKlxuICAgKiBAY2xhc3MgVHJhY2tcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZCBJZGVudGlmaWFudCBEZWV6ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRpdHJlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhcnRpc3QgQXJ0aXN0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY292ZXIgUG9jaGV0dGUgZCdhbGJ1bVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRvbmFsaXTDqVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kZSBNb2RlIChtYWpldXIgb3UgbWluZXVyKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGVtcG8gVGVtcG8gKGVuIEJQTSlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNhbWVsb3RUYWcgVGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKiBAcGFyYW0ge0FycmF5fSBoYXJtb25pZXMgVGFncyBjb21wYXRpYmxlcyBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqL1xuICBUcmFjazogZnVuY3Rpb24oaWQsIHRpdGxlLCBhcnRpc3QsIGNvdmVyLCBrZXksIG1vZGUsIHRlbXBvLCBjYW1lbG90VGFnLCBoYXJtb25pZXMpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5UcmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycmV1ciAhIExhIGNsYXNzZSBUcmFjayBkb2l0IMOqdHJlIGluc3RhbmNpw6llIGF2ZWMgbCdvcMOpcmF0ZXVyIMKrIG5ldyDCu1wiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZGVudGlmaWFudCBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBkZWZhdWx0IDBcbiAgICAgKi9cbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIC8qKlxuICAgICAqIFRpdHJlIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfdGl0bGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl90aXRsZSA9IHRpdGxlO1xuICAgIC8qKlxuICAgICAqIEFydGlzdGUgw6AgbCdvcmlnaW5lIGR1IG1vcmNlYXVcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfYXJ0aXN0XG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fYXJ0aXN0ID0gYXJ0aXN0O1xuICAgIC8qKlxuICAgICAqIFBvY2hldHRlIGQnYWxidW1cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfY292ZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jb3ZlciA9IGNvdmVyO1xuICAgIC8qKlxuICAgICAqIFRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2tleVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgXCJcIlxuICAgICAqL1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICAvKipcbiAgICAgKiBNb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX21vZGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlID0gbW9kZTtcbiAgICAvKipcbiAgICAgKiBUZW1wbyBkdSBtb3JjZWF1IChlbiBCUE0pXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCBcIlwiXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG8gPSB0ZW1wbztcbiAgICAvKipcbiAgICAgKiBUYWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX2NhbWVsb3RUYWdcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBkZWZhdWx0IFwiXCJcbiAgICAgKi9cbiAgICB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZztcbiAgICAvKipcbiAgICAgKiBUYWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaGFybW9uaWVzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICovXG4gICAgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzO1xuXG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZMOpZmluaXNzYW50IHVuZSBoYXJtb25pZSBtdXNpY2FsZS5cbiAgICpcbiAgICogQGNsYXNzIEhhcm1vbnlcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFjayBVbiBvYmpldCBtb3JjZWF1IChUcmFjaylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRlbXBvVmFyaWF0aW9uIFZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQWN0aXZlIEwnaGFybW9uaWUgZXN0LWVsbGUgZWZmZWN0aXZlID9cbiAgICovXG4gIEhhcm1vbnk6IGZ1bmN0aW9uKHRyYWNrLCB0ZW1wb1ZhcmlhdGlvbiwgaXNBY3RpdmUpIHtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNdXNpYy5IYXJtb255KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyZXVyICEgTGEgY2xhc3NlIEhhcm1vbnkgZG9pdCDDqnRyZSBpbnN0YW5jacOpZSBhdmVjIGwnb3DDqXJhdGV1ciDCqyBuZXcgwrtcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqXG4gICAgICogQHByb3BlcnR5IF90cmFja1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQge31cbiAgICAgKi9cbiAgICB0aGlzLl90cmFjayA9IHRyYWNrLFxuICAgIC8qKlxuICAgICAqIFZhcmlhdGlvbiBkdSB0ZW1wbyBwYXIgcmFwcG9ydCDDoCB1biBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgX3RlbXBvVmFyaWF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAZGVmYXVsdCAwXG4gICAgICovXG4gICAgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbixcbiAgICAvKipcbiAgICAgKiBCb29sw6llbiB2w6lyaWZpYW50IHNpIGwnaGFybW9uaWUgZXN0IGVmZmVjdGl2ZSBvdSBub25cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSBfaXNBY3RpdmVcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuX2lzQWN0aXZlID0gaXNBY3RpdmUsXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1pbmltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtaW5pbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpIC0gKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgY2FsY3VsYW50IGxlIHRlbXBvIG1heGltYWwgYXUgcmVnYXJkIGRlIGxhIHZhcmlhdGlvbiBhdXRvcmlzw6llXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHRlbXBvTWF4XG4gICAgICogQHJldHVybiB7TnVtYmVyfSBMZSB0ZW1wbyBtYXhpbWFsXG4gICAgICovXG4gICAgdGhpcy50ZW1wb01heCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0cmFjay5nZXRUZW1wbygpICsgKHRyYWNrLmdldFRlbXBvKCkgKiB0aGlzLl90ZW1wb1ZhcmlhdGlvbikpO1xuICAgIH07XG5cbiAgfVxuXG59O1xuXG4vKipcbiAqIFByb3RvdHlwZSBkZSBUcmFja1xuICovXG5NdXNpYy5UcmFjay5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsJ2lkZW50aWZpYW50IGR1IG1vcmNlYXVcbiAgICpcbiAgICogQG1ldGhvZCBnZXRJZFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEwnaWQgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldElkOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2lkOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIGdldFRpdGxlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIGdldFRpdGxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RpdGxlOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0aXRyZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGl0bGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgdGl0cmUgZHUgbW9yY2VhdVxuICAgKi9cbiAgIHNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyB0aGlzLl90aXRsZSA9IHRpdGxlOyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QXJ0aXN0XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqL1xuICAgZ2V0QXJ0aXN0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FydGlzdDsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhcnRpc3RlIMOgIGwnb3JpZ2luZSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0QXJ0aXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMZSBub3V2ZWwgYXJ0aXN0ZSBkdSBtb3JjZWF1XG4gICAqL1xuICBzZXRBcnRpc3Q6IGZ1bmN0aW9uKGFydGlzdCkgeyB0aGlzLl9hcnRpc3QgPSBhcnRpc3Q7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q292ZXJcbiAgICogQHJldHVybiB7U3RyaW5nfSBMYSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBnZXRDb3ZlcjogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jb3ZlcjsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGEgcG9jaGV0dGUgZCdhbGJ1bVxuICAgKlxuICAgKiBAbWV0aG9kIHNldENvdmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSBwb2NoZXR0ZSBkJ2FsYnVtXG4gICAqL1xuICBzZXRDb3ZlcjogZnVuY3Rpb24oY292ZXIpIHsgdGhpcy5fY292ZXIgPSBjb3ZlcjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0S2V5XG4gICAqIEByZXR1cm4ge1N0cmluZ30gTGEgdG9uYWxpdMOpIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldEtleTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9rZXk7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHRvbmFsaXTDqSBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0S2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBMYSBub3V2ZWxsZSB0b25hbGl0w6kgZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0S2V5OiBmdW5jdGlvbihrZXkpIHsgdGhpcy5fa2V5ID0ga2V5OyB9LFxuICAvKipcbiAgICogQWNjZXNzZXVyIHBvdXIgbGUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKlxuICAgKiBAbWV0aG9kIGdldE1vZGVcbiAgICogQHJldHVybiB7U3RyaW5nfSBMZSBtb2RlIGR1IG1vcmNlYXUgKG1hamV1ciBvdSBtaW5ldXIpXG4gICAqL1xuICBnZXRNb2RlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX21vZGU7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIG1vZGUgZHUgbW9yY2VhdVxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1vZGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IExlIG5vdXZlYXUgbW9kZSBkdSBtb3JjZWF1IChtYWpldXIgb3UgbWluZXVyKVxuICAgKi9cbiAgc2V0TW9kZTogZnVuY3Rpb24obW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZTsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIHRlbXBvIGR1IG1vcmNlYXUgKGVuIEJQTSlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExlIHRlbXBvIGR1IG1vcmNlYXVcbiAgICovXG4gIGdldFRlbXBvOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RlbXBvOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSB0ZW1wbyBkdSBtb3JjZWF1XG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VGVtcG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGVtcG8gZHUgbW9yY2VhdVxuICAgKi9cbiAgc2V0VGVtcG86IGZ1bmN0aW9uKHRlbXBvKSB7IHRoaXMuX3RlbXBvID0gdGVtcG87IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsZSB0YWcgZHUgbW9yY2VhdSBzdXIgbGEgcm91ZSBkZSBDYW1lbG90XG4gICAqXG4gICAqIEBtZXRob2QgZ2V0Q2FtZWxvdFRhZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9IExlIHRhZyBkdSBtb3JjZWF1IHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldENhbWVsb3RUYWc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbGUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKlxuICAgKiBAbWV0aG9kIHNldENhbWVsb3RUYWdcbiAgICogQHBhcmFtIHtOdW1iZXJ9IExlIG5vdXZlYXUgdGFnIGR1IG1vcmNlYXUgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0Q2FtZWxvdFRhZzogZnVuY3Rpb24oY2FtZWxvdFRhZykgeyB0aGlzLl9jYW1lbG90VGFnID0gY2FtZWxvdFRhZzsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBnZXRIYXJtb25pZXNcbiAgICogQHJldHVybiB7QXJyYXl9IExlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICovXG4gIGdldEhhcm1vbmllczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9oYXJtb25pZXM7IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxlcyB0YWdzIGNvbXBhdGlibGVzIHN1ciBsYSByb3VlIGRlIENhbWVsb3RcbiAgICpcbiAgICogQG1ldGhvZCBzZXRIYXJtb25pZXNcbiAgICogQHBhcmFtIHtBcnJheX0gTGVzIG5vdXZlYXV4IHRhZ3MgY29tcGF0aWJsZXMgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdFxuICAgKi9cbiAgc2V0SGFybW9uaWVzOiBmdW5jdGlvbihoYXJtb25pZXMpIHsgdGhpcy5faGFybW9uaWVzID0gaGFybW9uaWVzOyB9LFxufTtcblxuLyoqXG4gKiBQcm90b3R5cGUgZGUgSGFybW9ueVxuICovXG5NdXNpYy5IYXJtb255LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGxlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICpcbiAgICogQG1ldGhvZCBnZXRUcmFja1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IExlIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICovXG4gIGdldFRyYWNrOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3RyYWNrOyB9LFxuICAvKipcbiAgICogTXV0YXRldXIgcG91ciBsZSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0VHJhY2tcbiAgICogQHBhcmFtIHtPYmplY3R9IExlIG5vdXZlYXUgbW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgKi9cbiAgc2V0VHJhY2s6IGZ1bmN0aW9uKHRyYWNrKSB7IHRoaXMuX3RyYWNrID0gdHJhY2s7IH0sXG4gIC8qKlxuICAgKiBBY2Nlc3NldXIgcG91ciBsYSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICpcbiAgICogQG1ldGhvZCBnZXRUZW1wb1ZhcmlhdGlvblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IExhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKi9cbiAgZ2V0VGVtcG9WYXJpYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fdGVtcG9WYXJpYXRpb247IH0sXG4gIC8qKlxuICAgKiBNdXRhdGV1ciBwb3VyIGxhIHZhcmlhdGlvbiBkdSB0ZW1wb1xuICAgKlxuICAgKiBAbWV0aG9kIHNldFRlbXBvVmFyaWF0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBMYSBub3V2ZWxsZSB2YXJpYXRpb24gZHUgdGVtcG9cbiAgICovXG4gICBzZXRUZW1wb1ZhcmlhdGlvbjogZnVuY3Rpb24odGVtcG9WYXJpYXRpb24pIHsgdGhpcy5fdGVtcG9WYXJpYXRpb24gPSB0ZW1wb1ZhcmlhdGlvbjsgfSxcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIHNhdm9pciBzaSBsJ2hhcm1vbmllIGVzdCBlZmZlY3RpdmUgb3Ugbm9uXG4gICAqXG4gICAqIEBtZXRob2QgaXNBY3RpdmVcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVnJhaSBvdSBmYXV4XG4gICAqL1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9pc0FjdGl2ZTsgfVxufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIrN1pKcDBcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi9tb2R1bGVzL011c2ljLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBwbGF5ZXIsXG4gICAgICBjb25zdHJ1Y3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24odHJhY2tzKSB7XG4gICAgICAgICAgRFouaW5pdCh7XG4gICAgICAgICAgICAgIGFwcElkOiAnMTY5NzExJyxcbiAgICAgICAgICAgICAgY2hhbm5lbFVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcHAnLFxuICAgICAgICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICdwbGF5ZXInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogJ3NxdWFyZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICByZXR1cm4gbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2V0UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocGxheWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGxheWVyID0gbmV3IGNvbnN0cnVjdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9O1xuICB9O1xuXG59KSgpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvUGxheWVyLmpzXCIsXCIvLi4vbW9kdWxlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gUGxheWxpc3QgPSBuZXcgVnVlKHtcbiAgICBlbDogXCIjYXBwXCIsXG4gICAgZGF0YToge1xuICAgICAgdHJhY2tzSWRzOiBbXSxcbiAgICAgIHNlbGVjdGVkVHJhY2tzOiBbXVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgYWRkVHJhY2tUb1BsYXlsaXN0OiBmdW5jdGlvbih0cmFjaykge1xuICAgICAgICB0aGlzLnRyYWNrc0lkcy5wdXNoKHRyYWNrLl9pZCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUcmFja3MucHVzaCh0cmFjayk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlVHJhY2tGcm9tUGxheWxpc3Q6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdGhpcy50cmFja3NJZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkVHJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIH0sXG4gICAgICB0ZXN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUYXRhXCIpO1xuICAgICAgfVxuICAgIH1cbn0pO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvUGxheWxpc3QuanNcIixcIi8uLi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBDbGFzc2UgbWV0dGFudCBlbiDFk3V2cmUgbGUgcGF0dGVybiBTdHJhdGVneS5cbiAqIENldHRlIGNsYXNzZSBmb3Vybml0IHVuIG1veWVuIGQnZW5jYXBzdWxlciB1bmUgc8OpcmllIGQnYWxnb3JpdGhtZXMgZGUgdHJpLlxuICpcbiAqIEBtb2R1bGUgU29ydGluZ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRpbmcgPSB7XG4gIC8qKlxuICAgKiBDbGFzc2UgZ8OpbsOpcmlxdWUgcmVwcsOpc2VudGFudCBsYSBzdHJhdMOpZ2llIGRlIHRyaVxuICAgKlxuICAgKiBAY2xhc3MgU3RyYXRlZ3lcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBTdHJhdGVneTogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogQWxnb3JpdGhtZSBkZSB0cmkgY291cmFudFxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGFsZ29yaXRobVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlZmF1bHQgdW5kZWZpbmVkXG4gICAgICovXG4gICAgdGhpcy5fYWxnb3JpdGhtO1xuICB9LFxuICAvKipcbiAgICogQ2xhc3NlIGVuY2Fwc3VsYW50IGwnYWxnb3JpdGhtZSBkZSB0cmkgcGFyIGTDqWZhdXQuXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbyBvdSAoWE9SKSBlbiB0b25hbGl0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgRGVmYXVsdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSBwYXIgZMOpZmF1dFxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciBuYlBlcmZlY3RNYXRjaGVzID0gMCwgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqVxuICAgICAgICAgIGFydGlzdHMgPSBbXSwgLy8gVG91cyBsZXMgYXJ0aXN0ZXMgcmVuY29udHLDqXMgZGFucyBsZXMgcsOpc3VsdGF0c1xuICAgICAgICAgIHRyYWNrcyA9IFtdLCAvLyBMZXMgbW9yY2VhdXggw6AgcmVudm95ZXIgw6AgbCdpc3N1ZSBkdSB0cmlcbiAgICAgICAgICByZWFycmFuZ2UgPSBmdW5jdGlvbihyZW1vdmVJbmRleCwgaW5zZXJ0SW5kZXgsIHRyYWNrKSB7XG4gICAgICAgICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShyZW1vdmVJbmRleCwgMSk7XG4gICAgICAgICAgICBzaW1pbGFyVHJhY2tzLnNwbGljZShpbnNlcnRJbmRleCwgMCwgdHJhY2spO1xuICAgICAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2ltaWxhclRyYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpLFxuICAgICAgICAgICAgdGVtcG8gPSB0cmFjay5nZXRUZW1wbygpLFxuICAgICAgICAgICAgdGVtcG9NaW4gPSBoYXJtb255LnRlbXBvTWluKCksXG4gICAgICAgICAgICB0ZW1wb01heCA9IGhhcm1vbnkudGVtcG9NYXgoKSxcbiAgICAgICAgICAgIGlzTWF0Y2hpbmcgPSAoJC5pbkFycmF5KHRyYWNrLmdldENhbWVsb3RUYWcoKSwgcmVmVHJhY2suZ2V0SGFybW9uaWVzKCkpICE9IC0xKTtcblxuICAgICAgICAvLyBTaSB1biBtb3JjZWF1IHJlbXBsaXQgdG91dGVzIGxlcyBjb25kaXRpb25zIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIGlmICh0ZW1wbyA+PSB0ZW1wb01pbiAmJiB0ZW1wbyA8PSB0ZW1wb01heCAmJiBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICBuYlBlcmZlY3RNYXRjaGVzKys7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGVuIGTDqWJ1dCBkZSB0YWJsZWF1XG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgMCwgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB1bmUgY29uZGl0aW9uICh0ZW1wbyBvdSB0b25hbGl0w6kpIGR1IG1peCBoYXJtb25pcXVlLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoKHRlbXBvID49IHRlbXBvTWluICYmIHRlbXBvIDw9IHRlbXBvTWF4KSB8fCBpc01hdGNoaW5nKSB7XG4gICAgICAgICAgICAvLyAuLi4gb24gbGUgbWV0IGp1c3RlIGFwcsOocyBsZXMgbW9yY2VhdXggbGVzIHBsdXMgcGVydGluZW50c1xuICAgICAgICAgICAgcmVhcnJhbmdlKGksIG5iUGVyZmVjdE1hdGNoZXMsIHRyYWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICBpZiAoIUdVSS5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpO1xuXG4gICAgICAgICAgLy8gU2kgbCdhcnRpc3RlIG4nYSBwYXMgw6l0w6kgcmVuY29udHLDqSBkYW5zIGxlcyBzdWdnZXN0aW9ucyBwcsOpY8OpZGVudGVzLi4uXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShhcnRpc3QsIGFydGlzdHMpID09IC0xKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goYXJ0aXN0KTtcbiAgICAgICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrcyA9IHNpbWlsYXJUcmFja3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHZhbG9yaXNhbnQgbGUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpIGFwcGFyYWlzc2VudCBlbiBwcmlvcml0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbnN1aXRlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZW1wbywgc3VpdmlzIGRlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6kuXG4gICAqIEFwcGFyYWlzc2VudCBlbmZpbiBsZXMgbW9yY2VhdXggbm9uIGNvbXBhdGlibGVzLlxuICAgKlxuICAgKiBAY2xhc3MgVGVtcG9GaXJzdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIFRlbXBvRmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSB2YWxvcmlzYW50IGxlIHRlbXBvXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNvcnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVmVHJhY2sgTW9yY2VhdSBkZSByw6lmw6lyZW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoYXJtb255IEhhcm1vbmllIHJlY2hlcmNow6llXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRhYmxlYXUgZGUgbW9yY2VhdXggdHJpw6lcbiAgICAgKi9cbiAgICB0aGlzLnNvcnQgPSBmdW5jdGlvbihyZWZUcmFjaywgaGFybW9ueSwgc2ltaWxhclRyYWNrcykge1xuICAgICAgdmFyIG5iUGVyZmVjdE1hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG8gZXQgZW4gdG9uYWxpdMOpXG4gICAgICAgICAgbmJUZW1wb01hdGNoZXMgPSAwLCAvLyBDb3JyZXNwb25kYW5jZXMgZW4gdGVtcG9cbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgIGN1cnJlbnRUZW1wbyA9IHRyYWNrLmdldFRlbXBvKCksXG4gICAgICAgICAgICB0ZW1wb01pbiA9IGhhcm1vbnkudGVtcG9NaW4oKSxcbiAgICAgICAgICAgIHRlbXBvTWF4ID0gaGFybW9ueS50ZW1wb01heCgpLFxuICAgICAgICAgICAgaXNNYXRjaGluZyA9ICgkLmluQXJyYXkodHJhY2suZ2V0Q2FtZWxvdFRhZygpLCByZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXggJiYgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIDAsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRlbXBvLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRlbXBvID49IHRlbXBvTWluICYmIGN1cnJlbnRUZW1wbyA8PSB0ZW1wb01heCkge1xuICAgICAgICAgICAgbmJUZW1wb01hdGNoZXMrKztcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBsZXMgcGx1cyBwZXJ0aW5lbnRzXG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgbmJQZXJmZWN0TWF0Y2hlcywgdHJhY2spO1xuICAgICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgZXN0IGNvbXBhdGlibGUgZW4gdG9uYWxpdMOpLi4uXG4gICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaGluZykge1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvXG4gICAgICAgICAgICByZWFycmFuZ2UoaSwgbmJQZXJmZWN0TWF0Y2hlcyArIG5iVGVtcG9NYXRjaGVzLCB0cmFjayk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICBpZiAoIUdVSS5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpO1xuXG4gICAgICAgICAgLy8gU2kgbCdhcnRpc3RlIG4nYSBwYXMgw6l0w6kgcmVuY29udHLDqSBkYW5zIGxlcyBzdWdnZXN0aW9ucyBwcsOpY8OpZGVudGVzLi4uXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShhcnRpc3QsIGFydGlzdHMpID09IC0xKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goYXJ0aXN0KTtcbiAgICAgICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrcyA9IHNpbWlsYXJUcmFja3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIHZhbG9yaXNhbnQgbGEgdG9uYWxpdMOpLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqSBhcHBhcmFpc3NlbnQgZW4gcHJpb3JpdMOpLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5zdWl0ZSBsZXMgbW9yY2VhdXggY29tcGF0aWJsZXMgZW4gdG9uYWxpdMOpLCBzdWl2aXMgZGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlbXBvLlxuICAgKiBBcHBhcmFpc3NlbnQgZW5maW4gbGVzIG1vcmNlYXV4IG5vbiBjb21wYXRpYmxlcy5cbiAgICpcbiAgICogQGNsYXNzIEtleUZpcnN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgS2V5Rmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgIC8qKlxuICAgICAqIE3DqXRob2RlIGRlIHRyaSB2YWxvcmlzYW50IGxhIHRvbmFsaXTDqVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHZhciBuYlBlcmZlY3RNYXRjaGVzID0gMCwgLy8gQ29ycmVzcG9uZGFuY2VzIGVuIHRlbXBvIGV0IGVuIHRvbmFsaXTDqVxuICAgICAgICAgIG5iS2V5TWF0Y2hlcyA9IDAsIC8vIENvcnJlc3BvbmRhbmNlcyBlbiB0b25hbGl0w6lcbiAgICAgICAgICBhcnRpc3RzID0gW10sIC8vIFRvdXMgbGVzIGFydGlzdGVzIHJlbmNvbnRyw6lzIGRhbnMgbGVzIHLDqXN1bHRhdHNcbiAgICAgICAgICB0cmFja3MgPSBbXSwgLy8gTGVzIG1vcmNlYXV4IMOgIHJlbnZveWVyIMOgIGwnaXNzdWUgZHUgdHJpXG4gICAgICAgICAgcmVhcnJhbmdlID0gZnVuY3Rpb24ocmVtb3ZlSW5kZXgsIGluc2VydEluZGV4LCB0cmFjaykge1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICAgICAgc2ltaWxhclRyYWNrcy5zcGxpY2UoaW5zZXJ0SW5kZXgsIDAsIHRyYWNrKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAvLyBQb3VyIGNoYXF1ZSBtb3JjZWF1LCBvbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3MgaW5kaXNwZW5zYWJsZXNcbiAgICAgICAgdmFyIHRyYWNrID0gc2ltaWxhclRyYWNrc1tpXSxcbiAgICAgICAgICAgIGN1cnJlbnRUZW1wbyA9IHRyYWNrLmdldFRlbXBvKCksXG4gICAgICAgICAgICB0ZW1wb01pbiA9IGhhcm1vbnkudGVtcG9NaW4oKSxcbiAgICAgICAgICAgIHRlbXBvTWF4ID0gaGFybW9ueS50ZW1wb01heCgpLFxuICAgICAgICAgICAgaXNNYXRjaGluZyA9ICgkLmluQXJyYXkodHJhY2suZ2V0Q2FtZWxvdFRhZygpLCByZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpO1xuXG4gICAgICAgIC8vIFNpIHVuIG1vcmNlYXUgcmVtcGxpdCB0b3V0ZXMgbGVzIGNvbmRpdGlvbnMgZHUgbWl4IGhhcm1vbmlxdWUuLi5cbiAgICAgICAgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXggJiYgaXNNYXRjaGluZykge1xuICAgICAgICAgICAgbmJQZXJmZWN0TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBlbiBkw6lidXQgZGUgdGFibGVhdVxuICAgICAgICAgICAgcmVhcnJhbmdlKGksIDAsIHRyYWNrKTtcbiAgICAgICAgICAvLyBTaSB1biBtb3JjZWF1IGVzdCBjb21wYXRpYmxlIGVuIHRvbmFsaXTDqS4uLlxuICAgICAgICB9IGVsc2UgaWYgKGlzTWF0Y2hpbmcpIHtcbiAgICAgICAgICAgIG5iS2V5TWF0Y2hlcysrO1xuICAgICAgICAgICAgLy8gLi4uIG9uIGxlIG1ldCBqdXN0ZSBhcHLDqHMgbGVzIG1vcmNlYXV4IGxlcyBwbHVzIHBlcnRpbmVudHNcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgICAgLy8gU2kgdW4gbW9yY2VhdSBlc3QgY29tcGF0aWJsZSBlbiB0ZW1wby4uLlxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUZW1wbyA+PSB0ZW1wb01pbiAmJiBjdXJyZW50VGVtcG8gPD0gdGVtcG9NYXgpIHtcbiAgICAgICAgICAgIC8vIC4uLiBvbiBsZSBtZXQganVzdGUgYXByw6hzIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0b25hbGl0w6lcbiAgICAgICAgICAgIHJlYXJyYW5nZShpLCBuYlBlcmZlY3RNYXRjaGVzICsgbmJLZXlNYXRjaGVzLCB0cmFjayk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBTaSBsZXMgZG91YmxvbnMgbmUgc29udCBwYXMgYXV0b3Jpc8Opcywgb24gZmlsdHJlXG4gICAgICBpZiAoIUdVSS5kdXBsaWNhdGVzQWxsb3dlZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbWlsYXJUcmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIHZhciB0cmFjayA9IHNpbWlsYXJUcmFja3NbaV0sXG4gICAgICAgICAgICAgIGFydGlzdCA9IHRyYWNrLmdldEFydGlzdCgpO1xuXG4gICAgICAgICAgLy8gU2kgbCdhcnRpc3RlIG4nYSBwYXMgw6l0w6kgcmVuY29udHLDqSBkYW5zIGxlcyBzdWdnZXN0aW9ucyBwcsOpY8OpZGVudGVzLi4uXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShhcnRpc3QsIGFydGlzdHMpID09IC0xKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goYXJ0aXN0KTtcbiAgICAgICAgICAgIHRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrcyA9IHNpbWlsYXJUcmFja3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFja3M7XG4gICAgfTtcbiAgfSxcbiAgLyoqXG4gICAqIENsYXNzZSBlbmNhcHN1bGFudCBsJ2FsZ29yaXRobWUgZGUgdHJpIGNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG8uXG4gICAqIEljaSBsZXMgbW9yY2VhdXgsIGNvbXBhdGlibGVzIG91IG5vbiwgc29udCByYW5nw6lzIGR1IEJQTSBsZSBwbHVzIGxlbnQgYXUgQlBNIGxlIHBsdXMgcmFwaWRlLlxuICAgKlxuICAgKiBAY2xhc3MgQXNjZW5kaW5nVGVtcG9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqL1xuICBBc2NlbmRpbmdUZW1wbzogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIGNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICByZXR1cm4gXy5zb3J0Qnkoc2ltaWxhclRyYWNrcywgJ190ZW1wbycpO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZW5jYXBzdWxhbnQgbCdhbGdvcml0aG1lIGRlIHRyaSBkw6ljcm9pc3NhbnQsIGVuIGZvbmN0aW9uIGR1IHRlbXBvLlxuICAgKiBJY2kgbGVzIG1vcmNlYXV4LCBjb21wYXRpYmxlcyBvdSBub24sIHNvbnQgcmFuZ8OpcyBkdSBCUE0gbGUgcGx1cyByYXBpZGUgYXUgQlBNIGxlIHBsdXMgbGVudC5cbiAgICpcbiAgICogQGNsYXNzIERlc2NlbmRpbmdUZW1wb1xuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIERlc2NlbmRpbmdUZW1wbzogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgZGUgdHJpIGTDqWNyb2lzc2FudCwgZW4gZm9uY3Rpb24gZHUgdGVtcG9cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc29ydFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZWZUcmFjayBNb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzaW1pbGFyVHJhY2tzIE1vcmNlYXV4IHNpbWlsYWlyZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGFibGVhdSBkZSBtb3JjZWF1eCB0cmnDqVxuICAgICAqL1xuICAgIHRoaXMuc29ydCA9IGZ1bmN0aW9uKHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKSB7XG4gICAgICBzaW1pbGFyVHJhY2tzID0gXy5zb3J0Qnkoc2ltaWxhclRyYWNrcywgJ190ZW1wbycpO1xuICAgICAgcmV0dXJuIHNpbWlsYXJUcmFja3MucmV2ZXJzZSgpO1xuICAgIH07XG4gIH0sXG4gIC8qKlxuICAgKiBDbGFzc2UgZMOpZmluaXNzYW50IHVuIGFsZ29yaXRobWUgZmljdGlmIG4nZWZmZWN0dWFudCBhdWN1biB0cmkuXG4gICAqIENldHRlIGNsYXNzZSBuJ2V4aXN0ZSBxdWUgcG91ciBkZXMgcmFpc29ucyBzw6ltYW50aXF1ZXMuXG4gICAqXG4gICAqIEBjbGFzcyBOb25lXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgTm9uZTogZnVuY3Rpb24oKSB7XG4gICAgLyoqXG4gICAgICogTcOpdGhvZGUgbidhcHBsaXF1YW50IGF1Y3VuIHRyaVxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaGFybW9ueSBIYXJtb25pZSByZWNoZXJjaMOpZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNpbWlsYXJUcmFja3MgTW9yY2VhdXggc2ltaWxhaXJlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpXG4gICAgICovXG4gICAgdGhpcy5zb3J0ID0gZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICAgIHJldHVybiBzaW1pbGFyVHJhY2tzO1xuICAgIH07XG4gIH1cbn07XG5cbi8qKlxuICogUHJvdG90eXBlIGRlIGxhIGNsYXNzZSBTdHJhdGVneVxuICovXG5Tb3J0aW5nLlN0cmF0ZWd5LnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICAqIEFjY2Vzc2V1ciBwb3VyIGwnYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0QWxnb3JpdGhtXG4gICAqIEByZXR1cm4ge09iamVjdH0gTCdhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICovXG4gIGdldEFsZ29yaXRobTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZ29yaXRobTtcbiAgfSxcbiAgLyoqXG4gICAqIE11dGF0ZXVyIHBvdXIgbCdhbGdvcml0aG1lIGNvdXJhbnQgZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmlcbiAgICpcbiAgICogQG1ldGhvZCBnZXRBbGdvcml0aG1cbiAgICogQHBhcmFtIHtPYmplY3R9IGFsZ29yaXRobSBMZSBub3V2ZWwgYWxnb3JpdGhtZSBjb3VyYW50IGRlIGxhIHN0cmF0w6lnaWUgZGUgdHJpXG4gICAqL1xuICBzZXRBbGdvcml0aG06IGZ1bmN0aW9uKGFsZ29yaXRobSkge1xuICAgIHRoaXMuX2FsZ29yaXRobSA9IGFsZ29yaXRobTtcbiAgfSxcbiAgLyoqXG4gICAqIE3DqXRob2RlIGFic3RyYWl0ZSBkZSB0cmkuXG4gICAqIENldHRlIGRlcm5pw6hyZSBzZSBjb250ZW50ZSBkZSBkw6lsw6lndWVyIGxlIHRyaSDDoCB1bmUgbcOpdGhvZGUgY29uY3LDqHRlLlxuICAgKlxuICAgKiBAbWV0aG9kIHNvcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlZlRyYWNrIE1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IGhhcm1vbnkgSGFybW9uaWUgcmVjaGVyY2jDqWVcbiAgICogQHBhcmFtIHtBcnJheX0gc2ltaWxhclRyYWNrcyBNb3JjZWF1eCBzaW1pbGFpcmVzXG4gICAqIEByZXR1cm4ge0FycmF5fSBUYWJsZWF1IGRlIG1vcmNlYXV4IHRyacOpLCBzZWxvbiBsJ2FsZ29yaXRobWUgY291cmFudFxuICAgKi9cbiAgc29ydDogZnVuY3Rpb24ocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxnb3JpdGhtLnNvcnQocmVmVHJhY2ssIGhhcm1vbnksIHNpbWlsYXJUcmFja3MpO1xuICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvU29ydGluZy5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqICBPYmpldHMgdXRpbGVzIHBvdXIgbGUgdHJhaXRlbWVudCBkZXMgcsOpcG9uc2VzIHZlbmFudCBkJ0VjaG8gTmVzdFxuICpcbiAqIEBtb2R1bGUgVm9jYWJ1bGFyeVxuICogQGNsYXNzIFZvY2FidWxhcnlcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFZvY2FidWxhcnkgPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIE1vZGUgKG1hamV1ciBldCBtaW5ldXIpXG4gKlxuICogQHByb3BlcnR5IG1vZGVzXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQGRlZmF1bHQge31cbiAqL1xuVm9jYWJ1bGFyeS5tb2RlcyA9IHtcbiAgICBcIjBcIjogXCJtaW5ldXJcIixcbiAgICBcIjFcIjogXCJtYWpldXJcIlxufTtcblxuLyoqXG4gKiBOb3Rlcywgc2Vsb24gbGEgbm90YXRpb24gc3lsbGFiaXF1ZVxuICpcbiAqIEBwcm9wZXJ0eSBub3Rlc1xuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkua2V5cyA9IHtcbiAgICBcIjBcIjogXCJkb1wiLFxuICAgIFwiMVwiOiBcImRvI1wiLFxuICAgIFwiMlwiOiBcInLDqVwiLFxuICAgIFwiM1wiOiBcIm1pYlwiLFxuICAgIFwiNFwiOiBcIm1pXCIsXG4gICAgXCI1XCI6IFwiZmFcIixcbiAgICBcIjZcIjogXCJmYSNcIixcbiAgICBcIjdcIjogXCJzb2xcIixcbiAgICBcIjhcIjogXCJsYWJcIixcbiAgICBcIjlcIjogXCJsYVwiLFxuICAgIFwiMTBcIjogXCJzaWJcIixcbiAgICBcIjExXCI6IFwic2lcIlxufTtcblxuLyoqXG4gKiBNaXggaGFybW9uaXF1ZSAobW9kZSArIG5vdGUgPSB1biB0YWcgc3VyIGxhIHJvdWUgZGUgQ2FtZWxvdClcbiAqXG4gKiBAcHJvcGVydHkgaGFybW9uaWNNaXhcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAZGVmYXVsdCB7fVxuICovXG5Wb2NhYnVsYXJ5Lmhhcm1vbmljTWl4ID0ge1xuICAgIFwibWluZXVyXCI6IHtcbiAgICAgICAgXCJkb1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjVBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkbyNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMkFcIlxuICAgICAgICB9LFxuICAgICAgICBcInLDqVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjdBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIyQVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWlcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI5QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmFcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI0QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZmEjXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTFBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzb2xcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI2QVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFiXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMUFcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiOEFcIlxuICAgICAgICB9LFxuICAgICAgICBcInNpYlwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjNBXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaVwiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjEwQVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwibWFqZXVyXCI6IHtcbiAgICAgICAgXCJkb1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjhCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkbyNcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIzQlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwicsOpXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTBCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJtaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI1QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibWlcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxMkJcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiN0JcIlxuICAgICAgICB9LFxuICAgICAgICBcImZhI1wiOiB7XG4gICAgICAgICAgICBcInRhZ1wiOiBcIjJCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzb2xcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI5QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwibGFiXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiNEJcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhXCI6IHtcbiAgICAgICAgICAgIFwidGFnXCI6IFwiMTFCXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJzaWJcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCI2QlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwic2lcIjoge1xuICAgICAgICAgICAgXCJ0YWdcIjogXCIxQlwiXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRyYWR1Y3Rpb24gZGUgbGEgcm91ZSBkZSBDYW1lbG90XG4gKlxuICogQHByb3BlcnR5IGNhbWVsb3RXaGVlbFxuICogQHR5cGUge09iamVjdH1cbiAqIEBkZWZhdWx0IHt9XG4gKi9cblZvY2FidWxhcnkuY2FtZWxvdFdoZWVsID0ge1xuICAgIFwiMUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJBLUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjFBXCIsIFwiMTJBXCIsIFwiMkFcIiwgXCIxQlwiXVxuICAgIH0sXG4gICAgXCIyQVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUtRmxhdCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMkFcIiwgXCIxQVwiLCBcIjNBXCIsIFwiMkJcIl1cbiAgICB9LFxuICAgIFwiM0FcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJCLUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjNBXCIsIFwiMkFcIiwgXCI0QVwiLCBcIjNCXCJdXG4gICAgfSxcbiAgICBcIjRBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRiBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNEFcIiwgXCIzQVwiLCBcIjVBXCIsIFwiNEJcIl1cbiAgICB9LFxuICAgIFwiNUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJDIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI1QVwiLCBcIjRBXCIsIFwiNkFcIiwgXCI1QlwiXVxuICAgIH0sXG4gICAgXCI2QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkcgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjZBXCIsIFwiNUFcIiwgXCI3QVwiLCBcIjZCXCJdXG4gICAgfSxcbiAgICBcIjdBXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRCBNaW5vclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiN0FcIiwgXCI2QVwiLCBcIjhBXCIsIFwiN0JcIl1cbiAgICB9LFxuICAgIFwiOEFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJBIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI4QVwiLCBcIjdBXCIsIFwiOUFcIiwgXCI4QlwiXVxuICAgIH0sXG4gICAgXCI5QVwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjlBXCIsIFwiOEFcIiwgXCIxMEFcIiwgXCI5QlwiXVxuICAgIH0sXG4gICAgXCIxMEFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJCIE1pbm9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMEFcIiwgXCI5QVwiLCBcIjExQVwiLCBcIjEwQlwiXVxuICAgIH0sXG4gICAgXCIxMUFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJHIEZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjExQVwiLCBcIjEwQVwiLCBcIjEyQVwiLCBcIjExQlwiXVxuICAgIH0sXG4gICAgXCIxMkFcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJELUZsYXQgTWlub3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjEyQVwiLCBcIjExQVwiLCBcIjFBXCIsIFwiMTJCXCJdXG4gICAgfSxcbiAgICBcIjFCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQiBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMUJcIiwgXCIxMkJcIiwgXCIyQlwiLCBcIjFBXCJdXG4gICAgfSxcbiAgICBcIjJCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRi1TaGFycCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMkJcIiwgXCIxQlwiLCBcIjNCXCIsIFwiMkFcIl1cbiAgICB9LFxuICAgIFwiM0JcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJELUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjNCXCIsIFwiMkJcIiwgXCI0QlwiLCBcIjNBXCJdXG4gICAgfSxcbiAgICBcIjRCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiQS1GbGF0IE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI0QlwiLCBcIjNCXCIsIFwiNUJcIiwgXCI0QVwiXVxuICAgIH0sXG4gICAgXCI1QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkUtRmxhdCBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiNUJcIiwgXCI0QlwiLCBcIjZCXCIsIFwiNUFcIl1cbiAgICB9LFxuICAgIFwiNkJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJCLUZsYXQgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjZCXCIsIFwiNUJcIiwgXCI3QlwiLCBcIjZBXCJdXG4gICAgfSxcbiAgICBcIjdCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRiBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiN0JcIiwgXCI2QlwiLCBcIjhCXCIsIFwiN0FcIl1cbiAgICB9LFxuICAgIFwiOEJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJDIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCI4QlwiLCBcIjdCXCIsIFwiOUJcIiwgXCI4QVwiXVxuICAgIH0sXG4gICAgXCI5QlwiOiB7XG4gICAgICAgIFwibmFtZVwiOiBcIkcgTWFqb3JcIixcbiAgICAgICAgXCJtYXRjaGVzXCI6IFtcIjlCXCIsIFwiOEJcIiwgXCIxMEJcIiwgXCI5QVwiXVxuICAgIH0sXG4gICAgXCIxMEJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJEIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMEJcIiwgXCI5QlwiLCBcIjExQlwiLCBcIjEwQVwiXVxuICAgIH0sXG4gICAgXCIxMUJcIjoge1xuICAgICAgICBcIm5hbWVcIjogXCJBIE1ham9yXCIsXG4gICAgICAgIFwibWF0Y2hlc1wiOiBbXCIxMUJcIiwgXCIxMEJcIiwgXCIxMkJcIiwgXCIxMUFcIl1cbiAgICB9LFxuICAgIFwiMTJCXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRSBNYWpvclwiLFxuICAgICAgICBcIm1hdGNoZXNcIjogW1wiMTJCXCIsIFwiMTFCXCIsIFwiMUJcIiwgXCIxMkFcIl1cbiAgICB9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uL21vZHVsZXMvVm9jYWJ1bGFyeS5qc1wiLFwiLy4uL21vZHVsZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBJbXBvcnQgZGVzIG1vZHVsZXNcbnZhciBWb2NhYnVsYXJ5ID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9Wb2NhYnVsYXJ5LmpzJyksXG4gICAgSXRlcmF0b3IgPSByZXF1aXJlKCcuLi9tb2R1bGVzL0l0ZXJhdG9yLmpzJyksXG4gICAgTXVzaWMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL011c2ljLmpzJyksXG4gICAgQWpheCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvQWpheC5qcycpLFxuICAgIEdVSSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvR1VJLmpzJyksXG4gICAgU29ydGluZyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvU29ydGluZy5qcycpLFxuICAgIFBsYXllciA9IHJlcXVpcmUoJy4uL21vZHVsZXMvUGxheWVyJyksXG4gICAgUGxheWxpc3QgPSByZXF1aXJlKCcuLi9tb2R1bGVzL1BsYXlsaXN0Jyk7XG5cbi8vIFZhcmlhYmxlcyBkaXZlcnNlc1xudmFyIHNpbWlsYXJUcmFja3MgPSBbXSxcbiAgICByZWZUcmFjayxcbiAgICBoYXJtb255LFxuICAgIHRpdGxlTm90aWYsXG4gICAga2V5Tm90aWYsXG4gICAgdGVtcG9Ob3RpZixcbiAgICBwbGF5ZXIsXG4gICAgJG93bCxcbiAgICAkaGFybW9uaWNUcmFja3M7XG5cbi8vIFN0cmF0w6lnaWVzIGRlIHRyaSBkZXMgbW9yY2VhdXhcbnZhciBzb3J0aW5nU3RyYXRlZ3kgPSBuZXcgU29ydGluZy5TdHJhdGVneSgpLFxuICAgIGRlZmF1bHRTb3J0aW5nID0gbmV3IFNvcnRpbmcuRGVmYXVsdCgpLFxuICAgIHRlbXBvRmlyc3RTb3J0aW5nID0gbmV3IFNvcnRpbmcuVGVtcG9GaXJzdCgpLFxuICAgIGtleUZpcnN0U29ydGluZyA9IG5ldyBTb3J0aW5nLktleUZpcnN0KCksXG4gICAgYXNjVGVtcG9Tb3J0aW5nID0gbmV3IFNvcnRpbmcuQXNjZW5kaW5nVGVtcG8oKSxcbiAgICBkZXNjVGVtcG9Tb3J0aW5nID0gbmV3IFNvcnRpbmcuRGVzY2VuZGluZ1RlbXBvKCksXG4gICAgbm9Tb3J0aW5nID0gbmV3IFNvcnRpbmcuTm9uZSgpO1xuXG4vLyBQb2ludCBkJ2VudHLDqWUgZGUgbCdhcHBsaWNhdGlvblxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcblxuICAgIC8vIEluaXRpYWxpc2F0aW9uIGRlIGwnaW50ZXJmYWNlIGdyYXBoaXF1ZVxuICAgIEdVSS5pbml0KCk7XG5cbiAgICAvLyBJbml0aWFsaXNhdGlvbiBkdSBwbGF5ZXJcbiAgICBwbGF5ZXIgPSBQbGF5ZXIuZ2V0UGxheWVyKCk7XG4gICAgcGxheWVyLmluaXQoKTtcblxuICAgIC8vIENhY2hpbmcgZGVzIHPDqWxlY3RldXJzIGltcG9ydGFudHNcbiAgICAkb3dsID0gJCggXCIjdHJhY2tzXCIgKTtcbiAgICAkaGFybW9uaWNUcmFja3MgPSAkKCBcIiNoYXJtb25pYy10cmFja3NcIiApO1xuXG4gICAgLy8gSW5pdGlhbGlzYXRpb24gZGUgbCdhdXRvY29tcGzDqXRpb25cbiAgICB0cmFja0F1dG9jb21wbGV0ZSgpO1xuXG4gICAgLy8gw4AgbGEgc291bWlzc2lvbiBkdSBmb3JtdWxhaXJlLCBvbiByw6ljdXDDqHJlIGRlcyBtb3JjZWF1eCBzdXIgRGVlemVyXG4gICAgJCggXCIjc2VhcmNoXCIgKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlYXJjaFRyYWNrcygpO1xuICAgICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICAgIGFsZXJ0aWZ5Lm1lc3NhZ2UoXCJDaG9pc2lzc2V6IHVuIG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcIiwgNSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSw6lpbml0aWFsaXNhdGlvbiBkZSBsYSB6b25lIGRlIHJlY2hlcmNoZVxuICAgICAgICAkKCBcIiNzZWFyY2ggaW5wdXRcIiApLnZhbCggXCJcIiApO1xuXG4gICAgICAgIC8vIETDqXRlY3Rpb24gZGUgbGEgc3RyYXTDqWdpZSBkZSB0cmkgZGVzIG1vcmNlYXV4XG4gICAgICAgIHN3aXRjaCAoR1VJLnNlbGVjdGVkU29ydGluZykge1xuICAgICAgICAgIGNhc2UgXCJ0ZW1wb0ZpcnN0XCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKHRlbXBvRmlyc3RTb3J0aW5nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJrZXlGaXJzdFwiOlxuICAgICAgICAgICAgc29ydGluZ1N0cmF0ZWd5LnNldEFsZ29yaXRobShrZXlGaXJzdFNvcnRpbmcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImFzY1RlbXBvXCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGFzY1RlbXBvU29ydGluZyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZGVzY1RlbXBvXCI6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGRlc2NUZW1wb1NvcnRpbmcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIm5vbmVcIjpcbiAgICAgICAgICAgIHNvcnRpbmdTdHJhdGVneS5zZXRBbGdvcml0aG0obm9Tb3J0aW5nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzb3J0aW5nU3RyYXRlZ3kuc2V0QWxnb3JpdGhtKGRlZmF1bHRTb3J0aW5nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCggXCIjc2VhcmNoIGlucHV0XCIgKS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkID0gJCggdGhpcyApLnZhbCgpO1xuICAgICAgaWYgKGtleXdvcmQubGVuZ3RoIDwgMykge1xuICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbi8vIFLDqWluaXRpYWxpc2F0aW9uIGRlcyBub3RpZmljYXRpb25zIGRvbm5hbnQgbGUgcHJvZmlsIGR1IG1vcmNlYXUgZGUgcsOpZsOpcmVuY2VcbmZ1bmN0aW9uIGRpc21pc3NOb3RpZmljYXRpb25zKCkge1xuICBpZiAodGl0bGVOb3RpZiAhPT0gdW5kZWZpbmVkKSB0aXRsZU5vdGlmLmRpc21pc3MoKTtcbiAgaWYgKGtleU5vdGlmICE9PSB1bmRlZmluZWQpIGtleU5vdGlmLmRpc21pc3MoKTtcbiAgaWYgKHRlbXBvTm90aWYgIT09IHVuZGVmaW5lZCkgdGVtcG9Ob3RpZi5kaXNtaXNzKCk7XG59XG5cbi8vIEdlc3Rpb24gZGUgbCdhdXRvY29tcGzDqXRpb24gZGFucyBsZSBjaGFtcCBkZSByZWNoZXJjaGVcbmZ1bmN0aW9uIHRyYWNrQXV0b2NvbXBsZXRlKCkge1xuXG4gICQoIFwiI3NlYXJjaCBpbnB1dFwiICkuYXV0b2NvbXBsZXRlKHtcbiAgICAgIHNvdXJjZTogZnVuY3Rpb24oIHJlcXVlc3QsIHJlc3BvbnNlICkge1xuXG4gICAgICAgIHZhciBrZXl3b3JkID0gJCggXCIjc2VhcmNoIGlucHV0XCIgKS52YWwoKTtcblxuICAgICAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9zZWFyY2gvdHJhY2tcIik7XG4gICAgICAgIHJlcXVlc3QuYWRkUGFyYW0oXCJxXCIsIGtleXdvcmQpO1xuICAgICAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMTApO1xuICAgICAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5lbXB0eSgpO1xuICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICB2YXIgaWQgPSBcImF1dG9jb21wbGV0ZS1cIiArIHJlc3BvbnNlLmRhdGFbaV0uaWQ7XG5cbiAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgaWQ9XCInICsgaWQgKyAnXCI+JztcbiAgICAgICAgICAgIGh0bWwgKz0gJyA8c3Ryb25nPicgKyByZXNwb25zZS5kYXRhW2ldLnRpdGxlICsgJzwvc3Ryb25nPjxicj4nO1xuICAgICAgICAgICAgaHRtbCArPSAnIDxlbT4nICsgcmVzcG9uc2UuZGF0YVtpXS5hcnRpc3QubmFtZSArICc8L2VtPic7XG4gICAgICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgICAgICBzZWxlY3RlZFRyYWNrKGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJCggXCIjYXV0b2NvbXBsZXRlXCIgKS5hcHBlbmQoIGh0bWwgKTtcbiAgICAgICAgICAkKCBcIiNhdXRvY29tcGxldGVcIiApLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1pbkxlbmd0aDogM1xuICAgIH0pO1xuXG59XG5cbi8vIFJlY2hlcmNoZSBkZSBtb3JjZWF1eCBzdXIgRGVlemVyXG5mdW5jdGlvbiBzZWFyY2hUcmFja3MoKSB7XG5cbiAgICAvLyBSw6lpbml0aWFsaXNhdGlvbiBkZSBsYSByZWNoZXJjaGVcbiAgICBpZiAoJG93bC5pcyggXCI6dmlzaWJsZVwiICkpICRvd2wuZW1wdHkoKTtcbiAgICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSBzaW1pbGFyVHJhY2tzID0gW107XG4gICAgZGlzbWlzc05vdGlmaWNhdGlvbnMoKTtcblxuICAgIHZhciBrZXl3b3JkID0gJCggXCIjc2VhcmNoIGlucHV0XCIgKS52YWwoKTtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpLmdldEFqYXhSZXF1ZXN0KFwiZGVlemVyXCIsIFwiL3NlYXJjaC90cmFja1wiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwicVwiLCBrZXl3b3JkKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibGltaXRcIiwgMjApO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBudWxsKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAvLyBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHN1ciBjaGFxdWUgbW9yY2VhdVxuICAgICAgICAgICAgdmFyIHRyYWNrID0gcmVzcG9uc2UuZGF0YVtpXSxcbiAgICAgICAgICAgICAgICBhcnRpc3ROYW1lID0gdHJhY2suYXJ0aXN0Lm5hbWUsXG4gICAgICAgICAgICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwO1xuXG4gICAgICAgICAgICAvLyBTaSBsZSBub20gZGUgbCdhcnRpc3RlIGVzdCBleGFnw6lyw6ltZW50IGxvbmcsIG9uIGxlIHRyb25xdWVcbiAgICAgICAgICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICAgICAgICBhcnRpc3ROYW1lID0gYXJ0aXN0TmFtZS5zdWJzdHIoMCwgbWF4U3RyaW5nTGVuZ3RoKSArIFwiIC4uLlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUZW1wbGF0ZSBkJ3VuIG1vcmNlYXVcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgaWQ9XCInICsgdHJhY2suaWQgKyAnXCIgY2xhc3M9XCJ0cmFja1wiPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnIDxmaWd1cmU+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICA8aW1nIGNsYXNzPVwibGF6eU93bFwiIGRhdGEtc3JjPVwiJyArIHRyYWNrLmFsYnVtLmNvdmVyX21lZGl1bSArICdcIiBhbHQ9XCInICsgdHJhY2sudGl0bGUgKyAnXCI+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICA8ZmlnY2FwdGlvbj4nO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgPGRpdj4nO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgICA8aDMgY2xhc3M9XCJ0cmFjay10aXRsZVwiPicgKyB0cmFjay50aXRsZSArICc8L2gzPic7XG4gICAgICAgICAgICAgICAgaHRtbCArPSAnICAgICAgIDxwIGNsYXNzPVwiYXJ0aXN0LW5hbWVcIj4nICsgYXJ0aXN0TmFtZSArIFwiPC9wPlwiO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICcgPC9maWd1cmU+JztcbiAgICAgICAgICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuXG4gICAgICAgICAgICAvLyBPbiBham91dGUgbGUgdGVtcGxhdGUgYXUgY2Fyb3VzZWwgZXQgb24gYWZmaWNoZSBsZXMgcsOpc3VsdGF0c1xuICAgICAgICAgICAgJG93bC5kYXRhKCdvd2xDYXJvdXNlbCcpLmFkZEl0ZW0oaHRtbCk7XG5cbiAgICAgICAgICAgIGlmICghJG93bC5pcyggXCI6dmlzaWJsZVwiICkpIHtcbiAgICAgICAgICAgICAgJG93bC5mYWRlSW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gT24gYWpvdXRlIHVuIMOpY291dGV1ciBkJ8OpdsOpbmVtZW50IGRlIHR5cGUgY2xpYyBwb3VyIGNoYXF1ZSBtb3JjZWF1XG4gICAgICAgICAgICBzZWxlY3RlZFRyYWNrKHRyYWNrLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vLyBHZXN0aW9uIGR1IGNsaWMgc3VyIHVuIMOpbMOpbWVudCBkZSBsYSBsaXN0ZSBkZSBzdWdnZXN0aW9uc1xuZnVuY3Rpb24gc2VsZWN0ZWRUcmFjayhpZCkge1xuICAgICQoIGRvY3VtZW50ICkub24oIFwiY2xpY2tcIiwgXCIjXCIgKyBpZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE9uIGVmZmFjZSBsZXMgbm90aWZpY2F0aW9ucyBwcsOpY8OpZGVudGVzXG4gICAgICAgIGRpc21pc3NOb3RpZmljYXRpb25zKCk7XG4gICAgICAgIC8vIE9uIGFmZmljaGUgdW4gbG9hZGVyIHBvdXIgZmFpcmUgcGF0aWVudGVyIGwnaW50ZXJuYXV0ZVxuICAgICAgICAkKCBcIi51aS5wYWdlLmRpbW1lclwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcbiAgICAgICAgLy8gT24gcsOpY3Vww6hyZSBsZSByw6lzdW3DqSBhdWRpbyBkdSBtb3JjZWF1IHPDqWxlY3Rpb25uw6kgc3VyIEVjaG8gTmVzdFxuICAgICAgICBnZXRJbml0aWFsQXVkaW9TdW1tYXJ5KGlkKTtcbiAgICAgICAgLy8gT24gcsOpY3Vww6hyZSBsZXMgaW5mb3JtYXRpb25zIGTDqXRhaWxsw6llcyBkdSBtb3JjZWF1IHN1ciBEZWV6ZXJcbiAgICAgICAgZ2V0VHJhY2tJbmZvcyhpZCk7XG4gICAgfSk7XG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgbGUgbW9yY2VhdSBzw6lsZWN0aW9ubsOpIChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRJbml0aWFsQXVkaW9TdW1tYXJ5KHRyYWNrSWQpIHtcblxuICAgIC8vIFBhcmFtw6l0cmFnZSBldCBlbnZvaSBkZSBsYSByZXF1w6p0ZVxuICAgIHJlcXVlc3QgPSBuZXcgQWpheC5SZXF1ZXN0RmFjdG9yeSgpLmdldEFqYXhSZXF1ZXN0KFwiZWNob25lc3RcIiwgXCIvdHJhY2svcHJvZmlsZVwiKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwiaWRcIiwgXCJkZWV6ZXI6dHJhY2s6XCIgKyB0cmFja0lkKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKGZpbmFsKSB7XG4gICAgICAgIC8vIExlIG1vcmNlYXUgZXN0LWlsIHRyb3V2w6kgc3VyIEVjaG8gTmVzdCDDoCBwYXJ0aXIgZGUgbCdpZGVudGlmaWFudCBEZWV6ZXIgP1xuICAgICAgICBpZiAoZmluYWwucmVzcG9uc2UudHJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKEdVSS5ub3RpZkFsbG93ZWQpIHtcbiAgICAgICAgICAgICAgYWxlcnRpZnkuc3VjY2VzcyhcIlRyb3V2w6kgc3VyIEVjaG8gTmVzdCAhXCIsIDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGUgbW9yY2VhdSB0cm91dsOpIHN1ciBFY2hvIE5lc3QgYS10LWlsIHVuIHLDqXN1bcOpIGF1ZGlvID9cbiAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmluYWwucmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gcsOpY3Vww6hyZSB0b3V0ZXMgbGVzIGluZm9ybWF0aW9ucyB1dGlsZXMgZHUgbW9yY2VhdVxuICAgICAgICAgICAgICAgIHZhciB0cmFjayA9IGZpbmFsLnJlc3BvbnNlLnRyYWNrLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5hcnRpc3QsXG4gICAgICAgICAgICAgICAgICAgIGtleUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5rZXksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1trZXlJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGVJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkubW9kZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IFZvY2FidWxhcnkubW9kZXNbbW9kZUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcG8gPSBNYXRoLnJvdW5kKHRyYWNrLmF1ZGlvX3N1bW1hcnkudGVtcG8pO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gY29uc3RydWl0IGxlIHByb2ZpbCBkdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG4gICAgICAgICAgICAgICAgYnVpbGRSZWZUcmFja1Byb2ZpbGUodHJhY2tJZCwgdGl0bGUsIGFydGlzdCwgXCJcIiwga2V5LCBtb2RlLCB0ZW1wbyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgICAgdGl0bGVOb3RpZiA9IGFsZXJ0aWZ5Lm1lc3NhZ2UoXCLCqyBcIiArIHRpdGxlICsgXCIgwrsgcGFyIFwiICsgYXJ0aXN0LCAwKTtcbiAgICAgICAgICAgICAgICAgIGtleU5vdGlmID0gYWxlcnRpZnkubWVzc2FnZShcIlRvbmFsaXTDqSA6IFwiICsga2V5ICsgXCIgXCIgKyBtb2RlLCAwKTtcbiAgICAgICAgICAgICAgICAgIHRlbXBvTm90aWYgPSBhbGVydGlmeS5tZXNzYWdlKFwiVGVtcG8gOiBcIiArIHRlbXBvICsgXCIgQlBNXCIsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ1aWxkUmVmVHJhY2tQcm9maWxlKHRyYWNrSWQsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIFwiXCIsIDApO1xuICAgICAgICAgICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0aWZ5LmVycm9yKFwiTGUgcsOpc3Vtw6kgYXVkaW8gZGUgY2UgbW9yY2VhdSBuJ2VzdCBwYXMgZGlzcG9uaWJsZSBzdXIgRWNobyBOZXN0LlwiLCAxMCk7XG4gICAgICAgICAgICAgICAgYWxlcnRpZnkuZXJyb3IoXCJTdWdnZXN0aW9uIGhhcm1vbmlxdWUgaW1wb3NzaWJsZVwiLCAxMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFJlZlRyYWNrUHJvZmlsZSh0cmFja0lkLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCBcIlwiLCAwKTtcbiAgICAgICAgICBpZiAoR1VJLm5vdGlmQWxsb3dlZCkge1xuICAgICAgICAgICAgYWxlcnRpZnkuZXJyb3IoXCJDZSBtb3JjZWF1IG4nYSBwYXMgw6l0w6kgdHJvdXbDqSBzdXIgRWNobyBOZXN0LlwiLCAxMCk7XG4gICAgICAgICAgICBhbGVydGlmeS5lcnJvcihcIlN1Z2dlc3Rpb24gaGFybW9uaXF1ZSBpbXBvc3NpYmxlXCIsIDEwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy8gQ29uc3RydWN0aW9uIGR1IHByb2ZpbCBkdSBtb3JjZWF1IGRlIHLDqWbDqXJlbmNlXG5mdW5jdGlvbiBidWlsZFJlZlRyYWNrUHJvZmlsZShpZCwgdGl0bGUsIGFydGlzdCwgY292ZXIsIGtleSwgbW9kZSwgdGVtcG8pIHtcblxuICAgIC8vIE9uIGTDqXRlcm1pbmUgbGUgdGFnIGRlIENhbWVsb3QgZXQgbGVzIGhhcm1vbmllcyDDoCBwYXJ0aXIgZGVzIGluZm9zIMOgIGRpc3Bvc2l0aW9uXG4gICAgaWYgKHRpdGxlICE9IFwiXCIpIHtcbiAgICAgIHZhciBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZyxcbiAgICAgICAgICBoYXJtb25pZXMgPSBWb2NhYnVsYXJ5LmNhbWVsb3RXaGVlbFtjYW1lbG90VGFnXS5tYXRjaGVzO1xuICAgIH1cblxuICAgIHJlZlRyYWNrID0gbmV3IE11c2ljLlRyYWNrKGlkLCB0aXRsZSwgYXJ0aXN0LCBjb3Zlciwga2V5LCBtb2RlLCB0ZW1wbywgY2FtZWxvdFRhZywgaGFybW9uaWVzKTtcbiAgICBidWlsZEhhcm1vbnlQcm9maWxlKHJlZlRyYWNrKTtcbn1cblxuLy8gQ29uc3RydWN0aW9uIGR1IHByb2ZpbCBkZSBsJ2hhcm1vbmllIHJlY2hlcmNow6llXG5mdW5jdGlvbiBidWlsZEhhcm1vbnlQcm9maWxlKHRyYWNrKSB7XG4gICAgaGFybW9ueSA9IG5ldyBNdXNpYy5IYXJtb255KHRyYWNrLCBHVUkudGVtcG9WYXJpYXRpb24sIHRydWUpO1xufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgaW5mb3JtYXRpb25zIHN1ciB1biBtb3JjZWF1LCBub3RhbW1lbnQgcG91ciBhdm9pciBsJ2lkIGRlIGwnYXJ0aXN0ZSAoRGVlemVyKVxuZnVuY3Rpb24gZ2V0VHJhY2tJbmZvcyh0cmFja0lkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi90cmFjay9cIiArIHRyYWNrSWQpO1xuICAgIHJlcXVlc3Quc2VuZChzdWNjZXNzLCBudWxsKTtcblxuICAgIC8vIFRyYWl0ZW1lbnQgZGUgbGEgcsOpcG9uc2UgYXUgc3VjY8Ooc1xuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICB2YXIgYXJ0aXN0SWQgPSByZXNwb25zZS5hcnRpc3QuaWQ7XG4gICAgICAgIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKTtcbiAgICB9XG5cbn1cblxuLy8gUsOpY3Vww6lyYXRpb24gZGVzIGFydGlzdGVzIHNpbWlsYWlyZXMgKERlZXplcilcbmZ1bmN0aW9uIGdldFNpbWlsYXJBcnRpc3RzKGFydGlzdElkKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImRlZXplclwiLCBcIi9hcnRpc3QvXCIgKyBhcnRpc3RJZCArIFwiL3JlbGF0ZWRcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LnNlbmQoc3VjY2VzcywgbnVsbCk7XG5cbiAgICAvLyBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIGF1IHN1Y2PDqHNcbiAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgdmFyIGFydGlzdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcnRpc3RzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwicmVxdWVzdF9tZXRob2RcIjpcImdldFwiLFxuICAgICAgICAgICAgICAgIFwicmVsYXRpdmVfdXJsXCI6XCJhcnRpc3QvXCIgKyByZXNwb25zZS5kYXRhW2ldLmlkICsgXCIvdG9wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGFydGlzdHMgPSBKU09OLnN0cmluZ2lmeShhcnRpc3RzKTtcbiAgICAgICAgZ2V0VG9wVHJhY2tzKGFydGlzdHMpO1xuICAgIH1cblxufVxuXG4vLyBSw6ljdXDDqXJhdGlvbiBkZXMgY2hhbnNvbnMgbGVzIHBsdXMgcG9wdWxhaXJlcyBkZSBjaGFxdWUgYXJ0aXN0ZSBzaW1pbGFpcmUgKERlZXplcilcbmZ1bmN0aW9uIGdldFRvcFRyYWNrcyhzaW1pbGFyQXJ0aXN0cykge1xuXG4gICAgLy8gUGFyYW3DqXRyYWdlIGV0IGVudm9pIGRlIGxhIHJlcXXDqnRlXG4gICAgcmVxdWVzdCA9IG5ldyBBamF4LlJlcXVlc3RGYWN0b3J5KCkuZ2V0QWpheFJlcXVlc3QoXCJkZWV6ZXJcIiwgXCIvYmF0Y2hcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImxpbWl0XCIsIDEwKTtcbiAgICByZXF1ZXN0LmFkZFBhcmFtKFwibWV0aG9kc1wiLCBzaW1pbGFyQXJ0aXN0cyk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuYmF0Y2hfcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJ0aXN0ID0gcmVzcG9uc2UuYmF0Y2hfcmVzdWx0W2ldO1xuICAgICAgICAgICAgJC5lYWNoKGFydGlzdC5kYXRhLCBmdW5jdGlvbihpLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvcFRyYWNrID0gaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgY292ZXIgPSBpdGVtLmFsYnVtLmNvdmVyX21lZGl1bTtcblxuICAgICAgICAgICAgICAgIGdldFRvcFRyYWNrSW5mb3ModG9wVHJhY2suaWQsIGNvdmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8vIFLDqWN1cMOpcmF0aW9uIGRlcyBpbmZvcm1hdGlvbnMgZGUgdGVtcG8gZXQgZGUgdG9uYWxpdMOpIHBvdXIgdG91cyBsZXMgdG9wIG1vcmNlYXV4IChFY2hvIE5lc3QpXG5mdW5jdGlvbiBnZXRUb3BUcmFja0luZm9zKHRvcFRyYWNrSWQsIGNvdmVyKSB7XG5cbiAgICAvLyBQYXJhbcOpdHJhZ2UgZXQgZW52b2kgZGUgbGEgcmVxdcOqdGVcbiAgICByZXF1ZXN0ID0gbmV3IEFqYXguUmVxdWVzdEZhY3RvcnkoKS5nZXRBamF4UmVxdWVzdChcImVjaG9uZXN0XCIsIFwiL3RyYWNrL3Byb2ZpbGVcIik7XG4gICAgcmVxdWVzdC5hZGRQYXJhbShcImlkXCIsIFwiZGVlemVyOnRyYWNrOlwiICsgdG9wVHJhY2tJZCk7XG4gICAgcmVxdWVzdC5zZW5kKHN1Y2Nlc3MsIG51bGwpO1xuXG4gICAgLy8gVHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSBhdSBzdWNjw6hzXG4gICAgZnVuY3Rpb24gc3VjY2VzcyhmaW5hbCkge1xuICAgICAgICAvLyBJbCBmYXV0IHF1ZSBsZXMgbW9yY2VhdXggc29pZW50IHRyb3V2w6lzIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgaWYgKGZpbmFsLnJlc3BvbnNlLnRyYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIElsIGZhdXQgcXVlIGxlcyBtb3JjZWF1eCBwb3Nzw6hkZW50IHVuIHLDqXN1bcOpIGF1ZGlvIHN1ciBFY2hvIE5lc3RcbiAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGZpbmFsLnJlc3BvbnNlLnRyYWNrLmF1ZGlvX3N1bW1hcnkpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmluYWwucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIC8vICBPbiByw6ljdXDDqHJlIHRvdXRlcyBsZXMgaW5mb3JtYXRpb25zIHV0aWxlc1xuICAgICAgICAgICAgICAgIHZhciB0cmFjayA9IGZpbmFsLnJlc3BvbnNlLnRyYWNrLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRyYWNrLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBhcnRpc3QgPSB0cmFjay5hcnRpc3QsXG4gICAgICAgICAgICAgICAgICAgIGtleUluZGV4ID0gdHJhY2suYXVkaW9fc3VtbWFyeS5rZXksXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFZvY2FidWxhcnkua2V5c1trZXlJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGVJbmRleCA9IHRyYWNrLmF1ZGlvX3N1bW1hcnkubW9kZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IFZvY2FidWxhcnkubW9kZXNbbW9kZUluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcG8gPSBNYXRoLnJvdW5kKHRyYWNrLmF1ZGlvX3N1bW1hcnkudGVtcG8pLFxuICAgICAgICAgICAgICAgICAgICBjYW1lbG90VGFnID0gVm9jYWJ1bGFyeS5oYXJtb25pY01peFttb2RlXVtrZXldLnRhZztcblxuICAgICAgICAgICAgICAgIC8vIE9uIGFsaW1lbnRlIHVuIHRhYmxlYXUgZGUgbW9yY2VhdXggcG91ciBkZXMgdHJpcyB1bHTDqXJpZXVyc1xuICAgICAgICAgICAgICAgIHZhciB0b3BUcmFjayA9IG5ldyBNdXNpYy5UcmFjayh0b3BUcmFja0lkLCB0aXRsZSwgYXJ0aXN0LCBjb3Zlciwga2V5LCBtb2RlLCB0ZW1wbywgY2FtZWxvdFRhZywgW10pO1xuICAgICAgICAgICAgICAgIHNpbWlsYXJUcmFja3MucHVzaCh0b3BUcmFjayk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vLyBMb3JzcXVlIHNlIHRlcm1pbmVudCB0b3V0ZXMgbGVzIHJlcXXDqnRlcyBBamF4IGVuIGNvdXJzLi4uXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKGZ1bmN0aW9uKCkge1xuICAvLyAuLi4gb24gZW5sw6h2ZSBsZSBsb2FkZXIgdnUgcXVlIGMnZXN0IGxhIGZpbiBkZXMgcmVxdcOqdGVzLi4uXG4gICQoIFwiLnVpLnBhZ2UuZGltbWVyXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuICAvLyAuLi4gZXQgb24gbGFuY2UgbGUgdHJpIGRlcyBtb3JjZWF1eCByw6ljdXDDqXLDqXMgKHMnaWwgeSBlbiBhKVxuICBpZiAoc2ltaWxhclRyYWNrcy5sZW5ndGggPiAwKSB7XG4gICAgc2ltaWxhclRyYWNrcyA9IHNvcnRpbmdTdHJhdGVneS5zb3J0KHJlZlRyYWNrLCBoYXJtb255LCBzaW1pbGFyVHJhY2tzKTtcbiAgICBkaXNwbGF5VHJhY2tzKHNpbWlsYXJUcmFja3MpO1xuICB9XG59KTtcblxuLy8gQWZmaWNoYWdlIGRlcyBtb3JjZWF1eCBzZWxvbiB1biBvcmRyZSBkw6l0ZXJtaW7DqSBwYXIgbGUgdHJpXG5mdW5jdGlvbiBkaXNwbGF5VHJhY2tzKHRyYWNrcykge1xuXG4gIC8vIFLDqWluaXRpYWxpc2F0aW9uIGRlIGxhIHpvbmUgZCdhZmZpY2hhZ2VcbiAgJGhhcm1vbmljVHJhY2tzLm1DdXN0b21TY3JvbGxiYXIoIFwiZGVzdHJveVwiICk7XG4gICRoYXJtb25pY1RyYWNrcy5lbXB0eSgpO1xuXG4gIHZhciBodG1sID0gXCJcIjtcblxuICAvLyBIZWFkZXIgZHUgdGVtcGxhdGUgZGUgc3VnZ2VzdGlvbnNcbiAgaHRtbCArPSAnPGEgY2xhc3M9XCJpdGVtIHRpdGxlXCI+JztcbiAgaHRtbCArPSAnIDxoMj5TdWdnZXN0aW9uczwvaDI+JztcbiAgaHRtbCArPSAnPC9hPic7XG4gIGh0bWwgKz0gJzxhIGlkPVwidHJhY2tzLWhlbHBcIiBocmVmPVwiI1wiPic7XG4gIGh0bWwgKz0gJyAgPGkgY2xhc3M9XCJoZWxwIGNpcmNsZSBpY29uXCI+PC9pPic7XG4gIGh0bWwgKz0gJzwvYT4nO1xuXG4gIGl0ZXJhdG9yID0gbmV3IEl0ZXJhdG9yKHRyYWNrcyk7XG4gIHdoaWxlIChpdGVyYXRvci5oYXNOZXh0KCkpIHtcblxuICAgIHZhciBpdGVtID0gaXRlcmF0b3IubmV4dCgpLFxuICAgICAgICBhcnRpc3ROYW1lID0gaXRlbS5nZXRBcnRpc3QoKSxcbiAgICAgICAgbWF4U3RyaW5nTGVuZ3RoID0gMTAwLFxuICAgICAgICB0ZW1wb0Nzc0NsYXNzID0gXCJyZWRcIixcbiAgICAgICAgdG9uYWxpdHlDc3NDbGFzcyA9IFwicmVkXCI7XG5cbiAgICAvLyBPbiBnw6hyZSBsZSBjYXMgb8O5IGxlIG5vbSBkZSBsJ2FydGlzdGUgZXN0IGV4YWfDqXLDqW1lbnQgbG9uZ1xuICAgIGlmIChhcnRpc3ROYW1lLmxlbmd0aCA+IG1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgYXJ0aXN0TmFtZSA9IGFydGlzdE5hbWUuc3Vic3RyKDAsIG1heFN0cmluZ0xlbmd0aCkgKyBcIiAuLi5cIjtcbiAgICB9XG5cbiAgICAvLyBPbiBzaWduYWxlIGxlcyBtb3JjZWF1eCBjb21wYXRpYmxlcyBlbiB0ZXJtZXMgZGUgdGVtcG9cbiAgICBpZiAoaXRlbS5nZXRUZW1wbygpID49IGhhcm1vbnkudGVtcG9NaW4oKSAmJiBpdGVtLmdldFRlbXBvKCkgPD0gaGFybW9ueS50ZW1wb01heCgpKSB7XG4gICAgICB0ZW1wb0Nzc0NsYXNzID0gXCJncmVlblwiO1xuICAgIH1cblxuICAgIC8vIE9uIHNpZ25hbGUgbGVzIG1vcmNlYXV4IGNvbXBhdGlibGVzIGVuIHRlcm1lcyBkZSB0b25hbGl0w6lcbiAgICBpZiAoJC5pbkFycmF5KGl0ZW0uZ2V0Q2FtZWxvdFRhZygpLCByZWZUcmFjay5nZXRIYXJtb25pZXMoKSkgIT0gLTEpIHtcbiAgICAgIHRvbmFsaXR5Q3NzQ2xhc3MgPSBcImdyZWVuXCI7XG4gICAgfVxuXG4gICAgLy8gQ3LDqWF0aW9uIGR1IHRlbXBsYXRlIGNvbXBsZXQgcG91ciBhZmZpY2hhZ2UgZGVzIHN1Z2dlc3Rpb25zXG4gICAgaHRtbCArPSAnPGEgY2xhc3M9XCJoYXJtb25pYy10cmFja1wiPic7XG4gICAgaHRtbCArPSAnIDxmaWd1cmU+JztcbiAgICBodG1sICs9ICcgICA8aW1nIHNyYz1cIicgKyBpdGVtLmdldENvdmVyKCkgKyAnXCIgYWx0PVwiJyArIGl0ZW0uZ2V0VGl0bGUoKSArICdcIj4nO1xuICAgIGh0bWwgKz0gJyAgIDxmaWdjYXB0aW9uPic7XG4gICAgaHRtbCArPSAnICAgICA8ZGl2Pic7XG4gICAgaHRtbCArPSAnICAgICAgPGgzPicgKyBpdGVtLmdldFRpdGxlKCkgKyAnPC9oMz4nO1xuICAgIGh0bWwgKz0gJyAgICAgIDxwIGNsYXNzPVwiYXJ0aXN0LW5hbWVcIj4nICsgYXJ0aXN0TmFtZSArICc8L3A+JztcbiAgICBodG1sICs9ICcgICAgICA8cCBjbGFzcz1cIicgKyB0ZW1wb0Nzc0NsYXNzICsgJ1wiPlRlbXBvIDogJyArIGl0ZW0uZ2V0VGVtcG8oKSArICcgQlBNPC9wPic7XG4gICAgaHRtbCArPSAnICAgICAgPHAgY2xhc3M9XCInICsgdG9uYWxpdHlDc3NDbGFzcyArICdcIj5Ub25hbGl0w6kgOiAnICsgaXRlbS5nZXRLZXkoKSArICcgJyArIGl0ZW0uZ2V0TW9kZSgpICsgJzwvcD4nO1xuICAgIGh0bWwgKz0gJyAgICAgPC9kaXY+JztcbiAgICBodG1sICs9ICcgICA8L2ZpZ2NhcHRpb24+JztcbiAgICBodG1sICs9ICcgPC9maWd1cmU+JztcbiAgICBodG1sICs9ICcgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiB2YWx1ZT1cIicgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoaXRlbSkpICsgJ1wiPic7XG4gICAgaHRtbCArPSAnPC9hPic7XG5cbiAgfVxuXG4gIC8vIEFmZmljaGFnZSBkZXMgcsOpc3VsdGF0c1xuICAkaGFybW9uaWNUcmFja3MuYXBwZW5kKGh0bWwpO1xuICAkaGFybW9uaWNUcmFja3MubUN1c3RvbVNjcm9sbGJhcigpO1xuICAkaGFybW9uaWNUcmFja3NcbiAgICAuc2lkZWJhcignc2V0dGluZycsICd0cmFuc2l0aW9uJywgJ3NjYWxlIGRvd24nKVxuICAgIC5zaWRlYmFyKCBcInNob3dcIiApO1xuXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV84ZGQwN2QyYy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiKzdaSnAwXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIis3WkpwMFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
