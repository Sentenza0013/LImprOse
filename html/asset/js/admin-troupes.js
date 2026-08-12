"use strict";


/* =========================================================
   API
   ========================================================= */

const API_URL = "http://localhost:3000/api/troupes";


/* =========================================================
   ÉLÉMENTS HTML
   ========================================================= */

const troupesList =
    document.querySelector("#troupes-admin-list");

const troupesCount =
    document.querySelector("#troupes-count");

const troupesEmpty =
    document.querySelector("#troupes-empty");

const formSection =
    document.querySelector("#troupe-form-section");

const form =
    document.querySelector("#troupe-form");

const formTitle =
    document.querySelector("#form-title");

const message =
    document.querySelector("#admin-message");

const newButton =
    document.querySelector("#new-troupe-button");

const cancelButton =
    document.querySelector("#cancel-button");


/* =========================================================
   CHAMPS DU FORMULAIRE
   ========================================================= */

const fields = {
    id: document.querySelector("#troupe-id"),
    nom: document.querySelector("#nom"),
    ville: document.querySelector("#ville"),
    code_postal: document.querySelector("#code_postal"),
    departement: document.querySelector("#departement"),
    adresse: document.querySelector("#adresse"),
    description: document.querySelector("#description"),
    image: document.querySelector("#image"),
    latitude: document.querySelector("#latitude"),
    longitude: document.querySelector("#longitude")
};


/* =========================================================
   DONNÉES
   ========================================================= */

let troupes = [];


/* =========================================================
   MESSAGE
   ========================================================= */

function afficherMessage(texte) {

    message.textContent = texte;

    message.hidden = false;
}


/* =========================================================
   CHARGER LES TROUPES
   ========================================================= */

async function chargerTroupes() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );
        }


        troupes =
            await response.json();


        afficherTroupes();

    } catch (error) {

        console.error(
            "Erreur lors du chargement :",
            error
        );

        afficherMessage(
            "Impossible de charger les troupes."
        );
    }
}


/* =========================================================
   AFFICHER LES TROUPES
   ========================================================= */

function afficherTroupes() {

    troupesList.innerHTML = "";


    troupesCount.textContent =
        `${troupes.length} troupe${
            troupes.length > 1 ? "s" : ""
        }`;


    troupesEmpty.hidden =
        troupes.length !== 0;


    troupes.forEach((troupe) => {

        const card =
            document.createElement("article");

        card.className =
            "troupe-admin-card";


        card.innerHTML = `

            <div class="troupe-admin-info">

                <h3>
                    ${troupe.nom}
                </h3>

                <p>
                    ${troupe.ville}
                    ${
                        troupe.code_postal
                            ? ` · ${troupe.code_postal}`
                            : ""
                    }
                </p>

                ${
                    troupe.adresse
                        ? `
                            <p>
                                ${troupe.adresse}
                            </p>
                        `
                        : ""
                }

            </div>


            <div class="troupe-admin-actions">

                <button
                    type="button"
                    class="secondary-button edit-button"
                    data-id="${troupe.id}">
                    Modifier
                </button>

                <button
                    type="button"
                    class="danger-button delete-button"
                    data-id="${troupe.id}">
                    Supprimer
                </button>

            </div>
        `;


        troupesList.appendChild(card);
    });


    document
        .querySelectorAll(".edit-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    modifierTroupe(
                        Number(button.dataset.id)
                    );
                }
            );
        });


    document
        .querySelectorAll(".delete-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    supprimerTroupe(
                        Number(button.dataset.id)
                    );
                }
            );
        });
}


/* =========================================================
   OUVRIR LE FORMULAIRE
   ========================================================= */

function ouvrirFormulaire() {

    formSection.hidden = false;

    formTitle.textContent =
        "Ajouter une troupe";

    form.reset();

    fields.id.value = "";

    formSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   MODIFIER UNE TROUPE
   ========================================================= */

function modifierTroupe(id) {

    const troupe =
        troupes.find(
            (item) => item.id === id
        );


    if (!troupe) {
        return;
    }


    formSection.hidden = false;

    formTitle.textContent =
        "Modifier une troupe";


    fields.id.value =
        troupe.id;

    fields.nom.value =
        troupe.nom ?? "";

    fields.ville.value =
        troupe.ville ?? "";

    fields.code_postal.value =
        troupe.code_postal ?? "";

    fields.departement.value =
        troupe.departement ?? "";

    fields.adresse.value =
        troupe.adresse ?? "";

    fields.description.value =
        troupe.description ?? "";

    fields.image.value =
        troupe.image ?? "";

    fields.latitude.value =
        troupe.latitude ?? "";

    fields.longitude.value =
        troupe.longitude ?? "";


    formSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   ENREGISTRER
   ========================================================= */

async function enregistrerTroupe(event) {

    event.preventDefault();


    const id =
        fields.id.value;


    const troupe = {

        nom:
            fields.nom.value.trim(),

        ville:
            fields.ville.value.trim(),

        code_postal:
            fields.code_postal.value.trim(),

        departement:
            fields.departement.value.trim(),

        adresse:
            fields.adresse.value.trim(),

        description:
            fields.description.value.trim(),

        image:
            fields.image.value.trim(),

        latitude:
            fields.latitude.value
                ? Number(fields.latitude.value)
                : null,

        longitude:
            fields.longitude.value
                ? Number(fields.longitude.value)
                : null
    };


    try {

        const response =
            await fetch(
                id
                    ? `${API_URL}/${id}`
                    : API_URL,
                {
                    method: id
                        ? "PUT"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(troupe)
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Erreur lors de l'enregistrement"
            );
        }


        afficherMessage(
            id
                ? "Troupe modifiée."
                : "Troupe ajoutée."
        );


        form.reset();

        fields.id.value = "";

        formSection.hidden = true;


        await chargerTroupes();

    } catch (error) {

        console.error(
            "Erreur :",
            error
        );

        afficherMessage(
            error.message
        );
    }
}


/* =========================================================
   SUPPRIMER
   ========================================================= */

async function supprimerTroupe(id) {

    const troupe =
        troupes.find(
            (item) => item.id === id
        );


    if (!troupe) {
        return;
    }


    const confirmation =
        confirm(
            `Supprimer la troupe "${troupe.nom}" ?`
        );


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Impossible de supprimer la troupe"
            );
        }


        afficherMessage(
            "Troupe supprimée."
        );


        await chargerTroupes();

    } catch (error) {

        console.error(
            "Erreur :",
            error
        );

        afficherMessage(
            error.message
        );
    }
}


/* =========================================================
   ANNULER
   ========================================================= */

function annulerFormulaire() {

    form.reset();

    fields.id.value = "";

    formSection.hidden = true;
}


/* =========================================================
   ÉVÉNEMENTS
   ========================================================= */

newButton.addEventListener(
    "click",
    ouvrirFormulaire
);

cancelButton.addEventListener(
    "click",
    annulerFormulaire
);

form.addEventListener(
    "submit",
    enregistrerTroupe
);


/* =========================================================
   INITIALISATION
   ========================================================= */

chargerTroupes();