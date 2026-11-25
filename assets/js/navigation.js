/* Mobile menu and modal scroll preservation. */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primaryNav');
  const mobile = matchMedia('(max-width: 44rem)');
  function close(returnFocus = false) {
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.hidden = false;
    document.documentElement.classList.add('nav-ready');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true);
    });
    document.addEventListener('click', e => { if (!e.target.closest('.site-header')) close(); });
    document.addEventListener('focusin', e => { if (!e.target.closest('.site-header')) close(); });
    mobile.addEventListener('change', () => close());
  }
  // Fixed body locking prevents iOS scrolling the report underneath an open dialog.
  let savedScroll = 0, locked = false;
  const dialogs = [...document.querySelectorAll('dialog')];
  function syncDialogs() {
    const open = dialogs.some(dialog => dialog.open);
    if (open === locked) return;
    locked = open;
    if (open) {
      savedScroll = scrollY;
      document.body.style.top = '-' + savedScroll + 'px';
      document.documentElement.classList.add('modal-open');
      document.dispatchEvent(new Event('portfolio:modal-change'));
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.style.top = '';
      scrollTo({top: savedScroll, behavior: 'instant'});
      document.dispatchEvent(new Event('portfolio:modal-change'));
    }
  }
  const observer = new MutationObserver(syncDialogs);
  dialogs.forEach(dialog => {
    observer.observe(dialog, {attributes: true, attributeFilter: ['open']});
    dialog.addEventListener('close', syncDialogs);
  });
})();
