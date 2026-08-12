document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainMenu = document.querySelector(".main-menu");

    if (menuToggle && mainMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            mainMenu.classList.toggle("is-open");
        });
    }


    /* =====================================================
       MENU OUTILS
    ===================================================== */

    const dropdownButton =
        document.querySelector(".dropdown-button");

    const dropdown =
        document.querySelector(".menu-dropdown");

    if (dropdownButton && dropdown) {

        dropdownButton.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                dropdownButton.getAttribute("aria-expanded") === "true";

            dropdownButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            dropdown.classList.toggle("is-open");
        });
    }


    /* =====================================================
       FERMER LE MENU OUTILS EN CLIQUANT AILLEURS
    ===================================================== */

    document.addEventListener("click", (event) => {

        if (!dropdown || !dropdownButton) {
            return;
        }

        if (!dropdown.contains(event.target)) {

            dropdown.classList.remove("is-open");

            dropdownButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });


    /* =====================================================
       FERMER LE MENU MOBILE APRÈS UN CLIC
    ===================================================== */

    if (mainMenu && menuToggle) {

        const menuLinks =
            mainMenu.querySelectorAll("a");

        menuLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mainMenu.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }


    /* =====================================================
       RETOUR EN HAUT
    ===================================================== */

    const backToTop =
        document.querySelector(".back-to-top");

    if (backToTop) {

        backToTop.addEventListener("click", (event) => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});