// Drag & drop sur l'iPod et sur les listes de morceaux
$( "#ipod" ).draggable({ containment: "parent", scroll: false });
$( "#tracks, #harmonic-tracks" ).draggable({
    axis: "x",
    helper: function(){
        return $( "<div></div>" ).css( "opacity", 0);
    },
    drag: function(event, ui) {
        var p = ui.helper.position();
        $( this ).stop().animate({
            left: p.left
        }, 700, "easeOutCirc");
    }
 });

// Gestion du footer
$( "#displayFooter" ).click(function() {
    $( this ).toggleClass( "active" );
});

// Parcours des morceaux suggérés à partir du morceau sélectionné


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
