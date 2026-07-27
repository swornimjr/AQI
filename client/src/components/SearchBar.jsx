export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full group">
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-fog group-focus-within:text-kelp transition-colors pointer-events-none"
        style={{ fontSize: '18px', lineHeight: 1 }}
      >
        search
      </span>
      <input
        type="search"
        enterKeyHint="search"
        placeholder="Search tanks, plants, styles..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="w-full rounded-full bg-fill border border-transparent py-2 pl-9 pr-4 text-sm text-ink placeholder:text-fog outline-none focus:bg-card focus:border-line focus:ring-1 focus:ring-kelp/40 transition-all"
      />
    </div>
  );
}
