import Swiper from "swiper";
import { setupBurgerMenu } from "./burger-menu";
import { setupNav } from "./setupNav";

const burgerMenu = document.querySelector("#burger-menu");
const toggleBurgerMenuEvent = new Event("toggleBurgerMenu");
function onNavChange(isOpen, notify) {
  if (notify) {
    document.dispatchEvent(toggleBurgerMenuEvent);
  }
  menuMosaicContainer.style.overflow = isOpen ? "hidden" : "";
  burgerMenu.style.position = isOpen ? "fixed" : "sticky";
}

setupBurgerMenu();
setupNav(onNavChange);

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

const menuMosaicContainer = document.getElementById("menu-mosaic-container");

const thumbnail = document.getElementsByClassName("thumbnail")[0];
const imageStyle = getComputedStyle(thumbnail);
const imageWidth = thumbnail.offsetWidth;
const imageHeight =
  thumbnail.offsetHeight +
  parseInt(imageStyle.marginTop) +
  parseInt(imageStyle.marginBottom);

document.getElementById("close-swiper").addEventListener("click", () => {
  const { realIndex } = swiper;

  menuMosaicContainer.style.display = "flex";
  swiper.el.style.display = "none";
  swiper.update();

  const nbImageByRow = Math.floor(window.innerWidth / imageWidth);
  const rowIndexOfCurrentSlide = Math.ceil((realIndex + 1) / nbImageByRow);
  const nbRowsOfImagesAboveTheTopOfTheScreen = rowIndexOfCurrentSlide - 1;
  const yOffset = nbRowsOfImagesAboveTheTopOfTheScreen * imageHeight;
  window.scrollTo({ top: yOffset });
});

menuMosaicContainer.querySelectorAll(".thumbnail").forEach((thumbnail) => {
  thumbnail.addEventListener(
    "click",
    ({
      target: {
        dataset: { index },
      },
    }) => {
      if (document.navOpen === true) {
        return;
      }
      menuMosaicContainer.style.display = "none";
      swiper.el.style.display = "block";
      swiper.update();
      swiper.slideTo(parseInt(index) + 1, 0, false);
    }
  );
});
