"use strict";

const axios = require("axios");
const cheerio = require("cheerio");

const pool = require("../db/database");


/* =========================================================
   CONFIGURATION
   ========================================================= */

const SOURCE =
    "ImproWiki";

const LIST_URL =
    "https://improwiki.com/fr/liste_troupesdimpro_dumonde/country/FR";


/* =========================================================
   RÉCUPÉRER UNE PAGE INTERNET
   ========================================================= */

async function recupererPage(url) {

    const response = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36"
        },
        timeout: 15000
    });

    return cheerio.load(response.data);
}


/* =========================================================
   EXTRAIRE LES URL DES TROUPES
   ========================================================= */

async function recupererUrlsTroupes() {

    console.log(
        "Récupération de la liste des troupes..."
    );

    const $ =
        await recupererPage(LIST_URL);

    const urls = new Set();


    $("a").each((index, element) => {

        const href =
            $(element).attr("href");

        if (!href) {
            return;
        }


        if (
            href.includes(
                "/fr/troupe-d-impro/"
            )
        ) {

            const url =
                new URL(
                    href,
                    LIST_URL
                ).href;

            urls.add(url);
        }
    });


    console.log(
        `${urls.size} fiches trouvées.`
    );


    return [...urls];
}


/* =========================================================
   EXTRAIRE UNE INFORMATION APRÈS UN LABEL
   ========================================================= */

function recupererApresLabel($, label) {

    let valeur = null;


    $("body *").each((index, element) => {

        if (valeur) {
            return;
        }


        const texte =
            $(element)
                .text()
                .replace(/\s+/g, " ")
                .trim();


        if (
            texte.toLowerCase() ===
            label.toLowerCase()
        ) {

            const suivant =
                $(element)
                    .next()
                    .text()
                    .replace(/\s+/g, " ")
                    .trim();


            if (suivant) {
                valeur = suivant;
            }
        }
    });


    return valeur;
}


/* =========================================================
   EXTRAIRE LE SITE WEB
   ========================================================= */

function recupererSiteWeb($) {

    let site = null;


    $("a[href]").each((index, element) => {

        if (site) {
            return;
        }


        const href =
            $(element).attr("href");


        if (!href) {
            return;
        }


        if (
            !href.startsWith("http")
        ) {
            return;
        }


        if (
            href.includes("improwiki.com")
        ) {
            return;
        }


        if (
            href.includes("facebook.com") ||
            href.includes("instagram.com") ||
            href.includes("twitter.com") ||
            href.includes("youtube.com")
        ) {
            return;
        }


        site = href;
    });


    return site;
}


/* =========================================================
   EXTRAIRE UNE TROUPE
   ========================================================= */

async function recupererTroupe(url) {

    const $ =
        await recupererPage(url);


    const nom =
        $("h1")
            .first()
            .text()
            .replace(/\s+/g, " ")
            .trim();


    if (!nom) {
        return null;
    }


    const texte =
        $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();


    let ville = null;


    /*
     * ImproWiki affiche généralement :
     *
     * France / Région / Ville
     */

    const localisation =
        texte.match(
            /France\s*\/\s*([^/]+)\s*\/\s*([A-Za-zÀ-ÿ0-9'’ .-]+)/
        );


    if (localisation) {

        ville =
            localisation[2]
                .trim();
    }


    /*
     * Recherche d'une adresse.
     */

    const adresse =
        recupererApresLabel(
            $,
            "Adresse"
        );


    /*
     * Recherche du site officiel.
     */

    const siteWeb =
        recupererSiteWeb($);


    /*
     * Description.
     */

    let description = null;


    const h2 =
        $("h2");


    h2.each((index, element) => {

        if (description) {
            return;
        }


        const titre =
            $(element)
                .text()
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();


        if (
            titre === "à propos de nous"
        ) {

            const bloc =
                $(element)
                    .nextAll()
                    .slice(0, 3)
                    .text()
                    .replace(/\s+/g, " ")
                    .trim();


            if (bloc) {
                description = bloc;
            }
        }
    });


    return {

        nom,

        ville,

        adresse,

        description,

        site_web: siteWeb,

        source: SOURCE,

        source_url: url
    };
}


/* =========================================================
   ENREGISTRER OU METTRE À JOUR UNE TROUPE
   ========================================================= */

async function enregistrerTroupe(troupe) {

    /*
     * On cherche d'abord une troupe provenant
     * de la même fiche ImproWiki.
     */

    const recherche =
        await pool.query(
            `
            SELECT id
            FROM troupes
            WHERE source = $1
            AND source_url = $2
            LIMIT 1
            `,
            [
                troupe.source,
                troupe.source_url
            ]
        );


    if (recherche.rows.length > 0) {

        await pool.query(
            `
            UPDATE troupes
            SET
                nom = $1,
                ville = $2,
                adresse = $3,
                description = $4,
                site_web = $5,
                date_derniere_verification = CURRENT_TIMESTAMP
            WHERE id = $6
            `,
            [
                troupe.nom,
                troupe.ville,
                troupe.adresse,
                troupe.description,
                troupe.site_web,
                recherche.rows[0].id
            ]
        );


        return "mise à jour";
    }


    /*
     * Nouvelle troupe.
     */

    await pool.query(
        `
        INSERT INTO troupes (
            nom,
            ville,
            adresse,
            description,
            site_web,
            source,
            source_url,
            date_derniere_verification
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            CURRENT_TIMESTAMP
        )
        `,
        [
            troupe.nom,
            troupe.ville,
            troupe.adresse,
            troupe.description,
            troupe.site_web,
            troupe.source,
            troupe.source_url
        ]
    );


    return "ajout";
}


/* =========================================================
   IMPORT PRINCIPAL
   ========================================================= */

async function importerTroupes() {

    console.log("");
    console.log(
        "=========================================="
    );
    console.log(
        "      IMPORT DES TROUPES IMPROWIKI"
    );
    console.log(
        "=========================================="
    );
    console.log("");


    try {

        const urls =
            await recupererUrlsTroupes();


        let ajoutees = 0;
        let misesAJour = 0;
        let erreurs = 0;


        for (
            let i = 0;
            i < urls.length;
            i++
        ) {

            const url =
                urls[i];


            console.log(
                `[${i + 1}/${urls.length}] ${url}`
            );


            try {

                const troupe =
                    await recupererTroupe(url);


                if (!troupe) {

                    console.log(
                        "  → fiche ignorée"
                    );

                    continue;
                }


                const resultat =
                    await enregistrerTroupe(
                        troupe
                    );


                if (
                    resultat === "ajout"
                ) {

                    ajoutees++;

                    console.log(
                        `  → AJOUT : ${troupe.nom}`
                    );

                } else {

                    misesAJour++;

                    console.log(
                        `  → MISE À JOUR : ${troupe.nom}`
                    );
                }


                /*
                 * Petite pause pour éviter
                 * d'enchaîner trop rapidement
                 * les requêtes vers le site.
                 */

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            300
                        )
                );

            } catch (error) {

                erreurs++;

                console.error(
                    "  → ERREUR :",
                    error.message
                );
            }
        }


        console.log("");
        console.log(
            "=========================================="
        );
        console.log(
            "              IMPORT TERMINÉ"
        );
        console.log(
            "=========================================="
        );

        console.log(
            `Nouvelles troupes : ${ajoutees}`
        );

        console.log(
            `Troupes mises à jour : ${misesAJour}`
        );

        console.log(
            `Erreurs : ${erreurs}`
        );

        console.log("");


    } catch (error) {

        console.error(
            "Erreur générale :",
            error.message
        );

    } finally {

        await pool.end();
    }
}


/* =========================================================
   LANCEMENT
   ========================================================= */

importerTroupes();