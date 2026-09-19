let buildingHeights = [];
let lastProgress = 0;

function setup() {
    createCanvas(windowWidth, 400);
    rectMode(CENTER);

    for (let i = 0; i < 20; i++) {
    buildingHeights[i] = random(50, 250);
    }
}

function draw() {
    background('#111827');

let progress = floor(map(mouseX, 0, width, 0, 20));

if (progress > lastProgress) {
        buildingHeights[progress - 1] = random(50, 250);
    }
    lastProgress = progress;


    for (let i = 0; i < progress; i++) {

        push();
          translate(i * 60 + 30, height);
          let buildingHeight = buildingHeights[i];
          rect(0, -buildingHeight / 2, 40, buildingHeight);
        pop();
    }
}