# Getting Started

By the end of this guide you will have TCG Pond running locally in your browser, with the shop displaying products and the cart working end-to-end.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | 18 or later | Check with `node -v` |
| **npm** | 9 or later | Bundled with Node.js; check with `npm -v` |
| **Git** | Any recent version | Only needed to clone the repo |

No backend, database, or third-party API account is required to run the default configuration.

!!! tip "Node version managers"
    If you manage multiple Node versions, [nvm](https://github.com/nvm-sh/nvm) (macOS / Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) make switching easy.

---

## Installation

1. **Clone the repository.**

    ```bash
    git clone https://github.com/your-org/tcg-pond.git
    cd tcg-pond
    ```

    *Expected outcome:* You are now inside the `tcg-pond/` directory.

2. **Install dependencies.**

    ```bash
    npm install
    ```

    npm downloads React, Vite, Tailwind CSS, Zustand, React Router, and all dev tooling into `node_modules/`. This typically takes 15–30 seconds.

    *Expected outcome:* The command exits with no errors and you see a summary such as `added 312 packages`.

    !!! warning "Windows path lengths"
        If you see `ENAMETOOLONG` errors on Windows, enable long path support:
        ```powershell
        git config --system core.longpaths true
        ```

---

## Configuration

TCG Pond works out of the box with no required environment variables. The only file you may want to inspect before first run is **`src/data/tcgConfig.ts`**, which controls which game tabs appear in the shop.

By default, only **Pokémon** is enabled:

```ts
// src/data/tcgConfig.ts
export const TCG_CONFIG: TCGConfig[] = [
  { key: 'pokemon', label: 'Pokémon', primary: '#CC0000', accent: '#FFCB05', enabled: true  },
  { key: 'onePiece', label: 'One Piece', ...,             enabled: false },
  { key: 'dragonball', label: 'Dragon Ball', ...,         enabled: false },
  { key: 'yugioh', label: 'Yu-Gi-Oh!', ...,               enabled: false },
  { key: 'mtg', label: 'Magic: The Gathering', ...,       enabled: false },
];
```

You don't need to change anything here to run the app — move on to the first run, then come back to explore the options.

---

## First Run

1. **Start the development server.**

    ```bash
    npm run dev
    ```

    *Expected output:*

    ```
      VITE v8.x.x  ready in 300 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
    ```

2. **Open the app in your browser.**

    Navigate to [http://localhost:5173](http://localhost:5173).

    ![TCG Pond hero banner](../assets/screenshots/hero.png)

    You should see the dark-themed storefront with a hero section and navigation bar. Clicking **Shop** takes you to the product catalogue.

3. **Verify the shop loads.**

    Go to **Shop** → you should see product cards for Pokémon singles and sealed products. The filter sidebar on the left lets you narrow by category, set, rarity, price, and new arrivals.

    <div class="screenshot-placeholder">
      📷 Screenshot: Shop page showing product grid with filter sidebar open
    </div>

4. **Add an item to your cart.**

    Click **Add to Cart** on any product card. A cart drawer slides in from the right confirming your item. The cart icon in the header shows a badge with the item count.

    *Expected outcome:* Cart drawer opens with one item; badge on the cart icon reads "1".

The development server supports **Hot Module Replacement (HMR)** — any change you save to a source file refreshes the relevant part of the app in the browser instantly without a full page reload.

---

## Stopping and Restarting

- **Stop** the server: press `Ctrl+C` in the terminal.
- **Restart** at any time: run `npm run dev` again from the project root.
- Your cart and auth state are persisted in `localStorage`, so they survive restarts.

---

## Next Steps

| What you want to do | Where to go |
|---|---|
| Browse filtering, checkout, and account features | [Usage Guide](usage.md) |
| Enable more TCG tabs or tune colours, prices, and pagination | [Configuration](../configuration.md) |
| Deploy the site to production | [Deployment Guide](deployment.md) |
| Diagnose an error | [Troubleshooting](troubleshooting.md) |
| Understand data flow and component structure | [Architecture](../architecture.md) |
