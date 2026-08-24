---
layout: page
title: Contact
permalink: /contact/
subtitle: Book time or email — the fastest ways to reach me.
---

<div class="contact-primary">
  <div class="schedule-block">
    <h2>Schedule with me</h2>
    <p>Prefer a live conversation? Book a time that works for both of us.</p>
    {% if site.calendar_url and site.calendar_url != '' %}
    <a class="btn btn-primary" href="{{ site.calendar_url }}" rel="noopener noreferrer">Schedule a meeting</a>
    {% else %}
    <a class="btn btn-primary schedule-stub" href="#" aria-disabled="true">Schedule a meeting</a>
    <p class="schedule-note text-muted">Booking page coming soon — powered by Google Calendar appointment schedules.</p>
    {% endif %}
  </div>

  <div class="contact-email-block">
    <h2>Email</h2>
    <p><a class="contact-email-link" href="mailto:{{ site.email }}">{{ site.email }}</a></p>
    <p class="text-muted">Best for introductions, consulting inquiries, and quick questions.</p>
  </div>
</div>

<p>I welcome conversations about product leadership, Applied AI for product management, fractional consulting, and interesting builds.</p>

<div class="contact-block contact-secondary">
  <h2>Or send a message</h2>
  <p class="text-muted">Prefer a form? We'll reply by email. Scheduling or email above is usually faster.</p>
  <form
    id="contactForm"
    action="{% if site.formspree_form_id and site.formspree_form_id != '' %}https://formspree.io/f/{{ site.formspree_form_id }}{% else %}https://formspree.io/{{ site.email }}{% endif %}"
    method="POST"
    data-contact-email="{{ site.email }}"
    {% if site.turnstile_site_key and site.turnstile_site_key != '' %}data-turnstile-site-key="{{ site.turnstile_site_key }}"{% endif %}
  >
    <div class="form-honeypot" aria-hidden="true">
      <label for="contact-website">Leave this blank</label>
      <input type="text" id="contact-website" name="_gotcha" tabindex="-1" autocomplete="off">
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required autocomplete="name">
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="_replyto" required autocomplete="email">
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <div id="turnstileContainer" class="turnstile-container"></div>
    <button type="submit" class="btn btn-primary">Send message</button>
    <div id="formStatus" class="form-status" role="status" aria-live="polite"></div>
  </form>
</div>
