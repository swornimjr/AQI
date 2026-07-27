import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AquascapeLogo({ width = 42, height = 34 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tank walls — frameless (open top, sides + bottom) */}
      <path d="M2 2 L2 31 L40 31 L40 2" stroke="#176a4d" strokeWidth="1.5" strokeLinecap="round" fill="rgba(23,106,77,0.03)"/>

      {/* Substrate */}
      <path d="M2 27 Q8 26 12 27 Q18 28 22 27 Q30 26 40 27" stroke="#176a4d" strokeWidth="0.8" fill="none" opacity="0.5"/>

      {/* Left rock cluster */}
      <ellipse cx="8" cy="28.5" rx="4" ry="2" fill="rgba(23,106,77,0.12)" stroke="#176a4d" strokeWidth="0.7" opacity="0.6"/>
      <ellipse cx="14" cy="29" rx="3" ry="1.5" fill="rgba(23,106,77,0.08)" stroke="#176a4d" strokeWidth="0.7" opacity="0.5"/>

      {/* Spider wood — main trunk + branches */}
      <path d="M10 27 L9 19 L7 11" stroke="#176a4d" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 19 L14 13" stroke="#176a4d" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
      <path d="M9 19 L5 15" stroke="#176a4d" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>

      {/* Anubias leaves */}
      <path d="M11 25 C8 19 11 13 15 12 C16 16 13 22 11 25Z" fill="rgba(23,106,77,0.55)"/>
      <path d="M16 23 C15 17 19 12 23 12 C23 17 20 21 16 23Z" fill="rgba(23,106,77,0.42)"/>
      <path d="M22 22 C22 17 25 13 28 14 C28 18 25 21 22 22Z" fill="rgba(23,106,77,0.3)"/>

      {/* Right stone */}
      <ellipse cx="33" cy="28.5" rx="4.5" ry="2" fill="rgba(23,106,77,0.1)" stroke="#176a4d" strokeWidth="0.7" opacity="0.5"/>

      {/* Rising bubbles */}
      <circle cx="35" cy="18" r="1.2" stroke="#176a4d" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <circle cx="37" cy="12" r="0.8" stroke="#176a4d" strokeWidth="0.7" fill="none" opacity="0.35"/>
      <circle cx="34" cy="6" r="0.5" stroke="#176a4d" strokeWidth="0.6" fill="none" opacity="0.2"/>
    </svg>
  );
}

export function Avatar({ user, size = 'w-8 h-8', textSize = 'text-sm' }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className={`${size} rounded-full object-cover border border-line shrink-0`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-kelp-tint border border-line flex items-center justify-center text-kelp ${textSize} font-bold shrink-0`}>
      {user?.username?.[0]?.toUpperCase()}
    </div>
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
    <header className="frost sticky top-0 z-50 w-full h-16 px-6 lg:px-12 flex items-center justify-between gap-6 border-b border-line">
      {/* Logo + Nav */}
      <div className="flex items-center gap-6 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <AquascapeLogo />
          <span className="text-[15px] font-bold tracking-tight text-ink leading-none hidden lg:block">
            AquaScape Inspire
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-fog group-focus-within:text-kelp transition-colors pointer-events-none"
            style={{ fontSize: '18px', lineHeight: 1 }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search tanks, plants, styles..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-full bg-fill border border-transparent py-2 pl-9 pr-4 text-sm text-ink placeholder:text-fog outline-none focus:bg-card focus:border-line focus:ring-1 focus:ring-kelp/40 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {currentUser ? (
          <>
            <Link to="/upload" className="btn-primary hidden lg:inline-flex rounded-full px-4 py-2">
              Create
            </Link>
            <Link to={`/profile/${currentUser.username}`} className="flex items-center">
              <Avatar user={currentUser} />
            </Link>
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center text-sm font-medium text-fog hover:text-ink transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn-primary rounded-full px-4 py-2">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
