let bagItemObjects = [];
const catalog = Array.isArray(products) ? products : Array.isArray(items) ? items : [];

(() => {
  if (!Array.isArray(bagItems)) {
    bagItems = getStoredBagItems();
  }
  loadBagItemObjects();
  displayBagItem();
  displayBagSummary();
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

function formatRupees(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
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

function loadBagItemObjects() {
  bagItemObjects = bagItems
    .map((bagEntry) => {
      const item = catalog.find((singleItem) => getProductId(singleItem) === bagEntry.productId);
      if (!item) {
        return null;
      }

      return {
        ...item,
        quantity: bagEntry.quantity,
      };
    })
    .filter(Boolean);
}

function displayBagSummary() {
  const bagSummaryElement = document.querySelector(".bag-summary");
  if (!bagSummaryElement) {
    return;
  }

  const totalItems = bagItemObjects.reduce((sum, item) => sum + item.quantity, 0);
  const totalMRP = bagItemObjects.reduce(
    (sum, item) => sum + getProductPrice(item).mrp * item.quantity,
    0,
  );
  const totalDiscount = bagItemObjects.reduce((sum, item) => {
    const price = getProductPrice(item);
    return sum + (price.mrp - price.current) * item.quantity;
  }, 0);
  const subtotal = bagItemObjects.reduce(
    (sum, item) => sum + getProductPrice(item).current * item.quantity,
    0,
  );
  const convenienceFee = totalItems > 0 ? 99 : 0;
  const totalAmount = subtotal + convenienceFee;

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItems} ${totalItems === 1 ? "Item" : "Items"})</div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">${formatRupees(totalMRP)}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value discount-value">- ${formatRupees(totalDiscount)}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">${formatRupees(convenienceFee)}</span>
      </div>
      <div class="price-item price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">${formatRupees(totalAmount)}</span>
      </div>
    </div>
    <button class="btn-place-order">PLACE ORDER</button>
  `;
}

function removeFromBag(productId) {
  const indexToRemove = bagItems.findIndex((entry) => entry.productId === productId);
  if (indexToRemove !== -1) {
    bagItems.splice(indexToRemove, 1);
  }

  saveBagItems();
  loadBagItemObjects();
  displayBagItemCount();
  displayBagItem();
  displayBagSummary();
}

function increaseQuantity(productId) {
  const bagEntry = bagItems.find((entry) => entry.productId === productId);
  if (!bagEntry) {
    return;
  }

  bagEntry.quantity += 1;
  saveBagItems();
  loadBagItemObjects();
  displayBagItemCount();
  displayBagItem();
  displayBagSummary();
}

function decreaseQuantity(productId) {
  const bagEntry = bagItems.find((entry) => entry.productId === productId);
  if (!bagEntry) {
    return;
  }

  if (bagEntry.quantity > 1) {
    bagEntry.quantity -= 1;
  } else {
    removeFromBag(productId);
    return;
  }

  saveBagItems();
  loadBagItemObjects();
  displayBagItemCount();
  displayBagItem();
  displayBagSummary();
}

function displayBagItem() {
  const containerElement = document.querySelector(".bag-items-container");
  if (!containerElement) {
    return;
  }

  if (bagItemObjects.length === 0) {
    containerElement.innerHTML = `<div class="empty-bag">Your bag is empty. Add items from home page.</div>`;
    return;
  }

  let bagItemsContainerInnerHtml = "";
  for (const item of bagItemObjects) {
    const productPrice = getProductPrice(item);
    const productDiscountPercent = getProductDiscountPercent(item);

    bagItemsContainerInnerHtml += `
      <div class="bag-item-container">
        <div class="bag-item-left-part">
          <img class="bag-item-image" src="../assets/images/items/${getProductImage(item)}" alt="${getProductTitle(item)}" />
        </div>
        <div class="bag-item-right-part">
          <div class="item-company-name">${getProductBrand(item)}</div>
          <div class="item-name">${getProductTitle(item)}</div>
          <div class="item-price">
            <span class="current-price">${formatRupees(productPrice.current)}</span>
            <span class="original-price">${formatRupees(productPrice.mrp)}</span>
            <span class="discount">(${productDiscountPercent}% OFF)</span>
          </div>
          <div class="item-quantity-row">
            <button class="qty-btn" onclick="decreaseQuantity(${getProductId(item)})">-</button>
            <span class="item-quantity">Qty: ${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQuantity(${getProductId(item)})">+</button>
          </div>
          <div class="line-total">Item Total: ${formatRupees(productPrice.current * item.quantity)}</div>
          <div class="return-period">14 days return available</div>
          <div class="delivery-details">Delivery by 13 Apr 2026</div>
        </div>
        <div class="remove-from-cart" title="Remove" onclick="removeFromBag(${getProductId(item)})">&times;</div>
      </div>
    `;
  }

  containerElement.innerHTML = bagItemsContainerInnerHtml;
}
