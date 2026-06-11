import { useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import InteractiveCalendar from '../../components/admin/InteractiveCalendar';
import AppointmentForm from '../../components/admin/AppointmentForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);

  const { data: appointments, loading, refetch } = useFetch(() => api.getAppointmentsByDate(selectedDate), [selectedDate]);
  const { execute: saveAppointment, loading: saving } = useApi();
  const { execute: deleteAppointment } = useApi();

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSlotClick = (time) => {
    setSelectedAppointment(null);
    setSelectedSlotTime(time);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appt) => {
    setSelectedAppointment(appt);
    setSelectedSlotTime(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedAppointment) {
        await saveAppointment(api.updateAppointment, selectedAppointment.id, formData);
      } else {
        await saveAppointment(api.createAppointment, formData);
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar la cita: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta cita permanentemente? (Recomendación: usa Cancelar en su lugar).")) {
      try {
        await deleteAppointment(api.deleteAppointment, id);
        refetch();
        handleCloseModal();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  // Format date nicely
  const dateDisplay = new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Agenda Interactiva
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
            {dateDisplay}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handlePrevDay} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ChevronLeft size={18} />
          </button>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="input" 
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          />
          <button onClick={handleNextDay} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ChevronRight size={18} />
          </button>
          <button onClick={() => handleSlotClick('09:00')} className="btn btn-primary" style={{ padding: '0.625rem', marginLeft: '0.5rem' }}>
            <CalIcon size={18} /> <span className="hidden sm:inline" style={{ marginLeft: '0.5rem' }}>Nueva Cita</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Cargando agenda..." />
      ) : (
        <InteractiveCalendar 
          appointments={appointments || []} 
          onSlotClick={handleSlotClick}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {isModalOpen && (
        <AppointmentForm 
          appointment={selectedAppointment}
          selectedDate={selectedDate}
          selectedTime={selectedSlotTime}
          onSave={handleSave}
          onClose={handleCloseModal}
          onDelete={selectedAppointment ? handleDelete : null}
          saving={saving}
        />
      )}
    </div>
  );
}
