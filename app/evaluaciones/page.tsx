import Link from "next/link";
import { getAllEscapareteSessions } from "@/lib/actions/actions";
import { ESCAPARATE_CASES } from "@/lib/escaparametro/cases";
import { getAssetUrl } from "@/lib/utils";
import { DeleteSessionDialog } from "@/components/formularios/delete-session-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle2, Clock, Plus, Store, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Histórico de Evaluaciones | Escaparámetro",
  description: "Listado de entregas y evaluaciones de proyectos de escaparate",
};

export default async function EvaluacionesPage() {
  const sessions = await getAllEscapareteSessions();

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-muted shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Evaluaciones de Escaparámetro
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Proyectos entregados por los equipos para evaluación técnica y pedagógica.
                </CardDescription>
              </div>
              <CardAction>
                <Link
                  href="/"
                  className={buttonVariants({ variant: "default" })}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Nueva Entrega
                </Link>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-3">
                <Store className="h-10 w-10 mx-auto text-muted-foreground/60" />
                <p className="text-base font-medium">No hay proyectos entregados todavía.</p>
                <Link href="/" className={buttonVariants({ variant: "outline" })}>
                  Crear la primera entrega
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {sessions.map((session) => {
                  const caseInfo = (ESCAPARATE_CASES as Record<string, { title: string }>)[
                    session.casoId
                  ];
                  const totalScore = session.itemRubricas.reduce(
                    (acc, item) => acc + item.value,
                    0
                  );
                  const maxScore =
                    session.itemRubricas.length > 0 ? session.itemRubricas.length * 4 : 16;

                  return (
                    <div
                      key={session.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 rounded-md overflow-hidden bg-muted shrink-0 border">
                          <img
                            src={getAssetUrl(session.imagenPath)}
                            alt={session.equipo}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-base">
                              {session.equipo}
                            </span>
                            {session.evaluado ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-xs font-semibold">
                                <CheckCircle2 className="h-3 w-3" /> Evaluado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-xs font-semibold">
                                <Clock className="h-3 w-3" /> Pendiente
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Caso: {caseInfo ? caseInfo.title : session.casoId} ·{" "}
                            {new Date(session.createdAt).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {session.evaluado && (
                            <p className="text-xs font-medium text-primary">
                              Puntuación: {totalScore} / {maxScore} pts
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/evaluaciones/${session.id}`}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                          Ver detalle
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                        <DeleteSessionDialog id={session.id} equipo={session.equipo} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
