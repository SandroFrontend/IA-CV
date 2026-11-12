"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CVReviewSessionSchema,
  type CVReviewSession,
} from "@/lib/cv/review-types";
import { CV_RUBRIC_TOTAL } from "@/lib/cv/criteria";
import { LoaderCircle, MessageCircle, Send, Sparkles } from "lucide-react";

const ReviewResponseSchema = z.object({ review: CVReviewSessionSchema });
const ErrorResponseSchema = z.object({ error: z.string() });

async function readReviewResponse(response: Response) {
  const body: unknown = await response.json();
  if (!response.ok) {
    const parsedError = ErrorResponseSchema.safeParse(body);
    throw new Error(
      parsedError.success ? parsedError.data.error : "No se pudo completar la petición.",
    );
  }
  const parsed = ReviewResponseSchema.safeParse(body);
  if (!parsed.success) throw new Error("La respuesta del servidor no tiene el formato esperado.");
  return parsed.data.review;
}

function getCVRating(score: number) {
  if (score >= 16) return "Excelente";
  if (score >= 12) return "Muy bueno";
  if (score >= 8) return "Adecuado";
  if (score >= 4) return "Mejorable";
  return "Deficiente";
}

export function CVReviewChat({
  initialReview,
}: {
  initialReview: CVReviewSession | null;
}) {
  const [review, setReview] = useState(initialReview);
  const [answer, setAnswer] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startReview = async () => {
    setError(null);
    setIsStarting(true);
    try {
      const response = await fetch("api/cv/evaluacion/iniciar", { method: "POST" });
      setReview(await readReviewResponse(response));
      setAnswer("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo iniciar la evaluación.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  const submitAnswer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!review || !answer.trim()) return;

    setError(null);
    setIsSending(true);
    try {
      const response = await fetch("api/cv/evaluacion/responder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, answer }),
      });
      setReview(await readReviewResponse(response));
      setAnswer("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo enviar la respuesta.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-primary" />
          Evaluación guiada con IA
        </CardTitle>
        <CardDescription>
          La IA revisa el contenido de tu último CV con la rúbrica de 20 puntos y después te
          plantea cuatro preguntas personalizadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {!review ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Al iniciar, el texto de tu PDF se procesa en el servidor con el modelo Ollama
              configurado por el centro.
            </p>
            <Button type="button" onClick={startReview} disabled={isStarting}>
              {isStarting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {isStarting ? "Analizando currículum..." : "Evaluar mi currículum"}
            </Button>
          </div>
        ) : (
          <ReviewReport
            review={review}
            answer={answer}
            setAnswer={setAnswer}
            isSending={isSending}
            isStarting={isStarting}
            onSubmit={submitAnswer}
            onRestart={startReview}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ReviewReport({
  review,
  answer,
  setAnswer,
  isSending,
  isStarting,
  onSubmit,
  onRestart,
}: {
  review: CVReviewSession;
  answer: string;
  setAnswer: (value: string) => void;
  isSending: boolean;
  isStarting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRestart: () => void;
}) {
  const cvScore = review.rubric.criteria.reduce((total, item) => total + item.score, 0);
  const interviewScore = review.answers.reduce((total, item) => total + item.score, 0);
  const isComplete = review.nextQuestion === review.questions.length;

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-lg border bg-muted/20 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Currículum evaluado</p>
            <p className="font-medium">{review.cvFilename}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{cvScore}/{CV_RUBRIC_TOTAL}</p>
            <p className="text-sm text-muted-foreground">{getCVRating(cvScore)}</p>
          </div>
        </div>
        <p className="text-sm">{review.rubric.summary}</p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold">Puntuación por criterio</h3>
        {review.rubric.criteria.map((criterion) => (
          <div key={criterion.id} className="rounded-md border p-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="font-medium">{criterion.name}</span>
              <span className="shrink-0 font-semibold">
                {criterion.score}/{criterion.maxPoints}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{criterion.feedback}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-2">
          <h3 className="font-semibold">Fortalezas</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {review.rubric.strengths.map((strength, index) => (
              <li key={`${index}-${strength}`}>{strength}</li>
            ))}
          </ul>
        </section>
        <section className="space-y-2">
          <h3 className="font-semibold">Aspectos para mejorar</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {review.rubric.improvements.map((improvement, index) => (
              <li key={`${index}-${improvement}`}>{improvement}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-4 border-t pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-semibold">
            <MessageCircle className="size-4" />
            Entrevista sobre tu currículum
          </h3>
          <span className="text-sm text-muted-foreground">
            {review.nextQuestion}/{review.questions.length} respondidas
          </span>
        </div>

        {review.answers.map((item, index) => (
          <div key={`${review.id}-${index}`} className="space-y-2">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="mb-1 font-medium">Pregunta {index + 1}</p>
              <p>{item.question}</p>
            </div>
            <div className="ml-4 rounded-lg border p-3 text-sm">
              <p className="whitespace-pre-wrap">{item.answer}</p>
              <p className="mt-2 text-muted-foreground">
                Valoración: {item.score}/1 · {item.feedback}
              </p>
            </div>
          </div>
        ))}

        {!isComplete && (
          <>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Pregunta {review.nextQuestion + 1}
              </p>
              <p>{review.questions[review.nextQuestion]}</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="sr-only" htmlFor="cv-review-answer">
                Tu respuesta
              </label>
              <textarea
                id="cv-review-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                maxLength={2500}
                rows={4}
                required
                disabled={isSending}
                placeholder="Escribe tu respuesta..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button type="submit" disabled={isSending || !answer.trim()}>
                {isSending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {isSending ? "Valorando respuesta..." : "Enviar respuesta"}
              </Button>
            </form>
          </>
        )}

        {isComplete && (
          <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="font-semibold">Entrevista completada</p>
            <p className="text-sm">
              Puntuación de respuestas: {interviewScore}/{review.questions.length}. Se muestra
              separada de la nota del CV y no se suma a la rúbrica.
            </p>
          </div>
        )}
      </section>

      <div className="border-t pt-4">
        <Button type="button" variant="outline" onClick={onRestart} disabled={isStarting || isSending}>
          {isStarting && <LoaderCircle className="size-4 animate-spin" />}
          {isStarting ? "Iniciando nueva evaluación..." : "Evaluar de nuevo el CV más reciente"}
        </Button>
      </div>
    </div>
  );
}
