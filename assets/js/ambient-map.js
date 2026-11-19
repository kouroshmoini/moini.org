/* Optional motion preference; decoration remains static without animation support. */
(() => {
  const button = document.querySelector('.ambient-map-toggle');
  const layer = document.querySelector('.ambient-map-agents');
  if (!button || !layer) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const columns = [140, 340, 540, 740, 940, 1140, 1340];
  const rows = [120, 280, 440, 600, 760, 920];
  const crossStreets = [280, 600, 920];
  const colours = ['amber', 'violet', 'teal', 'blue'];
  const agents = [];
  const between = (min, max) => min + Math.random() * (max - min);
  const pick = values => values[Math.floor(Math.random() * values.length)];
  let timer;
  let frame;
  let previousTime;
  let lastPaint = 0;
  let time = 0;
  let nextQueue = 2;
  let nextResponse = between(18, 38);

  const svg = layer.ownerSVGElement;
  const compact = matchMedia('(max-width: 44rem)');
  const maxAgents = 120;

  function frameMap() {
    if (!compact.matches) {
      svg.setAttribute('viewBox', '0 0 1440 1000');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      return;
    }

    const {width, height} = svg.getBoundingClientRect();
    if (width <= 0 || height <= 0) return;
    // Fit the two side streets to the width, then frame the height at the same scale.
    const mapWidth = 660;
    const mapHeight = mapWidth * height / width;
    svg.setAttribute('viewBox', `${740 - mapWidth / 2} ${(1000 - mapHeight) / 2} ${mapWidth} ${mapHeight}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }

  function addAgent(points, {car, emergency = false, delay = 0, releaseAt = 0, colour = pick(colours)} = {}) {
    if (agents.length >= maxAgents) return;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('ambient-map-agent', car ? 'ambient-car' : 'ambient-person');
    if (emergency) dot.classList.add('ambient-responder');
    dot.setAttribute('r', car ? '3.8' : '2');
    dot.style.color = 'var(--dot-' + colour + ')';
    dot.style.opacity = '0';
    layer.append(dot);
    const speed = emergency ? between(43, 50) : car ? between(12, 16) : between(6, 9);
    const segments = points.slice(1).map(([x, y], index) => {
      const [fromX, fromY] = points[index];
      const length = Math.hypot(x - fromX, y - fromY);
      const departure = car && length < 35 ? 9 : speed;
      return {fromX, fromY, x, y, length, speed: releaseAt && index === 0 ? 14 : departure};
    }).filter(segment => segment.length > 0);
    agents.push({dot, segments, emergency, car, pace: 1, shiftX: 0, shiftY: 0, index: 0, distance: 0, age: 0, startsAt: time + delay, releaseAt});
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
    return [[buildingX, row + side * (side > 0 ? (car ? 25 : 34) : (car ? 28 : 37))], [buildingX, curb]];
  }

  // All through traffic uses the same orthogonal streets as the SVG map.
  function crossTown(emergency = false, delay = 0) {
    const streets = compact.matches ? columns.slice(1, -1) : columns;
    const east = Math.random() < .5;
    const start = east ? streets[0] : streets[streets.length - 1];
    const finish = east ? streets[streets.length - 1] : streets[0];
    const turn = pick(streets.slice(1, -1));
    const first = pick(rows.slice(1, -1));
    const last = Math.random() < .25 ? first : pick(rows.filter(y => y !== first));
    const points = [[start, first], [turn, first], [turn, last], [finish, last]];
    addAgent(points, {car: true, emergency, delay, colour: emergency ? 'blue' : pick(colours)});
  }

  function spawnTrip(car) {
    if (car) { crossTown(); return; }
    const source = pick(compact.matches ? [540, 740, 940] : columns.slice(0, -1));
    const target = pick(columns.filter(x => Math.abs(x - source) === 200 && x < 1340));
    const first = pick(crossStreets);
    const last = pick(rows.filter(y => Math.abs(y - first) >= 320));
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

  function travelBetweenHouses(road, side, car) {
    const inward = side === 0 ? 1 : -1;
    const block = inward > 0 ? road : road - 200;
    const parkRow = {540: 280, 740: 440, 940: 600}[block];
    const buildingRows = rows.slice(0, -1).filter(row => row !== parkRow);
    if (block < 140 || block > 1340) return false;

    const first = pick(buildingRows);
    const last = pick(buildingRows.filter(row => row !== first));
    const frontageOffset = car ? 65 : (inward > 0 ? 35 : 100);
    const travelLane = car ? road : road + inward * 14;
    const entrance = road + inward * (car ? 32 : 33);
    addAgent([[entrance, first + frontageOffset], [travelLane, first + frontageOffset],
      [travelLane, last + frontageOffset], [entrance, last + frontageOffset]], {
      car, delay: between(0, 1.2)
    });
    return true;
  }

  function spawnEdgeTraffic() {
    if (agents.length > maxAgents - 2) return;
    const edges = visibleEdgeStreets();
    edges.forEach((road, side) => {
      const car = Math.random() < .58;
      if (Math.random() < (car ? .55 : .7) && travelBetweenHouses(road, side, car)) return;
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
    const limit = compact.matches ? 48 : 76;
    if (time >= nextResponse && !agents.some(agent => agent.emergency)) {
      crossTown(true);
      if (Math.random() < .22) crossTown(true, between(3, 6));
      nextResponse = time + between(85, 155);
    }
    if (agents.length < limit) spawnEdgeTraffic();
    const count = Math.floor(between(1, 3));
    for (let i = 0; i < count && agents.length < limit; i++) spawnTrip(Math.random() < .45);
    timer = setTimeout(spawn, between(500, 1700));
  }

  // Reserve a short corridor ahead, including the next street after a turn.
  function priorityLanes() {
    const lanes = [];
    for (const agent of agents) {
      if (!agent.emergency || time < agent.startsAt) continue;
      let reach = 82;
      for (let i = agent.index; i < agent.segments.length && reach > 0; i++) {
        const s = agent.segments[i];
        const start = i === agent.index ? agent.distance : 0;
        const dx = (s.x - s.fromX) / s.length, dy = (s.y - s.fromY) / s.length;
        const end = Math.min(s.length, start + reach);
        lanes.push({x: s.fromX + dx * start, y: s.fromY + dy * start,
          dx, dy, length: end - start});
        reach -= end - start;
      }
    }
    return lanes;
  }

  function yieldToTraffic(agent, segment, lanes, elapsed) {
    const x = segment.fromX + (segment.x - segment.fromX) * agent.distance / segment.length;
    const y = segment.fromY + (segment.y - segment.fromY) * agent.distance / segment.length;
    const lane = lanes.find(l => {
      const along = (x-l.x)*l.dx + (y-l.y)*l.dy;
      const across = (x-l.x)*l.dy - (y-l.y)*l.dx;
      return along >= -15 && along <= l.length + 8 && Math.abs(across) < 12;
    });
    const ease = Math.min(1, elapsed * (lane ? 4 : 2));
    agent.pace += ((lane ? 0 : 1) - agent.pace) * ease;
    // Pull to the nearest side of the priority lane and hold until it clears.
    if (lane) {
      const side = (x-lane.x)*(-lane.dy) + (y-lane.y)*lane.dx >= 0 ? 1 : -1;
      agent.shiftX += (-lane.dy * side * 9 - agent.shiftX) * ease;
      agent.shiftY += (lane.dx * side * 9 - agent.shiftY) * ease;
    } else {
      agent.shiftX *= 1 - ease;
      agent.shiftY *= 1 - ease;
    }
    agent.dot.classList.toggle('is-yielding', Boolean(lane));
  }

  function draw(now) {
    // 30 fps is sufficient for slow decoration, including on 120 Hz phones.
    if (now - lastPaint < 1000 / 30) { frame = requestAnimationFrame(draw); return; }
    lastPaint = now;
    const elapsed = previousTime === undefined ? 0 : Math.min((now - previousTime) / 1000, .05);
    previousTime = now;
    time += elapsed;
    const lanes = priorityLanes();
    for (let i = agents.length - 1; i >= 0; i--) {
      const agent = agents[i];
      if (time < agent.startsAt) continue;
      agent.age += elapsed;
      let segment = agent.segments[agent.index];
      const waiting = agent.index === 1 && time < agent.releaseAt;
      if (agent.car && !agent.emergency && (lanes.length || agent.pace < .9999)) {
        yieldToTraffic(agent, segment, lanes, elapsed);
      }
      if (!waiting) agent.distance += elapsed * segment.speed * agent.pace;
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
      agent.dot.setAttribute('cx', segment.fromX + (segment.x - segment.fromX) * progress + agent.shiftX);
      agent.dot.setAttribute('cy', segment.fromY + (segment.y - segment.fromY) * progress + agent.shiftY);
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
    if (paused || reduced.matches || document.hidden || document.documentElement.classList.contains('modal-open')) return;
    if (!agents.length) {
      for (let i = 0; i < 14; i++) {
        spawnEdgeTraffic();
        if (i % 2 === 0) spawnTrip(Math.random() < .45);
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
  if (typeof ResizeObserver === 'function') {
    const resizeObserver = new ResizeObserver(() => {
      if (compact.matches) frameMap();
    });
    resizeObserver.observe(svg);
  } else {
    window.addEventListener('resize', frameMap);
  }
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  document.addEventListener('portfolio:modal-change', syncMotion);
  addEventListener('pagehide', () => { clearTimeout(timer); cancelAnimationFrame(frame); });
  addEventListener('pageshow', syncMotion);
  render(); button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused; render();
    try { localStorage.setItem('background-motion', paused ? 'paused' : 'running'); } catch {}
  });
})();
