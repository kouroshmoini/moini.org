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
  const copy = document.querySelector('.copy-section');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const active = document.querySelector('.report-contents a[aria-current]');
      const status = document.querySelector('.copy-status');
      try { await navigator.clipboard.writeText(active?.href || location.href); status.textContent = 'Section link copied'; }
      catch { status.textContent = 'Use your browser’s address bar to copy the link.'; }
      setTimeout(() => { status.textContent = ''; }, 3500);
    });
  }
  const dialog = document.getElementById('imageViewer');
  if (!dialog || !dialog.showModal) return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  const canvas = dialog.querySelector('.viewer-canvas');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const originalLink = dialog.querySelector('[data-viewer-original]');
  const previous = dialog.querySelector('[data-viewer-prev]');
  const next = dialog.querySelector('[data-viewer-next]');
  const links = [...document.querySelectorAll('a[data-image-viewer]')];
  const status = document.createElement('span');
  status.className = 'viewer-status'; status.setAttribute('role','status');
  canvas.before(status); canvas.tabIndex = 0;
  canvas.setAttribute('aria-label','Image area. Use plus or minus to zoom, arrow keys to pan when zoomed. Swipe to change images when fitted.');
  image.draggable = false;
  const zoomOut = document.createElement('button');
  zoomOut.type = 'button'; zoomOut.className = 'button'; zoomOut.textContent = '−';
  zoomOut.setAttribute('aria-label','Zoom out'); zoom.before(zoomOut);
  const fullscreen = document.createElement('button');
  fullscreen.type = 'button'; fullscreen.className = 'button'; fullscreen.textContent = 'Fullscreen';
  if (dialog.requestFullscreen && document.fullscreenEnabled) {
    zoom.after(fullscreen);
    fullscreen.addEventListener('click',async () => {
      try { if(document.fullscreenElement) await document.exitFullscreen(); else await dialog.requestFullscreen(); }
      catch { status.textContent = 'Fullscreen is unavailable in this browser.'; }
    });
    document.addEventListener('fullscreenchange',() => {fullscreen.textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';resize();});
  }
  let opener, index = 0, scale = 1, drag = null;
  function resize() {
    if (!image.naturalWidth || !dialog.open) return;
    const fit = Math.min(canvas.clientWidth / image.naturalWidth, canvas.clientHeight / image.naturalHeight, 1);
    image.style.width = `${Math.round(image.naturalWidth * fit * scale)}px`;
    image.style.height = `${Math.round(image.naturalHeight * fit * scale)}px`;
  }
  function setZoom(value) {
    const oldScale = scale;
    const centerX = (canvas.scrollLeft + canvas.clientWidth / 2) / oldScale;
    const centerY = (canvas.scrollTop + canvas.clientHeight / 2) / oldScale;
    scale = Math.max(1,Math.min(4,value));
    dialog.classList.toggle('is-zoomed',scale>1);
    zoom.setAttribute('aria-pressed',String(scale>1));
    zoom.textContent = scale===1?'Zoom in':`Zoom ${Math.round(scale*100)}%`;
    zoomOut.disabled = scale===1;
    resize();
    canvas.scrollTo(centerX*scale-canvas.clientWidth/2,centerY*scale-canvas.clientHeight/2);
  }
  function show(position) {
    index = (position + links.length) % links.length;
    const link = links[index];
    status.textContent = 'Loading image…'; canvas.setAttribute('aria-busy','true');
    image.src = link.href; image.alt = link.querySelector('img')?.alt || '';
    originalLink.href = link.href;
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${links.length}`;
    setZoom(1); canvas.scrollTo(0,0);
    previous.disabled = next.disabled = links.length < 2;
  }
  image.addEventListener('load',() => {
    canvas.setAttribute('aria-busy','false');
    status.textContent = 'Drag to pan when zoomed. Swipe to browse when fitted.'; resize();
  });
  image.addEventListener('error',() => {canvas.setAttribute('aria-busy','false');status.textContent='Image could not load. Try the Original link.';});
  links.forEach((link,i) => link.addEventListener('click',event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; dialog.showModal(); show(i);
    document.documentElement.classList.add('viewer-open');
  }));
  previous.addEventListener('click',() => show(index-1));
  next.addEventListener('click',() => show(index+1));
  zoom.addEventListener('click',() => setZoom(scale>=4?1:scale+1));
  zoomOut.addEventListener('click',() => setZoom(scale-1));
  canvas.addEventListener('dblclick',() => setZoom(scale>1?1:2));
  canvas.addEventListener('pointerdown',event => {
    if(event.button!==0) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:canvas.scrollLeft,top:canvas.scrollTop};
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove',event => {
    if(!drag || drag.id!==event.pointerId || scale===1) return;
    canvas.scrollLeft=drag.left+drag.x-event.clientX;
    canvas.scrollTop=drag.top+drag.y-event.clientY;
  });
  function finishDrag(event) {
    if(!drag || drag.id!==event.pointerId) return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(event.type==='pointerup' && scale===1 && Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) show(index+(dx<0?1:-1));
    drag=null; canvas.classList.remove('is-dragging');
  }
  canvas.addEventListener('pointerup',finishDrag); canvas.addEventListener('pointercancel',finishDrag);
  dialog.addEventListener('keydown',event => {
    if(event.key==='+' || event.key==='='){event.preventDefault();setZoom(scale+1);}
    if(event.key==='-'){event.preventDefault();setZoom(scale-1);}
    if(event.key==='0'){event.preventDefault();setZoom(1);}
    if(scale>1 && event.target===canvas && ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault();canvas.scrollBy(event.key==='ArrowRight'?80:event.key==='ArrowLeft'?-80:0,event.key==='ArrowDown'?80:event.key==='ArrowUp'?-80:0);
    } else if(scale===1 && event.key==='ArrowRight'){event.preventDefault();show(index+1);}
    else if(scale===1 && event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
  });
  dialog.addEventListener('click',event => {if(event.target===dialog) dialog.close();});
  dialog.addEventListener('close',() => {
    image.removeAttribute('src');document.documentElement.classList.remove('viewer-open');
    if(document.fullscreenElement===dialog) document.exitFullscreen().catch(()=>{});
    opener?.focus({preventScroll:true});
  });
  window.addEventListener('resize',resize);
})();
