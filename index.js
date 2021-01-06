const sideNav = document.getElementById("home-sidenav");
const main = document.getElementsByTagName("main")[0];
document.getElementById("burger-menu").addEventListener("click", function () {
  sideNav.style.width = "250px";
  main.style.marginLeft = "250px";
  main.style.marginRight = "-250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
});
sideNav
  .querySelectorAll("a[class='closebtn']")[0]
  .addEventListener("click", function () {
    sideNav.style.width = "0";
    main.style.marginLeft = "0";
    main.style.marginRight = "0px";
    document.body.style.backgroundColor = "white";
  });
