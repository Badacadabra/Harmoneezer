var Vocabulary = require('../../app/js/modules/Vocabulary.js'),
    Iterator = require('../../app/js/modules/Iterator.js'),
    Music = require('../../app/js/modules/Music.js'),
    Ajax = require('../../app/js/modules/Ajax.js');

/* ========================================================================== */

QUnit.test( "Vocabulary", function( assert ) {
  assert.expect( 4 );

  var mode = Vocabulary.modes[0],
      key = Vocabulary.keys[9]
      harmonicMix = Vocabulary.harmonicMix[mode][key].tag,
      camelotWheel = Vocabulary.camelotWheel[harmonicMix].matches;

  assert.deepEqual(mode, "mineur", "Mode : mineur");
  assert.deepEqual(key, "la", "Tonalité : La");
  assert.deepEqual(harmonicMix, "8A", "Tag sur la roue de Camelot");
  assert.deepEqual(camelotWheel, ["8A", "7A", "9A", "8B"], "Harmonies possibles sur la roue de Camelot");
});

/* ========================================================================== */

QUnit.test( "Iterator", function( assert ) {
  assert.expect( 8 );

  var collection = ["Toto", "Tata", "Titi"],
      iterator = new Iterator(collection);

  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Toto", "Première itération");
  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Tata", "Deuxième itération");
  assert.ok(iterator.hasNext(), "Élément suivant");
  assert.equal(iterator.next(), "Titi", "Troisième itération");
  assert.notOk(iterator.hasNext(), "Pas d'élément suivant");
  assert.throws(
    function() {
      Iterator(collection);
    },
    Error,
    "Erreur ! La classe Iterator doit être instanciée avec l'opérateur « new »"
  );
});

/* ========================================================================== */

QUnit.test( "Music", function( assert ) {
  assert.expect( 5 );

  var title = "Far Beyond The Sun",
      artist = "Yngwie Malmsteen",
      cover = "rising-force.png",
      key = "fa",
      mode = "mineur",
      tempo = 125,
      camelotTag = "4A",
      harmonies = ["4A", "3A", "5A", "4B"],
      tempoVariation = 0.05,
      isActive = true,
      track = new Music.Track(title, artist, cover, key, mode, tempo, camelotTag, harmonies),
      harmony = new Music.Harmony(track, tempoVariation, isActive);

  assert.equal(track.getTitle(), "Far Beyond The Sun", "Titre du morceau");
  assert.ok(track.getHarmonies() instanceof Array, "Harmonies possibles");
  assert.equal(harmony.getTrack().getTempo(), 125, "Tempo du morceau de référence au sein d'une harmonie");
  assert.throws(
    function() {
      Music.Track(title, artist, cover, key, mode, tempo, camelotTag, harmonies);
    },
    Error,
    "Erreur ! La classe Track doit être instanciée avec l'opérateur « new »"
  );
  assert.throws(
    function() {
      Music.Harmony(track, tempoVariation, isActive);
    },
    Error,
    "Erreur ! La classe Harmony doit être instanciée avec l'opérateur « new »"
  );
});

/* ========================================================================== */

QUnit.test( "Ajax", function( assert ) {
  assert.expect( 4 );

  var requestFactory = new Ajax.RequestFactory(),
      deezerRequest = requestFactory.getAjaxRequest("deezer", ""),
      echonestRequest = requestFactory.getAjaxRequest("echonest", "");

  assert.ok(deezerRequest instanceof Ajax.Request, "Instance de Request");
  assert.ok(echonestRequest instanceof Ajax.Request, "Instance de Request");
  assert.ok(deezerRequest instanceof Ajax.DeezerAPIRequest, "Instance de DeezerAPIRequest");
  assert.ok(echonestRequest instanceof Ajax.EchoNestAPIRequest, "Instance de EchoNestAPIRequest");
});
