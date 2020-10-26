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
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    if (n > pictures.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = pictures.length;
    }
    for (var i = 0; i < pictures.length; i++) {
        pictures[i].style.display = "none";
        pictureLabels[i].style.display = "none";
    }
    pictures[slideIndex - 1].style.display = "block";
    pictureLabels[slideIndex - 1].style.display = "block";
}

document.getElementById("openBtn").addEventListener("click", openModal);
document.getElementById("closeBtn").addEventListener("click", closeModal);

document.getElementById("plusBtn").addEventListener("click", function () { plusDivs(+1); });
document.getElementById("minusBtn").addEventListener("click", function () { plusDivs(-1); });
