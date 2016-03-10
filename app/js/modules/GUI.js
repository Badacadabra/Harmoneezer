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
  currentSorting: "default",
  content: [],
  init: function() {
    // Gestion des ambiances
    $( "#main" ).vegas({
        transition: 'fade',
        slide: 0,
        slides: [
            { src: "./images/background/music.jpg" },
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
    $( "#main" ).vegas('pause');

    // Initialisation du carousel
    $( "#tracks" ).owlCarousel({
      items: 10,
      pagination: false,
      autoPlay: true,
      autoplayTimeout: 100,
      stopOnHover: true,
      lazyLoad : true
    });

    // Drag & drop sur l'iPod et sur les listes de morceaux
    $( "#ipod-wrapper" ).draggable({ scroll: false });

    // Activation des tooltips personnalisées
    $( "[title != '']" ).qtip({
        style: {
            classes: 'qtip-dark'
        }
    });

    // Gestion de la scrollbar
    $( "#playlist, #favorites" ).mCustomScrollbar({
      theme:"dark",
      scrollInertia: 0
    });

    // Divers
    $( ".pusher" ).css("height", "100%");
    $( ".ui.checkbox" ).checkbox();
    $( "#export-btn" ).popup();
    GUI.listeners();

  },
  menu: {
    show: function() {
      $( ".bottom.sidebar" ).sidebar( "toggle" );
    },
    togglePlaylist: function() {
      $( "#playlist" )
        .sidebar({
          onShow: function() {
            $( "#playlist-btn" ).addClass( "blue-item" );
          },
          onHide: function() {
            $( "#playlist-btn" ).removeClass( "blue-item" );
          }
        })
        .sidebar( "toggle" );
    },
    toggleFavorites: function() {
      $( "#favorites" )
        .sidebar({
          onShow: function() {
            $( "#favorites-btn" ).addClass( "red-item" );
          },
          onHide: function() {
            $( "#favorites-btn" ).removeClass( "red-item" );
          }
        })
        .sidebar( "toggle" );
    },
    toggleAtmospheres: function() {
      $( "#atmospheres" )
        .sidebar({
          onShow: function() {
            $( "#ambiances-btn" ).addClass( "green-item" );
          },
          onHide: function() {
            $( "#ambiances-btn" ).removeClass( "green-item" );
          }
        })
        .sidebar( "toggle" );
    },
    toggleSuggestions: function() {
      $( "#harmonic-tracks" )
        .sidebar({
          onShow: function() {
            $( "#suggestions-btn" ).addClass( "violet-item" );
          },
          onHide: function() {
            $( "#suggestions-btn" ).removeClass( "violet-item" );
          }
        })
        .sidebar( "setting", "transition", "overlay" )
        .sidebar( "toggle" );
    },
    toggleAbout: function() {
        alertify.alert().set({'startMaximized':true, 'message':'Start Maximized: true'}).show();
    },
    displayAll: function() {
      $( ".sidebar" ).not( "#harmonic-tracks" )
        .sidebar( "setting", "transition", "overlay" )
        .sidebar( "toggle" );
    }
  },
  controls: {
    previous: function() {
      if (GUI.notifAllowed) {
        alertify.success("Chargement du morceau précédent", 5);
      }
      DZ.player.prev();
    },
    play: function() {
      if (GUI.notifAllowed) {
        alertify.success("Lecture", 5);
      }
      DZ.player.play();
    },
    pause: function() {
      if (GUI.notifAllowed) {
        alertify.warning("Pause", 5);
      }
      DZ.player.pause();
    },
    next: function() {
      if (GUI.notifAllowed) {
        alertify.success("Chargement du morceau suivant", 5);
      }
      DZ.player.next();
    }
  },
  favorites: {
    ipod: function() {
      var $ipod = $( "#ipod-wrapper" );
      if ($ipod.is( ":visible" )) {
        $ipod.fadeOut();
      } else {
        $ipod.fadeIn();
      }
      var $ipodState = $( "#fav-ipod .state" );
      if (GUI.notifAllowed) {
        GUI.favorites.displayMessage($ipodState, "iPod activé !", "iPod désactivé !");
      }
      GUI.favorites.changeState($ipodState);
    },
    notify: function() {
      GUI.notifAllowed ? (GUI.notifAllowed = false) : (GUI.notifAllowed = true);
      var $notifState = $( "#fav-notify .state" );
      GUI.favorites.displayMessage($notifState, "Notifications activées !", "Notifications désactivées !");
      GUI.favorites.changeState($notifState);
    },
    sound: function() {
      GUI.soundAllowed ? (GUI.soundAllowed = false) : (GUI.soundAllowed = true);
      var $soundState = $( "#fav-sound .state" );
      if (GUI.notifAllowed) {
        GUI.favorites.displayMessage($soundState, "Son activé !", "Son désactivé !");
      }
      GUI.favorites.changeState($soundState);
    },
    duplicate: function() {
      GUI.duplicatesAllowed ? (GUI.duplicatesAllowed = false) : (GUI.duplicatesAllowed = true);
      var $duplicateState = $( "#fav-duplicate .state" );
      if (GUI.notifAllowed) {
        GUI.favorites.displayMessage($duplicateState, "Doublons activés !", "Doublons désactivés !");
      }
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
      if ($state.val() == "activated") {
        alertify.error(negativeMessage, 5);
      } else {
        alertify.success(positiveMessage, 5);
      }
    },
    tempoRange: function() {
      var tempoVariation = $( "input[type='range']" ).val();
      $( "input[type='range'] + span" ).text(tempoVariation + " %");
      GUI.tempoVariation = (tempoVariation / 100);
    },
    defaultSorting: function() {
      GUI.currentSorting = "default";
    },
    tempoSorting: function() {
      GUI.currentSorting = "tempoFirst";
    },
    keySorting: function() {
      GUI.currentSorting = "keyFirst";
    },
    ascTempoSorting: function() {
      GUI.currentSorting = "ascTempo";
    },
    descTempoSorting: function() {
      GUI.currentSorting = "descTempo";
    },
    noSorting: function() {
      GUI.currentSorting = "none";
    }
  },
  atmospheres: {
    applyAtmosphere: function(index) {
      $( "#main" ).vegas( "jump", index );
    }
  },
  events: {
    showInfoPopup: function() {
      $( ".ui.modal" ).modal( "show" );
    },
    harmonicTrack: function() {
      alert("Toto");
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
                        [".display-menu", "click", GUI.menu.show],
                        ["#playlist-btn", "click", GUI.menu.togglePlaylist],
                        ["#favorites-btn", "click", GUI.menu.toggleFavorites],
                        ["#ambiances-btn", "click", GUI.menu.toggleAtmospheres],
                        ["#suggestions-btn", "click", GUI.menu.toggleSuggestions],
                        ["#about-btn", "click", GUI.menu.toggleAbout],
                        [".display-all", "click", GUI.menu.displayAll]
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
      $( element ).click(function() {
        $( this ).addClass( "green-item" );
        $( this ).siblings().removeClass( "green-item" );
        GUI.atmospheres.applyAtmosphere(index);
      });
    });

    // Écouteurs d'événements divers
    var otherEvents = [
                        ["#tracks-help", "click", GUI.events.showInfoPopup, "async"],
                        [".harmonic-track", "click", GUI.events.harmonicTrack, "async"],
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
