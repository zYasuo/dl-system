ALTER TABLE "users" ADD COLUMN "email_verified_at" TIMESTAMP(3);

UPDATE "users" SET "email_verified_at" = "created_at" WHERE "email_verified_at" IS NULL;

CREATE TABLE "email_verification_challenges" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "code_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "email_verification_challenges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_verification_challenges_uuid_key" ON "email_verification_challenges"("uuid");

CREATE INDEX "email_verification_challenges_user_id_idx" ON "email_verification_challenges"("user_id");

ALTER TABLE "email_verification_challenges" ADD CONSTRAINT "email_verification_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
