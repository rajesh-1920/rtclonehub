let bagItemObjects;

(() => {
  loadBagItemObjects();
  displayBagItem();
})();

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
                <span class="current-price">RS ${item.item_price.current_price}</span>
                <span class="original-price">RS ${item.item_price.original_price}</span>
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
