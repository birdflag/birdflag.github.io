(() => {
  "use strict";

  /*
   * Missing-artwork fallback.
   * Keep the original gallery href: a separate full-size file may exist
   * even if its smaller preview is missing.
   */
  function useFallback(image) {
    const fallback = image.dataset.fallbackSrc;

    if (!fallback || image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.dataset.originalAlt = image.alt || "";
    image.alt = image.alt
      ? `Image unavailable: ${image.alt}`
      : "Image unavailable";

    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.src = fallback;
  }

  document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    image.addEventListener("error", () => useFallback(image));

    if (image.getAttribute("src") && image.complete && image.naturalWidth === 0) {
      useFallback(image);
    }
  });

  /*
   * Native-dialog viewer.
   * Ordinary image links remain usable without JavaScript or dialog support.
   */
  const viewer = document.querySelector("#image-viewer");
  const links = [...document.querySelectorAll("a[data-lightbox]")];

  if (!viewer || typeof viewer.showModal !== "function" || links.length === 0) {
    return;
  }

  const figure = document.querySelector("#viewer-figure");
  const stage = document.querySelector("#viewer-stage");
  const canvas = document.querySelector("#viewer-canvas");
  const image = document.querySelector("#viewer-image");
  const caption = document.querySelector("#viewer-caption");
  const state = document.querySelector("#viewer-state");
  const viewerCount = document.querySelector("#viewer-count");
  const scaleLabel = document.querySelector("#viewer-scale");
  const previous = document.querySelector("#viewer-previous");
  const next = document.querySelector("#viewer-next");
  const zoom = document.querySelector("#viewer-zoom");
  const original = document.querySelector("#viewer-original");

  if (
    [
      figure, stage, canvas, image, caption, state, viewerCount,
      scaleLabel, previous, next, zoom, original
    ].some((element) => !element)
  ) {
    return;
  }

  const fallbackSource = viewer.dataset.fallbackSrc;
  const backgroundTargets = new Set([viewer, figure, stage, canvas]);

  let activeIndex = 0;
  let loadSequence = 0;
  let fitFrame = 0;
  let natural = null;
  let originalSize = false;
  let isPlaceholder = false;
  let opener = null;
  let backgroundPress = null;

  previous.disabled = links.length < 2;
  next.disabled = links.length < 2;

  function setState(message) {
    state.textContent = message;
    state.hidden = !message;
  }

  function isCurrent(sequence) {
    return viewer.open && sequence === loadSequence;
  }

  function loadAsset(source) {
    return new Promise((resolve, reject) => {
      const asset = new Image();
      asset.decoding = "async";
      asset.onload = () => resolve(asset);
      asset.onerror = () => reject(new Error("Image could not be loaded"));
      asset.src = source;
    });
  }

  /*
   * Each image is fitted independently.
   * A scale no greater than 1 prevents upscaling in Fit view.
   * Controls and caption occupy their own grid rows, outside the stage.
   */
  function fitImage() {
    if (!viewer.open || !natural) return;

    stage.classList.toggle("is-original-size", originalSize);

    let availableWidth = stage.clientWidth;
    let availableHeight = stage.clientHeight;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    let fitScale = Math.min(
      1,
      availableWidth / natural.width,
      availableHeight / natural.height
    );

    if (originalSize && (isPlaceholder || fitScale >= 1)) {
      originalSize = false;
      stage.classList.remove("is-original-size");

      availableWidth = stage.clientWidth;
      availableHeight = stage.clientHeight;

      fitScale = Math.min(
        1,
        availableWidth / natural.width,
        availableHeight / natural.height
      );
    }

    const scale = originalSize ? 1 : fitScale;
    const displayWidth = natural.width * scale;
    const displayHeight = natural.height * scale;

    image.style.width = `${displayWidth}px`;
    image.style.height = `${displayHeight}px`;

    /*
     * A positive-size canvas makes every edge reachable when scrolling
     * a large original. Centering cannot push it off the top or left.
     */
    canvas.style.width = `${Math.max(availableWidth, displayWidth)}px`;
    canvas.style.height = `${Math.max(availableHeight, displayHeight)}px`;

    zoom.disabled = isPlaceholder || fitScale >= 1;
    zoom.setAttribute("aria-pressed", String(originalSize));
    stage.tabIndex = originalSize ? 0 : -1;

    // Long captions can also be reached and scrolled with the keyboard.
    caption.tabIndex = caption.scrollHeight > caption.clientHeight + 1 ? 0 : -1;

    if (!originalSize) {
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }

    scaleLabel.textContent = isPlaceholder
      ? "Preview placeholder"
      : originalSize
        ? `${natural.width} × ${natural.height} · 100%`
        : `${Math.round(fitScale * 100)}% · Fit`;
  }

  function scheduleFit() {
    if (!viewer.open || !natural) return;

    window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(fitImage);
  }

  async function showImage(index) {
    activeIndex = ((index % links.length) + links.length) % links.length;

    const sequence = ++loadSequence;
    const link = links[activeIndex];
    const alt = link.dataset.alt || "Project image";
    const description = link.dataset.caption || alt;

    natural = null;
    originalSize = false;
    isPlaceholder = false;

    stage.classList.remove("is-original-size");
    stage.tabIndex = -1;
    stage.scrollLeft = 0;
    stage.scrollTop = 0;

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    image.hidden = true;
    image.removeAttribute("src");
    image.style.width = "";
    image.style.height = "";

    zoom.disabled = true;
    zoom.setAttribute("aria-pressed", "false");

    caption.textContent = description;
    caption.tabIndex = -1;
    caption.scrollTop = 0;

    viewerCount.textContent = `${activeIndex + 1} / ${links.length}`;
    scaleLabel.textContent = "";

    original.href = link.href;
    original.hidden = false;

    setState("Loading image…");

    let asset;
    let missing = false;

    try {
      asset = await loadAsset(link.href);
    } catch {
      if (!isCurrent(sequence)) return;

      missing = true;

      if (!fallbackSource) {
        original.hidden = true;
        setState("This image could not be loaded.");
        return;
      }

      try {
        asset = await loadAsset(fallbackSource);
      } catch {
        if (!isCurrent(sequence)) return;

        original.hidden = true;
        setState("This image could not be loaded. Check that the artwork has been copied into the site.");
        return;
      }
    }

    // Ignore an earlier request after navigation or closing the viewer.
    if (!isCurrent(sequence)) return;

    if (!asset.naturalWidth || !asset.naturalHeight) {
      original.hidden = true;
      setState("This image has no usable dimensions.");
      return;
    }

    natural = {
      width: asset.naturalWidth,
      height: asset.naturalHeight
    };
    isPlaceholder = missing;

    image.alt = missing ? `Image unavailable: ${alt}` : alt;
    image.src = asset.src;

    caption.textContent = missing
      ? `Preview unavailable — ${description}`
      : description;

    original.hidden = missing;

    setState("");
    image.hidden = false;
    fitImage();
  }

  function toggleOriginalSize() {
    if (!natural || zoom.disabled) return;

    originalSize = !originalSize;
    fitImage();

    if (originalSize) {
      stage.scrollLeft = Math.max(0, (canvas.offsetWidth - stage.clientWidth) / 2);
      stage.scrollTop = Math.max(0, (canvas.offsetHeight - stage.clientHeight) / 2);
      stage.focus({ preventScroll: true });
    } else {
      zoom.focus({ preventScroll: true });
    }
  }

  links.forEach((link, index) => {
    link.setAttribute("aria-haspopup", "dialog");

    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      opener = link;

      // If dialog opening fails, retain normal link navigation.
      try {
        if (!viewer.open) viewer.showModal();
      } catch {
        return;
      }

      event.preventDefault();
      document.body.classList.add("has-viewer");
      showImage(index);
    });
  });

  previous.addEventListener("click", () => showImage(activeIndex - 1));
  next.addEventListener("click", () => showImage(activeIndex + 1));
  zoom.addEventListener("click", toggleOriginalSize);

  viewer.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    // Let focused scrollable artwork or a long caption scroll normally.
    if (originalSize && event.target === stage) return;
    if (event.target === caption && caption.tabIndex === 0) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });

  /*
   * An intentional background click closes Fit view.
   * Dragging from the image onto the background does not close it.
   * Background closing is disabled in original-size view.
   */
  viewer.addEventListener("pointerdown", (event) => {
    backgroundPress =
      event.button === 0 &&
      !originalSize &&
      backgroundTargets.has(event.target)
        ? { x: event.clientX, y: event.clientY }
        : null;
  });

  viewer.addEventListener("pointercancel", () => {
    backgroundPress = null;
  });

  viewer.addEventListener("click", (event) => {
    const press = backgroundPress;
    backgroundPress = null;

    if (
      !press ||
      originalSize ||
      event.detail === 0 ||
      !backgroundTargets.has(event.target)
    ) {
      return;
    }

    const distance = Math.hypot(
      event.clientX - press.x,
      event.clientY - press.y
    );

    if (distance < 8) viewer.close();
  });

  /*
   * Native dialog supplies focus containment and Escape handling.
   * Explicit restoration also covers pointer clicks that did not focus
   * their originating link.
   */
  viewer.addEventListener("close", () => {
    if (viewer.open) return;

    loadSequence += 1;
    window.cancelAnimationFrame(fitFrame);

    document.body.classList.remove("has-viewer");

    natural = null;
    originalSize = false;
    backgroundPress = null;

    stage.classList.remove("is-original-size");
    stage.tabIndex = -1;
    caption.tabIndex = -1;

    image.hidden = true;
    image.removeAttribute("src");
    setState("");

    if (opener?.isConnected) {
      opener.focus({ preventScroll: true });
    }

    opener = null;
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(stage);
  }

  window.addEventListener("resize", scheduleFit);
  window.visualViewport?.addEventListener("resize", scheduleFit);
})();