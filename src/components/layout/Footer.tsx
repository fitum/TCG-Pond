import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-pond-border bg-pond-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-2 text-lg font-bold">
              <span className="text-pokemon-primary">TCG</span>
              <span className="text-pokemon-accent">Pond</span>
            </div>
            <p className="text-sm text-pond-subtle">
              Your trusted source for Pokémon TCG singles and sealed products.
              All cards Near Mint unless stated otherwise.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pond-subtle">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="text-pond-subtle transition-colors hover:text-pond-text">All Products</Link></li>
              <li><Link to="/shop?category=sealed" className="text-pond-subtle transition-colors hover:text-pond-text">Sealed Products</Link></li>
              <li><Link to="/shop?category=single" className="text-pond-subtle transition-colors hover:text-pond-text">Single Cards</Link></li>
              <li><Link to="/shop?new=true" className="text-pond-subtle transition-colors hover:text-pond-text">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pond-subtle">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="text-pond-subtle transition-colors hover:text-pond-text">My Account</Link></li>
              <li><Link to="/account/orders" className="text-pond-subtle transition-colors hover:text-pond-text">Order History</Link></li>
              <li><Link to="/cart" className="text-pond-subtle transition-colors hover:text-pond-text">Cart</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-pond-border pt-6 text-center text-xs text-pond-muted">
          © {new Date().getFullYear()} TCG Pond. All rights reserved.
          Pokémon and all respective names are trademarks of Nintendo/Game Freak.
        </div>
      </div>
    </footer>
  );
}
