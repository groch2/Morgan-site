import Swiper from "swiper";

new Swiper(".swiper-container", {
  loop: true,
  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
});

document
  .querySelector(".swiper-button-prev")
  .addEventListener(
    "click",
    () =>
      document
        .querySelector(".swiper-container")
        .swiper.slidePrev());

document
  .querySelector(".swiper-button-next")
  .addEventListener(
    "click",
    () =>
      document
        .querySelector(".swiper-container")
        .swiper.slideNext());

document
  .getElementById("closeBtn")
  .addEventListener(
    "click",
    () => window.location.href = "./index.html");
