# 🚀 Migration Cheatsheet - Quick Reference

## 📝 Nueva Migración

```bash
# Generar desde entidades
yarn migration:generate:local src/migrations/NombreDescriptivo
```

## 🧪 LOCAL (Emulador)

```bash
yarn db:start                      # Iniciar emulador
yarn migration:show:local          # Ver estado
yarn migration:run:local           # Ejecutar
yarn dev:local                     # Probar app
```

## 🌍 REMOTO (Production)

```bash
yarn migration:show                # Ver estado
yarn migration:run                 # Ejecutar

# O usar script interactivo:
./migrate-typeorm-to-remote.sh
```

## ⚠️ IMPORTANTE

- ✅ Usa TypeORM (`src/migrations/`)
- ❌ NO uses `supabase/migrations2/` (solo referencia)
- ✅ Siempre prueba en local primero
- ✅ Verifica con `migration:show` antes de ejecutar

## 🔄 Workflow Completo

```bash
# 1. Crear
yarn migration:generate:local src/migrations/MigracionNueva

# 2. Local
yarn migration:run:local

# 3. Probar
yarn dev:local

# 4. Remoto
yarn migration:run

# 5. Commit
git add src/migrations/ && git commit -m "feat: nueva migración"
```

## 📦 Ambientes

| Ambiente | ENV File | Scripts | Database |
|----------|----------|---------|----------|
| **Local** | `.env.local` | `*:local` | `127.0.0.1:54322` |
| **Remoto** | `.env` | (sin suffix) | `db.xxx.supabase.co:5432` |

