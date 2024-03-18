const navBar = document.querySelector("nav"),
menuBtns = document.querySelectorAll(".menu-icon");
overlay = document.querySelector(".overlay");
bodyFeature = document.getElementById("features");
menuLogo = document.querySelector(".logo");

menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
        navBar.classList.toggle("open");
        bodyFeature.style.display = "none"

    });
});

overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
    bodyFeature.style.display = "block"

});

// SUBMIT FORM
let submitButton = document.querySelector("button");
submitButton.addEventListener("click", (event) => {
    document.querySelector("form").submit();
});

// COPY LINK
const copyUrl = () => {
    const copyTextarea = document.getElementById("short-url").href;
    navigator.clipboard.writeText(copyTextarea);
    document.getElementById("copy-action").innerHTML = "Copied";
};

setTimeout(() => {
let qelem = document.querySelector(".imagetag");
let dlink = document.querySelector('#qrdl');
let qr = qelem.getAttribute('src');
dlink.setAttribute('href', qr);
dlink.setAttribute('download', 'qr-code');
dlink.removeAttribute('hidden');
}, 500);

