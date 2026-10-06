let seed = 12;
let margin = 42;

function setup() {
  createCanvas(576, 576);   // 正方形画布
  noLoop();
  rectMode(CORNER);
  stroke(0);
  strokeWeight(1);
  noFill();
}

function draw() {
  background(255);

  randomSeed(seed);

  let cityX = margin;
  let cityY = margin;
  let cityW = width - margin * 2;
  let cityH = height - margin * 2;

  // 外框
  rect(cityX, cityY, cityW, cityH);
  rect(cityX - 6, cityY - 6, cityW + 12, cityH + 12);

  // 用 mouseX 控制街道宽度
  // 用 mouseY 控制建筑内部线条密度
  subdivideDistrict(cityX + 8, cityY + 8, cityW - 16, cityH - 16, 0);
}

// 递归切分大街区
function subdivideDistrict(x, y, w, h, depth) {
  let minSize = 82;
  let maxDepth = 4;
  let street = map(mouseX, 0, width, 6, 14);

  if (depth >= maxDepth || w < minSize || h < minSize) {
    fillBlockWithBuildings(x, y, w, h);
    return;
  }

  let splitVertical;

  if (w > h * 1.15) {
    splitVertical = true;
  } else if (h > w * 1.15) {
    splitVertical = false;
  } else {
    splitVertical = random() < 0.5;
  }

  if (splitVertical) {
    let split = random(0.35, 0.65) * w;

    let w1 = split - street / 2;
    let w2 = w - split - street / 2;

    if (w1 < 28 || w2 < 28) {
      fillBlockWithBuildings(x, y, w, h);
      return;
    }

    // 中间街道中心线
    line(x + split, y, x + split, y + h);

    subdivideDistrict(x, y, w1, h, depth + 1);
    subdivideDistrict(x + split + street / 2, y, w2, h, depth + 1);

  } else {
    let split = random(0.35, 0.65) * h;

    let h1 = split - street / 2;
    let h2 = h - split - street / 2;

    if (h1 < 28 || h2 < 28) {
      fillBlockWithBuildings(x, y, w, h);
      return;
    }

    // 中间街道中心线
    line(x, y + split, x + w, y + split);

    subdivideDistrict(x, y, w, h1, depth + 1);
    subdivideDistrict(x, y + split + street / 2, w, h2, depth + 1);
  }
}

// 在每个街区里填入建筑
function fillBlockWithBuildings(x, y, w, h) {
  rect(x, y, w, h);

  let inner = 4;
  x += inner;
  y += inner;
  w -= inner * 2;
  h -= inner * 2;

  if (w < 18 || h < 18) return;

  let cols = floor(random(2, 6));
  let rows = floor(random(2, 6));

  let gap = 3;
  let cellW = w / cols;
  let cellH = h / rows;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      // 留出少量空地，让画面有呼吸感
      if (random() < 0.10) continue;

      let bx = x + i * cellW + gap;
      let by = y + j * cellH + gap;
      let bw = cellW - gap * 2;
      let bh = cellH - gap * 2;

      bw *= random(0.75, 1.0);
      bh *= random(0.75, 1.0);

      drawBuilding(bx, by, bw, bh);
    }
  }
}

// 单个建筑
function drawBuilding(x, y, w, h) {
  if (w < 8 || h < 8) return;

  rect(x, y, w, h);

  // 内轮廓线，让结构更复杂
  if (w > 14 && h > 14 && random() < 0.75) {
    rect(x + 2, y + 2, w - 4, h - 4);
  }

  if (w > 20 && h > 20 && random() < 0.35) {
    rect(x + 4, y + 4, w - 8, h - 8);
  }

  let density = floor(map(mouseY, 0, height, 3, 10));
  let mode = floor(random(4));

  if (mode === 0) {
    hatchHorizontal(x, y, w, h, density);
  } else if (mode === 1) {
    hatchVertical(x, y, w, h, density);
  } else if (mode === 2) {
    hatchDiagonalA(x, y, w, h, density);
  } else {
    hatchDiagonalB(x, y, w, h, density);
  }

  // 偶尔加一条中轴线，增加城市感
  if (random() < 0.3) {
    line(x + w / 2, y, x + w / 2, y + h);
  }

  if (random() < 0.3) {
    line(x, y + h / 2, x + w, y + h / 2);
  }
}

// 横向纹理
function hatchHorizontal(x, y, w, h, n) {
  let step = max(3, h / n);
  for (let yy = y + step; yy < y + h; yy += step) {
    line(x, yy, x + w, yy);
  }
}

// 竖向纹理
function hatchVertical(x, y, w, h, n) {
  let step = max(3, w / n);
  for (let xx = x + step; xx < x + w; xx += step) {
    line(xx, y, xx, y + h);
  }
}

// 左上到右下斜线
function hatchDiagonalA(x, y, w, h, n) {
  let step = max(4, min(w, h) / n);

  for (let i = -h; i < w; i += step) {
    let x1 = x + max(i, 0);
    let y1 = y + max(-i, 0);
    let x2 = x + min(i + h, w);
    let y2 = y + min(h + i, h);
    line(x1, y1, x2, y2);
  }
}

// 右上到左下斜线
function hatchDiagonalB(x, y, w, h, n) {
  let step = max(4, min(w, h) / n);

  for (let i = 0; i < w + h; i += step) {
    let x1 = x + max(i - h, 0);
    let y1 = y + min(i, h);
    let x2 = x + min(i, w);
    let y2 = y + max(i - w, 0);
    line(x1, y1, x2, y2);
  }
}

// 移动鼠标时刷新
function mouseMoved() {
  redraw();
}

// 点击鼠标换一个新版本
function mousePressed() {
  seed++;
  redraw();
}

// 按 S 保存图片（先保存 png）
// 如果你已经接了 svg 导出库，也可以再改成 svg 保存
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('dense_urban_field', 'png');
  }

  if (key === 'r' || key === 'R') {
    seed++;
    redraw();
  }
}