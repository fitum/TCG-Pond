# Troubleshooting

This page covers the most common problems encountered when installing, developing, building, or deploying TCG Pond.

---

## Installation Issues

### `npm install` fails with peer dependency errors

**Symptom:** The terminal shows `ERESOLVE` or peer dependency conflict errors.

**Fix:** Use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

If the error persists, ensure you are on Node.js 18 or later:

```bash
node -v   # should print v18.x.x or higher
```

---

### `npm install` is very slow or hangs

**Symptom:** npm appears to stall, especially on the first install.

**Fixes:**

- Check your internet connection.
- Clear the npm cache and retry:

    ```bash
    npm cache clean --force
    npm install
    ```

- If you are behind a corporate proxy, configure it:

    ```bash
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```

---

### `ENAMETOOLONG` on Windows

**Symptom:** File paths inside `node_modules` exceed the Windows 260-character limit.

**Fix:** Enable long path support:

```powershell
# Run as Administrator
git config --system core.longpaths true
```

Then delete `node_modules` and reinstall:

```bash
rmdir /s /q node_modules
npm install
```

---

## Development Server Issues

### Port 5173 is already in use

**Symptom:**

```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:** Either stop the process using the port, or start the server on a different port:

```bash
npm run dev -- --port 3000
```

---

### Blank page at `http://localhost:5173`

**Symptom:** The browser shows a white/blank page with no error in the UI.

**Fixes:**

1. Open the browser developer console (`F12` → Console tab) and look for JavaScript errors.
2. Check the terminal where `npm run dev` is running for compilation errors.
3. Hard-refresh the browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS).
4. Clear `localStorage` and reload:

    ```js
    localStorage.clear();
    location.reload();
    ```

---

### Changes not reflecting in the browser

**Symptom:** You edited a file but the browser still shows the old version.

**Fixes:**

- Vite's HMR should update the page automatically. If it does not, try a manual refresh.
- Confirm the dev server is still running in the terminal (no errors, no "disconnected" message).
- Check that you saved the file (Vite watches disk writes, not unsaved buffer state).

---

### TypeScript errors in the terminal

**Symptom:** The dev server starts but prints red TypeScript errors.

!!! tip
    Vite does **not** block the dev server on TypeScript errors — the app may still run with type errors present. However, `npm run build` will fail.

**Fix:** Read the error message carefully — it includes the file path and line number. Common causes:

- **Missing type import** — add the import with the `type` keyword.
- **Wrong product tuple length** — ensure all 10 fields are present when adding a row to `products.ts`.
- **Invalid TCG key** — `tcg` values must be one of `'pokemon' | 'onePiece' | 'dragonball' | 'yugioh' | 'mtg'`.

---

## Build Issues

### `npm run build` fails with TypeScript errors

**Symptom:** The build exits with `error TS...` messages.

**Fix:** Fix all TypeScript errors before building. Run the type checker in watch mode to find issues quickly:

```bash
npx tsc --noEmit --watch
```

---

### Build output is unexpectedly large

**Symptom:** The `dist/assets/index-xxxx.js` file is larger than ~500 kB (gzipped).

**Likely cause:** A large data file (e.g. `products.ts` with thousands of rows) is included in the bundle.

**Fix:** Consider lazy-loading data or paginating at the data source rather than in the browser.

---

## Runtime / Browser Issues

### Cart items disappear on reload

**Symptom:** Items you added to the cart are gone after a page refresh.

**Likely causes and fixes:**

1. `localStorage` is disabled in the browser (e.g. in private/incognito mode with strict settings). Check: `window.localStorage` — if it throws, storage is blocked.
2. The `tcg-pond-cart` key was manually removed. Re-add items to the cart.
3. A browser extension is clearing storage. Disable extensions and retry.

---

### Auth state (login, orders) is lost on reload

**Symptom:** You are logged out unexpectedly, or your order history disappears.

**Fix:** Same causes as the cart issue above — check `localStorage`:

```js
// Browser console
JSON.parse(localStorage.getItem('tcg-pond-auth') || '{}')
```

If the value is `null`, `localStorage` is unavailable or was cleared.

---

### Products show "Out of Stock" for everything

**Symptom:** Every product card shows the out-of-stock state.

**Likely cause:** The `stock` field for all products in `src/data/products.ts` is `0`.

**Fix:** Verify that product rows have a non-zero `stock` value:

```ts
['Pikachu ex', 'Scarlet & Violet Base', '057/217', 'Double Rare', 'Holofoil', 'Near Mint', 9.14, 0, 1, '2026-04-01'],
//                                                                                                   ^
//                                                                                              stock = 1
```

---

### No products appear in the shop

**Symptom:** The shop page is empty — no cards, no "no results" message, just blank.

**Likely causes:**

1. **Wrong TCG key on products.** Every product's `tcg` field must match the `key` of an enabled TCG in `tcgConfig.ts`. Mismatched keys (e.g. `'Pokemon'` vs `'pokemon'`) will cause products to be silently excluded.

2. **Stale filter state in the URL.** Check the URL for unexpected query parameters (e.g. `?rarity=SomeRarityThatDoesntExist`). Clear them by navigating to `/shop`.

3. **TCG disabled.** Ensure `enabled: true` is set for the relevant entry in `TCG_CONFIG`.

---

## Deployment Issues

### App loads but all routes except `/` return 404

**Symptom:** Navigating directly to `/shop` or `/cart` returns a 404 from the server.

**Cause:** The server is not configured to redirect all paths to `index.html`.

**Fix:** Add the SPA redirect rule for your platform:

=== "Netlify (_redirects)"
    ```
    /*  /index.html  200
    ```

=== "Cloudflare Pages (_redirects)"
    ```
    /*  /index.html  200
    ```

=== "nginx"
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```

Place `_redirects` in the `public/` folder so Vite copies it to `dist/` during the build.

---

### Assets return 404 after deployment

**Symptom:** The page loads but images or scripts return 404 errors.

**Likely cause:** The `base` path in `vite.config.ts` does not match the deployment subdirectory.

**Fix:** If the app is hosted at `https://example.com/tcg-pond/`, set the base:

```ts
// vite.config.ts
export default defineConfig({
  base: '/tcg-pond/',
  plugins: [react()],
})
```

Rebuild and redeploy after changing this value.

---

## Still Stuck?

1. Search the [Vite issues tracker](https://github.com/vitejs/vite/issues) for your error message.
2. Check the [React Router docs](https://reactrouter.com/) for routing-specific problems.
3. Open the browser DevTools **Network** tab to inspect failing requests.
4. Check the **Console** tab for the exact JavaScript error and stack trace.
