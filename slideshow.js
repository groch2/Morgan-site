import Swiper from "swiper";

function openModal() {
  document.getElementById("slideshow").style.display = "grid";
  document.getElementById("miniaturesMosaic").style.display = "none";
  new Swiper(".swiper-container", {
    loop: true,
    on: {
      beforeDestroy: function () {
        console.debug("destroying...");
      },
    },
  });
}

function closeModal() {
  document.getElementById("slideshow").style.display = "none";
  document.getElementById("miniaturesMosaic").style.display = "initial";
}

document.getElementById("openBtn").addEventListener("click", openModal);
document.getElementById("closeBtn").addEventListener("click", closeModal);

document
  .querySelector(".swiper-button-prev")
  .addEventListener("click", function () {
    document.querySelector(".swiper-container").swiper.slidePrev();
  });
document
  .querySelector(".swiper-button-next")
  .addEventListener("click", function () {
    document.querySelector(".swiper-container").swiper.slideNext();
  });
