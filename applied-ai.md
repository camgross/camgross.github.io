---
layout: page
title: Community
permalink: /applied-ai/
subtitle: Applied AI for Product Management — curated sessions only. Not the broader Applied AI meetup series.
---

{% assign today = site.time | date: '%Y-%m-%d' %}
{% assign upcoming_sessions = '' | split: '' %}
{% assign past_sessions = '' | split: '' %}
{% for session in site.data.sessions %}
  {% assign session_day = session.date | date: '%Y-%m-%d' %}
  {% if session_day >= today %}
    {% assign upcoming_sessions = upcoming_sessions | push: session %}
  {% else %}
    {% assign past_sessions = past_sessions | push: session %}
  {% endif %}
{% endfor %}
{% assign next_session = upcoming_sessions | first %}

<p>Co-hosted with <a href="https://www.linkedin.com/in/johndebauche/" rel="noopener noreferrer">John DeBauche</a>, <a href="https://www.linkedin.com/in/bethalisonb/" rel="noopener noreferrer">Beth-Alison Berggren</a>, <a href="https://www.linkedin.com/in/mccarthyemily07/" rel="noopener noreferrer">Emily McCarthy</a>, and <a href="https://www.linkedin.com/in/justingrammens/" rel="noopener noreferrer">Justin Grammens</a> at <a href="https://www.linkedin.com/company/lab651/" rel="noopener noreferrer">Lab651</a>.</p>

{% if next_session and next_session.meetup_url %}
<p><a class="btn btn-primary" href="{{ next_session.meetup_url }}" rel="noopener noreferrer">RSVP — next AI in Product session</a></p>
{% endif %}

<div class="card-grid" style="margin-top: 2rem;">

{% for session in upcoming_sessions %}
<article class="card">
  <div class="card-meta">{{ session.date | date: '%b %-d, %Y' }} · Upcoming</div>
  <h3>{{ session.title }}</h3>
  <p>{{ session.summary }}</p>
  {% if session.meetup_url %}<a class="card-link" href="{{ session.meetup_url }}" rel="noopener noreferrer">Meetup →</a>{% endif %}
  {% if session.meetup_url and session.linkedin_url %} · {% endif %}
  {% if session.linkedin_url %}<a class="card-link" href="{{ session.linkedin_url }}" rel="noopener noreferrer">LinkedIn →</a>{% endif %}
  {% if session.minnestar_url %}
    {% if session.meetup_url or session.linkedin_url %} · {% endif %}
    <a class="card-link" href="{{ session.minnestar_url }}" rel="noopener noreferrer">Minnestar →</a>
  {% endif %}
</article>
{% endfor %}

{% for session in past_sessions %}
<article class="card">
  <div class="card-meta">{% if session.undated %}Earlier{% else %}{{ session.date | date: '%b %Y' }}{% endif %}</div>
  <h3>{{ session.title }}</h3>
  <p>{{ session.summary }}</p>
  {% if session.linkedin_url %}<a class="card-link" href="{{ session.linkedin_url }}" rel="noopener noreferrer">{{ session.link_label | default: 'Recap →' }}</a>{% endif %}
  {% if session.meetup_url %}
    {% if session.linkedin_url %} · {% endif %}
    <a class="card-link" href="{{ session.meetup_url }}" rel="noopener noreferrer">Meetup →</a>
  {% endif %}
  {% if session.minnestar_url %}
    {% if session.linkedin_url or session.meetup_url %} · {% endif %}
    <a class="card-link" href="{{ session.minnestar_url }}" rel="noopener noreferrer">Minnestar →</a>
  {% endif %}
</article>
{% endfor %}

</div>
