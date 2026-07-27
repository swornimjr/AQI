import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TagBadge from '../components/TagBadge';
import { Avatar } from '../components/Navbar';

function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="mono-caps text-subtle w-28 shrink-0">{label}</span>
      <span className="text-foam">{value}</span>
    </div>
  );
}

function TagSection({ title, items, variant }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="mono-caps text-subtle mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => <TagBadge key={item} label={item} variant={variant} />)}
      </div>
    </div>
  );
}

export default function PinDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/pins/${id}`)
      .then((res) => setPin(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    if (!currentUser) { navigate('/auth'); return; }
    try {
      const res = await axios.post(`/api/pins/${id}/save`);
      setPin((p) => ({ ...p, saves: res.data.saves }));
      setSaved(true);
    } catch { /* ignore */ }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/pins/${id}/comments`, { text: comment });
      setPin((p) => ({ ...p, comments: [...p.comments, res.data] }));
      setComment('');
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this pin?')) return;
    try {
      await axios.delete(`/api/pins/${id}`);
      navigate('/');
    } catch { /* ignore */ }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-10 py-10">
      <div className="rounded-2xl animate-pulse h-96 bg-ink/30" />
    </div>
  );

  if (!pin) return null;

  const isCreator = currentUser?._id === pin.creator?._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 fade-rise">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="surface rounded-2xl overflow-hidden self-start">
          <img src={pin.imageUrl} alt={pin.title} className="w-full object-cover" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Title + actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-foam leading-tight">
              {pin.title}
            </h1>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleSave}
                className={`mono-caps font-bold rounded-xl px-4 py-2 ${
                  saved ? 'btn-ghost text-aqua' : 'btn-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{saved ? 'bookmark' : 'bookmark_border'}</span>
                {pin.saves} {saved ? 'Saved' : 'Save'}
              </button>
              {isCreator && (
                <button
                  onClick={handleDelete}
                  className="btn-ghost mono-caps rounded-xl px-4 py-2 hover:text-red-400"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Creator */}
          <Link to={`/profile/${pin.creator?.username}`} className="flex items-center gap-3 group w-fit">
            <Avatar user={pin.creator} size="w-9 h-9" />
            <div>
              <p className="text-foam text-sm font-bold group-hover:text-aqua transition-colors">
                {pin.creator?.username}
              </p>
              <p className="font-mono text-subtle text-[11px]">Aquascaper</p>
            </div>
          </Link>

          {pin.description && (
            <p className="text-mist text-sm leading-relaxed">{pin.description}</p>
          )}

          {/* Metadata table */}
          <div className="surface rounded-2xl p-4 space-y-2.5">
            <MetaRow label="Style" value={pin.style} />
            <MetaRow label="Tank Size" value={pin.tankSize} />
            <MetaRow label="Dimensions" value={pin.dimensions} />
            <MetaRow label="Substrate" value={pin.substrate} />
            <MetaRow label="CO₂" value={pin.co2} />
            <MetaRow label="Stage" value={pin.progressionStage} />
          </div>

          <TagSection title="Flora" items={pin.flora} />
          <TagSection title="Fauna" items={pin.fauna} />
          <TagSection title="Equipment" items={pin.equipment} variant="amber" />
        </div>
      </div>

      {/* Comments */}
      <div className="mt-10 max-w-2xl">
        <h2 className="text-foam font-bold mb-5">
          Comments
          <span className="font-mono ml-2 text-subtle text-sm font-normal">
            {pin.comments?.length || 0}
          </span>
        </h2>

        {currentUser && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="btn-primary mono-caps rounded-xl px-5 py-2.5"
            >
              Post
            </button>
          </form>
        )}

        <div className="space-y-4">
          {pin.comments?.map((c, i) => (
            <div key={i} className="flex gap-3">
              <Avatar user={c.user} size="w-8 h-8" textSize="text-xs" />
              <div className="pt-0.5">
                <span className="font-mono text-aqua text-[11px] font-bold tracking-wide">
                  {c.user?.username}
                </span>
                <p className="text-mist text-sm mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
