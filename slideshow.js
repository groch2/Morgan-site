import Swiper from "swiper";
import { setupNav } from "./setupNav";

const { onNavChange, isNavOpen } = (function () {
  const burgerMenuContainer = document.getElementById("burger-menu-container");
  const header = document.querySelector("header");
  let _isNavOpen = false;
  return {
    onNavChange: () => {
      header.style.visibility = _isNavOpen ? "visible" : "hidden";
      burgerMenuContainer.style.visibility = "visible";
      burgerMenuContainer.style.position = _isNavOpen ? "absolute" : "fixed";
      menuMosaicContainer.style.overflow = _isNavOpen ? "" : "hidden";
      _isNavOpen = !_isNavOpen;
    },
    isNavOpen: () => _isNavOpen,
  };
})();

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
      if (isNavOpen()) {
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
  const header = document.querySelector("header");
  const supportPageOffset = window.pageXOffset !== undefined;
  const isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

  let previousScrollPosition = 0;
  const isScrollingDown = () => {
    let scrolledPosition = supportPageOffset
      ? window.pageYOffset
      : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop;
    const isScrollDown = scrolledPosition > previousScrollPosition;
    previousScrollPosition = scrolledPosition;
    return isScrollDown;
  };

  const handleNavScroll = () => {
    if (isNavOpen()) {
      return;
    }
    if (isScrollingDown()) {
      header.classList.add("scroll-down");
      header.classList.remove("scroll-up");
    } else {
      header.classList.add("scroll-up");
      header.classList.remove("scroll-down");
    }
  };

  let throttleTimer;
  const throttle = (callback, time) => {
    if (throttleTimer) {
      return;
    }
    throttleTimer = true;
    setTimeout(() => {
      callback();
      throttleTimer = false;
    }, time);
  };

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("scroll", () => {
    if (mediaQuery && !mediaQuery.matches) {
      throttle(handleNavScroll, 250);
    }
  });
})();
