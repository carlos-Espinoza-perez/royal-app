-- ==========================================
-- ROYAL TREASURY - BASE DE DATOS SUPABASE
-- ==========================================

-- 1. TABLA: alumnos
CREATE TABLE IF NOT EXISTS public.alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    numero TEXT UNIQUE NOT NULL,
    saldo INTEGER NOT NULL DEFAULT 0 CHECK (saldo >= 0),
    foto_url TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA: premios
CREATE TABLE IF NOT EXISTS public.premios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    costo_royales INTEGER NOT NULL,
    imagen_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLA: transacciones
CREATE TABLE IF NOT EXISTS public.transacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES public.alumnos(id) ON DELETE CASCADE,
    premio_id UUID REFERENCES public.premios(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('acreditar', 'sancionar', 'canjear')),
    monto INTEGER NOT NULL CHECK (monto > 0),
    motivo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABLA: asistencia
CREATE TABLE IF NOT EXISTS public.asistencia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES public.alumnos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    presente BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Restricción para evitar que un alumno sea registrado 2 veces el mismo día
    UNIQUE (alumno_id, fecha)
);

-- ==========================================
-- LÓGICA DE NEGOCIO: TRIGGERS
-- ==========================================

-- Función para actualizar el saldo del alumno cuando hay una nueva transacción
CREATE OR REPLACE FUNCTION actualizar_saldo_alumno()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'acreditar' THEN
        UPDATE public.alumnos
        SET saldo = saldo + NEW.monto
        WHERE id = NEW.alumno_id;
    ELSIF NEW.tipo = 'sancionar' OR NEW.tipo = 'canjear' THEN
        UPDATE public.alumnos
        SET saldo = saldo - NEW.monto
        WHERE id = NEW.alumno_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se dispara después de insertar una transacción
CREATE TRIGGER trigger_actualizar_saldo
AFTER INSERT ON public.transacciones
FOR EACH ROW
EXECUTE FUNCTION actualizar_saldo_alumno();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencia ENABLE ROW LEVEL SECURITY;

-- -------------------------
-- POLÍTICAS: alumnos
-- -------------------------
-- Cualquiera puede leer (para que la vista pública por QR funcione sin login)
CREATE POLICY "Permitir lectura publica de alumnos" ON public.alumnos FOR SELECT USING (true);
-- Solo admin (autenticado) puede insertar, actualizar o eliminar
CREATE POLICY "Admin controla alumnos" ON public.alumnos FOR ALL USING (auth.role() = 'authenticated');

-- -------------------------
-- POLÍTICAS: premios
-- -------------------------
-- Cualquiera puede ver el catálogo
CREATE POLICY "Permitir lectura publica de premios" ON public.premios FOR SELECT USING (true);
-- Solo admin puede modificar
CREATE POLICY "Admin controla premios" ON public.premios FOR ALL USING (auth.role() = 'authenticated');

-- -------------------------
-- POLÍTICAS: transacciones
-- -------------------------
-- Cualquiera puede leer el historial de transacciones
CREATE POLICY "Permitir lectura publica de transacciones" ON public.transacciones FOR SELECT USING (true);
-- Solo admin puede crear y modificar transacciones
CREATE POLICY "Admin controla transacciones" ON public.transacciones FOR ALL USING (auth.role() = 'authenticated');

-- -------------------------
-- POLÍTICAS: asistencia
-- -------------------------
-- Para el pase de lista y acceso, la asistencia es mejor mantenerla privada, o si se requiere pública, usar SELECT
CREATE POLICY "Admin controla asistencia" ON public.asistencia FOR ALL USING (auth.role() = 'authenticated');
-- Si queremos que el alumno vea cuántas veces vino en su perfil:
CREATE POLICY "Lectura publica de asistencia" ON public.asistencia FOR SELECT USING (true);

-- ==========================================
-- STORAGE BUCKETS (Requiere configurar desde Panel si da error por permisos)
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('bucket_alumnos_fotos', 'bucket_alumnos_fotos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('bucket_premios_fotos', 'bucket_premios_fotos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('bucket_carnets_templates', 'bucket_carnets_templates', false) ON CONFLICT DO NOTHING;
