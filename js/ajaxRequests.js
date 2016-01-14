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
        $( "#test" ).append( "<ul>" );
        for (var i = 0; i < response.data.length; i++) {
            var track = response.data[i];
            $( "#test ul" ).append("<li><a href=\"#\" id=\"" + track.id + "\" class=\"tracks\">" + track.title + " (" + track.artist.name + ")</a></li>");
            selectedTrack(track.id);
        }
    }

}

// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(id) {
    $( "#" + id ).click(function() {
        $( ".ui.page.dimmer" ).addClass( "active" );
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
                getTopTrackInfos(topTrack.id);
                $( ".ui.page.dimmer" ).removeClass( "active" );
                // topTracksIds.push(topTrack.id);
            });
        }
        // getTopTracksInfos(topTracksIds);
    }

}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
function getTopTrackInfos(topTrackId) {

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
                    str = "<ul>";
                    str += "<li>Morceau : " + title + "</li>";
                    str += "<li>Artiste : " + artist + "</li>";
                    str += "<li>Mode : " + mode + "</li>";
                    str += "<li>Tonalité : " + key + "</li>";
                    str += "<li>Tag (Camelot) du morceau courant : " + camelotTag + "</li>";
                    str += "<li>Tag (Camelot) du morceau de référence : " + refTrack.getCamelotTag();
                    str += "<li>Tempo : " + tempo + " BPM</li>";
                    str += "<li>Tempo du morceau de référence : " + refTrack.getTempo() + " BPM";
                    str += "<li>Tempo min (pour le mix harmonique) : " + harmony.tempoMin() + " BPM";
                    str += "<li>Tempo max (pour le mix harmonique) : " + harmony.tempoMax() + " BPM";
                    str += "<li>Harmonies possibles : " + refTrack.getHarmonies();
                    if (parseInt(tempo) >= harmony.tempoMin()
                        && parseInt(tempo) <= harmony.tempoMax()
                        && $.inArray(camelotTag, refTrack.getHarmonies()) != -1) {
                        str += "<li style=\"color:red;\">Ce morceau devrait faire partie de la playlist !</li>";
                    }
                    str += "</ul>";
                    $( "#test" ).append( str );

               // }
            }
        }
    }

}
