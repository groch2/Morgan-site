(function () {
  const header = document.getElementsByTagName("h1")[0];
  const {
    marginTop: headerMarginTop,
    marginBottom: headerMarginBottom,
  } = window.getComputedStyle(header);
  const getSizeValue = (sizeWithUnit) =>
    parseFloat(/^\d+\.?\d*/.exec(sizeWithUnit)[0]);
  const totalHeaderHeight =
    header.offsetHeight +
    getSizeValue(headerMarginTop) +
    getSizeValue(headerMarginBottom);
  document.getElementsByTagName(
    "p"
  )[0].style.paddingTop = `${totalHeaderHeight}px`;

  const distanceForHeaderSwitching = totalHeaderHeight * 0.75;
  let lastKnownScrollPosition = 0;
  let currentDirection = "DOWN";
  let positionAtLastScrollDirectionChange = 0;
  document.addEventListener("scroll", function () {
    const newDirection =
      lastKnownScrollPosition > window.scrollY ? "UP" : "DOWN";
    if (currentDirection != newDirection) {
      positionAtLastScrollDirectionChange = window.scrollY;
      currentDirection = newDirection;
    } else {
      const diffFromPreviouDirectionChangePosition = Math.abs(
        window.scrollY - positionAtLastScrollDirectionChange
      );
      if (diffFromPreviouDirectionChangePosition > distanceForHeaderSwitching) {
        header.style.top =
          newDirection == "DOWN" ? `-${totalHeaderHeight}px` : 0;
      }
    }
    lastKnownScrollPosition = window.scrollY;
  });
})();
