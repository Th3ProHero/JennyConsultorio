import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../api/client';
import HeroSection from '../../components/public/HeroSection';
import ServicesCarousel from '../../components/public/ServicesCarousel';
import ClinicsSection from '../../components/public/ClinicsSection';
import WhatsAppFAB from '../../components/public/WhatsAppFAB';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function HomePage() {
  const { data: services, loading: loadingServices } = useFetch(api.getPublicServices);
  const { data: dentists, loading: loadingDentists } = useFetch(api.getPublicDentists);

  if (loadingServices && loadingDentists) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" text="Cargando experiencia Jenny Dentista..." />
      </div>
    );
  }

  return (
    <main>
      <HeroSection dentists={dentists || []} />
      <ServicesCarousel services={services || []} loading={loadingServices} />
      <ClinicsSection />
      <WhatsAppFAB />
      
      {/* Footer minimalista */}
      <footer style={{
        background: 'var(--color-surface)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <Link to="/admin" style={{ textDecoration: 'none', cursor: 'default' }}>
            <span style={{ fontSize: '1.25rem', userSelect: 'none' }}>🦷</span>
          </Link>
          <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
            Jenny Dentista
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} Jenny Dentista. Todos los derechos reservados.
          </p>
          <Link to="/aviso-de-privacidad" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', textDecoration: 'underline' }}>
            Aviso de Privacidad
          </Link>
        </div>
      </footer>
    </main>
  );
}
