"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateLatestCV } from "@/lib/actions/cv.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function CVUploadForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(updateLatestCV, {});
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <div className="h-1 w-full bg-red-700" />
      <CardHeader>
        <CardTitle className="text-lg text-neutral-950">Actualizar currículum</CardTitle>
        <CardDescription>
          Si subes otro PDF, se utilizará como tu CV más reciente en la siguiente evaluación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latest-cv">Nuevo currículum (PDF)</Label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
              <Input
                id="latest-cv"
                type="file"
                name="cv"
                accept=".pdf,application/pdf"
                required
                disabled={isPending}
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                className="sr-only"
              />
              <label
                htmlFor="latest-cv"
                className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-md bg-red-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
              >
                Seleccionar PDF
              </label>
              <span className="min-w-0 truncate text-sm text-muted-foreground">
                {fileName || "No se ha seleccionado ningún archivo"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo 10 MB. La subida respeta la fecha límite configurada por el centro.
            </p>
          </div>
          {state.error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state.success && (
            <p role="status" className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
              Currículum actualizado. Inicia una nueva evaluación para analizar esta versión.
            </p>
          )}
          <Button
            type="submit"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
            disabled={isPending}
          >
            <Upload className="size-4" />
            {isPending ? "Actualizando..." : "Subir nueva versión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
