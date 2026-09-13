let x = 0;
function setup(){
    createCanvas(500,500);
    background(color('#f6f7d7'));
    frameRate(2);
}
function draw(){
    if (x >= width) {
    x = 0;
    background('#f6f7d7');
}

let buildheight = random(100, 300);
let r = random(190, 230);
let g = random(170, 210);
let b = random(110, 150);
fill(r,g,b);
rect(x, height - buildheight, 100, buildheight);
x = x + 100
}