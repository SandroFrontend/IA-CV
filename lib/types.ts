import type {
    Prisma,
    EscapareteSession,
    ItemRubrica,
    User,
    Actividad,
    Test,
} from "@/generated/prisma/client";

// ─── Prisma Database Model Types ──────────────────────────────────────────────
export type { EscapareteSession, ItemRubrica, User, Actividad, Test, Prisma };

export type EscapareteSessionWithRubricas = Prisma.EscapareteSessionGetPayload<{
    include: { itemRubricas: true };
}>;

export type ItemRubricaCreateInput = Prisma.ItemRubricaCreateInput;
export type ItemRubricaUncheckedCreateInput = Prisma.ItemRubricaUncheckedCreateInput;
export type EscapareteSessionCreateInput = Prisma.EscapareteSessionCreateInput;

// ─── Rubric Evaluation ─────────────────────────────────────────────────────

export interface RubricItemDef {
    id: string;
    name: string;
    description: string;
    levels: { score: number; label: string }[];
}

export interface RubricScore {
    itemId: string;
    score: number;        // 0–4
    justification: string;
}

export interface EvaluacionItemInput {
    rubricaId?: string;
    name: string;
    description: string;
    value: number;
    nivel: string;
    justification: string;
}

export interface EvaluacionRequest {
    sessionId: string;
}

export interface EvaluacionResponse {
    sessionId: string;
    evaluado: boolean;
    scores?: RubricScore[];
    items?: ItemRubrica[];
    totalScore: number;   // sum of all scores
    maxScore: number;
    cached?: boolean;     // true if loaded from DB instead of re-evaluated
}