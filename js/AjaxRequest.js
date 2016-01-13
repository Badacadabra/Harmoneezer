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
