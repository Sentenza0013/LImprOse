/* =========================================================
   L'IMPROSE — PAGE CATÉGORIES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const retourHaut = document.querySelector(".retour-haut");

    if (!retourHaut) {
        return;
    }

    retourHaut.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});