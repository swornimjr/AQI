export default function TagBadge({ label }) {
  return (
    <span
      className="inline-block text-[#57f1db] text-[11px] rounded-full px-2.5 py-0.5"
      style={{ background: 'rgba(87,241,219,0.1)', border: '1px solid rgba(87,241,219,0.25)', fontFamily: 'JetBrains Mono' }}
    >
      {label}
    </span>
  );
}
