import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import { Globe, LogOut, UserRound } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>

      {/* ─── Floating Admin Menu Button ─── */}
      <div ref={menuRef} className="admin-fab-container">
        <button
          className={`admin-fab ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú Admin"
        >
          <span className="admin-fab-icon">🦷</span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="admin-fab-menu">
            <div className="admin-fab-menu-header">
              <span className="admin-fab-menu-title">Panel Admin</span>
              <span className="admin-fab-menu-subtitle">Jenny Dentista</span>
            </div>
            <div className="admin-fab-menu-divider" />
            <button
              className="admin-fab-menu-item"
              onClick={() => { setMenuOpen(false); navigate('/admin/about'); }}
            >
              <UserRound size={16} />
              About Me
            </button>
            <button
              className="admin-fab-menu-item"
              onClick={() => { setMenuOpen(false); navigate('/'); }}
            >
              <Globe size={16} />
              Ver sitio web
            </button>
            <button
              className="admin-fab-menu-item admin-fab-menu-item-danger"
              onClick={() => { setMenuOpen(false); handleLogout(); }}
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '3.75rem 1rem calc(65px + 1.5rem + env(safe-area-inset-bottom))',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}>
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <BottomNavBar />
    </div>
  );
}
