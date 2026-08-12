/* =========================================================
   L'IMPROSE — EXERCICES.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       RETOUR EN HAUT
    ====================================================== */

    const retourHaut = document.querySelector(".retour-haut");


    if (!retourHaut) {
        return;
    }


    function afficherRetourHaut() {

        if (window.scrollY > 400) {

            retourHaut.classList.add("visible");

        } else {

            retourHaut.classList.remove("visible");

        }

    }


    window.addEventListener(
        "scroll",
        afficherRetourHaut
    );


    retourHaut.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    afficherRetourHaut();

});