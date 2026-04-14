import { Link } from 'react-router-dom';
import { ArrowRight, Package, CreditCard, Sparkles } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/shop/ProductCard';

const newProducts = products.filter((p) => p.isNew).slice(0, 8);
const sealedProducts = products.filter((p) => p.category === 'sealed').slice(0, 4);
const featuredHighValue = products
  .filter((p) => p.category === 'single' && p.price >= 100)
  .sort((a, b) => b.price - a.price)
  .slice(0, 4);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pond-surface via-pond-bg to-pond-surface">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(204,0,0,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,203,5,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pokemon-primary/30 bg-pokemon-primary/10 px-3 py-1 text-xs font-semibold text-pokemon-primary">
              <Sparkles size={12} /> New arrivals available
            </div>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-pond-text sm:text-5xl">
              Your Pokémon TCG<br />
              <span className="text-pokemon-primary">card shop</span>
            </h1>
            <p className="mb-8 text-lg text-pond-subtle">
              Hundreds of singles and sealed products. Near Mint condition. Ships fast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-pokemon-primary px-5 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-red-700 hover:shadow-lg"
              >
                Shop now <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop?category=sealed"
                className="inline-flex items-center gap-2 rounded-xl border border-pond-border bg-pond-card px-5 py-3 text-sm font-semibold text-pond-text transition-colors hover:border-pond-muted"
              >
                View sealed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-pond-border bg-pond-surface/60">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-pond-border px-4 sm:px-6">
          {[
            { label: 'Singles in stock', value: products.filter((p) => p.category === 'single').length },
            { label: 'Sealed products', value: products.filter((p) => p.category === 'sealed').length },
            { label: 'Sets represented', value: new Set(products.map((p) => p.set)).size },
          ].map((stat) => (
            <div key={stat.label} className="py-5 text-center">
              <div className="text-2xl font-extrabold text-pokemon-accent">{stat.value}+</div>
              <div className="text-xs text-pond-subtle">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-pond-text">New Arrivals</h2>
          <Link to="/shop?new=true" className="flex items-center gap-1 text-sm text-pond-subtle hover:text-pond-text">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <h2 className="mb-6 text-xl font-bold text-pond-text">Shop by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/shop?category=single"
            className="group relative overflow-hidden rounded-2xl border border-pond-border bg-pond-card p-6 transition-colors hover:border-pond-muted"
          >
            <CreditCard size={32} className="mb-4 text-pokemon-accent" />
            <h3 className="mb-1 font-bold text-pond-text">Single Cards</h3>
            <p className="text-sm text-pond-subtle">
              {products.filter((p) => p.category === 'single').length} singles available
            </p>
            <ArrowRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-pond-muted transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/shop?category=sealed"
            className="group relative overflow-hidden rounded-2xl border border-pond-border bg-pond-card p-6 transition-colors hover:border-pond-muted"
          >
            <Package size={32} className="mb-4 text-blue-400" />
            <h3 className="mb-1 font-bold text-pond-text">Sealed Products</h3>
            <p className="text-sm text-pond-subtle">
              {products.filter((p) => p.category === 'sealed').length} sealed items available
            </p>
            <ArrowRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-pond-muted transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* High Value */}
      {featuredHighValue.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-pond-text">Premium Cards</h2>
            <Link to="/shop?sort=price-desc" className="flex items-center gap-1 text-sm text-pond-subtle hover:text-pond-text">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredHighValue.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Sealed */}
      {sealedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-pond-text">Sealed Products</h2>
            <Link to="/shop?category=sealed" className="flex items-center gap-1 text-sm text-pond-subtle hover:text-pond-text">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sealedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
