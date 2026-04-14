import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { Address, Order, OrderItem } from '../types';

type Step = 'info' | 'payment' | 'success';

function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).slice(2, 9).toUpperCase();
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, addOrder, openAuth } = useAuthStore();


  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [address, setAddress] = useState<Address>({
    name: user?.name ?? '',
    street: '',
    city: '',
    zip: '',
    country: '',
  });
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<string[]>([]);

  const shipping = totalPrice() >= 50 ? 0 : 4.99;
  const total = totalPrice() + shipping;

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-pond-subtle">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link to="/shop" className="rounded-xl bg-pokemon-primary px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
          Go to Shop
        </Link>
      </div>
    );
  }

  function validateInfo() {
    const errs: string[] = [];
    if (!address.name) errs.push('Name is required');
    if (!address.street) errs.push('Street address is required');
    if (!address.city) errs.push('City is required');
    if (!address.zip) errs.push('ZIP / Postal code is required');
    if (!address.country) errs.push('Country is required');
    return errs;
  }

  function validatePayment() {
    const errs: string[] = [];
    const digits = card.number.replace(/\s/g, '');
    if (digits.length < 16) errs.push('Invalid card number');
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.push('Invalid expiry (MM/YY)');
    if (card.cvc.length < 3) errs.push('Invalid CVC');
    return errs;
  }

  async function submitOrder() {
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));

    const id = generateOrderId();
    const order: Order = {
      id,
      items: items.map(({ product, quantity }): OrderItem => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      })),
      total,
      status: 'pending',
      address,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    setOrderId(id);
    setStep('success');
    setLoading(false);
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <CheckCircle size={56} className="text-green-400" />
        <h1 className="text-2xl font-bold text-pond-text">Order Placed!</h1>
        <p className="text-pond-subtle">Order ID: <span className="font-mono font-semibold text-pond-text">{orderId}</span></p>
        <p className="max-w-sm text-sm text-pond-subtle">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        <div className="flex gap-3">
          <Link to="/account/orders" className="rounded-xl bg-pokemon-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
            View Orders
          </Link>
          <Link to="/shop" className="rounded-xl border border-pond-border px-5 py-2.5 text-sm font-semibold text-pond-subtle hover:border-pond-muted hover:text-pond-text">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-pond-text">Checkout</h1>

      {!user && (
        <div className="mb-6 rounded-xl border border-pokemon-accent/30 bg-pokemon-accent/10 p-4 text-sm">
          <span className="text-pond-subtle">Sign in to track your orders. </span>
          <button onClick={() => openAuth('login')} className="font-semibold text-pokemon-accent hover:underline">Sign in</button>
          <span className="text-pond-subtle"> or </span>
          <button onClick={() => openAuth('register')} className="font-semibold text-pokemon-accent hover:underline">create an account</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <div className="flex items-center gap-3 text-sm">
            {(['info', 'payment'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === s ? 'bg-pokemon-primary text-white' : step === 'payment' && s === 'info' ? 'bg-green-500 text-white' : 'bg-pond-border text-pond-muted'}`}>
                  {step === 'payment' && s === 'info' ? <CheckCircle size={14} /> : i + 1}
                </span>
                <span className={step === s ? 'font-semibold text-pond-text' : 'text-pond-subtle'}>
                  {s === 'info' ? 'Shipping' : 'Payment'}
                </span>
                {i === 0 && <span className="text-pond-muted">→</span>}
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {errors.map((e) => <p key={e}>• {e}</p>)}
            </div>
          )}

          {step === 'info' && (
            <div className="rounded-xl border border-pond-border bg-pond-card p-5 space-y-4">
              <h2 className="font-semibold text-pond-text">Shipping Information</h2>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'John Doe' },
                { label: 'Street Address', key: 'street', placeholder: '123 Main St' },
                { label: 'City', key: 'city', placeholder: 'Vienna' },
                { label: 'ZIP / Postal Code', key: 'zip', placeholder: '1010' },
                { label: 'Country', key: 'country', placeholder: 'Austria' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold text-pond-subtle">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={address[key as keyof Address]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    className="w-full rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const errs = validateInfo();
                  if (errs.length) { setErrors(errs); return; }
                  setErrors([]);
                  setStep('payment');
                }}
                className="w-full rounded-xl bg-pokemon-primary py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="rounded-xl border border-pond-border bg-pond-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-green-400" />
                <h2 className="font-semibold text-pond-text">Payment Details</h2>
              </div>
              <p className="text-xs text-pond-subtle">
                This is a demo. No real payment is processed. Enter any card details.
              </p>

              <div>
                <label className="mb-1 block text-xs font-semibold text-pond-subtle">Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setCard({ ...card, number: v.replace(/(.{4})/g, '$1 ').trim() });
                  }}
                  className="w-full rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm font-mono text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-pond-subtle">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    value={card.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCard({ ...card, expiry: v });
                    }}
                    className="w-full rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm font-mono text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-pond-subtle">CVC</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm font-mono text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setErrors([]); setStep('info'); }} className="flex-1 rounded-xl border border-pond-border py-3 text-sm font-medium text-pond-subtle hover:border-pond-muted hover:text-pond-text">
                  Back
                </button>
                <button
                  disabled={loading}
                  onClick={async () => {
                    const errs = validatePayment();
                    if (errs.length) { setErrors(errs); return; }
                    setErrors([]);
                    await submitOrder();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pokemon-primary py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Pay ${total.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-pond-border bg-pond-card p-4">
            <h2 className="mb-3 font-semibold text-pond-text">Order Summary</h2>
            <ul className="mb-4 space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-2">
                  <span className="text-pond-subtle line-clamp-1">{product.name} ×{quantity}</span>
                  <span className="shrink-0 text-pond-text">${(product.price * quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-pond-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-pond-subtle">
                <span>Subtotal</span><span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pond-subtle">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-pond-text border-t border-pond-border pt-2">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
