# TCG Pond

TCG Pond is a dark-themed Pokémon Trading Card Game storefront built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It lets collectors browse hundreds of single cards and sealed products, add items to a persistent cart, authenticate with a simulated account system, and complete a multi-step checkout — all rendered client-side with no backend required out of the box.

![Hero banner](assets/screenshots/hero.png)

---

## Key Features

- **Product catalogue** — singles and sealed products with rarity, set, condition, and price metadata
- **Advanced filtering** — filter by TCG, category, set, rarity, price range, and new arrivals; full-text search
- **Persistent cart** — Zustand + `localStorage` keeps the cart between page reloads
- **Authentication** — simulated login/register modal; swap for a real API when ready
- **Multi-step checkout** — shipping address → payment details → order confirmation
- **Order history** — persisted per user session; viewable on the Account page
- **Multi-TCG ready** — architecture supports Pokémon, One Piece, Dragon Ball, Yu-Gi-Oh!, and MTG; enable with a single flag
- **Responsive** — mobile-first design with a hamburger nav and touch-friendly controls

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 + |
| npm | 9 + |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/tcg-pond.git
cd tcg-pond

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173

# 5. Build for production
npm run build
```

> The dev server starts at `http://localhost:5173` by default. The production build outputs to `dist/`.

---

## Project Layout

```
tcg-pond/
├── src/
│   ├── App.tsx                 ← Root component; router + layout shell
│   ├── main.tsx                ← React entry point
│   ├── types/index.ts          ← All shared TypeScript types
│   ├── data/
│   │   ├── products.ts         ← Product catalogue (raw CSV → Product[])
│   │   └── tcgConfig.ts        ← TCG tab definitions and feature flags
│   ├── store/
│   │   ├── cartStore.ts        ← Zustand cart store (persisted)
│   │   └── authStore.ts        ← Zustand auth/order store (persisted)
│   ├── components/
│   │   ├── layout/             ← Header, Footer
│   │   ├── shop/               ← TCGTabs, ProductCard, ShopFilters
│   │   ├── cart/               ← CartDrawer
│   │   └── auth/               ← AuthModal
│   └── pages/
│       ├── HomePage.tsx
│       ├── ShopPage.tsx
│       ├── ProductDetailPage.tsx
│       ├── CartPage.tsx
│       ├── CheckoutPage.tsx
│       └── AccountPage.tsx
├── public/                     ← Static assets (favicon, icons)
├── tailwind.config.js
├── vite.config.ts
└── index.html
```

---

## Further Reading

- [Architecture](architecture.md) — component hierarchy, data flow, state management
- [Configuration](configuration.md) — TCG flags, Tailwind tokens, environment variables
- [API Reference](api/index.md) — stores, data helpers, and TypeScript types
