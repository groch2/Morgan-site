export function setupBurgerMenu() {
  document.querySelectorAll(".hamburger").forEach(function (hamburger) {
    hamburger.addEventListener(
      "click",
      function () {
        this.classList.toggle("is-active");
      },
      false
    );
  });
}
