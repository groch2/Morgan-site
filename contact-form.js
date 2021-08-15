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
const confirmationPanelSuccess = form.querySelector("#message-sent-confirmation");
const confirmationPanelError = form.querySelector("#message-sending-error");
const messageSendingResultNotifications = [confirmationPanelSuccess, confirmationPanelError];
const button = form.querySelector("button");
button.addEventListener("click", () => {
  messageSendingResultNotifications.forEach(panel => panel.style.display = "none");
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
          if (this.readyState == 4) {
            button.classList.remove('button--loading');
            const panel = 
              this.status == 200 ? confirmationPanelSuccess : confirmationPanelError;
            panel.style.display = "flex";
          }
        };
        request.open(
          "POST",
          "https://ggjsff0sh8.execute-api.eu-west-3.amazonaws.com/Prod/",
          true);
        request.setRequestHeader("Content-type", "application/json");
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        button.classList.add('button--loading');
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

messageSendingResultNotifications
  .forEach((panel) => {
    panel
      .querySelector(".confirmation-panel-close")
      .addEventListener("click", () => {
        panel.style.display = "none";
      })
  });
