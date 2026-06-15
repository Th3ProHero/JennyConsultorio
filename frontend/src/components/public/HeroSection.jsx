import { useState } from 'react';
import { Stethoscope, Phone, Award, Star, Heart, ChevronDown, Sparkles } from 'lucide-react';

export default function HeroSection({ dentists = [] }) {
  const [expandedProfile, setExpandedProfile] = useState(false);
  const jenny = dentists.length > 0 ? dentists[0] : null;

  return (
    <section id="hero-section" className="gradient-hero" style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      {/* Animaciones lindas de fondo (toques rosas y azules) */}
      <div className="animate-float-slow" style={{
        position: 'absolute', top: '10%', left: '5%', color: 'var(--color-accent-pink)', opacity: 0.6
      }}>
        <Heart size={40} fill="var(--color-accent-pink-light)" />
      </div>
      <div className="animate-float" style={{
        position: 'absolute', top: '15%', right: '25%', fontSize: '2.5rem', opacity: 0.4, userSelect: 'none'
      }}>
        🦷
      </div>
      <div className="animate-float" style={{
        position: 'absolute', top: '20%', right: '10%', color: 'var(--color-primary-light)', opacity: 0.8
      }}>
        <Sparkles size={48} />
      </div>
      <div className="animate-float-slow" style={{
        position: 'absolute', bottom: '10%', right: '25%', fontSize: '2rem', opacity: 0.3, animationDelay: '1.5s', userSelect: 'none'
      }}>
        🪥
      </div>
      <div className="animate-float-slow" style={{
        position: 'absolute', bottom: '15%', left: '15%', color: 'var(--color-accent-pink)', opacity: 0.5, animationDelay: '1s'
      }}>
        <Star size={32} fill="var(--color-accent-pink-light)" />
      </div>
      <div className="animate-float" style={{
        position: 'absolute', top: '40%', left: '10%', fontSize: '2rem', opacity: 0.3, animationDelay: '2.5s', userSelect: 'none'
      }}>
        ✨
      </div>
      <div className="animate-float" style={{
        position: 'absolute', bottom: '25%', right: '5%', color: 'var(--color-primary-light)', opacity: 0.6, animationDelay: '2s'
      }}>
        <Heart size={36} fill="var(--color-primary-100)" />
      </div>
      <div className="animate-float-slow" style={{
        position: 'absolute', bottom: '30%', left: '20%', fontSize: '2.5rem', opacity: 0.4, animationDelay: '0.5s', userSelect: 'none'
      }}>
        😁
      </div>

      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-accent-pink-light) 0%, transparent 70%)',
        opacity: 0.6
      }} />
      <div style={{
        position: 'absolute', bottom: '0px', left: '-40px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)',
        opacity: 0.5
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--color-accent-pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 158, 187, 0.4)'
            }}>
              <Stethoscope size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1.2 }}>
                Jenny F.
              </h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Consultorio Dental
              </p>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', paddingTop: '1rem' }}>
          <div className="badge" style={{ 
            marginBottom: '1.5rem', fontSize: '0.7rem', 
            background: 'var(--color-accent-pink-light)', color: 'var(--color-accent-pink-dark)' 
          }}>
            ✨ Tu sonrisa, nuestra pasión
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            color: 'var(--color-text)',
          }}>
            Sonríe con{' '}
            <span style={{ color: 'var(--color-accent-pink-dark)' }}>confianza</span>
          </h2>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--color-text-muted)',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            Cuidamos tu salud dental con tecnología de vanguardia, un trato cálido y profesionalismo.
          </p>

          <div className="btn-container-mobile" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#servicios" className="btn btn-primary btn-full-mobile" style={{ padding: '0.875rem 2rem', fontSize: '0.9375rem', background: 'var(--color-accent-pink)', boxShadow: '0 4px 14px rgba(255, 158, 187, 0.4)' }}>
              Ver Servicios
            </a>
            <a href="#consultorios" className="btn btn-outline btn-full-mobile" style={{ padding: '0.875rem 2rem', fontSize: '0.9375rem', borderColor: 'var(--color-accent-pink)', color: 'var(--color-accent-pink-dark)' }}>
              Ubicaciones
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-200" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem', marginTop: '3rem', maxWidth: '450px', margin: '3rem auto 0',
        }}>
          {[
            { value: '+5,000', label: 'Pacientes' },
            { value: '+10', label: 'Años Exp.' },
            { value: '4.9★', label: 'Calificación' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-accent-pink-dark)' }}>{stat.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Jenny Profile Card (Clickable) */}
        {jenny && (
          <div className="animate-fade-in-up delay-300" style={{ marginTop: '3rem' }}>
            <div 
              className="card" 
              onClick={() => setExpandedProfile(!expandedProfile)}
              style={{ 
                padding: '1.5rem', 
                textAlign: 'center', 
                maxWidth: '350px', 
                margin: '0 auto', 
                cursor: 'pointer',
                border: '2px solid transparent',
                borderColor: expandedProfile ? 'var(--color-accent-pink-light)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'var(--color-accent-pink-light)', margin: '0 auto 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Award size={32} style={{ color: 'var(--color-accent-pink-dark)' }} />
              </div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>Dra. {jenny.name}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                {jenny.specialty}
              </p>
              
              {/* Expandable Content */}
              <div style={{ 
                maxHeight: expandedProfile ? '200px' : '0px', 
                overflow: 'hidden', 
                transition: 'max-height 0.4s ease',
                opacity: expandedProfile ? 1 : 0
              }}>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    Odontóloga especialista apasionada por crear sonrisas hermosas y saludables. Te brindamos un trato cálido, honesto y con la mejor tecnología dental.
                  </p>
                  {jenny.phone && (
                    <a href={`tel:${jenny.phone}`} onClick={(e) => e.stopPropagation()} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-accent-pink-dark)',
                      textDecoration: 'none', fontWeight: 600
                    }}>
                      <Phone size={16} /> Contacto directo
                    </a>
                  )}
                </div>
              </div>

              {!expandedProfile && (
                <div style={{ marginTop: '1rem', color: 'var(--color-text-muted)', animation: 'pulse-gentle 2s infinite' }}>
                  <ChevronDown size={20} style={{ margin: '0 auto' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
