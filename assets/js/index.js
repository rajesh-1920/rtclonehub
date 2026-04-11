window.RTHub.renderCloneCards("cloneGrid", "");

const countElements = document.querySelectorAll(".count[data-count]");

function animateCount(element) {
  const target = Number(element.dataset.count || 0);
  const duration = 850;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = String(Math.floor(progress * target));

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = String(target);
    }
  }

  requestAnimationFrame(update);
}

if (countElements.length > 0) {
  countElements.forEach((element) => animateCount(element));
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
      threshold: 0.16,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
