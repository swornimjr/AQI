import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STYLES = ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater', 'Other'];
const SIZES = ['Nano', 'Small', 'Medium', 'Large'];
const SUBSTRATES = ['ADA Aqua Soil', 'Dirted', 'Sand', 'Gravel', 'Mixed'];
const CO2_OPTS = ['Injected', 'Excel/Liquid', 'None'];
const STAGES = ['New Setup', 'Growing In', 'Mature', 'Rescaped'];

const inputClass =
  'w-full bg-[#061613] text-[#d4e6e1] placeholder:text-[#859490]/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#57f1db] transition-all';
const inputStyle = { border: '1px solid rgba(60,74,70,0.5)' };

const labelClass = 'block text-[#859490] text-[11px] tracking-widest uppercase mb-1.5';

function TagInput({ label, values, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };
  return (
    <div>
      <label className={labelClass} style={{ fontFamily: 'JetBrains Mono' }}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}…`}
          className={inputClass}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 rounded-xl text-sm font-bold text-[#003731] bg-[#57f1db] hover:brightness-110 active:scale-95 transition-all"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 text-[#57f1db] text-[11px] rounded-full px-2.5 py-0.5"
            style={{ background: 'rgba(87,241,219,0.1)', border: '1px solid rgba(87,241,219,0.25)', fontFamily: 'JetBrains Mono' }}
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-[#859490] hover:text-red-400 transition-colors ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Upload() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', style: '', tankSize: '',
    dimensions: '', substrate: '', co2: '', progressionStage: '',
  });
  const [flora, setFlora] = useState([]);
  const [fauna, setFauna] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select an image'); return; }
    if (!form.title.trim()) { setError('Title is required'); return; }

    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append('flora', JSON.stringify(flora));
      fd.append('fauna', JSON.stringify(fauna));
      fd.append('equipment', JSON.stringify(equipment));

      const res = await axios.post('/api/pins', fd);
      navigate(`/pin/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className={labelClass} style={{ fontFamily: 'JetBrains Mono' }}>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass}
        style={inputStyle}
      />
    </div>
  );

  const Select = ({ label, name, options }) => (
    <div>
      <label className={labelClass} style={{ fontFamily: 'JetBrains Mono' }}>{label}</label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className={inputClass}
        style={inputStyle}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-10 py-8">
      <div className="mb-8">
        <p className="text-[#859490] text-[11px] tracking-widest uppercase mb-1" style={{ fontFamily: 'JetBrains Mono' }}>
          Share your work
        </p>
        <h1 className="text-2xl font-bold text-[#d4e6e1]" style={{ fontFamily: 'Manrope' }}>
          Upload Your Aquascape
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <div
          onClick={() => fileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative rounded-2xl overflow-hidden cursor-pointer transition-all min-h-48 flex items-center justify-center"
          style={{
            border: `2px dashed ${preview ? 'rgba(87,241,219,0.4)' : 'rgba(60,74,70,0.6)'}`,
            background: 'rgba(40,56,52,0.15)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(87,241,219,0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = preview ? 'rgba(87,241,219,0.4)' : 'rgba(60,74,70,0.6)'; }}
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full object-contain max-h-96" />
          ) : (
            <div className="text-center py-12 px-4">
              <span className="material-symbols-outlined text-[#3c4a46] text-6xl block mb-3">add_photo_alternate</span>
              <p className="text-[#bacac5] text-sm font-bold mb-1" style={{ fontFamily: 'Manrope' }}>
                Click or drag image here
              </p>
              <p className="text-[#859490] text-[11px] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono' }}>
                JPG · PNG · WebP · up to 10MB
              </p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="Title *" name="title" placeholder="My Iwagumi setup" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} style={{ fontFamily: 'JetBrains Mono' }}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell the community about your scape…"
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>
          <Select label="Style" name="style" options={STYLES} />
          <Select label="Tank Size" name="tankSize" options={SIZES} />
          <Field label="Dimensions" name="dimensions" placeholder="60×30×36 cm" />
          <Select label="Substrate" name="substrate" options={SUBSTRATES} />
          <Select label="CO₂" name="co2" options={CO2_OPTS} />
          <Select label="Progression Stage" name="progressionStage" options={STAGES} />
        </div>

        <div
          className="rounded-2xl p-5 space-y-5"
          style={{ background: 'rgba(40,56,52,0.2)', border: '1px solid rgba(60,74,70,0.4)' }}
        >
          <TagInput label="Flora" values={flora} onChange={setFlora} />
          <TagInput label="Fauna" values={fauna} onChange={setFauna} />
          <TagInput label="Equipment" values={equipment} onChange={setEquipment} />
        </div>

        {error && (
          <p className="text-red-400 text-sm rounded-xl px-4 py-2.5" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#57f1db] text-[#003731] font-bold py-3.5 rounded-xl text-[11px] tracking-widest uppercase hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          {loading ? 'Uploading…' : 'Publish Pin'}
        </button>
      </form>
    </div>
  );
}
