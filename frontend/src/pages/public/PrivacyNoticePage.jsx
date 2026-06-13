import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyNoticePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Header simple */}
      <header className="bg-white border-b border-[var(--color-border)] py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Volver al inicio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-[var(--color-primary)]" />
            <span className="font-bold text-lg hidden sm:inline">Privacidad</span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-8 sm:p-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] bg-clip-text text-transparent">
            Aviso de Privacidad
          </h1>
          
          <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed text-sm sm:text-base">
            <p>
              En cumplimiento a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (la "Ley"), 
              <strong> Jenny Dentista </strong>, con domicilio en [Dirección del Consultorio], es responsable de recabar sus datos personales, 
              del uso que se le dé a los mismos y de su protección.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">1. Datos Personales que se recaban</h2>
            <p>
              Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar sus datos personales de 
              distintas formas: cuando usted nos los proporciona directamente al acudir a consulta, cuando visita nuestro 
              sitio web o cuando utiliza nuestros servicios en línea. Los datos que obtenemos pueden ser, entre otros:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre completo.</li>
              <li>Teléfono (móvil y/o fijo).</li>
              <li>Correo electrónico.</li>
              <li>Historial clínico, alergias y antecedentes médicos (considerados <strong>datos sensibles</strong>).</li>
              <li>Imágenes de estudios, radiografías y fotografías clínicas.</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">2. Finalidades del tratamiento de datos</h2>
            <p>
              Sus datos personales serán utilizados para las siguientes finalidades esenciales para el servicio solicitado:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveer los servicios de salud y tratamientos dentales requeridos.</li>
              <li>Integrar y actualizar su expediente clínico dental.</li>
              <li>Agendar, confirmar o reagendar citas médicas.</li>
              <li>Dar seguimiento a su estado de salud bucodental post-tratamiento.</li>
              <li>Emisión de recetas y recomendaciones médicas.</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">3. Protección de Datos Sensibles</h2>
            <p>
              Le informamos que para cumplir con las finalidades previstas en este aviso, serán recabados y tratados datos 
              personales sensibles, como aquellos que refieren a su estado de salud, alergias e historial clínico. Nos 
              comprometemos a que los mismos serán tratados bajo estrictas medidas de seguridad que garanticen su confidencialidad.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">4. Derechos ARCO</h2>
            <p>
              Usted tiene derecho de <strong>Acceder</strong> a sus datos personales que poseemos y a los detalles del tratamiento 
              de los mismos, así como a <strong>Rectificarlos</strong> en caso de ser inexactos o incompletos; <strong>Cancelarlos</strong> cuando 
              considere que no se requieren para alguna de las finalidades señaladas, o <strong>Oponerse</strong> al tratamiento de los 
              mismos para fines específicos. Para ejercer estos derechos, puede comunicarse directamente con nosotros en nuestro consultorio o vía correo electrónico.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text)] mt-8 mb-4">5. Modificaciones al aviso de privacidad</h2>
            <p>
              Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso 
              de privacidad, para la atención de novedades legislativas, políticas internas o nuevos requerimientos para la 
              prestación de nuestros servicios. Estas modificaciones estarán disponibles al público a través de nuestro 
              sitio web o en las instalaciones del consultorio.
            </p>

            <div className="mt-12 p-4 bg-[var(--color-bg)] rounded-lg text-xs sm:text-sm text-center">
              <p>Última actualización: {new Date().toLocaleDateString('es-MX')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
