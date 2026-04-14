import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AuthModal() {
  const { isAuthOpen, authMode, closeAuth, login, register } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = mode === 'login'
        ? await login(email, password)
        : await register(name, email, password);
      if (!ok) setError('Invalid credentials. Please try again.');
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeAuth} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-pond-border bg-pond-surface p-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-pond-text">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
          <button onClick={closeAuth} className="rounded-lg p-1.5 hover:bg-pond-card">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-pond-subtle">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-pond-border bg-pond-card px-4 py-2.5 text-sm text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-pond-subtle">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-pond-border bg-pond-card px-4 py-2.5 text-sm text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-pond-subtle">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-pond-border bg-pond-card px-4 py-2.5 text-sm text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pokemon-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-pond-subtle">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="font-semibold text-pokemon-accent hover:underline">Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="font-semibold text-pokemon-accent hover:underline">Sign in</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
