var arrays = new Benchmark.Suite;

arrays.on('start', function() {
  console.log("Début du test : « Caching d'une longueur de tableau »");
})
.add('avec cache', function() {
  var array = ["Toto", "Tata", "Titi", "Tutu", "Tete", "Tyty"];
  for (var i = 0, len = array.length; i < len; i++) {}
})
.add('sans cache', function() {
  var array = ["Toto", "Tata", "Titi", "Tutu", "Tete", "Tyty"];
  for (var i = 0; i < array.length; i++) {}
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Le plus rapide est ' + this.filter('fastest').map('name'));
});

/* ========================================================================== */

var selectors = new Benchmark.Suite;

selectors.on('start', function() {
  console.log("Début du test : « Caching d'un sélecteur jQuery »");
})
.add('avec cache', function() {
  var $selector = $( "h1" );
  $selector.text();
  $selector.text( "Test en cours..." );
  $selector.text();
  $selector.text( "Tests de performance avec Benchmark.js" );
  $selector.text();
})
.add('sans cache', function() {
  $( "h1" ).text();
  $( "h1" ).text( "Test en cours..." );
  $( "h1" ).text();
  $( "h1" ).text( "Tests de performance avec Benchmark.js" );
  $( "h1" ).text();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Le plus rapide est ' + this.filter('fastest').map('name'));
});
