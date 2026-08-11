let themes = [];

const excelFile = document.querySelector("#excelFile");
const generateButton = document.querySelector("#generateTheme");
const themeDisplay = document.querySelector("#theme");


/* ================================
   CHARGEMENT DU FICHIER EXCEL
================================ */

excelFile.addEventListener("change", function () {

    const fichier = this.files[0];

    if (!fichier) {
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function (event) {

        const donnees = new Uint8Array(event.target.result);

        const classeur = XLSX.read(donnees, {
            type: "array"
        });

        const nomFeuille = classeur.SheetNames[0];

        const feuille = classeur.Sheets[nomFeuille];

        const lignes = XLSX.utils.sheet_to_json(feuille, {
            header: 1
        });

        /*
         * On récupère la première colonne.
         * La première ligne correspond au titre de la colonne,
         * donc on la retire avec slice(1).
         */

        themes = lignes
            .slice(1)
            .map(ligne => ligne[0])
            .filter(theme => theme !== undefined && theme !== "");

        themeDisplay.textContent =
            themes.length + " thèmes chargés.";

        console.log("Thèmes chargés :", themes);
    };

    lecteur.readAsArrayBuffer(fichier);
});


/* ================================
   GÉNÉRER UN THÈME
================================ */

generateButton.addEventListener("click", function () {

    if (themes.length === 0) {

        themeDisplay.textContent =
            "Veuillez d'abord sélectionner votre fichier Excel.";

        return;
    }

    const index = Math.floor(
        Math.random() * themes.length
    );

    const theme = themes[index];

    themeDisplay.textContent = theme;
});