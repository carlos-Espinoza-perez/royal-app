# Royal Treasury — Documentación de Proyecto Web

## Resumen

Aplicación web para gestionar la economía ficticia "Royal Treasury" de un grupo juvenil de escuela dominical. Permite al maestro administrar saldos, transacciones y carnets de membresía de cada alumno. Los alumnos acceden a su perfil personal mediante un código QR impreso en su carnet físico.

---

## Contexto

- **Grupo:** Escuela Dominical — Adolescentes (10–15 años)
- **Alumnos:** Entre 6 y 12 por sesión (domingos)
- **Admin:** Un solo usuario (el maestro)
- **Moneda:** Royales
- **Deploy:** Vercel (gratuito)
- **Dominio:** `royaltreasury.vercel.app` o subdominio personalizado

---

## Estilo Visual

El diseño debe ser fiel al universo visual de los billetes y carnets Royal Treasury ya existentes:

- **Paleta:** Verde oscuro (`#1a3d28`, `#2d5a3d`) sobre crema/marfil (`#f5f0e0`, `#e8e2cc`). Acentos dorados (`#c8a96e`).
- **Tipografía:** `Cinzel Decorative` para títulos principales, `Cinzel` para subtítulos y datos, `IM Fell English` para textos secundarios e itálicas decorativas. Todas disponibles en Google Fonts.
- **Texturas:** Patrones guilloche (ondas entrelazadas) como elemento de fondo. Bordes ornamentales dobles. Elementos heráldicos (escudo, corona, laureles).
- **Tono:** Elegante, oficial, clásico — como un documento gubernamental. Sin neón, sin gradientes modernos, sin efectos holográficos.
- **Iconografía:** Escudo heráldico con corona y cruz, laureles, cintas/ribbons para etiquetas de rango.

---

## Stack Técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (solo admin) |
| Estilos | Tailwind CSS + CSS custom para guilloche |
| QR | librería `qrcode` (npm) |
| PDF carnets | `html2canvas` + `jsPDF` |
| Deploy | Vercel |
| Fuentes | Google Fonts (Cinzel, IM Fell English) |

---

## Estructura de Base de Datos (Supabase)

### Tabla `alumnos`

```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
nombre       text NOT NULL
numero       text UNIQUE NOT NULL  -- formato: RT-2025-001
rango        text DEFAULT 'Novato' -- Novato | Activo | Élite | Leyenda
saldo        integer DEFAULT 0
foto_url     text                  -- URL de foto subida (opcional)
activo       boolean DEFAULT true
created_at   timestamptz DEFAULT now()
```

### Tabla `transacciones`

```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
alumno_id    uuid REFERENCES alumnos(id)
tipo         text NOT NULL   -- 'acreditar' | 'sancionar' | 'canjear'
monto        integer NOT NULL -- positivo siempre, el tipo define el signo
motivo       text
created_at   timestamptz DEFAULT now()
```

### Lógica de rangos (automática por trigger o en frontend)

```
0   – 149   → Novato
150 – 349   → Activo
350 – 649   → Élite
650+        → Leyenda
```

### Row Level Security (RLS)

- **Admin (autenticado):** lectura y escritura total
- **Público (alumno por QR):** solo lectura de su propio registro y sus transacciones

---

## Rutas de la Aplicación

### Rutas públicas (sin login)

| Ruta | Descripción |
|---|---|
| `/alumno/[id]` | Perfil público del alumno — vista solo lectura |

### Rutas de admin (requieren login)

| Ruta | Descripción |
|---|---|
| `/login` | Página de autenticación del maestro |
| `/admin` | Panel principal — ranking y resumen global |
| `/admin/alumnos` | Gestión de alumnos (CRUD) |
| `/admin/alumnos/[id]` | Perfil completo del alumno con acciones |
| `/admin/transacciones` | Historial global de todas las transacciones |
| `/admin/carnets` | Generador de carnets PDF |

---

## Páginas — Detalle

### `/alumno/[id]` — Vista Pública del Alumno

Lo que ve el alumno al escanear su QR. Diseño tipo "documento oficial Royal Treasury".

**Contenido:**
- Nombre completo y foto (si tiene)
- Saldo actual en Royales (número grande, prominente)
- Rango con insignia visual (Novato / Activo / Élite / Leyenda)
- Barra de progreso hacia el siguiente rango
- Historial de transacciones (últimas 10, expandible)
- Estadísticas personales:
  - Total acreditado histórico
  - Total sancionado histórico
  - Posición en el ranking del grupo
  - Racha de domingos activos (si se implementa asistencia)
- Frase motivacional aleatoria del universo Royal Treasury al pie

**Comportamiento especial:**
- Si el maestro está logueado y accede a esta URL, aparece un banner admin flotante con botones de acción (Acreditar, Sancionar, Canjear)
- Sin login, la página es completamente de solo lectura

---

### `/login` — Login Admin

- Formulario simple: email + contraseña
- Estilo Royal Treasury (fondo oscuro, tipografía serif, borde ornamental)
- Redirección a `/admin` al autenticarse

---

### `/admin` — Panel Principal

**Sección superior — Stats globales:**
- Total de alumnos activos
- Total de Royales en circulación
- Alumno con mayor saldo
- Transacciones de hoy

**Sección principal — Ranking:**
- Lista de todos los alumnos ordenada por saldo
- Cada fila muestra: posición, nombre, rango, saldo, últimas acciones rápidas (➕ / ⚡)
- Click en alumno → navega a `/admin/alumnos/[id]`

---

### `/admin/alumnos` — Gestión de Alumnos

- Lista de alumnos con buscador
- Botón "Nuevo alumno" → modal con: nombre, número de miembro (auto-generado), foto (opcional)
- Opción de activar/desactivar alumno (para domingos que no asisten)
- Selección múltiple para generación de carnets en PDF

---

### `/admin/alumnos/[id]` — Perfil Admin del Alumno

Misma vista que la pública pero con panel de acciones:

**Acciones disponibles:**
- **Acreditar:** ingresar monto + motivo → modal de confirmación
- **Sancionar:** ingresar monto + motivo → modal de confirmación
- **Canjear premio:** ingresar monto + descripción del premio
- **Editar datos:** nombre, foto, número de miembro
- **Ver QR:** muestra el QR generado listo para copiar o descargar

---

### `/admin/carnets` — Generador de Carnets PDF

Esta es una de las funciones más importantes del sistema.

**Flujo:**
1. Admin sube la imagen base del carnet (el diseño generado por IA, sin datos)
2. Selecciona uno o varios alumnos con checkboxes
3. El sistema superpone sobre la imagen base:
   - Nombre del alumno (posición y fuente configurables)
   - Número de miembro
   - Código QR (generado dinámicamente apuntando a `/alumno/[id]`)
4. Preview en pantalla antes de exportar
5. Botón "Generar PDF" → descarga un PDF con todos los carnets seleccionados (uno por página, tamaño carnet CR80 o A4 con múltiples)

**Opciones de exportación:**
- Un carnet por página (para impresora de carnets)
- 4 carnets por página A4 (para impresora normal y cortar)
- 8 carnets por página A4 (tamaño reducido)

---

### `/admin/transacciones` — Historial Global

- Tabla cronológica de todas las transacciones
- Filtros: por alumno, por tipo (acreditar/sancionar/canjear), por fecha
- Opción de eliminar una transacción (con confirmación)

---

## Componentes Reutilizables

| Componente | Descripción |
|---|---|
| `CarnetPreview` | Renderiza el carnet con imagen base + datos superpuestos |
| `RangoInsignia` | Badge visual del rango con color e ícono |
| `BarraProgreso` | Progreso hacia el siguiente rango, estilo guilloche |
| `HistorialItem` | Fila de transacción con ícono, motivo, monto y fecha |
| `ActionModal` | Modal de acreditar / sancionar / canjear |
| `QRDisplay` | Muestra y permite descargar el QR del alumno |
| `GuillocheBackground` | Componente SVG de fondo con patrón guilloche |
| `EscudoHeraldico` | SVG del escudo Royal Treasury |

---

## Generación de Carnets — Lógica Técnica

```
1. Admin sube imagen base (PNG/JPG) → se guarda en estado local
2. Para cada alumno seleccionado:
   a. Crear canvas HTML con la imagen base como fondo
   b. Superponer texto (nombre, número) en coordenadas configurables
   c. Generar QR del alumno → insertar en coordenadas del QR
   d. Convertir canvas a imagen con html2canvas
3. Insertar todas las imágenes en un PDF con jsPDF
4. Descargar PDF
```

**Configuración de posiciones (importante):**
El admin puede calibrar dónde va el nombre, número y QR arrastrando elementos sobre el preview. Esto se guarda en localStorage para no repetir la calibración cada vez.

---

## Frases Motivacionales (vista alumno)

Mostrar una aleatoria al pie del perfil:

- *"Somos más que miembros, somos herederos del reino."*
- *"Honramos a Dios con lo que somos, tenemos y hacemos."*
- *"Disciplina · Generosidad · Fe · Integridad"*
- *"Jóvenes que invierten en el reino."*
- *"Tu fidelidad construye tu legado."*

---

## Consideraciones de Seguridad

- El ID del alumno en la URL es un UUID — no predecible
- RLS en Supabase garantiza que un alumno solo accede a sus datos
- El admin usa Supabase Auth con sesión persistente
- No hay datos sensibles — es un sistema de juego interno

---

## Fases de Desarrollo Sugeridas

### Fase 1 — Base funcional
- Setup Next.js + Supabase + Vercel
- Auth admin
- CRUD de alumnos
- Acreditar / Sancionar / Canjear
- Vista pública `/alumno/[id]`

### Fase 2 — Carnets
- Subida de imagen base
- Superposición de datos + QR
- Exportación PDF

### Fase 3 — Mejoras UX
- Estadísticas y ranking visual
- Barra de progreso de rango
- Frases motivacionales
- Racha de asistencia (opcional)

---

## Notas Finales para el Modelo de IA

- Mantener la estética Royal Treasury en TODAS las vistas — no usar componentes UI genéricos (no shadcn por defecto, no Tailwind vanilla sin personalizar)
- Las fuentes `Cinzel` e `IM Fell English` son obligatorias
- El color base es crema (`#f5f0e0`) con verde oscuro (`#2d5a3d`) — no blanco con gris
- Cada página debe sentirse como un documento oficial, no como un dashboard SaaS moderno
- El guilloche SVG debe aparecer como fondo en al menos la vista del alumno y el login
