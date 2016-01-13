// À la soumission du formulaire, on lance la cascade de requêtes AJAX
$( document ).ready(function() {
    $( "#search" ).submit(function(e) {
        e.preventDefault();
        searchTracks();
    });
});

// Recherche de morceaux (Deezer)
var searchTracks = function() {

    var keyword = $( "#deezer-selection" ).val();
    var params = {
        "q": keyword,
        "limit": 20,
        "output": "jsonp"
    };

    request = new AjaxRequest("GET", "http://api.deezer.com/search/track", "jsonp", params);
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
var getInitialAudioSummary = function(trackId) {

    var params = {
        "api_key": "VUSUA1HN4HMWUIN5P",
        "id": "deezer:track:" + trackId,
        "format": "jsonp",
        "bucket": "audio_summary"
    };

    request = new AjaxRequest("GET", "http://developer.echonest.com/api/v4/track/profile", "jsonp", params);
    request.send(success, null);

    function success(final) {
        if (final.response.track != undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);
                var track = final.response.track;
                var title = track.title;
                var artist = track.artist;
                var keyIndex = track.audio_summary.key;
                var key = keys[keyIndex];
                var modeIndex = track.audio_summary.mode;
                var mode = modes[modeIndex];
                var tempo = track.audio_summary.tempo;
                buildRefTrackProfile(title, artist, key, mode, tempo);
            }
        }
    }

}

// Fonction construisant le profil du morceau de référence
var refTrackTitle;
var refTrackArtist;
var refTrackKey;
var refTrackMode;
var refTrackTempo;
var refTrackTempoMin;
var refTrackTempoMax;
var refTrackCamelotTag;
var tempoTolerance = 0.05;

function buildRefTrackProfile(title, artist, key, mode, tempo) {
    refTrackTitle = title;
    refTrackArtist = artist;
    refTrackKey = key;
    refTrackMode = mode;
    refTrackTempo = Math.round(tempo);
    refTrackTempoMin = Math.round(refTrackTempo - (refTrackTempo * tempoTolerance));
    refTrackTempoMax = Math.round(refTrackTempo + (refTrackTempo * tempoTolerance));
    refTrackCamelotTag = harmonicMix[refTrackMode][refTrackKey]["tag"];
}

// Récupération des informations sur un morceau (Deezer)
var getTrackInfos = function(trackId) {

    var params = {
        "output": "jsonp"
    };

    request = new AjaxRequest("GET", "http://api.deezer.com/track/" + trackId, "jsonp", params);
    request.send(success, null);

    function success(response) {
        console.log(response);
        var artistId = response.artist.id;
        getSimilarArtists(artistId);
    }

}

// Récupération des artistes similaires (Deezer)
var getSimilarArtists = function(artistId) {

    var params = {
        "limit": 20,
        "output": "jsonp"
    };

    request = new AjaxRequest("GET", "http://api.deezer.com/artist/" + artistId + "/related", "jsonp", params);
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
var getTopTracks = function(similarArtists) {

    var params = {
        "limit": 20,
        "output": "jsonp",
        "methods": similarArtists
    };

    request = new AjaxRequest("GET", "http://api.deezer.com/batch", "jsonp", params);
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
var getTopTrackInfos = function(topTrackId) {

    var params = {
        "api_key": "VUSUA1HN4HMWUIN5P",
        "id": "deezer:track:" + topTrackId,
        "format": "jsonp",
        "bucket": "audio_summary"
    };

    request = new AjaxRequest("GET", "http://developer.echonest.com/api/v4/track/profile", "jsonp", params);
    request.send(success, null);

    function success(final) {
        if (final.response.track != undefined) {
            if (!$.isEmptyObject(final.response.track.audio_summary)) {
                console.log(final.response);
                var track = final.response.track;
                var title = track.title;
                var artist = track.artist;
                var keyIndex = track.audio_summary.key;
                var key = keys[keyIndex];
                var modeIndex = track.audio_summary.mode;
                var mode = modes[modeIndex];
                var tempo = "" + track.audio_summary.tempo;
                var camelotTag = harmonicMix[mode][key]["tag"];
                var matchingHarmonies = camelotWheel[camelotTag]["matches"];
                // if (parseInt(tempo) >= refTrackTempoMin
                //        && parseInt(tempo) <= refTrackTempoMax
                //        && $.inArray(refTrackCamelotTag, matchingHarmonies) != -1) {
                    str = "<ul>";
                    str += "<li>Morceau : " + title + "</li>";
                    str += "<li>Artiste : " + artist + "</li>";
                    str += "<li>Tonalité : " + key + "</li>";
                    str += "<li>Tag (Camelot) du morceau courant : " + camelotTag + "</li>";
                    str += "<li>Tag (Camelot) du morceau de référence : " + refTrackCamelotTag;
                    str += "<li>Mode : " + mode + "</li>";
                    str += "<li>Tempo : " + tempo.substr(0, tempo.indexOf(".")) + " BPM</li>";
                    str += "<li>Tempo du morceau de référence : " + refTrackTempo;
                    str += "<li>Tempo min (pour le mix harmonique) : " + refTrackTempoMin;
                    str += "<li>Tempo max (pour le mix harmonique) : " + refTrackTempoMax;
                    str += "<li>Harmonies possibles : " + matchingHarmonies;
                    if (parseInt(tempo) >= refTrackTempoMin
                        && parseInt(tempo) <= refTrackTempoMax
                        && $.inArray(refTrackCamelotTag, matchingHarmonies) != -1) {
                        str += "<li style=\"color:red;\">Ce morceau devrait faire partie de la playlist !</li>";
                    }
                    str += "</ul>";
                    $( "#test" ).append( str );

                    console.log("Tempo du morceau : " + parseInt(tempo));
                    console.log("Tempo min pour le mix harmonique : " + refTrackTempoMin);
                    console.log("Tempo max pour le mix harmonique : " + refTrackTempoMax);
                    console.log("Tag du morceau de référence : " + refTrackCamelotTag);
                    console.log("Tag du morceau courant : " + camelotTag);
                    console.log("Harmonies possibles : " + matchingHarmonies);

               // }
            }
        }
    }

}
