import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { getProductById, products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/shop/ProductCard';

const RARITY_COLORS: Record<string, string> = {
  'Secret Rare': '#ef4444', 'Mega Hyper Rare': '#dc2626',
  'Special Illustration Rare': '#10b981', 'Hyper Rare': '#fb7185',
  'Ultra Rare': '#f472b6', 'Illustration Rare': '#34d399',
  'Double Rare': '#c084fc', 'Shiny Rare': '#fbbf24',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id ?? '');
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-pond-subtle">
        <AlertCircle size={40} />
        <p className="text-lg font-semibold">Product not found</p>
        <Link to="/shop" className="rounded-xl bg-pokemon-primary px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.id !== product.id && (p.name === product.name || p.set === product.set))
    .slice(0, 4);

  const rarityColor = RARITY_COLORS[product.rarity ?? ''] ?? '#9ca3af';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-pond-subtle">
        <Link to="/shop" className="flex items-center gap-1 hover:text-pond-text">
          <ArrowLeft size={14} /> Shop
        </Link>
        <span>/</span>
        <span className="text-pond-text">{product.name}</span>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Image */}
        <div className="flex h-80 items-center justify-center rounded-2xl border border-pond-border bg-gradient-to-br from-pond-surface to-pond-border sm:h-96">
          {product.category === 'sealed' ? (
            <Package size={80} className="text-pond-muted opacity-50" />
          ) : (
            <CreditCard size={80} className="text-pond-muted opacity-50" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.isNew && (
              <span className="rounded-full bg-pokemon-primary px-2 py-0.5 text-xs font-bold text-white">New</span>
            )}
            {product.category === 'sealed' && (
              <span className="rounded-full bg-blue-600/80 px-2 py-0.5 text-xs font-bold text-white">Sealed</span>
            )}
            {product.rarity && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ color: rarityColor, background: rarityColor + '22' }}
              >
                {product.rarity}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-pond-text">{product.name}</h1>

          <div className="space-y-1 text-sm text-pond-subtle">
            <p><span className="font-medium text-pond-text">Set:</span> {product.set}</p>
            {product.cardNumber && <p><span className="font-medium text-pond-text">Card #:</span> {product.cardNumber}</p>}
            {product.variance && product.variance !== 'Normal' && (
              <p><span className="font-medium text-pond-text">Variant:</span> {product.variance}</p>
            )}
            <p><span className="font-medium text-pond-text">Condition:</span> {product.condition}</p>
            <p><span className="font-medium text-pond-text">TCG:</span> {product.tcg.charAt(0).toUpperCase() + product.tcg.slice(1)}</p>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-pond-border bg-pond-card p-4">
            <div className="text-3xl font-extrabold text-pond-text">${product.price.toFixed(2)}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={12} className="text-green-400" />
                  <span className="text-green-400">{product.stock} in stock</span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} className="text-red-400" />
                  <span className="text-red-400">Out of stock</span>
                </>
              )}
            </div>
          </div>

          <button
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors ${
              product.stock === 0
                ? 'cursor-not-allowed bg-pond-border text-pond-muted'
                : 'bg-pokemon-primary text-white hover:bg-red-700'
            }`}
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <Link
            to="/shop"
            className="rounded-xl border border-pond-border py-3 text-center text-sm font-medium text-pond-subtle transition-colors hover:border-pond-muted hover:text-pond-text"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-pond-text">Related Cards</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
