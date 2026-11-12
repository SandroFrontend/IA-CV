import { NextRequest, NextResponse } from "next/server";
import { evaluarEscaparateSession } from "@/lib/actions/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = body?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "El parámetro 'sessionId' es obligatorio y debe ser un string válido." },
        { status: 400 }
      );
    }

    const result = await evaluarEscaparateSession(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en endpoint /api/escaparometro/evaluar:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
