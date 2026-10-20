let frames = [];
let currentFrame = 0;
let playing = true;

async function setup() {
  const canvas = createCanvas(720, 480);
  canvas.parent("sketch");
  imageMode(CENTER);
  frameRate(8);
  background(0);

  for (let i = 1; i <= 6; i++) {
    frames.push(await loadImage("./rabbit/rabbitjump/rabbitjump" + i + ".png"));
  }
}

function draw() {
  background(0);

  if (frames.length < 6) {
    return;
  }

  image(frames[currentFrame], width / 2, height / 2, 420, 420);

  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("Space: pause / play", width / 2, height - 12);

  if (playing) {
    currentFrame = (currentFrame + 1) % frames.length;
  }
}

function keyPressed() {
  if (key === " ") {
    playing = !playing;
    return false;
  }
}
