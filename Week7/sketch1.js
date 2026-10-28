let pMapper;
let quadMap, quadMap2, quadMap3;

let sky;
let city;
let leftCity;
let rightCity;
let animationFrame = 0;
let lastAnimationTime = -1000;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.elt.style.touchAction = "none";

  pixelDensity(1);
  pMapper = createProjectionMapper(this);
  quadMap = pMapper.createQuadMap(400, 400, 20, 20);
  quadMap2 = pMapper.createQuadMap(400, 400, 20, 20);
  quadMap3 = pMapper.createQuadMap(400, 400, 20, 20);
  resetLayout();
  sky = createGraphics(400, 400);
  city = createGraphics(800, 400);
  leftCity = createGraphics(400, 400);
  rightCity = createGraphics(400, 400);

}

function drawCity() {
  city.background('#111827');
  city.noStroke();
  city.fill('#ffffff');
  for (let i = 0; i < 40; i++) {
    city.circle(random(800), random(160), 3);
  }

  for (let x = 0; x < 800; x += 60) {
    let buildingHeight = 220 + sin(animationFrame * 0.05 + x * 0.02) * 100;
    let active = random(1) > 0.35;
    city.fill(active ? '#3b5068' : '#243447');
    city.rect(x, 400 - buildingHeight, 50, buildingHeight);
    if (active) {
      city.fill('#ffd166');
      for (let y = 400 - buildingHeight + 20; y < 380; y += 30) {
        if (random(1) > 0.6) city.rect(x + 10, y, 8, 12);
        if (random(1) > 0.6) city.rect(x + 30, y, 8, 12);
      }
    }
  }
  leftCity.image(city, 0, 0, 400, 400, 0, 0, 400, 400);
  rightCity.image(city, 0, 0, 400, 400, 400, 0, 400, 400);
}

function draw() {
  background(0);
  if (millis() - lastAnimationTime >= 1000 / 6) {
    lastAnimationTime = millis();
    animationFrame++;
    drawCity();
    sky.background('#111827');
    sky.noStroke();
    sky.fill(255);
    for (let i = 0; i < 30; i++) {
      sky.circle(random(400), random(400), random(2, 5));
    }
  }
  quadMap.displayTexture(sky);
  quadMap2.displayTexture(leftCity);
  quadMap3.displayTexture(rightCity);
}

function resetLayout() {
  let size = min(width / 2.3, height / 2.3, 400);
  let gap = 12;
  let positions = [[-size / 2, -size - gap / 2], [-size, gap / 2], [0, gap / 2]];
  let surfaces = [quadMap, quadMap2, quadMap3];
  for (let i = 0; i < surfaces.length; i++) {
    surfaces[i].load({
      x: positions[i][0], y: positions[i][1],
      points: [
        { i: 0, x: 0, y: 0, u: 0, v: 0 },
        { i: 19, x: size, y: 0, u: 1, v: 0 },
        { i: 380, x: 0, y: size, u: 0, v: 1 },
        { i: 399, x: size, y: size, u: 1, v: 1 }
      ]
    });
  }
}

function keyPressed() {
  if (key === "c") pMapper.toggleCalibration();
  if (key === "s") pMapper.save("city-map.json");
  if (key === "r") resetLayout();
  if (key === "f") fullscreen(!fullscreen());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

