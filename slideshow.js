import Swiper from "swiper";
import { setupBurgerMenu } from "./burger-menu";
import { setupNav } from "./setupNav";

const { onNavChange, isNavOpen } = (function () {
  const burgerMenuContainerStyle = document.querySelector(
    "#burger-menu-container"
  ).style;
  const headerStyle = document.querySelector(".header").style;

  let _isNavOpen = false;
  const toggleBurgerMenuEvent = new Event("toggleBurgerMenu");
  return {
    onNavChange: (isOpen, notify) => {
      headerStyle.visibility = isOpen ? "hidden" : "visible";
      burgerMenuContainerStyle.visibility = "visible";

      _isNavOpen = !_isNavOpen;
      if (notify) {
        document.dispatchEvent(toggleBurgerMenuEvent);
      }
      menuMosaicContainer.style.overflow = isOpen ? "hidden" : "";
    },
    isNavOpen: () => _isNavOpen,
  };
})();

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
      if (isNavOpen() === true) {
        return;
      }
      menuMosaicContainer.style.display = "none";
      swiper.el.style.display = "block";
      swiper.update();
      swiper.slideTo(parseInt(index) + 1, 0, false);
    }
  );
});

(function () {
  const header = document.querySelector(".header");
  const {
    top: top,
    marginTop: headerMarginTop,
    marginBottom: headerMarginBottom,
  } = window.getComputedStyle(header);
  const getSizeValue = (sizeWithUnit) =>
    parseFloat(/^\d+\.?\d*/.exec(sizeWithUnit)[0]);
  const totalHeaderHeight =
    header.offsetHeight +
    getSizeValue(headerMarginTop) +
    getSizeValue(headerMarginBottom);
  document.getElementById("mosaic").style.paddingTop = `${totalHeaderHeight}px`;
  const distanceForHeaderSwitching = totalHeaderHeight * 0.75;
  let lastKnownScrollPosition = 0;
  let currentDirection = "DOWN";
  let positionAtLastScrollDirectionChange = 0;
  document.addEventListener("scroll", function () {
    if (isNavOpen()) {
      return;
    }
    const newDirection =
      lastKnownScrollPosition > window.scrollY ? "UP" : "DOWN";
    if (currentDirection != newDirection) {
      positionAtLastScrollDirectionChange = window.scrollY;
      currentDirection = newDirection;
    } else {
      const diffFromPreviouDirectionChangePosition = Math.abs(
        window.scrollY - positionAtLastScrollDirectionChange
      );
      if (diffFromPreviouDirectionChangePosition > distanceForHeaderSwitching) {
        header.style.top =
          newDirection == "DOWN" ? `-${totalHeaderHeight}px` : top;
      }
    }
    lastKnownScrollPosition = window.scrollY;
  });
})();
