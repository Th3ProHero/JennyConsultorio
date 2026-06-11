import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import MetricCard from '../../components/admin/MetricCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { DollarSign, CalendarDays, Users, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data, loading, error } = useFetch(() => api.getDashboard(selectedMonth, selectedYear), [selectedMonth, selectedYear]);

  if (error) return <div className="p-4 text-red-500">Error al cargar dashboard: {error}</div>;

  const formatCurrency = (value) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  const COLORS = ['var(--color-primary)', 'var(--color-primary-light)', 'var(--color-primary-dark)'];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Resumen General
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Métricas de tu consultorio.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="input" style={{ width: 'auto', padding: '0.4rem 0.5rem', fontSize: '0.875rem' }}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="input" style={{ width: 'auto', padding: '0.4rem 0.5rem', fontSize: '0.875rem' }}>
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
          </select>
        </div>
      </div>

      {loading || !data ? (
        <LoadingSpinner text="Cargando métricas..." />
      ) : (
        <>

      {/* Grid de Métricas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <MetricCard 
          title="Ingresos Mes" 
          value={formatCurrency(data.monthlyRevenue)} 
          icon={DollarSign} 
        />
        <MetricCard 
          title="Citas Hoy" 
          value={data.todayAppointments} 
          icon={CalendarDays} 
        />
        <MetricCard 
          title="Total Pacientes" 
          value={data.totalPatients} 
          icon={Users} 
        />
        <MetricCard 
          title="Pendientes" 
          value={data.pendingAppointments} 
          icon={Clock} 
        />
      </div>

      {/* Gráfico y Agenda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Servicios */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Top Tratamientos (Mes)</h3>
          </div>
          
          <div style={{ height: '250px', width: '100%' }}>
            {data.topServices && data.topServices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topServices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-bg)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.topServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No hay datos suficientes</p>
              </div>
            )}
          </div>
        </section>

        {/* Citas de Hoy */}
        <section className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Citas de Hoy</h3>
          
          {data.todaySchedule && data.todaySchedule.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.todaySchedule.map(apt => {
                const time = new Date(apt.scheduledDate).toLocaleTimeString('es-MX', { 
                  hour: '2-digit', minute: '2-digit' 
                });
                
                return (
                  <div key={apt.id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem', borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg)', border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ 
                      minWidth: '60px', textAlign: 'center',
                      fontWeight: 700, color: 'var(--color-primary-dark)' 
                    }}>
                      {time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{apt.patientName}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{apt.serviceName}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
              <CalendarDays size={40} style={{ margin: '0 auto 1rem', color: 'var(--color-border)' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>No hay citas programadas para hoy.</p>
            </div>
          )}
        </section>
      </div>
      </>
      )}
    </div>
  );
}
