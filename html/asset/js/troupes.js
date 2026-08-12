"use strict";

/* =========================================================
   API
   ========================================================= */

const API_URL = "http://localhost:3000/api/troupes";


/* =========================================================
   DONNÉES DES TROUPES
   ========================================================= */

let troupes = [];


/* =========================================================
   SPECTACLES / ÉVÉNEMENTS DE DÉMONSTRATION
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
   RÉCUPÉRATION DES ÉLÉMENTS HTML
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


/* =========================================================
   VARIABLES
   ========================================================= */

let troupesVisibles = 4;

let derniereRecherche = {
    ville: "",
    latitude: null,
    longitude: null,
    rayon: 10
};


/* =========================================================
   CHARGER LES TROUPES DEPUIS LE BACKEND
   ========================================================= */

async function chargerTroupes() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Erreur HTTP ${response.status}`
            );
        }

        troupes = await response.json();

        afficherTroupes(troupes);

        searchStatus.textContent =
            `${troupes.length} troupe${troupes.length > 1 ? "s" : ""} disponible${troupes.length > 1 ? "s" : ""}.`;

    } catch (error) {
        console.error(
            "Erreur lors du chargement des troupes :",
            error
        );

        troupes = [];

        afficherTroupes([]);

        searchStatus.textContent =
            "Impossible de charger les troupes.";
    }
}


/* =========================================================
   AFFICHER LES TROUPES
   ========================================================= */

function afficherTroupes(liste) {

    troupesList.innerHTML = "";

    const visibles = liste.slice(0, troupesVisibles);

    visibles.forEach((troupe) => {

        const article = document.createElement("article");

        article.className = "troupe-card";

        article.innerHTML = `
            <div class="troupe-image">

                ${
                    troupe.image
                        ? `
                            <img
                                src="${troupe.image}"
                                alt="Troupe ${troupe.nom}"
                                loading="lazy"
                                onerror="this.style.display='none'"
                            >
                        `
                        : ""
                }

            </div>

            <div class="troupe-body">

                <h3 class="troupe-name">
                    ${troupe.nom}
                </h3>

                <p class="troupe-city">
                    ${troupe.ville} · ${troupe.departement ?? ""}
                </p>

                <p class="troupe-description">
                    ${troupe.description ?? ""}
                </p>

                <a
                    class="troupe-link"
                    href="./contact.html">
                    DÉCOUVRIR →
                </a>

            </div>
        `;

        troupesList.appendChild(article);
    });


    troupesCount.textContent =
        `${liste.length} troupe${liste.length > 1 ? "s" : ""}`;

    troupesEmpty.hidden =
        liste.length !== 0;

    showMoreButton.hidden =
        liste.length <= troupesVisibles;
}


/* =========================================================
   RECHERCHE DES TROUPES
   ========================================================= */

function rechercherTroupes() {

    const recherche =
        locationInput.value.trim().toLowerCase();

    const rayon =
        Number(radiusSelect.value);

    derniereRecherche.rayon = rayon;

    let resultats = troupes;


    /*
     * Recherche par ville, département,
     * nom de troupe ou description.
     */

    if (recherche) {

        resultats = resultats.filter((troupe) => {

            const texte = `
                ${troupe.nom ?? ""}
                ${troupe.ville ?? ""}
                ${troupe.code_postal ?? ""}
                ${troupe.departement ?? ""}
                ${troupe.adresse ?? ""}
                ${troupe.description ?? ""}
            `.toLowerCase();

            return texte.includes(recherche);
        });
    }


    /*
     * Si l'utilisateur utilise sa position,
     * on filtre également selon le rayon.
     */

    if (
        derniereRecherche.latitude !== null &&
        derniereRecherche.longitude !== null
    ) {

        resultats = resultats.filter((troupe) => {

            if (
                troupe.latitude === null ||
                troupe.longitude === null
            ) {
                return false;
            }

            const distance =
                calculerDistanceKm(
                    derniereRecherche.latitude,
                    derniereRecherche.longitude,
                    Number(troupe.latitude),
                    Number(troupe.longitude)
                );

            return distance <= rayon;
        });
    }


    afficherTroupes(resultats);


    if (recherche) {

        searchStatus.textContent =
            `${resultats.length} troupe${
                resultats.length > 1 ? "s" : ""
            } trouvée${
                resultats.length > 1 ? "s" : ""
            } pour « ${locationInput.value.trim()} ».`;

    } else {

        searchStatus.textContent =
            `${resultats.length} troupe${
                resultats.length > 1 ? "s" : ""
            } disponible${
                resultats.length > 1 ? "s" : ""
            }.`;
    }
}


/* =========================================================
   UTILISER LA POSITION GPS
   ========================================================= */

function utiliserPosition() {

    if (!navigator.geolocation) {

        searchStatus.textContent =
            "La géolocalisation n'est pas disponible sur ce navigateur.";

        return;
    }


    searchStatus.textContent =
        "Recherche de votre position...";


    navigator.geolocation.getCurrentPosition(

        (position) => {

            derniereRecherche.latitude =
                position.coords.latitude;

            derniereRecherche.longitude =
                position.coords.longitude;

            locationInput.value =
                "Ma position";

            rechercherTroupes();

            searchStatus.textContent =
                "Recherche effectuée autour de votre position.";
        },

        () => {

            searchStatus.textContent =
                "Impossible d'obtenir votre position. Vous pouvez rechercher une ville manuellement.";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}


/* =========================================================
   CALCUL DE DISTANCE GPS
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
   AFFICHER LES ÉVÉNEMENTS
   ========================================================= */

function afficherEvenements(liste) {

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

                <strong>
                    ${jour}
                </strong>

                <span>
                    ${mois}
                </span>

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
                </p>

                <span class="event-tag">
                    ${event.type}
                </span>

            </div>


            <a
                class="event-link"
                href="./contact.html">
                DÉTAILS →
            </a>
        `;


        eventsList.appendChild(article);
    });


    eventsEmpty.hidden =
        liste.length !== 0;
}


/* =========================================================
   RECHERCHE DES ÉVÉNEMENTS
   ========================================================= */

function rechercherEvenements() {

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

                    navMenu.classList.remove(
                        "open"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );

        });
}


/* =========================================================
   ÉVÉNEMENTS DES FORMULAIRES
   ========================================================= */

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


useLocationButton.addEventListener(
    "click",
    utiliserPosition
);


showMoreButton.addEventListener(
    "click",
    () => {

        troupesVisibles += 4;

        rechercherTroupes();
    }
);


eventsForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        rechercherEvenements();
    }
);


clearEventsButton.addEventListener(
    "click",
    () => {

        eventDate.value = "";
        eventCity.value = "";

        afficherEvenements(evenements);
    }
);


/* =========================================================
   INITIALISATION
   ========================================================= */

chargerTroupes();

afficherEvenements(evenements);