var Vocabulary = require('../../app/js/modules/Vocabulary.js'),
    Iterator = require('../../app/js/modules/Iterator.js'),
    Music = require('../../app/js/modules/Music.js'),
    Ajax = require('../../app/js/modules/Ajax.js'),
    Sorting = require('../../app/js/modules/Sorting.js'),
    Player = require('../../app/js/modules/Player'),
    Playlist = require('../../app/js/modules/Playlist'),
    // Le module GUI n'est pas vraiment testé ici. Voir les tests fonctionnels.
    GUI = require('../../app/js/modules/GUI');

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

  var id = 1234567,
      title = "Far Beyond The Sun",
      artist = "Yngwie Malmsteen",
      cover = "rising-force.png",
      key = "fa",
      mode = "mineur",
      tempo = 125,
      camelotTag = "4A",
      harmonies = ["4A", "3A", "5A", "4B"],
      tempoVariation = 0.05,
      isActive = true,
      track = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies),
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

/* ========================================================================== */

QUnit.test( "Sorting", function( assert ) {
  assert.expect( 23 );

  var sortingStrategy = new Sorting.Strategy(),
      defaultSorting = new Sorting.Default(),
      tempoFirstSorting = new Sorting.TempoFirst(),
      keyFirstSorting = new Sorting.KeyFirst(),
      ascTempoSorting = new Sorting.AscendingTempo(),
      descTempoSorting = new Sorting.DescendingTempo(),
      noSorting = new Sorting.None();

  assert.equal(sortingStrategy.getAlgorithm(), undefined, "Stratégie de tri non définie");
  sortingStrategy.setAlgorithm(defaultSorting);
  assert.ok(sortingStrategy.getAlgorithm() instanceof Sorting.Default, "Affectation d'une stratégie de tri");

  var id = 1,
      title = "Titre 1",
      artist = "Artiste 1",
      cover = "cover-1.png",
      key = "note 1",
      mode = "mode 1",
      tempo = 145,
      camelotTag = "Tag 1",
      harmonies = ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
      track1 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 2,
      title = "Titre 2",
      artist = "Artiste 2",
      cover = "cover-2.png",
      key = "note 2",
      mode = "mode 2",
      tempo = 150,
      camelotTag = "Tag 2",
      harmonies = [],
      track2 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 3,
      title = "Titre 3",
      artist = "Artiste 3",
      cover = "cover-3.png",
      key = "note 3",
      mode = "mode 3",
      tempo = 100,
      camelotTag = "Tag 5",
      harmonies = [],
      track3 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 4,
      title = "Titre 4",
      artist = "Artiste 4",
      cover = "cover-4.png",
      key = "note 4",
      mode = "mode 4",
      tempo = 200,
      camelotTag = "Tag 4",
      harmonies = [],
      track4 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var id = 5,
      title = "Titre 5",
      artist = "Artiste 5",
      cover = "cover-5.png",
      key = "note 5",
      mode = "mode 5",
      tempo = 140,
      camelotTag = "Tag 6",
      harmonies = [],
      track5 = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  var tempoVariation = 0.05,
      isActive = true,
      harmony = new Music.Harmony(track1, tempoVariation, isActive);

  var similarTracks = [track2, track3, track4, track5],
      sortedTracks = null;

  sortingStrategy.setAlgorithm(defaultSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "Tri par défaut (1/4)");
  assert.equal(sortedTracks[1], track5, "Tri par défaut (2/4)");
  assert.equal(sortedTracks[2], track4, "Tri par défaut (3/4)");
  assert.equal(sortedTracks[3], track3, "Tri par défaut (4/4)");

  sortingStrategy.setAlgorithm(tempoFirstSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "« Tempo First » (1/4)");
  assert.equal(sortedTracks[1], track5, "« Tempo First » (2/4)");
  assert.equal(sortedTracks[2], track4, "« Tempo First » (3/4)");
  assert.equal(sortedTracks[3], track3, "« Tempo First » (4/4)");

  sortingStrategy.setAlgorithm(keyFirstSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track2, "« Key First » (1/4)");
  assert.equal(sortedTracks[1], track4, "« Key First » (2/4)");
  assert.equal(sortedTracks[2], track5, "« Key First » (3/4)");
  assert.equal(sortedTracks[3], track3, "« Key First » (4/4)");

  sortingStrategy.setAlgorithm(ascTempoSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track3, "Tri croissant selon le tempo (1/4)");
  assert.equal(sortedTracks[1], track5, "Tri croissant selon le tempo (2/4)");
  assert.equal(sortedTracks[2], track2, "Tri croissant selon le tempo (3/4)");
  assert.equal(sortedTracks[3], track4, "Tri croissant selon le tempo (4/4)");

  sortingStrategy.setAlgorithm(descTempoSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.equal(sortedTracks[0], track4, "Tri décroissant selon le tempo (1/4)");
  assert.equal(sortedTracks[1], track2, "Tri décroissant selon le tempo (2/4)");
  assert.equal(sortedTracks[2], track5, "Tri décroissant selon le tempo (3/4)");
  assert.equal(sortedTracks[3], track3, "Tri décroissant selon le tempo (4/4)");

  sortingStrategy.setAlgorithm(noSorting);
  sortedTracks = sortingStrategy.sort(track1, harmony, similarTracks);
  assert.deepEqual(sortedTracks, similarTracks, "Aucun tri");
});

/* ========================================================================== */

QUnit.test( "Player", function( assert ) {
  assert.expect( 1 );

  var player1 = Player.getPlayer(),
      player2 = Player.getPlayer();

  assert.deepEqual(player2, player1, "Une seule instance de Player est délivrée (Singleton)");
});

/* ========================================================================== */

QUnit.test( "Playlist", function( assert ) {
  assert.expect( 7 );

  var id = 1234567,
      title = "Far Beyond The Sun",
      artist = "Yngwie Malmsteen",
      cover = "rising-force.png",
      key = "fa",
      mode = "mineur",
      tempo = 125,
      camelotTag = "4A",
      harmonies = ["4A", "3A", "5A", "4B"],
      track = new Music.Track(id, title, artist, cover, key, mode, tempo, camelotTag, harmonies);

  assert.ok(Playlist.selectedTracks.length == 0, "La playlist est vide à l'initialisation (1/2)");
  assert.ok(Playlist.tracksIds.length == 0, "La playlist est vide à l'initialisation (2/2)");

  Playlist.addTrackToPlaylist(track);
  assert.notOk(Playlist.selectedTracks.length == 0, "La playlist est mise à jour lors d'un ajout (1/2)");
  assert.notOk(Playlist.tracksIds.length == 0, "La playlist est mise à jour lors d'un ajout (2/2)");
  assert.equal(Playlist.selectedTracks[0].getTitle(), "Far Beyond The Sun", "Le morceau est chargé dans la playlist");

  Playlist.removeTrackFromPlaylist(0);
  assert.ok(Playlist.selectedTracks.length == 0, "La playlist est mise à jour lors d'une suppression (1/2)");
  assert.ok(Playlist.tracksIds.length == 0, "La playlist est mise à jour lors d'une suppression (2/2)");
});
