"use strict";

require("dotenv").config();

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

const BASE_URL =
    "https://improwiki.com";

const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36";

const TIMEOUT =
    20000;

const MAX_TENTATIVES =
    4;


/* =========================================================
   PAUSE
========================================================= */

function attendre(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


/* =========================================================
   RÉCUPÉRER UNE PAGE AVEC RETRIES
========================================================= */

async function recupererPage(url) {

    let derniereErreur =
        null;


    for (
        let tentative = 1;
        tentative <= MAX_TENTATIVES;
        tentative++
    ) {

        try {

            const response =
                await axios.get(
                    url,
                    {
                        headers: {

                            "User-Agent":
                                USER_AGENT,

                            "Accept":
                                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

                            "Accept-Language":
                                "fr-FR,fr;q=0.9,en;q=0.8",

                            "Connection":
                                "keep-alive"
                        },

                        timeout:
                            TIMEOUT,

                        maxRedirects:
                            5,

                        decompress:
                            true
                    }
                );


            return response.data;


        } catch (error) {

            derniereErreur =
                error;


            console.log(
                `  → tentative ${tentative}/${MAX_TENTATIVES} échouée : ${error.message}`
            );


            if (
                tentative <
                MAX_TENTATIVES
            ) {

                await attendre(
                    2000 * tentative
                );
            }
        }
    }


    throw derniereErreur;
}


/* =========================================================
   RÉCUPÉRATION DE LA PAGE LISTE
========================================================= */

async function recupererListe() {

    console.log(
        "Récupération de la liste des troupes..."
    );


    return recupererPage(
        LIST_URL
    );
}


/* =========================================================
   EXTRAIRE LE TABLEAU GROUPS
========================================================= */

function extraireGroupes(
    html
) {

    const match =
        html.match(
            /var\s+groups\s*=\s*(\[[\s\S]*?\]);/
        );


    if (!match) {

        throw new Error(
            "Impossible de trouver le tableau 'groups' dans la page ImproWiki."
        );
    }


    try {

        return JSON.parse(
            match[1]
        );

    } catch {

        throw new Error(
            "Le tableau 'groups' a été trouvé mais n'est pas un JSON valide."
        );
    }
}


/* =========================================================
   NETTOYER TEXTE
========================================================= */

function nettoyerTexte(
    valeur
) {

    if (
        valeur === null ||
        valeur === undefined
    ) {

        return null;
    }


    const texte =
        String(valeur)
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    return texte || null;
}


/* =========================================================
   LIMITER TEXTE
========================================================= */

function limiterTexte(
    valeur,
    longueur
) {

    const texte =
        nettoyerTexte(
            valeur
        );


    if (!texte) {

        return null;
    }


    return texte.substring(
        0,
        longueur
    );
}


/* =========================================================
   URL ABSOLUE
========================================================= */

function urlAbsolue(
    href
) {

    if (!href) {

        return null;
    }


    try {

        return new URL(
            href,
            BASE_URL
        ).href;

    } catch {

        return null;
    }
}


/* =========================================================
   CONSTRUIRE URL FICHE
========================================================= */

function construireSourceUrl(
    slug
) {

    if (!slug) {

        return null;
    }


    return (
        BASE_URL +
        "/fr/troupe-d-impro/" +
        encodeURIComponent(
            slug
        )
    );
}


/* =========================================================
   EXCLURE LES RÉSEAUX SOCIAUX
========================================================= */

function estLienExclu(
    url
) {

    if (!url) {

        return true;
    }


    const valeur =
        url.toLowerCase();


    const domaines = [

        "facebook.com",
        "instagram.com",
        "twitter.com",
        "x.com",
        "youtube.com",
        "linkedin.com",
        "tiktok.com",
        "improwiki.com"

    ];


    return domaines.some(
        domaine =>
            valeur.includes(
                domaine
            )
    );
}


/* =========================================================
   EXTRAIRE LE SITE OFFICIEL
========================================================= */

function extraireSiteWeb(
    $
) {

    let siteWeb =
        null;


    $("a[href]").each(
        (_, element) => {

            if (siteWeb) {

                return;
            }


            const href =
                $(element).attr(
                    "href"
                );


            const url =
                urlAbsolue(
                    href
                );


            if (!url) {

                return;
            }


            if (
                estLienExclu(
                    url
                )
            ) {

                return;
            }


            siteWeb =
                url;
        }
    );


    return siteWeb;
}


/* =========================================================
   EXTRAIRE UNE URL ÉCRITE EN TEXTE
========================================================= */

function extraireUrlDansTexte(
    texte
) {

    if (!texte) {

        return null;
    }


    const match =
        texte.match(
            /https?:\/\/[^\s]+/i
        );


    if (!match) {

        return null;
    }


    const url =
        match[0]
            .replace(
                /[),.;]+$/,
                ""
            );


    if (
        estLienExclu(
            url
        )
    ) {

        return null;
    }


    return url;
}


/* =========================================================
   EXTRAIRE DESCRIPTION
========================================================= */

function extraireDescription(
    $
) {

    let description =
        null;


    /*
     * ImproWiki utilise une zone
     * "à propos de nous".
     */

    $("*").each(
        (_, element) => {

            if (description) {

                return;
            }


            const titre =
                nettoyerTexte(
                    $(element).text()
                );


            if (!titre) {

                return;
            }


            if (
                titre.toLowerCase() !==
                "à propos de nous"
            ) {

                return;
            }


            /*
             * On examine les éléments
             * qui suivent le titre.
             */

            let suivant =
                $(element).next();


            let morceaux = [];


            for (
                let i = 0;
                i < 15 &&
                suivant.length;
                i++
            ) {

                const texte =
                    nettoyerTexte(
                        suivant.text()
                    );


                if (texte) {

                    const minuscule =
                        texte.toLowerCase();


                    if (
                        minuscule ===
                            "joueurs" ||
                        minuscule.startsWith(
                            "joueurs "
                        ) ||
                        minuscule ===
                            "contact"
                    ) {

                        break;
                    }


                    const balise =
                        String(
                            suivant[0]?.name ||
                            ""
                        ).toLowerCase();


                    if (
                        ![
                            "h1",
                            "h2",
                            "h3",
                            "h4",
                            "h5",
                            "h6"
                        ].includes(
                            balise
                        )
                    ) {

                        morceaux.push(
                            texte
                        );
                    }
                }


                suivant =
                    suivant.next();
            }


            if (
                morceaux.length
            ) {

                description =
                    nettoyerTexte(
                        morceaux.join(
                            " "
                        )
                    );
            }
        }
    );


    /*
     * Deuxième méthode :
     * paragraphes suffisamment longs.
     */

    if (!description) {

        const paragraphes =
            [];


        $("p").each(
            (_, element) => {

                const texte =
                    nettoyerTexte(
                        $(element).text()
                    );


                if (
                    !texte ||
                    texte.length < 30 ||
                    texte.length > 5000
                ) {

                    return;
                }


                const minuscule =
                    texte.toLowerCase();


                if (
                    minuscule.includes(
                        "connexion"
                    ) ||
                    minuscule.includes(
                        "inscription"
                    ) ||
                    minuscule.includes(
                        "mentions légales"
                    ) ||
                    minuscule ===
                        "joueurs"
                ) {

                    return;
                }


                paragraphes.push(
                    texte
                );
            }
        );


        if (
            paragraphes.length
        ) {

            description =
                paragraphes
                    .slice(
                        0,
                        3
                    )
                    .join(
                        " "
                    );
        }
    }


    return limiterTexte(
        description,
        5000
    );
}


/* =========================================================
   EXTRAIRE ADRESSE
========================================================= */

function extraireAdresse(
    $
) {

    let adresse =
        null;


    const texte =
        nettoyerTexte(
            $("body").text()
        );


    if (!texte) {

        return null;
    }


    const match =
        texte.match(
            /Adresse\s+(.+?)(?=\s+(?:Code postal|Ville|Pays|Téléphone|Email|E-mail|Site|Contact)\b|$)/i
        );


    if (match) {

        adresse =
            nettoyerTexte(
                match[1]
            );
    }


    return limiterTexte(
        adresse,
        255
    );
}


/* =========================================================
   RÉCUPÉRER LES DONNÉES D'UNE FICHE
========================================================= */

async function recupererDonneesFiche(
    sourceUrl
) {

    try {

        const html =
            await recupererPage(
                sourceUrl
            );


        const $ =
            cheerio.load(
                html
            );


        let siteWeb =
            extraireSiteWeb(
                $
            );


        /*
         * Secours : chercher une URL directement
         * dans le texte de la page.
         */

        if (!siteWeb) {

            siteWeb =
                extraireUrlDansTexte(
                    $("body").text()
                );
        }


        const description =
            extraireDescription(
                $
            );


        const adresse =
            extraireAdresse(
                $
            );


        return {

            description,

            siteWeb,

            adresse
        };


    } catch (error) {

        console.log(
            `  → fiche inaccessible : ${error.message}`
        );


        return {

            description: null,

            siteWeb: null,

            adresse: null
        };
    }
}


/* =========================================================
   ENREGISTRER / METTRE À JOUR
========================================================= */

async function enregistrerTroupe(
    groupe
) {

    const nom =
        nettoyerTexte(
            groupe.name
        );


    const ville =
        nettoyerTexte(
            groupe.city
        );


    const latitude =
        groupe.lat !== null &&
        groupe.lat !== undefined
            ? Number(
                groupe.lat
            )
            : null;


    const longitude =
        groupe.lng !== null &&
        groupe.lng !== undefined
            ? Number(
                groupe.lng
            )
            : null;


    const sourceUrl =
        construireSourceUrl(
            groupe.slug
        );


    if (!nom) {

        return "ignoree";
    }


    /*
     * Récupération des informations
     * complémentaires de la fiche.
     */

    let donneesFiche = {

        description: null,

        siteWeb: null,

        adresse: null
    };


    if (sourceUrl) {

        donneesFiche =
            await recupererDonneesFiche(
                sourceUrl
            );
    }


    /*
     * RECHERCHE PAR SOURCE_URL
     */

    let existante =
        null;


    if (sourceUrl) {

        const resultat =
            await pool.query(
                `
                SELECT id
                FROM troupes
                WHERE source_url = $1::text
                LIMIT 1
                `,
                [
                    sourceUrl
                ]
            );


        if (
            resultat.rows.length
        ) {

            existante =
                resultat.rows[0];
        }
    }


    /*
     * MISE À JOUR
     */

    if (existante) {

        await pool.query(
            `
            UPDATE troupes

            SET
                nom =
                    $1::text,

                ville =
                    COALESCE(
                        $2::text,
                        ville
                    ),

                latitude =
                    COALESCE(
                        $3::numeric,
                        latitude
                    ),

                longitude =
                    COALESCE(
                        $4::numeric,
                        longitude
                    ),

                adresse =
                    COALESCE(
                        $5::text,
                        adresse
                    ),

                description =
                    COALESCE(
                        $6::text,
                        description
                    ),

                site_web =
                    COALESCE(
                        $7::text,
                        site_web
                    ),

                source =
                    $8::text,

                source_url =
                    $9::text,

                date_derniere_verification =
                    CURRENT_TIMESTAMP,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id =
                $10::integer
            `,
            [
                nom,
                ville,
                latitude,
                longitude,
                donneesFiche.adresse,
                donneesFiche.description,
                donneesFiche.siteWeb,
                SOURCE,
                sourceUrl,
                existante.id
            ]
        );


        return "mise_a_jour";
    }


    /*
     * RECHERCHE NOM + VILLE
     */

    const doublon =
        await pool.query(
            `
            SELECT id
            FROM troupes

            WHERE
                LOWER(nom) =
                    LOWER($1::text)

                AND ville
                    IS NOT DISTINCT FROM
                    $2::text

            LIMIT 1
            `,
            [
                nom,
                ville
            ]
        );


    if (
        doublon.rows.length
    ) {

        await pool.query(
            `
            UPDATE troupes

            SET
                latitude =
                    COALESCE(
                        latitude,
                        $1::numeric
                    ),

                longitude =
                    COALESCE(
                        longitude,
                        $2::numeric
                    ),

                adresse =
                    COALESCE(
                        adresse,
                        $3::text
                    ),

                description =
                    COALESCE(
                        description,
                        $4::text
                    ),

                site_web =
                    COALESCE(
                        site_web,
                        $5::text
                    ),

                source_url =
                    COALESCE(
                        source_url,
                        $6::text
                    ),

                date_derniere_verification =
                    CURRENT_TIMESTAMP,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id =
                $7::integer
            `,
            [
                latitude,
                longitude,
                donneesFiche.adresse,
                donneesFiche.description,
                donneesFiche.siteWeb,
                sourceUrl,
                doublon.rows[0].id
            ]
        );


        return "doublon";
    }


    /*
     * NOUVELLE TROUPE
     */

    await pool.query(
        `
        INSERT INTO troupes (

            nom,

            ville,

            adresse,

            description,

            latitude,

            longitude,

            site_web,

            source,

            source_url,

            date_derniere_verification,

            created_at,

            updated_at

        )

        VALUES (

            $1::text,

            $2::text,

            $3::text,

            $4::text,

            $5::numeric,

            $6::numeric,

            $7::text,

            $8::text,

            $9::text,

            CURRENT_TIMESTAMP,

            CURRENT_TIMESTAMP,

            CURRENT_TIMESTAMP
        )
        `,
        [
            nom,
            ville,
            donneesFiche.adresse,
            donneesFiche.description,
            latitude,
            longitude,
            donneesFiche.siteWeb,
            SOURCE,
            sourceUrl
        ]
    );


    return "ajoutee";
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


    let ajoutees = 0;

    let misesAJour = 0;

    let doublons = 0;

    let ignorees = 0;

    let erreurs = 0;


    try {

        /*
         * 1. LISTE IMPROWIKI
         */

        const html =
            await recupererListe();


        /*
         * 2. GROUPES
         */

        const groupes =
            extraireGroupes(
                html
            );


        console.log(
            `${groupes.length} groupes trouvés dans ImproWiki.`
        );

        console.log("");


        /*
         * 3. IMPORT
         */

        for (
            let i = 0;
            i < groupes.length;
            i++
        ) {

            const groupe =
                groupes[i];


            const nom =
                nettoyerTexte(
                    groupe.name
                );


            console.log(
                `[${i + 1}/${groupes.length}] ${nom}`
            );


            try {

                const resultat =
                    await enregistrerTroupe(
                        groupe
                    );


                if (
                    resultat ===
                    "ajoutee"
                ) {

                    ajoutees++;


                    console.log(
                        "  → AJOUTÉE"
                    );


                } else if (
                    resultat ===
                    "mise_a_jour"
                ) {

                    misesAJour++;


                    console.log(
                        "  → MISE À JOUR"
                    );


                } else if (
                    resultat ===
                    "doublon"
                ) {

                    doublons++;


                    console.log(
                        "  → DOUBLON ENRICHI"
                    );


                } else {

                    ignorees++;


                    console.log(
                        "  → IGNORÉE"
                    );
                }


            } catch (error) {

                erreurs++;


                console.error(
                    `  → ERREUR : ${error.message}`
                );
            }


            /*
             * Petite pause entre les fiches.
             */

            await attendre(
                300
            );
        }


        /*
         * 4. BILAN
         */

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
            `Groupes trouvés : ${groupes.length}`
        );

        console.log(
            `Nouvelles troupes : ${ajoutees}`
        );

        console.log(
            `Troupes mises à jour : ${misesAJour}`
        );

        console.log(
            `Doublons enrichis : ${doublons}`
        );

        console.log(
            `Troupes ignorées : ${ignorees}`
        );

        console.log(
            `Erreurs : ${erreurs}`
        );

        console.log(
            "=========================================="
        );

        console.log("");


    } catch (error) {

        console.error("");

        console.error(
            "ERREUR IMPORT :",
            error.message
        );

        console.error("");

    } finally {

        await pool.end();
    }
}


/* =========================================================
   LANCEMENT
========================================================= */

importerTroupes();