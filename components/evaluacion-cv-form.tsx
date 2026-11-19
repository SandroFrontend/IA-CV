"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCVApplicant } from "@/lib/actions/cv.action";
import { CV_SECTORS } from "@/lib/cv/sectors";
import { FileText, Upload } from "lucide-react";

type EvaluacionData = {
  candidato: string;
  email: string;
  sector: string;
  otroSector: string;
};

const INITIAL_DATA: EvaluacionData = {
  candidato: "",
  email: "",
  sector: "",
  otroSector: "",
};

const INTRODUCCION =
  "Permite evaluar currículums y registrar una valoración orientada al sector profesional elegido por el candidato.";

export function EvaluacionCVForm() {
  const [registrationState, registerAction, isPending] = useActionState(
    registerCVApplicant,
    {},
  );
  const [data, setData] = useState<EvaluacionData>(INITIAL_DATA);
  const [cvFileName, setCvFileName] = useState("");

  const updateField = <K extends keyof EvaluacionData>(
    field: K,
    value: EvaluacionData[K],
  ) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="cv-print-main min-h-screen bg-[radial-gradient(circle_at_top,#fff1f2_0,transparent_28rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="cv-page-header space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
            CIPFP Ausiàs March
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
            Evaluación <span className="text-red-700">CV</span>
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
            {INTRODUCCION}
          </p>
          <Link
            href="/ia"
            className="inline-flex items-center rounded-lg border border-red-200 bg-white/80 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Acceso alumnado: evaluar mi CV con IA
          </Link>
        </header>

        <div className="cv-layout mx-auto max-w-2xl">
          <Card className="cv-editor overflow-hidden border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="h-1 w-full bg-red-700" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="size-5 text-primary" />
                Datos de la evaluación
              </CardTitle>
              <CardDescription>
                Crea una cuenta local de prueba y adjunta el currículum PDF. Después podrás acceder
                a la evaluación guiada con IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                action={registerAction}
              >
                <div className="space-y-2">
                  <Label htmlFor="candidato">Nombre del candidato</Label>
                  <Input
                    id="candidato"
                    name="candidato"
                    autoComplete="name"
                    value={data.candidato}
                    onChange={(event) => updateField("candidato", event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico (opcional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    minLength={3}
                    maxLength={32}
                    pattern="[A-Za-z0-9._-]+"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    De 3 a 32 caracteres: letras, números, punto, guion o guion bajo.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 12 caracteres. Se almacena un hash; esta cuenta local no valida todavía
                    la contraseña del centro.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector profesional al que opta</Label>
                  <select
                    id="sector"
                    name="sector"
                    value={data.sector}
                    onChange={(event) => {
                      updateField("sector", event.target.value);
                      if (event.target.value !== "Otros") updateField("otroSector", "");
                    }}
                    required
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-red-700 focus-visible:ring-3 focus-visible:ring-red-700/20"
                  >
                    <option value="" disabled>
                      Selecciona un sector
                    </option>
                    {CV_SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                {data.sector === "Otros" && (
                  <div className="space-y-2">
                    <Label htmlFor="otroSector">Especifica el sector</Label>
                    <Input
                      id="otroSector"
                      name="otroSector"
                      value={data.otroSector}
                      onChange={(event) => updateField("otroSector", event.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cv">Currículum (PDF)</Label>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
                    <Input
                      id="cv"
                      type="file"
                      name="cv"
                      accept=".pdf,application/pdf"
                      required
                      onChange={(event) => setCvFileName(event.target.files?.[0]?.name ?? "")}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cv"
                      className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-md bg-red-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
                    >
                      Seleccionar PDF
                    </label>
                    <span className="min-w-0 truncate text-sm text-muted-foreground">
                      {cvFileName || "No se ha seleccionado ningún archivo"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF de hasta 10 MB. Se almacenará de forma privada en la base de datos.
                  </p>
                </div>

                {registrationState.error && (
                  <p
                    role="alert"
                    className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {registrationState.error}
                  </p>
                )}
                {registrationState.success && (
                  <div
                    role="status"
                    className="space-y-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300"
                  >
                    <p>Registro y currículum guardados correctamente.</p>
                    <Link href="/ia" className="font-semibold underline underline-offset-4">
                      Iniciar sesión para evaluar el CV con IA
                    </Link>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-red-700 text-white hover:bg-red-800"
                  disabled={isPending}
                >
                  <Upload className="size-4" />
                  {isPending ? "Guardando registro..." : "Registrarme y guardar CV"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
