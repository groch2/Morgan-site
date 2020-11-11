import Swiper from "swiper";

const swiper = new Swiper("#swiper-container", {
  loop: true,
});

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

const mosaic = document.getElementById("mosaic");

document.getElementById("close-thumbnail").addEventListener("click", () => {
  window.location.href = "index.html"
});

document.getElementById("close-swiper").addEventListener("click", () => {
  mosaic.style.display = "grid";
  swiper.el.style.display = "none";
  swiper.update();
});

mosaic.querySelectorAll(".thumbnail").forEach((thumbnail) => {
  thumbnail.addEventListener(
    "click",
    ({
      target: {
        dataset: { index },
      },
    }) => {
      mosaic.style.display = "none";
      swiper.el.style.display = "block";
      swiper.update();

      swiper.slideTo(parseInt(index) + 1, 0, false);
    }
  );
});
