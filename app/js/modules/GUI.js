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
