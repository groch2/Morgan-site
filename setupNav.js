export function setupNav(onNavChange) {
  onNavChange = onNavChange || function () {};
  const nav = document.getElementsByTagName("nav")[0];
  const main = document.getElementsByTagName("main")[0];
  const burgerMenu =
    document.getElementById("burger-menu") ||
    document.getElementsByClassName("burger-menu")[0];
  const closeButton = nav.querySelectorAll("a[class='closebtn']");
  const closeButtonExists = closeButton.length === 1;
  function openNav(notify) {
    onNavChange(true, notify);
    nav.style.width = "250px";
    main.style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    if (!closeButtonExists) {
      burgerMenu.style.backgroundColor = "white";
      burgerMenu.style.zIndex = 1;
    }
  }
  function closeNav(notify) {
    onNavChange(false, notify);
    nav.style.width = "0";
    main.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
    if (!closeButtonExists) {
      burgerMenu.style.backgroundColor = "transparent";
      burgerMenu.style.zIndex = "auto";
    }
  }
  if (closeButtonExists) {
    burgerMenu.addEventListener("click", function () {
      openNav(false);
    });
    closeButton[0].addEventListener("click", function () {
      closeNav(false);
    });
  } else {
    let navOpen = false;
    [burgerMenu, main].forEach((item) =>
      item.addEventListener("click", function ({ target }) {
        const isThumbnailClick = target.parentElement.classList.contains(
          "thumbnail"
        );
        const isBurgerMenuClick = burgerMenu.contains(target);
        if (!navOpen && (isThumbnailClick || !isBurgerMenuClick)) {
          return;
        }
        if (!navOpen && target != main) {
          openNav(false);
        } else {
          closeNav(!isBurgerMenuClick);
        }
        navOpen = !navOpen;
      })
    );
  }
}
