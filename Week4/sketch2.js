p5.disableFriendlyErrors = true;

let bDoExportSvg = false;

let xOffset = [];
let yOffset = [];

let cols = 9;
let rows = 6;

let spacing = 55;
let margin = 55;


function setup() {

  createCanvas(576, 384);

  background(255);

  noFill();
  stroke(0);
  strokeWeight(1);


  for (let i = 0; i < cols; i++) {

    xOffset[i] = [];
    yOffset[i] = [];

    for (let j = 0; j < rows; j++) {

      xOffset[i][j] = random(-1, 1);

      yOffset[i][j] = random(-1, 1);

    }

  }

}



function draw() {

  if (bDoExportSvg) {

    beginRecordSvg("random_territories.svg");

  }


  background(255);


  let distortion = map(
    mouseX,
    0,
    width,
    0,
    25
  );


  for (let i = 0; i < cols - 1; i++) {

    for (let j = 0; j < rows; j++) {


      let x1 =
        margin +
        i * spacing +
        xOffset[i][j] * distortion;


      let y1 =
        margin +
        j * spacing +
        yOffset[i][j] * distortion;


      let x2 =
        margin +
        (i + 1) * spacing +
        xOffset[i + 1][j] * distortion;


      let y2 =
        margin +
        j * spacing +
        yOffset[i + 1][j] * distortion;


      line(
        x1,
        y1,
        x2,
        y2
      );

    }

  }


  for (let i = 0; i < cols; i++) {

    for (let j = 0; j < rows - 1; j++) {


      let x1 =
        margin +
        i * spacing +
        xOffset[i][j] * distortion;


      let y1 =
        margin +
        j * spacing +
        yOffset[i][j] * distortion;


      let x2 =
        margin +
        i * spacing +
        xOffset[i][j + 1] * distortion;


      let y2 =
        margin +
        (j + 1) * spacing +
        yOffset[i][j + 1] * distortion;


      line(
        x1,
        y1,
        x2,
        y2
      );

    }

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