import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-pond-subtle">
        <ShoppingBag size={56} />
        <p className="text-xl font-semibold text-pond-text">Your cart is empty</p>
        <p className="text-sm">Add some cards to get started.</p>
        <Link to="/shop" className="mt-2 rounded-xl bg-pokemon-primary px-6 py-3 text-sm font-bold text-white hover:bg-red-700">
          Browse Shop
        </Link>
      </div>
    );
  }

  const shipping = totalPrice() >= 50 ? 0 : 4.99;
  const total = totalPrice() + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-pond-text">Shopping Cart</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 rounded-xl border border-pond-border bg-pond-card p-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link to={`/product/${product.id}`} className="font-semibold text-pond-text hover:text-pokemon-accent line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-sm text-pond-subtle">{product.set} {product.cardNumber ? `· #${product.cardNumber}` : ''}</p>
                {product.rarity && <p className="text-xs text-pond-muted">{product.rarity}</p>}
                <p className="text-xs text-pond-muted">Condition: {product.condition}</p>

                <div className="mt-auto flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center rounded-lg border border-pond-border">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-3 py-1.5 hover:bg-pond-border text-sm">−</button>
                    <span className="min-w-[32px] text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, Math.min(quantity + 1, product.stock))}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 hover:bg-pond-border text-sm disabled:opacity-40"
                    >+</button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex items-center gap-1 text-xs text-pond-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-lg font-bold text-pond-text">${(product.price * quantity).toFixed(2)}</div>
                <div className="text-xs text-pond-subtle">${product.price.toFixed(2)} each</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-20 rounded-xl border border-pond-border bg-pond-card p-5 space-y-4">
            <h2 className="font-bold text-pond-text">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-pond-subtle">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pond-subtle">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-pond-muted">Free shipping on orders over $50</p>
              )}
              <div className="border-t border-pond-border pt-2 flex justify-between font-bold text-pond-text">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-pokemon-primary py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Checkout <ArrowRight size={15} />
            </Link>
            <Link to="/shop" className="block text-center text-xs text-pond-subtle hover:text-pond-text">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
