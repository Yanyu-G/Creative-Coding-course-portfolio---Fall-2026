let frames = [];
let leftFrames = [];
let rightFrames = [];
let leftPose;
let rightPose;
let currentFrame = 0;
let playing = true;
let ready = false;
let rabbitX = 360;
let direction = "front";
let lastAction = "";
let animationTime = 0;

async function setup() {
  const canvas = createCanvas(720, 480);
  canvas.parent("sketch");
  imageMode(CENTER);
  background(255);

  for (let i = 1; i <= 6; i++) {
    frames.push(await loadImage("./rabbit/rabbitjump/rabbitjump" + i + ".png"));
  }

  leftPose = await loadImage("./rabbit/rabbitleft/rabbitleft.png");
  rightPose = await loadImage("./rabbit/rabbitright/rabbitright.png");

  for (let i = 1; i <= 4; i++) {
    leftFrames.push(await loadImage("./rabbit/rabbitleftjump/rabbitleftjump" + i + ".png"));
    rightFrames.push(await loadImage("./rabbit/rabbitrightjump/rabbitrightjump" + i + ".png"));
  }

  ready = true;
}

function draw() {
  background(255);

  if (!ready) {
    return;
  }

  let move = 0;
  if (keyIsDown("ArrowLeft")) move -= 1;
  if (keyIsDown("ArrowRight")) move += 1;

  if (playing) {
    if (move === -1) direction = "left";
    if (move === 1) direction = "right";

    let action = direction;
    if (move !== 0) action += "jump";

    if (action !== lastAction) {
      currentFrame = 0;
      animationTime = 0;
      lastAction = action;
    }
  }

  let sequence = frames;
  if (direction === "left") sequence = [leftPose, ...leftFrames];
  if (direction === "right") sequence = [rightPose, ...rightFrames];

  image(sequence[currentFrame], rabbitX, height / 2, 420, 420);

  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("Left / Right: move   |   Up: jump in place   |   Space: pause / play", width / 2, height - 12);

  if (playing) {
    let stepTime = Math.min(deltaTime, 50);
    rabbitX = constrain(rabbitX + move * 140 * stepTime / 1000, 210, width - 210);

    if (direction === "front" || move !== 0) {
      animationTime += stepTime;
      if (animationTime >= 125) {
        animationTime -= 125;
        currentFrame++;
        if (currentFrame >= sequence.length) {
          currentFrame = direction === "front" ? 0 : 1;
        }
      }
    }
  }
}

function keyPressed() {
  if (key === " ") {
    playing = !playing;
    return false;
  }

  if (key === "ArrowUp" && playing) {
    direction = "front";
    currentFrame = 0;
    animationTime = 0;
    lastAction = "";
  }

  if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp") {
    return false;
  }
}
