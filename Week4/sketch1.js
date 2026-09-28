let buildingHeights = [];
function setup() {
  createCanvas(576, 384);

  background(255);

  noFill();
  stroke(0);

  rectMode(CENTER);

  for (let i = 0; i < 5; i++) {
    buildingHeights[i] = random(80, 220);
  }
}

function draw() {
background(255);
let i = 0;

for (let x = 80; x < width - 60; x += 100) {

for (let x = 80; x < width - 60; x += 100) {
  push();
  translate(x, 320);
  let buildingHeight = buildingHeights[i];
  rect(0, -buildingHeight / 2, 80, buildingHeight);
  for (let y = -buildingHeight + 10; y < 0; y += 10) {
    line(-40, y, 40, y);
  }
  pop();

  i++;
}

   }
}