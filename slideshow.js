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

document.getElementById("closeBtn").addEventListener("click", function () { window.location.href = "./index.html"; });

document.getElementById("plusBtn").addEventListener("click", function () { plusDivs(1); });
document.getElementById("minusBtn").addEventListener("click", function () { plusDivs(-1); });
