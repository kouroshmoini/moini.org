/* Optional motion preference; decoration remains static without animation support. */
(() => {
  const button = document.querySelector('.ambient-map-toggle');
  if (!button) return;
  let paused = false;
  try { paused = localStorage.getItem('background-motion') === 'paused'; } catch {}
  function render() {
    document.documentElement.classList.toggle('background-motion-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume background motion' : 'Pause background motion';
  }
  render(); button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused; render();
    try { localStorage.setItem('background-motion', paused ? 'paused' : 'running'); } catch {}
  });
})();
