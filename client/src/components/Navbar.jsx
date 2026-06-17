import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AquascapeLogo() {
  return (
    <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tank walls — frameless (open top, sides + bottom) */}
      <path d="M2 2 L2 31 L40 31 L40 2" stroke="#57f1db" strokeWidth="1.5" strokeLinecap="round" fill="rgba(87,241,219,0.03)"/>

      {/* Substrate */}
      <path d="M2 27 Q8 26 12 27 Q18 28 22 27 Q30 26 40 27" stroke="#57f1db" strokeWidth="0.8" fill="none" opacity="0.5"/>

      {/* Left rock cluster */}
      <ellipse cx="8" cy="28.5" rx="4" ry="2" fill="rgba(87,241,219,0.12)" stroke="#57f1db" strokeWidth="0.7" opacity="0.6"/>
      <ellipse cx="14" cy="29" rx="3" ry="1.5" fill="rgba(87,241,219,0.08)" stroke="#57f1db" strokeWidth="0.7" opacity="0.5"/>

      {/* Spider wood — main trunk + branches */}
      <path d="M10 27 L9 19 L7 11" stroke="#57f1db" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 19 L14 13" stroke="#57f1db" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
      <path d="M9 19 L5 15" stroke="#57f1db" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>

      {/* Anubias leaves */}
      <path d="M11 25 C8 19 11 13 15 12 C16 16 13 22 11 25Z" fill="rgba(87,241,219,0.55)"/>
      <path d="M16 23 C15 17 19 12 23 12 C23 17 20 21 16 23Z" fill="rgba(87,241,219,0.42)"/>
      <path d="M22 22 C22 17 25 13 28 14 C28 18 25 21 22 22Z" fill="rgba(87,241,219,0.3)"/>

      {/* Right stone */}
      <ellipse cx="33" cy="28.5" rx="4.5" ry="2" fill="rgba(87,241,219,0.1)" stroke="#57f1db" strokeWidth="0.7" opacity="0.5"/>

      {/* Rising bubbles */}
      <circle cx="35" cy="18" r="1.2" stroke="#57f1db" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <circle cx="37" cy="12" r="0.8" stroke="#57f1db" strokeWidth="0.7" fill="none" opacity="0.35"/>
      <circle cx="34" cy="6" r="0.5" stroke="#57f1db" strokeWidth="0.6" fill="none" opacity="0.2"/>
    </svg>
  );
}

export default function Navbar({ searchValue, onSearch }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className="sticky top-0 z-50 w-full flex items-center justify-between gap-6 border-b border-[#3c4a46]/20"
      style={{ height: '64px', padding: '0 48px', background: 'rgba(6,22,19,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      {/* Logo + Nav */}
      <div className="flex items-center gap-6 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <AquascapeLogo />
          <span className="text-[15px] font-bold tracking-tight text-[#57f1db] leading-none hidden lg:block" style={{ fontFamily: 'Manrope' }}>
            AQUASCAPE INSPIRE
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            to="/"
            className="flex items-center text-[#57f1db] font-bold border-b-2 border-[#57f1db] pb-0.5 text-[11px] tracking-widest uppercase leading-none"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Explore
          </Link>
          <span
            className="flex items-center text-[#bacac5] hover:text-[#d4e6e1] transition-colors text-[11px] tracking-widest uppercase cursor-pointer leading-none"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Community
          </span>
        </nav>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859490] group-focus-within:text-[#57f1db] transition-colors pointer-events-none"
            style={{ fontSize: '18px', lineHeight: 1 }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search tanks, plants, styles..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-full text-sm text-[#d4e6e1] placeholder:text-[#859490]/70 outline-none focus:ring-1 focus:ring-[#57f1db] transition-all"
            style={{ background: 'rgba(40,56,52,0.4)', border: '1px solid rgba(60,74,70,0.4)', padding: '8px 16px 8px 36px' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {currentUser ? (
          <>
            <Link
              to="/upload"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full font-bold hover:brightness-110 active:scale-95 transition-all text-[11px] tracking-widest uppercase leading-none"
              style={{ background: '#57f1db', color: '#003731', padding: '9px 18px', fontFamily: 'JetBrains Mono' }}
            >
              Create
            </Link>
            <span
              className="material-symbols-outlined hidden md:flex items-center justify-center text-[#bacac5] hover:text-[#57f1db] cursor-pointer transition-colors"
              style={{ fontSize: '22px' }}
            >
              notifications
            </span>
            <Link to={`/profile/${currentUser.username}`} className="flex items-center">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full object-cover border border-[#3c4a46]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#283834] border border-[#3c4a46] flex items-center justify-center text-[#57f1db] text-sm font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center text-[#859490] hover:text-[#57f1db] text-[11px] tracking-widest uppercase transition-colors leading-none"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center rounded-full font-bold hover:brightness-110 active:scale-95 transition-all text-[11px] tracking-widest uppercase leading-none"
            style={{ background: '#57f1db', color: '#003731', padding: '9px 20px', fontFamily: 'JetBrains Mono' }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
