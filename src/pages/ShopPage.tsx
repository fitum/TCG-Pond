import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { products } from '../data/products';
import { enabledTCGs } from '../data/tcgConfig';
import TCGTabs from '../components/shop/TCGTabs';
import ShopFilters from '../components/shop/ShopFilters';
import ProductCard from '../components/shop/ProductCard';
import type { TCGKey } from '../types';

const PAGE_SIZE = 24;

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const tcg = (params.get('tcg') || enabledTCGs[0]?.key || 'pokemon') as TCGKey;
  const category = params.get('category') ?? '';
  const rarity = params.get('rarity') ?? '';
  const set = params.get('set') ?? '';
  const sort = params.get('sort') ?? '';
  const search = params.get('q') ?? '';
  const newOnly = params.get('new') === 'true';
  const page = parseInt(params.get('page') ?? '1', 10);
  const min = parseFloat(params.get('min') ?? '0') || 0;
  const max = parseFloat(params.get('max') ?? '0') || Infinity;

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.tcg === tcg);
    if (category) list = list.filter((p) => p.category === category);
    if (rarity) list = list.filter((p) => p.rarity === rarity);
    if (set) list = list.filter((p) => p.set === set);
    if (newOnly) list = list.filter((p) => p.isNew);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.set.toLowerCase().includes(search.toLowerCase()));
    if (min) list = list.filter((p) => p.price >= min);
    if (max !== Infinity) list = list.filter((p) => p.price <= max);

    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'name-asc': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list = [...list].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'new': list = [...list].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()); break;
    }
    return list;
  }, [tcg, category, rarity, set, newOnly, search, min, max, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function setSearch(q: string) {
    const next = new URLSearchParams(params);
    if (q) next.set('q', q);
    else next.delete('q');
    next.delete('page');
    setParams(next);
  }

  function setPage(p: number) {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* TCG tabs */}
      <div className="mb-4">
        <TCGTabs activeTCG={tcg} />
      </div>

      {/* Search + filter toggle */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pond-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards, sets…"
            className="w-full rounded-xl border border-pond-border bg-pond-card py-2.5 pl-9 pr-4 text-sm text-pond-text placeholder:text-pond-muted focus:border-pokemon-primary focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${showFilters ? 'border-pokemon-primary bg-pokemon-primary/10 text-pokemon-primary' : 'border-pond-border text-pond-subtle hover:border-pond-muted'}`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        {showFilters && (
          <aside className="w-56 shrink-0">
            <ShopFilters />
          </aside>
        )}

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {/* Results count */}
          <div className="mb-4 flex items-center justify-between text-sm text-pond-subtle">
            <span>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            {category && (
              <span className="rounded-full border border-pond-border px-2 py-0.5 text-xs capitalize">{category}</span>
            )}
          </div>

          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-pond-subtle">
              <Search size={40} />
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-pond-border px-3 py-2 text-sm disabled:opacity-40 hover:bg-pond-card"
              >←</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg border px-3 py-2 text-sm ${page === p ? 'border-pokemon-primary bg-pokemon-primary/10 text-pokemon-primary' : 'border-pond-border hover:bg-pond-card'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-pond-border px-3 py-2 text-sm disabled:opacity-40 hover:bg-pond-card"
              >→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
