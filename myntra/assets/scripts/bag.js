let bagItemObjects;

(() => {
  loadBagItemObjects();
  displayBagItem();
  displayBagSummary();
})();

function displayBagSummary() {
  let bagSummaryElement = document.querySelector(`.bag-summary`);
  let totalItems = bagItems.length;
  let totalMRP = 0;
  let totalDiscount = 0;
  let convenienceFee = 99;
  let totalAmount = 0;

  for (let item of bagItemObjects) {
    totalMRP += item.item_price.original_price;
    totalAmount += item.item_price.current_price;
    totalDiscount += item.item_price.original_price - item.item_price.current_price;
  }
  totalAmount += convenienceFee;

  let bagSummaryInnerHtml = `
          <div class="bag-details-container">
            <div class="price-header">PRICE DETEAILS (${totalItems} Items)</div>
            <div class="price-item">
              <span class="price-item-tag">Total MRP</span>
              <span class="price-item-value">Rs${totalMRP}</span>
            </div>
            <div class="price-item">
              <span class="price-item-tag">Discount on MRP</span>
              <span class="price-item-value discount-value">Rs${totalDiscount}</span>
            </div>
            <div class="price-item">
              <span class="price-item-tag">convenience Fee</span>
              <span class="price-item-value">Rs${convenienceFee}</span>
            </div>
            <hr />
            <div class="price-item price-footer">
              <span class="price-item-tag">Total Amount</span>
              <span class="price-item-value">Rs${totalAmount}</span>
            </div>
          </div>
          <button class="btn-place-order">
            <div class="css-xjhrni">PLACE ORDER</div>
          </button>
  `;

  bagSummaryElement.innerHTML = bagSummaryInnerHtml;
}

function loadBagItemObjects() {
  bagItemObjects = bagItems.map((productId) => {
    for (let item of items) {
      if (productId == item.productId) {
        return item;
      }
    }
  });
}

function removeFromBag(productId) {
  console.log(bagItemObjects);
  bagItems = bagItems.filter((itemId) => productId != itemId);
  localStorage.setItem(`bagItems`, JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagItemCount();
  displayBagSummary();
  displayBagItem();
}

function displayBagItem() {
  let containerElement = document.querySelector(`.bag-items-container`);
  let bagItemsContainerInnerHtml = ``;
  for (let item of bagItemObjects) {
    bagItemsContainerInnerHtml += `
          <div class="bag-item-container">
            <div class="bag-item-left-part">
              <img class="bag-item-image" src="../assets/images/items/${item.item_image}" alt="item image" />
            </div>
            <div class="bag-item-right-part">
              <div class="item-company-name">${item.company_name}</div>
              <div class="item-name">${item.item_name}</div>
              <div class="item-price">
                <span class="current-price">Rs${item.item_price.current_price}</span>
                <span class="original-price">Rs${item.item_price.original_price}</span>
                <span class="discount">(${item.item_price.discount}% OFF)</span>
              </div>
              <div class="return-period">14 days return available</div>
              <div class="delivery-details">Delivery by 13 Apr 2026</div>
            </div>
            <div class="remove-from-cart" onclick="removeFromBag(${item.productId})">X</div>
          </div>
  `;
  }
  containerElement.innerHTML = bagItemsContainerInnerHtml;
}
