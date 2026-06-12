-- Hacer que alumno_id sea opcional (para poder registrar visitas que no son alumnos oficiales)
ALTER TABLE public.asistencia ALTER COLUMN alumno_id DROP NOT NULL;

-- Añadir el campo para guardar el nombre de la visita
ALTER TABLE public.asistencia ADD COLUMN nombre_visita TEXT;
