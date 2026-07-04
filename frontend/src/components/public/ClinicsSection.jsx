import { MapPin, Navigation, Clock } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../api/client';

export default function ClinicsSection() {
  const { data: clinics, loading } = useFetch(api.getPublicClinics);

  const displayClinics = clinics && clinics.length > 0 ? clinics : [];

  if (loading) return null; // Silently wait; HeroSection already shows a full spinner

  if (displayClinics.length === 0) return null; // Hide section if no clinics configured

  return (
    <section id="consultorios" style={{
      padding: '4rem 0',
      background: 'var(--color-bg)',
      borderTop: '1px solid var(--color-border)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge" style={{ 
            marginBottom: '0.75rem', fontSize: '0.7rem',
            background: 'var(--color-accent-pink-light)', color: 'var(--color-accent-pink-dark)'
          }}>
            Nuestras Instalaciones
          </span>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--color-text)',
            marginTop: '0.5rem',
          }}>
            Visítanos en nuestros <span style={{ color: 'var(--color-accent-pink-dark)' }}>Consultorios</span>
          </h2>
          <p style={{
            fontSize: '0.9375rem', color: 'var(--color-text-muted)',
            maxWidth: '500px', margin: '0.75rem auto 0',
          }}>
            {displayClinics.length === 1
              ? 'Contamos con una ubicación equipada con la mejor tecnología para tu comodidad.'
              : `Contamos con ${displayClinics.length} ubicaciones estratégicas equipadas con la mejor tecnología para tu comodidad.`}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: displayClinics.length === 1 ? '420px' : '800px',
          margin: '0 auto'
        }}>
          {displayClinics.map((clinic) => (
            <div key={clinic.id} className="card" style={{ 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: 'var(--color-accent-pink-light)'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--color-primary-50)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MapPin size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {clinic.name}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <MapPin size={16} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                  {clinic.address}
                </p>
                {clinic.hours && (
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Clock size={16} />
                    {clinic.hours}
                  </p>
                )}
              </div>

              {clinic.mapUrl && (
                <a 
                  href={clinic.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline" 
                  style={{ 
                    marginTop: '1rem', 
                    borderColor: 'var(--color-primary-light)', 
                    color: 'var(--color-primary-dark)' 
                  }}
                >
                  <Navigation size={16} /> Ver en Google Maps
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
