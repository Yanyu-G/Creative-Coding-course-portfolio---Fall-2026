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

  push();
  translate(x, 320);
  let buildingHeight = buildingHeights[i];
  let buildingWidth = 80;
  rect(0,-buildingHeight / 2,buildingWidth,buildingHeight);
  
  let patternType = i % 3;

    if (patternType == 0) {
      for (let y = -buildingHeight + 10; y < 0; y += 10) {
        line(-buildingWidth / 2,y,buildingWidth / 2,y);}}

    else if (patternType == 1) {
    for (let xLine = -buildingWidth / 2 + 10;xLine < buildingWidth / 2;xLine += 10) {
       line(xLine,-buildingHeight,xLine,0);}}

    else if (patternType == 2) {
    for (let xLine = -buildingWidth / 2 + 10;xLine < buildingWidth / 2 - 5;xLine += 10) {
    for (let y = -buildingHeight + 15;y < 0;y += 15) {
       line(xLine,y,xLine + 7,y - 7);}}

    }

    pop();
    i++;

  }

}