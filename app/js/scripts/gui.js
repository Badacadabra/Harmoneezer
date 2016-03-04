// Drag & drop sur l'iPod et sur les listes de morceaux
$( "#ipod-wrapper" ).draggable({ scroll: false });

 // Initialisation du carousel contenant tous les résultats de recherche
 var owl = $( "#tracks" );
 owl.owlCarousel({
   items: 10,
 });

 // Initialisation du carousel contenant tous les résultats a priori harmoniques
 var owl2 = $( "#harmonic-tracks" );
 owl2.owlCarousel({
   items: 10,
 });

// Gestion de la scrollbar
$( ".vertical.sidebar" ).mCustomScrollbar({
  theme:"dark",
  scrollInertia: 0
});

// Gestion des événements
var events = {
  showMenu: function() {
    $( ".bottom.sidebar" ).sidebar( "toggle" );
  },
  showPlaylist: function() {
    // $( "#main" ).vegas( "jump", 1);
    $( "#playlist" ).sidebar( "toggle" );
  },
  showFavorites: function() {
    // $( "#main" ).vegas( "jump", 2);
    $( "#favorites" ).sidebar( "toggle" );
  },
  mute: function() {
    // $( "#main" ).vegas( "jump", 3);
  },
  previous: function() {
    // Code
  },
  play: function() {
    // Code
  },
  pause: function() {
    // Code
  },
  next: function() {
    // Code
  },
  showInfoPopup: function() {
    $( ".ui.modal" ).modal( "show" );
  }
};

$( "#display-menu" ).click(events.showMenu);
$( "#playlist-btn" ).click(events.showPlaylist);
$( "#favorites-btn" ).click(events.showFavorites);
$( "#mute-btn" ).click(events.mute);
$( "#play-btn" ).click(events.play);
$( "#pause-btn" ).click(events.pause);
$( "#next-btn" ).click(events.next);
$( "#tracks-help" ).click(events.showInfoPopup);
$( ".harmonic-track" ).click(function() {
  alert("OK");
});

// Gestion des ambiances
/* $( "#main" ).vegas({
    transition: 'fade',
    slide: 0,
    slides: [
        { src: "./images/background/music.jpg" },
        { src: "./images/background/rock.jpg" },
        { src: "./images/background/house.jpg" },
        { src: "./images/background/country.jpg" },
        { src: "./images/background/metal.jpg" },
    ],
    animation: 'kenburns',
    walk: function (index, slideSettings) {
        console.log("Slide index " + index + " image " + slideSettings.src);
    }
});

$( "#main" ).vegas('pause'); */
