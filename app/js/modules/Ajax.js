module.exports = Ajax = {
  /**
   * Classe générique pour les requêtes AJAX
   */
  Request: function(type, url, dataType, data) {
    this.type = type;
    this.url = url;
    this.dataType = dataType;
    this.data = data;
  },
  /**
   * Classe gérant les requêtes AJAX vers l'API de Deezer
   */
  DeezerAPIRequest: function(path) {
      this.type = "GET";
      this.url = "http://api.deezer.com" + path;
      this.dataType = "jsonp";
      this.data = {
          "output": "jsonp",
      };
  },
  /**
   * Classe gérant les requêtes AJAX vers l'API d'Echo Nest
   */
  EchoNestAPIRequest: function(path) {
      this.type = "GET";
      this.url = "http://developer.echonest.com/api/v4" + path;
      this.dataType = "jsonp";
      this.data = {
          "api_key": "VUSUA1HN4HMWUIN5P",
          "format": "jsonp",
          "bucket": "audio_summary"
      };
  },
  /**
   * Classe construisant à la demande des requêtes AJAX d'un certain type
   */
  RequestFactory: function() {
      this.getAjaxRequest = function(type, path) {
          var ajaxRequest;
          if (type === "deezer") {
              ajaxRequest = new Ajax.DeezerAPIRequest(path);
          }
          if (type === "echonest") {
              ajaxRequest = new Ajax.EchoNestAPIRequest(path);
          }
          return ajaxRequest;
      }
  }
}

/**
* Prototype de la classe mère Ajax
*/
Ajax.Request.prototype.send = function(success, error) {
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

Ajax.Request.prototype.addParam = function(key, value) {
    this.data[key] = value;
}

/**
* Clonage de prototype pour créer des classes filles
*/
Ajax.DeezerAPIRequest.prototype = Object.create(Ajax.Request.prototype);
Ajax.DeezerAPIRequest.prototype.constructor = Ajax.DeezerAPIRequest;

Ajax.EchoNestAPIRequest.prototype = Object.create(Ajax.Request.prototype);
Ajax.EchoNestAPIRequest.prototype.constructor = Ajax.EchoNestAPIRequest;
