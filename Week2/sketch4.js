let x = 0;
function setup(){
    createCanvas(windowWidth, 500);
    background(color('#111827'));
    frameRate(10);
}
function draw() {
for (let x = 0; x < width; x += 60) 
{let buildingHeight =220 + sin(frameCount * 0.05 + x * 0.02) * 100;
fill('#243447');
noStroke();
rect(x,height - buildingHeight,50,buildingHeight);
for (let y = height - buildingHeight + 20; y < height - 20; y += 30) {
  fill('#ffd166');
  noStroke()
  rect(x + 10, y, 8, 12);
  rect(x + 30, y, 8, 12);}
}
}