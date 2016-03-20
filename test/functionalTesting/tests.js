casper.test.begin("Lancement de l'application", 5, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        test.assertTitle("Créez vos playlists harmoniques avec HARMONEEZER !", "Titre de l'application OK");
        test.assertVisible("#search", "Le moteur de recherche visible");
        test.assertVisible("#bottom-chevron", "Le bouton principal (chevron) est visible");
        test.assertNotVisible("#tracks", "Le carousel de morceaux est invisible");
        test.assertNotVisible(".sidebar", "Les sidebars sont invisibles");
        this.viewport(1920, 1080);
        this.capture("test/functionalTesting/screenshots/1.png");
    })
    .run(function() {
        test.done();
    });

});

/* ========================================================================== */

casper.test.begin("Moteur de recherche", 3, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        test.assertExists("#search input", "Champ de saisie identifié");
        this.fillSelectors("form#search", {
            "#search input": "Yngwie Malmsteen"
        }, true);
    });

    casper.wait(3000).then(function() {
        test.assertEval(function() {
            return __utils__.findAll(".track").length == 20;
        }, "Il y a 20 résultats");
        this.viewport(1920, 1080);
        this.capture("test/functionalTesting/screenshots/2.png");
        this.click(".track:first-of-type");
    });

    casper.wait(3000).then(function() {
        test.assertVisible("#harmonic-tracks");
        this.viewport(1920, 1080);
        this.capture("test/functionalTesting/screenshots/3.png");
    });

    casper.run(function() {
        test.done();
    });

});

/* ========================================================================== */

casper.test.begin("Navigation", 18, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        this.click("#bottom-chevron");
    });

    casper.wait(2000).then(function() {
        test.assertVisible("#menu", "Menu visible après clic");
        test.assertNotVisible("#playlist", "Playlist invisible");
        test.assertNotVisible("#favorites", "Favoris invisibles");
        test.assertNotVisible("#atmospheres", "Favoris invisibles");
        test.assertNotVisible("#harmonic-tracks", "Suggestions invisibles");
        test.assertNotVisible("#user", "Utilisateur invisible");
        this.click("#playlist-btn");
        this.click("#favorites-btn");
        this.click("#atmospheres-btn");
        this.click("#harmonic-tracks-btn");
        this.click("#user-btn");
    });

    casper.wait(2000).then(function() {
       test.assertVisible("#menu", "Menu toujours visible");
       test.assertVisible("#playlist", "Playlist visible après clic");
       test.assertVisible("#favorites", "Favoris visibles après clic");
       test.assertVisible("#atmospheres", "Favoris visibles après clic");
       test.assertVisible("#harmonic-tracks", "Suggestions visibles après clic");
       test.assertVisible("#user", "Utilisateur visible après clic");
       this.click("#playlist-btn");
       this.click("#favorites-btn");
       this.click("#atmospheres-btn");
       this.click("#harmonic-tracks-btn");
       this.click("#user-btn");
       this.viewport(1920, 1080);
       this.capture("test/functionalTesting/screenshots/4.png");
    });

    casper.wait(2000).then(function() {
      test.assertVisible("#menu", "Menu toujours visible");
      test.assertNotVisible("#playlist", "Playlist invisible après deuxième clic");
      test.assertNotVisible("#favorites", "Favoris invisibles après deuxième clic");
      test.assertNotVisible("#atmospheres", "Favoris invisibles après deuxième clic");
      test.assertNotVisible("#harmonic-tracks", "Suggestions invisibles après deuxième clic");
      test.assertNotVisible("#user", "Utilisateur invisible après deuxième clic");
    });

    casper.run(function() {
        test.done();
    });

});
