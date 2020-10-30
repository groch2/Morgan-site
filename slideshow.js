function openModal() {
    document.getElementById("slideshow").style.display = "grid";
    document.getElementById("miniaturesMosaic").style.display = "none";
}

function closeModal() {
    document.getElementById("slideshow").style.display = "none";
    document.getElementById("miniaturesMosaic").style.display = "initial";
}

const pictures = document.getElementsByClassName("picture");
const pictureLabels = document.getElementsByClassName("picture-label");
let slideIndex = 0;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    if (n === pictures.length) {
        slideIndex = 0;
    }
    if (n === -1) {
        slideIndex = pictures.length - 1;
    }
    for (let i = 0; i < pictures.length; i++) {
        [pictures, pictureLabels]
            .forEach(
                htmlElements =>
                    htmlElements[i].style.display = i === slideIndex ? "block" : "none");
    }
}

document.getElementById("openBtn").addEventListener("click", openModal);
document.getElementById("closeBtn").addEventListener("click", closeModal);

document.getElementById("plusBtn").addEventListener("click", function () { plusDivs(1); });
document.getElementById("minusBtn").addEventListener("click", function () { plusDivs(-1); });
