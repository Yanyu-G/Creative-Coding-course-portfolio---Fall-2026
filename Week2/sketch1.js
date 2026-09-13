let x = 0;
function setup(){
    createCanvas(windowWidth, 500);
    background(color('#f6f7d7'));
    frameRate(2);
}
function draw(){
    if (x >= width) {
    x = 0;
    background('#f6f7d7');
}

let buildheight = random(100, 450);
let buildwidth = random(60, 120);
let buildingColor = random([
    '#e8c07d',
    '#d9a273',
    '#c9b98b',
    '#b7c4a0',
    '#d6c6a5'
]);
stroke('#9e927d');
strokeWeight(1);
fill(buildingColor);
rect(x, height - buildheight, buildwidth, buildheight);
x = x + 60
}