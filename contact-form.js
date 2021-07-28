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
  return {
    init: () => {
      const floatContainers = document.querySelectorAll(".float-container");
      floatContainers.forEach((element) => {
        if (element.querySelector("input, textarea").value) {
          element.classList.add("active");
        }
        bindEvents(element);
      });
    },
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
const form = document.querySelector("form");
const confirmationPanel = form.querySelector("#message-sent-confirmation");
form.querySelector("button").addEventListener("click", () => {
  const isFormValid = form.checkValidity();
  if (!isFormValid) {
    return;
  }
  grecaptcha.ready(() => {
    grecaptcha
      .execute("6Lfm1cIbAAAAAPp9ox3Pqz4mrLQb2BZXyToCTkl0", { action: "submit" })
      .then(function (recaptchaToken) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            confirmationPanel.style.display = "block";
          }
        };
        request.open(
          "POST",
          "https://ggjsff0sh8.execute-api.eu-west-3.amazonaws.com/Prod/",
          true
        );
        request.setRequestHeader("Content-type", "application/json");
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        request.send(
          JSON.stringify({
            message: {
              From: name,
              Subject: email,
              Body: message,
            },
            recaptchaToken,
          })
        );
      });
  });
});

confirmationPanel
  .querySelector("#confirmation-panel-close")
  .addEventListener("click", () => {
    confirmationPanel.style.display = "none";
  });
