let bagItems = [];
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
      entry.quantity > 0
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
    displayHomepageContent(searchInput.value);
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
  if (!itemContainer || !Array.isArray(catalog)) {
    return;
  }

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredItems = normalizedSearchText
    ? catalog.filter((item) => {
        const searchableText =
          `${item.brand} ${item.title} ${item.category || ""}`.toLowerCase();
        return searchableText.includes(normalizedSearchText);
      })
    : catalog;

  if (filteredItems.length === 0) {
    itemContainer.innerHTML =
      "<p class='empty-results'>No products found. Try a different search.</p>";
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
        <div class="item-ratings">${productRating.value} ★ | ${formatReviews(productRating.count)} Ratings</div>
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

