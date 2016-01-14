/**
 * Classe générique pour les requêtes AJAX
 */
function AjaxRequest(type, url, dataType, data) {
    this.type = type;
    this.url = url;
    this.dataType = dataType;
    this.data = data;
}

AjaxRequest.prototype.send = function(success, error) {
    $.ajax({
        type: this.type,
        url: this.url,
        dataType: this.dataType,
        data: this.data,
        success: function(response) {
            success(response);
        },
        error: function(response) {
            error(response);
        }
    });
}

AjaxRequest.prototype.addParam = function(key, value) {
    this.data[key] = value;
}


/**
 * Classe construisant à la demande des requêtes AJAX d'un certain type
 */
function AjaxRequestFactory() {
    this.getAjaxRequest = function(type, path) {
        var ajaxRequest;
        if (type === "deezer") {
            ajaxRequest = new DeezerAPIRequest(path);
        }
        if (type === "echonest") {
            ajaxRequest = new EchoNestAPIRequest(path);
        }
        return ajaxRequest;
    }
}


/**
 * Classe gérant les requêtes AJAX vers l'API de Deezer
 */
function DeezerAPIRequest(path) {
    this.type = "GET";
    this.url = "http://api.deezer.com" + path;
    this.dataType = "jsonp";
    this.data = {
        "output": "jsonp",
    };
}

DeezerAPIRequest.prototype = Object.create(AjaxRequest.prototype);
DeezerAPIRequest.prototype.constructor = DeezerAPIRequest;


/**
 * Classe gérant les requêtes AJAX vers l'API d'Echo Nest
 */
function EchoNestAPIRequest(path) {
    this.type = "GET";
    this.url = "http://developer.echonest.com/api/v4" + path;
    this.dataType = "jsonp";
    this.data = {
        "api_key": "VUSUA1HN4HMWUIN5P",
        "format": "jsonp",
        "bucket": "audio_summary"
    };
}

EchoNestAPIRequest.prototype = Object.create(AjaxRequest.prototype);
EchoNestAPIRequest.prototype.constructor = EchoNestAPIRequest;
