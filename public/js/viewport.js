function applyResponsiveStyles() {
  const width = window.innerWidth;
  const body = document.body;
  body.classList.remove('media-480', 'media-768', 'media-1024', 'media-1250', 'media-1990');

  if (width <= 480) {
    body.classList.add('media-480');
  } else if (width <= 768) {
    body.classList.add('media-768');
  } else if (width <= 1024) {
    body.classList.add('media-1024');
  } else if (width <= 1250) {
    body.classList.add('media-1250');
  } else if (width >= 1990) {
    body.classList.add('media-1990');
  }
}

window.addEventListener('resize', applyResponsiveStyles);
window.addEventListener('DOMContentLoaded', applyResponsiveStyles);
