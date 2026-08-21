import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const linkClass = (path) =>
    `relative pb-1 transition-colors ${
      pathname === path ? 'text-ink' : 'text-muted hover:text-ink'
    }`;

  return (
    <nav className="bg-paper/90 backdrop-blur sticky top-0 z-50 border-b border-hair">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-[68px]">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/codeclub_logo.png"
            alt="Code Club"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <span className="font-display text-2xl font-bold text-ink tracking-tight">CodeClub</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/jobs" className={linkClass('/jobs')}>Jobs</Link>
          <Link to="/verify" className={linkClass('/verify')}>Verify</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
        </div>
        <Link
          to="/admin/login"
          className="font-mono text-xs tracking-wide uppercase border border-ink/20 rounded-full px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
