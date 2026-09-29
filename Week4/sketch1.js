
const cityLayers = [];
let bDoExportSvg = false;

function setup() {
  createCanvas(576, 384);
  noFill();
  stroke(0);
  strokeWeight(1);
  const specs = [
    { count: 7, start: 55, step: 75, base: 300, depth: 0.3, heights: [150, 250], widths: [35, 65] },
    { count: 6, start: 70, step: 85, base: 320, depth: 0.6, heights: [110, 190], widths: [45, 75] },
    { count: 5, start: 85, step: 100, base: 340, depth: 1, heights: [70, 140], widths: [55, 90] }
  ];
  specs.forEach((spec, layer) => {
    for (let i = 0; i < spec.count; i++) {
      cityLayers.push({ x: spec.start + i * spec.step, base: spec.base,
        depth: spec.depth, h: random(...spec.heights), w: random(...spec.widths),
        pattern: (i + layer) % 3 });
    }
  });
}

function draw() {
  background(255);
  const moveX = map(constrain(mouseX, 0, width), 0, width, -20, 20);
  const moveY = map(constrain(mouseY, 0, height), 0, height, -10, 10);
  const buildings = cityLayers.map(b => {
    const x = b.x + moveX * b.depth;
    const bottom = b.base + moveY * b.depth;
    return { left: x - b.w / 2, right: x + b.w / 2,
      top: bottom - b.h, bottom, pattern: b.pattern };
  });
  if (bDoExportSvg) beginRecordSvg("week4_city.svg");
  buildings.forEach((b, i) => {
    const occluders = buildings.slice(i + 1);
    buildingLines(b).forEach(segment => {
      let visible = [segment];
      occluders.forEach(box => {
        visible = visible.flatMap(part => subtractBox(part, box));
      });
      visible.forEach(part => line(...part));
    });
  });
  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}

function buildingLines(b) {
  const { left: l, right: r, top: t, bottom: d } = b;
  const segments = [[l,t,r,t], [r,t,r,d], [r,d,l,d], [l,d,l,t]];
  if (b.pattern === 0) {
    for (let y = t + 10; y < d; y += 10) segments.push([l,y,r,y]);
  } else if (b.pattern === 1) {
    for (let x = l + 10; x < r; x += 10) segments.push([x,t,x,d]);
  } else {
    for (let x = l + 10; x < r; x += 10) {
      for (let y = t + 15; y < d; y += 15) {
        const length = Math.min(7, r - x, y - t);
        segments.push([x,y,x + length,y - length]);
      }
    }
  }
  return segments;
}

function subtractBox(segment, box) {
  const [x1,y1,x2,y2] = segment;
  const dx = x2 - x1, dy = y2 - y1;
  let enter = 0, leave = 1;
  for (const [origin, delta, min, max] of [
    [x1,dx,box.left,box.right], [y1,dy,box.top,box.bottom]
  ]) {
    if (Math.abs(delta) < 1e-10) {
      if (origin <= min || origin >= max) return [segment];
    } else {
      const a = (min - origin) / delta, b = (max - origin) / delta;
      enter = Math.max(enter, Math.min(a,b));
      leave = Math.min(leave, Math.max(a,b));
      if (enter >= leave) return [segment];
    }
  }
  const point = t => [x1 + t * dx, y1 + t * dy];
  const parts = [];
  if (enter > 1e-10) parts.push([x1,y1,...point(enter)]);
  if (leave < 1 - 1e-10) parts.push([...point(leave),x2,y2]);
  return parts;
}

function keyPressed() {
  if (key === 's' || key === 'S') bDoExportSvg = true;
}
