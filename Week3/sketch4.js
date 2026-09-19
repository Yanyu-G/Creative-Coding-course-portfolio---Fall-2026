let citySize = 40;
function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);
    stroke('#ffd166');
    strokeWeight(2);
    noFill();
    frameRate(25);
}

function draw() {
    background('#111827');

let targetSize = map(mouseX, 0, width, 20, 55);
    citySize = lerp(citySize, targetSize, 0.05);

    push();
    translate(width / 2, height / 2);
    for (let x = -210; x <= 210; x += 70) {
        for (let y = -210; y <= 210; y += 70) {
        rect(x, y, citySize, citySize);
        }
    }
    pop();
}