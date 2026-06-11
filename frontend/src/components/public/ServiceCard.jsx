import { Stethoscope, Sparkles, MessageCircle } from 'lucide-react';

export default function ServiceCard({ service, onSelect, isGrid }) {
  const formatCurrency = (value) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(value);

  const calculateDiscount = () => {
    if (service.isPromotion && service.originalPrice && service.originalPrice > service.basePrice) {
      return Math.round(((service.originalPrice - service.basePrice) / service.originalPrice) * 100);
    }
    return null;
  };

  const discountPercent = calculateDiscount();

  return (
    <div className={`card ${!isGrid ? 'scroll-snap-item' : ''}`} style={{ 
      width: isGrid ? '100%' : '280px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', overflow: 'hidden', border: service.isPromotion ? '1px solid var(--color-accent-pink)' : '1px solid var(--color-border)'
    }}>
      {service.isPromotion && (
        <div style={{
          position: 'absolute', top: '1rem', right: '-2rem',
          background: 'var(--color-accent-pink)', color: 'white',
          padding: '0.25rem 2.5rem', transform: 'rotate(45deg)',
          fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.05em',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          PROMO
        </div>
      )}

      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: service.isPromotion ? 'var(--color-accent-pink-light)' : 'var(--color-primary-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <Stethoscope size={24} color={service.isPromotion ? 'var(--color-accent-pink-dark)' : 'var(--color-primary)'} />
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', paddingRight: '1rem', lineHeight: 1.3 }}>
        {service.name}
      </h3>
      
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, flex: 1 }}>
        {service.description}
      </p>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: service.isPromotion ? 'var(--color-accent-pink-dark)' : 'var(--color-text)' }}>
            {formatCurrency(service.basePrice)}
          </span>
          {service.isPromotion && service.originalPrice && (
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
              {formatCurrency(service.originalPrice)}
            </span>
          )}
          {discountPercent && (
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'white', background: 'var(--color-success)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: 'auto' }}>
              -{discountPercent}%
            </span>
          )}
        </div>
        
        <button 
          onClick={() => onSelect(service)}
          className={`btn ${service.isPromotion ? 'btn-primary' : 'btn-outline'}`} 
          style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '0.9375rem',
                   ...(service.isPromotion ? { background: 'var(--color-accent-pink)', borderColor: 'var(--color-accent-pink)' } : {}) 
                }}
        >
          Me Interesa
        </button>
      </div>
    </div>
  );
}
