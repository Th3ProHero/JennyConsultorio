import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Generic hardcoded credentials for now as requested
    if (username === 'admin' && password === 'jenny123') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--color-primary-50)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Lock size={32} />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          Acceso Restringido
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Por favor, ingresa tus credenciales de administrador.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="input w-full"
                style={{ paddingLeft: '2.75rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="input w-full"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', textAlign: 'center', margin: '0' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
