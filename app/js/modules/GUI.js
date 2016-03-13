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
    $( "#export-btn" ).popup();
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
    toggleAbout: function() {
      alertify.alert().set({'startMaximized':true, 'message':'Start Maximized: true'}).show();
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
      var colors = ["blue", "red", "green", "violet"];
      $( ".sidebar" ).not( "#menu, #harmonic-tracks" ).each(function(i, elt) {
        var id = $( elt ).attr( "id" );
        GUI.menu.toggleSidebar( "#" + id, colors[i]);
      });
    }
  },
  controls: {
    previous: function() {
      DZ.player.prev();
    },
    play: function() {
      if (GUI.tracksLoaded) {
        DZ.player.play();
      } else {
        DZ.player.playTracks(playlist.tracksIds);
        GUI.tracksLoaded = true;
      }
    },
    pause: function() {
      DZ.player.pause();
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
      GUI.favorites.displayMessage($soundState, "Son activé !", "Son désactivé !");
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
    showInfoPopup: function() {
      $( ".ui.modal" ).modal( "show" );
    },
    addTrackToPlaylist: function() {
      var track = JSON.parse(decodeURIComponent($( this ).children().eq(1).val()));
      playlist.addTrackToPlaylist(track);
      GUI.tracksLoaded = false;
      if (GUI.notifAllowed) {
        alertify.success("Morceau ajouté à votre playlist", 5);
      }
    },
    export: function() {
      $( "#csv-export" ).tableToCSV();
    },
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
                        ["#about-btn", "click", GUI.menu.toggleAbout],
                        [".toggle-all", "click", GUI.menu.toggleAll]
                      ];

    addEvents(menuEvents);

    // Écouteurs d'événements des contrôles
    var controlsEvents = [
                           [".previous-btn", "click", GUI.controls.previous],
                           [".play-btn", "click", GUI.controls.play],
                           [".pause-btn", "click", GUI.controls.pause],
                           [".next-btn", "click", GUI.controls.next]
                         ];

    addEvents(controlsEvents);

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
                        ["#tracks-help", "click", GUI.events.showInfoPopup, "async"],
                        [".harmonic-track", "click", GUI.events.addTrackToPlaylist, "async"],
                        ["#export-btn", "click", GUI.events.export],
                        ["#logo", "click", GUI.events.logo]
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
