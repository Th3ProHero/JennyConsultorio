/**
 * Utilidad para formatear fechas a tiempo relativo en español
 */

export function getRelativeTime(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Limpiar horas para comparación de días justos
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today - target;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays === -1) return 'Mañana';
  
  if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < -1 && diffDays > -7) return `En ${Math.abs(diffDays)} días`;
  
  if (diffDays >= 7 && diffDays < 14) return 'La semana pasada';
  if (diffDays <= -7 && diffDays > -14) return 'La próxima semana';
  
  const diffMonths = (today.getFullYear() - target.getFullYear()) * 12 + (today.getMonth() - target.getMonth());
  
  if (diffMonths === 1) return 'El mes pasado';
  if (diffMonths === -1) return 'El próximo mes';
  
  if (diffMonths > 1 && diffMonths < 12) return `Hace ${diffMonths} meses`;
  if (diffMonths < -1 && diffMonths > -12) return `En ${Math.abs(diffMonths)} meses`;
  
  const diffYears = today.getFullYear() - target.getFullYear();
  if (diffYears === 1) return 'Hace 1 año';
  if (diffYears > 1) return `Hace ${diffYears} años`;
  
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
}
