"use client";

import { useActionState, useEffect } from "react";
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

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Actualizar currículum</CardTitle>
        <CardDescription>
          Si subes otro PDF, se utilizará como tu CV más reciente en la siguiente evaluación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latest-cv">Nuevo currículum (PDF)</Label>
            <Input
              id="latest-cv"
              type="file"
              name="cv"
              accept=".pdf,application/pdf"
              required
              disabled={isPending}
            />
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
          <Button type="submit" variant="outline" disabled={isPending}>
            <Upload className="size-4" />
            {isPending ? "Actualizando..." : "Subir nueva versión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
