# 🚀 Supabase – Checklist for Creating Tables in Custom Schemas

When working outside the default `public` schema (e.g., `web_app`), you must configure **grants and RLS** manually to avoid `permission denied` errors.  

This checklist ensures that tables are ready for both **frontend (anon/authenticated)** and **backend (service_role)** usage.  

---

## 1. Create the schema (if not exists)
```sql
CREATE SCHEMA IF NOT EXISTS web_app;
```

## 2. Create Table

```sql
CREATE TABLE web_app.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
```

## 3. Enable Row Level Security (RLS)
```sql
ALTER TABLE web_app.users ENABLE ROW LEVEL SECURITY;
```

## 4. Set up grants
## service_role (backend)
## Full access (ignores RLS):

```sql
    GRANT USAGE ON SCHEMA web_app TO service_role;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA web_app TO service_role;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA web_app TO service_role;

    ALTER DEFAULT PRIVILEGES IN SCHEMA web_app
    GRANT ALL PRIVILEGES ON TABLES TO service_role;

    ALTER DEFAULT PRIVILEGES IN SCHEMA web_app
    GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;
```

## anon and authenticated (frontend)
## Minimal access so that policies can apply:

```sql
GRANT USAGE ON SCHEMA web_app TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON web_app.users TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA web_app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
```

## 5. Create policies
Example: allow users to view and update only their own rows:

```sql
    CREATE POLICY "Users can view own data"
    ON web_app.users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

    CREATE POLICY "Users can update own data"
    ON web_app.users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid());
```