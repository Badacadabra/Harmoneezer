function Iterator(items) {
  this.index = 0;
  this.items = items;
}

Iterator.prototype = {
  hasNext: function() {
    return this.index < this.items.length;
  },
  next: function() {
    return this.items[this.index++];
  }
}
