# 📘 Guía de Migraciones - MochiExpress

## 🎯 Resumen Ejecutivo

Este proyecto usa **TypeORM** para migraciones. Las migraciones SQL en `supabase/migrations2/` son SOLO de referencia y **NO se deben ejecutar**.

---

## 🔄 Workflow de Migraciones

### 1️⃣ **Crear una nueva migración**

```bash
# Opción A: Generar desde entidades (recomendado)
yarn migration:generate:local src/migrations/NombreDescriptivo

# Opción B: Crear vacía para escribirla manualmente
yarn migration:create:local src/migrations/NombreDescriptivo
```

### 2️⃣ **Probar en LOCAL (emulador Supabase)**

```bash
# 1. Asegúrate que el emulador esté corriendo
yarn db:start

# 2. Verifica qué migraciones están pendientes
yarn migration:show:local

# 3. Ejecuta las migraciones pendientes
yarn migration:run:local

# 4. Verifica que se aplicaron correctamente
yarn migration:show:local

# 5. Prueba tu aplicación
yarn dev:local
```

### 3️⃣ **Aplicar a REMOTO (Supabase Production)**

```bash
# 1. Asegúrate que tu .env tiene las credenciales REMOTAS
# DATABASE_HOST=db.tu-project-ref.supabase.co
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=tu-password
# DATABASE_NAME=postgres

# 2. Verifica qué migraciones están pendientes en remoto
yarn migration:show

# 3. Ejecuta las migraciones
yarn migration:run

# 4. Verifica que se aplicaron
yarn migration:show

# O usa el script automático:
./migrate-typeorm-to-remote.sh
```

---

## 📁 Estructura de Archivos

```
src/migrations/                    ✅ Migraciones TypeORM (SE USAN)
  ├── 1759194051312-CreateCountriesTable.ts
  ├── 1759197341233-CreateRolesTable.ts
  └── ...

supabase/migrations2/              ⚠️  Solo referencia (NO ejecutar)
  ├── 20250916211000_init_tablas.sql
  └── ...

supabase/seeds2/                   ⚠️  Solo referencia (NO ejecutar)
  └── auth_users.sql
```

---

## 🔧 Scripts Disponibles

### Local (emulador)
```bash
yarn migration:generate:local <path>  # Generar migración desde entidades
yarn migration:create:local <path>    # Crear migración vacía
yarn migration:run:local              # Ejecutar migraciones pendientes
yarn migration:revert:local           # Revertir última migración
yarn migration:show:local             # Ver estado de migraciones

yarn db:start                         # Iniciar emulador Supabase
yarn db:stop                          # Detener emulador
yarn db:reset                         # Reset completo del emulador
yarn reset:all                        # Reset + ejecutar migraciones
```

### Remoto (production)
```bash
yarn migration:show                   # Ver estado de migraciones
yarn migration:run                    # Ejecutar migraciones pendientes
yarn migration:revert                 # Revertir última migración

./migrate-typeorm-to-remote.sh       # Script automático con confirmación
```

---

## 🚨 Reglas Importantes

### ✅ HACER
- Usar TypeORM para TODAS las migraciones
- Probar SIEMPRE en local antes de remoto
- Revisar el estado con `migration:show` antes de ejecutar
- Hacer backup del remoto antes de cambios importantes
- Commitear las migraciones en Git

### ❌ NO HACER
- NO ejecutar archivos de `supabase/migrations2/` manualmente
- NO ejecutar archivos de `supabase/seeds2/` manualmente
- NO usar `supabase db reset --linked` (borra TODO el remoto)
- NO modificar migraciones ya ejecutadas
- NO saltar el ambiente local

---

## 🔄 Ejemplo Completo: Agregar Nueva Tabla

```bash
# 1. Crear entidad en src/moduleName/entities/
# 2. Generar migración
yarn migration:generate:local src/migrations/CreateTableName

# 3. Probar en local
yarn db:start
yarn migration:run:local
yarn dev:local  # Probar la app

# 4. Si todo funciona, aplicar a remoto
yarn migration:run  # O usar ./migrate-typeorm-to-remote.sh

# 5. Commit
git add src/migrations/
git commit -m "feat: add table_name migration"
```

---

## 🆘 Troubleshooting

### Problema: Storage container failing (Migration not found)
Error: `Migration fix-prefix-race-conditions-optimized not found`

```bash
# Solución: Actualizar Supabase CLI
brew upgrade supabase

# Verificar versión (debe ser >= 2.47.0)
supabase --version

# Reiniciar desde cero
supabase stop --no-backup
supabase start
yarn migration:run:local
```

### Problema: "Migration already executed"
```bash
# Ver estado
yarn migration:show:local  # o sin :local para remoto

# Si necesitas revertir
yarn migration:revert:local
```

### Problema: Local y remoto desincronizados
```bash
# Opción 1: Resetear local al estado del remoto
yarn db:reset
yarn migration:run:local

# Opción 2: Verificar diferencias
yarn migration:show:local  # Estado local
yarn migration:show        # Estado remoto
```

### Problema: Error al conectar a remoto
Verifica tu `.env`:
```bash
DATABASE_HOST=db.xxxxx.supabase.co  # Sin https://
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu-password-correcto
DATABASE_NAME=postgres
```

---

## 📦 Backup del Remoto

```bash
# Linkear proyecto (solo una vez)
supabase link --project-ref TU_PROJECT_REF

# Crear backup
supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql --linked

# Restaurar backup (cuidado!)
psql "postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres" < backup.sql
```

---

## 📝 Checklist de Migración

- [ ] Migración creada con TypeORM
- [ ] Probada en local
- [ ] Código funciona en local
- [ ] Revisado el estado remoto con `migration:show`
- [ ] Backup del remoto creado (opcional pero recomendado)
- [ ] Migración ejecutada en remoto
- [ ] Verificado estado remoto
- [ ] Commit y push a Git

---

## 🎓 Conceptos Clave

**Local = Emulador Supabase**
- Usa `.env.local`
- Scripts terminan en `:local`
- Base de datos: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

**Remoto = Supabase Production**
- Usa `.env`
- Scripts sin `:local`
- Base de datos: Credenciales de tu proyecto Supabase

**TypeORM vs Supabase CLI**
- TypeORM: Migraciones versionadas con código TypeScript
- Supabase CLI: Solo para reset/backup del emulador

