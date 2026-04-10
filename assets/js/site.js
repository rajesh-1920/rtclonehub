window.RTHub = window.RTHub || {};

window.RTHub.cloneProjects = [
  {
    name: "Myntra Clone",
    description: "Homepage and bag experience built with HTML, CSS, and JavaScript.",
    status: "done",
    statusLabel: "Completed",
    path: "myntra/index.html",
  },
  {
    name: "Facebook Clone",
    description: "Social homepage and feed UI clone in progress.",
    status: "progress",
    statusLabel: "In Progress",
    path: "facebook/",
  },
  {
    name: "Amajon Clone",
    description: "E-commerce clone planned with product listing and cart flow.",
    status: "planned",
    statusLabel: "Planned",
    path: "amajon/",
  },
];

window.RTHub.setupMobileNav = function setupMobileNav() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });
  }
};

window.RTHub.renderCloneCards = function renderCloneCards(containerId, basePath = "") {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.innerHTML = window.RTHub.cloneProjects
    .map((project) => {
      const buttonText = project.status === "done" ? "Open Clone" : "View Folder";

      return `
        <article class="clone-card">
          <div class="mb-3">
            <span class="badge ${project.status}">${project.statusLabel}</span>
          </div>
          <h3 class="mb-2 text-xl font-bold text-slate-900">${project.name}</h3>
          <p class="mb-4 text-sm text-slate-600">${project.description}</p>
          <a href="${basePath}${project.path}" class="card-link">${buttonText}</a>
        </article>
      `;
    })
    .join("");
};
