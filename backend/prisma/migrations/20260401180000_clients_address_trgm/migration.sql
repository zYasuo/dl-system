CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "clients_address_search_trgm_idx" ON "clients" USING GIN ((
  COALESCE("street", '') || ' ' || COALESCE("address_number", '') || ' ' ||
  COALESCE("complement", '') || ' ' || COALESCE("neighborhood", '') || ' ' ||
  COALESCE("city", '') || ' ' || COALESCE("state", '') || ' ' || COALESCE("zip_code", '')
) gin_trgm_ops);
