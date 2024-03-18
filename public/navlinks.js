const navBar = document.querySelector("nav"),
menuBtns = document.querySelectorAll(".menu-icon");
overlay = document.querySelector(".overlay");
mainView = document.querySelector(".card");
menuLogo = document.querySelector(".logo");

menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
        navBar.classList.toggle("open");
        mainView.style.display = "none"

    });
});

overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
    mainView.style.display = "block"

});
