"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { submitEscaparate, FormState } from "@/lib/actions/actions";
import { ESCAPARATE_CASES_LIST } from "@/lib/escaparametro/cases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Upload, Image as ImageIcon, Loader2, ListOrdered } from "lucide-react";
import Link from "next/link";

export function EscaparateForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitEscaparate,
    {}
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border-muted">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Store className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Escaparámetro · Entrega de Proyecto
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Módulo de Diseño y Montaje de Escaparates — FP Comercio y Marketing.
          Registra el trabajo de tu equipo para la evaluación técnica.
        </CardDescription>
        <div className="pt-2">
          <Link
            href="/evaluaciones"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            Ver histórico de evaluaciones realizadas
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
              {state.error}
            </div>
          )}

          {/* Nombre del Equipo */}
          <div className="space-y-2">
            <Label htmlFor="equipo" className="text-sm font-semibold">
              Nombre del Equipo
            </Label>
            <Input
              id="equipo"
              name="equipo"
              placeholder="Ej: Grupo Visual Merchandising A"
              required
              disabled={isPending}
            />
          </div>

          {/* Menú desplegable: Caso particular */}
          <div className="space-y-2">
            <Label htmlFor="casoId" className="text-sm font-semibold">
              Caso de Escaparate
            </Label>
            <select
              id="casoId"
              name="casoId"
              required
              disabled={isPending}
              defaultValue=""
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                -- Selecciona el caso asignado --
              </option>
              {ESCAPARATE_CASES_LIST.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.description})
                </option>
              ))}
            </select>
          </div>

          {/* Área de texto: Memoria / Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-semibold">
              Memoria / Descripción del Escaparate
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              placeholder="Detalla el concepto visual, la composición, iluminación, punto focal, paleta cromática y materiales empleados..."
              required
              disabled={isPending}
            />
          </div>

          {/* Selector de Imagen con Previsualización */}
          <div className="space-y-2">
            <Label htmlFor="imagen" className="text-sm font-semibold">
              Fotografía del Escaparate
            </Label>
            <Input
              id="imagen"
              name="imagen"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              disabled={isPending}
              className="cursor-pointer file:cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/30 p-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5 font-medium">
                  <ImageIcon className="h-3.5 w-3.5" /> Previsualización de la imagen:
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={previewUrl}
                    alt="Previsualización del escaparate"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full text-base font-medium py-5"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Guardando y preparando evaluación...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Enviar Escaparate a Evaluación
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
