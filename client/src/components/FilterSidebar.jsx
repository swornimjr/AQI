const STYLES = ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater', 'Other'];
const TANK_SIZES = ['Nano', 'Small', 'Medium', 'Large'];
const CO2_OPTIONS = ['Injected', 'Excel/Liquid', 'None'];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'saves', label: 'Most Saved' },
  { value: 'trending', label: 'Trending' },
];

export default function FilterSidebar({ filters, onChange }) {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <aside className="w-56 shrink-0 bg-[#132820] rounded-lg p-4 space-y-5 self-start sticky top-20">
      <div>
        <h3 className="text-[#6BA898] text-xs font-semibold uppercase tracking-wider mb-2">Sort</h3>
        <select
          value={filters.sort || 'latest'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="w-full bg-[#1E3D33] text-[#E8F5F0] text-sm rounded-lg px-3 py-2 border border-[#1E3D33] focus:outline-none focus:border-[#4ECAA0]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-[#6BA898] text-xs font-semibold uppercase tracking-wider mb-2">Style</h3>
        <div className="space-y-1.5">
          {STYLES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.style || []).includes(s)}
                onChange={() => toggle('style', s)}
                className="accent-[#4ECAA0]"
              />
              <span className="text-sm text-[#E8F5F0]">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[#6BA898] text-xs font-semibold uppercase tracking-wider mb-2">Tank Size</h3>
        <div className="space-y-1.5">
          {TANK_SIZES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.tankSize || []).includes(s)}
                onChange={() => toggle('tankSize', s)}
                className="accent-[#4ECAA0]"
              />
              <span className="text-sm text-[#E8F5F0]">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[#6BA898] text-xs font-semibold uppercase tracking-wider mb-2">CO₂</h3>
        <div className="space-y-1.5">
          {CO2_OPTIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="co2"
                checked={filters.co2 === c}
                onChange={() => onChange({ ...filters, co2: c })}
                className="accent-[#4ECAA0]"
              />
              <span className="text-sm text-[#E8F5F0]">{c}</span>
            </label>
          ))}
          {filters.co2 && (
            <button
              onClick={() => onChange({ ...filters, co2: '' })}
              className="text-xs text-[#6BA898] hover:text-[#4ECAA0] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {(filters.style?.length || filters.tankSize?.length || filters.co2) ? (
        <button
          onClick={() => onChange({ sort: filters.sort || 'latest' })}
          className="w-full text-sm text-[#6BA898] hover:text-[#4ECAA0] transition-colors text-left"
        >
          Clear all filters
        </button>
      ) : null}
    </aside>
  );
}
