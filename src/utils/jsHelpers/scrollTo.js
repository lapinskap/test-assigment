const FPS = 40;
let requestId = null;
const scrollTo = (input, offset = 0, duration = 300) => {
  const targetOffsetTop = getTopOffset(input) - offset;
  const windowOffsetTop = (window && window.pageYOffset) || (document && document.documentElement.scrollTop) || (document && document.body.scrollTop);
  const dimensionToChange = parseFloat(
    (Math.abs(windowOffsetTop - targetOffsetTop) / duration) * FPS,
  );
  let dimensionCurrent = windowOffsetTop;
  if (windowOffsetTop > targetOffsetTop) {
    const scrollToAction = () => {
      dimensionCurrent -= dimensionToChange;
      if (dimensionCurrent > targetOffsetTop) {
        window.scroll(0, dimensionCurrent);
        requestId = requestAnimationFrame(scrollToAction);
      } else {
        window.scroll(0, targetOffsetTop);
        cancelAnimationFrame(requestId);
      }
    };
    requestAnimationFrame(scrollToAction);
  } else {
    const scrollToAction = () => {
      dimensionCurrent += dimensionToChange;
      if (dimensionCurrent < targetOffsetTop) {
        window.scroll(0, dimensionCurrent);
        requestId = requestAnimationFrame(scrollToAction);
      } else {
        window.scroll(0, targetOffsetTop);
        cancelAnimationFrame(requestId);
      }
    };
    requestAnimationFrame(scrollToAction);
  }
};
function getTopOffset(element) {
  let yPosition = 0;
  let elementHolder = element;
  while (elementHolder) {
    yPosition += (elementHolder.offsetTop - elementHolder.scrollTop + elementHolder.clientTop);
    elementHolder = elementHolder.offsetParent;
  }

  return yPosition;
}

export default scrollTo;
