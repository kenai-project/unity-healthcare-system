CDC Dev Stack - quickstart
==========================

This package brings up a lightweight local dev environment for testing Postgres -> Debezium -> Kafka CDC.

Included:
- docker-compose.yml (Postgres, Zookeeper, Kafka, Debezium Connect, Prometheus, Grafana)
- pg.env
- postgresql.conf (configured for logical decoding)
- setup.sql (creates sample tables, debezium user, and publication)
- connector.json (Debezium connector config - POST to Connect)
- prometheus.yml (basic scraping targets)
- Dockerfile.node (example to containerize your Node app)

Quick steps:
1. Start docker compose:
   docker compose up -d

2. Wait for Postgres to initialize (check logs). It runs setup.sql automatically.

3. Register the Debezium connector:
   curl -X POST -H "Content-Type: application/json" --data @connector.json http://localhost:8083/connectors

4. Verify Kafka topics are created (use kafkacat or docker exec into kafka container).

5. Interact with your Node app (connect it to the Postgres at host: 127.0.0.1:5432 with user/postgres/password from pg.env).
   Any INSERT/UPDATE to 'users' or 'appointments' will be captured by Debezium and emitted to Kafka topics named:
     unitydb.public.users
     unitydb.public.appointments

6. Next steps (I can add these if you want):
   - Spark Structured Streaming job to read Kafka topics and write to Apache Iceberg.
   - MinIO + Iceberg catalog + Spark image in docker-compose.
   - Doris container and Spark->Doris connector for reporting.
   - Prometheus exporters for Postgres/Kafka (I can add them to compose).
