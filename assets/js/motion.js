/* Progressive enhancement: navigation, reading position and restrained motion. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const article = document.querySelector('.post');
  const progress = document.querySelector('.reading-progress');
  const links = [...document.querySelectorAll('.report-contents a')];
  const sections = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  let frame = 0;
  function update() {
    frame = 0;
    if (!article) return;
    const content = document.querySelector('.report-content');
    const bounds = content.getBoundingClientRect();
    const distance = content.offsetHeight - innerHeight;
    progress.hidden = distance <= 0;
    if (!progress.hidden) progress.firstElementChild.style.transform = `scaleX(${Math.max(0, Math.min(1, -bounds.top / distance))})`;
    let index = 0;
    sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= 180) index = i; });
    links.forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  if (article) {
    addEventListener('scroll', queue, {passive:true}); addEventListener('resize', queue);
    if ('ResizeObserver' in window) new ResizeObserver(queue).observe(article);
    update();
  }
  const active = new Set();
  if ('IntersectionObserver' in window && Element.prototype.animate) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reduce.matches || entry.target.matches(':focus-within, :target')) return;
        // Translate only: text and images remain fully visible throughout.
        const animation = entry.target.animate([{transform:'translateY(12px)'},{transform:'none'}], {duration:420,easing:'cubic-bezier(.2,.75,.25,1)'});
        active.add(animation); animation.finished.then(() => active.delete(animation),() => active.delete(animation));
        if (entry.target.matches('.corridor-diagram')) entry.target.classList.add('route-in-view');
      });
    }, {threshold:.08});
    document.querySelectorAll('.work-card,.capability-band,.report-figure,.corridor-diagram').forEach(el => {if(el.getBoundingClientRect().top > innerHeight) observer.observe(el);});
    reduce.addEventListener('change', () => {if(reduce.matches) active.forEach(animation => animation.cancel());});
  }
})();
