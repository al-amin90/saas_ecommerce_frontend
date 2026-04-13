# SoleCraft — Premium Shoe Website

A full-featured shoe e-commerce website built with Next.js and Material UI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
shoe-website/
├── pages/
│   ├── _app.js          # Theme provider, fonts
│   └── index.js         # Home page
├── src/
│   ├── components/
│   │   ├── Navbar.js        # Sticky navbar with search, cart, wishlist
│   │   ├── HeroSlider.js    # Full-screen hero carousel (Swiper.js)
│   │   ├── FeaturesBar.js   # Delivery/Returns/Warranty/Support bar
│   │   ├── CategoryBanners.js  # Men's/Women's/Running/Boots grid
│   │   ├── ProductCard.js   # Product card with hover animations
│   │   ├── ShopSection.js   # Full shop with filters, categories, sort
│   │   ├── BrandsSection.js # Infinite scrolling brand marquee
│   │   ├── Testimonials.js  # Customer reviews grid
│   │   ├── Newsletter.js    # Email subscription
│   │   └── Footer.js        # Full footer with links, payment methods
│   ├── data/
│   │   └── products.js   # Product data (8 products)
│   └── theme/
│       └── theme.js      # MUI theme (Syne + DM Sans fonts)
├── styles/
│   └── globals.css       # Global styles, scrollbar, animations
├── next.config.js
└── package.json
```

## 🎨 Design System

- **Fonts**: Syne (headings, bold) + DM Sans (body text)
- **Colors**:
  - Primary: `#1A1A1A` (near black)
  - Accent: `#C8A97E` (warm gold)
  - Background: `#FAFAF8` (warm white)
- **Style**: Clean, editorial luxury — inspired by premium international shoe stores

## ✨ Features

- 📱 Fully responsive (mobile, tablet, desktop)
- 🎠 Auto-play hero carousel (Swiper.js)
- 🔍 Search with expand/collapse animation
- 🎯 Category filtering tabs
- 🏷️ Price range slider + brand checkboxes filter drawer
- 💛 Add to wishlist (per product)
- 🛒 Add to bag with success feedback
- 🔤 Infinite brand marquee scroll
- 📧 Newsletter subscription
- 🌙 Polished hover animations throughout

## 📦 Dependencies

- `next` 14
- `@mui/material` + `@mui/icons-material`
- `@emotion/react` + `@emotion/styled`
- `swiper` 11 (hero carousel)

## 🛠️ Customization

1. **Products**: Edit `src/data/products.js` to add/edit products
2. **Colors**: Edit `src/theme/theme.js` palette
3. **Hero slides**: Edit `heroSlides` in `src/data/products.js`
4. **Currency**: Search `৳` to change from BDT to your currency
