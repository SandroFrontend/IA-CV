import { NextResponse } from "next/server";
import { isCVAdminSessionValid } from "@/lib/cv/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ applicantId: string }> },
) {
  if (!(await isCVAdminSessionValid())) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { applicantId } = await params;
  const applicant = await prisma.cVApplicant.findUnique({
    where: { id: applicantId },
    select: { cvFilename: true, cvData: true },
  });

  if (!applicant) {
    return new NextResponse("Currículum no encontrado", { status: 404 });
  }

  const safeFilename = applicant.cvFilename
    .replace(/[^\w.\u00C0-\u024F-]/g, "_")
    .replace(/\.{2,}/g, "_");

  return new NextResponse(new Uint8Array(applicant.cvData), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
