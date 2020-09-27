const sildes = document.getElementsByClassName("mySlides");
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    if (n > sildes.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = sildes.length;
    }
    for (var i = 0; i < sildes.length; i++) {
        sildes[i].style.display = "none";
    }
    sildes[slideIndex - 1].style.display = "block";
}
