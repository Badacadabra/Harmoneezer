var arrays = new Benchmark.Suite;

arrays.on('start', function() {
  console.log('Début du test : « Caching d\'une longueur de tableau »');
})
.add('avec cache', function() {
  var array = ["Toto", "Tata", "Titi", "Tutu", "Tete", "Tyty"],
      temp = [];

  for (var i = 0, len = array.length; i < len; i++) {
    temp.push(array[i]);
  }
})
.add('sans cache', function() {
  var array = ["Toto", "Tata", "Titi", "Tutu", "Tete", "Tyty"],
      temp = [];

  for (var i = 0; i < array.length; i++) {
    temp.push(array[i]);
  }
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
  console.log('Début du test : « Caching d\'un sélecteur jQuery »');
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

/* ========================================================================== */

var ids = new Benchmark.Suite;

ids.on('start', function() {
  console.log('Début du test : « Valorisation d\'un id en guise de sélecteur »');
})
.add('avec id', function() {
  $( "#test" ).text();
  $( "#test" ).text( "Test" );
  $( "#test" ).text();
})
.add('avec classe', function() {
  $( ".test" ).text();
  $( ".test" ).text( "Test" );
  $( ".test" ).text();
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Le plus rapide est ' + this.filter('fastest').map('name'));
});

/* ========================================================================== */

var append = new Benchmark.Suite;

append.on('start', function() {
  console.log('Début du test : « Utilisation de la fonction append de jQuery »');
})
.add('dans la boucle', function() {
  for (var i = 0; i < 10; i++) {
    var html = "";
        html += " <li>Toto</li>";
        html += " <li>Tata</li>";
        html += " <li>Titi</li>";
    $( "#append ul" ).append(html);
  }
})
.add('en dehors de la boucle', function() {
  var html="";
  for (var i = 0; i < 10; i++) {
    html += " <li>Toto</li>";
    html += " <li>Tata</li>";
    html += " <li>Titi</li>";
  }
  $( "#append ul" ).append(html);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Le plus rapide est ' + this.filter('fastest').map('name'));
});
