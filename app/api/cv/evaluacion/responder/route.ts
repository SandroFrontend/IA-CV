import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateCVAnswer } from "@/lib/cv/assessment";
import {
  CVAnswersSchema,
  CVReviewSessionSchema,
  CVRubricSchema,
} from "@/lib/cv/review-types";
import { getCVSessionApplicantId } from "@/lib/cv/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const AnswerRequestSchema = z.object({
  reviewId: z.string().uuid(),
  answer: z.string().trim().min(1).max(2500),
});

export async function POST(request: Request) {
  const applicantId = await getCVSessionApplicantId();
  if (!applicantId) {
    return NextResponse.json({ error: "Inicia sesión para continuar." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La petición no contiene JSON válido." }, { status: 400 });
  }

  const parsedBody = AnswerRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "La respuesta debe tener entre 1 y 2.500 caracteres." },
      { status: 400 },
    );
  }

  try {
    const evaluation = await prisma.cVEvaluation.findFirst({
      where: {
        id: parsedBody.data.reviewId,
        applicantId,
      },
    });

    if (!evaluation) {
      return NextResponse.json({ error: "No se encontró esta evaluación." }, { status: 404 });
    }
    if (evaluation.completedAt || evaluation.nextQuestion >= 4) {
      return NextResponse.json({ error: "La entrevista ya está completa." }, { status: 409 });
    }

    const rubric = CVRubricSchema.parse(evaluation.rubric);
    const questions = z.array(z.string()).length(4).parse(evaluation.questions);
    const answers = CVAnswersSchema.parse(evaluation.answers);
    const question = questions[evaluation.nextQuestion];
    if (!question) {
      return NextResponse.json({ error: "No quedan preguntas por responder." }, { status: 409 });
    }

    const result = await evaluateCVAnswer({
      summary: rubric.summary,
      question,
      answer: parsedBody.data.answer,
    });
    const updatedAnswers = [
      ...answers,
      {
        question,
        answer: parsedBody.data.answer,
        score: result.score,
        feedback: result.feedback,
      },
    ];
    const nextQuestion = evaluation.nextQuestion + 1;
    const completedAt = nextQuestion === questions.length ? new Date() : null;
    const updated = await prisma.cVEvaluation.updateMany({
      where: {
        id: evaluation.id,
        applicantId,
        nextQuestion: evaluation.nextQuestion,
      },
      data: {
        answers: updatedAnswers,
        nextQuestion,
        completedAt,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json(
        { error: "La entrevista cambió en otra petición. Actualiza la página e inténtalo de nuevo." },
        { status: 409 },
      );
    }

    const latest = await prisma.cVEvaluation.findUniqueOrThrow({
      where: { id: evaluation.id },
    });
    const review = CVReviewSessionSchema.parse({
      id: latest.id,
      cvFilename: latest.cvFilename,
      rubric: latest.rubric,
      questions: latest.questions,
      answers: latest.answers,
      nextQuestion: latest.nextQuestion,
      completedAt: latest.completedAt?.toISOString() ?? null,
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error al valorar una respuesta de la entrevista:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo valorar la respuesta.",
      },
      { status: 500 },
    );
  }
}
