"use strict";

/* =========================================================
   L'IMPROSE — TROUPES.JS
   ========================================================= */


/* =========================================================
   DONNÉES DE DÉMONSTRATION
   ========================================================= */

const troupes = [
    {
        id: 1,
        nom: "Les Improvisibles",
        ville: "Paris",
        departement: "75",
        description: "Matchs et créations d'improvisation pour tous les publics.",
        image: "./asset/images/troupes/improvisibles.jpg",
        lat: 48.8566,
        lon: 2.3522
    },
    {
        id: 2,
        nom: "La Lune Rousse",
        ville: "Lyon",
        departement: "69",
        description: "Théâtre d'improvisation engagé et plein d'énergie.",
        image: "./asset/images/troupes/lune-rousse.jpg",
        lat: 45.7640,
        lon: 4.8357
    },
    {
        id: 3,
        nom: "Improlition",
        ville: "Nantes",
        departement: "44",
        description: "Formats longs et créations originales.",
        image: "./asset/images/troupes/improlition.jpg",
        lat: 47.2184,
        lon: -1.5536
    },
    {
        id: 4,
        nom: "Les Trois Temps",
        ville: "Toulouse",
        departement: "31",
        description: "Impro, musique et belles histoires.",
        image: "./asset/images/troupes/trois-temps.jpg",
        lat: 43.6047,
        lon: 1.4442
    },
    {
        id: 5,
        nom: "La Clique",
        ville: "Lille",
        departement: "59",
        description: "Une troupe conviviale qui partage l'improvisation sous toutes ses formes.",
        image: "./asset/images/troupes/la-clique.jpg",
        lat: 50.6292,
        lon: 3.0573
    },
    {
        id: 6,
        nom: "Les Improvisateurs du Nord",
        ville: "Roubaix",
        departement: "59",
        description: "Matchs, ateliers et spectacles d'improvisation dans la métropole lilloise.",
        image: "./asset/images/troupes/improvisateurs-nord.jpg",
        lat: 50.6942,
        lon: 3.1746
    },
    {
        id: 7,
        nom: "Les Improvisés",
        ville: "Bordeaux",
        departement: "33",
        description: "Une troupe bordelaise entre théâtre, humour et improvisation.",
        image: "./asset/images/troupes/improvises.jpg",
        lat: 44.8378,
        lon: -0.5792
    },
    {
        id: 8,
        nom: "Impro Libre",
        ville: "Marseille",
        departement: "13",
        description: "Des histoires improvisées et des rencontres sur scène.",
        image: "./asset/images/troupes/impro-libre.jpg",
        lat: 43.2965,
        lon: 5.3698
    }
];


/* =========================================================
   SPECTACLES / ÉVÉNEMENTS
   ========================================================= */

const evenements = [
    {
        id: 1,
        titre: "Match d'improvisation",
        troupe: "La Clique",
        ville: "Lille",
        date: "2026-08-22",
        heure: "20:00",
        lieu: "Salle des fêtes",
        type: "Match"
    },
    {
        id: 2,
        titre: "Soirée 100 % improvisée",
        troupe: "Les Improvisateurs du Nord",
        ville: "Roubaix",
        date: "2026-08-29",
        heure: "20:30",
        lieu: "Théâtre municipal",
        type: "Spectacle"
    },
    {
        id: 3,
        titre: "Grand match d'impro",
        troupe: "Les Improvisibles",
        ville: "Paris",
        date: "2026-09-05",
        heure: "20:00",
        lieu: "Paris",
        type: "Match"
    },
    {
        id: 4,
        titre: "Improvisation longue",
        troupe: "La Lune Rousse",
        ville: "Lyon",
        date: "2026-09-12",
        heure: "19:30",
        lieu: "Lyon",
        type: "Spectacle"
    },
    {
        id: 5,
        titre: "Histoires improvisées",
        troupe: "Impro Libre",
        ville: "Marseille",
        date: "2026-09-19",
        heure: "20:00",
        lieu: "Marseille",
        type: "Spectacle"
    }
];


/* =========================================================
   ÉLÉMENTS HTML
   ========================================================= */

const searchForm = document.querySelector("#search-form");
const locationInput = document.querySelector("#location-input");
const radiusSelect = document.querySelector("#radius-select");
const useLocationButton = document.querySelector("#use-location");
const searchStatus = document.querySelector("#search-status");

const troupesList = document.querySelector("#troupes-list");
const troupesCount = document.querySelector("#troupes-count");
const troupesEmpty = document.querySelector("#troupes-empty");
const showMoreButton = document.querySelector("#show-more-troupes");

const eventsForm = document.querySelector("#events-form");
const eventDate = document.querySelector("#event-date");
const eventCity = document.querySelector("#event-city");
const eventsList = document.querySelector("#events-list");
const eventsEmpty = document.querySelector("#events-empty");
const clearEventsButton = document.querySelector("#clear-events");

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

const backToTop = document.querySelector(".back-to-top");


/* =========================================================
   VARIABLES
   ========================================================= */

let troupesVisibles = 4;

let derniereRecherche = {
    latitude: null,
    longitude: null,
    rayon: 10
};


/* =========================================================
   AFFICHER LES TROUPES
   ========================================================= */

function afficherTroupes(liste) {

    if (!troupesList) {
        return;
    }

    troupesList.innerHTML = "";

    const visibles = liste.slice(0, troupesVisibles);

    visibles.forEach((troupe) => {

        const article = document.createElement("article");

        article.className = "troupe-card";

        article.innerHTML = `
            <div class="troupe-image">
                <img
                    src="${troupe.image}"
                    alt="Troupe ${troupe.nom}"
                    loading="lazy"
                >
            </div>

            <div class="troupe-body">

                <h3 class="troupe-name">
                    ${troupe.nom}
                </h3>

                <p class="troupe-city">
                    ${troupe.ville} · ${troupe.departement}
                </p>

                <p class="troupe-description">
                    ${troupe.description}
                </p>

                <a
                    class="troupe-link"
                    href="./contact.html"
                >
                    DÉCOUVRIR →
                </a>

            </div>
        `;

        const image = article.querySelector("img");

        image.addEventListener("error", () => {
            image.style.display = "none";
        });

        troupesList.appendChild(article);
    });

    if (troupesCount) {
        troupesCount.textContent =
            `${liste.length} troupe${liste.length > 1 ? "s" : ""}`;
    }

    if (troupesEmpty) {
        troupesEmpty.hidden = liste.length !== 0;
    }

    if (showMoreButton) {
        showMoreButton.hidden =
            liste.length <= troupesVisibles;
    }
}


/* =========================================================
   RECHERCHER LES TROUPES
   ========================================================= */

function rechercherTroupes() {

    if (!locationInput || !radiusSelect) {
        return;
    }

    const recherche =
        locationInput.value.trim().toLowerCase();

    const rayon =
        Number(radiusSelect.value);

    derniereRecherche.rayon = rayon;

    let resultats = [...troupes];


    /*
     * Recherche par :
     * - nom
     * - ville
     * - département
     * - description
     */

    if (
        recherche &&
        recherche !== "ma position"
    ) {

        resultats = resultats.filter((troupe) => {

            const texte = `
                ${troupe.nom}
                ${troupe.ville}
                ${troupe.departement}
                ${troupe.description}
            `.toLowerCase();

            return texte.includes(recherche);
        });
    }


    /*
     * Si une position GPS est disponible,
     * filtrage selon le rayon choisi.
     */

    if (
        derniereRecherche.latitude !== null &&
        derniereRecherche.longitude !== null
    ) {

        resultats = resultats.filter((troupe) => {

            const distance =
                calculerDistanceKm(
                    derniereRecherche.latitude,
                    derniereRecherche.longitude,
                    troupe.lat,
                    troupe.lon
                );

            return distance <= rayon;
        });
    }


    afficherTroupes(resultats);


    if (searchStatus) {

        const nombre = resultats.length;

        if (
            derniereRecherche.latitude !== null &&
            derniereRecherche.longitude !== null
        ) {

            searchStatus.textContent =
                `${nombre} troupe${nombre > 1 ? "s" : ""} trouvée${nombre > 1 ? "s" : ""} dans un rayon de ${rayon} km.`;

        } else if (recherche) {

            searchStatus.textContent =
                `${nombre} troupe${nombre > 1 ? "s" : ""} trouvée${nombre > 1 ? "s" : ""} pour « ${locationInput.value.trim()} ».`;

        } else {

            searchStatus.textContent =
                `${nombre} troupe${nombre > 1 ? "s" : ""} disponible${nombre > 1 ? "s" : ""}.`;
        }
    }
}


/* =========================================================
   GÉOLOCALISATION
   ========================================================= */

function utiliserPosition() {

    if (!navigator.geolocation) {

        if (searchStatus) {
            searchStatus.textContent =
                "La géolocalisation n'est pas disponible sur ce navigateur.";
        }

        return;
    }

    if (searchStatus) {
        searchStatus.textContent =
            "Recherche de votre position...";
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            derniereRecherche.latitude =
                position.coords.latitude;

            derniereRecherche.longitude =
                position.coords.longitude;

            if (locationInput) {
                locationInput.value = "Ma position";
            }

            rechercherTroupes();

            if (searchStatus) {
                searchStatus.textContent =
                    "Recherche effectuée autour de votre position.";
            }
        },

        (error) => {

            console.error(
                "Erreur de géolocalisation :",
                error
            );

            if (searchStatus) {
                searchStatus.textContent =
                    "Impossible d'obtenir votre position. Vous pouvez rechercher une ville manuellement.";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}


/* =========================================================
   CALCUL DE DISTANCE
   ========================================================= */

function calculerDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const rayonTerre = 6371;

    const dLat =
        convertirRadians(lat2 - lat1);

    const dLon =
        convertirRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(convertirRadians(lat1)) *
        Math.cos(convertirRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return rayonTerre * c;
}


function convertirRadians(degres) {

    return degres * Math.PI / 180;
}


/* =========================================================
   AFFICHER LES SPECTACLES
   ========================================================= */

function afficherEvenements(liste) {

    if (!eventsList) {
        return;
    }

    eventsList.innerHTML = "";

    liste.forEach((event) => {

        const date =
            new Date(`${event.date}T12:00:00`);

        const jour =
            date.toLocaleDateString(
                "fr-FR",
                {
                    day: "2-digit"
                }
            );

        const mois =
            date.toLocaleDateString(
                "fr-FR",
                {
                    month: "short"
                }
            ).replace(".", "");


        const article =
            document.createElement("article");

        article.className =
            "event-card";

        article.innerHTML = `
            <div class="event-date">
                <strong>${jour}</strong>
                <span>${mois}</span>
            </div>

            <div class="event-info">

                <h3>
                    ${event.titre}
                </h3>

                <p>
                    ${event.troupe}
                    ·
                    ${event.ville}
                    ·
                    ${event.heure}
                    ·
                    ${event.lieu}
                </p>

                <span class="event-tag">
                    ${event.type}
                </span>

            </div>

            <a
                class="event-link"
                href="./contact.html"
            >
                DÉTAILS →
            </a>
        `;

        eventsList.appendChild(article);
    });

    if (eventsEmpty) {
        eventsEmpty.hidden = liste.length !== 0;
    }
}


/* =========================================================
   RECHERCHER LES SPECTACLES
   ========================================================= */

function rechercherEvenements() {

    if (!eventDate || !eventCity) {
        return;
    }

    const dateRecherchee =
        eventDate.value;

    const villeRecherchee =
        eventCity.value
            .trim()
            .toLowerCase();

    let resultats =
        [...evenements];


    if (dateRecherchee) {

        resultats =
            resultats.filter(
                (event) =>
                    event.date === dateRecherchee
            );
    }


    if (villeRecherchee) {

        resultats =
            resultats.filter(
                (event) =>
                    event.ville
                        .toLowerCase()
                        .includes(villeRecherchee)
            );
    }


    afficherEvenements(resultats);
}


/* =========================================================
   MENU MOBILE
   ========================================================= */

if (menuToggle && navMenu) {

    menuToggle.addEventListener(
        "click",
        () => {

            const ouvert =
                navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(ouvert)
            );
        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach((lien) => {

            lien.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );

        });
}


/* =========================================================
   FORMULAIRE DE RECHERCHE
   ========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            /*
             * Une recherche manuelle annule
             * la recherche GPS précédente.
             */

            derniereRecherche.latitude = null;
            derniereRecherche.longitude = null;

            rechercherTroupes();
        }
    );
}


/* =========================================================
   BOUTON MA POSITION
   ========================================================= */

if (useLocationButton) {

    useLocationButton.addEventListener(
        "click",
        utiliserPosition
    );
}


/* =========================================================
   VOIR PLUS
   ========================================================= */

if (showMoreButton) {

    showMoreButton.addEventListener(
        "click",
        () => {

            troupesVisibles += 4;

            rechercherTroupes();
        }
    );
}


/* =========================================================
   FORMULAIRE DES SPECTACLES
   ========================================================= */

if (eventsForm) {

    eventsForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            rechercherEvenements();
        }
    );
}


/* =========================================================
   RÉINITIALISER LES SPECTACLES
   ========================================================= */

if (clearEventsButton) {

    clearEventsButton.addEventListener(
        "click",
        () => {

            if (eventDate) {
                eventDate.value = "";
            }

            if (eventCity) {
                eventCity.value = "";
            }

            afficherEvenements(evenements);
        }
    );
}


/* =========================================================
   RETOUR EN HAUT
   ========================================================= */

if (backToTop) {

    backToTop.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* =========================================================
   INITIALISATION
   ========================================================= */

afficherTroupes(troupes);

afficherEvenements(evenements);