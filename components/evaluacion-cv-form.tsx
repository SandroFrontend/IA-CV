"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCVApplicant } from "@/lib/actions/cv.action";
import { CV_SECTORS } from "@/lib/cv/sectors";
import { Download, FileText, Printer, Upload } from "lucide-react";

type EvaluacionData = {
  candidato: string;
  email: string;
  sector: string;
  otroSector: string;
  cvName: string;
};

const INITIAL_DATA: EvaluacionData = {
  candidato: "",
  email: "",
  sector: "",
  otroSector: "",
  cvName: "",
};

const INTRODUCCION =
  "Permite evaluar currículums y registrar una valoración orientada al sector profesional elegido por el candidato.";

function getFileName(candidate: string) {
  const safeName = candidate
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `evaluacion-cv${safeName ? `-${safeName}` : ""}.docx`;
}

function getSector(data: EvaluacionData) {
  return data.sector === "Otros" ? data.otroSector.trim() || "Otros" : data.sector || "—";
}

export function EvaluacionCVForm() {
  const [registrationState, registerAction, isPending] = useActionState(
    registerCVApplicant,
    {},
  );
  const [data, setData] = useState<EvaluacionData>(INITIAL_DATA);
  const [formChanged, setFormChanged] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const evaluacionPreparada = Boolean(registrationState.success) && !formChanged;

  const updateField = <K extends keyof EvaluacionData>(
    field: K,
    value: EvaluacionData[K],
  ) => {
    setData((current) => ({ ...current, [field]: value }));
    setFormChanged(true);
  };

  const handleExportWord = async () => {
    setExportError(null);

    try {
      const document = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: { top: 1000, right: 1100, bottom: 1000, left: 1100 },
              },
            },
            children: [
              new Paragraph({
                text: "Evaluación CV",
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
              }),
              new Paragraph({
                text: INTRODUCCION,
                alignment: AlignmentType.CENTER,
                spacing: { after: 360 },
              }),
              new Paragraph({ text: "Datos del candidato", heading: HeadingLevel.HEADING_1 }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Candidato: ", bold: true }),
                  new TextRun(data.candidato || "—"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Correo electrónico: ", bold: true }),
                  new TextRun(data.email || "—"),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Sector profesional: ", bold: true }),
                  new TextRun(getSector(data)),
                ],
                spacing: { after: 240 },
              }),
              new Paragraph({ text: "Valoración profesional", heading: HeadingLevel.HEADING_1 }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Currículum: ", bold: true }),
                  new TextRun(data.cvName || "No adjuntado"),
                ],
                spacing: { after: 120 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(document);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = getFileName(data.candidato);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (exportError) {
      console.error("No se pudo exportar la evaluación a Word:", exportError);
      setExportError("No se pudo generar el documento Word. Inténtalo de nuevo.");
    }
  };

  return (
    <main className="cv-print-main min-h-screen bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="cv-page-header space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Evaluación CV</h1>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
            {INTRODUCCION}
          </p>
          <Link
            href="/ia"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Acceso alumnado: evaluar mi CV con IA
          </Link>
        </header>

        <div className="cv-layout grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="cv-editor border-muted shadow-sm">
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
                onSubmit={() => setFormChanged(false)}
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
                    onChange={() => setFormChanged(true)}
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
                    onChange={() => setFormChanged(true)}
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
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
                  <Input
                    id="cv"
                    type="file"
                    name="cv"
                    accept=".pdf,application/pdf"
                    required
                    onChange={(event) =>
                      updateField("cvName", event.target.files?.[0]?.name ?? "")
                    }
                    className="cursor-pointer file:cursor-pointer"
                  />
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
                {exportError && (
                  <p
                    role="alert"
                    className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {exportError}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                  <Upload className="size-4" />
                  {isPending ? "Guardando registro..." : "Registrarme y guardar CV"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="cv-report border-muted shadow-sm">
            <CardHeader className="border-b bg-muted/30 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Evaluación CV</CardTitle>
              <CardDescription>{INTRODUCCION}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <section className="space-y-3">
                <h2 className="border-b pb-2 text-base font-semibold">Datos del candidato</h2>
                <ReportField label="Nombre" value={data.candidato} />
                <ReportField label="Correo electrónico" value={data.email} />
                <ReportField label="Sector profesional" value={getSector(data)} />
              </section>

              <section className="space-y-3">
                <h2 className="border-b pb-2 text-base font-semibold">Currículum</h2>
                <ReportField label="Currículum" value={data.cvName || "No adjuntado"} />
                <p className="text-sm text-muted-foreground">
                  La valoración, las fortalezas y los aspectos de mejora los generará la IA después
                  de analizar el currículum.
                </p>
              </section>

              {!evaluacionPreparada && (
                <p className="text-xs text-muted-foreground">
                  Regístrate y guarda el currículum para habilitar las exportaciones.
                </p>
              )}
              <div className="no-print flex flex-col gap-2 border-t pt-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={!evaluacionPreparada || isPending}
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" />
                  Exportar PDF
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={!evaluacionPreparada || isPending}
                  onClick={handleExportWord}
                >
                  <Download className="size-4" />
                  Descargar Word
                </Button>
              </div>
              <p className="no-print text-xs text-muted-foreground">
                La exportación PDF abre el diálogo de impresión; selecciona «Guardar como PDF».
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function ReportField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="min-h-5 whitespace-pre-wrap text-sm">{value || "Pendiente de completar."}</p>
    </div>
  );
}
