import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MasonryGrid from '../components/MasonryGrid';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tab, setTab] = useState('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [userRes, pinsRes, colRes] = await Promise.all([
          axios.get(`/api/users/${username}`),
          axios.get(`/api/users/${username}/pins`),
          axios.get(`/api/users/${username}/collections`),
        ]);
        setUser(userRes.data);
        setPins(pinsRes.data);
        setCollections(colRes.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [username]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-10 py-10">
      <div className="rounded-2xl animate-pulse h-32 mb-6" style={{ background: 'rgba(40,56,52,0.3)' }} />
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-[#859490]" style={{ fontFamily: 'JetBrains Mono' }}>User not found.</p>
    </div>
  );

  const surfaceStyle = {
    background: 'rgba(40,56,52,0.25)',
    border: '1px solid rgba(60,74,70,0.5)',
  };

  return (
    <div className="max-w-5xl mx-auto px-10 py-8">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover shrink-0"
            style={{ border: '2px solid rgba(87,241,219,0.3)' }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-[#57f1db] text-3xl font-bold shrink-0"
            style={{ background: 'rgba(40,56,52,0.5)', border: '2px solid rgba(87,241,219,0.2)', fontFamily: 'Manrope' }}
          >
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-[#d4e6e1]" style={{ fontFamily: 'Manrope' }}>
            {user.username}
          </h1>
          {user.bio && (
            <p className="text-[#bacac5] text-sm max-w-md leading-relaxed">{user.bio}</p>
          )}
          {user.currentTanks && (
            <p className="text-sm">
              <span className="text-[#859490]" style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Current tanks:{' '}
              </span>
              <span className="text-[#d4e6e1]">{user.currentTanks}</span>
            </p>
          )}
          <div className="flex gap-5 pt-1">
            {[
              { label: 'posts', value: pins.length },
              { label: 'followers', value: user.followers?.length || 0 },
              { label: 'following', value: user.following?.length || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[#d4e6e1] font-bold text-lg leading-none" style={{ fontFamily: 'Manrope' }}>{value}</p>
                <p className="text-[#859490] text-[10px] tracking-widest uppercase mt-0.5" style={{ fontFamily: 'JetBrains Mono' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={surfaceStyle}>
        {['posts', 'collections'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-[11px] tracking-widest uppercase font-bold transition-all ${
              tab === t
                ? 'bg-[#57f1db] text-[#003731] shadow-lg'
                : 'text-[#859490] hover:text-[#d4e6e1]'
            }`}
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'posts' && <MasonryGrid pins={pins} />}

      {tab === 'collections' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.length === 0 && (
            <p className="text-[#859490] text-sm col-span-full py-12 text-center" style={{ fontFamily: 'JetBrains Mono' }}>
              No public collections yet.
            </p>
          )}
          {collections.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={surfaceStyle}
            >
              {c.pins[0] ? (
                <img src={c.pins[0].imageUrl} alt={c.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="h-36 flex items-center justify-center" style={{ background: 'rgba(40,56,52,0.4)' }}>
                  <span className="material-symbols-outlined text-[#3c4a46] text-5xl">collections</span>
                </div>
              )}
              <div className="p-3">
                <p className="text-[#d4e6e1] font-bold text-sm" style={{ fontFamily: 'Manrope' }}>{c.name}</p>
                {c.description && (
                  <p className="text-[#859490] text-xs mt-0.5">{c.description}</p>
                )}
                <p className="text-[#57f1db] text-[11px] mt-1" style={{ fontFamily: 'JetBrains Mono' }}>
                  {c.pins.length} pins
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
