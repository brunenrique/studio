let scrollTop = 0;

export function lockScroll() {
  scrollTop = window.scrollY || window.pageYOffset;
  document.body.style.top = `-${scrollTop}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

export function unlockScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollTop);
}
