"use strict";

require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../db/database");


/* =========================================================
   CONFIGURATION
========================================================= */

const BASE_URL =
    "https://annuaire.improvisation-theatrale.fr";

const INDEX_URL =
    `${BASE_URL}/le-theatre-d-impro-en-france-par-region/`;

const SOURCE =
    "Annuaire Improvisation Théâtrale";

const USER_AGENT =
    "L-ImprOse/1.0";


/* =========================================================
   RÉCUPÉRER UNE PAGE
========================================================= */

async function recupererPage(url) {

    const response =
        await axios.get(
            url,
            {
                headers: {
                    "User-Agent":
                        USER_AGENT
                },

                timeout: 20000
            }
        );

    return response.data;
}


/* =========================================================
   NETTOYER UN TEXTE
========================================================= */

function nettoyerTexte(texte) {

    if (!texte) {
        return null;
    }

    const resultat =
        String(texte)
            .replace(/\s+/g, " ")
            .trim();

    return resultat || null;
}


/* =========================================================
   LIMITER UN TEXTE
========================================================= */

function limiterTexte(
    texte,
    longueur
) {

    const valeur =
        nettoyerTexte(
            texte
        );

    if (!valeur) {
        return null;
    }

    return valeur.substring(
        0,
        longueur
    );
}


/* =========================================================
   URL ABSOLUE
========================================================= */

function urlAbsolue(href) {

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
   VÉRIFIER SI C'EST UNE FICHE
========================================================= */

function estFiche(url) {

    return /-s\d+\.html$/i.test(
        url
    );
}


/* =========================================================
   VÉRIFIER SI LE LIEN APPARTIENT À L'ANNUAIRE
========================================================= */

function estLienAnnuaire(url) {

    if (!url) {
        return false;
    }

    return url.startsWith(
        BASE_URL + "/"
    );
}


/* =========================================================
   EXTRAIRE LES LIENS
========================================================= */

function extraireLiens(html) {

    const $ =
        cheerio.load(
            html
        );

    const liens =
        new Set();


    $("a[href]").each(
        (_, element) => {

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
                !estLienAnnuaire(
                    url
                )
            ) {
                return;
            }


            if (
                !url.includes(
                    "/le-theatre-d-impro-en-france-par-region/"
                )
            ) {
                return;
            }


            liens.add(
                url
            );
        }
    );


    return [
        ...liens
    ];
}


/* =========================================================
   DÉTECTER UNE STRUCTURE D'IMPRO
========================================================= */

function estStructureImprovisation(
    texte
) {

    if (!texte) {
        return false;
    }

    const contenu =
        texte.toLowerCase();


    const motsCles = [

        "improvisation",

        "théâtre d'impro",

        "théâtre improvisé",

        "match d'impro",

        "spectacle d'impro",

        "ligue d'impro",

        "compagnie d'impro"

    ];


    return motsCles.some(
        mot =>
            contenu.includes(
                mot
            )
    );
}


/* =========================================================
   RÉCUPÉRER UNE VALEUR APRÈS UN LABEL
========================================================= */

function recupererApresLabel(
    $,
    label
) {

    let valeur = null;


    $("body *").each(
        (_, element) => {

            if (valeur) {
                return;
            }


            const texte =
                nettoyerTexte(
                    $(element).text()
                );


            if (!texte) {
                return;
            }


            if (
                texte.toLowerCase() !==
                label.toLowerCase()
            ) {
                return;
            }


            /*
             * Élément suivant.
             */

            const suivant =
                nettoyerTexte(
                    $(element)
                        .next()
                        .text()
                );


            if (
                suivant &&
                suivant.length <= 255 &&
                suivant.toLowerCase() !==
                    label.toLowerCase()
            ) {

                valeur =
                    suivant;

                return;
            }


            /*
             * Parent.
             */

            const parent =
                $(element)
                    .parent();


            const texteParent =
                nettoyerTexte(
                    parent.text()
                );


            if (
                texteParent &&
                texteParent.length >
                    texte.length &&
                texteParent.length <= 255
            ) {

                const reste =
                    nettoyerTexte(
                        texteParent.replace(
                            new RegExp(
                                `^${label}\\s*`,
                                "i"
                            ),
                            ""
                        )
                    );


                if (reste) {

                    valeur =
                        reste;
                }
            }
        }
    );


    return valeur;
}


/* =========================================================
   LIENS À EXCLURE
========================================================= */

function estLienExclu(
    url
) {

    if (!url) {
        return true;
    }


    const minuscule =
        url.toLowerCase();


    if (
        minuscule.startsWith(
            "mailto:"
        )
    ) {
        return true;
    }


    if (
        minuscule.startsWith(
            "javascript:"
        )
    ) {
        return true;
    }


    const domainesExclus = [

        "facebook.com",

        "instagram.com",

        "twitter.com",

        "x.com",

        "youtube.com",

        "linkedin.com",

        "tiktok.com",

        "arfooo.com"

    ];


    return domainesExclus.some(
        domaine =>
            minuscule.includes(
                domaine
            )
    );
}


/* =========================================================
   EXTRAIRE SITE + DESCRIPTION
========================================================= */

function recupererSiteEtDescription(
    $
) {

    let siteWeb = null;

    let description = null;


    /* -----------------------------------------------------
       1. RECHERCHE DU SITE OFFICIEL
    ----------------------------------------------------- */

    $("a[href]").each(
        (_, element) => {

            if (siteWeb) {
                return;
            }


            const href =
                $(element).attr(
                    "href"
                );


            if (!href) {
                return;
            }


            if (
                estLienExclu(
                    href
                )
            ) {
                return;
            }


            const url =
                urlAbsolue(
                    href
                );


            if (!url) {
                return;
            }


            if (
                estLienAnnuaire(
                    url
                )
            ) {
                return;
            }


            const texteLien =
                nettoyerTexte(
                    $(element).text()
                ) || "";


            const texteParent =
                nettoyerTexte(
                    $(element)
                        .parent()
                        .text()
                ) || "";


            const contexte =
                `${texteLien} ${texteParent}`
                    .toLowerCase();


            if (
                contexte.includes(
                    "lien du site"
                ) ||
                contexte.includes(
                    "site officiel"
                ) ||
                contexte.includes(
                    "site web"
                ) ||
                contexte.includes(
                    "site internet"
                )
            ) {

                siteWeb =
                    url;
            }
        }
    );


    /* -----------------------------------------------------
       2. SECOURS : PREMIER LIEN EXTERNE
    ----------------------------------------------------- */

    if (!siteWeb) {

        $("a[href]").each(
            (_, element) => {

                if (siteWeb) {
                    return;
                }


                const href =
                    $(element).attr(
                        "href"
                    );


                if (!href) {
                    return;
                }


                const url =
                    urlAbsolue(
                        href
                    );


                if (!url) {
                    return;
                }


                if (
                    estLienAnnuaire(
                        url
                    )
                ) {
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
    }


    /* -----------------------------------------------------
       3. DESCRIPTION
    -----------------------------------------------------

       Structure constatée sur l'annuaire :

       Lien du site :
       https://site-officiel.fr/

       DESCRIPTION

       Les mots clés thématiques associés...

       Le texte de description n'est pas forcément
       contenu dans un <p>. On utilise donc le texte
       global de la page autour du repère "Lien du site".
    ----------------------------------------------------- */

    const textePage =
        nettoyerTexte(
            $("body").text()
        );


    if (textePage) {

        const positionLien =
            textePage.search(
                /Lien du site\s*:?\s*/i
            );


        if (
            positionLien !== -1
        ) {

            const apresLien =
                textePage.substring(
                    positionLien
                );


            /*
             * On enlève :
             *
             * Lien du site :
             * URL
             */

            const sansLabel =
                apresLien.replace(
                    /^Lien du site\s*:?\s*/i,
                    ""
                );


            /*
             * On enlève l'URL du site.
             */

            const sansUrl =
                sansLabel.replace(
                    /^https?:\/\/\S+\s*/i,
                    ""
                );


            /*
             * La description s'arrête
             * avant les mots-clés / informations
             * qui suivent.
             */

            const correspondance =
                sansUrl.match(
                    /^(.+?)(?=\s+(?:Les mots clés|Les mots cles|Mots clés|Mots cles|Informations sur|Avis internautes|Adresse|Code postal|Ville|Pays)\b|$)/i
                );


            if (
                correspondance
            ) {

                const texte =
                    nettoyerTexte(
                        correspondance[1]
                    );


                if (
                    texte &&
                    texte.length >= 20 &&
                    texte.length <= 5000
                ) {

                    description =
                        texte;
                }
            }
        }
    }


    /* -----------------------------------------------------
       4. SECOURS : PARAGRAPHES
    ----------------------------------------------------- */

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
                        "les mots clés"
                    ) ||
                    minuscule.includes(
                        "les mots cles"
                    ) ||
                    minuscule.includes(
                        "avis internautes"
                    ) ||
                    minuscule ===
                        "adresse" ||
                    minuscule ===
                        "code postal" ||
                    minuscule ===
                        "ville" ||
                    minuscule ===
                        "pays"
                ) {
                    return;
                }


                paragraphes.push(
                    texte
                );
            }
        );


        if (
            paragraphes.length > 0
        ) {

            description =
                paragraphes
                    .slice(0, 3)
                    .join(" ");
        }
    }


    return {

        siteWeb,

        description:
            limiterTexte(
                description,
                5000
            )
    };
}


/* =========================================================
   EXTRAIRE UNE FICHE
========================================================= */

function extraireFiche(
    html,
    url
) {

    const $ =
        cheerio.load(
            html
        );


    /* -----------------------------------------------------
       NOM
    ----------------------------------------------------- */

    const nom =
        limiterTexte(
            $("h1")
                .first()
                .text(),
            255
        );


    if (!nom) {
        return null;
    }


    /* -----------------------------------------------------
       VÉRIFICATION IMPRO
    ----------------------------------------------------- */

    const textePage =
        nettoyerTexte(
            $("body").text()
        );


    if (
        !estStructureImprovisation(
            textePage
        )
    ) {
        return null;
    }


    /* -----------------------------------------------------
       SITE + DESCRIPTION
    ----------------------------------------------------- */

    const donneesSite =
        recupererSiteEtDescription(
            $
        );


    /* -----------------------------------------------------
       ADRESSE
    ----------------------------------------------------- */

    let adresse =
        recupererApresLabel(
            $,
            "Adresse"
        );


    let codePostal =
        recupererApresLabel(
            $,
            "Code postal"
        );


    let ville =
        recupererApresLabel(
            $,
            "Ville"
        );


    /* -----------------------------------------------------
       SECOURS CODE POSTAL
    ----------------------------------------------------- */

    if (!codePostal) {

        const matchCodePostal =
            textePage.match(
                /Code postal\s+(\d{5})/i
            );


        if (matchCodePostal) {

            codePostal =
                matchCodePostal[1];
        }
    }


    /* -----------------------------------------------------
       SECOURS VILLE
    ----------------------------------------------------- */

    if (!ville) {

        const matchVille =
            textePage.match(
                /Ville\s+(.{1,100}?)(?=\s+(?:Pays|Adresse|Code postal|Téléphone|Tél\.?|Email|E-mail|Lien du site|Site web|Site officiel)\b|$)/i
            );


        if (matchVille) {

            ville =
                nettoyerTexte(
                    matchVille[1]
                );
        }
    }


    /* -----------------------------------------------------
       POSTGRESQL : VILLE NOT NULL
    ----------------------------------------------------- */

    if (!ville) {

        ville =
            "Non renseignée";
    }


    /* -----------------------------------------------------
       LIMITES SQL
    ----------------------------------------------------- */

    ville =
        limiterTexte(
            ville,
            100
        );


    codePostal =
        limiterTexte(
            codePostal,
            20
        );


    adresse =
        limiterTexte(
            adresse,
            255
        );


    return {

        nom,

        ville,

        code_postal:
            codePostal,

        adresse,

        description:
            donneesSite.description,

        site_web:
            donneesSite.siteWeb,

        source:
            SOURCE,

        source_url:
            url
    };
}


/* =========================================================
   ENREGISTRER LA TROUPE
========================================================= */

async function enregistrerTroupe(
    troupe
) {

    /* -----------------------------------------------------
       1. RECHERCHE PAR URL SOURCE
    ----------------------------------------------------- */

    const parSource =
        await pool.query(
            `
            SELECT id
            FROM troupes
            WHERE source_url = $1::text
            LIMIT 1
            `,
            [
                troupe.source_url
            ]
        );


    if (
        parSource.rows.length > 0
    ) {

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

                code_postal =
                    COALESCE(
                        $3::text,
                        code_postal
                    ),

                adresse =
                    COALESCE(
                        $4::text,
                        adresse
                    ),

                description =
                    COALESCE(
                        $5::text,
                        description
                    ),

                site_web =
                    COALESCE(
                        $6::text,
                        site_web
                    ),

                source =
                    $7::text,

                date_derniere_verification =
                    CURRENT_TIMESTAMP,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id =
                $8::integer
            `,
            [
                troupe.nom,
                troupe.ville,
                troupe.code_postal,
                troupe.adresse,
                troupe.description,
                troupe.site_web,
                troupe.source,
                parSource.rows[0].id
            ]
        );


        return "mise_a_jour";
    }


    /* -----------------------------------------------------
       2. RECHERCHE NOM + VILLE
    ----------------------------------------------------- */

    const existante =
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
                troupe.nom,
                troupe.ville
            ]
        );


    if (
        existante.rows.length > 0
    ) {

        await pool.query(
            `
            UPDATE troupes

            SET
                code_postal =
                    COALESCE(
                        code_postal,
                        $1::text
                    ),

                adresse =
                    COALESCE(
                        adresse,
                        $2::text
                    ),

                description =
                    COALESCE(
                        description,
                        $3::text
                    ),

                site_web =
                    COALESCE(
                        $4::text,
                        site_web
                    ),

                source_url =
                    COALESCE(
                        source_url,
                        $5::text
                    ),

                date_derniere_verification =
                    CURRENT_TIMESTAMP,

                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id =
                $6::integer
            `,
            [
                troupe.code_postal,
                troupe.adresse,
                troupe.description,
                troupe.site_web,
                troupe.source_url,
                existante.rows[0].id
            ]
        );


        return "doublon_enrichi";
    }


    /* -----------------------------------------------------
       3. NOUVELLE TROUPE
    ----------------------------------------------------- */

    await pool.query(
        `
        INSERT INTO troupes (

            nom,

            ville,

            code_postal,

            adresse,

            description,

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

            $5::text,

            $6::text,

            $7::text,

            $8::text,

            CURRENT_TIMESTAMP,

            CURRENT_TIMESTAMP,

            CURRENT_TIMESTAMP
        )
        `,
        [
            troupe.nom,
            troupe.ville,
            troupe.code_postal,
            troupe.adresse,
            troupe.description,
            troupe.site_web,
            troupe.source,
            troupe.source_url
        ]
    );


    return "ajoutee";
}


/* =========================================================
   IMPORT PRINCIPAL
========================================================= */

async function importer() {

    console.log("");

    console.log(
        "=========================================="
    );

    console.log(
        "     IMPORT ANNUAIRE IMPROVISATION"
    );

    console.log(
        "=========================================="
    );

    console.log("");


    const pagesVisitees =
        new Set();


    const fiches =
        new Set();


    const aVisiter =
        [
            INDEX_URL
        ];


    /* -----------------------------------------------------
       DÉCOUVERTE
    ----------------------------------------------------- */

    console.log(
        "Découverte des pages de l'annuaire..."
    );


    while (
        aVisiter.length > 0
    ) {

        const url =
            aVisiter.shift();


        if (
            pagesVisitees.has(
                url
            )
        ) {
            continue;
        }


        pagesVisitees.add(
            url
        );


        console.log(
            `Analyse : ${url}`
        );


        try {

            const html =
                await recupererPage(
                    url
                );


            const liens =
                extraireLiens(
                    html
                );


            for (
                const lien of liens
            ) {

                if (
                    estFiche(
                        lien
                    )
                ) {

                    fiches.add(
                        lien
                    );

                } else if (
                    !pagesVisitees.has(
                        lien
                    )
                ) {

                    aVisiter.push(
                        lien
                    );
                }
            }


        } catch (error) {

            console.error(
                `Erreur : ${error.message}`
            );
        }


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    200
                )
        );
    }


    console.log("");

    console.log(
        "=========================================="
    );

    console.log(
        `Pages parcourues : ${pagesVisitees.size}`
    );

    console.log(
        `Fiches trouvées : ${fiches.size}`
    );

    console.log(
        "=========================================="
    );

    console.log("");


    /* -----------------------------------------------------
       IMPORT DES FICHES
    ----------------------------------------------------- */

    let ajoutees = 0;

    let misesAJour = 0;

    let doublons = 0;

    let ignorees = 0;

    let erreurs = 0;

    let compteur = 0;


    for (
        const ficheUrl of fiches
    ) {

        compteur++;


        console.log(
            `[${compteur}/${fiches.size}] ${ficheUrl}`
        );


        try {

            let html;


            try {

                html =
                    await recupererPage(
                        ficheUrl
                    );

            } catch (error) {

                if (
                    error.code ===
                        "ECONNABORTED" ||

                    error.code ===
                        "ETIMEDOUT" ||

                    error.message
                        .toLowerCase()
                        .includes(
                            "timeout"
                        )
                ) {

                    ignorees++;


                    console.log(
                        "  → FICHE IGNORÉE : timeout"
                    );


                    continue;
                }


                throw error;
            }


            const troupe =
                extraireFiche(
                    html,
                    ficheUrl
                );


            if (!troupe) {

                ignorees++;


                console.log(
                    "  → ignorée"
                );


                continue;
            }


            const resultat =
                await enregistrerTroupe(
                    troupe
                );


            if (
                resultat ===
                "ajoutee"
            ) {

                ajoutees++;


                console.log(
                    `  → AJOUTÉE : ${troupe.nom}`
                );

            } else if (
                resultat ===
                "mise_a_jour"
            ) {

                misesAJour++;


                console.log(
                    `  → MISE À JOUR : ${troupe.nom}`
                );

            } else {

                doublons++;


                console.log(
                    `  → DOUBLON ENRICHI : ${troupe.nom}`
                );
            }


        } catch (error) {

            erreurs++;


            console.error(
                `  → ERREUR : ${error.message}`
            );
        }


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    250
                )
        );
    }


    /* -----------------------------------------------------
       RÉSUMÉ
    ----------------------------------------------------- */

    console.log("");

    console.log(
        "=========================================="
    );

    console.log(
        "          IMPORT TERMINÉ"
    );

    console.log(
        "=========================================="
    );

    console.log(
        `Pages parcourues : ${pagesVisitees.size}`
    );

    console.log(
        `Fiches trouvées : ${fiches.size}`
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
        `Fiches ignorées : ${ignorees}`
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

importer()

    .catch(
        error => {

            console.error(
                "ERREUR FATALE :",
                error
            );
        }
    )

    .finally(
        async () => {

            await pool.end();
        }
    );