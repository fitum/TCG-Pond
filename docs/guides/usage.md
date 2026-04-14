# Usage Guide

This guide covers the everyday workflows in TCG Pond — browsing and filtering products, managing your cart, checking out, and viewing your order history. It also covers common catalogue maintenance tasks for developers.

---

## Browsing the Shop

Navigate to **Shop** (header link or `/shop`). The page opens on the first enabled TCG tab.

### TCG tabs

If more than one TCG is enabled, a tab row appears at the top of the shop. Click a tab to switch game catalogues. Each tab has its own set of products, filter state, and URL parameter (`?tcg=pokemon`).

### Search

Type in the **Search cards…** box to filter by card name or set name. The search is case-insensitive and updates results immediately.

### Filters

Click the **Filters** button (funnel icon) on mobile or use the sidebar on desktop to open the filter panel. Available filters:

| Filter | What it does |
|---|---|
| **Category** | Singles only, sealed only, or both |
| **Set** | Restrict to one expansion set |
| **Rarity** | Common, Uncommon, Rare, Ultra Rare, etc. |
| **Price range** | Minimum and maximum price in USD |
| **New arrivals** | Only products added within the last 30 days |

All filters are reflected in the URL query string, so you can bookmark or share a filtered view.

### Sorting

Use the **Sort** dropdown to order results by:

- Price: low → high / high → low
- Name: A → Z / Z → A
- Newest first

### Pagination

The shop shows **24 products per page**. Use the numbered pagination controls at the bottom to move between pages. The current page is stored in the `?page=` query parameter.

---

## Product Detail Page

Click any product card to open its detail page (`/product/:id`). The page shows:

- Full card name, set, and card number
- Rarity and variant (e.g. Holofoil)
- Condition (Near Mint, Lightly Played, etc.)
- Price and stock count
- **Add to Cart** button (disabled when out of stock)
- **New Arrival** badge if the card was added within the last 30 days

Use the browser **Back** button or the breadcrumb to return to the shop with your previous filters intact.

---

## Cart

### Adding items

- Click **Add to Cart** on a product card or the product detail page.
- The cart drawer opens automatically each time an item is added.
- Adding the same product again increments its quantity (capped at available stock).

### Cart drawer

The drawer slides in from the right. From here you can:

- Adjust quantity with the **+** / **−** buttons (quantity **0** removes the item)
- Remove an item with the trash icon
- See the running subtotal
- Proceed to **Checkout**

### Cart page

Navigate to `/cart` for the full-page cart view. It shows the same controls as the drawer plus a breakdown of items and totals.

### Persistence

The cart is saved to `localStorage` under the key `tcg-pond-cart`. It survives page reloads and browser restarts. To clear it manually, run this in the browser console:

```js
localStorage.removeItem('tcg-pond-cart');
```

---

## Checkout

!!! tip "Login not required"
    You can check out as a guest — the site does not enforce authentication at checkout. However, your order will only be saved to the Account page if you are logged in.

### Step 1 — Shipping information

Fill in:

- Full name
- Street address
- City
- ZIP / postal code
- Country

All fields are required. Click **Continue to Payment** to proceed.

### Step 2 — Payment details

Enter card details:

- Card number (16 digits)
- Expiry date (MM/YY)
- CVC (3 digits)

!!! warning "No real payment processing"
    Stripe packages are installed as placeholders but **no charges are made**. Any 16-digit number, valid-looking expiry, and 3-digit CVC will be accepted. Do not enter real card data.

Click **Place Order** to complete the purchase.

### Step 3 — Order confirmation

A success screen displays your **order ID** (format `ORD-XXXXXXX`), the order total, and a link back to the shop. The cart is automatically cleared.

**Free shipping** is applied when the cart subtotal is **$50.00 or more**; otherwise a flat $4.99 shipping fee is added.

---

## Account & Order History

### Registering

1. Click the **person icon** in the header, or the **Sign In** / **Register** link.
2. Switch to the **Register** tab.
3. Enter your name, email address, and a password.
4. Click **Create Account**.

*Expected outcome:* The modal closes and your name appears in the header. The simulated registration accepts any non-empty values.

### Logging in

1. Click the **person icon** in the header.
2. Enter your email and password.
3. Click **Sign In**.

The simulated login accepts any email/password combination, as long as neither field is empty. It reuses the same account (by email) across sessions.

### Order history

Navigate to `/account` while logged in. The page lists all orders placed in the current session, with:

- Order ID
- Date placed
- Items and quantities
- Shipping address
- Order total
- Status badge (`pending`, `processing`, `shipped`, `delivered`)

!!! tip
    Order history is persisted in `localStorage` under `tcg-pond-auth`. It survives page reloads but is tied to the browser — it will not sync across devices.

### Logging out

Click your name in the header → **Sign Out**. This clears the user session and order history from state (and from `localStorage`).

---

## Catalogue Maintenance (Developer Tasks)

### Adding a single card

Open `src/data/products.ts` and append a row to the `raw` array inside the `addTCG('pokemon')` wrapper:

```ts
// Single card
['Charizard ex', 'Scarlet & Violet Base', '006/258', 'Double Rare', 'Holofoil', 'Near Mint', 89.99, 0, 2, '2026-04-06'],
```

Field order: `name, set, cardNumber, rarity, variance, condition, marketPrice, priceOverride, stock, dateAdded`

| Field | Notes |
|---|---|
| `cardNumber` | Leave `''` for sealed products — this auto-sets `category = 'sealed'` |
| `priceOverride` | Set to a non-zero value to override `marketPrice`; `0` uses market price |
| `dateAdded` | `YYYY-MM-DD` — products within 30 days of the reference date get an **isNew** badge |

### Adding a sealed product

```ts
// Sealed product — empty cardNumber
['Scarlet & Violet Booster Box', 'Scarlet & Violet Base', '', '', '', 'Near Mint', 149.99, 0, 5, '2026-04-06'],
```

### Enabling a new TCG tab

1. Open `src/data/tcgConfig.ts`.
2. Set `enabled: true` for the desired game.

    ```ts
    { key: 'mtg', label: 'Magic: The Gathering', primary: '#1D4ED8', accent: '#D97706', enabled: true },
    ```

3. Add products for that TCG to `src/data/products.ts` using the matching `addTCG('mtg')` wrapper.
4. Save the files — the dev server will hot-reload and the new tab will appear in the shop.

See the [Configuration reference](../configuration.md) for full details on TCG flags and design tokens.
