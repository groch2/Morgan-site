import Swiper from "swiper";

const swiper = new Swiper(".swiper-container", { loop: true });

document
  .querySelector(".swiper-button-prev")
  .addEventListener("click", () => swiper.slidePrev());

document
  .querySelector(".swiper-button-next")
  .addEventListener("click", () => swiper.slideNext());

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowRight":
      swiper.slideNext();
      return;
    case "ArrowLeft":
      swiper.slidePrev();
      return;
  }
});

document
  .getElementById("closeBtn")
  .addEventListener("click", () => (window.location.href = "./index.html"));
