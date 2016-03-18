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
