# API Reference

This page documents every public type, store, data helper, and component prop interface in TCG Pond.

---

## TypeScript Types (`src/types/index.ts`)

### `TCGKey`

```ts
type TCGKey = 'pokemon' | 'onePiece' | 'dragonball' | 'yugioh' | 'mtg';
```

Union of all supported trading card game identifiers. Used as the `tcg` field on `Product` and as a URL query parameter.

---

### `ProductCategory`

```ts
type ProductCategory = 'single' | 'sealed';
```

- `'single'` — an individual trading card
- `'sealed'` — a factory-sealed product (booster pack, box, etc.)

---

### `CardCondition`

```ts
type CardCondition =
  | 'Near Mint'
  | 'Lightly Played'
  | 'Moderately Played'
  | 'Heavily Played'
  | 'Damaged';
```

Standard TCG grading scale from best (`Near Mint`) to worst (`Damaged`).

---

### `OrderStatus`

```ts
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';
```

Lifecycle stages of an order. Currently set to `'pending'` at checkout creation.

---

### `TCGConfig`

```ts
interface TCGConfig {
  key: TCGKey;      // Internal identifier
  label: string;    // Display name (e.g. "Pokémon")
  primary: string;  // Primary brand colour (hex)
  accent: string;   // Accent brand colour (hex)
  enabled: boolean; // Whether to show this TCG in the shop
}
```

One entry per supported game in `tcgConfig.ts`.

---

### `Product`

```ts
interface Product {
  id: string;              // Derived: "<tcg>-<set slug>-<cardNumber or name slug>"
  name: string;            // Card or product name
  tcg: TCGKey;             // Which game this belongs to
  set: string;             // Set/expansion name
  cardNumber?: string;     // Collector number (omitted for sealed)
  rarity?: string;         // Rarity tier (omitted for sealed)
  variance?: string;       // Print variant (e.g. "Holofoil", "Normal")
  condition: CardCondition;
  price: number;           // USD — priceOverride if set, else marketPrice
  stock: number;           // Units available
  category: ProductCategory;
  isNew: boolean;          // true if dateAdded within 30 days of reference date
  dateAdded: string;       // ISO 8601 date string (YYYY-MM-DD)
}
```

---

### `CartItem`

```ts
interface CartItem {
  product: Product;
  quantity: number;
}
```

---

### `Address`

```ts
interface Address {
  name: string;    // Recipient full name
  street: string;  // Street address
  city: string;
  zip: string;     // ZIP or postal code
  country: string;
}
```

---

### `OrderItem`

```ts
interface OrderItem {
  productId: string;
  name: string;
  price: number;    // Price at time of purchase
  quantity: number;
}
```

---

### `Order`

```ts
interface Order {
  id: string;          // Format: "ORD-<7 alphanumeric chars>"
  items: OrderItem[];
  total: number;       // Grand total including shipping
  status: OrderStatus;
  address: Address;
  createdAt: string;   // ISO 8601 datetime string
}
```

---

### `User`

```ts
interface User {
  id: string;    // btoa(email) — deterministic, not cryptographically secure
  email: string;
  name: string;
}
```

---

## Cart Store (`src/store/cartStore.ts`)

Zustand store. Access via the `useCartStore` hook.

```ts
import { useCartStore } from '../store/cartStore';
```

### State

| Field | Type | Description |
|---|---|---|
| `items` | `CartItem[]` | Current cart contents (persisted) |
| `isOpen` | `boolean` | Whether the `CartDrawer` overlay is visible |

### Actions

#### `addItem(product: Product): void`

Adds a product to the cart. If it already exists, increments quantity up to `product.stock`. Also sets `isOpen = true` to show the drawer.

```ts
const { addItem } = useCartStore();
addItem(product);
```

---

#### `removeItem(productId: string): void`

Removes the cart line for the given product ID entirely.

```ts
const { removeItem } = useCartStore();
removeItem('pokemon-ascended-heroes-038-217');
```

---

#### `updateQuantity(productId: string, quantity: number): void`

Sets the quantity for a cart line. If `quantity <= 0`, the item is removed via `removeItem`.

```ts
const { updateQuantity } = useCartStore();
updateQuantity(productId, 3);
```

---

#### `clearCart(): void`

Empties the cart (used after a successful order).

---

#### `openCart(): void` / `closeCart(): void`

Show or hide the `CartDrawer` overlay.

---

#### `totalItems(): number`

Returns the sum of all item quantities.

```ts
const count = useCartStore((s) => s.totalItems());
```

---

#### `totalPrice(): number`

Returns the cart subtotal in USD.

```ts
const subtotal = useCartStore((s) => s.totalPrice());
```

---

## Auth Store (`src/store/authStore.ts`)

Zustand store. Access via the `useAuthStore` hook.

```ts
import { useAuthStore } from '../store/authStore';
```

### State

| Field | Type | Description |
|---|---|---|
| `user` | `User \| null` | Currently signed-in user (`null` = guest) |
| `orders` | `Order[]` | Order history for the current user |
| `isAuthOpen` | `boolean` | Whether the `AuthModal` is visible |
| `authMode` | `'login' \| 'register'` | Which form the modal displays |

### Actions

#### `login(email: string, password: string): Promise<boolean>`

Simulated login with a 600 ms delay. Accepts any non-empty email/password pair. Returns `true` on success and closes the modal.

> Replace the function body with a real `fetch` call when a backend is available.

```ts
const { login } = useAuthStore();
const ok = await login('user@example.com', 'secret');
```

---

#### `register(name: string, email: string, password: string): Promise<boolean>`

Simulated registration. Returns `true` on success and closes the modal.

---

#### `logout(): void`

Clears `user` and `orders` from state and localStorage.

---

#### `addOrder(order: Order): void`

Appends an order to the user's history. Called by `CheckoutPage` after payment.

```ts
const { addOrder } = useAuthStore();
addOrder(newOrder);
```

---

#### `openAuth(mode?: 'login' | 'register'): void`

Opens the `AuthModal`. Defaults to `'login'` mode.

```ts
openAuth('register'); // open the sign-up form
```

---

#### `closeAuth(): void`

Hides the `AuthModal`.

---

## Data Helpers (`src/data/products.ts`)

### `products: Product[]`

The full catalogue array, parsed from the internal `RawRow[]` tuple format at module load.

```ts
import { products } from '../data/products';
```

---

### `getProductById(id: string): Product | undefined`

Returns the product matching the given ID, or `undefined` if not found.

```ts
import { getProductById } from '../data/products';
const card = getProductById('pokemon-ascended-heroes-038-217');
```

---

### `getUniqueSets(tcg?: string): string[]`

Returns a sorted array of unique set names, optionally filtered to a specific TCG key.

```ts
import { getUniqueSets } from '../data/products';
const sets = getUniqueSets('pokemon');
// ['Aquapolis', 'Ascended Heroes', ...]
```

---

### `getUniqueRarities(tcg?: string): string[]`

Returns a sorted array of unique rarity strings, optionally filtered to a specific TCG key.

```ts
import { getUniqueRarities } from '../data/products';
const rarities = getUniqueRarities('pokemon');
// ['Common', 'Double Rare', 'Hyper Rare', ...]
```

---

## TCG Config Helpers (`src/data/tcgConfig.ts`)

### `TCG_CONFIG: TCGConfig[]`

Master array of all TCG entries (enabled and disabled).

---

### `enabledTCGs: TCGConfig[]`

Filtered subset of `TCG_CONFIG` where `enabled === true`. Used by `TCGTabs` and `ShopPage` to determine which games to show.

```ts
import { enabledTCGs } from '../data/tcgConfig';
```

---

### `getTCGConfig(key: string): TCGConfig | undefined`

Looks up a `TCGConfig` by its key. Returns `undefined` if not found.

```ts
import { getTCGConfig } from '../data/tcgConfig';
const cfg = getTCGConfig('pokemon');
// { key: 'pokemon', label: 'Pokémon', primary: '#CC0000', ... }
```

---

## Component Props

### `ProductCard`

```ts
interface Props {
  product: Product;
}
```

Renders a product tile with rarity badge, name, set, price, stock count, and an "Add to Cart" button. Navigates to `/product/:id` on click.

---

### `TCGTabs`

```ts
interface Props {
  activeTCG?: TCGKey;
}
```

Renders a horizontally scrollable row of pill buttons, one per enabled TCG. Navigates to `/shop?tcg=<key>` on selection. Returns `null` when fewer than two TCGs are enabled.

---

### `ShopFilters`

No external props. Reads and writes URL search params directly via `useSearchParams`. Calls `getUniqueSets` and `getUniqueRarities` with the current `tcg` param to populate dropdowns.

---

### `CartDrawer`

No props. Reads state from `useCartStore`. Renders as a fixed right-side overlay with a backdrop. Returns `null` when `isOpen` is `false`.

---

### `AuthModal`

No props. Reads state from `useAuthStore`. Renders as a centred modal overlay. Returns `null` when `isAuthOpen` is `false`.

---

## URL Query Parameters (ShopPage)

| Parameter | Type | Description |
|---|---|---|
| `tcg` | `TCGKey` | Active game tab |
| `category` | `'single' \| 'sealed'` | Filter by product category |
| `rarity` | `string` | Filter by rarity name |
| `set` | `string` | Filter by set/expansion name |
| `sort` | `'price-asc' \| 'price-desc' \| 'name-asc' \| 'name-desc' \| 'new'` | Sort order |
| `q` | `string` | Full-text search (name and set) |
| `new` | `'true'` | Show new arrivals only |
| `min` | `number` | Minimum price filter |
| `max` | `number` | Maximum price filter |
| `page` | `number` | Current page (1-indexed, 24 per page) |
