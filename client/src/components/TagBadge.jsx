export default function TagBadge({ label, variant = 'aqua' }) {
  return (
    <span className={variant === 'amber' ? 'tag-amber' : 'tag'}>
      {label}
    </span>
  );
}
