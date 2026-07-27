import { useState, useEffect } from 'react';
import PinCard from './PinCard';

const BREAKPOINTS = [
  { query: '(min-width: 1280px)', cols: 5 },
  { query: '(min-width: 1024px)', cols: 4 },
  { query: '(min-width: 768px)', cols: 3 },
  { query: '(min-width: 640px)', cols: 2 },
];

function getColumnCount() {
  for (const { query, cols } of BREAKPOINTS) {
    if (window.matchMedia(query).matches) return cols;
  }
  return 1;
}

export default function MasonryGrid({ pins, onSaveChange }) {
  const [cols, setCols] = useState(getColumnCount);

  useEffect(() => {
    const update = () => setCols(getColumnCount());
    const queries = BREAKPOINTS.map((b) => window.matchMedia(b.query));
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  if (!pins.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="material-symbols-outlined text-line" style={{ fontSize: '64px' }}>
          water
        </span>
        <p className="text-fog text-sm">No pins found. Try adjusting your filters.</p>
      </div>
    );
  }

  // Row-major distribution: pin i goes to column i % cols, so the feed
  // still reads left-to-right (unlike CSS columns, which fill top-to-bottom).
  const columns = Array.from({ length: cols }, () => []);
  pins.forEach((pin, i) => columns[i % cols].push(pin));

  return (
    <div className="flex gap-4 items-start">
      {columns.map((column, i) => (
        <div key={i} className="flex-1 min-w-0 flex flex-col gap-5">
          {column.map((pin) => (
            <PinCard key={pin._id} pin={pin} onSaveChange={onSaveChange} />
          ))}
        </div>
      ))}
    </div>
  );
}
