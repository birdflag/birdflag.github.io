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
  gap: clamp(2.5rem, 4vw, 5rem);
  margin-top: 2rem;
  max-width: 1400px;
}
.bio-photo {
  width: clamp(240px, 20vw, 380px);
  height: clamp(240px, 20vw, 380px);
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
  font-size: clamp(0.95rem, 1.1vw, 1.3rem);
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
