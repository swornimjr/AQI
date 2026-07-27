import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AquascapeLogo } from '../components/Navbar';

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="surface w-full max-w-md rounded-2xl p-8 shadow-sm fade-rise">
        {/* Logo mark */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <AquascapeLogo width={56} height={45} />
          </div>
          <p className="text-sm text-fog mb-1">
            {tab === 'login' ? 'Welcome back' : 'Join the community'}
          </p>
          <h1 className="text-2xl font-bold text-ink">
            AquaScape Inspire
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 p-1 rounded-xl bg-fill">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-card text-ink shadow-sm'
                  : 'text-fog hover:text-ink'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="field-label">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="input-field"
            />
          </div>

          {error && <p className="error-note">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl mt-2"
          >
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
