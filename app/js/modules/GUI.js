module.exports = GUI = {
  notifAllowed: true,
  tempoVariation: 0.05,
  currentSorting: "default",
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
            console.log("Slide index " + index + " image " + slideSettings.src);
        }
    });
    $( "#main" ).vegas('pause');

    // Drag & drop sur l'iPod et sur les listes de morceaux
    $( "#ipod-wrapper" ).draggable({ scroll: false });

    // Gestion de la scrollbar
    $( "#playlist, #favorites" ).mCustomScrollbar({
      theme:"dark",
      scrollInertia: 0
    });

    // Divers
    $( ".pusher" ).css("height", "100%");
    $( ".ui.checkbox" ).checkbox();
    GUI.listeners();
  },
  sidebars: {
    bottom: function() {
      $( ".bottom.sidebar" ).sidebar( "toggle" );
    },
    left: function() {
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
    right: function() {
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
    top: function() {
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
    leftBis: function() {
      $( "#harmonic-tracks" )
        .sidebar({
          onShow: function() {
            $( "#suggestions-btn" ).addClass( "black-item" );
          },
          onHide: function() {
            $( "#suggestions-btn" ).removeClass( "black-item" );
          }
        })
        .sidebar( "setting", "transition", "overlay")
        .sidebar( "toggle" );
    }
  },
  controls: {
    previous: function() {
      alertify.success("Chargement du morceau précédent", 5);
    },
    play: function() {
      alertify.success("Lecture", 5);
    },
    pause: function() {
      alertify.warning("Pause", 5);
    },
    next: function() {
      alertify.success("Chargement du morceau suivant", 5);
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
      var $soundState = $( "#fav-sound .state" );
      if (GUI.notifAllowed) {
        GUI.favorites.displayMessage($soundState, "Son activé !", "Son désactivé !");
      }
      GUI.favorites.changeState($soundState);
    },
    duplicate: function() {
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
    }
  },
  listeners: function() {

    // Écouteurs d'événements des sidebars
    var sidebarEvents = [
                          ["#display-menu", "click", GUI.sidebars.bottom],
                          ["#playlist-btn", "click", GUI.sidebars.left],
                          ["#favorites-btn", "click", GUI.sidebars.right],
                          ["#ambiances-btn", "click", GUI.sidebars.top],
                          ["#suggestions-btn", "click", GUI.sidebars.leftBis]
                        ];

    addEvents(sidebarEvents);

    // Écouteurs d'événements des contrôles
    var controlsEvents = [
                           ["#previous-btn", "click", GUI.controls.previous],
                           ["#play-btn", "click", GUI.controls.play],
                           ["#pause-btn", "click", GUI.controls.pause],
                           ["#next-btn", "click", GUI.controls.next]
                         ];

    addEvents(controlsEvents);

    // Écouteurs d'événements des favoris
    var favoritesEvents = [
                           ["#fav-ipod", "click", GUI.favorites.ipod],
                           ["#fav-notify", "click", GUI.favorites.notify],
                           ["#fav-sound", "click", GUI.favorites.sound],
                           ["#fav-duplicate", "click", GUI.favorites.duplicate],
                           ["#fav-tempo-range", "change", GUI.favorites.tempoRange],
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
    var otherEvents = [ ["#tracks-help", "click", GUI.events.showInfoPopup] ]
    addEvents(otherEvents);

    // Fonction d'ajout d'événements
    function addEvents(e) {
      for (var i = 0; i < e.length; i++) {
        $( e[i][0] ).on( e[i][1], e[i][2] );
      }
    }

    $( ".harmonic-track" ).click(function() {
      alert("Toto");
    });

  }
}