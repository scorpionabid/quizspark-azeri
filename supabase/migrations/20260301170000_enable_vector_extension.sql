-- Force enable vector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Grant usage on schema extensions to postgres, anon, authenticated, service_role
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
