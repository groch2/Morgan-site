const nav = document.getElementsByTagName("nav")[0];
const main = document.getElementsByTagName("main")[0];
document.getElementById("burger-menu").addEventListener("click", function () {
  nav.style.width = "250px";
  main.style.marginLeft = "250px";
  main.style.marginRight = "-250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
});
nav
  .querySelectorAll("a[class='closebtn']")[0]
  .addEventListener("click", function () {
    nav.style.width = "0";
    main.style.marginLeft = "0";
    main.style.marginRight = "0px";
    document.body.style.backgroundColor = "white";
  });
