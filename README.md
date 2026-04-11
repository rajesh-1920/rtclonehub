# RT Clone Hub

RT Clone Hub is a personal learning project where I build and organize website clone projects (Myntra, Facebook, Amajon, etc.) in one place.

The project includes a professional landing website built with HTML5, Tailwind CSS, and Vanilla JavaScript, plus separate folders for each clone.

## Features

- Responsive landing page with modern UI
- Reusable shared navbar component generated from JavaScript
- Shared clone project data source for cards
- Dedicated pages: Home, Clones, About, Contact
- Separate CSS and JS files for each page

## Tech Stack

- HTML5
- Tailwind CSS (CDN + custom config)
- Vanilla JavaScript
- Custom CSS theme system

## Project Structure

```text
rtclonehub/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   ├── theme.css
│   │   ├── index.css
│   │   ├── clones.css
│   │   ├── about.css
│   │   └── contact.css
│   └── js/
│       ├── tailwind-config.js
│       ├── site.js
│       ├── index.js
│       ├── clones.js
│       ├── about.js
│       └── contact.js
├── pages/
│   ├── clones.html
│   ├── about.html
│   └── contact.html
├── myntra/
├── facebook/
└── amajon/
```

## Getting Started

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in your browser (or use Live Server).

## Purpose

This repository is focused on learning by building real UI clones and improving frontend architecture step by step.

## Future Improvements

- Add more clone projects
- Add project thumbnails and tags
- Add backend/API integration for contact and project metadata
