export function headerAutoHideOnVerticalScroll(isNavOpen) {
    const header = document.querySelector("header");
    const supportPageOffset = window.pageXOffset !== undefined;
    const isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

    let previousScrollPosition = 0;
    const isScrollingDown = () => {
        let scrolledPosition = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? document.documentElement.scrollTop
                : document.body.scrollTop;
        const isScrollDown = scrolledPosition > previousScrollPosition;
        previousScrollPosition = scrolledPosition;
        return isScrollDown;
    };

    const handleNavScroll = () => {
        if (isNavOpen()) {
            return;
        }
        if (isScrollingDown()) {
            header.classList.add("scroll-down");
            header.classList.remove("scroll-up");
        } else {
            header.classList.add("scroll-up");
            header.classList.remove("scroll-down");
        }
    };

    let throttleTimer;
    const throttle = (callback, time) => {
        if (throttleTimer) {
            return;
        }
        throttleTimer = true;
        setTimeout(() => {
            callback();
            throttleTimer = false;
        }, time);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("scroll", () => {
        if (mediaQuery && !mediaQuery.matches) {
            throttle(handleNavScroll, 250);
        }
    });
}