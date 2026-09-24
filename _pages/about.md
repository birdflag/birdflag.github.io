---
title: Hello there.
description: About the designer
---

<div class="bio-wrap">
  <img src="/images/crop_headshot.JPG" alt="Hannah Fogarty" class="bio-photo">
  <div class="bio-text">
    <p>My name is Hannah Fogarty. I'm a graphic designer in San Francisco, specializing in branding and packaging design for consumable goods.</p>
    <p>I love working with folks who are putting something new out into the world, and I can help you find the right visual presence for your endeavor with handmade designs that communicate who you are and what you offer.</p>
    <p>Contact me at hfogartydesign@gmail.com to talk - I'd love to hear about your brand or project vision.</p>
  </div>
</div>

<style>
.bio-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2.5rem;
  margin-top: 2rem;
}
.bio-photo {
  width: 240px;
  height: 240px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}
.bio-text {
  flex: 1;
  min-width: 260px;
}
.bio-text p {
  margin-bottom: 1.2em;
  line-height: 1.6;
  font-size: 0.95rem;
}
@media (max-width: 520px) {
  .bio-wrap {
    flex-direction: column;
    text-align: center;
  }
  .bio-photo {
    width: 180px;
    height: 180px;
  }
}
</style>
