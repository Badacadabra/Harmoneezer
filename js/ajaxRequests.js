// À la soumission du formulaire, on lance la cascade de requêtes AJAX
$( document ).ready(function() {
    $( "#search" ).submit(function(e) {
        e.preventDefault();
        searchTracks();
    });
});

// Recherche de morceaux (Deezer)
function searchTracks() {

    var keyword = $( "#deezer-selection" ).val();

    request = new AjaxRequestFactory().getAjaxRequest("deezer", "/search/track");
    request.addParam("q", keyword);
    request.addParam("limit", 20);
    request.send(success, null);

    function success(response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            var track = response.data[i];

            var html = "<div id=\"" + track.id + "\" class=\"track\">";
                html += "<span class=\"artist-name\">" + track.artist.name  + "</span>";
                html += "<img src=\"" + track.album.cover_medium + "\" alt=\"" + track.title + "\">";
                html += "<a href=\"#\">" + track.title + "</a>";
                html += "</div>";

            $( "#tracks" ).append(html);
            $( "#results" ).fadeIn();
            selectedTrack(track.id);
        }
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(id) {
    $( "#" + id ).click(function() {
        $( ".ui.page.dimmer" ).addClass( "active" );
        $( "#tracks" ).fadeOut();
        $.when(getInitialAudioSummary(id)).then(getTrackInfos(id));
    });
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
function getInitialAudioSummary(trackId) {

    request = new AjaxRequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + trackId);
    request.send(success, null);

    function success(final) {
        if (final.response.track != undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);

                var track = final.response.track,
                    title = track.title,
                    artist = track.artist,
                    keyIndex = track.audio_summary.key,
                    key = keys[keyIndex],
                    modeIndex = track.audio_summary.mode,
                    mode = modes[modeIndex],
                    tempo = Math.round(track.audio_summary.tempo);

                buildRefTrackProfile(title, artist, key, mode, tempo);
            }
        }
    }

}

// Fonction construisant le profil du morceau de référence
var refTrack;
refTrack = new Track("Inconnu", "Inconnu", "Inconnu", "Inconnu", 0, "Inconnu", []);

function buildRefTrackProfile(title, artist, key, mode, tempo) {
    var camelotTag = harmonicMix[mode][key]["tag"];
    var harmonies = camelotWheel[camelotTag]["matches"];
    refTrack = new Track(title, artist, key, mode, tempo, camelotTag, harmonies);
    buildHarmonyProfile(refTrack);
}

// Fonction construisant le profil de l'harmonie recherchée
var harmony;
harmony = new Harmony(refTrack);

function buildHarmonyProfile(track) {
    harmony = new Harmony(track);
}

// Récupération des informations sur un morceau (Deezer)
function getTrackInfos(trackId) {

    request = new AjaxRequestFactory().getAjaxRequest("deezer", "/track/" + trackId);
    request.send(success, null);

    function success(response) {
        console.log(response);
        var artistId = response.artist.id;
        getSimilarArtists(artistId);
    }

}

// Récupération des artistes similaires (Deezer)
function getSimilarArtists(artistId) {

    request = new AjaxRequestFactory().getAjaxRequest("deezer", "/artist/" + artistId + "/related");
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

// Récupération des 10 chansons les plus populaires de chaque artiste similaire (Deezer)
function getTopTracks(similarArtists) {

    request = new AjaxRequestFactory().getAjaxRequest("deezer", "/batch");
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
                $( ".ui.page.dimmer" ).removeClass( "active" );
                // topTracksIds.push(topTrack.id);
            });
        }
        // getTopTracksInfos(topTracksIds);
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfos(topTrackId, cover) {

    request = new AjaxRequestFactory().getAjaxRequest("echonest", "/track/profile");
    request.addParam("id", "deezer:track:" + topTrackId);
    request.send(success, null);

    function success(final) {
        if (final.response.track != undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);

                var track = final.response.track,
                    title = track.title,
                    artist = track.artist,
                    keyIndex = track.audio_summary.key,
                    key = keys[keyIndex],
                    modeIndex = track.audio_summary.mode,
                    mode = modes[modeIndex],
                    tempo = Math.round(track.audio_summary.tempo),
                    camelotTag = harmonicMix[mode][key]["tag"];

                // if (parseInt(tempo) >= refTrackTempoMin
                //        && parseInt(tempo) <= refTrackTempoMax
                //        && $.inArray(refTrackCamelotTag, matchingHarmonies) != -1) {
                    str = "<div class=\"harmonic-track\">";
                    str += "<span class=\"artist-name\">" + artist + "</span>";
                    str += "<img src=\"" + cover + "\" alt=\"" + title + "\">";
                    str += "<a href=\"#\">" + title + "</a>";
                    str += "<span>Mode : " + mode + "</span>";
                    str += "<span>Tonalité : " + key + "</span>";
                    str += "<span>Tag courant : " + camelotTag + "</span>";
                    str += "<span>Tag de référence : " + refTrack.getCamelotTag();
                    str += "<span>Tempo : " + tempo + " BPM</span>";
                    str += "<span>Tempo de référence : " + refTrack.getTempo() + " BPM</span>";
                    str += "<span>Tempo min : " + harmony.tempoMin() + " BPM</span>";
                    str += "<span>Tempo max : " + harmony.tempoMax() + " BPM</span>";
                    str += "<span>Harmonies possibles : " + refTrack.getHarmonies() + "</span>";
                    if (parseInt(tempo) >= harmony.tempoMin()
                        && parseInt(tempo) <= harmony.tempoMax()
                        && $.inArray(camelotTag, refTrack.getHarmonies()) != -1) {
                        str += "<div style=\"color:red;\">Ce morceau devrait faire partie de la playlist !</div>";
                    }
                    str += "</div>";
                    $( "#harmonic-tracks" ).append( str );

               // }
            }
        }
    }

}
