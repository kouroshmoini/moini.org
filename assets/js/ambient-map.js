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
  let nextQueue = 2;

  const svg = layer.ownerSVGElement;
  const compact = matchMedia('(max-width: 44rem)');
  const maxAgents = 120;

  function frameMap() {
    // Keep two active north–south streets near the visible phone margins.
    svg.setAttribute('viewBox', compact.matches ? '530 0 420 1000' : '0 0 1440 1000');
    svg.setAttribute('preserveAspectRatio', compact.matches ? 'none' : 'xMidYMid slice');
  }

  function addAgent(points, {car, delay = 0, releaseAt = 0, colour = pick(colours)} = {}) {
    if (agents.length >= maxAgents) return;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('ambient-map-agent', car ? 'ambient-car' : 'ambient-person');
    dot.setAttribute('r', car ? '3.8' : '2');
    dot.style.color = 'var(--dot-' + colour + ')';
    dot.style.opacity = '0';
    layer.append(dot);
    const speed = car ? between(24, 31) : between(12, 22);
    const segments = points.slice(1).map(([x, y], index) => {
      const [fromX, fromY] = points[index];
      const length = Math.hypot(x - fromX, y - fromY);
      const departure = car && length < 35 ? 18 : speed;
      return {fromX, fromY, x, y, length, speed: releaseAt && index === 0 ? 26 : departure};
    }).filter(segment => segment.length > 0);
    agents.push({dot, segments, index: 0, distance: 0, age: 0, startsAt: time + delay, releaseAt});
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
    const edges = visibleEdgeStreets();
    if (!edges.length) return;
    const road = pick(edges);
    const row = pick(rows.slice(1, -1));
    const direction = Math.random() < .5 ? 1 : -1;
    const count = Math.min(5, maxAgents - agents.length);
    if (count < 3) return false;
    const colourStart = Math.floor(between(0, colours.length));
    for (let index = 0; index < count; index++) {
      const stop = row - direction * (8 + index * 15);
      addAgent([[road, stop - direction * 45], [road, stop], [road, row + direction * 110]], {
        car: true,
        delay: index * .35,
        releaseAt: time + 5 + index * .95,
        colour: colours[(colourStart + index) % colours.length]
      });
    }
    return true;
  }

  function visibleEdgeStreets() {
    const transform = svg.getScreenCTM();
    if (!transform) return [];
    const width = document.documentElement.clientWidth;
    const visible = columns.filter(x => {
      const screenX = x * transform.a + transform.e;
      return screenX >= 4 && screenX <= width - 4;
    });
    return visible.length >= 2 ? [visible[0], visible[visible.length - 1]] : [];
  }

  function spawnEdgeTraffic() {
    if (agents.length > maxAgents - 2) return;
    const edges = visibleEdgeStreets();
    edges.forEach((road, side) => {
      const car = Math.random() < .58;
      const lane = road + (car ? 0 : (side === 0 ? -6 : 6));
      const start = pick(rows);
      const end = pick(rows.filter(y => Math.abs(y - start) >= 320));
      addAgent([[lane, start], [lane, end]], {car, delay: between(0, .8)});
    });
  }

  function spawn() {
    if (time >= nextQueue && spawnQueue()) {
      nextQueue = time + between(13, 24);
    }
    spawnEdgeTraffic();
    const count = Math.floor(between(1, 4));
    for (let i = 0; i < count && agents.length < maxAgents - 5; i++) spawnTrip(Math.random() < .45);
    timer = setTimeout(spawn, between(500, 1700));
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
      const waiting = agent.index === 1 && time < agent.releaseAt;
      if (!waiting) agent.distance += elapsed * segment.speed;
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
      for (let i = 0; i < 14; i++) {
        spawnEdgeTraffic();
        spawnTrip(Math.random() < .45);
      }
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
