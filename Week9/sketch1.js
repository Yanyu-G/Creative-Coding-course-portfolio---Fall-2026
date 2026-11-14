let handPose;
let video;
let hands = [];
let smoothPoints = [];

let fingerTips = [4, 8, 12, 16, 20];

let flowerX = 320;
let flowerY = 240;
let flowerSize = 65;
let bloom = 0;

let statusText = "Loading camera and hand tracking...";

async function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  try {
    handPose = await ml5.handPose({
      maxHands: 1,
      flipped: true
    });

    handPose.detectStart(video, gotHands);
    statusText = "Bring your hand into the camera";
  } catch (error) {
    statusText = "Hand tracking could not load. Please refresh.";
    console.error(error);
  }
}

function draw() {
  background(25);

  if (video && video.elt.readyState >= 2) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  }

  if (hands.length > 0 && hands[0].keypoints.length >= 21) {
    updateHand();
    drawFlower();
  } else {
    smoothPoints = [];
    bloom = 0;
  }

  noStroke();
  fill(0, 150);
  rect(0, height - 42, width, 42);

  fill(255);
  textSize(15);
  textAlign(CENTER, CENTER);

  if (hands.length > 0) {
    text(
      "Bring your fingertips together to close • Spread them to bloom",
      width / 2,
      height - 21
    );
  } else {
    text(statusText, width / 2, height - 21);
  }
}

function updateHand() {
  let points = hands[0].keypoints;
  let firstFrame = smoothPoints.length === 0;

  for (let i = 0; i < points.length; i++) {
    if (smoothPoints[i] === undefined) {
      smoothPoints[i] = {
        x: points[i].x,
        y: points[i].y
      };
    }

    smoothPoints[i].x = lerp(
      smoothPoints[i].x,
      points[i].x,
      0.35
    );

    smoothPoints[i].y = lerp(
      smoothPoints[i].y,
      points[i].y,
      0.35
    );
  }

  let palmPoints = [0, 5, 9, 13, 17];
  let palmX = 0;
  let palmY = 0;

  for (let i = 0; i < palmPoints.length; i++) {
    palmX += smoothPoints[palmPoints[i]].x;
    palmY += smoothPoints[palmPoints[i]].y;
  }

  palmX /= palmPoints.length;
  palmY /= palmPoints.length;

  let palmWidth = dist(
    smoothPoints[5].x,
    smoothPoints[5].y,
    smoothPoints[17].x,
    smoothPoints[17].y
  );

  let palmLength = dist(
    smoothPoints[0].x,
    smoothPoints[0].y,
    smoothPoints[9].x,
    smoothPoints[9].y
  );

  let palmSize = max(palmWidth, palmLength, 20);

  let totalDistance = 0;
  let pairCount = 0;

  for (let i = 0; i < fingerTips.length; i++) {
    for (let j = i + 1; j < fingerTips.length; j++) {
      let first = smoothPoints[fingerTips[i]];
      let second = smoothPoints[fingerTips[j]];

      totalDistance += dist(
        first.x,
        first.y,
        second.x,
        second.y
      );

      pairCount++;
    }
  }

  let averageDistance = totalDistance / pairCount;
  let openness = averageDistance / palmSize;

  let targetBloom = constrain(
    map(openness, 0.45, 1.55, 0, 1),
    0,
    1
  );

  if (firstFrame) {
    flowerX = palmX;
    flowerY = palmY;
    flowerSize = constrain(palmSize * 0.85, 45, 110);
    bloom = targetBloom;
  } else {
    flowerX = lerp(flowerX, palmX, 0.3);
    flowerY = lerp(flowerY, palmY, 0.3);

    flowerSize = lerp(
      flowerSize,
      constrain(palmSize * 0.85, 45, 110),
      0.15
    );

    bloom = lerp(bloom, targetBloom, 0.12);
  }
}

function drawFlower() {
  push();
  translate(flowerX, flowerY);

  let size = flowerSize;

  stroke("#438653");
  strokeWeight(4);
  line(0, 0, 0, size * 0.75);

  noStroke();
  fill("#68AA68");

  push();
  translate(-size * 0.12, size * 0.5);
  rotate(-PI / 4);
  ellipse(0, 0, size * 0.18, size * 0.38);
  pop();

  push();
  translate(size * 0.12, size * 0.38);
  rotate(PI / 4);
  ellipse(0, 0, size * 0.18, size * 0.34);
  pop();

  for (let i = 0; i < 10; i++) {
    let angle = TWO_PI * i / 10 - HALF_PI;

    let closedX = sin(angle) * size * 0.06;
    let closedY = -size * 0.23;

    let openX = cos(angle) * size * 0.52;
    let openY = sin(angle) * size * 0.52;

    let petalX = lerp(closedX, openX, bloom);
    let petalY = lerp(closedY, openY, bloom);

    let petalWidth = lerp(size * 0.2, size * 0.38, bloom);
    let petalHeight = lerp(size * 0.58, size * 0.85, bloom);

    push();
    translate(petalX, petalY);
    rotate((angle + HALF_PI) * bloom);

    fill(i % 2 === 0 ? "#EE82AC" : "#F6A0BE");
    ellipse(0, 0, petalWidth, petalHeight);

    pop();
  }

  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5 - HALF_PI;

    let petalX = cos(angle) * size * 0.28 * bloom;
    let petalY = lerp(
      -size * 0.2,
      sin(angle) * size * 0.28,
      bloom
    );

    push();
    translate(petalX, petalY);
    rotate((angle + HALF_PI) * bloom);

    fill("#FFC3D7");

    ellipse(
      0,
      0,
      lerp(size * 0.14, size * 0.3, bloom),
      lerp(size * 0.47, size * 0.56, bloom)
    );

    pop();
  }

  fill("#4F985D");

  triangle(
    -size * 0.16, size * 0.08,
    -size * 0.21, -size * 0.12,
    0, size * 0.03
  );

  triangle(
    size * 0.16, size * 0.08,
    size * 0.21, -size * 0.12,
    0, size * 0.03
  );

  let centerSize = size * 0.32 * bloom;

  fill("#FFD45C");
  circle(0, 0, centerSize);

  fill("#C88B29");

  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;

    circle(
      cos(angle) * centerSize * 0.28,
      sin(angle) * centerSize * 0.28,
      size * 0.035 * bloom
    );
  }

  pop();
}

function gotHands(results) {
  hands = results;
}