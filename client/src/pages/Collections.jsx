import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Collections() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPublic, setNewPublic] = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/auth'); return; }
    axios
      .get(`/api/users/${currentUser.username}/collections`)
      .then((res) => setCollections(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await axios.post('/api/collections', {
        name: newName.trim(),
        description: newDesc.trim(),
        isPublic: newPublic,
      });
      setCollections([res.data, ...collections]);
      setNewName('');
      setNewDesc('');
      setCreating(false);
    } catch { /* ignore */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await axios.delete(`/api/collections/${id}`);
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch { /* ignore */ }
  };

  const surfaceStyle = {
    background: 'rgba(40,56,52,0.25)',
    border: '1px solid rgba(60,74,70,0.5)',
  };

  const inputClass =
    'w-full bg-[#061613] text-[#d4e6e1] placeholder:text-[#859490]/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#57f1db] transition-all';

  if (loading) return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <div className="rounded-2xl animate-pulse h-32" style={{ background: 'rgba(40,56,52,0.3)' }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#859490] text-[11px] tracking-widest uppercase mb-1" style={{ fontFamily: 'JetBrains Mono' }}>
            Your library
          </p>
          <h1 className="text-2xl font-bold text-[#d4e6e1]" style={{ fontFamily: 'Manrope' }}>
            Collections
          </h1>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-2 bg-[#57f1db] text-[#003731] px-5 py-2.5 rounded-xl text-[11px] tracking-widest uppercase font-bold hover:brightness-110 active:scale-95 transition-all"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New
        </button>
      </div>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl p-5 mb-6 space-y-3"
          style={surfaceStyle}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            autoFocus
            className={inputClass}
            style={{ border: '1px solid rgba(60,74,70,0.5)' }}
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className={inputClass}
            style={{ border: '1px solid rgba(60,74,70,0.5)' }}
          />
          <label className="flex items-center gap-2.5 text-sm text-[#bacac5] cursor-pointer">
            <input
              type="checkbox"
              checked={newPublic}
              onChange={(e) => setNewPublic(e.target.checked)}
              className="accent-[#57f1db] w-4 h-4"
            />
            <span className="text-[11px] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono' }}>Public</span>
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="bg-[#57f1db] text-[#003731] px-5 py-2 rounded-xl text-[11px] tracking-widest uppercase font-bold hover:brightness-110 active:scale-95 transition-all"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-4 py-2 rounded-xl text-[11px] tracking-widest uppercase text-[#859490] hover:text-[#d4e6e1] transition-colors"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-[#283834] text-7xl block mb-4">bookmarks</span>
          <p className="text-[#859490] text-sm" style={{ fontFamily: 'JetBrains Mono' }}>
            No collections yet. Create one to start saving pins.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-1"
              style={surfaceStyle}
            >
              {c.pins[0]?.imageUrl ? (
                <img src={c.pins[0].imageUrl} alt={c.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="h-36 flex items-center justify-center" style={{ background: 'rgba(40,56,52,0.4)' }}>
                  <span className="material-symbols-outlined text-[#3c4a46] text-5xl">collections</span>
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[#d4e6e1] font-bold text-sm" style={{ fontFamily: 'Manrope' }}>{c.name}</p>
                    {c.description && (
                      <p className="text-[#859490] text-xs mt-0.5">{c.description}</p>
                    )}
                    <p className="text-[#57f1db] text-[11px] mt-1" style={{ fontFamily: 'JetBrains Mono' }}>
                      {c.pins.length} pins · {c.isPublic ? 'Public' : 'Private'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-[#3c4a46] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
