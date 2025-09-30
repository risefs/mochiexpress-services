#!/bin/bash
# Script para ejecutar SOLO migraciones TypeORM contra Supabase remoto

set -e

echo "🚀 Migración TypeORM a Remoto"
echo "================================"
echo ""
echo "⚠️  Este script ejecutará las migraciones de src/migrations/"
echo "⚠️  NO ejecutará las de supabase/migrations2/"
echo ""

# Verificar que existe archivo .env para remoto
if [ ! -f ".env" ]; then
  echo "❌ No existe archivo .env"
  echo "   Crea un .env con las credenciales de tu Supabase remoto"
  exit 1
fi

echo "📋 Migraciones TypeORM encontradas:"
ls -1 src/migrations/*.ts | sed 's/src\/migrations\//  - /'
echo ""

# Mostrar qué migraciones se han ejecutado
echo "🔍 Verificando migraciones ya ejecutadas en remoto..."
yarn migration:show
echo ""

read -p "¿Continuar con la migración? [y/N]: " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "❌ Operación cancelada"
  exit 0
fi

echo ""
echo "🔄 Ejecutando migraciones TypeORM..."
yarn migration:run

echo ""
echo "✅ ¡Migraciones TypeORM aplicadas exitosamente!"
echo ""
echo "📊 Estado final de migraciones:"
yarn migration:show

