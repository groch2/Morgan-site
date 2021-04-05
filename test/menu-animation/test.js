(function () {
  const header = document.getElementsByTagName("h1")[0];
  const {
    marginTop: headerMarginTop,
    marginBottom: headerMarginBottom,
  } = window.getComputedStyle(header);
  const getSizeValue = (sizeWithUnit) =>
    parseFloat(/^\d+\.?\d*/.exec(sizeWithUnit)[0]);
  const totalHeight =
    header.offsetHeight +
    getSizeValue(headerMarginTop) +
    getSizeValue(headerMarginBottom);
  let isOpen = true;
  document.getElementById("btnTest").addEventListener("click", function () {
    header.style.top = isOpen ? `-${totalHeight}px` : 0;
    isOpen = !isOpen;
  });
})();
