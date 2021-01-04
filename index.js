const sideNav = document.getElementById("home-sidenav");
document.getElementById("burger-menu").addEventListener("click", function () {
  sideNav.style.width = "250px";
});
sideNav
  .querySelectorAll("a[class='closebtn']")[0]
  .addEventListener("click", function () {
    sideNav.style.width = "0";
  });
