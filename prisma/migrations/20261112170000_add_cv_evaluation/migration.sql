ALTER TABLE "CVApplicant"
ADD COLUMN "cvUploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "CVEvaluation" (
    "id" UUID NOT NULL,
    "applicantId" UUID NOT NULL,
    "cvFilename" TEXT NOT NULL,
    "cvUploadedAt" TIMESTAMP(3) NOT NULL,
    "rubric" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "nextQuestion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(0),

    CONSTRAINT "CVEvaluation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CVEvaluation_applicantId_fkey" FOREIGN KEY ("applicantId")
        REFERENCES "CVApplicant"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CVEvaluation_applicantId_createdAt_idx"
ON "CVEvaluation"("applicantId", "createdAt");
