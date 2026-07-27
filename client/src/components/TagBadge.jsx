export default function TagBadge({ label, variant = 'kelp' }) {
  return (
    <span className={variant === 'amber' ? 'tag-amber' : 'tag'}>
      {label}
    </span>
  );
}
