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

  const svg = layer.ownerSVGElement;
  const compact = matchMedia('(max-width: 44rem)');
  const maxAgents = 120;

  function frameMap() {
    // Keep two active north–south streets near the visible phone margins.
    svg.setAttribute('viewBox', compact.matches ? '530 0 420 1000' : '0 0 1440 1000');
    svg.setAttribute('preserveAspectRatio', compact.matches ? 'none' : 'xMidYMid slice');
  }

  function addAgent(points, {car, delay = 0, queued = false} = {}) {
    if (agents.length >= maxAgents) return;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('ambient-map-agent', car ? 'ambient-car' : 'ambient-person');
    dot.setAttribute('r', car ? '3.8' : '2');
    dot.style.color = 'var(--dot-' + pick(colours) + ')';
    dot.style.opacity = '0';
    layer.append(dot);
    const speed = car ? between(56, 92) : between(14, 31);
    const segments = points.slice(1).map(([x, y], index) => {
      const [fromX, fromY] = points[index];
      const length = Math.hypot(x - fromX, y - fromY);
      const departure = car && length < 35 ? 26 : speed;
      return {fromX, fromY, x, y, length, speed: queued && index === 1 ? 25 : departure};
    }).filter(segment => segment.length > 0);
    agents.push({dot, segments, index: 0, distance: 0, age: 0, startsAt: time + delay});
  }

  function frontage(column, row, side, car) {
    const offset = car ? 0 : side * 15;
    const curb = row + offset;
    // These positions correspond to the first house in the adjacent block.
    const blockY = side > 0 ? row : row - 160;
    const buildingX = column + 37;
    const park = (column === 540 && blockY === 280) ||
      (column === 740 && blockY === 440) || (column === 940 && blockY === 600);
    if (blockY < 120 || blockY >= 920 || park) return [[column, curb]];
    return [[buildingX, row + side * (side > 0 ? 25 : 28)], [buildingX, curb]];
  }

  function spawnTrip(car) {
    const source = pick(compact.matches ? [540, 740, 940] : columns.slice(0, -1));
    const target = pick((compact.matches ? [540, 740, 940] : columns.slice(0, -1)).filter(x => x !== source));
    const first = pick(rows);
    const last = pick(rows.filter(y => y !== first));
    const side = Math.random() < .5 ? -1 : 1;
    const offset = car ? 0 : side * 15;
    const leave = frontage(source, first, side, car);
    const arrive = frontage(target, last, side, car);
    // Move on road centrelines, or on parallel sidewalks with a continuous corner.
    addAgent([
      ...leave,
      [target + offset, first + offset],
      [target + offset, last + offset],
      ...arrive.reverse()
    ], {car, delay: between(0, 3.5)});
  }

  function spawnQueue() {
    const road = pick(compact.matches ? [540, 940] : columns);
    const row = pick(rows.slice(1, -1));
    const direction = Math.random() < .5 ? 1 : -1;
    const count = Math.floor(between(4, 8));
    for (let index = 0; index < count; index++) {
      addAgent([[road, row - direction * 155], [road, row],
        [road, row + direction * 90], [road, row + direction * 155]],
      {car: true, queued: true, delay: index * .85});
    }
  }

  function spawn() {
    const count = Math.floor(between(2, 7));
    for (let i = 0; i < count; i++) spawnTrip(Math.random() < .45);
    if (Math.random() < .16) spawnQueue();
    timer = setTimeout(spawn, between(250, 1400));
  }

  function draw(now) {
    const elapsed = previousTime === undefined ? 0 : Math.min((now - previousTime) / 1000, .05);
    previousTime = now;
    time += elapsed;
    for (let i = agents.length - 1; i >= 0; i--) {
      const agent = agents[i];
      if (time < agent.startsAt) continue;
      agent.age += elapsed;
      let segment = agent.segments[agent.index];
      agent.distance += elapsed * segment.speed;
      if (agent.distance >= segment.length) {
        agent.index++;
        agent.distance = 0;
        segment = agent.segments[agent.index];
      }
      if (!segment) {
        agent.dot.remove();
        agents.splice(i, 1);
        continue;
      }
      const progress = agent.distance / segment.length;
      agent.dot.setAttribute('cx', segment.fromX + (segment.x - segment.fromX) * progress);
      agent.dot.setAttribute('cy', segment.fromY + (segment.y - segment.fromY) * progress);
      const remaining = agent.index === agent.segments.length - 1 ? (segment.length - agent.distance) / 10 : 1;
      agent.dot.style.opacity = String(Math.min(1, agent.age * 3, remaining));
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
      for (let i = 0; i < 42; i++) spawnTrip(Math.random() < .45);
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
  compact.addEventListener('change', () => {
    frameMap();
    agents.splice(0).forEach(agent => agent.dot.remove());
    syncMotion();
  });
  frameMap();
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  render(); button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused; render();
    try { localStorage.setItem('background-motion', paused ? 'paused' : 'running'); } catch {}
  });
})();
