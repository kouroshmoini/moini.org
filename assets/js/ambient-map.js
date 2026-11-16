/* Optional motion preference; decoration remains static without animation support. */
(() => {
  const button = document.querySelector('.ambient-map-toggle');
  const layer = document.querySelector('.ambient-map-agents');
  if (!button || !layer) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const columns = [140, 340, 540, 740, 940, 1140, 1340];
  const rows = [120, 280, 440, 600, 760, 920];
  const colours = ['amber', 'violet', 'teal', 'blue'];
  const agents = [];
  const between = (min, max) => min + Math.random() * (max - min);
  const pick = values => values[Math.floor(Math.random() * values.length)];
  let timer;
  let frame;
  let previousTime;
  let time = 0;

  function addAgent(horizontal, street, start, end, options = {}) {
    if (agents.length >= 52 || start === end) return;
    const car = options.car ?? Math.random() < .55;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('ambient-map-agent');
    dot.setAttribute('r', car ? '3.1' : '2.2');
    dot.style.color = 'var(--dot-' + pick(colours) + ')';
    dot.style.opacity = '0';
    layer.append(dot);
    agents.push({
      dot, horizontal, street, start, end,
      speed: (options.speed ?? (car ? between(36, 78) : between(16, 30))) * Math.sign(end - start),
      at: start,
      startsAt: time + (options.delay ?? 0),
      turn: options.turn,
      stop: options.stop,
      rest: options.rest ?? 0
    });
  }

  function spawnTraffic() {
    const horizontal = Math.random() < .6;
    const street = pick(horizontal ? rows : columns);
    const positions = horizontal ? columns : rows;
    const start = pick(positions);
    const end = pick(positions.filter(position => Math.abs(position - start) >= 300));
    const busy = Math.random() < .22;
    const count = busy ? Math.floor(between(3, 6)) : 1;
    const speed = busy ? between(24, 38) : undefined;
    const alternateStreets = (horizontal ? rows : columns).filter(value => Math.abs(value - street) >= 140);
    const turn = !busy && Math.random() < .48 ? pick(alternateStreets) : undefined;
    for (let i = 0; i < count; i++) {
      const lane = Math.sign(end - start) * (busy ? 6 : between(4, 11));
      addAgent(horizontal, street + lane, start, end, {
        car: busy ? true : undefined, speed, turn, delay: i * between(.45, 1.5)
      });
    }
  }

  function spawnGathering() {
    const horizontal = Math.random() < .56;
    const street = pick(horizontal ? rows : columns);
    const positions = horizontal ? columns : rows;
    const crossing = pick(positions.slice(1, -1));
    // Sidewalk stops can sit at a crossing or along a building frontage.
    const destination = crossing + (Math.random() < .45 ? 0 : between(-63, 63));
    const direction = Math.random() < .5 ? -1 : 1;
    const count = Math.floor(between(3, 5));
    for (let i = 0; i < count; i++) {
      const offset = between(-18, 18);
      addAgent(horizontal, street + direction * between(10, 22),
        destination - direction * between(55, 116),
        destination + direction * between(90, 145), {
          car: false, stop: destination + offset, rest: between(2, 6), delay: between(0, 3)
        });
    }
  }

  function spawn() {
    spawnTraffic();
    if (Math.random() < .22) spawnGathering();
    timer = setTimeout(spawn, between(330, 1900));
  }

  function draw(now) {
    const elapsed = previousTime === undefined ? 0 : Math.min((now - previousTime) / 1000, .05);
    previousTime = now;
    time += elapsed;
    for (let i = agents.length - 1; i >= 0; i--) {
      const agent = agents[i];
      if (time < agent.startsAt) continue;
      const { dot, horizontal, street, start, end, speed } = agent;
      if (agent.holdUntil === undefined || time >= agent.holdUntil) {
        agent.at += speed * elapsed;
        if (agent.stop !== undefined && (agent.at - agent.stop) * speed >= 0) {
          agent.at = agent.stop;
          agent.stop = undefined;
          agent.holdUntil = time + agent.rest;
        }
      }
      if ((agent.at - end) * speed >= 0) {
        if (agent.turn !== undefined) {
          agent.horizontal = !horizontal;
          agent.street = end;
          agent.start = agent.at = street;
          agent.end = agent.turn;
          agent.speed = Math.abs(speed) * Math.sign(agent.end - street);
          agent.turn = undefined;
          continue;
        }
        dot.remove();
        agents.splice(i, 1);
        continue;
      }
      dot.setAttribute('cx', horizontal ? agent.at : street);
      dot.setAttribute('cy', horizontal ? street : agent.at);
      dot.style.opacity = String(Math.min(1, Math.abs(agent.at - start) / 17, agent.turn === undefined ? Math.abs(end - agent.at) / 17 : 1));
    }
    frame = requestAnimationFrame(draw);
  }

  function syncMotion() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    previousTime = undefined;
    layer.toggleAttribute('hidden', reduced.matches);
    if (paused || reduced.matches || document.hidden) return;
    if (!agents.length) {
      for (let i = 0; i < 12; i++) spawnTraffic();
    }
    spawn();
    frame = requestAnimationFrame(draw);
  }
  let paused = false;
  try { paused = localStorage.getItem('background-motion') === 'paused'; } catch {}
  function render() {
    document.documentElement.classList.toggle('background-motion-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    syncMotion();
    button.textContent = paused ? 'Resume background motion' : 'Pause background motion';
  }
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  render(); button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused; render();
    try { localStorage.setItem('background-motion', paused ? 'paused' : 'running'); } catch {}
  });
})();
