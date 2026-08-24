---
layout: page
title: Curiosities
permalink: /curiosities/
subtitle: Builds, experiments, and interactive tools — side projects and prototypes worth exploring.
---

<section class="section">
  <h2>Current builds</h2>
  <div class="card-grid">
    {% for repo in site.repos %}
    <article class="card">
      <h3>
        {% if repo.url %}
        <a href="{{ repo.url }}" rel="noopener noreferrer">{{ repo.name }}</a>
        {% else %}
        {{ repo.name }}
        {% endif %}
      </h3>
      <p>{{ repo.description }}</p>
      {% if repo.url %}
      <a class="card-link" href="{{ repo.url }}" rel="noopener noreferrer">{% if repo.url contains 'github.com' %}View on GitHub →{% else %}Visit →{% endif %}</a>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>

<section class="section">
  <h2>MicroSims</h2>
  <p class="text-muted">Interactive educational simulations built with p5.js — explore physics, strategy, and science concepts hands-on.</p>
  <div class="card-grid">
    <article class="card">
      <h3><a href="{{ '/microsims/' | relative_url }}">Plinko Board of Learner Friction</a></h3>
      <p>GED strategy concept — high-volume intake meets exit friction pegs.</p>
      <a class="card-link" href="{{ '/microsims/' | relative_url }}">Try it →</a>
    </article>
    <article class="card">
      <h3><a href="{{ '/microsims/' | relative_url }}">Water Cycle</a></h3>
      <p>Tap through evaporation, condensation, precipitation, and collection.</p>
      <a class="card-link" href="{{ '/microsims/' | relative_url }}">Try it →</a>
    </article>
    <article class="card">
      <h3><a href="{{ '/microsims/' | relative_url }}">Trampoline</a></h3>
      <p>Explore how weight, leg force, and gravity affect bounce height.</p>
      <a class="card-link" href="{{ '/microsims/' | relative_url }}">Explore all sims →</a>
    </article>
  </div>
</section>
