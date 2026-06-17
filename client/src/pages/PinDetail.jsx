import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TagBadge from '../components/TagBadge';

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
      <div className="rounded-2xl animate-pulse h-96" style={{ background: 'rgba(40,56,52,0.3)' }} />
    </div>
  );

  if (!pin) return null;

  const isCreator = currentUser?._id === pin.creator?._id;

  const surfaceStyle = {
    background: 'rgba(40,56,52,0.25)',
    border: '1px solid rgba(60,74,70,0.5)',
  };

  const MetaRow = ({ label, value }) =>
    value ? (
      <div className="flex gap-3 text-sm">
        <span className="text-[#859490] w-28 shrink-0 text-[11px] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono' }}>
          {label}
        </span>
        <span className="text-[#d4e6e1]">{value}</span>
      </div>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden" style={surfaceStyle}>
          <img src={pin.imageUrl} alt={pin.title} className="w-full object-cover" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Title + actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#d4e6e1] leading-tight" style={{ fontFamily: 'Manrope' }}>
              {pin.title}
            </h1>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] tracking-widest uppercase font-bold transition-all ${
                  saved
                    ? 'text-[#57f1db]'
                    : 'bg-[#57f1db] text-[#003731] hover:brightness-110 active:scale-95'
                }`}
                style={saved ? { ...surfaceStyle, fontFamily: 'JetBrains Mono' } : { fontFamily: 'JetBrains Mono' }}
              >
                <span className="material-symbols-outlined text-[16px]">{saved ? 'bookmark' : 'bookmark_border'}</span>
                {pin.saves} {saved ? 'Saved' : 'Save'}
              </button>
              {isCreator && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-[11px] tracking-widest uppercase text-[#859490] hover:text-red-400 transition-colors"
                  style={{ ...surfaceStyle, fontFamily: 'JetBrains Mono' }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Creator */}
          <Link to={`/profile/${pin.creator?.username}`} className="flex items-center gap-3 group w-fit">
            {pin.creator?.avatar ? (
              <img
                src={pin.creator.avatar}
                alt={pin.creator.username}
                className="w-9 h-9 rounded-full object-cover border border-[#3c4a46]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#283834] border border-[#3c4a46] flex items-center justify-center text-[#57f1db] text-sm font-bold">
                {pin.creator?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[#d4e6e1] text-sm font-bold group-hover:text-[#57f1db] transition-colors">
                {pin.creator?.username}
              </p>
              <p className="text-[#859490] text-[11px]" style={{ fontFamily: 'JetBrains Mono' }}>Aquascaper</p>
            </div>
          </Link>

          {pin.description && (
            <p className="text-[#bacac5] text-sm leading-relaxed">{pin.description}</p>
          )}

          {/* Metadata table */}
          <div className="rounded-2xl p-4 space-y-2.5" style={surfaceStyle}>
            <MetaRow label="Style" value={pin.style} />
            <MetaRow label="Tank Size" value={pin.tankSize} />
            <MetaRow label="Dimensions" value={pin.dimensions} />
            <MetaRow label="Substrate" value={pin.substrate} />
            <MetaRow label="CO₂" value={pin.co2} />
            <MetaRow label="Stage" value={pin.progressionStage} />
          </div>

          {/* Flora */}
          {pin.flora?.length > 0 && (
            <div>
              <h3 className="text-[#859490] text-[11px] tracking-widest uppercase mb-2" style={{ fontFamily: 'JetBrains Mono' }}>
                Flora
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pin.flora.map((f) => <TagBadge key={f} label={f} />)}
              </div>
            </div>
          )}

          {/* Fauna */}
          {pin.fauna?.length > 0 && (
            <div>
              <h3 className="text-[#859490] text-[11px] tracking-widest uppercase mb-2" style={{ fontFamily: 'JetBrains Mono' }}>
                Fauna
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pin.fauna.map((f) => <TagBadge key={f} label={f} />)}
              </div>
            </div>
          )}

          {/* Equipment */}
          {pin.equipment?.length > 0 && (
            <div>
              <h3 className="text-[#859490] text-[11px] tracking-widest uppercase mb-2" style={{ fontFamily: 'JetBrains Mono' }}>
                Equipment
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pin.equipment.map((e) => (
                  <span
                    key={e}
                    className="inline-block text-[#e8a954] text-[11px] rounded-full px-2.5 py-0.5"
                    style={{ background: 'rgba(232,169,84,0.1)', border: '1px solid rgba(232,169,84,0.25)', fontFamily: 'JetBrains Mono' }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-10 max-w-2xl">
        <h2 className="text-[#d4e6e1] font-bold mb-5" style={{ fontFamily: 'Manrope' }}>
          Comments
          <span className="ml-2 text-[#859490] text-sm font-normal" style={{ fontFamily: 'JetBrains Mono' }}>
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
              className="flex-1 bg-[#061613] text-[#d4e6e1] placeholder:text-[#859490]/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#57f1db] transition-all"
              style={{ border: '1px solid rgba(60,74,70,0.5)' }}
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="bg-[#57f1db] text-[#003731] px-5 py-2.5 rounded-xl text-[11px] tracking-widest uppercase font-bold disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Post
            </button>
          </form>
        )}

        <div className="space-y-4">
          {pin.comments?.map((c, i) => (
            <div key={i} className="flex gap-3">
              {c.user?.avatar ? (
                <img src={c.user.avatar} alt={c.user.username} className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#3c4a46]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#283834] border border-[#3c4a46] flex items-center justify-center text-[#57f1db] text-xs font-bold shrink-0">
                  {c.user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="pt-0.5">
                <span className="text-[#57f1db] text-[11px] font-bold tracking-wide" style={{ fontFamily: 'JetBrains Mono' }}>
                  {c.user?.username}
                </span>
                <p className="text-[#bacac5] text-sm mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
