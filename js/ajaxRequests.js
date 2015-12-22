// Gestion du clic sur un élément de la liste de suggestions
function selectedTrack(id) {
    $( "#" + id ).click(function() {
        getTrackInfos(id);
        getInitialAudioSummary(id);
    });
}

// Recherche de morceaux (Deezer)
var searchTracks = function() {
    var urlDeezer = "http://api.deezer.com/search/track";
    var keyword = $( "#deezer-selection" ).val();
    var params = {
        "q": keyword,
        "limit": 20,
        "output": "jsonp"
    };
    $.ajax({
        type: "GET",
        url: urlDeezer,
        dataType: "jsonp",
        data: params,
        success: function(response) {
            console.log(response);
            $( "#test" ).append( "<ul>" );
            for (var i = 0; i < response.data.length; i++) {
                var track = response.data[i];
                $( "#test ul" ).append("<li><a href=\"#\" id=\"" + track.id + "\" class=\"tracks\">" + track.title + " (" + track.artist.name + ")</a></li>");
                selectedTrack(track.id);
            }
        }
    });
}

// Récupération des informations sur un morceau (Deezer)
var getTrackInfos = function(trackId) {
    var urlDeezer = "http://api.deezer.com/track/" + trackId;
    var params = {
        "output": "jsonp"
    };
    $.ajax({
        type: "GET",
        url: urlDeezer,
        dataType: "jsonp",
        data: params,
        success: function(response) {
            console.log(response);
            var artistId = response.artist.id;
            getSimilarArtists(artistId);
        }
    });
}

// Récupération des artistes similaires (Deezer)
var getSimilarArtists = function(artistId) {
    var urlDeezer = "http://api.deezer.com/artist/" + artistId + "/related";
    var params = {
        "limit": 20,
        "output": "jsonp"
    };
    $.ajax({
        type: "GET",
        url: urlDeezer,
        dataType: "jsonp",
        data: params,
        success: function(response) {
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
    });
}

// Récupération des 10 chansons les plus populaires de chaque artiste similaire (Deezer)
var getTopTracks = function(similarArtists) {
    var urlDeezer = "http://api.deezer.com/batch";
    var params = {
        "limit": 20,
        "output": "jsonp",
        "methods": similarArtists
    };
    $.ajax({
        type: "GET",
        url: urlDeezer,
        dataType: "jsonp",
        data: params,
        success: function(response) {
            console.log(response);
            // var topTracksIds = [];
            for (var i = 0; i < response.batch_result.length; i++) {
                var artist = response.batch_result[i];
                $.each(artist.data, function(i, item) {
                    var topTrack = item;
                    getTopTrackInfos(topTrack.id);
                    // topTracksIds.push(topTrack.id);
                });
            }
            // getTopTracksInfos(topTracksIds);
        }
    });
}

// Objets utiles pour le traitement des réponses venant d'Echo Nest
var modes = {
    "0": "mineur",
    "1": "majeur"
};

var keys = {
    "0": "do",
    "1": "do#",
    "2": "ré",
    "3": "mib",
    "4": "mi",
    "5": "fa",
    "6": "fa#",
    "7": "sol",
    "8": "lab",
    "9": "la",
    "10": "sib",
    "11": "si"
};

var harmonicMix = {
    "mineur": {
        "do": {
            "tag": "5A"
        },
        "do#": {
            "tag": "12A"
        },
        "ré": {
            "tag": "7A"
        },
        "mib": {
            "tag": "2A"
        },
        "mi": {
            "tag": "9A"
        },
        "fa": {
            "tag": "4A"
        },
        "fa#": {
            "tag": "11A"
        },
        "sol": {
            "tag": "6A"
        },
        "lab": {
            "tag": "1A"
        },
        "la": {
            "tag": "8A"
        },
        "sib": {
            "tag": "3A"
        },
        "si": {
            "tag": "10A"
        }
    },
    "majeur": {
        "do": {
            "tag": "8B"
        },
        "do#": {
            "tag": "3B"
        },
        "ré": {
            "tag": "10B"
        },
        "mib": {
            "tag": "5B"
        },
        "mi": {
            "tag": "12B"
        },
        "fa": {
            "tag": "7B"
        },
        "fa#": {
            "tag": "2B"
        },
        "sol": {
            "tag": "9B"
        },
        "lab": {
            "tag": "4B"
        },
        "la": {
            "tag": "11B"
        },
        "sib": {
            "tag": "6B"
        },
        "si": {
            "tag": "1B"
        }
    }
}

var camelotWheel = {
    "1A": {
        "name": "A-Flat Minor",
        "matches": ["1A", "12A", "2A", "1B"]
    },
    "2A": {
        "name": "E-Flat Minor",
        "matches": ["2A", "1A", "3A", "2B"]
    },
    "3A": {
        "name": "B-Flat Minor",
        "matches": ["3A", "2A", "4A", "3B"]
    },
    "4A": {
        "name": "F Minor",
        "matches": ["4A", "3A", "5A", "4B"]
    },
    "5A": {
        "name": "C Minor",
        "matches": ["5A", "4A", "6A", "5B"]
    },
    "6A": {
        "name": "G Minor",
        "matches": ["6A", "5A", "7A", "6B"]
    },
    "7A": {
        "name": "D Minor",
        "matches": ["7A", "6A", "8A", "7B"]
    },
    "8A": {
        "name": "A Minor",
        "matches": ["8A", "7A", "9A", "8B"]
    },
    "9A": {
        "name": "E Minor",
        "matches": ["9A", "8A", "10A", "9B"]
    },
    "10A": {
        "name": "B Minor",
        "matches": ["10A", "9A", "11A", "10B"]
    },
    "11A": {
        "name": "G Flat Minor",
        "matches": ["11A", "10A", "12A", "11B"]
    },
    "12A": {
        "name": "D-Flat Minor",
        "matches": ["12A", "11A", "1A", "12B"]
    },
    "1B": {
        "name": "B Major",
        "matches": ["1B", "12B", "2B", "1A"]
    },
    "2B": {
        "name": "F-Sharp Major",
        "matches": ["2B", "1B", "3B", "2A"]
    },
    "3B": {
        "name": "D-Flat Major",
        "matches": ["3B", "2B", "4B", "3A"]
    },
    "4B": {
        "name": "A-Flat Major",
        "matches": ["4B", "3B", "5B", "4A"]
    },
    "5B": {
        "name": "E-Flat Major",
        "matches": ["5B", "4B", "6B", "5A"]
    },
    "6B": {
        "name": "B-Flat Major",
        "matches": ["6B", "5B", "7B", "6A"]
    },
    "7B": {
        "name": "F Major",
        "matches": ["7B", "6B", "8B", "7A"]
    },
    "8B": {
        "name": "C Major",
        "matches": ["8B", "7B", "9B", "8A"]
    },
    "9B": {
        "name": "G Major",
        "matches": ["9B", "8B", "10B", "9A"]
    },
    "10B": {
        "name": "D Major",
        "matches": ["10B", "9B", "11B", "10A"]
    },
    "11B": {
        "name": "A Major",
        "matches": ["11B", "10B", "12B", "11A"]
    },
    "12B": {
        "name": "E Major",
        "matches": ["12B", "11B", "1B", "12A"]
    }
}

// Fonction construisant le profil du morceau de référence
var selectedTrackTitle;
var selectedTrackArtist;
var selectedTrackKey;
var selectedTrackMode;
var selectedTrackTempo;
var selectedTrackTempoMin;
var selectedTrackTempoMax;
var selectedTrackCamelotTag;

function buildSelectedTrackProfile(title, artist, key, mode, tempo) {
    selectedTrackTitle = title;
    selectedTrackArtist = artist;
    selectedTrackKey = key;
    selectedTrackMode = mode;
    selectedTrackTempo = tempo;
    selectedTrackTempoMin = selectedTrackTempo - (selectedTrackTempo * 0.03);
    selectedTrackTempoMax = selectedTrackTempo + (selectedTrackTempo * 0.03);
    selectedTrackCamelotTag = harmonicMix[selectedTrackMode][selectedTrackKey]["tag"];
}

// Récupération des informations de tempo et de tonalité pour le morceau sélectionné (Echo Nest)
var getInitialAudioSummary = function(trackId) {
    var urlEchoNest = "http://developer.echonest.com/api/v4/track/profile";
    var params = {
        "api_key": "VUSUA1HN4HMWUIN5P",
        "id": "deezer:track:" + trackId,
        "format": "jsonp",
        "bucket": "audio_summary"
    };
    $.ajax({
        type: "GET",
        url: urlEchoNest,
        dataType: "jsonp",
        data: params,
        success: function(final) {
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
                    buildSelectedTrackProfile(title, artist, key, mode, tempo);
                }
            }
        }
    });
}

// Récupération des informations de tempo et de tonalité pour tous les top morceaux (Echo Nest)
var getTopTrackInfos = function(topTrackId) {
    var urlEchoNest = "http://developer.echonest.com/api/v4/track/profile";
    var params = {
        "api_key": "VUSUA1HN4HMWUIN5P",
        "id": "deezer:track:" + topTrackId,
        "format": "jsonp",
        "bucket": "audio_summary"
    };
    $.ajax({
        type: "GET",
        url: urlEchoNest,
        dataType: "jsonp",
        data: params,
        success: function(final) {
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
                    if (parseInt(tempo) >= selectedTrackTempoMin
                            && parseInt(tempo) <= selectedTrackTempoMax
                            && $.inArray(selectedTrackCamelotTag, matchingHarmonies) != -1) {
                        $( "#test" ).append( "<ul>" );
                        $( "#test" ).append( "<li>Morceau : " + title + "</li>" );
                        $( "#test" ).append( "<li>Artiste : " + artist + "</li>" );
                        $( "#test" ).append( "<li>Tonalité : " + key + "</li>" );
                        $( "#test" ).append( "<li>Mode : " + mode + "</li>" );
                        $( "#test" ).append( "<li>Tempo : " + tempo.substr(0, tempo.indexOf(".")) + " BPM</li>" );
                        console.log("Tempo : " + parseInt(tempo));
                        console.log("Min : " + selectedTrackTempoMin);
                        console.log("Max : " + selectedTrackTempoMax);
                        console.log("Tag (référence) : " + selectedTrackCamelotTag);
                        console.log("Tag : " + camelotTag);
                        console.log(matchingHarmonies);
                    }
                }
            }
        }
    });
}
