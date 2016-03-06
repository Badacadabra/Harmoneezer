casper.test.begin("Lancement de l'application", 5, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        test.assertTitle("Playlist harmonique", "Titre de l'application OK");
        test.assertVisible("#search", "Le moteur de recherche visible");
        test.assertVisible("#ipod", "L'iPod est visible");
        test.assertNotVisible("#tracks", "Le carousel de morceaux est invisible");
        test.assertNotVisible(".sidebar", "Les sidebars sont invisibles");
        this.viewport(1920, 1080);
        this.capture("test/functionalTesting/screenshots/1.png");
    }).run(function() {
        test.done();
    });

});

/* ========================================================================== */

casper.test.begin("Moteur de recherche", 4, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        test.assertExists("#search input", "Champ de saisie identifié");
        this.fillSelectors("form#search", {
            "#search input": "Yngwie Malmsteen"
        }, true);
        test.assertField("keyword", "Yngwie Malmsteen", "Le champ est bien rempli");
    });

    casper.wait(3000).then(function() {
        test.assertVisible("#results", "Les résultats sont affichés");
        test.assertEval(function() {
            return __utils__.findAll(".track").length == 20;
        }, "Il y a 20 résultats");
        this.viewport(1920, 1080);
        this.capture("test/functionalTesting/screenshots/2.png");
    })

    casper.run(function() {
        test.done();
    });

});

/* ========================================================================== */

casper.test.begin("Navigation", 5, function suite(test) {

    casper.start("http://localhost:8000/app", function() {
        test.assertNotVisible(".bottom.sidebar", "Menu masqué");
        this.click("#display-menu");
    });

    casper.wait(2000).then(function() {
        test.assertVisible(".bottom.sidebar", "Menu visible");
        test.assertNotVisible(".left.sidebar", "Playlist masquée");
        this.click("#playlist-btn");
    });

    casper.wait(2000).then(function() {
       test.assertVisible(".left.sidebar", "Playlist visible");
       this.viewport(1920, 1080);
       this.capture("test/functionalTesting/screenshots/3.png");
       this.click("#playlist-btn");
    });

    casper.wait(2000).then(function() {
       test.assertNotVisible(".left.sidebar", "Playlist masquée");
    });

    casper.run(function() {
        test.done();
    });

});
