import { Link } from 'react-router-dom';
import { ShoppingCart, Package, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types';

const RARITY_COLORS: Record<string, string> = {
  'Common': '#9ca3af',
  'Uncommon': '#60a5fa',
  'Holo Rare': '#a78bfa',
  'Reverse Holofoil': '#818cf8',
  'Double Rare': '#c084fc',
  'Ultra Rare': '#f472b6',
  'Hyper Rare': '#fb7185',
  'Illustration Rare': '#34d399',
  'Special Illustration Rare': '#10b981',
  'Shiny Rare': '#fbbf24',
  'Shiny Ultra Rare': '#f59e0b',
  'Secret Rare': '#ef4444',
  'Mega Hyper Rare': '#dc2626',
  'Mega Attack Rare': '#f97316',
  'Promo': '#06b6d4',
  'Classic Collection': '#8b5cf6',
};

function rarityColor(rarity?: string) {
  if (!rarity) return '#9ca3af';
  return RARITY_COLORS[rarity] ?? '#9ca3af';
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-pond-border bg-pond-card transition-all duration-200 hover:-translate-y-0.5 hover:border-pond-muted hover:shadow-card">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="rounded-full bg-pokemon-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
        {product.category === 'sealed' && (
          <span className="rounded-full bg-blue-600/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Sealed
          </span>
        )}
      </div>

      {/* Card image placeholder */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="flex h-44 items-center justify-center rounded-t-xl bg-gradient-to-br from-pond-surface to-pond-border">
          {product.category === 'sealed' ? (
            <Package size={48} className="text-pond-muted opacity-60" />
          ) : (
            <CreditCard size={48} className="text-pond-muted opacity-60" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Rarity pill */}
        {product.rarity && (
          <span
            className="w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ color: rarityColor(product.rarity), background: rarityColor(product.rarity) + '22' }}
          >
            {product.rarity}
          </span>
        )}

        <Link to={`/product/${product.id}`} className="hover:text-pokemon-accent">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-pond-text">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-pond-subtle">
          {product.set}
          {product.cardNumber && ` · #${product.cardNumber}`}
        </p>

        {product.variance && product.variance !== 'Normal' && (
          <p className="text-xs text-pond-muted">{product.variance}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-base font-bold text-pond-text">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 1 && (
              <span className="ml-2 text-xs text-pond-muted">×{product.stock}</span>
            )}
          </div>

          <button
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              outOfStock
                ? 'cursor-not-allowed bg-pond-border text-pond-muted'
                : 'bg-pokemon-primary text-white hover:bg-red-700 active:scale-95'
            }`}
          >
            <ShoppingCart size={13} />
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
