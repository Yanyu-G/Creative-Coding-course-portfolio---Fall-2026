
let handPose;
let video;
let hands = [];

async function setup() {
  createCanvas(640, 480);

  // Load HandPose model
  handPose = await ml5.handPose();

  // Create webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);

  // Draw hand keypoints
  for (let hand of hands) {
    for (let keypoint of hand.keypoints) {
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

// Update detected hands
function gotHands(results) {
  hands = results;
}
