/* =========================================================
   OUTILS - L'IMPROSE
   JavaScript spécifique à la page
   ========================================================= */


/* =========================================================
   DONNÉES DES GÉNÉRATEURS
   ========================================================= */

const themes = [
    "Une rencontre inattendue",
    "Le secret",
    "Le voyage",
    "La première fois",
    "Un malentendu",
    "Le rêve",
    "La compétition",
    "Le cadeau",
    "La panne",
    "La fête",
    "Le retour",
    "La découverte",
    "Une promesse",
    "Le hasard",
    "Un souvenir"
];


const categories = [
    "Libre",
    "Chantée",
    "Rimée",
    "Sans paroles",
    "Doublage",
    "À la manière de",
    "Comparée",
    "Mixte",
    "Personnage imposé",
    "Lieu imposé",
    "Émotion imposée",
    "Objet imposé"
];


/* =========================================================
   TIRAGE ALÉATOIRE
   ========================================================= */

function tirageAleatoire(liste) {

    if (!Array.isArray(liste) || liste.length === 0) {
        return "";
    }

    return liste[
        Math.floor(Math.random() * liste.length)
    ];

}


/* =========================================================
   GÉNÉRATEUR DE THÈME
   ========================================================= */

function genererTheme() {

    const element = document.getElementById("theme");

    if (!element) {
        return;
    }

    element.textContent = tirageAleatoire(themes);

}


/* =========================================================
   GÉNÉRATEUR DE CATÉGORIE
   ========================================================= */

function genererCategorie() {

    const element = document.getElementById("categorie");

    if (!element) {
        return;
    }

    element.textContent = tirageAleatoire(categories);

}


/* =========================================================
   TIRAGE COMPLET
   ========================================================= */

function genererImpro() {

    const element = document.getElementById("impro");

    if (!element) {
        return;
    }

    const theme = tirageAleatoire(themes);
    const categorie = tirageAleatoire(categories);

    element.innerHTML = `
        <div class="tirage-resultat">
            <strong>Thème :</strong>
            ${echapperHTML(theme)}
            <br>
            <strong>Catégorie :</strong>
            ${echapperHTML(categorie)}
        </div>
    `;

}


/* =========================================================
   SÉCURISATION DES TEXTES
   ========================================================= */

function echapperHTML(texte) {

    const div = document.createElement("div");

    div.textContent = texte;

    return div.innerHTML;

}


/* =========================================================
   RETOUR EN HAUT
   ========================================================= */

const btnRetourHaut =
    document.getElementById("btnRetourHaut");


if (btnRetourHaut) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            btnRetourHaut.classList.add("visible");

        } else {

            btnRetourHaut.classList.remove("visible");

        }

    });


    btnRetourHaut.addEventListener("click", (event) => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   IMPROCAST ARENA
   =========================================================

   Aucun code ImproCast n'est déplacé ici.

   ImproCast conserve sa propre architecture :

   admin-improcast.html
   └── asset/js/admin-improcast.js

   improcast.html
   └── asset/js/affichage.js

   Les boutons de la page Outils ouvrent directement
   ces deux interfaces existantes.
   ========================================================= */