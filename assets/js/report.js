/* Shared accessible comparisons and image viewer. No per-post scripts. */
(() => {
  document.querySelectorAll('[data-comparison]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    function select(index, focus = false) {
      tabs.forEach((tab,i) => {tab.setAttribute('aria-selected', String(i===index)); tab.tabIndex = i===index ? 0 : -1; panels[i].hidden = i!==index;});
      if (focus) tabs[index].focus();
    }
    panels.forEach((panel,i) => {panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tabs[i].id);panel.tabIndex=0;});
    tabs.forEach((tab,i) => {
      tab.addEventListener('click',() => select(i));
      tab.addEventListener('keydown',event => {
        let next;
        if(event.key==='ArrowRight') next=(i+1)%tabs.length;
        if(event.key==='ArrowLeft') next=(i-1+tabs.length)%tabs.length;
        if(event.key==='Home') next=0;
        if(event.key==='End') next=tabs.length-1;
        if(next!==undefined){event.preventDefault();select(next,true);}
      });
    });
    select(0);root.querySelector('[role="tablist"]').hidden=false;
  });
  const dialog=document.getElementById('imageViewer');
  if(!dialog || !dialog.showModal) return;
  const image=dialog.querySelector('img');
  const caption=dialog.querySelector('p');
  let opener;
  document.querySelectorAll('a[data-image-viewer]').forEach(link => {
    link.addEventListener('click',event => {
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey) return;
      event.preventDefault();opener=link;
      const original=link.querySelector('img');
      image.src=link.href;image.alt=original?.alt||'';
      caption.textContent=link.closest('figure')?.querySelector('figcaption')?.textContent||image.alt;
      dialog.showModal();
    });
  });
  dialog.addEventListener('click',event => {if(event.target===dialog) dialog.close();});
  dialog.addEventListener('close',() => {image.removeAttribute('src');opener?.focus({preventScroll:true});});
})();
