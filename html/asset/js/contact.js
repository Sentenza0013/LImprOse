/* =========================================================
   L'IMPROSE — PAGE CONTACT
   JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const themeToggle = document.getElementById("themeToggle");
    const formStatus = document.getElementById("formStatus");


    /* =====================================================
       MODE SOMBRE
    ===================================================== */

    if (themeToggle) {

        const savedTheme = localStorage.getItem("limprose-theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");

            themeToggle.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

            themeToggle.setAttribute(
                "aria-label",
                "Activer le mode clair"
            );
        }


        themeToggle.addEventListener("click", () => {

            const darkMode =
                document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "limprose-theme",
                darkMode ? "dark" : "light"
            );

            themeToggle.innerHTML = darkMode
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';

            themeToggle.setAttribute(
                "aria-label",
                darkMode
                    ? "Activer le mode clair"
                    : "Activer le mode sombre"
            );

        });

    }


    /* =====================================================
       FORMULAIRE
    ===================================================== */

    if (!form) {
        return;
    }


    const fields = {

        nom: {
            input: document.getElementById("nom"),
            error: document.getElementById("nomError")
        },

        email: {
            input: document.getElementById("email"),
            error: document.getElementById("emailError")
        },

        sujet: {
            input: document.getElementById("sujet"),
            error: document.getElementById("sujetError")
        },

        message: {
            input: document.getElementById("message"),
            error: document.getElementById("messageError")
        }

    };


    /* =====================================================
       AFFICHER UNE ERREUR
    ===================================================== */

    function afficherErreur(field, message) {

        if (!field.input || !field.error) {
            return;
        }

        field.input.classList.add("input-error");
        field.error.textContent = message;

    }


    /* =====================================================
       SUPPRIMER UNE ERREUR
    ===================================================== */

    function supprimerErreur(field) {

        if (!field.input || !field.error) {
            return;
        }

        field.input.classList.remove("input-error");
        field.error.textContent = "";

    }


    /* =====================================================
       VALIDATION EMAIL
    ===================================================== */

    function validerEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* =====================================================
       VALIDATION DU FORMULAIRE
    ===================================================== */

    function validerFormulaire() {

        let valide = true;

        Object.values(fields).forEach(supprimerErreur);

        formStatus.textContent = "";
        formStatus.className = "form-status";


        /* NOM */

        const nom = fields.nom.input.value.trim();

        if (nom.length < 2) {

            afficherErreur(
                fields.nom,
                "Veuillez renseigner votre nom."
            );

            valide = false;
        }


        /* EMAIL */

        const email =
            fields.email.input.value.trim();

        if (!validerEmail(email)) {

            afficherErreur(
                fields.email,
                "Veuillez renseigner une adresse email valide."
            );

            valide = false;
        }


        /* SUJET */

        if (!fields.sujet.input.value) {

            afficherErreur(
                fields.sujet,
                "Veuillez sélectionner un sujet."
            );

            valide = false;
        }


        /* MESSAGE */

        const message =
            fields.message.input.value.trim();

        if (message.length < 10) {

            afficherErreur(
                fields.message,
                "Votre message doit contenir au moins 10 caractères."
            );

            valide = false;
        }


        return valide;

    }


    /* =====================================================
       SUPPRESSION DES ERREURS EN TEMPS RÉEL
    ===================================================== */

    Object.values(fields).forEach(field => {

        if (!field.input) {
            return;
        }

        field.input.addEventListener("input", () => {

            supprimerErreur(field);

        });


        field.input.addEventListener("change", () => {

            supprimerErreur(field);

        });

    });


    /* =====================================================
       ENVOI DU FORMULAIRE
    ===================================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();


        if (!validerFormulaire()) {

            formStatus.textContent =
                "Veuillez vérifier les informations indiquées.";

            formStatus.classList.add("error");

            return;
        }


        /*
         * Pour le moment, aucun système d'envoi
         * n'est connecté au formulaire.
         *
         * On affiche donc simplement un message
         * de confirmation côté interface.
         */

        formStatus.textContent =
            "Message prêt à être envoyé.";

        formStatus.classList.add("success");


        /*
         * On ne vide volontairement pas le formulaire
         * tant que le véritable système d'envoi
         * n'est pas connecté.
         */

    });

});