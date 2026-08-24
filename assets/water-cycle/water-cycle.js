// Water Cycle MicroSim — tap to advance through stages
let stage = 0;
let vapors = [];
let raindrops = [];
let cloudDarkness = 255;
let cloudSize = 1;
let waterLevelOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  initParticles();
}

function initParticles() {
  vapors = [];
  raindrops = [];
  for (let i = 0; i < 50; i++) {
    vapors.push({ x: random(width), y: random(height * 0.6, height), speed: random(1, 3) });
    raindrops.push({ x: random(width * 0.1, width * 0.9), y: random(height * 0.1, height * 0.6), speed: random(5, 10) });
  }
}

function draw() {
  drawLandscape();
  if (stage === 1) runEvaporation();
  if (stage === 2) runCondensation();
  if (stage === 3) runPrecipitation();
  if (stage === 4) runCollection();
  drawUI();
}

function drawLandscape() {
  background(135, 206, 235);
  noStroke();
  fill(255, 204, 0);
  let sunPulse = (stage === 1) ? sin(frameCount * 0.1) * 10 : 0;
  circle(width * 0.85, height * 0.15, (width * 0.15) + sunPulse);
  fill(34, 139, 34);
  triangle(-width * 0.2, height * 0.7, width * 0.3, height * 0.3, width * 0.6, height * 0.7);
  fill(46, 125, 50);
  triangle(width * 0.2, height * 0.7, width * 0.7, height * 0.2, width * 1.1, height * 0.7);
  fill(30, 144, 255, 220);
  let currentWaterY = (height * 0.7) - waterLevelOffset;
  rect(0, currentWaterY, width, height - currentWaterY);
  fill(cloudDarkness, cloudDarkness, cloudDarkness, 230);
  let cx = width * 0.5;
  let cy = height * 0.2;
  let cw = (width * 0.4) * cloudSize;
  let ch = (height * 0.15) * cloudSize;
  ellipse(cx, cy, cw, ch);
  ellipse(cx - cw * 0.3, cy + ch * 0.2, cw * 0.7, ch * 0.8);
  ellipse(cx + cw * 0.3, cy + ch * 0.2, cw * 0.7, ch * 0.8);
}

function runEvaporation() {
  fill(255, 255, 255, 150);
  noStroke();
  for (let v of vapors) {
    circle(v.x, v.y, width * 0.02);
    v.y -= v.speed;
    if (v.y < height * 0.2) {
      v.y = height * 0.7;
      v.x = random(width);
    }
  }
  cloudDarkness = lerp(cloudDarkness, 255, 0.05);
  cloudSize = lerp(cloudSize, 1, 0.05);
  waterLevelOffset = lerp(waterLevelOffset, -10, 0.05);
}

function runCondensation() {
  cloudSize = lerp(cloudSize, 1.5, 0.02);
  cloudDarkness = lerp(cloudDarkness, 150, 0.02);
}

function runPrecipitation() {
  stroke(0, 0, 255, 150);
  strokeWeight(3);
  for (let r of raindrops) {
    line(r.x, r.y, r.x, r.y + 15);
    r.y += r.speed;
    if (r.y > height * 0.7) {
      r.y = height * 0.2;
      r.x = random(width * 0.2, width * 0.8);
    }
  }
  noStroke();
}

function runCollection() {
  waterLevelOffset = lerp(waterLevelOffset, 20, 0.02);
  cloudSize = lerp(cloudSize, 1, 0.02);
  cloudDarkness = lerp(cloudDarkness, 255, 0.02);
}

function drawUI() {
  fill(255, 255, 255, 240);
  rect(0, height * 0.75, width, height * 0.25);
  fill(0);
  noStroke();
  let titleSize = min(width * 0.06, 28);
  let textSizeVal = min(width * 0.045, 20);
  if (stage === 0) {
    textSize(titleSize);
    text('The Water Cycle', width / 2, height * 0.8);
    textSize(textSizeVal);
    text('Tap anywhere to begin the cycle.', width / 2, height * 0.88);
  } else if (stage === 1) {
    textSize(titleSize);
    text('1. Evaporation', width / 2, height * 0.8);
    textSize(textSizeVal);
    text('Heat turns water into invisible gas.\nThe water vapor rises up.', width / 2, height * 0.88);
  } else if (stage === 2) {
    textSize(titleSize);
    text('2. Condensation', width / 2, height * 0.8);
    textSize(textSizeVal);
    text('Cold air turns vapor back into water.\nClouds begin to form.', width / 2, height * 0.88);
  } else if (stage === 3) {
    textSize(titleSize);
    text('3. Precipitation', width / 2, height * 0.8);
    textSize(textSizeVal);
    text('Water gets heavy in the clouds.\nIt falls as rain or snow.', width / 2, height * 0.88);
  } else if (stage === 4) {
    textSize(titleSize);
    text('4. Collection', width / 2, height * 0.8);
    textSize(textSizeVal);
    text('Water gathers in oceans and lakes.\nThe cycle is ready to start again!', width / 2, height * 0.88);
  }
  fill(100);
  textSize(min(width * 0.035, 14));
  text('Tap screen for next step', width / 2, height * 0.97);
}

function advanceStage() {
  stage++;
  if (stage > 4) stage = 1;
}

function mouseReleased() {
  advanceStage();
  return false;
}

function touchEnded() {
  advanceStage();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initParticles();
}
