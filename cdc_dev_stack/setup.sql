-- initialize DB with tables, debezium user, and publication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  doctor_id INTEGER,
  scheduled_at timestamptz,
  status TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- create debezium user
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'debezium') THEN
      CREATE ROLE debezium WITH REPLICATION LOGIN PASSWORD 'debezium_pwd';
   END IF;
END
$do$;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;

-- create publication for the tables
-- If these tables already exist in production, create the publication there instead.
CREATE PUBLICATION roz_publication FOR TABLE users, appointments;
