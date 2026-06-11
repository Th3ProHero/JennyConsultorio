export default function MetricCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
            {value}
          </h3>
          
          {trend && (
            <p style={{ 
              fontSize: '0.75rem', 
              fontWeight: 500,
              marginTop: '0.5rem',
              color: trend > 0 ? 'var(--color-success)' : 'var(--color-danger)'
            }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mes pasado
            </p>
          )}
        </div>
        
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--color-primary-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: 'var(--color-primary)' }} />
        </div>
      </div>
    </div>
  );
}
