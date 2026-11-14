let handPose;
let video;
let hands = [];

let fingerTips = [4, 8, 12, 16, 20];
let flowers = [];

let statusText = "Loading camera and hand tracking...";

async function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  try {
    handPose = await ml5.handPose({
      maxHands: 2,
      flipped: true
    });

    handPose.detectStart(video, gotHands);
    statusText = "Bring your hands into the camera";
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

  let detectedHands = [];

  for (let i = 0; i < hands.length; i++) {
    if (hands[i].keypoints.length >= 21) {
      detectedHands.push(hands[i]);
    }
  }

  let previousFlowers = flowers.slice();
  let nextFlowers = [];

  if (detectedHands.length === 2 && previousFlowers.length === 2) {
    let firstWrist = detectedHands[0].keypoints[0];
    let secondWrist = detectedHands[1].keypoints[0];

    let sameOrder =
      dist(
        firstWrist.x,
        firstWrist.y,
        previousFlowers[0].wristX,
        previousFlowers[0].wristY
      ) +
      dist(
        secondWrist.x,
        secondWrist.y,
        previousFlowers[1].wristX,
        previousFlowers[1].wristY
      );

    let swappedOrder =
      dist(
        firstWrist.x,
        firstWrist.y,
        previousFlowers[1].wristX,
        previousFlowers[1].wristY
      ) +
      dist(
        secondWrist.x,
        secondWrist.y,
        previousFlowers[0].wristX,
        previousFlowers[0].wristY
      );

    if (swappedOrder < sameOrder) {
      previousFlowers.reverse();
    }
  }

  for (let i = 0; i < detectedHands.length; i++) {
    let hand = detectedHands[i];
    let flower;

    if (detectedHands.length === 2 && previousFlowers.length === 2) {
      flower = previousFlowers[i];
    } else {
      let closestIndex = -1;
      let closestDistance = Infinity;
      let wrist = hand.keypoints[0];

      for (let j = 0; j < previousFlowers.length; j++) {
        let distance = dist(
          wrist.x,
          wrist.y,
          previousFlowers[j].wristX,
          previousFlowers[j].wristY
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = j;
        }
      }

      if (closestIndex !== -1) {
        flower = previousFlowers.splice(closestIndex, 1)[0];
      }
    }

    if (!flower) {
      flower = {
        points: [],
        x: 320,
        y: 240,
        size: 65,
        bloom: 0,
        wristX: hand.keypoints[0].x,
        wristY: hand.keypoints[0].y
      };
    }

    updateHand(hand, flower);
    nextFlowers.push(flower);
  }

  flowers = nextFlowers;

  for (let i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i]);
  }

  noStroke();
  fill(0, 150);
  rect(0, height - 42, width, 42);

  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);

  if (flowers.length > 0) {
    text(
      "Close your fingertips to close the flowers • Spread them to bloom",
      width / 2,
      height - 21
    );
  } else {
    text(statusText, width / 2, height - 21);
  }
}

function updateHand(hand, flower) {
  let points = hand.keypoints;
  let firstFrame = flower.points.length === 0;

  for (let i = 0; i < points.length; i++) {
    if (flower.points[i] === undefined) {
      flower.points[i] = {
        x: points[i].x,
        y: points[i].y
      };
    }

    flower.points[i].x = lerp(
      flower.points[i].x,
      points[i].x,
      0.35
    );

    flower.points[i].y = lerp(
      flower.points[i].y,
      points[i].y,
      0.35
    );
  }

  flower.wristX = points[0].x;
  flower.wristY = points[0].y;

  let smoothPoints = flower.points;
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

  let targetSize = constrain(palmSize * 0.85, 45, 110);

  if (firstFrame) {
    flower.x = palmX;
    flower.y = palmY;
    flower.size = targetSize;
    flower.bloom = targetBloom;
  } else {
    flower.x = lerp(flower.x, palmX, 0.3);
    flower.y = lerp(flower.y, palmY, 0.3);
    flower.size = lerp(flower.size, targetSize, 0.15);
    flower.bloom = lerp(flower.bloom, targetBloom, 0.12);
  }
}

function drawFlower(flower) {
  push();
  translate(flower.x, flower.y);

  let size = flower.size;
  let bloom = flower.bloom;

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