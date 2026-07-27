import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CollectionCard from '../components/CollectionCard';

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

  if (loading) return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <div className="rounded-2xl animate-pulse h-32 bg-fill" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 fade-rise">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mono-caps text-fog mb-1">Your library</p>
          <h1 className="text-2xl font-bold text-ink">Collections</h1>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="btn-primary mono-caps rounded-xl px-5 py-2.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="surface rounded-2xl p-5 mb-6 space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Collection name"
            autoFocus
            className="input-field"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="input-field"
          />
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={newPublic}
              onChange={(e) => setNewPublic(e.target.checked)}
              className="accent-kelp w-4 h-4"
            />
            <span className="mono-caps text-dim">Public</span>
          </label>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary mono-caps rounded-xl px-5 py-2">
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="mono-caps px-4 py-2 rounded-xl text-fog hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-line text-7xl block mb-4">bookmarks</span>
          <p className="font-mono text-fog text-sm">
            No collections yet. Create one to start saving pins.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((c) => (
            <CollectionCard key={c._id} collection={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
