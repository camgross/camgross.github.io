// Trampoline Simulation MicroSim with Labeled Sliders, Unit Toggle, and Animated Jumper
// Built with p5.js

console.log("sketch.js is loaded");

let weightSlider, forceSlider, gravitySlider;
let weightLabel, forceLabel, gravityLabel;
let unitToggle;
let jumper;
let gravity;
let useMetric = true;

function setup() {
  let canvas = createCanvas(400, 400);
  console.log("Canvas created:", canvas);
  canvas.parent("trampoline-sim-container"); // Attach canvas to the container

  // Initialize sliders
  weightSlider = createSlider(40, 120, 70); // kg
  weightSlider.position(100, 420);
  weightSlider.style('width', '120px');

  forceSlider = createSlider(0, 100, 50); // percent
  forceSlider.position(250, 420);
  forceSlider.style('width', '120px');

  gravitySlider = createSlider(1.6, 9.8, 3.7, 0.1); // Moon to Earth gravity
  gravitySlider.position(400, 420);
  gravitySlider.style('width', '120px');

  // Create labels
  weightLabel = createDiv('');
  weightLabel.position(100, 400);

  forceLabel = createDiv('');
  forceLabel.position(250, 400);

  gravityLabel = createDiv('');
  gravityLabel.position(400, 400);

  // Remove the existing unit toggle
unitToggle.remove();

// Store the previous state of the unit toggle
let previousState = useMetric;

// Create a new checkbox with updated label and position
if (previousState) {
  unitToggle = createCheckbox('Metric (kg)', true);
  weightSlider.elt.min = 40;
  weightSlider.elt.max = 120;
  weightSlider.value(70);
} else {
  unitToggle = createCheckbox('Standard (lbs)', false);
  weightSlider.elt.min = 88;
  weightSlider.elt.max = 265; // Assuming a max value for lbs
  weightSlider.value(154);   // Assuming a default value for lbs
}

function toggleUnits() {
  useMetric = unitToggle.checked();

  // Update the position and attach the event listener
  unitToggle.position(100, 450);
  unitToggle.changed(toggleUnits);
}

function getGravityBodyName(value) {
  if (value <= 2.5) return "Moon";
  else if (value <= 6.0) return "Mars";
  else return "Earth";
}
  // Initialize jumper
  jumper = new Jumper();
}




function toggleUnits() {
  useMetric = unitToggle.checked();
  let previousState = useMetric;

  

  unitToggle.position(100, 450);
  unitToggle.changed(toggleUnits);
}

function getGravityBodyName(value) {
  if (value <= 2.5) return "Moon";
  else if (value <= 6.0) return "Mars";
  else return "Earth";
}

function draw() {
  background(220);
  drawTrampoline() // Draw trampoline
    stroke(120);
    strokeWeight(4);
    line(100, 350, 500, 350);
  ellipse(width / 2, height / 2, 50, 50); // Example drawing
}

  // Update simulation variables
  gravity = gravitySlider.value();
  let weight = weightSlider.value();
  let displayWeight = weight;

  if (!useMetric) {
    weight = weight * 0.453592; // convert lbs to kg
  }
  jumper.mass = weight;
  jumper.force = forceSlider.value();
  jumper.gravity = gravity;

  jumper.update();
  jumper.display();

  // Update labels with units and values
  weightLabel.html(`Weight: ${nf(displayWeight, 0, 0)} ${useMetric ? "kg" : "lbs"}`);
  forceLabel.html(`Leg Force: ${nf(forceSlider.value(), 0, 0)}%`);
  gravityLabel.html(`Gravity: ${getGravityBodyName(gravity)}`);

}

class Jumper {
  constructor() {
    this.y = 349;
    this.vy = 0;
    this.mass = 70;
    this.force = 50;
    this.gravity = 9.8;
    this.onTrampoline = true;
  }

  update() {
    if (this.y >= 349) {
      this.onTrampoline = true;
      let jumpImpulse = map(this.force, 0, 100, 0, 20);
      this.vy = -jumpImpulse / (this.mass * 0.01);
    } else {
      this.vy += this.gravity * 0.1;
      this.onTrampoline = false;
    }
    this.y += this.vy;

    if (this.y > 349) {
      this.y = 349;
      this.vy = 0;
    }
  }

  display() {
    // Draw a simple stick figure
    let x = width / 2;
    let headSize = 20;
    let bodyLength = 30;
    let legLength = 20;
    let armLength = 15;

    // Head
    fill(255, 220, 180);
    ellipse(x, this.y - bodyLength - headSize / 2, headSize, headSize);

    stroke(0);
    strokeWeight(2);

    // Body
    line(x, this.y - bodyLength, x, this.y);

    // Arms
    line(x, this.y - bodyLength + 5, x - armLength, this.y - bodyLength + 15);
    line(x, this.y - bodyLength + 5, x + armLength, this.y - bodyLength + 15);

    // Legs
    line(x, this.y, x - legLength, this.y + legLength);
    line(x, this.y, x + legLength, this.y + legLength);
  }
}
