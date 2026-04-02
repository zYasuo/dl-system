-- CreateTable
CREATE TABLE "user_credentials" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_user_id_key" ON "user_credentials"("user_id");

-- MigrateData
INSERT INTO "user_credentials" ("user_id", "password_hash", "failed_login_attempts", "locked_until", "created_at", "updated_at")
SELECT "id", "password", "failed_login_attempts", "locked_until", "created_at", "updated_at"
FROM "users";

-- DropColumns
ALTER TABLE "users" DROP COLUMN "password";
ALTER TABLE "users" DROP COLUMN "failed_login_attempts";
ALTER TABLE "users" DROP COLUMN "locked_until";

-- AddForeignKey
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
