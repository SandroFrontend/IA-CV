import { EvaluacionCVForm } from "@/components/evaluacion-cv-form";

export const metadata = {
  title: "Evaluación CV",
  description:
    "Permite evaluar currículums y registrar una valoración orientada al sector profesional elegido por el candidato.",
};

export default function EvaluacionCVPage() {
  return <EvaluacionCVForm />;
}
