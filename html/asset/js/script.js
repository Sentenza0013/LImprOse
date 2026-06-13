function genererTheme() {

    let themes = [
        "Mission sur Mars",
        "Le dernier chocolat de la Terre",
        "Un fantôme au collège",
        "Le roi des pizzas",
        "La dernière baguette de France",
        "Un dragon chez Ikea",
        "Le facteur ninja",
        "Le chat président"
    ];

    let numero = Math.floor(Math.random() * themes.length);

    document.getElementById("theme").textContent =
        themes[numero];
}

function genererCategorie() {

    let categories = [
        "Comédie",
        "Drame",
        "Science-fiction",
        "Fantastique",
        "Film noir",
        "Sans paroles",
        "Comédie musicale",
        "Absurde"
    ];

    let numero = Math.floor(Math.random() * categories.length);

    document.getElementById("categorie").textContent =
        categories[numero];
}
function genererImpro() {

    let themes = [
        "Mission sur Mars",
        "Le facteur ninja",
        "Le chat président",
        "La dernière baguette de France"
    ];

    let categories = [
        "Comédie",
        "Drame",
        "Science-fiction",
        "Film noir"
    ];

    let durees = [
        "2 minutes",
        "4 minutes",
        "6 minutes",
        "8 minutes"
    ];

    let joueurs = [
        "2 joueurs",
        "3 joueurs",
        "4 joueurs",
        "5 joueurs"
    ];

    let theme =
        themes[Math.floor(Math.random() * themes.length)];

    let categorie =
        categories[Math.floor(Math.random() * categories.length)];

    let duree =
        durees[Math.floor(Math.random() * durees.length)];

    let nbJoueurs =
        joueurs[Math.floor(Math.random() * joueurs.length)];

    document.getElementById("impro").innerHTML = `
        <h3>🎲 ${theme}</h3>
        <p><strong>Catégorie :</strong> ${categorie}</p>
        <p><strong>Durée :</strong> ${duree}</p>
        <p><strong>Participants :</strong> ${nbJoueurs}</p>
    `;
}