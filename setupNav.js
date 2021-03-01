export function setupNav() {
  const nav = document.getElementsByTagName("nav")[0];
  const main = document.getElementsByTagName("main")[0];
  const burgerMenu =
    document.getElementById("burger-menu") ||
    document.getElementsByClassName("burger-menu")[0];
  const closeButton = nav.querySelectorAll("a[class='closebtn']");
  const closeButtonExists = closeButton.length === 1;
  function openNav() {
    nav.style.width = "250px";
    main.style.marginLeft = "250px";
    main.style.marginRight = "-250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    if (!closeButtonExists) {
      burgerMenu.style.backgroundColor = "white";
      burgerMenu.style.zIndex = 1;
    }
  }
  function closeNav() {
    nav.style.width = "0";
    main.style.marginLeft = "0";
    main.style.marginRight = "0px";
    document.body.style.backgroundColor = "white";
    if (!closeButtonExists) {
      burgerMenu.style.backgroundColor = "transparent";
      burgerMenu.style.zIndex = "auto";
    }
  }
  if (closeButtonExists) {
    burgerMenu.addEventListener("click", openNav);
    closeButton[0].addEventListener("click", closeNav);
  } else {
    let navOpen = false;
    burgerMenu.addEventListener("click", function () {
      if (!navOpen) {
        openNav();
      } else {
        closeNav();
      }
      navOpen = !navOpen;
    });
  }
}
