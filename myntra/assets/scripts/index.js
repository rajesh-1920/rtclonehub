let bagItems;

(() => {
  let bagItemStr = localStorage.getItem(`bagItems`);
  bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  displayBagItemCount();
  dispalyHomepageContent();
})();

function addToBag(productId) {
  bagItems.push(productId);
  displayBagItemCount();
  localStorage.setItem(`bagItems`, JSON.stringify(bagItems));
}

function displayBagItemCount() {
  let bagItemCountIcon = document.querySelector(`.bag-item-count`);
  if (bagItems.length) {
    bagItemCountIcon.innerText = bagItems.length;
    bagItemCountIcon.style.visibility = "visible";
  } else {
    bagItemCountIcon.style.visibility = "hidden";
  }
}

function dispalyHomepageContent() {
  let itemContainer = document.querySelector(".items-container");
  if (!itemContainer) {
    return;
  }
  let innerHtml = ``;
  for (let item of items) {
    innerHtml += `
        <div class="item-container">
          <img class="item-image" src="./assets/images/items/${item.item_image}" alt="item image" />
          <div class="item-ratings">${item.rating.stars} ⭐ |${item.rating.reviews}K</div>
          <div class="item-company-name">${item.company_name}</div>
          <div class="item-name">${item.item_name}</div>
          <div class="item-price">
            <span class="current-price">RS ${item.item_price.current_price}</span>
            <span class="original-price">RS ${item.item_price.original_price}</span>
            <span class="discount">(${item.item_price.discount}% OFF)</span>
          </div>
          <button class="btn-add-to-bag" onclick="addToBag(${item.productId})">Add to Bag</button>
        </div>
    `;
  }
  itemContainer.innerHTML = innerHtml;
}
