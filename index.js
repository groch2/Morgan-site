import { setupNav } from "./setupNav";

const onNavChange = (function () {
  const headerTitle = document.querySelector("header > h1");
  let _isNavOpen = false;
  return () => {
    headerTitle.style.opacity = _isNavOpen ? "1" : "0";
    _isNavOpen = !_isNavOpen;
  };
})();

setupNav(onNavChange);
