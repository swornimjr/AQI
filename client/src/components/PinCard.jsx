import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Navbar';

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
    <div
      className="relative group overflow-hidden rounded-xl cursor-pointer glass-card"
      onClick={() => navigate(`/pin/${pin._id}`)}
    >
      <img
        src={pin.imageUrl}
        alt={pin.title}
        className="w-full block object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Save button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleSave}
            className="btn-primary rounded-full px-5 py-2 text-sm shadow-lg translate-y-1 group-hover:translate-y-0"
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>

        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 scrim-gradient px-4 pt-12 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar user={pin.creator} size="w-7 h-7" textSize="text-[10px]" />
            <span className="font-mono text-foam text-[11px]">
              Pin by {pin.creator?.username}
            </span>
          </div>
          <p className="text-white text-sm font-bold leading-snug">
            {pin.title}
          </p>
          {pin.saves > 0 && (
            <p className="font-mono text-aqua text-[11px] mt-1">
              {pin.saves} saves
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
