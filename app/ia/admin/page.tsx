import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logoutCVAdmin } from "@/lib/actions/cv-auth.action";
import { isCVAdminSessionValid } from "@/lib/cv/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Currículums por sector | Profesorado",
};

export default async function CVAdminPage() {
  if (!(await isCVAdminSessionValid())) redirect("/ia");

  const applicants = await prisma.cVApplicant.findMany({
    orderBy: [{ sector: "asc" }, { fullName: "asc" }],
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      sector: true,
      cvFilename: true,
      cvUploadedAt: true,
    },
  });

  const groups = new Map<string, typeof applicants>();
  for (const applicant of applicants) {
    const sector = applicant.sector || "Sin sector";
    groups.set(sector, [...(groups.get(sector) ?? []), applicant]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1f2_0,transparent_28rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
              CIPFP Ausiàs March
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
              Currículums <span className="text-red-700">por sector</span>
            </h1>
            <p className="text-muted-foreground">
              Sesión de profesorado · {applicants.length} currículum
              {applicants.length === 1 ? "" : "s"} registrado
              {applicants.length === 1 ? "" : "s"}
            </p>
          </div>
          <form action={logoutCVAdmin}>
            <Button type="submit" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </form>
        </header>

        {groups.size === 0 ? (
          <Card className="border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <CardContent className="py-10 text-center text-muted-foreground">
              Todavía no hay currículums registrados.
            </CardContent>
          </Card>
        ) : (
          [...groups.entries()].map(([sector, sectorApplicants]) => (
            <Card key={sector} className="overflow-hidden border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              <div className="h-1 w-full bg-red-700" />
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg text-neutral-950">
                  <Users className="size-5 text-red-700" />
                  {sector}
                  <span className="ml-auto rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    {sectorApplicants.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>CV</TableHead>
                      <TableHead>Subido</TableHead>
                      <TableHead className="text-right">Archivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectorApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">{applicant.fullName}</TableCell>
                        <TableCell>{applicant.username}</TableCell>
                        <TableCell>{applicant.email || "—"}</TableCell>
                        <TableCell className="max-w-48 truncate">{applicant.cvFilename}</TableCell>
                        <TableCell>
                          {applicant.cvUploadedAt.toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/api/cv/admin/download/${applicant.id}`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                            download
                          >
                            <Download className="size-3.5" />
                            Descargar
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
