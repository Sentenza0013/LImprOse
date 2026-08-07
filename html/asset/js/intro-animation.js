const boutonIntro = document.querySelector("#intro-start");
const boutonClose = document.querySelector("#intro-close");
const videoIntro = document.querySelector("#intro-player");
const intro = document.querySelector("#intro-video");

let timerCroix;


// VÉRIFIER SI L'INTRO A DÉJÀ ÉTÉ VUE

if (localStorage.getItem("introVue") === "true") {
    intro.style.display = "none";
}


// LANCER LA VIDÉO

boutonIntro.addEventListener("click", function () {
    boutonIntro.style.display = "none";

    videoIntro.play();

    afficherCroix();
});


// FERMER L'INTRO

boutonClose.addEventListener("click", function () {
    videoIntro.pause();

    localStorage.setItem("introVue", "true");

    intro.style.display = "none";
});


// FIN DE LA VIDÉO

videoIntro.addEventListener("ended", function () {
    localStorage.setItem("introVue", "true");

    intro.style.display = "none";
});


// AFFICHER LA CROIX

function afficherCroix() {

    boutonClose.style.opacity = "1";

    clearTimeout(timerCroix);

    timerCroix = setTimeout(function () {
        boutonClose.style.opacity = "0";
    }, 3000);
}


// MOUVEMENT DE LA SOURIS

intro.addEventListener("mousemove", function () {
    afficherCroix();
});
const revoirIntro = document.querySelector("#revoir-intro");

revoirIntro.addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem("introVue");

    location.reload();
});