# Myntra Clone

A responsive front-end Myntra clone built with plain HTML, CSS, and JavaScript.

This project includes:

- Home page with hero section and product listing
- Category-based filtering
- Live search over product title/brand/category
- Add-to-bag flow with quantity controls
- Shopping bag page with price summary and totals
- Persistent bag state using browser localStorage

## Tech Stack

- HTML5
- CSS3 (custom properties, grid/flex, responsive breakpoints)
- Vanilla JavaScript (DOM rendering + state handling)
- Font Awesome (icons via CDN)

## Project Structure

```
myntra/
├── index.html
├── pages/
│   └── bag.html
├── assets/
│   ├── css/
│   │   ├── index.css
│   │   └── bag.css
│   ├── data/
│   │   └── data.js
│   ├── scripts/
│   │   ├── index.js
│   │   └── bag.js
│   └── images/
│       ├── myntra_logo.webp
│       ├── banner.jpg
│       ├── items/
│       ├── offers/
│       └── categories/
└── README.md
```

## How To Run

Because this is a static project, no build step is required.

1. Open the project folder in VS Code.
2. Open `index.html` directly in a browser,
   or use a local server extension such as Live Server.
3. Navigate to the bag page from the header bag icon or open `pages/bag.html`.

## Main Functionality

### Product Catalog

- Product data comes from `assets/data/data.js`.
- Cards are rendered dynamically on the home page.

### Search and Category Filter

- Search input filters products in real time.
- Category chips narrow products by category.
- Result count updates automatically.

### Bag Management

- Clicking Add to Bag stores item id and quantity.
- Bag quantity is shown in the header icon.
- Bag page supports increment/decrement and remove actions.

### Price Calculation

- Current price is derived from MRP and discount percentage.
- Bag summary computes total MRP, discount, convenience fee, and final amount.

## Notes

- Bag data is stored in localStorage under the key `bagItems`.
- Clearing browser storage resets the bag.
- Font Awesome requires internet access because it is loaded from CDN.

## Future Improvements

- Add product detail page
- Add sorting controls (price, rating, newest)
- Add wishlist persistence
- Add checkout flow with form validation
- Add unit tests for pricing and bag logic
