// Import des modules
var Vocabulary = require('../modules/Vocabulary.js'),
    Iterator = require('../modules/Iterator.js'),
    Music = require('../modules/Music.js'),
    Ajax = require('../modules/Ajax.js'),
    GUI = require('../modules/GUI.js'),
    Sorting = require('../modules/Sorting.js'),
    Playlist = require('../modules/Playlist.js');

// Variables diverses
var similarTracks = [],
    refId,
    refTrack,
    baseHarmony,
    factory;

// Sélecteurs jQuery
var $search,
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
$( document ).ready( init );

// Initialisation de l'application
function init() {

    GUI.init();

    $search = $( "#search" );
    $owl = $( "#tracks" );
    $harmonicTracks = $( "#harmonic-tracks" );

    factory = new Ajax.RequestFactory();

    $search.find( "input" ).keyup(function() {
      trackAutocomplete();
      GUI.search.hideAutocomplete();
    });

    go();

}

// Gestion de l'autocomplétion dans le champ de recherche
function trackAutocomplete() {

  // Autocomplétion OK
  if (GUI.autocompleteAllowed) {
    $search.find( "input" ).autocomplete({
        source: function( request, response ) {

          var keyword = $search.find( "input" ).val();

          request = factory.getAjaxRequest("deezer", "/search/track");
          request.addParam("q", keyword);
          request.addParam("limit", 10);
          request.send(success, error);

          function success(response) {

            $( "#autocomplete" ).empty();
            var html = "";

            for (var i = 0, len = response.data.length; i < len; i++) {
              var track = response.data[i],
                  customTrack = new Music.Track(
                                                  track.id,
                                                  track.title,
                                                  track.artist.name,
                                                  track.album.title,
                                                  track.album.release_date,
                                                  track.album.cover_medium,
                                                  "",
                                                  "",
                                                  0,
                                                  "",
                                                  []
                                                );

              html += GUI.template("autocomplete", customTrack, null, null);
              selectedTrack("autocomplete-" + track.id, customTrack);
            }
            $( "#autocomplete" ).append( html );
            $( "#autocomplete" ).show();
          }

          function error(response) {
            console.log(response);
          }
        },
        minLength: 3
      });
  } else { // Pas d'autocomplétion
    $search.find( "input" ).autocomplete({ source: [] });
  }

}

// À la soumission du formulaire, on récupère des morceaux sur Deezer
function go() {
  $search.submit(function(e) {
      e.preventDefault();
      if ($( window ).width() > 600) {
        searchTracks();
        GUI.alert("message", "Choisissez un morceau de référence", 5);
        $search.find( "input" ).val( "" );
      }
  });
}

// Gestion des algorithmes de tri des morceaux
function setSortingStrategy() {
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
}

// Recherche de morceaux sur Deezer
function searchTracks() {

    // Réinitialisation de la recherche
    if ($owl.is( ":visible" )) $owl.empty();
    GUI.cleanNotifications();

    var keyword = $search.find( "input" ).val();

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        // On récupère toutes les informations sur chaque morceau
        for (var i = 0, len = response.data.length; i < len; i++) {
            var track = response.data[i],
                customTrack = new Music.Track(
                                                track.id,
                                                track.title,
                                                track.artist.name,
                                                track.album.title,
                                                track.album.release_date,
                                                track.album.cover_medium,
                                                "",
                                                "",
                                                0,
                                                "",
                                                []
                                              );
            // On construit le template
            var html = GUI.template("base-track", customTrack, null, null);
            $owl.data('owlCarousel').addItem(html);
            // On ajoute un écouteur d'événement de type clic pour chaque morceau
            selectedTrack("submit-" + track.id, customTrack);
        }
        // On affiche les résultats
        $( "#toggle-carousel i" )
          .switchClass( "down", "up" )
          .css( "border-color", "#188AE3" );
    }

    function error(response) {
      console.log(response);
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(eltId, track) {
    $( document ).off( "click", "#" + eltId );
    $( document ).on( "click", "#" + eltId, function() {
        // On remet les compteurs à 0...
        if (similarTracks.length > 0) similarTracks = [];
        // On désactive la recherche
        GUI.search.off();
        // On définit la référence
        refId = eltId;
        refTrack = track;
        // Affectation d'un algorithme de tri
        setSortingStrategy();
        // On efface les notifications
        GUI.cleanNotifications();
        // On affiche un loader pour faire patienter l'internaute
        GUI.loading.on();
        // On récupère le résumé audio du morceau sélectionné sur Echo Nest
        getInitialAudioSummary(track.getId());
        // On récupère les informations détaillées du morceau sur Deezer
        getTrackInfo(track.getId());
    });
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
function getInitialAudioSummary(trackId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + trackId);
    request.addParam("bucket", "audio_summary");
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(final) {
        // Le morceau est-il trouvé sur Echo Nest à partir de l'identifiant Deezer ?
        if (final.response.track !== undefined) {
            GUI.alert("success", "Trouvé sur Echo Nest !", 3);
            // Le morceau trouvé sur Echo Nest a-t-il un résumé audio ?
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
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
                buildRefTrackProfile(key, mode, tempo);

                // On affiche tout ça à l'utilisateur
                var info = "<strong>« " + title + " »</strong><br>";
                    info += "<em>" + artist + "</em><br>";
                    info += "<u>Tonalité</u> : " + key + " " + mode + "<br>";
                    info += "<u>Tempo</u> : " + tempo + " BPM";

                GUI.alert("message", info, 0);
            } else {
              buildRefTrackProfile("", "", 0);
              GUI.alert("error", "Le résumé audio de ce morceau n'est pas disponible sur Echo Nest.", 10);
              GUI.alert("error", "Suggestion harmonique impossible", 10);
            }
        } else {
          buildRefTrackProfile("", "", 0);
          GUI.alert("error", "Ce morceau n'a pas été trouvé sur Echo Nest.", 10);
          GUI.alert("error", "Suggestion harmonique impossible", 10);
        }
    }

    function error(response) {
      console.log(response);
    }

}

// Construction du profil du morceau de référence
function buildRefTrackProfile(key, mode, tempo) {

    // On met à jour le morceau de référence avec les données musicales
    if (key !== "" && mode !== "" && tempo !== 0) {
      var camelotTag = Vocabulary.harmonicMix[mode][key].tag,
          harmonies = Vocabulary.camelotWheel[camelotTag].matches;

      refTrack.setKey(key);
      refTrack.setMode(mode);
      refTrack.setTempo(tempo);
      refTrack.setCamelotTag(camelotTag);
      refTrack.setHarmonies(harmonies);
    }

    // On ajoute le morceau à la playlist
    $( "#" + refId ).next().val(encodeURIComponent(JSON.stringify(refTrack)));
    GUI.playlist.addTrack(refId);

    // On en profite pour construire l'harmonie de base
    buildHarmonyProfile(refTrack);

}

// Construction du profil de base de l'harmonie recherchée
function buildHarmonyProfile(track) {
    harmony = new Music.Harmony(track, null, GUI.tempoVariation);
}

// Récupération des informations sur un morceau, notamment pour avoir l'id de l'artiste (Deezer)
function getTrackInfo(trackId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/track/" + trackId);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        getSimilarArtists(response.artist.id);
    }

    function error(response) {
      console.log(response);
    }

}

// Récupération des artistes similaires (Deezer)
function getSimilarArtists(artistId) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/artist/" + artistId + "/related");
    request.addParam("limit", 10);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        var artists = [];
        for (var i = 0, len = response.data.length; i < len; i++) {
            artists.push({
                "request_method":"get",
                "relative_url":"artist/" + response.data[i].id + "/top"
            });
        }
        artists = JSON.stringify(artists);
        getTopTracks(artists);
    }

    function error(response) {
      console.log(response);
    }

}

// Récupération des chansons les plus populaires de chaque artiste similaire (Deezer)
function getTopTracks(similarArtists) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("deezer", "/batch");
    request.addParam("limit", 10);
    request.addParam("methods", similarArtists);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(response) {
        // var ids = [];
        for (var i = 0, len = response.batch_result.length; i < len; i++) {
            var artist = response.batch_result[i];
            $.each(artist.data, function(i, item) {
                var topTrack = item,
                    album = item.album;

                // ids.push(topTrack.id);
                getTopTrackInfo(topTrack.id, album);
            });
        }
        // getTopTracksInfo(ids);
    }

    function error(response) {
      console.log(response);
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfo(id, album) {

    // Paramétrage et envoi de la requête
    request = factory.getAjaxRequest("echonest", "/track/profile"); // song...
    /* var tracksIds = [];
    for (var i = 0, len = ids.length; i < len; i++) {
      tracksIds.push("deezer:track:" + ids[i]);
    } */
    request.addParam("bucket", "audio_summary");
    request.addParam("id", "deezer:track:" + id);
    // request.addParam("track_id", tracksIds);
    request.send(success, error);

    // Traitement de la réponse au succès
    function success(final) {
        // Il faut que les morceaux soient trouvés sur Echo Nest
       if (final.response.track !== undefined) {
           // Il faut que les morceaux possèdent un résumé audio sur Echo Nest
           if (!$.isEmptyObject(final.response.track.audio_summary)) {
          // var ids = [];
          // for (var i = 0, len = final.response.songs.length; i < len; i++) {
            //  On récupère toutes les informations utiles
            var track = final.response.track, // final.response.songs[i]
                title = track.title,
                artist = track.artist, // track.artist_name
                keyIndex = track.audio_summary.key,
                key = Vocabulary.keys[keyIndex],
                modeIndex = track.audio_summary.mode,
                mode = Vocabulary.modes[modeIndex],
                tempo = Math.round(track.audio_summary.tempo),
                camelotTag = Vocabulary.harmonicMix[mode][key].tag;

            // ids.push(track.id);
            // On alimente un tableau de morceaux pour des tris ultérieurs
            var topTrack = new Music.Track(
                                            id,
                                            title,
                                            artist,
                                            album.title,
                                            album.release_date,
                                            album.cover_medium,
                                            key,
                                            mode,
                                            tempo,
                                            camelotTag, []
                                          );
            similarTracks.push(topTrack);
          // }
        }
      }
    }

    function error(response) {
      console.log(response);
    }

}

// Lorsque se terminent toutes les requêtes Ajax en cours...
$( document ).ajaxStop(function() {
  // ... on enlève le loader vu que c'est la fin des requêtes...
  GUI.loading.off();
  // ... et on lance le tri des morceaux récupérés (s'il y en a)
  if (similarTracks.length > 0) {
    similarTracks = sortingStrategy.sort(harmony, similarTracks);
    displayTracks(similarTracks);
  }
});

// Affichage des morceaux selon un ordre déterminé par le tri
function displayTracks(tracks) {

  $( "#autocomplete" ).hide();
  GUI.scroll.destroy($harmonicTracks);
  $harmonicTracks.empty();

  var html = GUI.template("help", null, null, null);

  // Itérations sur notre collection de morceaux
  iterator = new Iterator(tracks);
  while (iterator.hasNext()) {

    var track = iterator.next();

    harmony.setOtherTrack(track);
    var isTempoCompatible = harmony.tempoCompatibility(),
        isKeyCompatible = harmony.keyCompatibility();

    html += GUI.template("harmonic-track", track, isTempoCompatible, isKeyCompatible);
    selectedTrack("suggestion-" + track.getId(), track);

  }

  $harmonicTracks.append(html);
  GUI.scroll.reset($harmonicTracks);
  GUI.displayFinalTracklist();
  similarTracks = [];

}
