import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PinDetail from './pages/PinDetail';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Collections from './pages/Collections';
import Auth from './pages/Auth';

function BottomNav() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isActive = (path) => location.pathname === path;

  const items = [
    { to: '/', icon: 'home', label: 'Home' },
    { to: '/upload', icon: 'add_circle', label: 'Create' },
    { to: '/collections', icon: 'bookmarks', label: 'Saved' },
    {
      to: currentUser ? `/profile/${currentUser.username}` : '/auth',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <nav className="frost fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center pt-2 pb-4 px-2 md:hidden border-t border-line">
      {items.map(({ to, icon, label }) => (
        <Link
          key={label}
          to={to}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all ${
            isActive(to) ? 'text-kelp bg-kelp-tint' : 'text-dim hover:text-ink'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
          <span className="text-[10px] font-semibold">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Layout() {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar searchValue={isHome ? search : ''} onSearch={setSearch} />
      <main className="pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Home searchValue={search} />} />
          <Route path="/pin/:id" element={<PinDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
