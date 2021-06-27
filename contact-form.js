import { setupNav } from "./setupNav";

const onNavChange = (function () {
  const burgerMenuContainer = document.getElementById("burger-menu-container");
  const header = document.querySelector("header");
  let _isNavOpen = false;
  return () => {
    header.style.visibility = _isNavOpen ? "visible" : "hidden";
    burgerMenuContainer.style.visibility = "visible";
    burgerMenuContainer.style.position = _isNavOpen ? "absolute" : "fixed";
    _isNavOpen = !_isNavOpen;
  };
})();

setupNav(onNavChange);

const FloatLabel = (() => {
  // add active class and placeholder
  const handleFocus = (e) => {
    const target = e.target;
    target.parentNode.classList.add("active");
    target.setAttribute("placeholder", target.getAttribute("data-placeholder"));
  };

  // remove active class and placeholder
  const handleBlur = (e) => {
    const target = e.target;
    if (!target.value) {
      target.parentNode.classList.remove("active");
    }
    target.removeAttribute("placeholder");
  };

  // register events
  const bindEvents = (element) => {
    const floatField = element.querySelector("input, textarea");
    floatField.addEventListener("focus", handleFocus);
    floatField.addEventListener("blur", handleBlur);
  };

  // get DOM elements
  const init = () => {
    const floatContainers = document.querySelectorAll(".float-container");

    floatContainers.forEach((element) => {
      if (element.querySelector("input, textarea").value) {
        element.classList.add("active");
      }

      bindEvents(element);
    });
  };

  return {
    init: init,
  };
})();

FloatLabel.init();

const emailInput = document.getElementById("email");
emailInput.addEventListener("input", () => {
  emailInput.setCustomValidity("");
  emailInput.checkValidity();
});
emailInput.addEventListener("invalid", () => {
  emailInput.setCustomValidity("Please, enter a valid email address");
});
