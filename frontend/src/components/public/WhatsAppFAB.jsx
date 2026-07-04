import { MessageCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../api/client';

const FALLBACK_NUMBER = '525511965133'; // Default si el API aún no tiene el campo

export default function WhatsAppFAB({ serviceName = '' }) {
  const { data: dentists } = useFetch(api.getPublicDentists);

  const getWhatsAppNumber = () => {
    if (dentists && dentists.length > 0 && dentists[0].whatsappNumber) {
      // Strip everything except digits and leading +
      return dentists[0].whatsappNumber.replace(/[^\d+]/g, '').replace(/^\+/, '');
    }
    return FALLBACK_NUMBER;
  };

  const generateWhatsAppLink = () => {
    const number = getWhatsAppNumber();
    const message = serviceName
      ? `Hola, me gustaría agendar una cita para ${serviceName}. ¿Tienen disponibilidad?`
      : 'Hola, me gustaría agendar una cita. ¿Tienen disponibilidad?';
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encodedMessage}`;
  };

  return (
    <a
      id="whatsapp-fab"
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp animate-pulse-gentle"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        zIndex: 40,
        textDecoration: 'none',
      }}
      aria-label="Agendar por WhatsApp"
    >
      <MessageCircle size={28} fill="white" strokeWidth={0} />
    </a>
  );
}
