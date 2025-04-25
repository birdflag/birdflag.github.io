---
title: Hello there.
description: About the designer
---

<style>
  .about-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
  }

  .about-image {
    flex-shrink: 0;
    width: 280px;
  }

  .about-text {
    max-width: 480px;
    line-height: 1.6;
  }

  .about-text p {
    margin-bottom: 1.2em;
  }

  @media (max-width: 700px) {
    .about-wrapper {
      flex-direction: column;
    }

    .about-image {
      width: 100%;
    }
  }
</style>

<div class="about-wrapper">
  <div>
    <img src="/images/crop_hadshot.JPG" class="about-image" alt="Portrait of Hannah Fogarty">
  </div>

  <div class="about-text">
    <p>My name is Hannah Fogarty. I'm a graphic designer in Charlottesville, VA.</p>

    <p>I love working with folks who are putting something new out into the world, and I can help you find the right visual presence for your endeavor. I create handmade designs that solve the problem of how to communicate who you are and what you offer.</p>

    <p>Contact me at <a href="mailto:hfogartydesign@gmail.com">hfogartydesign@gmail.com</a> to talk, or use the Design Form at left to share your brand or project vision!</p>
  </div>
</div>
