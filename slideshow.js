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

function getIndexFromHash() {
  return parseInt(/(?<=#)\d+$/.exec(window.location.hash));
}

const menuMosaicContainer = document.getElementById("menu-mosaic-container");
const thumbnails = menuMosaicContainer.querySelectorAll(".thumbnail");
const nbTotalPictures = thumbnails.length;

function incrementHashPictureIndex() {
  const index = getIndexFromHash();
  window.location.hash = index < nbTotalPictures ? `${index + 1}` : 1;
}

function decrementHashPictureIndex() {
  const index = getIndexFromHash();
  window.location.hash = index > 1 ? `${index - 1}` : nbTotalPictures;
}

document
  .querySelector(".swiper-button-prev")
  .addEventListener("click", () => {
    decrementHashPictureIndex();
    swiper.slidePrev();
  });

document
  .querySelector(".swiper-button-next")
  .addEventListener("click", () => {
    incrementHashPictureIndex()
    swiper.slideNext();
  });

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowRight":
      incrementHashPictureIndex();
      swiper.slideNext();
      return;
    case "ArrowLeft":
      decrementHashPictureIndex();
      swiper.slidePrev();
      return;
  }
});

function slideToIndexFromHash() {
  const slideIndex = parseInt(window.location.hash.substring(1));
  menuMosaicContainer.style.display = "none";
  swiper.el.style.display = "block";
  swiper.update();
  swiper.slideTo(slideIndex, 0, false);
}

if (/^#\d+$/i.test(window.location.hash)) {
  slideToIndexFromHash();
}

window.onhashchange = slideToIndexFromHash;

document.getElementById("close-swiper").addEventListener("click", () => {
  menuMosaicContainer.style.display = "flex";
  swiper.el.style.display = "none";
  swiper.update();

  window.location.href =
    window.location.href.substring(0, window.location.href.lastIndexOf("#"));
});

thumbnails.forEach((thumbnail) => {
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
      index = `${parseInt(index) + 1}`;
      swiper.slideTo(index, 0, false);
      window.location.hash = `${index}`;
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
