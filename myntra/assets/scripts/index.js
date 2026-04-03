let itemContainer = document.querySelector(".items-container");

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
          <button class="btn-add-to-bag">Add to Bag</button>
        </div>
`;
}

itemContainer.innerHTML = innerHtml;
