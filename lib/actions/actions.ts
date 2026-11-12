"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { isValidCaseId, ESCAPARATE_CASES } from "@/lib/escaparametro/cases";
import { RUBRIC_ITEMS } from "@/lib/escaparametro/rubrica";

export type FormState = {
  error?: string;
};

export async function submitEscaparate(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const equipo = formData.get("equipo")?.toString().trim();
  const casoId = formData.get("casoId")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const imagen = formData.get("imagen") as File | null;

  if (!equipo) {
    return { error: "El nombre del equipo es obligatorio." };
  }

  if (!casoId || !isValidCaseId(casoId)) {
    return { error: "Debe seleccionar un caso de escaparate válido." };
  }

  if (!descripcion) {
    return { error: "La descripción / memoria del escaparate es obligatoria." };
  }

  if (!imagen || !(imagen instanceof File) || imagen.size === 0) {
    return { error: "Debe adjuntar una imagen del escaparate." };
  }

  let sessionCreatedId: string;

  try {
    const bytes = await imagen.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "escaparates");
    await mkdir(uploadsDir, { recursive: true });

    const originalName = imagen.name || "imagen.jpg";
    const extension = path.extname(originalName) || ".jpg";
    const sanitizedBase = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);

    const uniqueId = crypto.randomBytes(4).toString("hex");
    const fileName = `escaparate-${Date.now()}-${uniqueId}-${sanitizedBase}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const imagenPath = `/uploads/escaparates/${fileName}`;

    const session = await prisma.escapareteSession.create({
      data: {
        equipo,
        casoId,
        descripcion,
        imagenPath,
      },
    });

    sessionCreatedId = session.id;
  } catch (error) {
    console.error("Error al procesar el escaparate:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al guardar el escaparate.",
    };
  }

  redirect(`/evaluaciones/${sessionCreatedId}`);
}

export async function getEscapareteSession(id: string) {
  try {
    return await prisma.escapareteSession.findUnique({
      where: { id },
      include: {
        itemRubricas: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener la sesión de escaparate:", error);
    return null;
  }
}

export async function saveEvaluacionSession(
  sessionId: string,
  scores: Array<{
    rubricaId?: string;
    name: string;
    description: string;
    value: number;
    nivel: string;
    justification: string;
  }>
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Reemplazar evaluaciones previas de la rúbrica si existían
      await tx.itemRubrica.deleteMany({
        where: { escaparametroSessionId: sessionId },
      });

      if (scores.length > 0) {
        await tx.itemRubrica.createMany({
          data: scores.map((s) => ({
            rubricaId: s.rubricaId,
            name: s.name,
            description: s.description,
            value: s.value,
            nivel: s.nivel,
            justification: s.justification,
            escaparametroSessionId: sessionId,
          })),
        });
      }

      return await tx.escapareteSession.update({
        where: { id: sessionId },
        data: {
          evaluado: true,
        },
        include: {
          itemRubricas: true,
        },
      });
    });
  } catch (error) {
    console.error("Error al guardar la evaluación de la sesión:", error);
    throw error;
  }
}

interface OllamaEvaluacionItem {
  rubricaId: string;
  value: number;
  nivel: string;
  justification: string;
}

interface OllamaEvaluationResponse {
  evaluaciones: OllamaEvaluacionItem[];
}

export interface EvaluarSessionResult {
  success: boolean;
  sessionId: string;
  error?: string;
}

/**
 * Evalúa una sesión de escaparate usando Ollama (modelo de visión)
 * y persiste las notas detalladas de la rúbrica en PostgreSQL con Prisma.
 *
 * @param sessionId ID único (UUID) de la sesión EscapareteSession
 * @returns {Promise<EvaluarSessionResult>} Objeto de resultado con éxito y sessionId
 */
export async function evaluarEscaparateSession(
  sessionId: string
): Promise<EvaluarSessionResult> {
  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("El parámetro 'sessionId' es obligatorio y debe ser un texto válido.");
  }

  // 1. Lectura de datos de la sesión
  const session = await prisma.escapareteSession.findUnique({
    where: { id: sessionId },
    include: {
      itemRubricas: true,
    },
  });

  if (!session) {
    throw new Error(`No se encontró la sesión de escaparate con ID: ${sessionId}`);
  }

  if (session.evaluado) {
    throw new Error("Esta sesión ya ha sido evaluada previamente.");
  }

  // 2. Lectura del archivo de imagen y conversión a Base64 (sin prefijo data:image/...)
  let base64Image: string;
  try {
    const cleanRelativePath = session.imagenPath.startsWith("/")
      ? session.imagenPath.slice(1)
      : session.imagenPath;
    const absoluteImagePath = path.join(process.cwd(), "public", cleanRelativePath);

    const imageBuffer = await readFile(absoluteImagePath);
    base64Image = imageBuffer.toString("base64");
  } catch (err) {
    console.error("Error al leer la imagen de la sesión:", err);
    throw new Error(
      `No se pudo leer la imagen del escaparate en el disco (${session.imagenPath}): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  // 3. Configuración y preparación de prompt para Ollama
  const baseUrl =
    process.env.OLLAMA_BASE_URL ||
    process.env.OLLAMA_API_URL ||
    "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2-vision";
  const numCtx = Number(process.env.NEXT_PUBLIC_NUM_CTX) || 8192;

  const caseInfo = (ESCAPARATE_CASES as Record<string, { title: string; description: string }>)[
    session.casoId
  ];
  const casoTexto = caseInfo
    ? `${caseInfo.title}: ${caseInfo.description}`
    : session.casoId;

  const rubricDescription = RUBRIC_ITEMS.map((item) => {
    const levelsDesc = item.levels
      .map((lvl) => `    - Puntuación ${lvl.score}: ${lvl.label}`)
      .join("\n");
    return `Criterio [${item.id}]: "${item.name}"
  Descripción: ${item.description}
  Niveles de puntuación oficiales:
${levelsDesc}`;
  }).join("\n\n");

  const prompt = `Eres un docente y experto evaluador técnico de Escaparatismo y Visual Merchandising en Formación Profesional (Comercio y Marketing).
Tu objetivo es evaluar con criterio pedagógico y constructivo el escaparate realizado por el alumnado.

---
INFORMACIÓN DEL PROYECTO:
- Equipo: ${session.equipo}
- Caso asignado: ${casoTexto}
- Memoria descriptiva / Justificación del alumno:
"${session.descripcion}"
---

RÚBRICA OFICIAL DE EVALUACIÓN:
${rubricDescription}

INSTRUCCIONES DE EVALUACIÓN:
1. Analiza minuciosamente la fotografía adjunta del escaparate y contrástala con el caso y la memoria descriptiva.
2. Evalúa OBLIGATORIAMENTE cada uno de los 4 criterios de la rúbrica usando sus IDs exactos:
   - "coherencia_concepto"
   - "composicion_visual"
   - "iluminacion_color"
   - "producto_llamada_accion"
3. Para cada criterio debes determinar:
   - "rubricaId": el id exacto del criterio.
   - "value": número entero entre 0 y 4 correspondiente a la escala.
   - "nivel": texto descriptivo del nivel alcanzado en la rúbrica.
   - "justification": explicación pedagógica fundamentada, mencionando detalles concretos observados en la fotografía y propuestas de mejora.

FORMATO DE RESPUESTA REQUERIDO:
Debes responder ÚNICAMENTE con un JSON válido respetando estrictamente esta estructura:
{
  "evaluaciones": [
    {
      "rubricaId": "coherencia_concepto",
      "value": 3,
      "nivel": "Buena correspondencia entre el texto y el escaparate...",
      "justification": "Explicación detallada orientada al aprendizaje..."
    }
  ]
}`;

  // 4. Llamada HTTP a Ollama con Structured Output (format: "json")
  let ollamaRawResponse: string;
  try {
    const ollamaResponse = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        images: [base64Image],
        stream: false,
        format: "json",
        think: false,
        options: {
          temperature: 0.2,
          num_ctx: numCtx,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errBody = await ollamaResponse.text().catch(() => "");
      throw new Error(
        `Ollama devolvió un código de estado ${ollamaResponse.status}: ${errBody || ollamaResponse.statusText}`
      );
    }

    const data = await ollamaResponse.json();
    ollamaRawResponse = data.response || data.thinking || "";
  } catch (fetchErr) {
    console.error("Error al conectar con la API de Ollama:", fetchErr);
    throw new Error(
      `Fallo en la comunicación con Ollama: ${
        fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
      }`
    );
  }

  // 5. Validación y parseo del JSON generado por Ollama
  let parsedJson: OllamaEvaluationResponse;
  try {
    const rawToParse = ollamaRawResponse.trim();
    // En caso de que contenga markdown ```json ... ``` extraerlo
    const jsonMatch = rawToParse.match(/\{[\s\S]*\}/);
    const textToParse = jsonMatch ? jsonMatch[0] : rawToParse;
    parsedJson = JSON.parse(textToParse);
  } catch (parseErr) {
    console.error("Error al parsear el JSON de Ollama. Contenido recibido:", ollamaRawResponse);
    throw new Error(
      `Ollama no devolvió un JSON parseable (${parseErr instanceof Error ? parseErr.message : String(parseErr)}). Respuesta recibida: ${ollamaRawResponse.slice(0, 300)}`
    );
  }

  if (
    !parsedJson ||
    !Array.isArray(parsedJson.evaluaciones) ||
    parsedJson.evaluaciones.length === 0
  ) {
    throw new Error(
      "La respuesta de Ollama no contiene la lista 'evaluaciones' con los criterios evaluados."
    );
  }

  // Mapear con las definiciones de la rúbrica
  const rubricMap = new Map(RUBRIC_ITEMS.map((item) => [item.id, item]));

  const rubricRecords = parsedJson.evaluaciones.map((evalItem) => {
    const def = rubricMap.get(evalItem.rubricaId);
    const name = def?.name ?? evalItem.rubricaId;
    const description = def?.description ?? "";
    const value = Math.max(0, Math.min(4, Math.round(Number(evalItem.value) || 0)));
    const nivel =
      evalItem.nivel ||
      (def?.levels.find((lvl) => lvl.score === value)?.label ?? "");
    const justification =
      evalItem.justification || "Sin justificación detallada proporcionada.";

    return {
      rubricaId: evalItem.rubricaId,
      name,
      description,
      value,
      nivel,
      justification,
      escaparametroSessionId: session.id,
    };
  });

  // 6. Persistencia en Base de Datos mediante transacción de Prisma
  try {
    await prisma.$transaction(async (tx) => {
      // Limpiar evaluaciones previas si existiesen
      await tx.itemRubrica.deleteMany({
        where: { escaparametroSessionId: session.id },
      });

      // Crear los registros en ItemRubrica
      await tx.itemRubrica.createMany({
        data: rubricRecords,
      });

      // Actualizar la sesión como evaluada
      await tx.escapareteSession.update({
        where: { id: session.id },
        data: {
          evaluado: true,
        },
      });
    });
  } catch (dbErr) {
    console.error("Error al persistir la evaluación en la base de datos:", dbErr);
    throw new Error(
      `Error de base de datos al guardar la evaluación: ${
        dbErr instanceof Error ? dbErr.message : String(dbErr)
      }`
    );
  }

  revalidatePath(`/evaluaciones/${session.id}`);
  revalidatePath("/evaluaciones");

  return {
    success: true,
    sessionId: session.id,
  };
}

export async function getAllEscapareteSessions() {
  try {
    return await prisma.escapareteSession.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        itemRubricas: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener las sesiones de escaparate:", error);
    return [];
  }
}

export async function deleteEscapareteSession(id: string) {
  try {
    const session = await prisma.escapareteSession.findUnique({
      where: { id },
      select: { imagenPath: true },
    });

    if (!session) {
      return { success: false, message: "La sesión no existe." };
    }

    // Al tener onDelete: Cascade en ItemRubrica, se eliminan los items y la sesión
    await prisma.$transaction(async (tx) => {
      await tx.itemRubrica.deleteMany({
        where: { escaparametroSessionId: id },
      });
      await tx.escapareteSession.delete({
        where: { id },
      });
    });

    // Limpiar el archivo de imagen del disco
    if (session.imagenPath) {
      try {
        const cleanPath = session.imagenPath.startsWith("/")
          ? session.imagenPath.slice(1)
          : session.imagenPath;
        const filePath = path.join(process.cwd(), "public", cleanPath);
        await unlink(filePath);
      } catch {
        // Ignorar si el archivo no existe en disco
      }
    }

    revalidatePath("/evaluaciones");
    return { success: true, message: "Sesión e ítems de rúbrica eliminados correctamente." };
  } catch (error) {
    console.error("Error al eliminar la sesión:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al eliminar la sesión.",
    };
  }
}
