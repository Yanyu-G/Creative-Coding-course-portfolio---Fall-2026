p5.disableFriendlyErrors = true;

let bDoExportSvg = false;

let seed = 12;
let margin = 45;


function setup() {

  createCanvas(576, 576);

  noFill();
  stroke(0);
  strokeWeight(1);

}


function draw() {

  // ------------------------------
  // START SVG RECORDING
  // ------------------------------
  if (bDoExportSvg) {

    beginRecordSvg("dense_urban_field.svg");

  }


  background(255);

  randomSeed(seed);

  let cityX = margin;
  let cityY = margin;

  let cityW = width - margin * 2;
  let cityH = height - margin * 2;


  // 外部边框
  rect(cityX, cityY, cityW, cityH);


  // 城市主体
  subdivideDistrict(
    cityX + 8,
    cityY + 8,
    cityW - 16,
    cityH - 16,
    0
  );


  // ------------------------------
  // END SVG RECORDING
  // ------------------------------
  if (bDoExportSvg) {

    endRecordSvg();

    bDoExportSvg = false;

  }

}



function subdivideDistrict(x, y, w, h, depth) {

  let minSize = 85;

  let maxDepth = 4;


  // mouseX 控制街道宽度
  let street = map(
    mouseX,
    0,
    width,
    5,
    14
  );


  // 如果区域太小
  // 就停止切割，开始生成建筑

  if (
    depth >= maxDepth ||
    w < minSize ||
    h < minSize
  ) {

    fillBlockWithBuildings(
      x,
      y,
      w,
      h
    );

    return;

  }



  let splitVertical;


  // 根据长宽比例决定切割方向

  if (w > h * 1.2) {

    splitVertical = true;

  }

  else if (h > w * 1.2) {

    splitVertical = false;

  }

  else {

    splitVertical = random() < 0.5;

  }



  // ------------------------
  // VERTICAL SPLIT
  // ------------------------

  if (splitVertical) {

    let split =
      random(0.35, 0.65) * w;


    let w1 =
      split - street / 2;

    let w2 =
      w - split - street / 2;


    if (
      w1 < 30 ||
      w2 < 30
    ) {

      fillBlockWithBuildings(
        x,
        y,
        w,
        h
      );

      return;

    }


    // 街道中心线

    line(
      x + split,
      y,
      x + split,
      y + h
    );


    subdivideDistrict(

      x,
      y,

      w1,
      h,

      depth + 1

    );


    subdivideDistrict(

      x + split + street / 2,
      y,

      w2,
      h,

      depth + 1

    );

  }


  // ------------------------
  // HORIZONTAL SPLIT
  // ------------------------

  else {

    let split =
      random(0.35, 0.65) * h;


    let h1 =
      split - street / 2;

    let h2 =
      h - split - street / 2;


    if (
      h1 < 30 ||
      h2 < 30
    ) {

      fillBlockWithBuildings(
        x,
        y,
        w,
        h
      );

      return;

    }


    line(
      x,
      y + split,
      x + w,
      y + split
    );


    subdivideDistrict(

      x,
      y,

      w,
      h1,

      depth + 1

    );


    subdivideDistrict(

      x,
      y + split + street / 2,

      w,
      h2,

      depth + 1

    );

  }

}




function fillBlockWithBuildings(x, y, w, h) {

  // 街区外框

  rect(
    x,
    y,
    w,
    h
  );


  let padding = 5;


  x += padding;
  y += padding;

  w -= padding * 2;
  h -= padding * 2;


  if (
    w < 20 ||
    h < 20
  ) {

    return;

  }



  // 每个 block 内有很多小建筑

  let cols =
    floor(random(2, 6));

  let rows =
    floor(random(2, 6));


  let cellW =
    w / cols;

  let cellH =
    h / rows;


  for (
    let i = 0;
    i < cols;
    i++
  ) {

    for (
      let j = 0;
      j < rows;
      j++
    ) {


      // 偶尔留下空地
      if (random() < 0.08) {

        continue;

      }


      let gap = 3;


      let bx =
        x +
        i * cellW +
        gap;

      let by =
        y +
        j * cellH +
        gap;


      let bw =
        cellW -
        gap * 2;

      let bh =
        cellH -
        gap * 2;


      // 让建筑大小不是完全一样

      bw *= random(
        0.75,
        1
      );

      bh *= random(
        0.75,
        1
      );


      drawBuilding(
        bx,
        by,
        bw,
        bh
      );

    }

  }

}




function drawBuilding(x, y, w, h) {

  if (
    w < 7 ||
    h < 7
  ) {

    return;

  }


  // 建筑外轮廓

  rect(
    x,
    y,
    w,
    h
  );



  // ------------------------
  // INTERNAL RECTANGLES
  // ------------------------

  if (
    w > 15 &&
    h > 15
  ) {

    rect(
      x + 2,
      y + 2,
      w - 4,
      h - 4
    );

  }


  if (
    w > 24 &&
    h > 24 &&
    random() < 0.5
  ) {

    rect(
      x + 5,
      y + 5,
      w - 10,
      h - 10
    );

  }



  // mouseY 控制内部线条数量

  let density =
    floor(
      map(
        mouseY,
        0,
        height,
        3,
        12
      )
    );


  let pattern =
    floor(random(4));


  if (pattern == 0) {

    hatchHorizontal(
      x,
      y,
      w,
      h,
      density
    );

  }


  else if (pattern == 1) {

    hatchVertical(
      x,
      y,
      w,
      h,
      density
    );

  }


  else if (pattern == 2) {

    hatchDiagonalA(
      x,
      y,
      w,
      h,
      density
    );

  }


  else {

    hatchDiagonalB(
      x,
      y,
      w,
      h,
      density
    );

  }



  // 有些建筑加入十字结构

  if (random() < 0.35) {

    line(
      x + w / 2,
      y,
      x + w / 2,
      y + h
    );

  }


  if (random() < 0.35) {

    line(
      x,
      y + h / 2,
      x + w,
      y + h / 2
    );

  }

}



// =======================================
// HORIZONTAL HATCH
// =======================================

function hatchHorizontal(
  x,
  y,
  w,
  h,
  density
) {

  let spacing =
    max(
      3,
      h / density
    );


  for (
    let yy = y + spacing;
    yy < y + h;
    yy += spacing
  ) {

    line(
      x,
      yy,
      x + w,
      yy
    );

  }

}



// =======================================
// VERTICAL HATCH
// =======================================

function hatchVertical(
  x,
  y,
  w,
  h,
  density
) {

  let spacing =
    max(
      3,
      w / density
    );


  for (
    let xx = x + spacing;
    xx < x + w;
    xx += spacing
  ) {

    line(
      xx,
      y,
      xx,
      y + h
    );

  }

}



// =======================================
// DIAGONAL /
// =======================================

function hatchDiagonalA(
  x,
  y,
  w,
  h,
  density
) {

  let spacing =
    max(
      4,
      min(w, h) / density
    );


  for (
    let i = -h;
    i < w;
    i += spacing
  ) {


    let x1 =
      x + max(i, 0);

    let y1 =
      y + max(-i, 0);


    let x2 =
      x + min(i + h, w);

    let y2 =
      y + min(h + i, h);


    line(
      x1,
      y1,
      x2,
      y2
    );

  }

}



// =======================================
// DIAGONAL \
// =======================================

function hatchDiagonalB(
  x,
  y,
  w,
  h,
  density
) {

  let spacing =
    max(
      4,
      min(w, h) / density
    );


  for (
    let i = 0;
    i < w + h;
    i += spacing
  ) {


    let x1 =
      x + max(i - h, 0);

    let y1 =
      y + min(i, h);


    let x2 =
      x + min(i, w);

    let y2 =
      y + max(i - w, 0);


    line(
      x1,
      y1,
      x2,
      y2
    );

  }

}



// =======================================
// INTERACTION
// =======================================

function mousePressed() {

  seed++;

}


function keyPressed() {

  // S = export SVG

  if (
    key == 's' ||
    key == 'S'
  ) {

    bDoExportSvg = true;

  }


  // R = new random city

  if (
    key == 'r' ||
    key == 'R'
  ) {

    seed++;

  }

}