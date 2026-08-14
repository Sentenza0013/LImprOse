"use strict";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api/troupes";

const GEOCODAGE_URL =
    "https://data.geopf.fr/geocodage/search";


/* =========================================================
   VARIABLES
========================================================= */

let troupes = [];

let resultatsTroupes = [];

let troupesVisibles = 4;

let derniereRecherche = {
    ville: "",
    latitude: null,
    longitude: null,
    rayon: 10
};


/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const searchForm =
    document.querySelector("#search-form");

const locationInput =
    document.querySelector("#location-input");

const radiusSelect =
    document.querySelector("#radius-select");

const useLocationButton =
    document.querySelector("#use-location");

const searchStatus =
    document.querySelector("#search-status");

const troupesList =
    document.querySelector("#troupes-list");

const troupesCount =
    document.querySelector("#troupes-count");

const troupesEmpty =
    document.querySelector("#troupes-empty");

const showMoreButton =
    document.querySelector("#show-more-troupes");

const eventsForm =
    document.querySelector("#events-form");

const eventDate =
    document.querySelector("#event-date");

const eventCity =
    document.querySelector("#event-city");

const eventsList =
    document.querySelector("#events-list");

const eventsEmpty =
    document.querySelector("#events-empty");

const clearEventsButton =
    document.querySelector("#clear-events");

const menuToggle =
    document.querySelector(".menu-toggle");

const navMenu =
    document.querySelector(".nav-menu");


/* =========================================================
   ÉVÉNEMENTS DE DÉMONSTRATION
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
   CHARGER LES TROUPES
========================================================= */

async function chargerTroupes() {

    afficherStatut(
        "Chargement des troupes..."
    );

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );
        }

        const donnees =
            await response.json();

        troupes =
            Array.isArray(donnees)
                ? donnees
                : [];

        resultatsTroupes =
            [...troupes];

        troupesVisibles = 4;

        afficherTroupes(
            resultatsTroupes
        );

        afficherStatut(
            `${troupes.length} troupe${
                troupes.length > 1 ? "s" : ""
            } disponible${
                troupes.length > 1 ? "s" : ""
            }.`
        );

    } catch (error) {

        console.error(
            "Erreur lors du chargement des troupes :",
            error
        );

        troupes = [];

        resultatsTroupes = [];

        afficherTroupes([]);

        afficherStatut(
            "Impossible de charger les troupes."
        );
    }
}


/* =========================================================
   AFFICHER LES TROUPES
========================================================= */

function afficherTroupes(liste) {

    if (!troupesList) {
        return;
    }

    troupesList.innerHTML = "";

    const visibles =
        liste.slice(
            0,
            troupesVisibles
        );

    visibles.forEach(
        (troupe) => {

            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "troupe-card";


            const image =
                troupe.image
                    ? `
                        <img
                            src="${echapperAttribut(
                                troupe.image
                            )}"
                            alt="Troupe ${echapperAttribut(
                                troupe.nom || ""
                            )}"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >
                    `
                    : "";


            article.innerHTML = `

                <div class="troupe-image">

                    ${image}

                </div>


                <div class="troupe-body">

                    <h3 class="troupe-name">

                        ${echapperHTML(
                            troupe.nom ||
                            "Troupe inconnue"
                        )}

                    </h3>


                    <p class="troupe-city">

                        ${echapperHTML(
                            troupe.ville ||
                            "Ville non renseignée"
                        )}

                        ${
                            troupe.departement
                                ? ` · ${echapperHTML(
                                    troupe.departement
                                )}`
                                : ""
                        }

                    </p>


                    <p class="troupe-description">

                        ${echapperHTML(
                            troupe.description ||
                            ""
                        )}

                    </p>


                    <button
                        type="button"
                        class="troupe-link"
                        data-troupe-id="${troupe.id}"
                    >
                        DÉCOUVRIR →
                    </button>

                </div>
            `;


            troupesList.appendChild(
                article
            );
        }
    );


    troupesList
        .querySelectorAll(
            "[data-troupe-id]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.troupeId;

                        ouvrirModalTroupe(
                            id
                        );
                    }
                );
            }
        );


    if (troupesCount) {

        troupesCount.textContent =
            `${liste.length} troupe${
                liste.length > 1 ? "s" : ""
            }`;
    }


    if (troupesEmpty) {

        troupesEmpty.hidden =
            liste.length !== 0;
    }


    if (showMoreButton) {

        showMoreButton.hidden =
            liste.length <= troupesVisibles;
    }
}


/* =========================================================
   GÉOCODAGE
========================================================= */

async function geocoderVille(
    recherche
) {

    const ville =
        recherche.trim();

    if (!ville) {
        return null;
    }

    try {

        const url =
            `${GEOCODAGE_URL}?q=${encodeURIComponent(
                ville
            )}&limit=1`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Erreur géocodage HTTP ${response.status}`
            );
        }

        const donnees =
            await response.json();

        if (
            !donnees.features ||
            donnees.features.length === 0
        ) {

            return null;
        }

        const coordinates =
            donnees.features[0]
                ?.geometry
                ?.coordinates;

        if (
            !coordinates ||
            coordinates.length < 2
        ) {

            return null;
        }

        return {

            longitude:
                Number(
                    coordinates[0]
                ),

            latitude:
                Number(
                    coordinates[1]
                )
        };

    } catch (error) {

        console.error(
            "Erreur de géocodage :",
            error
        );

        return null;
    }
}


/* =========================================================
   CALCUL DISTANCE
========================================================= */

function calculerDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const rayonTerre =
        6371;

    const dLat =
        convertirRadians(
            lat2 - lat1
        );

    const dLon =
        convertirRadians(
            lon2 - lon1
        );

    const a =
        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            convertirRadians(lat1)
        ) *

        Math.cos(
            convertirRadians(lat2)
        ) *

        Math.sin(
            dLon / 2
        ) ** 2;

    const c =
        2 *

        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return rayonTerre * c;
}


function convertirRadians(
    degres
) {

    return (
        degres *
        Math.PI /
        180
    );
}


/* =========================================================
   RECHERCHE DES TROUPES
========================================================= */

async function rechercherTroupes() {

    const recherche =
        locationInput
            ? locationInput.value
                .trim()
                .toLowerCase()
            : "";


    const rayon =
        radiusSelect
            ? Number(
                radiusSelect.value
            )
            : 10;


    derniereRecherche.rayon =
        rayon;


    let resultats =
        [...troupes];


    if (recherche) {

        resultats =
            resultats.filter(
                (troupe) => {

                    const texte = `

                        ${troupe.nom || ""}

                        ${troupe.ville || ""}

                        ${troupe.code_postal || ""}

                        ${troupe.departement || ""}

                        ${troupe.adresse || ""}

                        ${troupe.description || ""}

                    `.toLowerCase();


                    return texte.includes(
                        recherche
                    );
                }
            );
    }


    if (
        derniereRecherche.latitude !== null &&
        derniereRecherche.longitude !== null
    ) {

        resultats =
            resultats.filter(
                (troupe) => {

                    if (
                        troupe.latitude === null ||
                        troupe.latitude === undefined ||
                        troupe.longitude === null ||
                        troupe.longitude === undefined
                    ) {

                        return false;
                    }


                    const distance =
                        calculerDistanceKm(
                            derniereRecherche.latitude,
                            derniereRecherche.longitude,
                            Number(
                                troupe.latitude
                            ),
                            Number(
                                troupe.longitude
                            )
                        );


                    return (
                        distance <= rayon
                    );
                }
            );
    }


    resultatsTroupes =
        resultats;

    troupesVisibles = 4;


    afficherTroupes(
        resultatsTroupes
    );


    if (recherche) {

        afficherStatut(
            `${resultats.length} troupe${
                resultats.length > 1 ? "s" : ""
            } trouvée${
                resultats.length > 1 ? "s" : ""
            } pour « ${
                locationInput.value.trim()
            } ».`
        );

    } else {

        afficherStatut(
            `${resultats.length} troupe${
                resultats.length > 1 ? "s" : ""
            } disponible${
                resultats.length > 1 ? "s" : ""
            }.`
        );
    }
}


/* =========================================================
   UTILISER LA POSITION
========================================================= */

function utiliserPosition() {

    if (!navigator.geolocation) {

        afficherStatut(
            "La géolocalisation n'est pas disponible."
        );

        return;
    }


    afficherStatut(
        "Recherche de votre position..."
    );


    navigator.geolocation.getCurrentPosition(

        (position) => {

            derniereRecherche.latitude =
                position.coords.latitude;

            derniereRecherche.longitude =
                position.coords.longitude;


            if (locationInput) {

                locationInput.value =
                    "Ma position";
            }


            rechercherTroupes();

        },


        () => {

            afficherStatut(
                "Impossible d'obtenir votre position."
            );
        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}


/* =========================================================
   CALCUL DISTANCE / OUTILS
========================================================= */

function ouvrirModalTroupe(
    id
) {

    let modal =
        document.querySelector(
            "#troupe-modal"
        );


    if (!modal) {

        modal =
            creerModalTroupe();

        document.body.appendChild(
            modal
        );
    }


    modal.classList.add(
        "is-open"
    );

    document.body.style.overflow =
        "hidden";


    const contenu =
        modal.querySelector(
            ".troupe-modal-content"
        );


    contenu.innerHTML = `

        <div class="troupe-modal-loading">

            Chargement des informations...

        </div>
    `;


    fetch(
        `${API_URL}/${id}`
    )
        .then(
            (response) => {

                if (!response.ok) {

                    throw new Error(
                        "Impossible de récupérer cette troupe."
                    );
                }

                return response.json();
            }
        )
        .then(
            (troupe) => {

                afficherContenuModal(
                    contenu,
                    troupe
                );
            }
        )
        .catch(
            (error) => {

                console.error(
                    "Erreur modale troupe :",
                    error
                );


                contenu.innerHTML = `

                    <div class="troupe-modal-error">

                        <h2>
                            Impossible de charger la troupe
                        </h2>

                        <p>
                            Une erreur est survenue lors de la récupération des informations.
                        </p>

                    </div>
                `;
            }
        );
}


/* =========================================================
   CRÉER LA MODALE
========================================================= */

function creerModalTroupe() {

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "troupe-modal";

    modal.className =
        "troupe-modal";


    modal.innerHTML = `

        <div
            class="troupe-modal-overlay"
            data-close-modal
        ></div>


        <div
            class="troupe-modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="troupe-modal-title"
        >

            <button
                type="button"
                class="troupe-modal-close"
                aria-label="Fermer"
                data-close-modal
            >
                ×
            </button>


            <div class="troupe-modal-content">

                <div class="troupe-modal-loading">
                    Chargement...
                </div>

            </div>

        </div>
    `;


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            (element) => {

                element.addEventListener(
                    "click",
                    fermerModalTroupe
                );
            }
        );


    modal.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                fermerModalTroupe();
            }
        }
    );


    ajouterStyleModal();


    return modal;
}


/* =========================================================
   CONTENU DE LA MODALE
========================================================= */

function afficherContenuModal(
    contenu,
    troupe
) {

    const nom =
        echapperHTML(
            troupe.nom ||
            "Troupe sans nom"
        );


    const ville =
        echapperHTML(
            troupe.ville ||
            "Ville non renseignée"
        );


    const codePostal =
        troupe.code_postal
            ? echapperHTML(
                troupe.code_postal
            )
            : "";


    const departement =
        troupe.departement
            ? echapperHTML(
                troupe.departement
            )
            : "";


    const description =
        echapperHTML(
            troupe.description ||
            "Aucune description disponible."
        );


    const adresse =
        troupe.adresse
            ? echapperHTML(
                troupe.adresse
            )
            : "";


    const image =
        troupe.image
            ? `
                <img
                    src="${echapperAttribut(
                        troupe.image
                    )}"
                    alt="${echapperAttribut(
                        troupe.nom || ""
                    )}"
                    class="troupe-modal-image"
                    onerror="this.style.display='none'"
                >
            `
            : "";


    /*
     * SITE OFFICIEL UNIQUEMENT
     *
     * Si aucun site officiel n'est renseigné,
     * aucun bouton n'est affiché.
     */

    const siteWebValide =
        troupe.site_web &&
        !troupe.site_web.includes(
            "twitter.com/share"
        );


    const lien =
        siteWebValide
            ? `
                <a
                    href="${echapperAttribut(
                        troupe.site_web
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="troupe-modal-button"
                >
                    Visiter le site de la troupe
                </a>
            `
            : "";


    contenu.innerHTML = `

        ${image}


        <div class="troupe-modal-info">

            <p class="troupe-modal-label">
                TROUPE D'IMPROVISATION
            </p>


            <h2
                id="troupe-modal-title"
            >
                ${nom}
            </h2>


            <p class="troupe-modal-location">

                ${ville}

                ${
                    codePostal
                        ? ` · ${codePostal}`
                        : ""
                }

                ${
                    departement
                        ? ` · ${departement}`
                        : ""
                }

            </p>


            <div class="troupe-modal-section">

                <h3>
                    À propos
                </h3>

                <p>
                    ${description}
                </p>

            </div>


            ${
                adresse
                    ? `
                        <div class="troupe-modal-section">

                            <h3>
                                Adresse
                            </h3>

                            <p>
                                ${adresse}
                            </p>

                        </div>
                    `
                    : ""
            }


            ${
                lien
                    ? `
                        <div class="troupe-modal-actions">

                            ${lien}

                        </div>
                    `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   FERMER LA MODALE
========================================================= */

function fermerModalTroupe() {

    const modal =
        document.querySelector(
            "#troupe-modal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "is-open"
    );


    document.body.style.overflow =
        "";
}


/* =========================================================
   STYLE MODALE
========================================================= */

function ajouterStyleModal() {

    if (
        document.querySelector(
            "#troupe-modal-style"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "troupe-modal-style";


    style.textContent = `

        .troupe-modal {

            position: fixed;

            inset: 0;

            z-index: 9999;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 20px;

        }


        .troupe-modal.is-open {

            display: flex;

        }


        .troupe-modal-overlay {

            position: absolute;

            inset: 0;

            background:
                rgba(10, 0, 20, .72);

            backdrop-filter:
                blur(4px);

        }


        .troupe-modal-box {

            position: relative;

            z-index: 1;

            width: min(
                650px,
                100%
            );

            max-height:
                90vh;

            overflow-y:
                auto;

            background:
                #ffffff;

            border-radius:
                18px;

            box-shadow:
                0 25px 80px
                rgba(0, 0, 0, .35);

            animation:
                troupeModalAppear
                .25s
                ease;

        }


        .troupe-modal-close {

            position: absolute;

            top: 14px;

            right: 14px;

            z-index: 2;

            width: 38px;

            height: 38px;

            border: none;

            border-radius: 50%;

            background:
                rgba(0, 0, 0, .08);

            color:
                #180022;

            font-size:
                26px;

            line-height:
                1;

            cursor:
                pointer;

        }


        .troupe-modal-image {

            display:
                block;

            width:
                100%;

            max-height:
                280px;

            object-fit:
                cover;

        }


        .troupe-modal-info {

            padding:
                30px;

        }


        .troupe-modal-label {

            margin:
                0 0 8px;

            color:
                #6c19df;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                1.5px;

        }


        .troupe-modal-info h2 {

            margin:
                0;

            color:
                #180022;

            font-size:
                34px;

            line-height:
                1.1;

        }


        .troupe-modal-location {

            margin:
                8px 0 25px;

            color:
                #6c19df;

            font-weight:
                700;

        }


        .troupe-modal-section {

            margin-top:
                22px;

        }


        .troupe-modal-section h3 {

            margin:
                0 0 7px;

            color:
                #180022;

            font-size:
                16px;

        }


        .troupe-modal-section p {

            margin:
                0;

            color:
                #5d5662;

            line-height:
                1.6;

        }


        .troupe-modal-actions {

            margin-top:
                25px;

        }


        .troupe-modal-button {

            display:
                inline-flex;

            align-items:
                center;

            justify-content:
                center;

            padding:
                11px 18px;

            border-radius:
                8px;

            color:
                #ffffff;

            background:
                linear-gradient(
                    135deg,
                    #6c19df,
                    #42108e
                );

            font-size:
                12px;

            font-weight:
                800;

            text-decoration:
                none;

        }


        .troupe-modal-loading,
        .troupe-modal-error {

            padding:
                45px 30px;

            text-align:
                center;

        }


        @keyframes troupeModalAppear {

            from {

                opacity:
                    0;

                transform:
                    translateY(15px)
                    scale(.98);

            }

            to {

                opacity:
                    1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        @media (max-width: 600px) {

            .troupe-modal {

                padding:
                    10px;

            }


            .troupe-modal-box {

                max-height:
                    94vh;

                border-radius:
                    14px;

            }


            .troupe-modal-info {

                padding:
                    22px;

            }

        }
    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   ÉVÉNEMENTS
========================================================= */

function afficherEvenements(
    liste
) {

    if (!eventsList) {
        return;
    }


    eventsList.innerHTML = "";


    liste.forEach(
        (event) => {

            const date =
                new Date(
                    `${event.date}T12:00:00`
                );


            const jour =
                date.toLocaleDateString(
                    "fr-FR",
                    {
                        day: "2-digit"
                    }
                );


            const mois =
                date
                    .toLocaleDateString(
                        "fr-FR",
                        {
                            month: "short"
                        }
                    )
                    .replace(
                        ".",
                        ""
                    );


            const article =
                document.createElement(
                    "article"
                );


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
                        ${echapperHTML(
                            event.titre
                        )}
                    </h3>


                    <p>

                        ${echapperHTML(
                            event.troupe
                        )}

                        ·

                        ${echapperHTML(
                            event.ville
                        )}

                        ·

                        ${echapperHTML(
                            event.heure
                        )}

                    </p>


                    <span class="event-tag">

                        ${echapperHTML(
                            event.type
                        )}

                    </span>

                </div>


                <button
                    type="button"
                    class="event-link"
                >
                    DÉTAILS →
                </button>
            `;


            eventsList.appendChild(
                article
            );
        }
    );


    if (eventsEmpty) {

        eventsEmpty.hidden =
            liste.length !== 0;
    }
}


/* =========================================================
   RECHERCHE ÉVÉNEMENTS
========================================================= */

function rechercherEvenements() {

    const dateRecherchee =
        eventDate
            ? eventDate.value
            : "";


    const villeRecherchee =
        eventCity
            ? eventCity.value
                .trim()
                .toLowerCase()
            : "";


    let resultats =
        [...evenements];


    if (dateRecherchee) {

        resultats =
            resultats.filter(
                (event) =>
                    event.date ===
                    dateRecherchee
            );
    }


    if (villeRecherchee) {

        resultats =
            resultats.filter(
                (event) =>
                    event.ville
                        .toLowerCase()
                        .includes(
                            villeRecherchee
                        )
            );
    }


    afficherEvenements(
        resultats
    );
}


/* =========================================================
   MENU
========================================================= */

if (
    menuToggle &&
    navMenu
) {

    menuToggle.addEventListener(
        "click",
        () => {

            const ouvert =
                navMenu.classList.toggle(
                    "open"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                String(ouvert)
            );
        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(
            (lien) => {

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
            }
        );
}


/* =========================================================
   FORMULAIRE TROUPES
========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            derniereRecherche.latitude =
                null;

            derniereRecherche.longitude =
                null;

            await rechercherTroupes();
        }
    );
}


/* =========================================================
   BOUTON POSITION
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
        (event) => {

            event.preventDefault();

            troupesVisibles += 4;

            afficherTroupes(
                resultatsTroupes
            );
        }
    );
}


/* =========================================================
   FORMULAIRE ÉVÉNEMENTS
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
   RESET ÉVÉNEMENTS
========================================================= */

if (clearEventsButton) {

    clearEventsButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            if (eventDate) {
                eventDate.value = "";
            }

            if (eventCity) {
                eventCity.value = "";
            }

            afficherEvenements(
                evenements
            );
        }
    );
}


/* =========================================================
   UTILITAIRES
========================================================= */

function echapperHTML(
    valeur
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        valeur ?? "";

    return div.innerHTML;
}


function echapperAttribut(
    valeur
) {

    return echapperHTML(
        valeur
    ).replace(
        /"/g,
        "&quot;"
    );
}


function afficherStatut(
    message
) {

    if (searchStatus) {

        searchStatus.textContent =
            message;
    }
}


/* =========================================================
   INITIALISATION
========================================================= */

chargerTroupes();

afficherEvenements(
    evenements
);