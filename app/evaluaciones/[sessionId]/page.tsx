import { notFound } from "next/navigation";
import Link from "next/link";
import { getEscapareteSession } from "@/lib/actions/actions";
import { ESCAPARATE_CASES } from "@/lib/escaparametro/cases";
import { EvaluarSessionButton } from "@/components/formularios/evaluar-session-button";
import { getAssetUrl } from "@/lib/utils";
import BotonQRGen from "@/components/boton-qrgen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Store,
} from "lucide-react";

export const metadata = {
  title: "Detalle de Evaluación | Escaparámetro",
  description: "Visualización y ejecución de la evaluación técnica de escaparate",
};

export default async function EvaluacionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getEscapareteSession(sessionId);

  if (!session) {
    return notFound();
  }

  const caseInfo = (ESCAPARATE_CASES as Record<string, { title: string; description: string }>)[
    session.casoId
  ];

  const totalScore = session.itemRubricas.reduce((acc, item) => acc + item.value, 0);
  const maxPossible = session.itemRubricas.length > 0 ? session.itemRubricas.length * 4 : 16;
  const percentage = Math.round((totalScore / maxPossible) * 100);

  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between">
          <Link
            href="/evaluaciones"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Volver al listado
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Store className="mr-1.5 h-4 w-4" />
            Nuevo Escaparate
          </Link>
        </div>

        {/* Encabezado Principal del Proyecto */}
        <Card className="border-muted shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Equipo: {session.equipo}
                </CardTitle>
                {session.evaluado ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Evaluado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 text-xs font-semibold">
                    <Clock className="h-3.5 w-3.5" /> Pendiente
                  </span>
                )}
              </div>
              <CardDescription className="text-sm">
                Caso:{" "}
                <span className="font-semibold text-foreground">
                  {caseInfo ? `${caseInfo.title} — ${caseInfo.description}` : session.casoId}
                </span>
              </CardDescription>
            </div>

            {/* Botón para lanzar o re-evaluar con IA */}
            <EvaluarSessionButton
              sessionId={session.id}
              evaluado={session.evaluado}
            />
          </CardHeader>
        </Card>

        {/* Contenido: Fotografía y Memoria Descriptiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fotografía */}
          <Card className="overflow-hidden border-muted shadow-sm flex flex-col">
            <CardHeader className="py-3 px-4 bg-muted/40 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Store className="h-4 w-4 text-primary" /> Fotografía del Escaparate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex items-center justify-center bg-black/5">
              <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted">
                <img
                  src={getAssetUrl(session.imagenPath)}
                  alt={`Escaparate de ${session.equipo}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Memoria descriptiva */}
          <Card className="border-muted shadow-sm flex flex-col">
            <CardHeader className="py-3 px-4 bg-muted/40 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" /> Memoria Descriptiva del Alumno
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {session.descripcion}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Resultados de la Rúbrica */}
        {session.evaluado && session.itemRubricas.length > 0 ? (
          <div className="space-y-4">
            {/* Resumen de puntuación total */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Puntuación Total Obtenida</h3>
                    <p className="text-sm text-muted-foreground">
                      Suma ponderada de los 4 criterios de la rúbrica oficial (escala 0 a 4)
                    </p>
                  </div>
                </div>
                <BotonQRGen
                  codigo={process.env.NEXT_PUBLIC_CODE || "2"}
                  actividad={process.env.NEXT_PUBLIC_TASK || "Escaparametro"}
                  puntos={totalScore}
                />
                <div className="text-right">
                  <div className="text-3xl font-extrabold tracking-tight text-primary">
                    {totalScore}{" "}
                    <span className="text-base font-medium text-muted-foreground">
                      / {maxPossible} pts ({percentage}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listado de items de la rúbrica */}
            <div className="grid grid-cols-1 gap-4">
              {session.itemRubricas.map((item) => (
                <Card key={item.id} className="border-muted shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          {item.name}
                        </CardTitle>
                        {item.description && (
                          <CardDescription className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm shrink-0">
                        Nota: {item.value} / 4
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm pt-2">
                    <div className="p-3 rounded-md bg-muted/50 border border-muted text-foreground/90 font-medium">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Nivel alcanzado:
                      </span>
                      {item.nivel}
                    </div>
                    <div className="p-3 rounded-md bg-background border border-border/60">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Justificación pedagógica / Retroalimentación:
                      </span>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {item.justification}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Estado cuando aún no se ha evaluado */
          <Card className="border-dashed border-2 p-8 text-center bg-muted/20">
            <CardContent className="space-y-4 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Escaparate listo para ser evaluado</h3>
              <p className="text-sm text-muted-foreground">
                Haz clic en el botón de evaluación para que Ollama analice la fotografía,
                la memoria descriptiva y genere el desglose según la rúbrica oficial.
              </p>
              <div className="pt-2 flex justify-center">
                <EvaluarSessionButton
                  sessionId={session.id}
                  evaluado={session.evaluado}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
