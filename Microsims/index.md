---
layout: page
title: MicroSims
permalink: /microsims/
subtitle: Interactive educational simulations — explore concepts hands-on with p5.js.
---

<section class="sim-section">
  <h2>Water Cycle</h2>
  <p>Tap through the four stages of the water cycle: evaporation, condensation, precipitation, and collection.</p>
  <div class="sim-embed">
    <iframe src="{{ site.baseurl }}/assets/water-cycle/main.html" height="640" width="480" scrolling="no" title="Water Cycle MicroSim"></iframe>
  </div>
  <p><a href="{{ site.baseurl }}/assets/water-cycle/main.html" target="_blank" rel="noopener noreferrer">Run fullscreen →</a></p>
</section>

<section class="sim-section">
  <h2>Plinko Board of Learner Friction</h2>
  <p>An interactive MicroSim illustrating the GED strategy concept — high-volume intake meets a plinko board of exit friction. Drop a learner (ball) through labeled pegs; it lands in one of five outcome slots.</p>
  <div class="sim-embed">
    <iframe src="{{ site.baseurl }}/assets/plinko-learner-friction/main.html" height="942" width="480" scrolling="no" title="Plinko Board of Learner Friction"></iframe>
  </div>
  <p><a href="{{ site.baseurl }}/assets/plinko-learner-friction/main.html" target="_blank" rel="noopener noreferrer">Run fullscreen →</a></p>
</section>

<section class="sim-section">
  <h2>Trampoline</h2>
  <p>Explore how weight, leg force, and gravity affect bounce height. Adjust the sliders to see how each factor affects bounce height.</p>
  <div id="trampoline-sim-container"></div>
  <p><a href="{{ site.baseurl }}/assets/trampoline/main.html" target="_blank" rel="noopener noreferrer">Run fullscreen →</a></p>
</section>

<script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.min.js"></script>
<script src="/Microsims/trampoline/sketch.js"></script>
