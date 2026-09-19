function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);
    stroke('#ffd166');
    strokeWeight(2);
    noFill();
}

function draw() {
    background('#111827');

    push();
    translate(width / 2, height / 2);
    for (let x = -210; x <= 210; x += 70) {
        for (let y = -210; y <= 210; y += 70) {
            rect(x, y, 45, 45);
        }
    }
    pop();
}