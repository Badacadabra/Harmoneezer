// Drag & drop sur l'iPod et sur les listes de morceaux
$( "#ipod-wrapper" ).draggable({ containment: "parent", scroll: false });

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

// Gestion du footer
$( "#displayFooter" ).click(function() {
    $( this ).toggleClass( "active" );
});

// Gestion des ambiances
$( "body" ).vegas({
    delay: 3000,
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

$( "body" ).vegas('pause');
