# TCG Pond

A dark-themed **Pokémon TCG storefront** built with React 19, TypeScript, Vite, Tailwind CSS, and Zustand.  
Browse singles and sealed products, manage a persistent cart, and check out with a simulated payment flow — all client-side.

---

## Features

- **Product catalogue** — singles and sealed products with rarity, set, condition, and price
- **Advanced filtering** — by category, set, rarity, price range, new arrivals, and full-text search
- **Persistent cart** — survives page reloads via `localStorage`
- **Authentication** — simulated login/register; swap in a real API with one function change
- **Multi-step checkout** — shipping → payment → order confirmation
- **Order history** — stored per user session in the Account page
- **Multi-TCG ready** — enable One Piece, Dragon Ball, Yu-Gi-Oh!, and MTG with a single flag

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-org/tcg-pond.git
cd tcg-pond

# 2. Install
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
```

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19 |
| Language | TypeScript 6 |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 3 |
| State | Zustand 5 |
| Routing | React Router 7 |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── App.tsx                 ← Router shell
├── types/index.ts          ← Shared TypeScript types
├── data/
│   ├── products.ts         ← Static product catalogue
│   └── tcgConfig.ts        ← TCG feature flags
├── store/
│   ├── cartStore.ts        ← Cart state (Zustand + persist)
│   └── authStore.ts        ← Auth + orders (Zustand + persist)
├── components/
│   ├── layout/             ← Header, Footer
│   ├── shop/               ← TCGTabs, ProductCard, ShopFilters
│   ├── cart/               ← CartDrawer
│   └── auth/               ← AuthModal
└── pages/
    ├── HomePage.tsx
    ├── ShopPage.tsx
    ├── ProductDetailPage.tsx
    ├── CartPage.tsx
    ├── CheckoutPage.tsx
    └── AccountPage.tsx
```

---

## Adding Products

Products are defined as compact tuples in `src/data/products.ts`:

```
[name, set, cardNumber, rarity, variance, condition, marketPrice, priceOverride, stock, dateAdded]
```

- Leave `cardNumber` empty for sealed products
- Set `priceOverride > 0` to override the market price

---

## Enabling More TCGs

Edit `src/data/tcgConfig.ts` and set `enabled: true` for the desired game:

```ts
{ key: 'mtg', label: 'Magic: The Gathering', ..., enabled: true }
```

---

## Documentation

Full documentation is in the `docs/` folder and served via MkDocs:

```bash
pip install mkdocs-material
mkdocs serve
# → http://127.0.0.1:8000
```

- [Architecture](docs/architecture.md)
- [Configuration](docs/configuration.md)
- [API Reference](docs/api/index.md)
- [Guides](docs/guides/getting-started.md)

---

## License

MIT
