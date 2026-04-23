const countElements = document.querySelectorAll(".count[data-count]");

function animateCount(element) {
  const target = Number(element.dataset.count || 0);
  const duration = 900;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = String(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = String(target);
    }
  }

  requestAnimationFrame(update);
}

if (countElements.length > 0) {
  countElements.forEach((item) => animateCount(item));
}

const revealItems = document.querySelectorAll(".reveal-item");

if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
