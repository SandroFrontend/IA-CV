import type { Metadata } from "next";
import { CVLoginForm } from "@/components/cv-login-form";
import { CVReviewChat } from "@/components/cv-review-chat";
import { CVUploadForm } from "@/components/cv-upload-form";
import { Button } from "@/components/ui/button";
import { CVReviewSessionSchema } from "@/lib/cv/review-types";
import { getCurrentCVApplicant } from "@/lib/cv/session";
import { logoutCVApplicant } from "@/lib/actions/cv-auth.action";
import { prisma } from "@/lib/prisma";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Evaluación de CV con IA",
  description: "Acceso del alumnado para evaluar su currículum y practicar una entrevista.",
};

export default async function CVAIAssessmentPage() {
  const applicant = await getCurrentCVApplicant();

  if (!applicant) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Evaluación CV con IA</h1>
            <p className="text-sm text-muted-foreground">
              Acceso del alumnado para recibir una valoración y practicar preguntas de entrevista.
            </p>
          </header>
          <CVLoginForm />
        </div>
      </main>
    );
  }

  const latestEvaluation = await prisma.cVEvaluation.findFirst({
    where: { applicantId: applicant.id },
    orderBy: { createdAt: "desc" },
  });
  const currentReview =
    latestEvaluation?.cvUploadedAt.getTime() === applicant.cvUploadedAt.getTime()
      ? CVReviewSessionSchema.parse({
          id: latestEvaluation.id,
          cvFilename: latestEvaluation.cvFilename,
          rubric: latestEvaluation.rubric,
          questions: latestEvaluation.questions,
          answers: latestEvaluation.answers,
          nextQuestion: latestEvaluation.nextQuestion,
          completedAt: latestEvaluation.completedAt?.toISOString() ?? null,
        })
      : null;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Evaluación CV con IA</h1>
            <p className="text-muted-foreground">
              Hola, {applicant.fullName}. Cuenta local: <span className="font-medium">{applicant.username}</span>
            </p>
          </div>
          <form action={logoutCVApplicant}>
            <Button type="submit" variant="outline">
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </form>
        </header>

        <p className="text-sm text-muted-foreground">
          Último currículum: <span className="font-medium text-foreground">{applicant.cvFilename}</span>
          {" · "}subido el {applicant.cvUploadedAt.toLocaleDateString("es-ES")}
        </p>

        <CVUploadForm />
        <CVReviewChat
          key={`${applicant.cvUploadedAt.toISOString()}-${currentReview?.id ?? "sin-evaluacion"}`}
          initialReview={currentReview}
        />
        <p className="text-xs text-muted-foreground">
          Prototipo local: el acceso no está conectado todavía a las cuentas del centro.
        </p>
      </div>
    </main>
  );
}
