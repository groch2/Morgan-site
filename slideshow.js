import Swiper, { Navigation, HashNavigation } from "swiper";
import { setupNav } from "./setupNav";
import { headerAutoHideOnVerticalScroll } from "./header-auto-hide-on-vertical-scroll";

const swiper = new Swiper("#swiper-container", {
  modules: [Navigation, HashNavigation],
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  hashNavigation: {
    watchState: true,
  },
  loop: true,
});

const menuMosaicContainer = document.getElementById("menu-mosaic-container");

const hash = new URL(window.location.href).hash.substring(1);
const pictureIndex = parseInt(hash);
if (!isNaN(pictureIndex)) {
  menuMosaicContainer.style.display = "none";
  swiper.el.style.display = "block";
  openSlideShowToPosition(pictureIndex - 1);
}

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

document.getElementById("close-swiper").addEventListener("click", () => {
  menuMosaicContainer.style.display = "flex";
  swiper.el.style.display = "none";
  swiper.update();
});

function openSlideShowToPosition(index) {
  menuMosaicContainer.style.display = "none";
  swiper.el.style.display = "block";
  swiper.update();
  swiper.slideTo(parseInt(index) + 1, 0, false);
}

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
      openSlideShowToPosition(index);
    }
  );
});

headerAutoHideOnVerticalScroll(isNavOpen);
