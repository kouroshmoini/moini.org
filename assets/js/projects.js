/* Progressive project exploration. Source data and all original figures remain readable without JS. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-project-map]').forEach(root => {
    const links = [...root.querySelectorAll('[data-intervention]')];
    const detail = root.querySelector('.map-detail');
    const select = id => {
      const source = root.querySelector(`.map-selector [data-intervention="${id}"]`);
      if (!source) return;
      links.forEach(link => {
        if(link.dataset.intervention===id) link.setAttribute('aria-current','true');
        else link.removeAttribute('aria-current');
      });
      root.querySelector('[data-map-title]').textContent=source.dataset.title;
      root.querySelector('[data-map-detail]').textContent=source.dataset.detail;
      root.querySelector('[data-map-read]').href=source.getAttribute('href');
      detail.hidden=false;
    };
    links.forEach(link=>link.addEventListener('click',event=>{
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      event.preventDefault();select(link.dataset.intervention);
    }));
    select(links[0]?.dataset.intervention);
  });
  document.querySelectorAll('[data-landuse]').forEach(root=>{
    const buttons=[...root.querySelectorAll('[data-landuse-id]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      root.querySelector('.landuse-explanation').textContent=button.dataset.description;
    }));
  });
  if(!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('data-in-view');observer.unobserve(entry.target);
    if(reduce.matches)return;
    entry.target.querySelectorAll('[data-count]').forEach(el=>{
      // Keep the final value available to screen readers throughout the short visual count.
      const value=Number(el.dataset.count),final=el.textContent;
      const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=final;
      const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');visual.textContent=final;
      el.replaceChildren(accessible,visual);
      let start;
      const step=time=>{if(!start)start=time;const t=Math.min((time-start)/800,1);visual.textContent=Math.round(value*(1-Math.pow(1-t,3))).toLocaleString('en-CA');if(t<1&&!reduce.matches)requestAnimationFrame(step);else visual.textContent=final;};
      requestAnimationFrame(step);
    });
  }),{threshold:.2});
  document.querySelectorAll('[data-landuse],.proposal-statistics').forEach(el=>observer.observe(el));
})();
