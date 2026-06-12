BEGIN;
  -- Borramos la publicación si existe para evitar errores de tablas duplicadas
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Creamos la publicación que Supabase usa para el Realtime
  CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete');
  
  -- Añadimos las tablas de las que la UI necesita escuchar cambios en tiempo real
  ALTER PUBLICATION supabase_realtime ADD TABLE public.alumnos, public.premios, public.transacciones, public.asistencia;
COMMIT;
