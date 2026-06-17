import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-[#061613] text-[#d4e6e1] placeholder:text-[#859490]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#57f1db] transition-all';
  const inputStyle = { border: '1px solid rgba(60,74,70,0.6)' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'rgba(6,22,19,0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(87,241,219,0.15)',
        }}
      >
        {/* Logo mark */}
        <div className="text-center mb-6">
          <p className="text-[#859490] text-[11px] tracking-widest uppercase mb-1" style={{ fontFamily: 'JetBrains Mono' }}>
            {tab === 'login' ? 'Welcome back' : 'Join the community'}
          </p>
          <h1 className="text-2xl font-bold text-[#d4e6e1]" style={{ fontFamily: 'Manrope' }}>
            AquaScape Inspire
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="flex mb-6 p-1 rounded-xl"
          style={{ background: 'rgba(40,56,52,0.4)' }}
        >
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[11px] tracking-widest uppercase font-bold transition-all ${
                tab === t
                  ? 'bg-[#57f1db] text-[#003731] shadow-lg'
                  : 'text-[#859490] hover:text-[#d4e6e1]'
              }`}
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-[#859490] text-[11px] tracking-widest uppercase mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className={inputClass}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label className="block text-[#859490] text-[11px] tracking-widest uppercase mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[#859490] text-[11px] tracking-widest uppercase mb-1.5" style={{ fontFamily: 'JetBrains Mono' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#57f1db] text-[#003731] font-bold py-3 rounded-xl text-[11px] tracking-widest uppercase hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all mt-2"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
