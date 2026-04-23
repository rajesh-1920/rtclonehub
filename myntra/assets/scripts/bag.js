let bagItemObjects = [];
const freeShippingThreshold = 999;

(() => {
  bagItems = getStoredBagItems();
  loadBagItemObjects();
  displayBagItem();
  displayBagSummary();
})();

function loadBagItemObjects() {
  bagItemObjects = bagItems
    .map((bagEntry) => {
      const item = catalog.find((singleItem) => singleItem.id === bagEntry.productId);
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
  const shippingGap = Math.max(0, freeShippingThreshold - subtotal);
  const summaryNote =
    shippingGap > 0
      ? `${formatRupees(shippingGap)} more to unlock free shipping on eligible orders.`
      : "You have unlocked free shipping for this order.";

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
    <div class="bag-summary-note">${summaryNote}</div>
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
    containerElement.innerHTML = `<div class="empty-bag">Your bag is empty.<br /><a href="../index.html">Start shopping</a></div>`;
    return;
  }

  let bagItemsContainerInnerHtml = "";
  for (const item of bagItemObjects) {
    const productPrice = getProductPrice(item);
    const productDiscountPercent = getProductDiscountPercent(item);
    const deliveryLabel = getDeliveryLabel(3);

    bagItemsContainerInnerHtml += `
      <div class="bag-item-container">
        <div class="bag-item-left-part">
          <img class="bag-item-image" src="../assets/images/items/${item.image}" alt="${item.title}" />
        </div>
        <div class="bag-item-right-part">
          <div class="item-company-name">${item.brand}</div>
          <div class="item-name">${item.title}</div>
          <div class="item-price">
            <span class="current-price">${formatRupees(productPrice.current)}</span>
            <span class="original-price">${formatRupees(productPrice.mrp)}</span>
            <span class="discount">(${productDiscountPercent}% OFF)</span>
          </div>
          <div class="item-quantity-row">
            <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
            <span class="item-quantity">Qty: ${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
          </div>
          <div class="line-total">Item Total: ${formatRupees(productPrice.current * item.quantity)}</div>
          <div class="return-period">14 days return available</div>
          <div class="delivery-details">${deliveryLabel}</div>
        </div>
        <div class="remove-from-cart" title="Remove" onclick="removeFromBag(${item.id})">&times;</div>
      </div>
    `;
  }

  containerElement.innerHTML = bagItemsContainerInnerHtml;
}

function getDeliveryLabel(daysAhead) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysAhead);
  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return `Delivery by ${formattedDate}`;
}
