/**
 * Trampoline MicroSim
 * Explore how weight, leg force, and gravity affect bounce height.
 * Physics in SI units (kg, m, m/s, m/s²).
 */
(function () {
  const GRAVITY = { earth: 9.81, moon: 1.62, mars: 3.71 };
  const PX_PER_M = 65;
  const DT = 1 / 60;
  const SPRING_K = 4000;
  const MAX_COMPRESSION = 1.2;
  const PERSON_HEIGHT_M = 1.7;

  const sketch = function (p) {
    let personY, personVy, trampolineY;
    let compression = 0;
    let peakHeight = 0;
    let legForceApplied = false;
    let compressingFrames = 0;
    let massSlider, legForceSlider;
    let gravityRadio;

    const feetY = () => personY - PERSON_HEIGHT_M;

    p.setup = function () {
      const canvas = p.createCanvas(400, 380);
      canvas.parent("trampoline-sim-container");
      p.textFont("sans-serif");

      const controls = p.createDiv("");
      controls.parent("trampoline-sim-container");
      controls.style("margin-top", "8px").style("font-size", "13px");

      p.createSpan("Gravity: ").parent(controls);
      gravityRadio = p.createRadio();
      gravityRadio.option("earth", " Earth ");
      gravityRadio.option("moon", " Moon ");
      gravityRadio.option("mars", " Mars ");
      gravityRadio.selected("earth");
      gravityRadio.style("margin-right", "8px");
      gravityRadio.parent(controls);
      gravityRadio.style("display", "inline");

      const row2 = p.createDiv("");
      row2.parent("trampoline-sim-container");
      row2.style("margin-top", "6px").style("font-size", "13px");
      p.createSpan("Mass: ").parent(row2);
      massSlider = p.createSlider(40, 120, 80, 5);
      massSlider.parent(row2);
      massSlider.style("width", "120px");
      const massLabel = p.createSpan(" 80 kg");
      massLabel.parent(row2);
      massSlider.input(() => { massLabel.html(" " + massSlider.value() + " kg"); });

      const row3 = p.createDiv("");
      row3.parent("trampoline-sim-container");
      row3.style("margin-top", "4px").style("font-size", "13px");
      p.createSpan("Leg force: ").parent(row3);
      p.createSpan("Small hop").parent(row3).style("font-size", "11px").style("color", "#666").style("margin-right", "4px");
      legForceSlider = p.createSlider(0, 100, 50, 5);
      legForceSlider.parent(row3);
      legForceSlider.style("width", "100px");
      p.createSpan("Full leap").parent(row3).style("font-size", "11px").style("color", "#666").style("margin-left", "4px");

      const row4 = p.createDiv("");
      row4.parent("trampoline-sim-container");
      row4.style("margin-top", "4px");
      const resetBtn = p.createButton("Reset");
      resetBtn.parent(row4);
      resetBtn.mousePressed(resetPerson);

      trampolineY = p.height - 70;
      resetPerson();
    };

    function resetPerson() {
      personY = 2.5;
      personVy = 0;
      compression = 0;
      legForceApplied = false;
      compressingFrames = 0;
      peakHeight = personY;
    }

    function getLegImpulseVelocity() {
      const t = legForceSlider.value() / 100;
      return 1.5 + t * 4.5;
    }

    function drawPerson(screenX, screenY, legsDown) {
      const armAngle = legsDown ? -0.5 : 0.2 + p.sin(p.frameCount * 0.12) * 0.25;
      const legAngle = legsDown ? 1.4 : -0.15 - p.sin(p.frameCount * 0.1) * 0.2;
      const scale = (0.85 * PX_PER_M) / 18;

      p.push();
      p.translate(screenX, screenY);
      p.scale(scale);

      p.fill(255, 225, 190);
      p.noStroke();
      p.circle(0, -9, 6);

      p.stroke(60, 100, 180);
      p.strokeWeight(3 / scale);
      p.line(0, -5, 0, 10);

      p.stroke(60, 100, 180);
      p.line(0, -2, -9 * p.cos(armAngle), -2 + 9 * p.sin(armAngle));
      p.line(0, -2, 9 * p.cos(armAngle), -2 + 9 * p.sin(armAngle));

      p.strokeWeight(3 / scale);
      p.stroke(80, 120, 200);
      p.line(0, 10, -7 * p.cos(legAngle), 10 + 12 * p.sin(legAngle));
      p.line(0, 10, 7 * p.cos(legAngle), 10 + 12 * p.sin(legAngle));

      p.pop();
    }

    p.draw = function () {
      const mass = massSlider.value();
      const g = GRAVITY[gravityRadio.value()];
      const trampolineRestY = trampolineY;
      const feet = feetY();
      const surface = -compression;
      const inContact = feet <= surface + 0.02;
      const shouldLaunch = compression < 0.04 && personVy > 0.3;

      if (inContact && !shouldLaunch) {
        personY = PERSON_HEIGHT_M - compression;
        const springForce = SPRING_K * compression;
        const a = (springForce - mass * g) / mass;
        personVy += a * DT;

        compression -= personVy * DT;
        compression = p.max(0, p.min(compression, MAX_COMPRESSION));

        if (personVy > 0 && compression > 0.03 && !legForceApplied) {
          personVy += getLegImpulseVelocity();
          legForceApplied = true;
        }

        if (compression <= 0.02 && personVy > 0) {
          legForceApplied = false;
        }
      } else {
        personVy -= g * DT;
        personY += personVy * DT;
        compression *= 0.95;
        compression = p.max(0, compression);
        legForceApplied = false;
      }

      if (personY > peakHeight) peakHeight = personY;
      const bounceHeightM = p.max(0, peakHeight - PERSON_HEIGHT_M);

      if (inContact && !shouldLaunch && compression > 0.02) {
        compressingFrames = p.min(compressingFrames + 1, 8);
      } else {
        compressingFrames = p.max(compressingFrames - 1, 0);
      }
      const showCompressingPose = compressingFrames >= 4;

      const compressionPx = compression * PX_PER_M;
      const bedY = trampolineRestY + compressionPx;
      const dip = compressionPx * 0.6;

      p.background(248, 250, 253);

      p.fill(235, 238, 242);
      p.noStroke();
      p.rect(0, trampolineRestY + 35, p.width, p.height);

      p.noStroke();
      p.fill(215, 55, 75);
      p.beginShape();
      p.vertex(50, bedY);
      p.quadraticVertex(p.width / 2, bedY + dip, p.width - 50, bedY);
      p.vertex(p.width - 50, bedY + 10);
      p.quadraticVertex(p.width / 2, bedY + 10 + dip * 0.5, 50, bedY + 10);
      p.endShape(p.CLOSE);

      p.stroke(180, 40, 55);
      p.strokeWeight(1);
      p.noFill();
      p.beginShape();
      p.vertex(50, bedY);
      p.quadraticVertex(p.width / 2, bedY + dip, p.width - 50, bedY);
      p.endShape();

      const personCenterY = personY - 0.85;
      const personScreenY = trampolineRestY - personCenterY * PX_PER_M;
      drawPerson(p.width / 2, personScreenY, showCompressingPose);

      p.fill(70);
      p.noStroke();
      p.textSize(12);
      const gravLabel = gravityRadio.value().charAt(0).toUpperCase() + gravityRadio.value().slice(1);
      p.text("Peak: " + bounceHeightM.toFixed(1) + " m  |  Gravity: " + gravLabel, 10, 22);
    };
  };

  if (typeof p5 !== "undefined") {
    new p5(sketch, "trampoline-sim-container");
  }
})();
