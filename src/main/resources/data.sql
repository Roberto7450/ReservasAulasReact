-- ============================================
-- AULAS DE PRUEBA
-- ============================================
INSERT INTO aulas (nombre, capacidad, es_ordenadores)
VALUES
    ('Aula 101', 30, false),
    ('Aula Informática 1', 25, true),
    ('Aula Informática 2', 25, true),
    ('Aula Magna', 100, false),
    ('Laboratorio', 20, false)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ============================================
-- HORARIOS DE PRUEBA
-- ============================================
INSERT INTO horarios (dia_semana, hora_inicio, hora_fin)
VALUES
    ('LUNES', '08:00:00', '09:00:00'),
    ('LUNES', '09:00:00', '10:00:00'),
    ('LUNES', '10:00:00', '11:00:00'),
    ('MARTES', '08:00:00', '09:00:00'),
    ('MARTES', '09:00:00', '10:00:00'),
    ('MIERCOLES', '08:00:00', '09:00:00'),
    ('JUEVES', '08:00:00', '09:00:00'),
    ('VIERNES', '08:00:00', '09:00:00')
ON DUPLICATE KEY UPDATE dia_semana=dia_semana;