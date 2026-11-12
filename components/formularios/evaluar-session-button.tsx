"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { evaluarEscaparateSession } from "@/lib/actions/actions";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

interface EvaluarSessionButtonProps {
  sessionId: string;
  evaluado: boolean;
}

export function EvaluarSessionButton({
  sessionId,
  evaluado,
}: EvaluarSessionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEvaluar = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await evaluarEscaparateSession(sessionId);
      if (result.success) {
        router.refresh();
      }
    } catch (err) {
      console.error("Error al evaluar sesión:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado al conectar con Ollama o procesar la rúbrica."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      <Button
        onClick={handleEvaluar}
        disabled={isLoading}
        size="lg"
        className="w-full sm:w-auto font-medium shadow-sm transition-all"
        variant={evaluado ? "outline" : "default"}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Evaluando con modelo de visión... (puede tardar unos segundos)
          </>
        ) : evaluado ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-evaluar Escaparate
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Evaluar con IA (Ollama)
          </>
        )}
      </Button>
    </div>
  );
}
