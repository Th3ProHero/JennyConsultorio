import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '525535756858'; // Número del consultorio

export default function WhatsAppFAB({ serviceName = '' }) {
  const generateWhatsAppLink = () => {
    const message = serviceName
      ? `Hola, me gustaría agendar una cita para ${serviceName}. ¿Tienen disponibilidad?`
      : 'Hola, me gustaría agendar una cita. ¿Tienen disponibilidad?';
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
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
