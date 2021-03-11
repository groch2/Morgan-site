export function setupBurgerMenu() {
  const burgerMenus = document.querySelectorAll(".hamburger-box");
  burgerMenus.forEach(function (burgerMenu) {
    burgerMenu.addEventListener(
      "click",
      function () {
        this.classList.toggle("is-active");
      },
      false
    );
  });
  document.addEventListener("toggleBurgerMenu", function () {
    burgerMenus.forEach(function (burgerMenu) {
      burgerMenu.classList.toggle("is-active");
    });
  });
}
