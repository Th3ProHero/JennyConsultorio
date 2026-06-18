import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, DollarSign, Settings, StickyNote } from 'lucide-react';

export default function BottomNavBar() {
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Inicio', end: true },
    { path: '/admin/agenda', icon: CalendarDays, label: 'Agenda' },
    { path: '/admin/patients', icon: Users, label: 'Pacientes' },
    { path: '/admin/finances', icon: DollarSign, label: 'Finanzas' },
    { path: '/admin/notes', icon: StickyNote, label: 'Notas' },
    { path: '/admin/settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      paddingBottom: 'env(safe-area-inset-bottom)', // Support for iOS notch
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '65px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                flex: 1,
                height: '100%',
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'animate-slide-up' : ''}
                  />
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: isActive ? 600 : 500,
                  }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      width: '30px',
                      height: '3px',
                      background: 'var(--color-primary)',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                    }} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
