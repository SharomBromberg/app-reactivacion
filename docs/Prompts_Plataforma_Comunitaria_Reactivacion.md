# Kit de Prompts — Plataforma Comunitaria de Reactivación (MVP en 48 h)

Estos prompts siguen la EDT del plan (Backend NestJS · Frontend Expo/React Native · Datos · Despliegue) y están ordenados para ejecutarse en secuencia. Cada uno está pensado para pegarse en Claude Code (o en Claude con acceso al repositorio) y produce un entregable concreto y verificable.

## Cómo usar este kit

1. **Pega primero el Prompt 0 (contexto maestro) en cada sesión nueva.** Es el "cerebro" del proyecto: evita que el asistente invente alcance, stack o reglas.
2. **Un prompt = un paquete de trabajo.** No pidas "hazme toda la app". Pide el paquete, revisa, haz commit, sigue con el siguiente.
3. **Pide plan antes de código** en las tareas grandes (los prompts ya lo incluyen). Cuesta 30 segundos y evita retrabajo.
4. **Cierra cada paquete con el Prompt de verificación** (Prompt 11). Es la única forma de que "funciona en mi máquina" no llegue al piloto.
5. **Decisiones ya tomadas para no perder tiempo:** PostgreSQL + Prisma (no MongoDB), Supabase o Neon como base gestionada, Expo Router con salida web (PWA), TanStack Query para datos, un solo repositorio (monorepo) con `apps/api` y `apps/mobile`, moderación con JWT + roles.

---

## PROMPT 0 — Contexto maestro (pegar siempre)

```
Actúa como un ingeniero senior full-stack (NestJS + React Native/Expo, TypeScript) trabajando bajo presión de tiempo real.

CONTEXTO DEL PROYECTO
- Nombre: Directorio y Marketplace Solidario Post-Sismo (Manizales, Caldas).
- Naturaleza: contingencia, sin ánimo de lucro. Inicio 17-ago-2026, piloto PWA el 19-ago-2026 (48 h).
- Usuarios: emprendedores y vecinos afectados por el sismo, muchos con conectividad limitada y celulares de gama baja.
- Objetivos: registro de negocios, catálogo con redirección a WhatsApp (wa.me), muro "Busco / Ofrezco", panel de moderación privado para el equipo desarrollador.
- Principio de privacidad por diseño: NO se recolecta información financiera ni datos personales sensibles. Solo: nombre del negocio, zona/barrio, sector, afectación principal, contacto (WhatsApp/teléfono).
- Fuera de alcance del MVP: pasarelas de pago, carrito, mensajería interna, validación de identidad, reportes automáticos, IA de moderación.

STACK (no negociable en el MVP)
- Monorepo con pnpm workspaces: apps/api (NestJS 10, Prisma, PostgreSQL), apps/mobile (Expo SDK más reciente estable, Expo Router, TypeScript estricto, TanStack Query), packages/shared (tipos y enums compartidos).
- Autenticación solo para moderadores: JWT + Guard de rol ADMIN. Los usuarios públicos NO se autentican en el MVP.
- Base de datos gestionada (Supabase o Neon). API desplegada en Railway o Render. Web/PWA en Vercel o EAS Hosting.

REGLAS DE TRABAJO
1. Antes de escribir código en tareas de más de un archivo, dame un plan de 5–10 líneas y espera mi OK.
2. TypeScript estricto, sin `any`. DTOs validados con class-validator. Errores HTTP consistentes.
3. Soft-delete en publicaciones (campo deletedAt), nunca borrado físico en el MVP.
4. Cada endpoint público debe tener rate limiting; cada formulario, campo honeypot anti-spam.
5. Diseño minimalista y ligero: sin librerías pesadas de UI, imágenes opcionales y comprimidas, la app debe ser usable en 3G.
6. Textos de interfaz en español neutro, tono cercano y respetuoso.
7. Al terminar cada tarea, indícame: archivos creados/modificados, comandos para probar, y qué NO quedó cubierto.
8. Si algo del plan es ambiguo, propón la opción más simple que funcione y sigue; no te bloquees.
```

---

## FASE 1 — Estructuración y Arquitectura (Día 1, mañana)

### PROMPT 1 — Modelo de datos y contratos

```
Con el contexto maestro, diseña el modelo de datos del MVP en Prisma (PostgreSQL).

Entidades mínimas: Business (emprendimiento), Product (producto/servicio), SupportPost (muro Busco/Ofrezco), AdminUser (moderador), ModerationAction (bitácora de acciones de moderación).

Requisitos:
- Enums compartidos en packages/shared: Zone (barrios/comunas de Manizales, deja lista editable), Sector, DamageLevel (afectación), SupportPostType (BUSCO | OFREZCO), ModerationStatus.
- Campos de moderación en Business, Product y SupportPost: status, deletedAt, bannedAt, moderationNote.
- Un campo phone (E.164) que se usará para el enlace wa.me; nunca guardar email ni documento de identidad.
- Índices para filtrar por zona y sector.

Entrega:
1. schema.prisma completo con comentarios breves.
2. Los enums en packages/shared/src/index.ts.
3. Una tabla en Markdown "campo → por qué existe / por qué es seguro recolectarlo".
4. La primera migración (`prisma migrate dev --name init`) y el comando para ejecutarla.
```

### PROMPT 2 — Andamiaje del monorepo

```
Crea el andamiaje del monorepo:

- Raíz: pnpm-workspace.yaml, package.json con scripts `dev:api`, `dev:mobile`, `lint`, `typecheck`, `test`. ESLint + Prettier compartidos. .editorconfig. .gitignore correcto para Node, Expo y Prisma. .env.example en cada app (nunca commitear .env).
- apps/api: NestJS con Prisma, ConfigModule (validación de variables de entorno con zod o joi), ValidationPipe global (whitelist, forbidNonWhitelisted), CORS restringido por variable, Helmet, ThrottlerModule (por defecto 30 req/min por IP), filtro global de excepciones con formato { statusCode, message, error, timestamp }.
- apps/mobile: Expo con Expo Router, TypeScript estricto, TanStack Query configurado con reintentos y cache, cliente HTTP en src/lib/api.ts leyendo EXPO_PUBLIC_API_URL, estructura atomic design: src/components/atoms, molecules, organisms; src/features/<dominio>.
- README.md raíz con "Cómo correr en 5 minutos".
- Un GitHub Action mínimo: lint + typecheck + test en cada push.

Primero dame el árbol de carpetas propuesto; cuando lo apruebe, genera los archivos.
```

---

## FASE 2 — Desarrollo Core y UI (Día 1 tarde – Día 2)

### PROMPT 3 — Backend: registro y directorio (EDT 2.2 y 2.3)

```
Implementa en apps/api el módulo `businesses`:

- POST /businesses: registro público. DTO con class-validator: name (3–80), zone (enum), sector (enum), damageLevel (enum), phone (E.164, Colombia +57), description (opcional, máx. 300), campo honeypot `website` que debe llegar vacío (si no, responder 200 silencioso sin guardar). Sanitizar texto (trim, sin HTML).
- GET /businesses: lista pública paginada (cursor), filtros por zone y sector, búsqueda por nombre (ILIKE), solo registros con status=APPROVED o PENDING (según decisión de moderación que definiremos: por defecto PENDING se muestra, para no frenar la adopción; documenta el trade-off).
- GET /businesses/:id: detalle público con productos.
- Excluir SIEMPRE registros con deletedAt o bannedAt de las rutas públicas (usa un helper reutilizable en Prisma).
- Respuestas tipadas con DTOs de salida (no exponer campos internos como moderationNote).
- Tests e2e con supertest para: registro válido, registro con honeypot, filtro por zona, exclusión de eliminados.

Sigue la misma estructura para el módulo `products` (POST vinculado a un businessId, GET por negocio) y `support-posts` (POST y GET con filtro por type BUSCO/OFREZCO y zona).

Antes de codificar, dame el plan y las decisiones que tomarás.
```

### PROMPT 4 — Backend: autenticación y moderación (EDT 2.4)

```
Implementa el módulo `auth` y `admin` en apps/api:

- AdminUser con passwordHash (argon2 o bcrypt). Semilla de un moderador inicial desde variables de entorno (ADMIN_EMAIL, ADMIN_PASSWORD) — solo el equipo desarrollador tiene cuentas; no hay registro público de admins.
- POST /auth/login → JWT (expiración 12 h). Estrategia passport-jwt, JwtAuthGuard + RolesGuard con decorador @Roles('ADMIN').
- Rutas protegidas bajo /admin:
  - GET /admin/queue: todo el contenido PENDING o reportado internamente, ordenado por fecha.
  - PATCH /admin/businesses/:id/hide y /restore (soft-delete y restauración).
  - PATCH /admin/businesses/:id/ban (bannedAt + nota obligatoria).
  - Equivalentes para products y support-posts.
  - GET /admin/actions: bitácora ModerationAction (quién, qué, cuándo, nota).
- Cada acción de moderación escribe en ModerationAction dentro de una transacción de Prisma.
- Rate limit más estricto en /auth/login (5 intentos/min).
- Tests: login correcto/incorrecto, acceso sin token a /admin devuelve 401, soft-delete oculta el registro en la ruta pública.
- Explícame en 5 líneas cómo rotar el JWT_SECRET si se filtra.
```

### PROMPT 5 — Frontend: sistema de diseño ligero (EDT 3.1)

```
En apps/mobile crea el sistema de diseño mínimo con atomic design:

- Tokens en src/theme: colores (paleta sobria y cálida, alto contraste, accesible AA), tipografía del sistema (sin fuentes externas), espaciados, radios.
- Átomos: Text, Button (primary/secondary/whatsapp), Input, Select, Chip, Badge de estado, Skeleton.
- Moléculas: FormField (label + input + error), FilterBar (zona + sector), BusinessCard, ProductCard, SupportPostCard, EmptyState, ErrorState con botón reintentar.
- Organismos: BusinessList (FlashList o FlatList optimizado), RegisterBusinessForm, SupportPostForm.
- Todo debe funcionar en web (PWA) y en Android; usa solo APIs de React Native compatibles con react-native-web.
- Sin imágenes obligatorias; si el negocio no tiene foto, mostrar avatar con iniciales.
- Muestra cada componente en una ruta /dev/gallery (solo en __DEV__) para revisarlos rápido.

Entrega el plan de componentes primero.
```

### PROMPT 6 — Frontend: pantallas públicas (EDT 3.2 y 3.3)

```
Implementa las pantallas públicas con Expo Router:

- app/index.tsx (Directorio): FilterBar por zona y sector, búsqueda con debounce, lista paginada infinita con TanStack Query, estados de carga/vacío/error, pull-to-refresh.
- app/negocio/[id].tsx: detalle del negocio, lista de productos, botón "Contactar por WhatsApp" que abre https://wa.me/<phone>?text=<mensaje prellenado y URL-encoded: "Hola, vi tu negocio en la Plataforma de Reactivación y quiero…">. Aclara en pantalla que la plataforma NO procesa pagos.
- app/registrar.tsx: formulario de registro con react-hook-form + zod (esquema compartido con el backend si es viable desde packages/shared), validación en tiempo real, mensajes de error claros, honeypot oculto, pantalla de éxito con "tu registro será visible en breve".
- app/apoyo/index.tsx y app/apoyo/nuevo.tsx: muro Busco/Ofrezco con tabs, cada tarjeta con botón a WhatsApp.
- Navegación con tabs inferiores: Directorio · Apoyo · Registrar.
- Accesibilidad: labels, roles, tamaño mínimo táctil 44px, funciona con lector de pantalla.
- Manejo de sin conexión: mostrar último resultado en caché y aviso "Estás sin conexión".

Antes de codificar, lista las decisiones de UX que tomarás y por qué.
```

### PROMPT 7 — Frontend: panel de moderación (EDT 3.4)

```
Implementa el dashboard interno de moderación en apps/mobile bajo el grupo de rutas app/(admin):

- /admin/login: formulario, guarda el JWT en expo-secure-store (nativo) o en memoria + sessionStorage (web); nunca en AsyncStorage plano.
- Guard de rutas: si no hay token válido, redirigir a login. Cerrar sesión limpia el token.
- /admin: cola de moderación con pestañas (Negocios · Productos · Apoyo), cada tarjeta con acciones Ocultar / Restaurar / Banear (con modal que exige nota) y confirmación.
- /admin/historial: bitácora de acciones.
- Optimistic updates con TanStack Query y rollback en error.
- La ruta /admin no debe aparecer en la navegación pública ni indexarse (meta noindex en web).
- Tests de componentes con @testing-library/react-native para el flujo Ocultar → confirmar → desaparece de la lista.
```

---

## FASE 3 — Piloto y Cold-Start (Día 3)

### PROMPT 8 — Datos semilla y carga (EDT 4.0)

```
Crea el proceso de carga de datos semilla:

- Script apps/api/prisma/seed.ts que lee un CSV en data/seed/businesses.csv con columnas: name, zone, sector, damageLevel, phone, description.
- Valida cada fila con las mismas reglas del DTO (reutiliza el esquema); las filas inválidas van a un reporte data/seed/errors.csv con el motivo, sin detener la carga.
- Normaliza teléfonos a E.164 (+57) y elimina duplicados por teléfono.
- Modo dry-run (`--dry`) que solo reporta.
- Genera también una plantilla CSV vacía y un README de 10 líneas para que voluntarios no técnicos llenen los datos en Google Sheets y exporten a CSV.
- Marca los registros semilla con source=SEED para poder distinguirlos después.
```

### PROMPT 9 — Despliegue (EDT 5.0)

```
Guíame paso a paso para desplegar el piloto hoy, con explicación breve de "qué hacer / por qué" en cada paso:

1. Base de datos en Supabase (o Neon): crear proyecto, obtener DATABASE_URL, correr migraciones desde mi máquina.
2. API en Railway (o Render): variables de entorno, build command, healthcheck en GET /health, logs.
3. Frontend web/PWA: `npx expo export --platform web` y despliegue en Vercel; manifest.json con nombre, iconos, theme_color, display standalone; service worker básico para caché de shell; probar "Agregar a pantalla de inicio" en Android Chrome.
4. Dominio o subdominio, HTTPS, CORS de la API apuntando solo al dominio de la web.
5. Configurar EXPO_PUBLIC_API_URL de producción.
6. Checklist de humo post-despliegue: registrar un negocio real, verlo en el directorio, abrir WhatsApp, entrar al panel admin, ocultarlo, verificar que desaparece.
7. Plan de rollback en una línea por componente.

Asume que estoy en Windows 11 con Node instalado y sé usar la terminal, pero dame los comandos exactos.
```

### PROMPT 10 — Pruebas de estrés ligero y observabilidad

```
Prepara una prueba de carga ligera y observabilidad mínima para el piloto:

- Script con k6 (o autocannon) que simule 100 usuarios concurrentes durante 2 minutos sobre GET /businesses y 20 sobre POST /businesses. Umbrales: p95 < 800 ms, error rate < 1 %.
- Interpretación: dime qué mirar y qué haría si falla (índices, paginación, tamaño de página, caché HTTP con Cache-Control en GET públicos).
- Observabilidad: logging estructurado en la API (pino), endpoint /health, y un servicio gratuito de monitoreo de uptime (UptimeRobot o similar) apuntando a /health cada 5 min con alerta a un correo o Telegram del equipo.
- Sentry (plan gratuito) en API y frontend para capturar errores en producción, sin enviar datos personales (configura beforeSend para eliminar phone).
```

---

## PROMPT TRANSVERSAL — Verificación de cada paquete (usar al cerrar cada tarea)

### PROMPT 11 — Revisión y cierre

```
Revisa lo que acabas de implementar como si fueras otro ingeniero haciendo code review antes de merge. Responde en este orden:

1. ¿Compila y pasan lint, typecheck y tests? Ejecuta los comandos y pega el resultado resumido.
2. Seguridad: ¿alguna ruta pública expone campos internos? ¿algún input sin validar? ¿algún secreto en el código?
3. Privacidad: ¿se está guardando algo que no esté en la lista permitida (nombre, zona, sector, afectación, teléfono, descripción)?
4. Rendimiento en 3G: ¿hay algo pesado que se pueda quitar o diferir?
5. Deuda técnica: lista de 3 cosas que dejarías para la Fase 4 y por qué no bloquean el piloto.
6. Mensaje de commit sugerido (convencional: feat/fix/chore) y resumen de 3 líneas para el registro del proyecto.

Si encuentras un problema de las categorías 2 o 3, corrígelo antes de responder.
```

---

## FASE 4 — Post-piloto (Prompt de reserva)

### PROMPT 12 — Empaquetado Android

```
Con la PWA ya en producción, prepara la publicación en Google Play:

- Configura EAS Build para Android (app.json/app.config.ts: package name, versionCode, iconos adaptativos, splash ligero, permisos mínimos).
- Deep links: que el enlace de la web abra la app nativa si está instalada (intent filters + assetlinks.json).
- Política de privacidad en texto plano (obligatoria en Play Console) coherente con "no recolectamos datos financieros ni sensibles"; redáctala.
- Checklist de Play Console para una app sin ánimo de lucro: cuenta, ficha, clasificación de contenido, declaración de seguridad de datos.
- Prioriza los hotfixes reportados en el piloto antes del build; pídeme la lista.
```

---

## Cronograma sugerido de uso

| Momento | Prompts | Resultado esperado |
| --- | --- | --- |
| Lun 17, mañana | 0 → 1 → 2 → 11 | Repo listo, esquema migrado, CI en verde |
| Lun 17, tarde | 0 → 3 → 11 → 4 → 11 | API pública y de moderación funcionando en local |
| Mar 18, mañana | 0 → 5 → 6 → 11 | App pública navegable contra la API local |
| Mar 18, tarde | 0 → 7 → 11 → 8 | Panel admin y datos semilla cargados |
| Mié 19, mañana | 0 → 9 → 10 | Piloto desplegado, monitoreado y probado |
| Mié 19, tarde | 11 (final) | Checklist de humo, presentación comunitaria |
| Después | 12 | Build Android |

## Buenas prácticas que este kit ya incorpora

Alcance congelado por prompt (nada fuera del MVP se cuela), TypeScript estricto y validación en frontera con DTOs, privacidad por diseño verificada en cada cierre, soft-delete y bitácora de moderación como protección legal y ética, rate limiting y honeypot contra spam desde el día 1, diseño ligero para conectividad limitada, pruebas solo en las rutas críticas (lo justo para 48 h), despliegue con healthcheck, monitoreo y rollback definidos antes de lanzar, y un paso de code review obligatorio antes de cada commit.
