p5.disableFriendlyErrors = true;

let bDoExportSvg = false;

let pointY = [];
let pointOffset = [];
let nodeSize = [];

let pointCount = 9;


function setup() {

  createCanvas(576, 384);

  noFill();
  stroke(0);
  strokeWeight(1);


  // create random values once
  for (let i = 0; i < pointCount; i++) {

    pointY[i] = random(80, height - 80);

    pointOffset[i] = random(-1, 1);

    nodeSize[i] = random(12, 26);

  }

}



function draw() {

  if (bDoExportSvg) {

    beginRecordSvg("random_flow_path.svg");

  }


  background(255);


  // mouseX controls horizontal spacing
  let spread = map(
    mouseX,
    0,
    width,
    35,
    65
  );


  // mouseY controls curve movement
  let movement = map(
    mouseY,
    0,
    height,
    10,
    70
  );


  // =========================
  // DRAW CURVE
  // =========================

  beginShape();


  for (let i = 0; i < pointCount; i++) {

    let x = 45 + i * spread;

    let y =
      pointY[i] +
      pointOffset[i] * movement;


    splineVertex(
      x,
      y
    );

  }


  endShape();



  // =========================
  // DRAW NODES
  // =========================

  for (let i = 1; i < pointCount; i += 2) {

    let x = 45 + i * spread;

    let y =
      pointY[i] +
      pointOffset[i] * movement;


    circle(
      x,
      y,
      nodeSize[i]
    );

  }



  // SVG EXPORT

  if (bDoExportSvg) {

    endRecordSvg();

    bDoExportSvg = false;

  }

}



function keyPressed() {

  if (key == 's' || key == 'S') {

    bDoExportSvg = true;

  }

}