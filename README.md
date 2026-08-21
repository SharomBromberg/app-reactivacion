# Directorio y Marketplace Solidario Post-Sismo (Manizales, Caldas)

Monorepo pnpm con la API (NestJS + Prisma) y la app móvil/PWA (Expo Router).

## Cómo correr en 5 minutos

### 0. Requisitos

- Node >= 20
- pnpm >= 9 (`corepack enable` si no lo tienes)
- Una base de datos PostgreSQL accesible (Supabase, Neon o local)

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Edita `apps/api/.env` con tu `DATABASE_URL` real y un `JWT_SECRET` propio.
En `apps/mobile/.env`, `EXPO_PUBLIC_API_URL` debe apuntar a la API (por defecto `http://localhost:3000`).

### 3. Preparar la base de datos

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```

### 4. Levantar la API

```bash
pnpm dev:api
```

Verifica que responde en [http://localhost:3000/health](http://localhost:3000/health).

### 5. Levantar la app móvil/PWA

En otra terminal:

```bash
pnpm dev:mobile
```

Abre con Expo Go (celular), presiona `w` para la versión web/PWA, o `a`/`i` para emuladores.

## Scripts útiles (desde la raíz)

| Script             | Qué hace                                  |
| ------------------ | ------------------------------------------ |
| `pnpm dev:api`      | Levanta la API en modo watch               |
| `pnpm dev:mobile`   | Levanta Expo (móvil/web)                   |
| `pnpm lint`         | ESLint en todo el monorepo                 |
| `pnpm typecheck`    | `tsc --noEmit` en cada paquete/app         |
| `pnpm test`         | Tests unitarios/e2e en cada paquete/app    |
| `pnpm format`       | Formatea todo con Prettier                 |

## Estructura

```
apps/api        NestJS + Prisma (PostgreSQL)
apps/mobile      Expo Router + TanStack Query (atomic design)
packages/shared  Tipos y enums compartidos entre api y mobile
```

## Notas de seguridad y privacidad

- No se recolecta información financiera ni datos personales sensibles.
- `.env` nunca se commitea; usa siempre `.env.example` como referencia.
- Rate limiting activo por defecto (30 req/min por IP) vía `ThrottlerModule`.

## Licencia

© 2026 Sharom Bromberg, Emilia Alarcón. Todos los derechos reservados. Ver
[LICENSE](./LICENSE). El código es público en este repositorio con fines de
transparencia y colaboración, no de reuso libre.
