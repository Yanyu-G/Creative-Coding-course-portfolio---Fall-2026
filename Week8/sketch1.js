function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
}

function draw() {
  background(0);

  loadPixels();

  let index = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      let r = 0;
      let g = sin(map(x,0+frameCount,height,0,PI*8))*255;
      let b = sin(map(y,0+frameCount,height,0,PI*8))*255;

      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;

      index += 4;
    }
  }

  updatePixels();
}