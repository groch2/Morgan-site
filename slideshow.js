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
  window.location.href = "index.html";
});

const thumbnail = document.getElementsByClassName("thumbnail")[0];
const imageStyle = getComputedStyle(thumbnail);
const imageWidth = thumbnail.offsetWidth;
const imageHeight =
  thumbnail.offsetHeight +
  parseInt(imageStyle.marginTop) +
  parseInt(imageStyle.marginBottom);

document.getElementById("close-swiper").addEventListener("click", () => {
  mosaic.style.display = "grid";
  swiper.el.style.display = "none";
  swiper.update();

  const nbImageByColumns = Math.floor(window.innerWidth / imageWidth);
  const yOffset =
    Math.floor(mosaic.nbImagesAboveTopOfScreen / nbImageByColumns) *
    imageHeight;
  window.scrollTo({ top: yOffset });
});

mosaic.querySelectorAll(".thumbnail").forEach((thumbnail) => {
  thumbnail.addEventListener(
    "click",
    ({
      target: {
        dataset: { index },
      },
    }) => {
      const nbImageByColumns = Math.floor(window.innerWidth / imageWidth);
      mosaic.nbImagesAboveTopOfScreen =
        Math.floor(window.pageYOffset / imageHeight) * nbImageByColumns;

      mosaic.style.display = "none";
      swiper.el.style.display = "block";
      swiper.update();
      swiper.slideTo(parseInt(index) + 1, 0, false);
    }
  );
});
