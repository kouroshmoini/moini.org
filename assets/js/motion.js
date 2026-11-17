/* One scroll update for reading position, header, and back-to-top. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const top = document.querySelector('.back-top');
  const content = document.querySelector('.report-content');
  const progress = document.querySelector('.reading-progress');
  const contents = document.querySelector('.report-contents');
  const links = [...document.querySelectorAll('.report-contents a')];
  const sections = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  const mobile = matchMedia('(max-width: 50rem)');
  let frame = 0, current = -1;
  function update() {
    frame = 0;
    header?.classList.toggle('is-scrolled', scrollY > 16);
    if (top) top.hidden = scrollY < 700;
    if (!content || !progress) return;
    const offset = (header?.getBoundingClientRect().height || 80) + 24;
    const bounds = content.getBoundingClientRect();
    const distance = content.offsetHeight - innerHeight + offset;
    progress.hidden = distance <= 0;
    if (!progress.hidden) progress.firstElementChild.style.transform =
      'scaleX(' + Math.max(0, Math.min(1, (offset - bounds.top) / distance)) + ')';
    let index = 0;
    sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= offset + 32) index = i; });
    if (index === current) return;
    current = index;
    links.forEach((link, i) => i === index ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', queue, {passive: true});
  addEventListener('resize', queue);
  if (content && 'ResizeObserver' in window) new ResizeObserver(queue).observe(content);
  if (contents) {
    const adaptContents = () => { contents.open = !mobile.matches; };
    mobile.addEventListener('change', adaptContents); adaptContents();
    links.forEach(link => link.addEventListener('click', () => {
      if (!mobile.matches) return;
      contents.open = false;
      // Resolve the anchor after the collapsed contents has changed page height.
      requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (!target) return;
        target.tabIndex = -1; target.focus({preventScroll: true});
        target.scrollIntoView({behavior: reduce.matches ? 'instant' : 'smooth'});
      });
    }));
  }
  update();
  // Browsers without scroll timelines retain fully visible, stationary cards.
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-story]').forEach(card => {
    const slides = [...card.querySelectorAll('.story-slide')];
    const flip = card.querySelector('[data-flip]');
    const status = card.querySelector('[role=status]');
    let index = 0;
    function showNote(open) {
      card.classList.toggle('is-flipped', open);
      flip.setAttribute('aria-pressed', String(open));
      flip.textContent = open ? 'Show visual' : 'Read note';
      slides[index].querySelector('.story-front').setAttribute('aria-hidden', String(open));
      slides[index].querySelector('.story-back').setAttribute('aria-hidden', String(!open));
    }
    function step(direction) {
      slides[index].hidden = true;
      showNote(false);
      index = (index + direction + slides.length) % slides.length;
      const slide = slides[index];
      slide.hidden = false;
      const caption = slide.querySelector('figcaption');
      status.textContent = caption.textContent;
      if (!reduced.matches && slide.animate) {
        slide.querySelector('.story-stage').animate([{opacity:.5,transform:'translateX('+direction*20+'px)'},{opacity:1,transform:'none'}],{duration:340,easing:'ease-out'});
        caption.animate([{transform:'translateY(8px)'},{transform:'none'}],{duration:430,easing:'ease-out'});
      }
    }
    flip.addEventListener('click', () => {
      const open = !card.classList.contains('is-flipped');
      showNote(open);
      status.textContent = open ? slides[index].querySelector('.story-back p').textContent : slides[index].querySelector('figcaption').textContent;
    });
    card.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => step(Number(button.dataset.step))));
    card.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    });
    let start;
    card.addEventListener('touchstart', event => {
      start = event.touches.length === 1 && event.target.closest('.story-stage') ? event.touches[0] : null;
    }, {passive:true});
    card.addEventListener('touchend', event => {
      if (!start) return;
      const end = event.changedTouches[0], dx = end.clientX-start.clientX, dy = end.clientY-start.clientY;
      start = null;
      if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) step(dx<0 ? 1 : -1);
    }, {passive:true});
    card.addEventListener('touchcancel', () => { start = null; });
    card.querySelector('.story-controls').hidden = false;
  });

  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (reduced.matches || target.matches(':focus-within')) return;
      const parts = target.querySelectorAll(':scope > h2,:scope > h3,:scope > .writing-title,:scope > p,:scope > ul,:scope > dt,:scope > dd');
      parts.forEach((part,i) => part.animate(
        [{opacity:.65,transform:'translateY(14px)'},{opacity:1,transform:'none'}],
        {duration:460,delay:i*65,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}
      ));
    });
  }, {threshold:.14});
  document.querySelectorAll('.work-copy,.writing-copy,.skill-grid > div,.profile-entry,.capability-band > a,.section-heading > div,.skills-summary').forEach(el => observer.observe(el));
})();
