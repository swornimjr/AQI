import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function PinCard({ pin, onSaveChange }) {
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) { navigate('/auth'); return; }
    if (saving) return;
    setSaving(true);
    try {
      await axios.post(`/api/pins/${pin._id}/save`);
      onSaveChange?.(pin._id);
    } catch {
      // silently ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/pin/${pin._id}`)}>
      <div className="photo-card">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          className="w-full block object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors" />
        <button
          onClick={handleSave}
          className="btn-primary absolute top-3 right-3 rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 shadow-sm"
        >
          {saving ? '…' : 'Save'}
        </button>
      </div>
      <div className="pt-2 px-0.5">
        <p className="text-sm font-semibold text-ink leading-snug truncate">{pin.title}</p>
        <p className="text-xs text-fog mt-0.5 truncate">
          {pin.creator?.username}
          {pin.saves > 0 && ` · ${pin.saves} ${pin.saves === 1 ? 'save' : 'saves'}`}
        </p>
      </div>
    </div>
  );
}
