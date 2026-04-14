import { useNavigate, useSearchParams } from 'react-router-dom';
import { enabledTCGs } from '../../data/tcgConfig';
import type { TCGKey } from '../../types';

interface Props {
  activeTCG?: TCGKey;
}

export default function TCGTabs({ activeTCG }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  function selectTCG(key: TCGKey) {
    const next = new URLSearchParams(params);
    next.set('tcg', key);
    next.delete('page');
    navigate(`/shop?${next.toString()}`);
  }

  if (enabledTCGs.length <= 1) return null; // no tabs if only one TCG active

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {enabledTCGs.map((tcg) => {
        const active = activeTCG === tcg.key;
        return (
          <button
            key={tcg.key}
            onClick={() => selectTCG(tcg.key)}
            style={active ? { borderColor: tcg.primary, color: tcg.primary } : {}}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              active
                ? 'bg-pond-card'
                : 'border-pond-border text-pond-subtle hover:border-pond-muted hover:text-pond-text'
            }`}
          >
            {tcg.label}
          </button>
        );
      })}
    </div>
  );
}
