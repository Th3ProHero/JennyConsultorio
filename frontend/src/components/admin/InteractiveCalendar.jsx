import { useMemo, useState } from 'react';
import { Clock, AlertCircle, Info } from 'lucide-react';

// Generates an array of time slots (e.g. 08:00 to 20:00 every 30 mins)
const generateTimeSlots = (startHour = 8, endHour = 20) => {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    const hh = h.toString().padStart(2, '0');
    slots.push(`${hh}:00`);
    if (h !== endHour) slots.push(`${hh}:30`);
  }
  return slots;
};

export default function InteractiveCalendar({ appointments = [], onSlotClick, onAppointmentClick }) {
  const [showLegend, setShowLegend] = useState(false);
  const timeSlots = useMemo(() => generateTimeSlots(8, 22), []);
  
  // Basic grid setup: Each slot is 60px height. 1 min = 2px.
  const PIXELS_PER_MINUTE = 2;

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const dayStartMinutes = timeToMinutes('08:00');

  // Check for collisions (overlap) ignoring cancelled appointments
  const activeAppointments = appointments.filter(a => a.status !== 'CANCELLED');
  const getOverlaps = (appt) => {
    const startA = timeToMinutes(new Date(appt.scheduledDate).toTimeString().slice(0,5));
    const endA = startA + appt.durationMinutes;
    return activeAppointments.filter(b => {
      if (appt.id === b.id) return false;
      const startB = timeToMinutes(new Date(b.scheduledDate).toTimeString().slice(0,5));
      const endB = startB + b.durationMinutes;
      // Overlap condition
      return Math.max(startA, startB) < Math.min(endA, endB);
    });
  };

  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {/* Legend Toggle Header */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setShowLegend(!showLegend)} 
          className="btn btn-outline" 
          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: showLegend ? 'var(--color-surface-hover)' : 'transparent' }}
        >
          <Info size={16} /> {showLegend ? 'Ocultar Leyenda' : 'Ver Leyenda'}
        </button>
      </div>

      {/* Legend Content */}
      {showLegend && (
        <div className="animate-fade-in" style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: 'var(--color-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-primary)' }}></div> Confirmada
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-success)' }}></div> Completada
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-warning)' }}></div> Por Confirmar
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#8B5CF6' }}></div> Por Reagendar
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--color-surface-hover)', border: '1px dashed var(--color-text-muted)' }}></div> Cancelada
          </div>
        </div>
      )}

      {/* Calendar Grid Container */}
      <div style={{ display: 'flex', height: 'calc(100vh - 300px)', minHeight: '400px', overflowY: 'auto', position: 'relative' }}>        
        {/* Time Labels Column */}
        <div style={{ width: '60px', borderRight: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          {timeSlots.map((time, i) => (
            <div key={time} style={{ 
              height: `${30 * PIXELS_PER_MINUTE}px`, 
              position: 'relative',
              boxSizing: 'border-box'
            }}>
              {/* Only show label on the hour */}
              {time.endsWith(':00') && (
                <span style={{ 
                  position: 'absolute', top: '-8px', right: '8px', 
                  fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 600 
                }}>
                  {time}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Schedule Column */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--color-surface)' }}>
          {/* Background Grid Lines (clickable slots) */}
          {timeSlots.map((time) => (
            <div 
              key={time} 
              onClick={() => onSlotClick(time)}
              style={{ 
                height: `${30 * PIXELS_PER_MINUTE}px`, 
                borderBottom: time.endsWith(':30') ? '1px dashed var(--color-border)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            ></div>
          ))}

          {/* Render Appointments as Absolute Blocks */}
          {appointments.map((appt) => {
            const timeStr = new Date(appt.scheduledDate).toTimeString().slice(0,5);
            const startMins = timeToMinutes(timeStr);
            // Skip rendering if outside our 8am-10pm bounds entirely
            if (startMins < dayStartMinutes || startMins > timeToMinutes('22:00')) return null;

            const top = (startMins - dayStartMinutes) * PIXELS_PER_MINUTE;
            const height = appt.durationMinutes * PIXELS_PER_MINUTE;

            let bgColor = 'var(--color-primary)';
            let borderColor = 'var(--color-primary-dark)';
            let textColor = 'white';
            let opacity = 1;

            if (appt.status === 'PENDING') {
              bgColor = 'var(--color-warning)';
              borderColor = '#D97706';
            } else if (appt.status === 'TO_RESCHEDULE') {
              bgColor = '#8B5CF6'; // Purple
              borderColor = '#6D28D9';
            } else if (appt.status === 'COMPLETED') {
              bgColor = 'var(--color-success)'; // Green
              borderColor = '#047857';
            } else if (appt.status === 'CANCELLED') {
              bgColor = 'transparent';
              borderColor = 'var(--color-text-muted)';
              textColor = 'var(--color-text-muted)';
              opacity = 0.7;
            }

            const overlaps = appt.status !== 'CANCELLED' ? getOverlaps(appt) : [];
            const hasCollision = overlaps.length > 0;

            return (
              <div 
                key={appt.id}
                onClick={(e) => { e.stopPropagation(); onAppointmentClick(appt); }}
                style={{
                  position: 'absolute',
                  top: `${top}px`,
                  left: '10px',
                  right: '10px',
                  height: `${height}px`,
                  background: bgColor,
                  border: `1px ${appt.status === 'CANCELLED' ? 'dashed' : 'solid'} ${borderColor}`,
                  borderLeft: `4px solid ${borderColor}`,
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: textColor,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  opacity,
                  overflow: 'hidden',
                  zIndex: appt.status === 'CANCELLED' ? 1 : 10,
                  boxShadow: appt.status !== 'CANCELLED' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {appt.patientName} - {appt.serviceName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {hasCollision && (
                      <span title="Empalme de horario detectado" style={{ color: appt.status === 'PENDING' ? '#991B1B' : '#FCD34D' }}>
                        <AlertCircle size={14} />
                      </span>
                    )}
                    <span style={{ fontWeight: 600 }}>{timeStr}</span>
                  </div>
                </div>
                <div style={{ opacity: 0.9, marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{appt.clinic}</span>
                  <span style={{textTransform: 'capitalize'}}>{appt.status.toLowerCase().replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
