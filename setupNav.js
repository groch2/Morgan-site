export function setupNav(onNavChange) {
  onNavChange = onNavChange || function () {};
  const nav = document.getElementsByTagName("nav")[0];
  const main = document.getElementsByTagName("main")[0];
  const overlay = document.getElementById("overlay");
  const burgerMenu =
    document.getElementById("burger-menu") ||
    document.getElementsByClassName("burger-menu")[0];
  const closeButton = nav.querySelectorAll("a[class='closebtn']");
  const closeButtonExists = closeButton.length === 1;
  function openNav(notify) {
    onNavChange(true, notify);
    nav.style.width = "250px";
    main.style.marginLeft = "250px";
    overlay.style.display = "block";
  }
  function closeNav(notify) {
    onNavChange(false, notify);
    nav.style.width = "0";
    main.style.marginLeft = "0";
    overlay.style.display = "none";
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
        console.log("click on ", target.tagName);
        const isBurgerMenuClick = burgerMenu.contains(target);
        if (!navOpen && !isBurgerMenuClick) {
          return;
        }
        if (!navOpen) {
          openNav(false);
        } else {
          closeNav(!isBurgerMenuClick);
        }
        navOpen = !navOpen;
      })
    );
  }
}
