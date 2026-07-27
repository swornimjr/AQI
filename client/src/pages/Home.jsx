import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MasonryGrid from '../components/MasonryGrid';
import { useAuth } from '../context/AuthContext';

const STYLES = ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater'];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'saves', label: 'Most Saved' },
  { value: 'trending', label: 'Trending' },
];

const BUBBLES = [
  { left: '8%', size: 8, delay: '0s' },
  { left: '22%', size: 5, delay: '2.1s' },
  { left: '47%', size: 10, delay: '0.8s' },
  { left: '68%', size: 6, delay: '3.2s' },
  { left: '86%', size: 8, delay: '1.5s' },
];

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-kelp-tint/70 via-page to-page">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay }}
        />
      ))}
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center fade-rise">
        <p className="mono-caps text-kelp mb-4">Underwater worlds, curated</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-ink leading-tight tracking-tight mb-4">
          Find your next <span className="text-kelp">aquascape</span>
        </h1>
        <p className="text-dim text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
          Browse Iwagumi layouts, Dutch jungles and blackwater biotopes from
          aquascapers around the world — then share your own tank.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/auth" className="btn-primary mono-caps rounded-full px-7 py-3">
            Join the community
          </Link>
          <a href="#explore" className="btn-ghost mono-caps rounded-full px-7 py-3">
            Explore
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home({ searchValue }) {
  const { currentUser } = useAuth();
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
      {!currentUser && !searchValue && <Hero />}

      {/* Filter bar */}
      <section
        id="explore"
        className="frost sticky top-16 z-40 flex items-center gap-3 py-3 px-6 lg:px-12 overflow-x-auto border-b border-line scroll-mt-16"
      >
        {['', ...STYLES].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setActiveStyle(activeStyle === s ? '' : s)}
            className={`pill ${activeStyle === s ? 'pill-active' : 'pill-idle'}`}
          >
            {s || 'All'}
          </button>
        ))}

        {/* Sort */}
        <div className="ml-auto shrink-0 relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="pill pill-idle flex items-center gap-1.5 text-ink"
          >
            {currentSortLabel}
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg z-50 min-w-[130px] bg-card border border-line">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => { setSort(o.value); setSortOpen(false); }}
                  className={`mono-caps w-full text-left px-4 py-2.5 transition-colors ${
                    sort === o.value ? 'text-kelp font-bold' : 'text-dim hover:text-ink hover:bg-fill'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="px-6 lg:px-12 pt-10 pb-12">
        {searchValue && (
          <p className="text-dim text-sm mb-6">
            Results for <span className="text-kelp font-bold">"{searchValue}"</span>
          </p>
        )}

        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div
                  className="rounded-xl animate-pulse bg-fill"
                  style={{ height: `${180 + (i % 5) * 60}px` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="fade-rise">
            <MasonryGrid pins={pins} onSaveChange={handleSaveChange} />
          </div>
        )}
      </div>
    </div>
  );
}
