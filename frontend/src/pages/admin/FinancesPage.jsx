import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function FinancesPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: dashboard, loading } = useFetch(() => api.getDashboard(selectedMonth, selectedYear), [selectedMonth, selectedYear]);
  
  const [completedAppts, setCompletedAppts] = useState([]);

  useEffect(() => {
    const allAppts = JSON.parse(localStorage.getItem('mockAppointments')) || [];
    const completed = allAppts
      .filter(a => {
        const d = new Date(a.scheduledDate);
        return a.status === 'COMPLETED' && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      })
      .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
    setCompletedAppts(completed);
  }, [dashboard, selectedMonth, selectedYear]);

  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
          Resumen Financiero
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="input" style={{ width: 'auto', padding: '0.5rem' }}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="input" style={{ width: 'auto', padding: '0.5rem' }}>
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Calculando métricas..." />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', background: 'var(--color-primary-dark)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            <DollarSign size={20} /> <span style={{ fontWeight: 600 }}>Ingresos del Mes</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(dashboard?.monthlyRevenue || 0)}</p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
            <CheckCircle size={20} style={{ color: 'var(--color-success)' }}/> <span style={{ fontWeight: 600 }}>Citas Completadas</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{completedAppts.length}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
        Historial de Ingresos
      </h3>

      <div className="card">
        {completedAppts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8125rem' }}>Fecha</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8125rem' }}>Paciente</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8125rem' }}>Tratamiento</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8125rem', textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {completedAppts.map(appt => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid var(--color-bg)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      {new Date(appt.scheduledDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>{appt.patientName}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{appt.serviceName}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, textAlign: 'right', color: 'var(--color-success)' }}>
                      {formatCurrency(appt.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <TrendingUp size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>Aún no hay citas marcadas como completadas este mes.</p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
