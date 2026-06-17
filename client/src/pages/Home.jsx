import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MasonryGrid from '../components/MasonryGrid';

const STYLES = ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater'];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'saves', label: 'Most Saved' },
  { value: 'trending', label: 'Trending' },
];

export default function Home({ searchValue }) {
  const [pins, setPins] = useState([]);
  const [activeStyle, setActiveStyle] = useState('');
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  const fetchPins = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (activeStyle) params.style = activeStyle;
      if (searchValue) params.search = searchValue;
      const res = await axios.get('/api/pins', { params });
      setPins(res.data);
    } catch {
      setPins([]);
    } finally {
      setLoading(false);
    }
  }, [activeStyle, sort, searchValue]);

  useEffect(() => { fetchPins(); }, [fetchPins]);

  const handleSaveChange = (pinId) => {
    setPins((prev) =>
      prev.map((p) => (p._id === pinId ? { ...p, saves: p.saves + 1 } : p))
    );
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Latest';

  return (
    <div>
      {/* Filter bar */}
      <section
        className="sticky top-[64px] z-40 flex items-center gap-3 py-3 overflow-x-auto border-b border-[#3c4a46]/10"
        style={{ paddingLeft: 48, paddingRight: 48, background: 'rgba(6,22,19,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => setActiveStyle('')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase transition-colors font-medium ${
            activeStyle === ''
              ? 'bg-[#2dd4bf] text-[#00574d]'
              : 'text-[#bacac5] hover:text-[#d4e6e1]'
          }`}
          style={{ fontFamily: 'JetBrains Mono', background: activeStyle === '' ? undefined : 'rgba(40,56,52,0.4)' }}
        >
          All
        </button>

        {STYLES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStyle(activeStyle === s ? '' : s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase transition-colors font-medium ${
              activeStyle === s
                ? 'bg-[#2dd4bf] text-[#00574d]'
                : 'text-[#bacac5] hover:text-[#d4e6e1]'
            }`}
            style={{ fontFamily: 'JetBrains Mono', background: activeStyle === s ? undefined : 'rgba(40,56,52,0.4)' }}
          >
            {s}
          </button>
        ))}

        {/* Sort */}
        <div className="ml-auto shrink-0 relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase text-[#d4e6e1] transition-colors"
            style={{ fontFamily: 'JetBrains Mono', background: 'rgba(40,56,52,0.4)' }}
          >
            {currentSortLabel}
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          {sortOpen && (
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl z-50 min-w-[130px] border border-[#3c4a46]/40"
              style={{ background: '#13221f' }}
            >
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setSort(o.value); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[11px] tracking-widest uppercase transition-colors ${
                    sort === o.value ? 'text-[#57f1db]' : 'text-[#bacac5] hover:text-[#d4e6e1] hover:bg-[#283834]/50'
                  }`}
                  style={{ fontFamily: 'JetBrains Mono' }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div style={{ paddingLeft: 48, paddingRight: 48, paddingTop: 40, paddingBottom: 48 }}>
        {searchValue && (
          <p className="text-[#859490] text-sm mb-6">
            Results for <span className="text-[#57f1db]">"{searchValue}"</span>
          </p>
        )}

        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div
                  className="rounded-xl animate-pulse"
                  style={{
                    height: `${180 + (i % 5) * 60}px`,
                    background: 'rgba(40,56,52,0.4)',
                    border: '1px solid rgba(87,241,219,0.08)',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <MasonryGrid pins={pins} onSaveChange={handleSaveChange} />
        )}
      </div>
    </div>
  );
}
