let itemContainer = document.querySelector(".items-container");

const item = {
  item_image: "banner.jpg",
  rating: {
    stars: 4.5,
    reviews: 14000,
  },
  company_name: "carlton london",
  item_name: "routed plated CZ florda",
  item_price: {
    current_price: 600,
    original_price: 1045,
    discount: 42,
  },
};

itemContainer.innerHTML = `
        <div class="item-container">
          <img class="item-image" src="./assets/images/${item.item_image}" alt="item image" />
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
