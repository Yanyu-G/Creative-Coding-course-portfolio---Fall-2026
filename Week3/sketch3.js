function setup() {
    createCanvas(500, 500);
    rectMode(CENTER);
    angleMode(DEGREES);
    stroke('#ffd166');
    strokeWeight(2);
    noFill();
     frameRate(6);
}

function draw() {
    background('#111827');

    push();
    translate(width / 2, height / 2);
    rect(0, 0, 200, 200);

    for (let x = -80; x <= 80; x += 40) 
        {
         let buildingHeight = random(20, 60);
         rect(x,-100 - buildingHeight / 2,25,buildingHeight);
        }
    pop();

    push();
    translate(width / 2, height / 2);
    rotate(90);
    for (let x = -80; x <= 80; x += 40) 
        {
         let buildingHeight = random(20, 60);
         rect(x,-100 - buildingHeight / 2,25,buildingHeight);
        }
    pop();

    push();
    translate(width / 2, height / 2);
    rotate(-90);
    for (let x = -80; x <= 80; x += 40) 
        {
         let buildingHeight = random(20, 60);
         rect(x,-100 - buildingHeight / 2,25,buildingHeight);
        }
    pop();

    push();
    translate(width / 2, height / 2);
    rotate(180);
    for (let x = -80; x <= 80; x += 40) 
        {
         let buildingHeight = random(20, 60);
         rect(x,-100 - buildingHeight / 2,25,buildingHeight);
        }
    pop();
}