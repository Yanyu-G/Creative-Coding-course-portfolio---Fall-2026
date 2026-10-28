let cam
let canv

async function setup() {
  createCanvas(640, 400);

  // cam = await createCapture(VIDEO,{flipped:true},camReady);

  pixelDensity(1);
}

// function camReady() {
//   print(cam.width, cam.height);

// }

function draw() {
  background(255);

  for (let y = 0; y < height / 8; y++) {
    for (let x = 0; x < width / 8; x++) {

      let alpha = map(y, 0, height / 8, 0, 255);

      tint(255, alpha);

      image(cam, x * 8, y * 8, 8, 8);
    }
  }

  noTint();
}

  
  updatePixels();