import PinCard from './PinCard';

export default function MasonryGrid({ pins, onSaveChange }) {
  if (!pins.length) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-[#859490] text-sm" style={{ fontFamily: 'JetBrains Mono' }}>
          No pins found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
      {pins.map((pin) => (
        <div key={pin._id} className="break-inside-avoid mb-4">
          <PinCard pin={pin} onSaveChange={onSaveChange} />
        </div>
      ))}
    </div>
  );
}
