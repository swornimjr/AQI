import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MasonryGrid from '../components/MasonryGrid';
import CollectionCard from '../components/CollectionCard';

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
      <div className="rounded-2xl animate-pulse h-32 mb-6 bg-fill" />
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-fog text-sm">User not found.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 fade-rise">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover shrink-0 border border-line"
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-kelp text-3xl font-bold shrink-0 bg-kelp-tint border border-line">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-ink">{user.username}</h1>
          {user.bio && (
            <p className="text-dim text-sm max-w-md leading-relaxed">{user.bio}</p>
          )}
          {user.currentTanks && (
            <p className="text-sm">
              <span className="text-[13px] text-fog">Current tanks: </span>
              <span className="text-ink">{user.currentTanks}</span>
            </p>
          )}
          <div className="flex gap-5 pt-1">
            {[
              { label: 'posts', value: pins.length },
              { label: 'followers', value: user.followers?.length || 0 },
              { label: 'following', value: user.following?.length || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-ink font-bold text-lg leading-none">{value}</p>
                <p className="text-fog text-xs capitalize mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit bg-fill">
        {['posts', 'collections'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t
                ? 'bg-kelp text-white'
                : 'text-fog hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'posts' && <MasonryGrid pins={pins} />}

      {tab === 'collections' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.length === 0 && (
            <p className="text-fog text-sm col-span-full py-12 text-center">
              No public collections yet.
            </p>
          )}
          {collections.map((c) => <CollectionCard key={c._id} collection={c} />)}
        </div>
      )}
    </div>
  );
}
