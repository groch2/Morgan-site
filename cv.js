import { setupNav } from "./setupNav";
import { headerAutoHideOnVerticalScroll } from "./header-auto-hide-on-vertical-scroll";

const { onNavChange, isNavOpen } = (function () {
    const burgerMenuContainer = document.getElementById("burger-menu-container");
    const header = document.querySelector("header");
    const body = document.querySelector("body");
    let _isNavOpen = false;
    return {
        onNavChange: () => {
            header.style.visibility = _isNavOpen ? "visible" : "hidden";
            burgerMenuContainer.style.visibility = "visible";
            burgerMenuContainer.style.position = _isNavOpen ? "absolute" : "fixed";
            body.style.overflow = _isNavOpen ? "visible" : "hidden";
            _isNavOpen = !_isNavOpen;
        },
        isNavOpen: () => _isNavOpen,
    };
})();

setupNav(onNavChange);
headerAutoHideOnVerticalScroll(isNavOpen);