/* Native, progressively enhanced navigation and editorial discovery. */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primaryNav');
  const mobile = matchMedia('(max-width: 44rem)');
  function close(returnFocus = false) {
    toggle.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    if(returnFocus) toggle.focus();
  }
  toggle.hidden = false;
  document.documentElement.classList.add('nav-ready');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open',open);
  });
  nav.addEventListener('click', e => {if(e.target.closest('a')) close();});
  document.addEventListener('keydown',e => {if(e.key==='Escape' && toggle.getAttribute('aria-expanded')==='true') close(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header')) close();});
  mobile.addEventListener('change',()=>close());
  const top = document.querySelector('.back-top');
  const updateTop = () => {top.hidden=scrollY < 700;};
  addEventListener('scroll',updateTop,{passive:true}); updateTop();
  const filters=document.querySelector('.project-filters');
  if(!filters) return;
  filters.hidden=false;
  const rows=[...document.querySelectorAll('.archive-year .writing-row')];
  const buttons=[...filters.querySelectorAll('button')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;
    rows.forEach(row=>{
      row.hidden=button.dataset.filter!=='all'&&!row.dataset.focus.split(' ').includes(button.dataset.filter);
      if(!row.hidden){count++;if(!matchMedia('(prefers-reduced-motion: reduce)').matches) row.animate([{transform:'translateY(8px)'},{transform:'none'}],{duration:260,easing:'ease-out'});}
    });
    document.querySelectorAll('.archive-year').forEach(group=>{group.hidden=![...group.querySelectorAll('.writing-row')].some(row=>!row.hidden);});
    document.querySelector('.filter-status').textContent=`${count} ${count===1?'entry':'entries'} shown`;
  }));
})();
