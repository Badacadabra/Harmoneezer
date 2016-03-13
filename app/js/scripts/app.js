// Import des modules
var Vocabulary = require('../modules/Vocabulary.js'),
    Iterator = require('../modules/Iterator.js'),
    Music = require('../modules/Music.js'),
    Ajax = require('../modules/Ajax.js'),
    GUI = require('../modules/GUI.js'),
    Sorting = require('../modules/Sorting.js'),
    Player = require('../modules/Player');

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
