let osc1;
let osc2;

let onOff = 0;
let amp1 = 0;
let amp2 = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  osc1 = new p5.Oscillator("sine");
  osc1.freq(440);
  osc1.amp(0);
}

function draw() {
  background(0);

  if (onOff == 0) {
    amp1 = 0;
  } else {
    amp1 = 1;
  }

  osc1.amp(amp1, 0.1);

  fill(255);
  textSize(20);

  if (onOff == 1) {
    text("Playing", 20, 40);
  } else {
    text("Stopped", 20, 40);
  }
}

function keyPressed() {
  if (key == "p" || key == "P") {
    osc1.start();
  }
}

function mousePressed() {
  if (onOff == 0) {
    onOff = 1;
  } else {
    onOff = 0;
  }
}
