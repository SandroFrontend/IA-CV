import { z } from "zod";
import { CV_RUBRIC_CRITERIA } from "@/lib/cv/criteria";

const rubricCriterionSchema = z.object({
  id: z.string(),
  score: z.number().int().min(0),
  feedback: z.string().trim().min(1).max(1200),
});

export const CVRubricOutputSchema = z
  .object({
    summary: z.string().trim().min(1).max(2000),
    strengths: z.array(z.string().trim().min(1).max(500)).min(1).max(8),
    improvements: z.array(z.string().trim().min(1).max(500)).min(1).max(8),
    criteria: z.array(rubricCriterionSchema).length(CV_RUBRIC_CRITERIA.length),
    questions: z.array(z.string().trim().min(10).max(500)).length(4),
  })
  .superRefine((value, context) => {
    const seen = new Set<string>();
    for (const criterion of value.criteria) {
      const definition = CV_RUBRIC_CRITERIA.find(({ id }) => id === criterion.id);
      if (!definition || seen.has(criterion.id)) {
        context.addIssue({
          code: "custom",
          message: "La evaluación contiene criterios duplicados o desconocidos.",
        });
        continue;
      }
      seen.add(criterion.id);
      if (criterion.score > definition.maxPoints) {
        context.addIssue({
          code: "custom",
          message: `La puntuación de ${criterion.id} supera su máximo.`,
        });
      }
    }
    if (seen.size !== CV_RUBRIC_CRITERIA.length) {
      context.addIssue({
        code: "custom",
        message: "Faltan criterios de la rúbrica.",
      });
    }
  });

export const CVRubricSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  criteria: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      maxPoints: z.number().int().positive(),
      score: z.number().int().min(0),
      feedback: z.string(),
    }),
  ),
});

export const CVAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
  score: z.number().int().min(0).max(1),
  feedback: z.string(),
});

export const CVAnswersSchema = z.array(CVAnswerSchema).max(4);
export const CVAnswerOutputSchema = z.object({
  score: z.number().int().min(0).max(1),
  feedback: z.string().trim().min(1).max(1200),
});

export const CVReviewSessionSchema = z.object({
  id: z.string().uuid(),
  cvFilename: z.string(),
  rubric: CVRubricSchema,
  questions: z.array(z.string()).length(4),
  answers: CVAnswersSchema,
  nextQuestion: z.number().int().min(0).max(4),
  completedAt: z.string().nullable(),
});

export type CVRubric = z.infer<typeof CVRubricSchema>;
export type CVAnswer = z.infer<typeof CVAnswerSchema>;
export type CVReviewSession = z.infer<typeof CVReviewSessionSchema>;
