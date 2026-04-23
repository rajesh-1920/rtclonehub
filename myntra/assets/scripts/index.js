let bagItems = [];
let activeCategory = "all";
let searchAnchorScrollY = null;
const catalog =
  typeof products !== "undefined" && Array.isArray(products)
    ? products
    : typeof items !== "undefined" && Array.isArray(items)
      ? items
      : [];

(() => {
  bagItems = getStoredBagItems();
  if (!Array.isArray(bagItems)) {
    bagItems = [];
  }
  displayBagItemCount();
  setupSearch();
  setupCategoryFilters();
  displayHomepageContent();
})();

function normalizeBagItems(rawBagItems) {
  if (!Array.isArray(rawBagItems)) {
    return [];
  }
  return rawBagItems.filter(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      Number.isInteger(entry.productId) &&
      Number.isInteger(entry.quantity) &&
      entry.quantity > 0,
  );
}

function saveBagItems() {
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
}

function setupSearch() {
  const searchInput = document.querySelector(".search-container input");
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const currentSearchText = searchInput.value || "";
    toggleSearchResultsMode(currentSearchText);
    displayHomepageContent(currentSearchText);
  });

  toggleSearchResultsMode(searchInput.value || "");
}

function toggleSearchResultsMode(searchText) {
  const itemsSection = document.querySelector(".items-section");
  if (!itemsSection) {
    return;
  }

  const isSearchActive = Boolean(searchText.trim());

  if (isSearchActive) {
    if (searchAnchorScrollY === null) {
      searchAnchorScrollY = window.scrollY;
    }

    document.body.classList.add("search-active");
    scrollSearchResultsIntoView(itemsSection);
    return;
  }

  document.body.classList.remove("search-active");

  if (searchAnchorScrollY !== null) {
    window.scrollTo({ top: searchAnchorScrollY, behavior: "auto" });
    searchAnchorScrollY = null;
  }
}

function scrollSearchResultsIntoView(itemsSection) {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const sectionTop = itemsSection.getBoundingClientRect().top + window.scrollY;
  const targetTop = Math.max(0, sectionTop - headerHeight - 8);
  const isAlreadyVisible = window.scrollY <= targetTop + 8;

  if (isAlreadyVisible) {
    return;
  }

  window.scrollTo({ top: targetTop, behavior: "smooth" });
}

function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll(".category-chip");
  if (!categoryButtons.length) {
    return;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      categoryButtons.forEach((chip) => chip.classList.toggle("active", chip === button));
      displayHomepageContent();
    });
  });
}

function formatRupees(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}

function formatReviews(reviewCount) {
  if (reviewCount >= 1000) {
    return `${(reviewCount / 1000).toFixed(1).replace(".0", "")}k`;
  }
  return `${reviewCount}`;
}

function addToBag(productId) {
  const existingEntry = bagItems.find((entry) => entry.productId === productId);
  if (!existingEntry) {
    bagItems.push({ productId, quantity: 1 });
  }
  saveBagItems();
  displayBagItemCount();
  displayHomepageContent();
}

function displayBagItemCount() {
  const bagItemCountIcon = document.querySelector(".bag-item-count");
  if (!bagItemCountIcon) {
    return;
  }

  const totalItemCount = bagItems.reduce((sum, entry) => sum + entry.quantity, 0);

  if (totalItemCount > 0) {
    bagItemCountIcon.innerText = totalItemCount;
    bagItemCountIcon.style.visibility = "visible";
    return;
  }

  bagItemCountIcon.innerText = "0";
  bagItemCountIcon.style.visibility = "hidden";
}

function displayHomepageContent(searchText = "") {
  const itemContainer = document.querySelector(".items-container");
  const itemsCountElement = document.querySelector(".items-count");
  const toolbarSummaryCount = document.querySelector(".toolbar-summary-count");
  if (!itemContainer || !Array.isArray(catalog)) {
    return;
  }

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredItems = catalog.filter((item) => {
    const searchableText = `${item.brand} ${item.title} ${item.category || ""}`.toLowerCase();
    const matchesSearch = normalizedSearchText
      ? searchableText.includes(normalizedSearchText)
      : true;
    const matchesCategory = activeCategory === "all" ? true : item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (itemsCountElement) {
    itemsCountElement.innerText = `${filteredItems.length} style${filteredItems.length === 1 ? "" : "s"}`;
  }

  if (toolbarSummaryCount) {
    toolbarSummaryCount.innerText = `${filteredItems.length} style${filteredItems.length === 1 ? "" : "s"}`;
  }

  if (filteredItems.length === 0) {
    itemContainer.innerHTML =
      "<p class='empty-results'>No products match this search. Try another keyword or category.</p>";
    return;
  }

  let innerHtml = "";
  for (const item of filteredItems) {
    const productPrice = getProductPrice(item);
    const productRating = item.rating;
    const productDiscountPercent = getProductDiscountPercent(item);
    const alreadyInBag = getItemQuantity(item.id) > 0;

    innerHtml += `
      <div class="item-container">
        <img class="item-image" src="./assets/images/items/${item.image}" alt="${item.title}" />
        <div class="item-rating-badge">${productRating.value} ★ • ${formatReviews(productRating.count)} reviews</div>
        <div class="item-content">
          <div class="item-company-name">${item.brand}</div>
          <div class="item-name">${item.title}</div>
          <div class="item-price">
            <span class="current-price">${formatRupees(productPrice.current)}</span>
            <span class="original-price">${formatRupees(productPrice.mrp)}</span>
            <span class="discount">(${productDiscountPercent}% OFF)</span>
          </div>
          <button class="btn-add-to-bag ${alreadyInBag ? "in-bag" : ""}" onclick="addToBag(${item.id})">
            ${alreadyInBag ? "Added to Bag" : "Add to Bag"}
          </button>
        </div>
      </div>
    `;
  }
  itemContainer.innerHTML = innerHtml;
}

function getStoredBagItems() {
  try {
    const bagItemStr = localStorage.getItem("bagItems");
    const parsedBagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
    return normalizeBagItems(parsedBagItems);
  } catch (error) {
    return [];
  }
}

function getItemQuantity(productId) {
  const bagEntry = bagItems.find((entry) => entry.productId === productId);
  return bagEntry ? bagEntry.quantity : 0;
}

function getProductDiscountPercent(product) {
  return Number(product?.price?.discountPercent) || 0;
}

function getProductPrice(product) {
  const mrp = Number(product?.price?.original) || 0;
  const discountPercent = Number(product?.price?.discountPercent) || 0;
  const current = Math.ceil(mrp * (1 - discountPercent / 100));
  return { current, mrp };
}
