export function setupNav(onNavChange) {
  onNavChange = onNavChange || function () {};
  const nav = document.getElementsByTagName("nav")[0];
  const main = document.getElementsByTagName("main")[0];
  const overlay = document.getElementById("overlay");
  const burgerMenu = document.getElementById("burger-menu");
  function openNav() {
    onNavChange();
    nav.style.width = "250px";
    main.style.marginLeft = "250px";
    overlay.style.display = "block";
  }
  function closeNav() {
    onNavChange();
    nav.style.width = "0";
    main.style.marginLeft = "0";
    overlay.style.display = "none";
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
