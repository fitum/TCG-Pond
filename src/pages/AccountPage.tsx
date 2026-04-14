import { Link, useLocation } from 'react-router-dom';
import { User, Package, LogOut, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${colors[status] ?? 'bg-pond-border text-pond-subtle'}`}>
      {status}
    </span>
  );
}

export default function AccountPage() {
  const { user, orders, logout, openAuth } = useAuthStore();
  const location = useLocation();
  const showOrders = location.pathname.endsWith('/orders');

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-pond-subtle">
        <User size={48} />
        <p className="text-lg font-semibold text-pond-text">Sign in to view your account</p>
        <div className="flex gap-3">
          <button
            onClick={() => openAuth('login')}
            className="rounded-xl bg-pokemon-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuth('register')}
            className="rounded-xl border border-pond-border px-5 py-2.5 text-sm font-semibold text-pond-subtle hover:border-pond-muted hover:text-pond-text"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-pond-text">My Account</h1>

      <div className="grid gap-6 sm:grid-cols-4">
        {/* Sidebar */}
        <aside className="sm:col-span-1">
          <nav className="flex flex-col gap-1 rounded-xl border border-pond-border bg-pond-card p-2">
            <Link
              to="/account"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                !showOrders ? 'bg-pokemon-primary/10 text-pokemon-primary' : 'text-pond-subtle hover:bg-pond-border hover:text-pond-text'
              }`}
            >
              <User size={15} /> Profile
            </Link>
            <Link
              to="/account/orders"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                showOrders ? 'bg-pokemon-primary/10 text-pokemon-primary' : 'text-pond-subtle hover:bg-pond-border hover:text-pond-text'
              }`}
            >
              <Package size={15} /> Orders
              {orders.length > 0 && (
                <span className="ml-auto rounded-full bg-pond-border px-1.5 py-0.5 text-[10px] font-bold">
                  {orders.length}
                </span>
              )}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="sm:col-span-3">
          {!showOrders ? (
            /* Profile */
            <div className="rounded-xl border border-pond-border bg-pond-card p-6 space-y-5">
              <h2 className="font-semibold text-pond-text">Profile Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-pond-subtle">Name</label>
                  <div className="rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm text-pond-text">
                    {user.name}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-pond-subtle">Email</label>
                  <div className="rounded-xl border border-pond-border bg-pond-surface px-4 py-2.5 text-sm text-pond-text">
                    {user.email}
                  </div>
                </div>
              </div>
              <p className="text-xs text-pond-muted">
                To update your details, please contact support.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-pond-border bg-pond-surface p-4 text-center">
                  <div className="text-2xl font-extrabold text-pokemon-accent">{orders.length}</div>
                  <div className="text-xs text-pond-subtle mt-1">Total Orders</div>
                </div>
                <div className="rounded-xl border border-pond-border bg-pond-surface p-4 text-center">
                  <div className="text-2xl font-extrabold text-pokemon-accent">
                    ${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}
                  </div>
                  <div className="text-xs text-pond-subtle mt-1">Total Spent</div>
                </div>
              </div>
            </div>
          ) : (
            /* Orders */
            <div className="space-y-4">
              <h2 className="font-semibold text-pond-text">Order History</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-xl border border-pond-border bg-pond-card py-16 text-pond-subtle">
                  <ShoppingBag size={40} />
                  <p className="text-sm">No orders yet.</p>
                  <Link to="/shop" className="rounded-xl bg-pokemon-primary px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                [...orders].reverse().map((order) => (
                  <div key={order.id} className="rounded-xl border border-pond-border bg-pond-card p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <span className="font-mono text-sm font-semibold text-pond-text">{order.id}</span>
                        <span className="ml-3 text-xs text-pond-subtle">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <span className="font-bold text-pond-text">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-pond-border pt-3 space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-pond-subtle line-clamp-1">{item.name} ×{item.quantity}</span>
                          <span className="shrink-0 text-pond-text">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.address && (
                      <p className="text-xs text-pond-muted">
                        Ship to: {order.address.street}, {order.address.city}, {order.address.country}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
