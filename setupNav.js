export function setupNav(onNavChange) {
  onNavChange = onNavChange || function () {};
  const nav = document.querySelector("nav");
  const main = document.querySelector("main");
  const overlay = document.getElementById("overlay");
  const burgerMenu = document.getElementById("burger-menu");
  function openNav() {
    onNavChange();
    nav.style.width = "250px";
    main.style.marginLeft = "250px";
    main.style.marginRight = "-250px";
  }
  function closeNav() {
    onNavChange();
    nav.style.width = "0";
    main.style.marginLeft = "0";
    main.style.marginRight = "0";
  }
  let navOpen = false;
  [burgerMenu, main].forEach((item) =>
    item.addEventListener("click", function ({ target }) {
      const isBurgerMenuClick = burgerMenu.contains(target);
      if (!navOpen && !isBurgerMenuClick) {
        return;
      }
      burgerMenu.classList.toggle("is-active");
      if (!navOpen) {
        openNav();
      } else {
        closeNav(!isBurgerMenuClick);
      }
      navOpen = !navOpen;
    })
  );
}
