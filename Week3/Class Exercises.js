let y = 0;
let r = 0;
let lerpedMouseX =0, lerpedMouseY =0;

function setup(){
    createCanvas(500,500)
    
    rectMode(CENTER)
    angleMode(DEGREES)

    stroke(255)
    strokeWeight(2)
    noFill()   
}

function draw(){
background(0);

lerpedMouseX = lerp(lerpedMouseX, mouseX, 0.05)
lerpedMouseY = lerp(lerpedMouseY, mouseY, 0.05)
r = lerpedMouseX / 5;

push();
translate(width/2, height/2);
circle(0, 0, 20);
rotate(r);

line(0, 0, 80, 0);
rect(80, 0, 20, 20);

translate(80, 0);
rotate(r);

line(0, 0, 80, 0);
rect(80, 0, 20, 20);

translate(80, 0);
rotate(r);

line(0, 0, 80, 0);
rect(80, 0, 20, 20);


pop();



}