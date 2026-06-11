import { Outlet, useNavigate } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Top Header Admin */}
      <header style={{
        background: 'var(--color-surface)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.125rem' }}>🦷</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
              Panel Admin
            </h1>
            <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              Jenny Dentista
            </p>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
        >
          <ArrowLeft size={14} />
          Ver sitio web
        </button>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '1.5rem 1rem calc(65px + 1.5rem + env(safe-area-inset-bottom))', // Bottom padding for nav bar
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
