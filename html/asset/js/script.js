function genererTheme() {

    let themes = [
        "Mission sur Mars",
        "Le dernier chocolat de la Terre",
        "Un fantôme au collège",
        "Le roi des pizzas",
        "Une machine à remonter les devoirs"
    ];

    let numero = Math.floor(Math.random() * themes.length);

    document.getElementById("theme").textContent = themes[numero];
}