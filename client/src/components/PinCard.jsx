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
    <div
      className="relative group overflow-hidden rounded-xl cursor-pointer glass-card"
      onClick={() => navigate(`/pin/${pin._id}`)}
    >
      <img
        src={pin.imageUrl}
        alt={pin.title}
        className="w-full block object-cover"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Save button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleSave}
            className="bg-[#57f1db] text-[#003731] px-5 py-2 rounded-full font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all translate-y-1 group-hover:translate-y-0"
            style={{ fontFamily: 'Manrope' }}
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>

        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 scrim-gradient" style={{ padding: '48px 16px 16px' }}>
          <div className="flex items-center gap-2 mb-2">
            {pin.creator?.avatar ? (
              <img
                src={pin.creator.avatar}
                alt={pin.creator.username}
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#57f1db]/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#283834] flex items-center justify-center text-[#57f1db] text-[10px] font-bold shrink-0">
                {pin.creator?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-[#d4e6e1] text-[11px]" style={{ fontFamily: 'JetBrains Mono' }}>
              Pin by {pin.creator?.username}
            </span>
          </div>
          <p className="text-white text-sm font-bold leading-snug" style={{ fontFamily: 'Manrope' }}>
            {pin.title}
          </p>
          {pin.saves > 0 && (
            <p className="text-[#57f1db] text-[11px] mt-1" style={{ fontFamily: 'JetBrains Mono' }}>
              {pin.saves} saves
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
