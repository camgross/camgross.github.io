// Plinko Board of Learner Friction - MicroSim
// Narrow and tall board; first peg just off center (kicks ball left/right); randomizes on Reset.
// Ball contacts several pegs on each drop.

const boardWidth = 480;   // scaled up for readable slot text
const drawHeight = 840;   // tall
const controlHeight = 100;   // more room for buttons and spacing
const canvasHeight = drawHeight + controlHeight;
const margin = 25;
const defaultTextSize = 18;

// Peg and ball (scaled for larger board)
const pegRadius = 20;
const ballRadius = 14;
const gravity = 0.25;
let pegs = [];  // { xFrac, y, label }; pegs[0] is first peg (randomized on Reset)
let ball = { x: 0, y: 0, vx: 0, vy: 0 };
let ballLanded = false;
let outcomeSlot = -1;
const slotLabels = ['Never tested', 'Partially tested', 'Credentialed', 'Partially tested', 'Never tested'];
// Display labels with explicit line breaks so they fit in narrow slots (no overlap/truncation)
const slotLabelsDisplay = ['Never\ntested', 'Partial\ntested', 'Credentialed', 'Partial\ntested', 'Never\ntested'];
// Slot width fractions (sum = 1); Credentialed gets 50% so each drop ≈50% credentialed outcome
const slotWidthFractions = [0.125, 0.125, 0.5, 0.125, 0.125];
const slotZoneTop = drawHeight - 120;  // last 120px for slots (room for labels)

let dropButton, resetButton;

// Outcome display box (empty zone on board: center, between peg rows)
const outcomeBoxX = boardWidth * 0.15;
const outcomeBoxY = 388;
const outcomeBoxW = boardWidth * 0.7;
const outcomeBoxH = 64;

// Confetti for Credentialed outcome
let confettiParticles = [];
const confettiLifetime = 180;  // frames (~3 s at 60fps)

function setup() {
  const canvas = createCanvas(boardWidth, canvasHeight);
  const mainElement = document.querySelector('main');
  if (mainElement) canvas.parent(mainElement);

  initPegs();
  randomizeFirstPeg();
  randomizeCenterLifeDisruptionPegs();
  resetBall();

  // Center both buttons under the Credentialed (center) outcome
  dropButton = createButton('Intent');
  const intentW = 72;
  const resetW = 58;
  const buttonGap = 14;
  const buttonGroupWidth = intentW + buttonGap + resetW;
  const buttonLeftX = (boardWidth - buttonGroupWidth) / 2;
  dropButton.position(buttonLeftX, drawHeight + 45);
  dropButton.mousePressed(releaseBall);

  resetButton = createButton('Reset');
  resetButton.position(buttonLeftX + intentW + buttonGap, drawHeight + 45);
  resetButton.mousePressed(handleReset);

  describe('Plinko board of learner friction: narrow tall board; drop a ball (learner) through labeled pegs; it lands in one of five slots. First peg randomizes on Reset.');
}

function initPegs() {
  // First peg (pegs[0]): single peg at top, just off center — position/label set in randomizeFirstPeg()
  pegs = [
    { xFrac: 0.55, y: 112, label: 'Family life' },   // default; randomized on Reset
    // Row 1
    { xFrac: 0.25, y: 225, label: 'Life disruption' },
    { xFrac: 0.75, y: 225, label: 'Life disruption' },
    // Row 2
    { xFrac: 0.2, y: 375, label: 'Learning disabilities' },
    { xFrac: 0.5, y: 375, label: 'Life disruption' },
    { xFrac: 0.8, y: 375, label: 'Subject difficulty' },
    // Row 3
    { xFrac: 0.3, y: 525, label: 'Self doubt' },
    { xFrac: 0.7, y: 525, label: 'Self doubt' },
    // Row 4
    { xFrac: 0.25, y: 660, label: 'Performance discouragement' },
    { xFrac: 0.75, y: 660, label: 'Performance discouragement' }
  ];
}

const pegWidthFrac = (pegRadius * 2) / boardWidth;  // one peg width as fraction of board
const minPegDistance = (pegRadius * 2) * 2;  // 2 peg widths in pixels

function pegDistancePx(pegA, pegB) {
  const xA = pegA.xFrac * boardWidth;
  const xB = pegB.xFrac * boardWidth;
  const yA = pegA.y !== undefined ? pegA.y : 0;
  const yB = pegB.y;
  return Math.sqrt((xA - xB) ** 2 + (yA - yB) ** 2);
}

function isAtLeast2PegWidthsFromAll(pegIndex, xFrac, y, excludeIndices = [], extraPositions = []) {
  const proposed = { xFrac, y };
  for (let i = 0; i < pegs.length; i++) {
    if (i === pegIndex || excludeIndices.includes(i)) continue;
    if (pegDistancePx(proposed, pegs[i]) < minPegDistance) return false;
  }
  for (const pos of extraPositions) {
    if (pegDistancePx(proposed, pos) < minPegDistance) return false;
  }
  return true;
}

function randomizeFirstPeg() {
  pegs[0].label = random(['Family life', 'Life disruption']);
  const centerX = boardWidth / 2;
  let tries = 0;
  while (tries++ < 50) {
    const offset = random(-38, 38);
    let px = centerX + offset;
    px = max(pegRadius + 5, min(boardWidth - pegRadius - 5, px));
    const xFrac = px / boardWidth;
    if (isAtLeast2PegWidthsFromAll(0, xFrac, pegs[0].y)) {
      pegs[0].xFrac = xFrac;
      return;
    }
  }
  pegs[0].xFrac = centerX / boardWidth;
}

function randomizeCenterLifeDisruptionPegs() {
  // Two Life disruption pegs in row 1 (pegs[1], pegs[2]) — near center, at least 2 peg widths apart
  const center = 0.5;
  const rowY = 225;
  const minGapFrac = minPegDistance / boardWidth;  // 2 peg widths as fraction
  let tries = 0;
  while (tries++ < 50) {
    const leftOffset = random(minGapFrac, minGapFrac * 1.5);
    const rightOffset = random(minGapFrac, minGapFrac * 1.5);
    const x1 = center - leftOffset;
    const x2 = center + rightOffset;
    const pos2 = { xFrac: x2, y: rowY };
    const pos1 = { xFrac: x1, y: rowY };
    const valid = Math.abs(x2 - x1) >= minGapFrac &&
      isAtLeast2PegWidthsFromAll(1, x1, rowY, [2], [pos2]) &&
      isAtLeast2PegWidthsFromAll(2, x2, rowY, [1], [pos1]);
    if (valid) {
      pegs[1].xFrac = x1;
      pegs[2].xFrac = x2;
      return;
    }
  }
  pegs[1].xFrac = center - minGapFrac;
  pegs[2].xFrac = center + minGapFrac;
}

function handleReset() {
  randomizeFirstPeg();
  randomizeCenterLifeDisruptionPegs();
  resetBall();
  dropButton.html('Intent');
}

function releaseBall() {
  if (!ballLanded && ball.vy !== 0) return;
  ball.y = 52;
  ball.x = boardWidth / 2;
  ball.vx = 0;
  ball.vy = 0.5;
  ballLanded = false;
  outcomeSlot = -1;
  confettiParticles = [];
  dropButton.html('Replay');
}

function resetBall() {
  ball.x = boardWidth / 2;
  ball.y = 52;
  ball.vx = 0;
  ball.vy = 0;
  ballLanded = true;
  outcomeSlot = -1;
  confettiParticles = [];
}

function spawnConfetti() {
  const cx = boardWidth / 2;
  const cy = outcomeBoxY + outcomeBoxH / 2;
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22'];
  for (let i = 0; i < 80; i++) {
    const angle = random(TWO_PI);
    const speed = random(4, 12);
    confettiParticles.push({
      x: cx + random(-outcomeBoxW / 2, outcomeBoxW / 2),
      y: cy,
      vx: cos(angle) * speed,
      vy: random(-14, -6),
      color: random(colors),
      size: random(4, 10),
      rotation: random(TWO_PI),
      rotSpeed: random(-0.2, 0.2),
      life: confettiLifetime
    });
  }
}

function draw() {
  // Drawing region background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, boardWidth, drawHeight);

  // Control region background
  fill('white');
  noStroke();
  rect(0, drawHeight, boardWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Plinko Board of Learner Friction', boardWidth / 2, 10);

  // Five slot zones at bottom — clear boundaries, readable text (Credentialed = 50% width)
  const slotBottom = drawHeight;
  const slotTop = slotZoneTop;
  const slotHeight = slotBottom - slotTop;
  let xLeft = 0;
  const slotFillColors = [235, 248, 235, 248, 235];  // alternating for visual separation
  stroke(80);
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const slotW = boardWidth * slotWidthFractions[i];
    fill(slotFillColors[i]);
    rect(xLeft, slotTop, slotW, slotHeight);
    xLeft += slotW;
  }
  stroke(60);
  strokeWeight(3);
  noFill();
  rect(0, slotTop, boardWidth, slotHeight);  // outer border around slot zone
  fill('black');
  noStroke();
  textSize(12);
  textAlign(CENTER, CENTER);
  textLeading(14);
  xLeft = 0;
  for (let i = 0; i < 5; i++) {
    const slotW = boardWidth * slotWidthFractions[i];
    const centerX = xLeft + slotW / 2;
    const centerY = slotTop + slotHeight / 2;
    const lines = slotLabelsDisplay[i].split('\n');
    const totalLineHeight = lines.length * 14;
    let y = centerY - totalLineHeight / 2 + 7;
    for (const line of lines) {
      text(line, centerX, y);
      y += 14;
    }
    xLeft += slotW;
  }

  // Draw pegs (x = xFrac * boardWidth)
  for (const peg of pegs) {
    const px = peg.xFrac * boardWidth;
    fill(180);
    stroke(100);
    strokeWeight(2);
    circle(px, peg.y, pegRadius * 2);
    fill('black');
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text(peg.label, px, peg.y + pegRadius + 3);
  }

  // Ball physics when released and not yet landed
  const released = ball.vy !== 0 || ball.y > 60;
  if (released && !ballLanded) {
    ball.vy += gravity;
    ball.x += ball.vx;
    ball.y += ball.vy;

    for (const peg of pegs) {
      const px = peg.xFrac * boardWidth;
      const dx = ball.x - px;
      const dy = ball.y - peg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = pegRadius + ballRadius;
      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = minDist - dist;
        ball.x += nx * overlap;
        ball.y += ny * overlap;
        const dot = ball.vx * nx + ball.vy * ny;
        if (dot < 0) {
          ball.vx -= 2 * dot * nx;
          ball.vy -= 2 * dot * ny;
        }
        ball.vx *= 0.95;
        ball.vy *= 0.95;
      }
    }

    if (ball.x - ballRadius < 0) {
      ball.x = ballRadius;
      ball.vx = Math.abs(ball.vx) * 0.6;
    }
    if (ball.x + ballRadius > boardWidth) {
      ball.x = boardWidth - ballRadius;
      ball.vx = -Math.abs(ball.vx) * 0.6;
    }

    if (ball.y >= slotZoneTop && ball.vy >= 0) {
      ball.y = slotTop + (slotBottom - slotTop) / 2;
      ball.vy = 0;
      ball.vx = 0;
      // Assign outcome by slot boundaries (Credentialed = 50% width)
      let cum = 0;
      for (let i = 0; i < 5; i++) {
        cum += slotWidthFractions[i] * boardWidth;
        if (ball.x < cum) {
          outcomeSlot = i;
          break;
        }
      }
      if (outcomeSlot < 0) outcomeSlot = 4;
      ballLanded = true;
      if (outcomeSlot === 2) spawnConfetti();  // Credentialed
    }
  }

  // Draw ball
  fill('blue');
  noStroke();
  circle(ball.x, ball.y, ballRadius * 2);

  // Outcome in outlined zone on the board (only when landed)
  if (ballLanded && outcomeSlot >= 0) {
    const isCredentialed = outcomeSlot === 2;
    // Outcome box: fill and outline
    if (isCredentialed) {
      fill(255, 248, 220);
      stroke(218, 165, 32);
    } else {
      fill(255);
      stroke(100);
    }
    strokeWeight(3);
    rect(outcomeBoxX, outcomeBoxY, outcomeBoxW, outcomeBoxH, 8);
    if (isCredentialed) fill(0, 100, 0); else fill(0);
    noStroke();
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Outcome: ' + slotLabels[outcomeSlot], outcomeBoxX + outcomeBoxW / 2, outcomeBoxY + outcomeBoxH / 2);
    textStyle(NORMAL);
  }

  // Confetti (Credentialed): update and draw
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.rotation += p.rotSpeed;
    p.life--;
    if (p.life <= 0 || p.y > drawHeight + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    fill(p.color);
    noStroke();
    rect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    pop();
  }

  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  textAlign(CENTER, CENTER);
  text('Intent = learner begins their journey to GED ; Reset = New learner', boardWidth / 2, drawHeight + 78);
}

function windowResized() {
  resizeCanvas(boardWidth, canvasHeight);
}
