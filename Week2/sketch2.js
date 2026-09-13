let x = 0;
function setup(){
    createCanvas(windowWidth, 500);
    background(color('#2d4059'));
    frameRate(10);
}
function draw(){
background(45, 64, 89, 60);
let lightSize = random(5, 30);
   fill(random([
    '#ffaaa5',
    '#ffd3b6',
    '#dcedc1',
    '#a8e6cf',
    '#cca8e9',
    '#c3bef0',
    '#cadefc',
    '#defcf9'
]));
    noStroke();
    rect(mouseX,mouseY,
        lightSize,
        lightSize
    );

let shapeType = floor(random(3));
 if (shapeType == 0) {
        rect(mouseX, mouseY, lightSize, lightSize);
    } else if (shapeType == 1) {
        circle(mouseX, mouseY, lightSize);
    } else {
        triangle(
            mouseX, mouseY - lightSize,
            mouseX - lightSize, mouseY + lightSize,
            mouseX + lightSize, mouseY + lightSize
        );

    }
}
