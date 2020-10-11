function openModal() {
    document.getElementById("slideshow").style.display = "flex";
    document.getElementById("miniaturesMosaic").style.display = "none";
}

function closeModal() {
    document.getElementById("slideshow").style.display = "none";
    document.getElementById("miniaturesMosaic").style.display = "initial";
}

const slides = document.getElementsByClassName("slide");
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "flex";
}

document.getElementById("openBtn").addEventListener("click", openModal);
document.getElementById("closeBtn").addEventListener("click", closeModal);

document.getElementById("plusBtn").addEventListener("click", function () { plusDivs(+1); });
document.getElementById("minusBtn").addEventListener("click", function () { plusDivs(-1); });
