p5.disableFriendlyErrors = true;

let bDoExportSvg = false;


let lineX = [];
let lineY = [];
let lineAngle = [];

let lineCount = 18;


function setup() {

  createCanvas(576, 384);

  background(255);

  noFill();
  stroke(0);
  strokeWeight(1);



  for (let i = 0; i < lineCount; i++) {

    lineX[i] = random(40, width - 40);

    lineY[i] = random(40, height - 40);


    if (i % 3 == 0) {

      lineAngle[i] = random(-8, 8);

    }

    else if (i % 3 == 1) {

      lineAngle[i] = random(25, 50);

    }

    else {

      lineAngle[i] = random(-50, -25);

    }

  }

}



function draw() {

  if (bDoExportSvg) {

    beginRecordSvg("random_editorial_grid.svg");

  }


  background(255);

  let mouseAngle = map(
    mouseX,
    0,
    width,
    -12,
    12
  );

  let spread = map(
    mouseY,
    0,
    height,
    0.7,
    1.3
  );


  for (let i = 0; i < lineCount; i++) {

    push();


    let x = width / 2 +
            (lineX[i] - width / 2) * spread;

    let y = height / 2 +
            (lineY[i] - height / 2) * spread;


    translate(x, y);


    rotate(
      radians(
        lineAngle[i] + mouseAngle
      )
    );


    line(
      -350,
      0,
      350,
      0
    );


    pop();

  }




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