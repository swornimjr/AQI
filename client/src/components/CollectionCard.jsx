export default function CollectionCard({ collection: c, onDelete }) {
  return (
    <div className="surface rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 hover:border-aqua/30">
      {c.pins[0]?.imageUrl ? (
        <img src={c.pins[0].imageUrl} alt={c.name} className="w-full h-36 object-cover" />
      ) : (
        <div className="h-36 flex items-center justify-center bg-ink/40">
          <span className="material-symbols-outlined text-line text-5xl">collections</span>
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-foam font-bold text-sm">{c.name}</p>
            {c.description && (
              <p className="text-subtle text-xs mt-0.5">{c.description}</p>
            )}
            <p className="font-mono text-aqua text-[11px] mt-1">
              {c.pins.length} pins
              {onDelete && ` · ${c.isPublic ? 'Public' : 'Private'}`}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(c._id)}
              className="text-line hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
