# Deployment Guide

This guide covers how to build TCG Pond for production and deploy it to the most common static hosting platforms.

TCG Pond is a **fully client-side single-page application** — the production build is a folder of static HTML, CSS, and JavaScript files that can be served by any static host with no server-side runtime required.

---

## Building for Production

1. **Run the build command** from the project root:

    ```bash
    npm run build
    ```

    This command runs the TypeScript compiler first (`tsc -b`) and then Vite's production bundler. Output goes to `dist/`.

    *Expected output (abridged):*

    ```
    ✓ TypeScript compilation successful
    vite v8.x.x building for production...
    ✓ 412 modules transformed.
    dist/index.html            0.54 kB
    dist/assets/index-xxxx.js  320.12 kB │ gzip: 98.45 kB
    dist/assets/index-xxxx.css  28.71 kB │ gzip:  6.82 kB
    ✓ built in 4.21s
    ```

2. **Preview the build locally** before deploying:

    ```bash
    npm run preview
    ```

    This starts a local server at [http://localhost:4173](http://localhost:4173) that serves the `dist/` folder exactly as a CDN would. Verify the app works correctly before pushing to production.

    !!! tip
        Always run `npm run preview` after `npm run build` to catch any issues that only appear in the optimised bundle (tree-shaking, asset paths, etc.).

---

## SPA Routing Requirement

Because TCG Pond uses React Router with client-side navigation, every URL must be redirected to `index.html` by the server. Each platform below has a dedicated configuration section for this.

---

## Netlify

Netlify is the simplest option — it detects the Vite framework automatically.

1. Push your code to a GitHub, GitLab, or Bitbucket repository.

2. Log in to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.

3. Authorise Netlify to access your repository and select the repo.

4. Set the build settings:

    | Setting | Value |
    |---|---|
    | Build command | `npm run build` |
    | Publish directory | `dist` |

5. Click **Deploy site**.

    *Expected outcome:* Netlify runs the build and publishes the site to a URL such as `https://tcg-pond-abc123.netlify.app`.

6. **Configure SPA redirect.** Create `public/netlify.toml` (or a `_redirects` file in `public/`):

    === "netlify.toml"
        ```toml
        [[redirects]]
          from = "/*"
          to = "/index.html"
          status = 200
        ```

    === "_redirects"
        ```
        /*  /index.html  200
        ```

    Commit and push — Netlify redeploys automatically.

---

## Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.

2. Log in to [vercel.com](https://vercel.com) → **Add New Project** → import the repository.

3. Vercel auto-detects Vite. Confirm the settings:

    | Setting | Value |
    |---|---|
    | Framework preset | Vite |
    | Build command | `npm run build` |
    | Output directory | `dist` |

4. Click **Deploy**.

    Vercel handles SPA routing automatically for Vite projects — no extra configuration needed.

    *Expected outcome:* The site is live at `https://tcg-pond.vercel.app` (or your custom domain).

---

## Cloudflare Pages

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.

2. Select your repository.

3. Set build settings:

    | Setting | Value |
    |---|---|
    | Framework preset | Vite |
    | Build command | `npm run build` |
    | Build output directory | `dist` |

4. Click **Save and Deploy**.

5. **Configure SPA routing.** Create `public/_redirects`:

    ```
    /*  /index.html  200
    ```

    Commit and push. Cloudflare Pages redeploys automatically.

---

## nginx

Use this approach when self-hosting on a VPS or bare-metal server.

1. Build the app and copy the `dist/` folder to your server (e.g. via `rsync`):

    ```bash
    npm run build
    rsync -avz dist/ user@your-server:/var/www/tcg-pond/
    ```

2. Create an nginx server block:

    ```nginx
    server {
        listen 80;
        server_name tcg-pond.example.com;
        root /var/www/tcg-pond;
        index index.html;

        # SPA fallback — send all paths to index.html
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets aggressively (they have content hashes in filenames)
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    ```

3. Test and reload nginx:

    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

!!! tip "HTTPS"
    Use [Certbot](https://certbot.eff.org/) to obtain a free Let's Encrypt TLS certificate:
    ```bash
    sudo certbot --nginx -d tcg-pond.example.com
    ```

---

## Environment Variables (Optional)

TCG Pond has **no required environment variables** in its default static configuration. If you add a real backend, create a `.env` file at the project root before building:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

All `VITE_`-prefixed variables are inlined into the browser bundle at build time by Vite. **Never store secrets** (private keys, server credentials) in `VITE_`-prefixed variables.

Set the same variables as environment variables in your hosting platform's dashboard so that CI/CD builds pick them up without committing the `.env` file.

---

## Continuous Deployment

All three hosted platforms (Netlify, Vercel, Cloudflare Pages) support automatic deployments triggered by a `git push` to the default branch. No additional CI configuration is needed for the default setup.

For self-hosted deployments, consider a simple GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        run: rsync -avz --delete dist/ user@your-server:/var/www/tcg-pond/
        # Configure SSH key in repository secrets
```

---

## Post-Deployment Checklist

- [ ] Home page loads and hero image renders correctly
- [ ] Shop page shows product cards
- [ ] Filtering and pagination work (check URL params update)
- [ ] Adding a product to the cart opens the cart drawer
- [ ] Checkout flow completes and shows the order confirmation screen
- [ ] Direct URL navigation (e.g. `/shop`, `/cart`) works without a 404
- [ ] Browser back/forward navigation works correctly
