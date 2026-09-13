let x = 0;
function setup(){
    createCanvas(windowWidth, 500);
    background(color('#f6f7d7'));
    frameRate(5);
}
function draw(){
background(246, 247, 215, 30);
let buildX = mouseX + random(-50, 50);
let buildheight = height - mouseY + random(-50, 50);
let buildwidth = random(20, 80);
   let buildingColor = random([
    '#e8c07d',
    '#d9a273',
    '#c9b98b',
    '#b7c4a0',
    '#d6c6a5']);
fill(buildingColor);
stroke('#9e927d');
strokeWeight(1);
rect(buildX,height - buildheight,buildwidth,buildheight);
fill('#ffd460');
noStroke();

for (let y = height - buildheight + 20; y < height - 20; y += 30) 
{rect(buildX + 10, y, 8, 12);
if (buildwidth > 50) {
rect(buildX + 30, y, 8, 12);}}

if (random(1) > 0.7) {fill(buildingColor);
  rect(buildX + buildwidth / 3,height - buildheight - 15,buildwidth / 3,15);}
}