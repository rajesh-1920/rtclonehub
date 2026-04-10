window.RTHub = window.RTHub || {};

window.RTHub.navItems = [
  { key: "home", label: "Home", path: "index.html" },
  { key: "clones", label: "Clones", path: "pages/clones.html" },
  { key: "about", label: "About", path: "pages/about.html" },
  { key: "contact", label: "Contact", path: "pages/contact.html" },
];

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

  if (menuBtn && mobileNav && !menuBtn.dataset.navBound) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });

    menuBtn.dataset.navBound = "true";
  }
};

window.RTHub.renderNavbar = function renderNavbar(currentPage = "home", basePath = "") {
  const headerRoot = document.getElementById("siteHeader");

  if (!headerRoot) {
    return;
  }

  const desktopLinks = window.RTHub.navItems
    .map((item) => {
      const classes = item.key === currentPage ? "text-brand-700" : "hover:text-brand-600";
      return `<li><a href="${basePath}${item.path}" class="${classes}">${item.label}</a></li>`;
    })
    .join("");

  const mobileLinks = window.RTHub.navItems
    .map((item) => {
      const classes =
        item.key === currentPage ? "block text-brand-700" : "block hover:text-brand-600";
      return `<li><a href="${basePath}${item.path}" class="${classes}">${item.label}</a></li>`;
    })
    .join("");

  headerRoot.className = "sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur";
  headerRoot.innerHTML = `
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main navigation">
      <a href="${basePath}index.html" class="brand-title text-xl font-bold tracking-wide text-brand-700">RT Clone Hub</a>

      <button id="menuBtn" class="rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold md:hidden" aria-label="Toggle menu">
        Menu
      </button>

      <ul id="navMenu" class="hidden gap-6 text-sm font-semibold md:flex">
        ${desktopLinks}
      </ul>
    </nav>

    <ul id="mobileNav" class="hidden space-y-2 border-t border-slate-200 px-4 py-3 text-sm font-semibold md:hidden">
      ${mobileLinks}
    </ul>
  `;

  window.RTHub.setupMobileNav();
};

window.RTHub.initSharedLayout = function initSharedLayout() {
  const pageKey = document.body?.dataset.page || "home";
  const basePath = document.body?.dataset.basePath || "";
  window.RTHub.renderNavbar(pageKey, basePath);
};

window.RTHub.initSharedLayout();

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
