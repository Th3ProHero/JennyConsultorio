export default function StatusBadge({ status }) {
  const config = {
    PENDING: { label: 'Pendiente', className: 'badge-warning' },
    CONFIRMED: { label: 'Confirmada', className: 'badge-success' },
    CANCELLED: { label: 'Cancelada', className: 'badge-danger' },
    COMPLETED: { label: 'Completada', className: 'badge-primary' },
  };

  const { label, className } = config[status] || { label: status, className: 'badge-primary' };

  return <span className={`badge ${className}`}>{label}</span>;
}
