let backHeights = [];
let backWidths = [];

let middleHeights = [];
let middleWidths = [];

let frontHeights = [];
let frontWidths = [];

p5.disableFriendlyErrors = true;
let bDoExportSvg = false;

function setup() {

  createCanvas(576, 384);

  noFill();
  stroke(0);
  strokeWeight(1);

  rectMode(CENTER);

  for (let i = 0; i < 7; i++) {
    backHeights[i] = random(150, 250);
    backWidths[i] = random(35, 65);
  }



  for (let i = 0; i < 6; i++) {
    middleHeights[i] = random(110, 190);
    middleWidths[i] = random(45, 75);
  }


  for (let i = 0; i < 5; i++) {
    frontHeights[i] = random(70, 140);
    frontWidths[i] = random(55, 90);
  }
}



function draw() {

  if (bDoExportSvg) {
    beginRecordSvg("week4_city.svg");
  }

  background(255);

  let moveX = map(mouseX, 0, width, -20, 20);
  let moveY = map(mouseY, 0, height, -10, 10);



  let backI = 0;
  for (let x = 55; x < width - 30; x += 75) {

    push();
    translate(x + moveX * 0.3,300 + moveY * 0.3);
    let buildingHeight = backHeights[backI];
    let buildingWidth = backWidths[backI];
    let patternType = backI % 3;
    drawBuilding(buildingHeight,buildingWidth,patternType);
    pop();

    backI++;
  }


  let middleI = 0;
  for (let x = 70; x < width - 40; x += 85) {
    push();
    translate(x + moveX * 0.6,320 + moveY * 0.6);
    let buildingHeight = middleHeights[middleI];
    let buildingWidth = middleWidths[middleI];
    let patternType = (middleI + 1) % 3;
    drawBuilding(buildingHeight,buildingWidth,patternType);
    pop();

    middleI++;
  }


  let frontI = 0;
  for (let x = 85; x < width - 50; x += 100) {
    push();translate(x + moveX,340 + moveY);
    let buildingHeight = frontHeights[frontI];
    let buildingWidth = frontWidths[frontI];
    let patternType = (frontI + 2) % 3;
    drawBuilding(buildingHeight,buildingWidth,patternType);
    pop();

    frontI++;
  }

}


function drawBuilding(buildingHeight, buildingWidth, patternType) {
  rect(0,-buildingHeight / 2,buildingWidth,buildingHeight);

  if (patternType == 0) {
    for (let y = -buildingHeight + 10;
      y < 0;
      y += 10
    ) 
    {line(-buildingWidth / 2, y,buildingWidth / 2,y);}

  }

  else if (patternType == 1) {
    for (
      let xLine = -buildingWidth / 2 + 10;
      xLine < buildingWidth / 2;
      xLine += 10) {
      line(xLine,-buildingHeight,xLine,0);
    }
  }

else if (patternType == 2) {
    for (let xLine = -buildingWidth / 2 + 10; xLine < buildingWidth / 2; xLine += 10) {
      for (let y = -buildingHeight + 15; y < 0; y += 15) {
        line(xLine, y, xLine + 7, y - 7);
      }
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