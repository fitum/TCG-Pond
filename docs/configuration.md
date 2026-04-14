# Configuration

## TCG Feature Flags

TCG tabs are controlled by the `TCG_CONFIG` array in `src/data/tcgConfig.ts`. Set `enabled: true` to make a game appear in the shop navigation.

```ts
// src/data/tcgConfig.ts
export const TCG_CONFIG: TCGConfig[] = [
  { key: 'pokemon',    label: 'Pokémon',             primary: '#CC0000', accent: '#FFCB05', enabled: true  },
  { key: 'onePiece',   label: 'One Piece',            primary: '#E31E24', accent: '#1a56db', enabled: false },
  { key: 'dragonball', label: 'Dragon Ball',          primary: '#FF7F00', accent: '#FFD700', enabled: false },
  { key: 'yugioh',     label: 'Yu-Gi-Oh!',            primary: '#6B21A8', accent: '#DBA309', enabled: false },
  { key: 'mtg',        label: 'Magic: The Gathering', primary: '#1D4ED8', accent: '#D97706', enabled: false },
];
```

| Field | Type | Description |
|---|---|---|
| `key` | `TCGKey` | Internal identifier; used as URL param and product field |
| `label` | `string` | Human-readable tab label |
| `primary` | `string` (hex) | Tab border / badge background colour |
| `accent` | `string` (hex) | Secondary highlight colour |
| `enabled` | `boolean` | `true` = visible in shop; `false` = hidden |

> When only one TCG is enabled, the `TCGTabs` component renders nothing (no single-item tab strip).

---

## "New Arrivals" Threshold

A product is flagged `isNew = true` when its `dateAdded` falls within **30 days** of the reference date hard-coded in `src/data/products.ts`:

```ts
const REFERENCE_DATE = '2026-04-06';
const NEW_WINDOW_DAYS = 30;
```

To update the threshold, edit these two constants.

---

## Shipping Rules

Free shipping is applied when the cart subtotal reaches a threshold defined in `CheckoutPage.tsx`:

```ts
const FREE_SHIPPING_THRESHOLD = 50;   // USD
const SHIPPING_COST = 4.99;           // USD

const shipping = totalPrice() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
```

---

## Pagination

The shop page shows 24 products per page. Change `PAGE_SIZE` in `src/pages/ShopPage.tsx`:

```ts
const PAGE_SIZE = 24;
```

---

## Tailwind Design Tokens

All custom tokens live in `tailwind.config.js`.

### `pond` colour palette (dark UI)

| Token | Hex | Usage |
|---|---|---|
| `pond-bg` | `#080c18` | Page background |
| `pond-surface` | `#0f1623` | Header, footer, modal backgrounds |
| `pond-card` | `#151d2e` | Card backgrounds, inputs |
| `pond-border` | `#1e2a3a` | Borders, dividers |
| `pond-muted` | `#4a5568` | Disabled text, placeholders |
| `pond-text` | `#e2e8f0` | Primary text |
| `pond-subtle` | `#94a3b8` | Secondary / label text |

### TCG colour pairs

| Token | Primary | Accent |
|---|---|---|
| `pokemon` | `#CC0000` | `#FFCB05` |
| `onepiece` | `#E31E24` | `#1a56db` |
| `dragonball` | `#FF7F00` | `#FFD700` |
| `yugioh` | `#6B21A8` | `#DBA309` |
| `mtg` | `#1D4ED8` | `#D97706` |

### Custom shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.5)` | Product card hover shadow |
| `shadow-glow` | `0 0 20px rgba(204,0,0,0.3)` | Hero CTA button glow |

### Custom animations

| Token | Definition | Used by |
|---|---|---|
| `animate-fade-in` | `opacity 0→1, 200ms ease-out` | `AuthModal` |
| `animate-slide-in` | `translateX(100%→0), 250ms ease-out` | `CartDrawer` |

---

## localStorage Keys

| Key | Store | Contents |
|---|---|---|
| `tcg-pond-cart` | `cartStore` | `{ items: CartItem[] }` |
| `tcg-pond-auth` | `authStore` | `{ user: User \| null, orders: Order[] }` |

To clear persisted state during development, run in the browser console:

```js
localStorage.removeItem('tcg-pond-cart');
localStorage.removeItem('tcg-pond-auth');
```

---

## Environment Variables

TCG Pond has no required environment variables in its default (static) configuration. The Stripe SDK packages are listed as dependencies but are not wired up — they are placeholders for a future real payment integration.

When you add a backend, create a `.env` file at the project root:

```env
# Example — not required today
VITE_API_BASE_URL=https://api.example.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

All `VITE_` prefixed variables are exposed to the browser bundle by Vite.

---

## Build & Dev Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR on `localhost:5173` |
| `build` | `tsc -b && vite build` | Type-check then produce production bundle in `dist/` |
| `preview` | `vite preview` | Serve the `dist/` build locally |
| `lint` | `eslint .` | Run ESLint across all source files |

---

## TypeScript Configuration

Three tsconfig files are used:

| File | Purpose |
|---|---|
| `tsconfig.json` | Root; references the two below |
| `tsconfig.app.json` | Browser source (`src/`) — targets ES2020, strict mode |
| `tsconfig.node.json` | Vite config file — targets ESNext, Node types |
