import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STYLES = ['Nature Aquarium', 'Iwagumi', 'Dutch', 'Biotope', 'Jungle', 'Paludarium', 'Blackwater', 'Other'];
const SIZES = ['Nano', 'Small', 'Medium', 'Large'];
const SUBSTRATES = ['ADA Aqua Soil', 'Dirted', 'Sand', 'Gravel', 'Mixed'];
const CO2_OPTS = ['Injected', 'Excel/Liquid', 'None'];
const STAGES = ['New Setup', 'Growing In', 'Mature', 'Rescaped'];

function Field({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select name={name} value={value} onChange={onChange} className="input-field">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TagInput({ label, values, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={`Add ${label.toLowerCase()}…`}
          className="input-field"
        />
        <button type="button" onClick={add} className="btn-primary rounded-xl px-4 py-2 text-sm">
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span key={v} className="tag">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-subtle hover:text-red-400 transition-colors ml-0.5"
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

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 fade-rise">
      <div className="mb-8">
        <p className="mono-caps text-subtle mb-1">Share your work</p>
        <h1 className="text-2xl font-bold text-foam">Upload Your Aquascape</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <div
          onClick={() => fileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative rounded-2xl overflow-hidden cursor-pointer transition-colors min-h-48 flex items-center justify-center
            border-2 border-dashed bg-ink/15 hover:border-aqua/50 ${preview ? 'border-aqua/40' : 'border-line/60'}`}
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full object-contain max-h-96" />
          ) : (
            <div className="text-center py-12 px-4">
              <span className="material-symbols-outlined text-line text-6xl block mb-3">add_photo_alternate</span>
              <p className="text-mist text-sm font-bold mb-1">Click or drag image here</p>
              <p className="mono-caps text-subtle">JPG · PNG · WebP · up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="Title *" name="title" value={form.title} onChange={handleChange} placeholder="My Iwagumi setup" />
          </div>
          <div className="md:col-span-2">
            <label className="field-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell the community about your scape…"
              className="input-field resize-none"
            />
          </div>
          <Select label="Style" name="style" value={form.style} onChange={handleChange} options={STYLES} />
          <Select label="Tank Size" name="tankSize" value={form.tankSize} onChange={handleChange} options={SIZES} />
          <Field label="Dimensions" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="60×30×36 cm" />
          <Select label="Substrate" name="substrate" value={form.substrate} onChange={handleChange} options={SUBSTRATES} />
          <Select label="CO₂" name="co2" value={form.co2} onChange={handleChange} options={CO2_OPTS} />
          <Select label="Progression Stage" name="progressionStage" value={form.progressionStage} onChange={handleChange} options={STAGES} />
        </div>

        <div className="surface rounded-2xl p-5 space-y-5">
          <TagInput label="Flora" values={flora} onChange={setFlora} />
          <TagInput label="Fauna" values={fauna} onChange={setFauna} />
          <TagInput label="Equipment" values={equipment} onChange={setEquipment} />
        </div>

        {error && <p className="error-note">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mono-caps w-full py-3.5 rounded-xl active:scale-[0.99]"
        >
          {loading ? 'Uploading…' : 'Publish Pin'}
        </button>
      </form>
    </div>
  );
}
