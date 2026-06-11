import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ServiceForm from '../../components/admin/ServiceForm';
import { Search, Plus, Tag } from 'lucide-react';

export default function SettingsPage() {
  const { data: services, loading, refetch } = useFetch(api.getAdminServices);
  const { execute: saveService, loading: saving } = useApi();
  const { execute: deleteService } = useApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = services?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (service = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedService) {
        await saveService(api.updateService, selectedService.id, formData);
      } else {
        await saveService(api.createService, formData);
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar tratamiento: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tratamiento? Desaparecerá del sitio público de inmediato.")) {
      try {
        await deleteService(api.deleteService, id);
        refetch();
        handleCloseModal();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Catálogo de Tratamientos
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Gestiona los servicios y promociones de tu consultorio.
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ padding: '0.625rem' }}>
          <Plus size={18} /> <span className="hidden sm:inline" style={{ marginLeft: '0.5rem' }}>Nuevo</span>
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          className="input"
          style={{ paddingLeft: '2.5rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? (
          <LoadingSpinner text="Cargando tratamientos..." />
        ) : filteredServices && filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div 
              key={service.id} 
              onClick={() => handleOpenModal(service)}
              className="card animate-fade-in-up" 
              style={{ 
                padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                cursor: 'pointer',
                border: service.isPromotion ? '1px solid var(--color-primary-light)' : '1px solid var(--color-border)',
                background: service.isPromotion ? 'var(--color-primary-50)' : 'var(--color-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: service.isPromotion ? 'var(--color-primary-dark)' : 'var(--color-text)' }}>
                    {service.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {service.description}
                  </p>
                </div>
                {service.isPromotion && (
                  <span className="badge" style={{ background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Tag size={12} /> Promoción
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: service.isPromotion ? 'var(--color-success)' : 'var(--color-text)' }}>
                  {formatCurrency(service.basePrice)}
                </span>
                {service.isPromotion && service.originalPrice && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                    {formatCurrency(service.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron tratamientos.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ServiceForm 
          service={selectedService} 
          onSave={handleSave} 
          onClose={handleCloseModal}
          onDelete={selectedService ? handleDelete : null}
          saving={saving}
        />
      )}
    </div>
  );
}
