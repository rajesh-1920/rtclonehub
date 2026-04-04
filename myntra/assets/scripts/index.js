let bagItems = [];
const catalog = Array.isArray(products) ? products : Array.isArray(items) ? items : [];

(() => {
  bagItems = getStoredBagItems();
  if (!Array.isArray(bagItems)) {
    bagItems = [];
  }
  displayBagItemCount();
  setupSearch();
  displayHomepageContent();
})();

function getStoredBagItems() {
  try {
    const bagItemStr = localStorage.getItem("bagItems");
    const parsedBagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
    return normalizeBagItems(parsedBagItems);
  } catch (error) {
    return [];
  }
}

function normalizeBagItems(rawBagItems) {
  if (!Array.isArray(rawBagItems)) {
    return [];
  }

  // Support legacy format: [1, 2, 2] and new format: [{ productId: 1, quantity: 2 }]
  const quantityMap = new Map();

  for (const entry of rawBagItems) {
    if (typeof entry === "number") {
      quantityMap.set(entry, (quantityMap.get(entry) || 0) + 1);
      continue;
    }

    if (
      entry &&
      typeof entry === "object" &&
      Number.isInteger(entry.productId) &&
      Number.isInteger(entry.quantity) &&
      entry.quantity > 0
    ) {
      quantityMap.set(entry.productId, (quantityMap.get(entry.productId) || 0) + entry.quantity);
    }
  }

  return Array.from(quantityMap.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function saveBagItems() {
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
}

function getItemQuantity(productId) {
  const bagEntry = bagItems.find((entry) => entry.productId === productId);
  return bagEntry ? bagEntry.quantity : 0;
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

function getProductId(product) {
  return product.id ?? product.productId;
}

function getProductImage(product) {
  return product.image ?? product.item_image;
}

function getProductBrand(product) {
  return product.brand ?? product.company_name;
}

function getProductTitle(product) {
  return product.title ?? product.item_name;
}

function getProductPrice(product) {
  if (product.price) {
    return {
      current: product.price.current,
      mrp: product.price.mrp,
    };
  }

  return {
    current: product.item_price.current_price,
    mrp: product.item_price.original_price,
  };
}

function getProductDiscountPercent(product) {
  const price = getProductPrice(product);
  return Math.round(((price.mrp - price.current) / price.mrp) * 100);
}

function getProductRating(product) {
  if (product.rating && typeof product.rating.value === "number") {
    return {
      value: product.rating.value,
      count: product.rating.count,
    };
  }

  return {
    value: product.rating.stars,
    count: product.rating.reviews,
  };
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
          `${getProductBrand(item)} ${getProductTitle(item)} ${item.category || ""}`.toLowerCase();
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
    const productId = getProductId(item);
    const productPrice = getProductPrice(item);
    const productRating = getProductRating(item);
    const productDiscountPercent = getProductDiscountPercent(item);
    const alreadyInBag = getItemQuantity(productId) > 0;

    innerHtml += `
      <div class="item-container">
        <img class="item-image" src="./assets/images/items/${getProductImage(item)}" alt="${getProductTitle(item)}" />
        <div class="item-ratings">${productRating.value} ★ | ${formatReviews(productRating.count)} Ratings</div>
        <div class="item-company-name">${getProductBrand(item)}</div>
        <div class="item-name">${getProductTitle(item)}</div>
        <div class="item-price">
          <span class="current-price">${formatRupees(productPrice.current)}</span>
          <span class="original-price">${formatRupees(productPrice.mrp)}</span>
          <span class="discount">(${productDiscountPercent}% OFF)</span>
        </div>
        <button
          class="btn-add-to-bag ${alreadyInBag ? "in-bag" : ""}"
          onclick="addToBag(${productId})"
        >
          ${alreadyInBag ? "Added to Bag" : "Add to Bag"}
        </button>
      </div>
    `;
  }

  itemContainer.innerHTML = innerHtml;
}
