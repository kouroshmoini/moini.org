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
    if (!article || !progress) return;
    const content = document.querySelector('.report-content');
    if (!content) return;
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
  // Scroll state supplies header depth without an ongoing animation loop.
  const header = document.querySelector('.site-header');
  const headerState = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll',headerState,{passive:true});headerState();
  const active = new Set();
  if ('IntersectionObserver' in window && Element.prototype.animate) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, order) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reduce.matches || entry.target.matches(':focus-within, :target')) return;
        // Translate only: text and images remain fully visible throughout.
        const animation = entry.target.animate([{transform:'translateY(18px)',opacity:.85},{transform:'none',opacity:1}], {duration:650,delay:Math.min(order*65,260),easing:'cubic-bezier(.2,.75,.25,1)'});
        active.add(animation); animation.finished.then(() => active.delete(animation),() => active.delete(animation));
        if (entry.target.matches('.corridor-diagram')) entry.target.classList.add('route-in-view');
      });
    }, {threshold:.08});
    document.querySelectorAll('.work-card,.capability-band a,.report-figure,.corridor-diagram,.profile-entry,.skill-grid > div,.writing-row,.report-content > h2,.comparison-notes,.chinatown-visuals figure,.chinatown-plate,.report-content > p,.project-chart,.map-explorer').forEach(el => {if(el.getBoundingClientRect().top > innerHeight) observer.observe(el);});
    reduce.addEventListener('change', () => {if(reduce.matches) active.forEach(animation => animation.cancel());});
  }
  // Very small, opt-in parallax; disabled on touch and with reduced motion.
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  let parallaxFrame = 0;
  function moveDepth() {
    parallaxFrame = 0;
    const enabled = !reduce.matches && matchMedia('(hover:hover) and (pointer:fine)').matches;
    parallax.forEach(el => {
      const box = el.getBoundingClientRect();
      const offset = enabled ? Math.max(-10,Math.min(10,(innerHeight/2-box.top-box.height/2)*.025)) : 0;
      el.style.translate = `0 ${offset}px`;
    });
  }
  if(parallax.length){
    addEventListener('scroll',() => {if(!parallaxFrame)parallaxFrame=requestAnimationFrame(moveDepth);},{passive:true});
    reduce.addEventListener('change',moveDepth);moveDepth();
  }
})();
