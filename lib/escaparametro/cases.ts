export interface EscaparateCase {
  id: string;
  title: string;
  description: string;
}

export const ESCAPARATE_CASES = {
  navidad: {
    id: "navidad",
    title: "Campaña de Navidad",
    description: "Escaparate de una tienda de moda para el black friday / navidad",
  },
  aniversario: {
    id: "aniversario",
    title: "Aniversario",
    description: "Escaparate para el décimo aniversario de una tienda de alimentación",
  },
} as const;

export type CaseId = keyof typeof ESCAPARATE_CASES;

export const ESCAPARATE_CASES_LIST: EscaparateCase[] = Object.values(ESCAPARATE_CASES);

export function isValidCaseId(caseId: string): caseId is CaseId {
  return caseId in ESCAPARATE_CASES;
}
