function setup() {
  createCanvas(windowWidth, 400);
  rectMode(CENTER);
}

function draw() {
  background('#111827')

  let progress = map(mouseX, 0, width, 0, 10);

  for (let i = 0; i < progress; i++) {

    push();
    translate(i * 60 + 30, height);
    rect(0, -50, 40, 100);
    pop();
    
  }
}