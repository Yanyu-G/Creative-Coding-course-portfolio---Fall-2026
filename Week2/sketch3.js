let x = 0;
function setup(){
    createCanvas(windowWidth, 500);
    background(color('#f6f7d7'));
    frameRate(5);
}
function draw(){
let buildheight = random(100, 450);

rect(mouseX,height - buildheight,50,buildheight);
   let buildingColor = random([
    '#e8c07d',
    '#d9a273',
    '#c9b98b',
    '#b7c4a0',
    '#d6c6a5']);
fill(buildingColor);
stroke('#9e927d');
strokeWeight(1);
}