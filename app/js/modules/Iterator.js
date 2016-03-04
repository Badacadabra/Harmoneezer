/**
* Classe Iterator.
*
* @class Iterator
* @constructor
*/
module.exports = Iterator = function(items) {
  this.index = 0;
  this.items = items;
}

/**
* Méthodes de l'itérateur
*/
Iterator.prototype = {
  hasNext: function() {
    return this.index < this.items.length;
  },
  next: function() {
    return this.items[this.index++];
  }
}
