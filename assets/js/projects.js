/* Progressive project exploration. Source data and all original figures remain readable without JS. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  function setupCorridorFilm(stage) {
    const film = stage.querySelector('.corridor-film');
    const fallback = stage.querySelector('.corridor-film-fallback');
    const stallAfter = 3500;
    let inView = false;
    let monitor;
    let lastTime;
    let lastFrameCount;
    let lastProgress;
    let playPending = false;
    let fallbackLoading = false;
    let fallbackReady = false;
    let retryFallbackAt = 0;

    function shouldPlay() {
      return inView && !document.hidden && !reduce.matches && !fallbackReady;
    }

    async function loadFallback() {
      if (fallbackReady || fallbackLoading || performance.now() < retryFallbackAt) return;
      fallbackLoading = true;
      let objectURL;
      try {
        const urls = Array.from({length: Number(fallback.dataset.parts)}, (_, index) =>
          fallback.dataset.src + String(index).padStart(2, '0') + '.bin');
        const parts = await Promise.all(urls.map(async url => {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Animation data is unavailable');
          return response.arrayBuffer();
        }));
        objectURL = URL.createObjectURL(new Blob(parts, {type: 'image/webp'}));
        fallback.src = objectURL;
        await fallback.decode();
        fallbackReady = true;
        syncPlayback();
      } catch {
        fallback.removeAttribute('src');
        if (objectURL) URL.revokeObjectURL(objectURL);
        retryFallbackAt = performance.now() + 8000;
      } finally {
        fallbackLoading = false;
      }
    }

    async function resumeFilm() {
      if (!shouldPlay()) return;
      if (film.error || film.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        loadFallback();
        return;
      }
      if (!film.paused || playPending) return;

      film.muted = true;
      playPending = true;
      try {
        await film.play();
      } catch (error) {
        if (shouldPlay() && error.name !== 'AbortError') loadFallback();
      } finally {
        playPending = false;
      }
    }

    function checkProgress() {
      if (!shouldPlay()) return;
      // Browsers can stop advancing a video without firing a pause event.
      const now = performance.now();
      const time = film.currentTime;
      const quality = film.getVideoPlaybackQuality?.();
      const frames = quality ? quality.totalVideoFrames - quality.droppedVideoFrames : 0;
      if (time !== lastTime && (!lastFrameCount || frames !== lastFrameCount)) {
        lastProgress = now;
      } else if (now - lastProgress >= stallAfter) {
        loadFallback();
      }
      lastTime = time;
      lastFrameCount = frames;
      resumeFilm();
    }

    function syncPlayback() {
      film.autoplay = !reduce.matches && !fallbackReady;
      film.hidden = fallbackReady;
      fallback.hidden = !fallbackReady || reduce.matches;
      if (!shouldPlay()) {
        clearInterval(monitor);
        monitor = undefined;
        if (reduce.matches || fallbackReady) film.pause();
        return;
      }
      if (!monitor) {
        lastTime = film.currentTime;
        lastFrameCount = 0;
        lastProgress = performance.now();
        monitor = setInterval(checkProgress, 750);
      }
      resumeFilm();
    }

    film.addEventListener('pause', resumeFilm);
    film.addEventListener('loadeddata', resumeFilm);
    film.addEventListener('error', () => { if (shouldPlay()) loadFallback(); }, true);
    reduce.addEventListener('change', syncPlayback);
    window.addEventListener('pageshow', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      });
      observer.observe(stage);
    } else {
      const updateVisibility = () => {
        const bounds = stage.getBoundingClientRect();
        inView = bounds.bottom > 0 && bounds.top < innerHeight;
        syncPlayback();
      };
      window.addEventListener('scroll', updateVisibility, {passive: true});
      window.addEventListener('resize', updateVisibility);
      updateVisibility();
    }
    syncPlayback();
  }

  document.querySelectorAll('[data-project-map]').forEach(root => {
    const stage = root.querySelector('.project-map-stage');
    if (stage?.querySelector('.corridor-film')) setupCorridorFilm(stage);
    const links = [...root.querySelectorAll('.corridor-stops a, .map-hotspot')];
    const panel = root.querySelector('.corridor-preview');
    const figures = new Map([...document.querySelectorAll('.chinatown-visuals figure')].map(figure => [figure.id, figure]));
    let selected;
    let hovered;
    let focused;

    function highlight() {
      const active = hovered || focused || selected;
      links.forEach(link => link.classList.toggle('is-previewed', link.hash.slice(1) === active));
      figures.forEach((figure, id) => figure.classList.toggle('is-previewed', id === active));
    }

    function closePreview() {
      selected = hovered = focused = null;
      panel.hidden = true;
      panel.replaceChildren();
      links.forEach(control => control.setAttribute('aria-expanded', 'false'));
      highlight();
    }

    document.addEventListener('pointerdown', event => {
      if (selected && !event.target.closest('.map-hotspot, .corridor-stops a, .corridor-preview, dialog')) closePreview();
    });
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        if (panel.contains(document.activeElement)) {
          links.find(link => link.hash.slice(1) === selected)?.focus({preventScroll: true});
        }
        closePreview();
      }
    });

    links.forEach(link => {
      const id = link.hash.slice(1);
      const figure = figures.get(id);
      if (!figure) return;
      link.setAttribute('aria-controls', panel.id);
      link.setAttribute('aria-expanded', 'false');
      if (link.classList.contains('map-hotspot')) {
        const thumbnail = figure.querySelector('img').cloneNode();
        thumbnail.className = 'map-stop-thumbnail';
        thumbnail.loading = 'eager';
        thumbnail.alt = '';
        thumbnail.setAttribute('aria-hidden', 'true');
        link.append(thumbnail);
      }
      link.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        hovered = id;
        highlight();
      });
      link.addEventListener('pointerleave', () => { hovered = null; highlight(); });
      link.addEventListener('focus', () => { focused = id; highlight(); });
      link.addEventListener('blur', () => { focused = null; highlight(); });
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (selected === id) {
          closePreview();
          return;
        }
        selected = id;
        links.forEach(control => control.setAttribute('aria-expanded', String(control.hash.slice(1) === selected)));
        panel.hidden = false;
        const image = figure.querySelector('img').cloneNode();
        const caption = document.createElement('div');
        caption.className = 'corridor-preview-copy';
        caption.append(...[...figure.querySelector('figcaption').children].map(child => child.cloneNode(true)));
        const enlarge = document.createElement('button');
        enlarge.type = 'button'; enlarge.className = 'image-enlarge corridor-preview-image';
        enlarge.setAttribute('aria-label', 'Enlarge selected intervention');
        enlarge.textContent = 'Enlarge ↗';
        const art = document.createElement('div');
        art.className = 'figure-art';
        art.append(image, enlarge);
        enlarge.addEventListener('click', () => {
          enlarge.focus({preventScroll: true});
          figure.querySelector('[data-image-viewer]')?.click();
        });
        const close = document.createElement('button');
        close.type = 'button'; close.className = 'text-link'; close.textContent = 'Close detail';
        close.addEventListener('click', () => { link.focus({preventScroll: true}); closePreview(); });
        const stops = [...root.querySelectorAll('.corridor-stops a')];
        const stopIndex = stops.findIndex(stop => stop.hash === link.hash);
        const controls = document.createElement('nav');
        controls.className = 'corridor-controls';
        controls.setAttribute('aria-label', 'Follow the corridor');
        for (const [offset, label] of [[-1, '← West'], [1, 'East →']]) {
          const nextStop = stops[stopIndex + offset];
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = label;
          button.disabled = !nextStop;
          if (nextStop) {
            button.setAttribute('aria-label', label + ': ' + nextStop.querySelector('strong').textContent);
            button.addEventListener('click', () => {
              nextStop.click();
              const title = panel.querySelector('.corridor-preview-copy strong, .corridor-preview-copy h3') || panel;
              title.tabIndex = -1;
              title.focus({preventScroll: true});
            });
          }
          controls.append(button);
        }
        controls.append(close);
        caption.append(controls);
        panel.replaceChildren(art, caption);
        if (!reduce.matches) panel.animate?.([{opacity: 0}, {opacity: 1}], {duration: 240, easing: 'ease-out'});
        if (!link.classList.contains('map-hotspot') && panel.getBoundingClientRect().top < 100) {
          panel.tabIndex = -1;
          panel.focus({preventScroll: true});
          panel.scrollIntoView({block: 'nearest', behavior: reduce.matches ? 'instant' : 'smooth'});
        }
        highlight();
      });
    });
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
    // Values stay at their source figures; only the bar shapes animate.

  }),{threshold:.2});
  document.querySelectorAll('[data-landuse],.proposal-statistics').forEach(el=>observer.observe(el));
})();
