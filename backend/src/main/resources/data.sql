-- =============================================
-- Seed Data for JennyDentista
-- =============================================

-- Dentists
INSERT INTO dentists (id, name, specialty, phone, created_at)
VALUES (1, 'Jenny F.', 'Odontología General y Estética', '+52 614 555 0101', NOW())
ON CONFLICT (id) DO NOTHING;

-- Set default bio and whatsapp_number if they are null (for existing rows)
UPDATE dentists
SET bio = 'Odontóloga especialista apasionada por crear sonrisas hermosas y saludables. Te brindamos un trato cálido, honesto y con la mejor tecnología dental.',
    whatsapp_number = '+52 5511965133'
WHERE id = 1
  AND (bio IS NULL OR whatsapp_number IS NULL);

-- Clinics
INSERT INTO clinics (id, name, address, hours, map_url, sort_order, created_at)
VALUES (
  1,
  'Consultorio Constitución',
  'Margarita 59, Los Ángeles, Iztapalapa, 09830 Ciudad de México, CDMX',
  'Lunes a Viernes: Previa Cita',
  'https://www.google.com/maps/place/Margarita+59,+Los+Ángeles,+Iztapalapa,+09830+Ciudad+de+México,+CDMX/@19.3462199,-99.0683456,15z/data=!4m6!3m5!1s0x85d1fd889b87e067:0x65b8117af0c51335!8m2!3d19.3462774!4d-99.0684851!16s%2Fg%2F11csnb5nv2?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D',
  0,
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO clinics (id, name, address, hours, map_url, sort_order, created_at)
VALUES (
  2,
  'Consultorio Citlali',
  'Constitución & Fresno, Citlalli, Iztapalapa, 09660 Ciudad de México, CDMX',
  'Lunes a Viernes: Previa Cita',
  'https://maps.app.goo.gl/NjZKpND7yn8Be8co8',
  1,
  NOW()
) ON CONFLICT (id) DO NOTHING;



-- Services
INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (1, 'Limpieza Dental', 'Limpieza profunda con ultrasonido y pulido', 800.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (2, 'Blanqueamiento LED', 'Aclara hasta 3 tonos en una sesión de 45 min', 2500.00, 3500.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (3, 'Valoración Ortodoncia', 'Estudio inicial para brackets o alineadores', 500.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (4, 'Extracción Simple', 'Extracción de piezas dentales dañadas o muelas del juicio no retenidas', 1200.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (5, 'Resina Estética', 'Eliminación de caries y colocación de resina del color del diente', 900.00, 1200.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (6, 'Carillas de Porcelana', 'Diseño de sonrisa permanente con carillas ultra delgadas', 5500.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (7, 'Cita de Seguimiento de Brackets', 'Ajuste mensual y cambio de ligas para tratamiento de ortodoncia', 600.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (8, 'Endodoncia Unirradicular', 'Tratamiento de conductos para salvar piezas dentales dañadas', 3500.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (9, 'Profilaxis Dental Completa', 'Aplicación de flúor y limpieza preventiva integral', 900.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (10, 'Retiro de Amalgama', 'Reemplazo seguro de amalgama por resina estética del color del diente', 1100.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (11, 'Pulpotomía Infantil', 'Tratamiento de nervio en dientes de leche para niños', 1500.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (12, 'Selladores de Fosetas y Fisuras', 'Capa protectora para prevenir caries en premolares y molares', 450.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (13, 'Corona de Porcelana', 'Restauración profunda que cubre completamente la pieza dental', 4500.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, name, description, base_price, original_price, is_promotion)
VALUES (14, 'Consulta de Emergencia', 'Atención prioritaria para alivio de dolor agudo o traumatismo dental', 600.00, NULL, false)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences to avoid conflicts with future inserts
SELECT setval('dentists_id_seq', COALESCE((SELECT MAX(id) FROM dentists), 1));
SELECT setval('patients_id_seq', COALESCE((SELECT MAX(id) FROM patients), 1));
SELECT setval('services_id_seq', COALESCE((SELECT MAX(id) FROM services), 1));
SELECT setval('appointments_id_seq', COALESCE((SELECT MAX(id) FROM appointments), 1));
SELECT setval('clinics_id_seq', COALESCE((SELECT MAX(id) FROM clinics), 1));

