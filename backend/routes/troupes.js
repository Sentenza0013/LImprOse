const express = require("express");
const router = express.Router();

const pool = require("../db/database");


/* =========================================================
   RÉCUPÉRER TOUTES LES TROUPES
   ========================================================= */

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                nom,
                ville,
                code_postal,
                departement,
                adresse,
                description,
                image,
                latitude,
                longitude,
                site_web,
                source,
                source_url,
                date_derniere_verification
            FROM troupes
            ORDER BY nom ASC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(
            "Erreur lors de la récupération des troupes :",
            error.message
        );

        res.status(500).json({
            message: "Impossible de récupérer les troupes"
        });
    }
});


/* =========================================================
   RÉCUPÉRER UNE TROUPE PAR SON ID
   ========================================================= */

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT
                id,
                nom,
                ville,
                code_postal,
                departement,
                adresse,
                description,
                image,
                latitude,
                longitude,
                site_web,
                source,
                source_url,
                date_derniere_verification
            FROM troupes
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Troupe introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(
            "Erreur lors de la récupération de la troupe :",
            error.message
        );

        res.status(500).json({
            message: "Impossible de récupérer la troupe"
        });
    }
});


/* =========================================================
   AJOUTER UNE TROUPE
   ========================================================= */

router.post("/", async (req, res) => {
    const {
        nom,
        ville,
        code_postal,
        departement,
        adresse,
        description,
        image,
        latitude,
        longitude,
        site_web,
        source,
        source_url
    } = req.body;

    if (!nom || !ville) {
        return res.status(400).json({
            message: "Le nom et la ville sont obligatoires"
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO troupes (
                nom,
                ville,
                code_postal,
                departement,
                adresse,
                description,
                image,
                latitude,
                longitude,
                site_web,
                source,
                source_url
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING *
            `,
            [
                nom,
                ville,
                code_postal || null,
                departement || null,
                adresse || null,
                description || null,
                image || null,
                latitude || null,
                longitude || null,
                site_web || null,
                source || null,
                source_url || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(
            "Erreur lors de l'ajout de la troupe :",
            error.message
        );

        res.status(500).json({
            message: "Impossible d'ajouter la troupe"
        });
    }
});


/* =========================================================
   MODIFIER UNE TROUPE
   ========================================================= */

router.put("/:id", async (req, res) => {
    const { id } = req.params;

    const {
        nom,
        ville,
        code_postal,
        departement,
        adresse,
        description,
        image,
        latitude,
        longitude,
        site_web,
        source,
        source_url
    } = req.body;

    if (!nom || !ville) {
        return res.status(400).json({
            message: "Le nom et la ville sont obligatoires"
        });
    }

    try {
        const result = await pool.query(
            `
            UPDATE troupes
            SET
                nom = $1,
                ville = $2,
                code_postal = $3,
                departement = $4,
                adresse = $5,
                description = $6,
                image = $7,
                latitude = $8,
                longitude = $9,
                site_web = $10,
                source = $11,
                source_url = $12,
                date_derniere_verification = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING *
            `,
            [
                nom,
                ville,
                code_postal || null,
                departement || null,
                adresse || null,
                description || null,
                image || null,
                latitude || null,
                longitude || null,
                site_web || null,
                source || null,
                source_url || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Troupe introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(
            "Erreur lors de la modification de la troupe :",
            error.message
        );

        res.status(500).json({
            message: "Impossible de modifier la troupe"
        });
    }
});


/* =========================================================
   SUPPRIMER UNE TROUPE
   ========================================================= */

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            DELETE FROM troupes
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Troupe introuvable"
            });
        }

        res.json({
            message: "Troupe supprimée",
            id: result.rows[0].id
        });

    } catch (error) {
        console.error(
            "Erreur lors de la suppression de la troupe :",
            error.message
        );

        res.status(500).json({
            message: "Impossible de supprimer la troupe"
        });
    }
});


module.exports = router;