-- =============================================
-- Seed Data for JennyDentista
-- =============================================

-- Dentists
INSERT INTO dentists (id, name, specialty, phone, created_at)
VALUES (1, 'Jenny F.', 'Odontología General y Estética', '+52 614 555 0101', NOW())
ON CONFLICT (id) DO NOTHING;

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

-- Reset sequences to avoid conflicts with future inserts
SELECT setval('dentists_id_seq', (SELECT MAX(id) FROM dentists));
SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
