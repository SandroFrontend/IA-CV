CREATE TABLE "CVApplicant" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cvFilename" TEXT NOT NULL,
    "cvData" BYTEA NOT NULL,
    "valoracion" TEXT NOT NULL DEFAULT '',
    "fortalezas" TEXT NOT NULL DEFAULT '',
    "mejoras" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CVApplicant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CVApplicant_username_key" ON "CVApplicant"("username");
