import { NextResponse } from "next/server";
import { evaluateCVText } from "@/lib/cv/assessment";
import { extractPDFText } from "@/lib/cv/pdf";
import { CVReviewSessionSchema } from "@/lib/cv/review-types";
import { getCVSessionApplicantId } from "@/lib/cv/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const applicantId = await getCVSessionApplicantId();
  if (!applicantId) {
    return NextResponse.json({ error: "Inicia sesión para evaluar tu CV." }, { status: 401 });
  }

  try {
    const applicant = await prisma.cVApplicant.findUnique({
      where: { id: applicantId },
      select: {
        cvFilename: true,
        cvData: true,
        cvUploadedAt: true,
      },
    });

    if (!applicant) {
      return NextResponse.json({ error: "No se encontró la cuenta del alumno." }, { status: 404 });
    }

    const cvText = await extractPDFText(applicant.cvData);
    const assessment = await evaluateCVText(cvText);
    const evaluation = await prisma.cVEvaluation.create({
      data: {
        applicantId,
        cvFilename: applicant.cvFilename,
        cvUploadedAt: applicant.cvUploadedAt,
        rubric: assessment.rubric,
        questions: assessment.questions,
      },
    });

    const review = CVReviewSessionSchema.parse({
      id: evaluation.id,
      cvFilename: evaluation.cvFilename,
      rubric: evaluation.rubric,
      questions: evaluation.questions,
      answers: evaluation.answers,
      nextQuestion: evaluation.nextQuestion,
      completedAt: evaluation.completedAt?.toISOString() ?? null,
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error al evaluar el CV con Ollama:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo completar la evaluación del CV.",
      },
      { status: 500 },
    );
  }
}
