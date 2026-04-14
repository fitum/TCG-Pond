import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { totalItems, openCart } = useCartStore();
  const { user, logout, openAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-pond-border bg-pond-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-pokemon-primary">TCG</span>
          <span className="text-pokemon-accent">Pond</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-pond-subtle sm:flex">
          <Link to="/shop" className="transition-colors hover:text-pond-text">Shop</Link>
          <Link to="/shop?category=sealed" className="transition-colors hover:text-pond-text">Sealed</Link>
          <Link to="/shop?category=single" className="transition-colors hover:text-pond-text">Singles</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={openCart}
            className="relative rounded-lg p-2 transition-colors hover:bg-pond-card"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} className="text-pond-subtle" />
            {totalItems() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pokemon-primary text-[10px] font-bold text-white">
                {totalItems()}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-pond-subtle transition-colors hover:bg-pond-card hover:text-pond-text"
                onClick={() => navigate('/account')}
              >
                <User size={16} />
                {user.name}
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-pond-subtle transition-colors hover:bg-pond-card hover:text-pond-text sm:flex sm:items-center sm:gap-1"
            >
              <User size={16} />
              Sign in
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="rounded-lg p-2 transition-colors hover:bg-pond-card sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-pond-border bg-pond-surface px-4 pb-4 sm:hidden">
          <nav className="flex flex-col gap-2 pt-3 text-sm font-medium">
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-pond-card">Shop All</Link>
            <Link to="/shop?category=sealed" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-pond-card">Sealed Products</Link>
            <Link to="/shop?category=single" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-pond-card">Single Cards</Link>
            <div className="my-1 border-t border-pond-border" />
            {user ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-pond-card">
                  <Package size={16} /> My Account
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-red-400 hover:bg-pond-card"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuth('login'); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left hover:bg-pond-card">Sign in</button>
                <button onClick={() => { openAuth('register'); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-left hover:bg-pond-card">Create account</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
