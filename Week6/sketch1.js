let treeX = [];
let treeHeights = [];
let treeWidths = [];
let treeSpeeds = [];

function setup() {
  const canvas = createCanvas(720, 480);
  canvas.parent("sketch");

  for (let i = 0; i < 18; i++) {
    treeX[i] = (i % 9) * 100 - 80;
    treeHeights[i] = random(110, 190);
    treeWidths[i] = random(60, 95);
    treeSpeeds[i] = 0.6;

    if (i >= 9) {
      treeHeights[i] = random(160, 250);
      treeWidths[i] = random(85, 120);
      treeSpeeds[i] = 1.2;
    }
  }
}

function draw() {
  background(235, 245, 240);
  noStroke();

  fill(163, 192, 137);
  rect(0, 340, width, height - 340);

  for (let i = 0; i < treeX.length; i++) {
    let groundY = 355;
    let leafColor = color(112, 157, 117);

    if (i >= 9) {
      groundY = 420;
      leafColor = color(48, 112, 76);
    }

    let topY = groundY - treeHeights[i];

    fill(112, 83, 60);
    rect(treeX[i] - 7, topY + 35, 14, treeHeights[i] - 35);

    fill(leafColor);
    triangle(
      treeX[i], topY,
      treeX[i] - treeWidths[i] / 2, groundY - 70,
      treeX[i] + treeWidths[i] / 2, groundY - 70
    );
    triangle(
      treeX[i], topY - 25,
      treeX[i] - treeWidths[i] / 2.5, groundY - 115,
      treeX[i] + treeWidths[i] / 2.5, groundY - 115
    );

    treeX[i] -= treeSpeeds[i];

    if (treeX[i] < -100) {
      treeX[i] += 900;
    }
  }
}
