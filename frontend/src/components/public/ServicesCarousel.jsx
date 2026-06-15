import { useState } from 'react';
import ServiceCard from './ServiceCard';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function ServicesCarousel({ services = [], loading = false }) {
  const [showAll, setShowAll] = useState(false);

  if (loading) return <LoadingSpinner text="Cargando servicios..." />;

  const handleWhatsAppSelect = (service) => {
    const msg = encodeURIComponent(`Hola, me interesa el servicio de ${service.name}. ¿Tienen disponibilidad?`);
    window.open(`https://wa.me/525535756858?text=${msg}`, '_blank');
  };

  return (
    <section id="servicios" style={{
      padding: '3rem 0',
      background: 'var(--color-surface)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem', fontSize: '0.7rem' }}>
            Nuestros Servicios
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginTop: '0.5rem',
          }}>
            Tratamientos <span className="text-gradient">Profesionales</span>
          </h2>
          <p style={{
            fontSize: '0.9375rem', color: 'var(--color-text-muted)',
            maxWidth: '450px', margin: '0.75rem auto 0',
          }}>
            Descubre nuestros servicios con la mejor calidad y precios accesibles.
          </p>
        </div>

        {/* Scrollable carousel or Grid */}
        <div
          className={showAll ? "" : "scroll-snap-x"}
          style={showAll ? {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            padding: '0 1.5rem'
          } : { paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} isGrid={showAll} onSelect={handleWhatsAppSelect} />
          ))}
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            className="btn btn-outline animate-fade-in" 
            onClick={() => setShowAll(!showAll)}
            style={{ 
              padding: '0.75rem 2.5rem', 
              borderColor: 'var(--color-accent-pink)', 
              color: 'var(--color-accent-pink-dark)',
              fontWeight: 800
            }}
          >
            {showAll ? 'Ver Menos' : 'Ver todo el catálogo'}
          </button>
        </div>

        {/* Scroll hint on mobile */}
        {!showAll && (
          <p className="animate-fade-in" style={{
            textAlign: 'center', fontSize: '0.75rem',
            color: 'var(--color-text-muted)', marginTop: '1rem',
            opacity: 0.6,
          }}>
            ← Desliza para ver más →
          </p>
        )}
      </div>
    </section>
  );
}
