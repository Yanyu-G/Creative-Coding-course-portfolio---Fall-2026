let pMapper;
let fishMap;
let fish;
let moving = true;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  pMapper = createProjectionMapper(this);
  fishMap = pMapper.createQuadMap(600, 600, 20, 20);
  fish = createGraphics(600, 600);

  resetLayout();
}

function draw() {
  background(0);

  if (moving) {
    time += 0.04;
  }

  fish.background(0);
  fish.noStroke();
  fish.fill(255);
  fish.circle(300, 300, 560);

  fish.stroke(0);
  fish.strokeWeight(5);

  for (let x = 170; x < 430; x += 20) {
    let y = 300 + sin(time + x * 0.02) * 10;
    let nextY = 300 + sin(time + (x + 20) * 0.02) * 10;

    fish.line(x, y, x + 20, nextY);
  }

  for (let x = 190; x < 430; x += 30) {
    let y = 300 + sin(time + x * 0.02) * 10;
    let boneLength = 30 + sin((x - 170) / 260 * PI) * 35;

    fish.line(x, y, x + 15, y - boneLength);
    fish.line(x, y, x + 15, y + boneLength);
  }

  let headY = 300 + sin(time + 170 * 0.02) * 10;

  fish.noStroke();
  fish.fill(0);
  fish.ellipse(140, headY, 70, 55);

  fish.fill(255);
  fish.circle(128, headY - 8, 10);

  let tailY = 300 + sin(time + 430 * 0.02) * 10;

  fish.fill(0);
  fish.triangle(
    430, tailY,
    490, tailY - 35,
    490, tailY + 35
  );

  fishMap.displayTexture(fish);
}

function resetLayout() {
  let size = min(width, height) * 0.85;

  fishMap.load({
    x: -size / 2,
    y: -size / 2,
    points: [
      { i: 0, x: 0, y: 0, u: 0, v: 0 },
      { i: 19, x: size, y: 0, u: 1, v: 0 },
      { i: 380, x: 0, y: size, u: 0, v: 1 },
      { i: 399, x: size, y: size, u: 1, v: 1 }
    ]
  });
}

function keyPressed() {
  if (key === "c") pMapper.toggleCalibration();
  if (key === "s") pMapper.save("fish-map.json");
  if (key === "r") resetLayout();
  if (key === "f") fullscreen(!fullscreen());

  if (key === " ") {
    moving = !moving;
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}