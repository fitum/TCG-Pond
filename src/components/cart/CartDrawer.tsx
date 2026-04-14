import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-pond-border bg-pond-surface shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pond-border px-4 py-4">
          <h2 className="font-semibold text-pond-text">Cart ({items.length})</h2>
          <button onClick={closeCart} className="rounded-lg p-1.5 hover:bg-pond-card">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-pond-subtle">
              <ShoppingBag size={40} />
              <p className="text-sm">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="rounded-lg bg-pokemon-primary px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 rounded-xl border border-pond-border bg-pond-card p-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium leading-snug text-pond-text line-clamp-2">{product.name}</p>
                    <p className="text-xs text-pond-subtle">{product.set} {product.cardNumber ? `· #${product.cardNumber}` : ''}</p>
                    <p className="text-xs text-pond-subtle">{product.condition}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-pond-border">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-sm hover:bg-pond-border"
                        >−</button>
                        <span className="min-w-[20px] text-center text-sm">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, Math.min(quantity + 1, product.stock))}
                          className="px-2 py-1 text-sm hover:bg-pond-border"
                        >+</button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">${(product.price * quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="rounded-lg p-1.5 text-pond-muted hover:bg-pond-border hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-pond-border p-4 space-y-3">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-pond-subtle">Subtotal</span>
              <span className="text-pond-text">${totalPrice().toFixed(2)}</span>
            </div>
            <p className="text-xs text-pond-muted">Shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full rounded-xl bg-pokemon-primary py-3 text-center text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              Checkout
            </Link>
            <Link
              to="/cart"
              onClick={closeCart}
              className="block w-full rounded-xl border border-pond-border py-3 text-center text-sm font-medium text-pond-subtle transition-colors hover:border-pond-muted hover:text-pond-text"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
