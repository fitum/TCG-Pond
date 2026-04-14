import { useSearchParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { getUniqueSets, getUniqueRarities } from '../../data/products';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'new', label: 'Newest First' },
];

export default function ShopFilters() {
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  }

  function clear() {
    const next = new URLSearchParams();
    const tcg = params.get('tcg');
    if (tcg) next.set('tcg', tcg);
    setParams(next);
  }

  const activeFilters = ['category', 'rarity', 'set', 'min', 'max', 'new'].filter((k) => params.has(k));

  const sets = getUniqueSets(params.get('tcg') ?? undefined);
  const rarities = getUniqueRarities(params.get('tcg') ?? undefined);

  return (
    <div className="rounded-xl border border-pond-border bg-pond-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-2 font-semibold text-pond-text"
          onClick={() => setExpanded(!expanded)}
        >
          Filters
          {activeFilters.length > 0 && (
            <span className="rounded-full bg-pokemon-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeFilters.length}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {activeFilters.length > 0 && (
          <button onClick={clear} className="flex items-center gap-1 text-xs text-pond-subtle hover:text-red-400">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {/* Sort */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-pond-subtle">Sort</label>
            <select
              value={params.get('sort') ?? ''}
              onChange={(e) => set('sort', e.target.value)}
              className="w-full rounded-lg border border-pond-border bg-pond-surface px-3 py-2 text-sm text-pond-text focus:outline-none"
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-pond-subtle">Category</label>
            <div className="flex gap-2">
              {(['', 'single', 'sealed'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => set('category', cat)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                    (params.get('category') ?? '') === cat
                      ? 'border-pokemon-primary bg-pokemon-primary/10 text-pokemon-primary'
                      : 'border-pond-border text-pond-subtle hover:border-pond-muted'
                  }`}
                >
                  {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* New only */}
          <div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-pond-text">
              <input
                type="checkbox"
                checked={params.get('new') === 'true'}
                onChange={(e) => set('new', e.target.checked ? 'true' : '')}
                className="accent-pokemon-primary"
              />
              New Arrivals only
            </label>
          </div>

          {/* Set */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-pond-subtle">Set</label>
            <select
              value={params.get('set') ?? ''}
              onChange={(e) => set('set', e.target.value)}
              className="w-full rounded-lg border border-pond-border bg-pond-surface px-3 py-2 text-sm text-pond-text focus:outline-none"
            >
              <option value="">All Sets</option>
              {sets.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Rarity */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-pond-subtle">Rarity</label>
            <select
              value={params.get('rarity') ?? ''}
              onChange={(e) => set('rarity', e.target.value)}
              className="w-full rounded-lg border border-pond-border bg-pond-surface px-3 py-2 text-sm text-pond-text focus:outline-none"
            >
              <option value="">All Rarities</option>
              {rarities.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-pond-subtle">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={params.get('min') ?? ''}
                onChange={(e) => set('min', e.target.value)}
                className="w-full rounded-lg border border-pond-border bg-pond-surface px-3 py-2 text-sm text-pond-text focus:outline-none"
              />
              <span className="text-pond-muted">–</span>
              <input
                type="number"
                placeholder="Max"
                value={params.get('max') ?? ''}
                onChange={(e) => set('max', e.target.value)}
                className="w-full rounded-lg border border-pond-border bg-pond-surface px-3 py-2 text-sm text-pond-text focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
