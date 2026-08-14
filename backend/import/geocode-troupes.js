"use strict";

require("dotenv").config();

const axios = require("axios");
const pool = require("../db/database");

const GEOCODAGE_URL =
    "https://data.geopf.fr/geocodage/search/";

/* =========================================================
   GÉOCODER UNE TROUPE
========================================================= */

async function geocoderTroupe(troupe) {

    const morceaux = [
        troupe.adresse,
        troupe.code_postal,
        troupe.ville
    ].filter(Boolean);

    if (morceaux.length === 0) {
        return null;
    }

    const adresseRecherchee =
        morceaux.join(" ");

    console.log(
        `Recherche : ${troupe.nom}`
    );

    console.log(
        `Adresse : ${adresseRecherchee}`
    );

    try {

        const response =
            await axios.get(
                GEOCODAGE_URL,
                {
                    params: {
                        q: adresseRecherchee,
                        limit: 1
                    },
                    timeout: 15000
                }
            );

        const features =
            response.data?.features || [];

        if (features.length === 0) {

            console.log(
                "  → aucune adresse trouvée"
            );

            return null;
        }

        const feature =
            features[0];

        const coordinates =
            feature.geometry?.coordinates;

        if (
            !coordinates ||
            coordinates.length < 2
        ) {

            console.log(
                "  → coordonnées absentes"
            );

            return null;
        }

        /*
         * GeoJSON :
         *
         * coordinates[0] = longitude
         * coordinates[1] = latitude
         */

        const longitude =
            coordinates[0];

        const latitude =
            coordinates[1];


        console.log(
            `  → trouvé : ${latitude}, ${longitude}`
        );

        return {
            latitude,
            longitude
        };

    } catch (error) {

        console.error(
            `  → erreur géocodage : ${error.message}`
        );

        return null;
    }
}


/* =========================================================
   IMPORT / GÉOCODAGE
========================================================= */

async function geocoderToutesLesTroupes() {

    console.log("");
    console.log(
        "=========================================="
    );
    console.log(
        "      GÉOCODAGE DES TROUPES"
    );
    console.log(
        "=========================================="
    );
    console.log("");


    /*
     * On récupère uniquement les troupes
     * qui n'ont pas encore de coordonnées.
     */

    const result =
        await pool.query(
            `
            SELECT
                id,
                nom,
                ville,
                code_postal,
                adresse
            FROM troupes
            WHERE
                latitude IS NULL
                OR longitude IS NULL
            ORDER BY id
            `
        );


    const troupes =
        result.rows;


    console.log(
        `${troupes.length} troupes à géocoder.`
    );

    console.log("");


    let trouvees = 0;
    let introuvables = 0;
    let erreurs = 0;


    for (
        let i = 0;
        i < troupes.length;
        i++
    ) {

        const troupe =
            troupes[i];


        console.log(
            `[${i + 1}/${troupes.length}]`
        );


        try {

            const coordonnees =
                await geocoderTroupe(
                    troupe
                );


            if (!coordonnees) {

                introuvables++;

                continue;
            }


            await pool.query(
                `
                UPDATE troupes
                SET
                    latitude = $1,
                    longitude = $2,
                    date_derniere_verification =
                        CURRENT_TIMESTAMP,
                    updated_at =
                        CURRENT_TIMESTAMP
                WHERE id = $3
                `,
                [
                    coordonnees.latitude,
                    coordonnees.longitude,
                    troupe.id
                ]
            );


            trouvees++;


            /*
             * Petite pause entre les requêtes.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        100
                    )
            );


        } catch (error) {

            erreurs++;

            console.error(
                `Erreur pour ${troupe.nom} :`,
                error.message
            );
        }
    }


    console.log("");
    console.log(
        "=========================================="
    );
    console.log(
        "        GÉOCODAGE TERMINÉ"
    );
    console.log(
        "=========================================="
    );

    console.log(
        `Troupes géocodées : ${trouvees}`
    );

    console.log(
        `Adresses introuvables : ${introuvables}`
    );

    console.log(
        `Erreurs : ${erreurs}`
    );

    console.log(
        "=========================================="
    );
}


/* =========================================================
   LANCEMENT
========================================================= */

geocoderToutesLesTroupes()
    .catch(error => {

        console.error(
            "ERREUR FATALE :",
            error.message
        );

    })
    .finally(async () => {

        await pool.end();

    });