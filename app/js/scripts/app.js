// Import des modules
var Vocabulary = require('../modules/Vocabulary.js'),
    Iterator = require('../modules/Iterator.js'),
    Music = require('../modules/Music.js'),
    Ajax = require('../modules/Ajax.js');

// Variables globales
var searchedTracks = [],
    similarTracks = [],
    refTrack,
    harmony,
    tempoVariation = 0.05;

// Point d'entrée de l'application
$( document ).ready(function() {

    // À la soumission du formulaire, on lance la cascade de requêtes AJAX
    $( "#search" ).submit(function(e) {
        e.preventDefault();
        searchTracks();
        $( "#harmonic-tracks" ).hide();
    });

    // Gestion de l'autocomplétion dans le champ de recherche
    /* $( "#deezer-selection" ).keyup(function() {
      var minCharacters = 3;
      if ($( this ).val().length >= minCharacters) {
        searchTracks();
      }
    }); */

});

// Variation du tempo définie par l'utilisateur
$( "input[type='range']" ).change(function() {
  tempoVariation = $( this ).val() / 100;
  console.log(tempoVariation);
});

// Recherche de morceaux (Deezer)
function searchTracks() {

    var keyword = $( "#deezer-selection" ).val();
    $( "#results" ).hide();
    owl.empty();

    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, null);

    function success(response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {

            var track = response.data[i],
                artistName = track.artist.name,
                maxStringLength = 100;

            if (artistName.length > maxStringLength) {
              artistName = artistName.substr(0, maxStringLength) + " ...";
            }

            var html = '<div id="' + track.id + '" class="track">';
                html += ' <figure>';
                html += '   <img src="' + track.album.cover_medium + '" alt="' + track.title + '">';
                html += '   <figcaption>';
                html += '     <div>';
                html += '       <h3 class="track-title">' + track.title + '</h3>';
                html += '       <p class="artist-name">' + artistName + "</p>";
                html += '     </div>';
                html += '   </figcaption>';
                html += ' </figure>';
                html += '</div>';

            owl.data('owlCarousel').addItem(html);
            $( "#results" ).fadeIn();

            selectedTrack(track.id);
        }
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(id) {
    $( "#" + id ).click(function() {
        $( ".ui.page.dimmer" ).addClass( "active" );
        getInitialAudioSummary(id);
        getTrackInfos(id);
        searchedTracks.push(id);
        initPlayer();
    });
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
function getInitialAudioSummary(trackId) {

    request = new Ajax.RequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + trackId);
    request.send(success, null);

    function success(final) {
        if (final.response.track !== undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);

                var track = final.response.track,
                    title = track.title,
                    artist = track.artist,
                    keyIndex = track.audio_summary.key,
                    key = Vocabulary.keys[keyIndex],
                    modeIndex = track.audio_summary.mode,
                    mode = Vocabulary.modes[modeIndex],
                    tempo = Math.round(track.audio_summary.tempo);

                buildRefTrackProfile(title, artist, "", key, mode, tempo);
            }
        }
    }

}

// Fonction construisant le profil du morceau de référence
refTrack = new Music.Track("Inconnu", "Inconnu", "Inconnu", "Inconnu", "Inconnu", 0, "Inconnu", []);

function buildRefTrackProfile(title, artist, cover, key, mode, tempo) {
    var camelotTag = Vocabulary.harmonicMix[mode][key].tag;
    var harmonies = Vocabulary.camelotWheel[camelotTag].matches;
    refTrack = new Music.Track(title, artist, cover, key, mode, tempo, camelotTag, harmonies);
    buildHarmonyProfile(refTrack);
}

// Fonction construisant le profil de l'harmonie recherchée
harmony = new Music.Harmony(refTrack, tempoVariation, true);

function buildHarmonyProfile(track) {
    harmony = new Music.Harmony(track, tempoVariation, true);
}

// Récupération des informations sur un morceau (Deezer)
function getTrackInfos(trackId) {

    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/track/" + trackId);
    request.send(success, null);

    function success(response) {
        console.log(response);
        var artistId = response.artist.id;
        getSimilarArtists(artistId);
    }

}

// Récupération des artistes similaires (Deezer)
function getSimilarArtists(artistId) {

    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/artist/" + artistId + "/related");
    request.addParam("limit", 20);
    request.send(success, null);

    function success(response) {
        console.log(response);
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

// Récupération des 20 chansons les plus populaires de chaque artiste similaire (Deezer)
function getTopTracks(similarArtists) {

    request = new Ajax.RequestFactory().getAjaxRequest("deezer", "/batch");
    request.addParam("limit", 20);
    request.addParam("methods", similarArtists);
    request.send(success, null);

    function success(response) {
        console.log(response);
        // var topTracksIds = [];
        for (var i = 0; i < response.batch_result.length; i++) {
            var artist = response.batch_result[i];
            $.each(artist.data, function(i, item) {
                var topTrack = item;
                var cover = item.album.cover_medium;
                getTopTrackInfos(topTrack.id, cover);
                // topTracksIds.push(topTrack.id);
            });
        }
        // getTopTracksInfos(topTracksIds);
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfos(topTrackId, cover) {

    request = new Ajax.RequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + topTrackId);
    request.send(success, null);

    function success(final) {
        // Il faut impérativement que les morceaux aient un résumé audio sur Echo Nest
        if (final.response.track !== undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);
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
                var topTrack = new Music.Track(title, artist, cover, key, mode, tempo, camelotTag, []);
                similarTracks.push(topTrack);

            }
        }
    }

}

// Tri des morceaux selon les critères choisis par l'utilisateur à la fin des requêtes Ajax
$( document ).ajaxStop(function() {
  sortTracks();
});

function sortTracks() {
  if (similarTracks.length !== 0) {

    var nbPerfectMatches = 0;
    var artists = [];
    var tracks = [];

    for (var i = 0; i < similarTracks.length; i++) {

      var currentArtist = similarTracks[i].getArtist(),
          currentTempo = similarTracks[i].getTempo(),
          tempoMin = harmony.tempoMin(),
          tempoMax = harmony.tempoMax(),
          isMatching = ($.inArray(similarTracks[i].getCamelotTag(), refTrack.getHarmonies()) != -1),
          item = similarTracks[i];

      // Si l'artiste n'a pas été rencontré dans les suggestions précédentes...
      if ($.inArray(currentArtist, artists) == -1) {
        artists.push(currentArtist);
        tracks.push(similarTracks[i]);
      } else {
        continue;
      }

      // Si un morceau remplit toutes les conditions du mix harmonique...
      if (currentTempo >= tempoMin && currentTempo <= tempoMax && isMatching) {
          nbPerfectMatches++;
          similarTracks.splice(i, 1);
          similarTracks.splice(0, 0, item);
        // Si un morceau remplit une condition (tempo ou tonalité) du mix harmonique
      } else if ((currentTempo >= tempoMin && currentTempo <= tempoMax) || isMatching) {
          similarTracks.splice(i, 1);
          similarTracks.splice(nbPerfectMatches, 0, item);
      }

    }
    displayTracks(tracks);
  }
}

// Affichage des morceaux selon un ordre déterminé par le tri
function displayTracks(tracks) {
  console.log(tracks);
  iterator = new Iterator(tracks);
  while (iterator.hasNext()) {
    // console.log(iterator.next());
    var item = iterator.next(),
        artistName = item.getArtist(),
        maxStringLength = 100,
        tempoCssClass = "red",
        tonalityCssClass = "red";

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

    // Création du template pour affichage
    html = '<div class="harmonic-track">';
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
    /* html += "<div>Tag courant : " + camelotTag + "</div>";
    html += "<div>Tag de référence : " + refTrack.getCamelotTag() + "</div>";
    html += "<div>Tempo de référence : " + refTrack.getTempo() + " BPM</div>";
    html += "<div>Tempo min : " + harmony.tempoMin() + " BPM</div>";
    html += "<div>Tempo max : " + harmony.tempoMax() + " BPM</div>";
    html += "<div>Harmonies possibles : " + refTrack.getHarmonies() + "</div>";
    if (parseInt(tempo) >= harmony.tempoMin()
        && parseInt(tempo) <= harmony.tempoMax()
        && $.inArray(camelotTag, refTrack.getHarmonies()) != -1) {
        html += "<div style=\"color:red;\">Ce morceau devrait faire partie de la playlist !</div>";
    }*/
    html += '</div>';

    owl2.data('owlCarousel').addItem(html);
    $( ".ui.page.dimmer" ).removeClass( "active" );
  }
}
